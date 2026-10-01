import Link from "next/link";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { dateFromKey, getTodayDateKey } from "@/lib/day";
import { SignOutButton } from "./sign-out-button";

const moodLabels = { VERY_LOW:"Very low", LOW:"Low", OKAY:"Okay", GOOD:"Good", GREAT:"Great" };

export default async function DashboardPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/sign-in");
  const today = await prisma.day.findUnique({ where:{ userId_date:{ userId:session.user.id, date:dateFromKey(getTodayDateKey()) } }, include:{ events:{orderBy:{sortOrder:"asc"},take:3}, plans:{orderBy:[{completed:"asc"},{priority:"asc"}],take:5} } });
  const completed = today?.plans.filter(p=>p.completed).length ?? 0;
  const total = today?.plans.length ?? 0;
  return <main className="min-h-screen px-5 py-7 sm:px-8 lg:px-10"><div className="mx-auto max-w-6xl">
    <header className="flex items-center justify-between border-b border-[var(--border)] pb-5"><Link href="/" className="font-semibold tracking-tight">DayShelf</Link><div className="flex items-center gap-2"><Link href="/today" className="rounded-full bg-[var(--accent)] px-4 py-2 text-sm font-medium text-white">Open today</Link><SignOutButton/></div></header>
    <section className="py-10"><p className="text-sm uppercase tracking-[0.2em] text-[var(--accent)]">Your shelf</p><h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">Good to see you, {session.user.name}.</h1><p className="mt-4 max-w-2xl text-[var(--muted)]">Your personal day archive is ready. Capture the important bits now; the deeper calendar and memory layers come later.</p></section>
    <div className="grid gap-5 lg:grid-cols-3">
      <Link href="/today" className="card p-6 transition hover:-translate-y-0.5"><p className="text-sm text-[var(--muted)]">Today</p><h2 className="mt-2 text-2xl font-semibold">{today?.mood ? moodLabels[today.mood] : "Start your day"}</h2><p className="mt-6 text-sm text-[var(--muted)]">{today?.events.length ?? 0} moments · {total ? `${completed}/${total} plans complete` : "no plans yet"}</p></Link>
      <div className="card p-6"><p className="text-sm text-[var(--muted)]">Recent moments</p><div className="mt-4 space-y-3">{today?.events.length ? today.events.map(e=><div key={e.id} className="flex gap-3 text-sm"><span className="w-12 shrink-0 text-[var(--muted)]">{e.time||"—"}</span><span>{e.title}</span></div>) : <p className="text-sm text-[var(--muted)]">Your timeline is empty.</p>}</div></div>
      <div className="card p-6"><p className="text-sm text-[var(--muted)]">Plans</p><div className="mt-4 space-y-3">{today?.plans.length ? today.plans.map(p=><div key={p.id} className={`text-sm ${p.completed?'text-[var(--muted)] line-through':''}`}>{p.completed?'✓ ':''}{p.title}</div>) : <p className="text-sm text-[var(--muted)]">Add a few intentions for today.</p>}</div></div>
    </div>
    <div className="mt-6 grid gap-5 sm:grid-cols-3"><div className="card p-5"><p className="text-sm text-[var(--muted)]">Calendar</p><h2 className="mt-2 text-lg font-medium">Coming next</h2><p className="mt-3 text-sm text-[var(--muted)]">Monthly navigation and mood indicators.</p></div><div className="card p-5"><p className="text-sm text-[var(--muted)]">Reflections</p><h2 className="mt-2 text-lg font-medium">Coming next</h2><p className="mt-3 text-sm text-[var(--muted)]">Weekly and monthly patterns from your days.</p></div><div className="card p-5"><p className="text-sm text-[var(--muted)]">Memories</p><h2 className="mt-2 text-lg font-medium">Later</h2><p className="mt-3 text-sm text-[var(--muted)]">Search, tags, attachments and On this day.</p></div></div>
  </div></main>;
}
