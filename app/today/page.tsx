import Link from "next/link";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { addDays, dateFromKey, formatDate, getTodayDateKey, isDateKey } from "@/lib/day";
import { TodayEditor } from "./today-editor";

type TodayPageProps = { searchParams: Promise<{ date?: string }> };

export default async function TodayPage({ searchParams }: TodayPageProps) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/sign-in");

  const params = await searchParams;
  const requestedDate = params.date && isDateKey(params.date) ? params.date : getTodayDateKey();
  const date = dateFromKey(requestedDate);
  const todayKey = getTodayDateKey();
  const day = await prisma.day.upsert({
    where: { userId_date: { userId: session.user.id, date } },
    create: { userId: session.user.id, date },
    update: {},
    include: {
      events: { orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }] },
      plans: { orderBy: [{ completed: "asc" }, { priority: "asc" }] },
    },
  });

  const previousKey = addDays(date, -1).toISOString().slice(0, 10);
  const nextKey = addDays(date, 1).toISOString().slice(0, 10);
  const isToday = requestedDate === todayKey;

  return (
    <main className="min-h-screen px-5 py-6 sm:px-8 lg:px-10">
      <div className="mx-auto max-w-6xl">
        <header className="flex items-center justify-between border-b border-[var(--border)] pb-5">
          <Link href="/dashboard" className="font-semibold tracking-tight">DayShelf</Link>
          <div className="flex items-center gap-2">
            <Link href="/calendar" className="rounded-full border border-[var(--border)] px-4 py-2 text-sm">Calendar</Link>
            <Link href="/dashboard" className="rounded-full border border-[var(--border)] px-4 py-2 text-sm">Dashboard</Link>
          </div>
        </header>

        <section className="py-10">
          <p className="text-sm uppercase tracking-[0.2em] text-[var(--accent)]">{isToday ? "Today" : "Journal day"}</p>
          <div className="mt-2 flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
            <div>
              <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">{formatDate(day.date)}</h1>
              <p className="mt-3 text-[var(--muted)]">Record what happened, how it felt, and what matters next.</p>
            </div>
            <nav className="flex items-center gap-2" aria-label="Day navigation">
              <Link href={`/today?date=${previousKey}`} className="rounded-full border border-[var(--border)] px-3 py-2 text-sm">← Previous</Link>
              {!isToday && <Link href="/today" className="rounded-full border border-[var(--border)] px-3 py-2 text-sm">Today</Link>}
              <Link href={`/today?date=${nextKey}`} className="rounded-full border border-[var(--border)] px-3 py-2 text-sm">Next →</Link>
            </nav>
          </div>
        </section>

        <TodayEditor day={day} dateKey={requestedDate} />
      </div>
    </main>
  );
}
