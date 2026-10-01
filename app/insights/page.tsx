import Link from "next/link";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { addDays, dateFromKey, dateKeyFromDate, formatMonth, getTodayDateKey } from "@/lib/day";
import type { Mood } from "@/generated/prisma/client";

const moodScore: Record<Mood, number> = { VERY_LOW: 1, LOW: 2, OKAY: 3, GOOD: 4, GREAT: 5 };
const moodLabel: Record<Mood, string> = { VERY_LOW: "Very low", LOW: "Low", OKAY: "Okay", GOOD: "Good", GREAT: "Great" };
const moodEmoji: Record<Mood, string> = { VERY_LOW: "😞", LOW: "😕", OKAY: "😐", GOOD: "🙂", GREAT: "😄" };

function average(values: Array<number | null | undefined>) {
  const usable = values.filter((value): value is number => typeof value === "number");
  return usable.length ? usable.reduce((sum, value) => sum + value, 0) / usable.length : null;
}

function activeDay(day: { title: string | null; thoughts: string | null; mood: Mood | null; events: unknown[]; plans: unknown[] }) {
  return Boolean(day.title || day.thoughts || day.mood || day.events.length || day.plans.length);
}

export default async function InsightsPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/sign-in");

  const todayKey = getTodayDateKey();
  const today = dateFromKey(todayKey);
  const start = addDays(today, -30);
  const days = await prisma.day.findMany({
    where: { userId: session.user.id, date: { gte: start, lte: today } },
    orderBy: { date: "asc" },
    include: { events: { select: { id: true } }, plans: { select: { completed: true } } },
  });

  const last7 = days.filter((day) => day.date >= addDays(today, -6));
  const monthKey = todayKey.slice(0, 7);
  const monthDays = days.filter((day) => dateKeyFromDate(day.date).startsWith(monthKey));
  const activeDays = days.filter(activeDay);
  const monthActiveDays = monthDays.filter(activeDay);
  const plans = days.flatMap((day) => day.plans);
  const completedPlans = plans.filter((plan) => plan.completed).length;
  const moodDays = days.filter((day): day is typeof day & { mood: Mood } => Boolean(day.mood));
  const averageMood = average(moodDays.map((day) => moodScore[day.mood]));
  const averageEnergy = average(days.map((day) => day.energy));
  const averageStress = average(days.map((day) => day.stress));
  const averageProductivity = average(days.map((day) => day.productivity));

  let streak = 0;
  for (let cursor = today; ; cursor = addDays(cursor, -1)) {
    const key = dateKeyFromDate(cursor);
    const day = days.find((item) => dateKeyFromDate(item.date) === key);
    if (!day || !activeDay(day)) break;
    streak += 1;
  }

  const moodCounts = Object.entries(moodScore).map(([mood, score]) => ({ mood: mood as Mood, score, count: moodDays.filter((day) => day.mood === mood).length }));
  const maxMoodCount = Math.max(1, ...moodCounts.map((item) => item.count));

  return (
    <main className="min-h-screen px-5 py-6 sm:px-8 lg:px-10">
      <div className="mx-auto max-w-6xl">
        <header className="flex items-center justify-between border-b border-[var(--border)] pb-5">
          <Link href="/dashboard" className="font-semibold tracking-tight">DayShelf</Link>
          <div className="flex items-center gap-2">
            <Link href="/calendar" className="rounded-full border border-[var(--border)] px-4 py-2 text-sm">Calendar</Link>
            <Link href="/today" className="rounded-full bg-[var(--accent)] px-4 py-2 text-sm font-medium text-white">Open today</Link>
          </div>
        </header>

        <section className="py-10">
          <p className="text-sm uppercase tracking-[0.2em] text-[var(--accent)]">Reflection</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">Notice your days.</h1>
          <p className="mt-4 max-w-2xl text-[var(--muted)]">A lightweight view of the last 31 days. DayShelf shows patterns from what you recorded without trying to tell you what they mean.</p>
        </section>

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ["Active days", `${monthActiveDays.length}`, "this month"],
            ["Current streak", `${streak}`, streak === 1 ? "day" : "days"],
            ["Mood average", averageMood ? `${averageMood.toFixed(1)}/5` : "—", "recorded moods"],
            ["Plan completion", plans.length ? `${Math.round(completedPlans / plans.length * 100)}%` : "—", `${completedPlans}/${plans.length} completed`],
          ].map(([label, value, note]) => <div key={label} className="card p-5"><p className="text-sm text-[var(--muted)]">{label}</p><p className="mt-2 text-3xl font-semibold">{value}</p><p className="mt-2 text-xs text-[var(--muted)]">{note}</p></div>)}
        </section>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1.15fr_.85fr]">
          <section className="card p-5 sm:p-7">
            <div><h2 className="text-xl font-semibold">Mood distribution</h2><p className="mt-1 text-sm text-[var(--muted)]">Recorded moods over the last 31 days.</p></div>
            <div className="mt-7 space-y-4">
              {moodCounts.map((item) => <div key={item.mood} className="grid grid-cols-[90px_1fr_35px] items-center gap-3"><span className="text-sm">{moodEmoji[item.mood]} {moodLabel[item.mood]}</span><div className="h-2 overflow-hidden rounded-full bg-[var(--border)]"><div className="h-full rounded-full bg-[var(--accent)]" style={{ width: `${item.count / maxMoodCount * 100}%` }} /></div><span className="text-right text-xs text-[var(--muted)]">{item.count}</span></div>)}
            </div>
          </section>

          <section className="card p-5 sm:p-7">
            <h2 className="text-xl font-semibold">Life metrics</h2>
            <p className="mt-1 text-sm text-[var(--muted)]">Average of the 1–5 ratings you recorded.</p>
            <div className="mt-6 space-y-4">
              {[['Energy', averageEnergy], ['Stress', averageStress], ['Productivity', averageProductivity], ['Social', average(days.map((day) => day.social))], ['Sleep', average(days.map((day) => day.sleep))]].map(([label, value]) => <div key={label as string}><div className="flex justify-between text-sm"><span>{label as string}</span><span className="text-[var(--muted)]">{typeof value === 'number' ? `${value.toFixed(1)}/5` : '—'}</span></div><div className="mt-2 h-2 overflow-hidden rounded-full bg-[var(--border)]"><div className="h-full rounded-full bg-[var(--accent)]" style={{ width: `${typeof value === 'number' ? value / 5 * 100 : 0}%` }} /></div></div>)}
            </div>
          </section>
        </div>

        <section className="card mt-6 p-5 sm:p-7">
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end"><div><h2 className="text-xl font-semibold">Last 7 days</h2><p className="mt-1 text-sm text-[var(--muted)]">A quick view of how consistently you captured the week.</p></div><Link href={`/calendar?month=${monthKey}`} className="text-sm text-[var(--accent)]">Open calendar →</Link></div>
          <div className="mt-7 grid grid-cols-7 gap-2 sm:gap-3">
            {Array.from({ length: 7 }, (_, index) => {
              const date = addDays(today, index - 6);
              const key = dateKeyFromDate(date);
              const day = last7.find((item) => dateKeyFromDate(item.date) === key);
              return <Link key={key} href={`/today?date=${key}`} className="rounded-2xl border border-[var(--border)] p-2 text-center transition hover:bg-[var(--accent)]/5 sm:p-3"><p className="text-[10px] uppercase text-[var(--muted)]">{new Intl.DateTimeFormat('en-IN', { weekday: 'short', timeZone: 'UTC' }).format(date)}</p><p className="mt-2 text-sm font-semibold">{date.getUTCDate()}</p><p className="mt-2 text-lg">{day?.mood ? moodEmoji[day.mood] : '·'}</p></Link>;
            })}
          </div>
        </section>

        <p className="mt-5 text-xs text-[var(--muted)]">These summaries are descriptive, not diagnoses or recommendations. You control what you record and how you interpret it.</p>
      </div>
    </main>
  );
}
