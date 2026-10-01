import Link from "next/link";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { dateFromKey, formatDate, getTodayDateKey } from "@/lib/day";
import { TodayEditor } from "./today-editor";

export default async function TodayPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/sign-in");

  const dateKey = getTodayDateKey();
  const day = await prisma.day.upsert({
    where: { userId_date: { userId: session.user.id, date: dateFromKey(dateKey) } },
    create: { userId: session.user.id, date: dateFromKey(dateKey) },
    update: {},
    include: { events: { orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }] }, plans: { orderBy: [{ completed: "asc" }, { priority: "asc" }] } },
  });

  return <main className="min-h-screen px-5 py-6 sm:px-8 lg:px-10"><div className="mx-auto max-w-6xl">
    <header className="flex items-center justify-between border-b border-[var(--border)] pb-5"><Link href="/dashboard" className="font-semibold tracking-tight">DayShelf</Link><Link href="/dashboard" className="rounded-full border border-[var(--border)] px-4 py-2 text-sm">Dashboard</Link></header>
    <section className="py-10"><p className="text-sm uppercase tracking-[0.2em] text-[var(--accent)]">Today</p><div className="mt-2 flex flex-col justify-between gap-3 sm:flex-row sm:items-end"><div><h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">{formatDate(day.date)}</h1><p className="mt-3 text-[var(--muted)]">A small place to record what happened, how it felt, and what matters next.</p></div></div></section>
    <TodayEditor day={day} dateKey={dateKey} />
  </div></main>;
}
