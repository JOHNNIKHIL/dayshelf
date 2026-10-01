import Link from "next/link";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  addDays,
  dateFromKey,
  dateKeyFromDate,
  getTodayDateKey,
  isMonthKey,
  monthKeyFromDate,
  monthStartFromKey,
  formatMonth,
} from "@/lib/day";
import type { Mood } from "@/generated/prisma/client";

const moodEmoji: Record<Mood, string> = {
  VERY_LOW: "😞",
  LOW: "😕",
  OKAY: "😐",
  GOOD: "🙂",
  GREAT: "😄",
};

function shiftMonth(month: Date, amount: number) {
  const next = new Date(month);
  next.setUTCMonth(next.getUTCMonth() + amount);
  return next;
}

export default async function CalendarPage({ searchParams }: { searchParams: Promise<{ month?: string }> }) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/sign-in");

  const params = await searchParams;
  const todayKey = getTodayDateKey();
  const requestedMonth = params.month && isMonthKey(params.month) ? params.month : todayKey.slice(0, 7);
  const month = monthStartFromKey(requestedMonth);
  const nextMonth = shiftMonth(month, 1);
  const previousMonth = shiftMonth(month, -1);
  const gridStart = addDays(month, -(month.getUTCDay() === 0 ? 6 : month.getUTCDay() - 1));
  const gridEnd = addDays(gridStart, 41);

  const days = await prisma.day.findMany({
    where: {
      userId: session.user.id,
      date: { gte: gridStart, lte: gridEnd },
    },
    select: { date: true, mood: true, title: true, events: { select: { id: true }, take: 1 } },
  });

  const byDate = new Map(days.map((day) => [dateKeyFromDate(day.date), day]));
  const cells = Array.from({ length: 42 }, (_, index) => addDays(gridStart, index));

  return (
    <main className="min-h-screen px-5 py-6 sm:px-8 lg:px-10">
      <div className="mx-auto max-w-6xl">
        <header className="flex items-center justify-between border-b border-[var(--border)] pb-5">
          <Link href="/dashboard" className="font-semibold tracking-tight">DayShelf</Link>
          <div className="flex items-center gap-2">
            <Link href="/today" className="rounded-full bg-[var(--accent)] px-4 py-2 text-sm font-medium text-white">Open today</Link>
            <Link href="/dashboard" className="rounded-full border border-[var(--border)] px-4 py-2 text-sm">Dashboard</Link>
          </div>
        </header>

        <section className="py-10">
          <p className="text-sm uppercase tracking-[0.2em] text-[var(--accent)]">Your calendar</p>
          <div className="mt-3 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h1 className="text-4xl font-semibold tracking-tight">{formatMonth(month)}</h1>
              <p className="mt-2 text-[var(--muted)]">Every day becomes a doorway back into your archive.</p>
            </div>
            <div className="flex items-center gap-2">
              <Link href={`/calendar?month=${monthKeyFromDate(previousMonth)}`} className="rounded-full border border-[var(--border)] px-3 py-2 text-sm">←</Link>
              <Link href="/calendar" className="rounded-full border border-[var(--border)] px-4 py-2 text-sm">This month</Link>
              <Link href={`/calendar?month=${monthKeyFromDate(nextMonth)}`} className="rounded-full border border-[var(--border)] px-3 py-2 text-sm">→</Link>
            </div>
          </div>
        </section>

        <section className="card overflow-hidden">
          <div className="grid grid-cols-7 border-b border-[var(--border)]">
            {['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map((day) => <div key={day} className="p-3 text-center text-xs font-medium uppercase tracking-wider text-[var(--muted)] sm:p-4">{day}</div>)}
          </div>
          <div className="grid grid-cols-7">
            {cells.map((date) => {
              const key = dateKeyFromDate(date);
              const entry = byDate.get(key);
              const inMonth = date.getUTCMonth() === month.getUTCMonth();
              const isToday = key === todayKey;
              return (
                <Link key={key} href={`/today?date=${key}`} className={`min-h-24 border-b border-r border-[var(--border)] p-2 transition hover:bg-[var(--accent)]/5 sm:min-h-32 sm:p-3 ${inMonth ? '' : 'opacity-35'}`}>
                  <div className="flex items-start justify-between gap-1">
                    <span className={`grid size-7 place-items-center rounded-full text-sm ${isToday ? 'bg-[var(--accent)] text-white' : ''}`}>{date.getUTCDate()}</span>
                    {entry?.mood && <span className="text-base" title={entry.mood}>{moodEmoji[entry.mood]}</span>}
                  </div>
                  {entry?.title && <p className="mt-3 line-clamp-2 text-xs font-medium sm:text-sm">{entry.title}</p>}
                  {entry?.events.length ? <p className="mt-2 text-[11px] text-[var(--muted)]">Timeline entry</p> : null}
                </Link>
              );
            })}
          </div>
        </section>

        <div className="mt-5 flex flex-wrap gap-3 text-xs text-[var(--muted)]">
          <span>😄 Great</span><span>🙂 Good</span><span>😐 Okay</span><span>😕 Low</span><span>😞 Very low</span>
        </div>
      </div>
    </main>
  );
}
