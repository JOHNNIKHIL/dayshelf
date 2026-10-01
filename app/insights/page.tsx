import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { addDays, getTodayDateKey, dateFromKey } from "@/lib/day";
import { AppNav } from "@/components/app-nav";
import { DailyVisuals } from "../today/daily-visuals";
import Link from "next/link";

export default async function InsightsPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/sign-in");
  const today = dateFromKey(getTodayDateKey());
  const start = addDays(today, -29);
  const days = await prisma.day.findMany({
    where: { userId: session.user.id, date: { gte: start, lte: today } },
    orderBy: { date: "asc" },
    include: { plans: { select: { completed: true } } },
  });
  const data = days.map((d) => ({
    date: d.date.toISOString().slice(0, 10), mood: d.mood, energy: d.energy, stress: d.stress,
    productivity: d.productivity, social: d.social, sleep: d.sleep,
    planTotal: d.plans.length, planDone: d.plans.filter((p) => p.completed).length,
  }));
  const active = data.filter((d) => d.mood || d.energy || d.stress || d.productivity || d.social || d.sleep || d.planTotal);
  const moodMap: Record<string, number> = { VERY_LOW: 1, LOW: 2, OKAY: 3, GOOD: 4, GREAT: 5 };
  const avg = (key: keyof typeof data[number]) => { const vals = data.map((d) => typeof d[key] === "number" ? d[key] as number : null).filter((v): v is number => v != null); return vals.length ? vals.reduce((a,b)=>a+b,0)/vals.length : null; };
  const moodVals = data.map(d=>d.mood?moodMap[d.mood]:null).filter((v):v is number=>v!=null);
  const planTotal = data.reduce((a,d)=>a+d.planTotal,0), planDone=data.reduce((a,d)=>a+d.planDone,0);
  const cards = [
    ["Mood", moodVals.length ? `${(moodVals.reduce((a,b)=>a+b,0)/moodVals.length).toFixed(1)}/5` : "—", "30-day average"],
    ["Energy", avg("energy") ? `${avg("energy")!.toFixed(1)}/5` : "—", "30-day average"],
    ["Stress", avg("stress") ? `${avg("stress")!.toFixed(1)}/5` : "—", "lower is calmer"],
    ["Productivity", avg("productivity") ? `${avg("productivity")!.toFixed(1)}/5` : "—", "30-day average"],
    ["Social", avg("social") ? `${avg("social")!.toFixed(1)}/5` : "—", "30-day average"],
    ["Sleep", avg("sleep") ? `${avg("sleep")!.toFixed(1)}/5` : "—", "30-day average"],
  ];
  return <div className="app-frame"><AppNav user={session.user}/><main className="app-main">
    <section className="page-hero animate-rise"><p className="eyebrow">Insights</p><h1>Your days, made visible.</h1><p>Patterns across mood, energy, stress, productivity, social life, sleep and intentions. Descriptive, not diagnostic.</p></section>
    <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 motion-stagger">
      {cards.map(([label,value,caption])=><div className="card p-4" key={label}><p className="text-xs text-[var(--muted)]">{label}</p><p className="mt-2 text-2xl font-bold tracking-tight">{value}</p><p className="mt-1 text-[11px] text-[var(--muted)]">{caption}</p></div>)}
    </section>
    <div className="mt-6"><DailyVisuals days={data}/></div>
    <section className="mt-6 grid gap-5 lg:grid-cols-3">
      <div className="card p-5"><p className="eyebrow">Consistency</p><p className="mt-2 text-3xl font-bold">{active.length}<span className="ml-1 text-sm font-normal text-[var(--muted)]">active days</span></p><p className="mt-2 text-sm text-[var(--muted)]">Days with at least one meaningful journal signal in the last 30 days.</p></div>
      <div className="card p-5"><p className="eyebrow">Intentions</p><p className="mt-2 text-3xl font-bold">{planTotal ? Math.round(planDone/planTotal*100) : 0}%</p><p className="mt-2 text-sm text-[var(--muted)]">{planDone} of {planTotal} planned items completed.</p></div>
      <div className="card p-5"><p className="eyebrow">Keep exploring</p><p className="mt-2 text-lg font-semibold">Make the archive richer.</p><p className="mt-2 text-sm text-[var(--muted)]">Goals, habits, calendar and daily journaling work together to give context to these charts.</p><Link href="/calendar" className="subtle-link mt-4 inline-block">Open calendar →</Link></div>
    </section>
  </main></div>;
}
