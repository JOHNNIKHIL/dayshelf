import Link from "next/link";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { dateFromKey, getTodayDateKey, addDays, dateKeyFromDate } from "@/lib/day";
import { AppNav } from "@/components/app-nav";

const moodEmoji={VERY_LOW:"😞",LOW:"😕",OKAY:"😐",GOOD:"🙂",GREAT:"😄"} as const;

export default async function DashboardPage(){
  const session=await auth.api.getSession({headers:await headers()});if(!session)redirect("/sign-in");
  const todayKey=getTodayDateKey(); const today=await prisma.day.findUnique({where:{userId_date:{userId:session.user.id,date:dateFromKey(todayKey)}},include:{events:{orderBy:{sortOrder:"asc"},take:4},plans:{orderBy:[{completed:"asc"},{priority:"asc"}],take:6}}});
  const goals=await prisma.goal.findMany({where:{userId:session.user.id,status:"ACTIVE"},include:{milestones:true},orderBy:{updatedAt:"desc"},take:3});
  const habits=await prisma.habit.findMany({where:{userId:session.user.id,archived:false},include:{logs:{where:{date:dateFromKey(todayKey)}}},take:4});
  const done=today?.plans.filter(p=>p.completed).length??0; const total=today?.plans.length??0;
  const weekStart=addDays(dateFromKey(todayKey),-6); const week=await prisma.day.count({where:{userId:session.user.id,date:{gte:weekStart,lte:dateFromKey(todayKey)}}});
  return <div className="app-frame"><AppNav user={session.user}/><main className="app-main">
    <section className="page-hero"><p className="eyebrow">Thursday · {new Intl.DateTimeFormat("en-IN",{month:"long",day:"numeric",year:"numeric",timeZone:"UTC"}).format(dateFromKey(todayKey))}</p><h1>Good to see you, {session.user.name.split(" ")[0]}.</h1><p>Your life doesn't need another productivity dashboard. DayShelf keeps the day, the plan and the bigger picture in one quiet place.</p></section>
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <Link href="/today" className="card p-5 transition hover:-translate-y-0.5"><p className="text-xs uppercase tracking-wider text-[var(--muted)]">Today</p><div className="mt-4 flex items-end justify-between"><h2 className="text-2xl font-semibold">{today?.mood?moodEmoji[today.mood]:"Start"}</h2><span className="text-xs text-[var(--muted)]">{today?.title||"Write your day"}</span></div></Link>
      <Link href="/planning" className="card p-5 transition hover:-translate-y-0.5"><p className="text-xs uppercase tracking-wider text-[var(--muted)]">This month</p><h2 className="mt-4 text-2xl font-semibold">Plan with intent</h2><p className="mt-2 text-xs text-[var(--muted)]">Monthly objectives → daily actions</p></Link>
      <Link href="/goals" className="card p-5 transition hover:-translate-y-0.5"><p className="text-xs uppercase tracking-wider text-[var(--muted)]">Direction</p><h2 className="mt-4 text-2xl font-semibold">{goals.length} active goals</h2><p className="mt-2 text-xs text-[var(--muted)]">Keep the important visible</p></Link>
      <Link href="/insights" className="card p-5 transition hover:-translate-y-0.5"><p className="text-xs uppercase tracking-wider text-[var(--muted)]">Archive</p><h2 className="mt-4 text-2xl font-semibold">{week} captured days</h2><p className="mt-2 text-xs text-[var(--muted)]">Last 7 days</p></Link>
    </section>
    <div className="mt-5 grid gap-5 xl:grid-cols-[1.2fr_.8fr]">
      <section className="card p-5 sm:p-7"><div className="flex items-end justify-between"><div><p className="eyebrow">Today</p><h2 className="mt-2 text-2xl font-semibold">{today?.title||"Give today a name"}</h2></div><Link href="/today" className="text-sm text-[var(--accent)]">Open day →</Link></div>
        <div className="mt-7 grid gap-3 sm:grid-cols-2">{today?.events.length?today.events.map(e=><div key={e.id} className="rounded-2xl border border-[var(--border)] p-4"><p className="text-xs text-[var(--muted)]">{e.time||"Moment"}</p><p className="mt-1 font-medium">{e.title}</p></div>):<Link href="/today" className="rounded-2xl border border-dashed border-[var(--border)] p-5 text-sm text-[var(--muted)] hover:bg-[var(--background)]">Your timeline is empty. Capture one moment.</Link>}</div>
      </section>
      <section className="card p-5 sm:p-7"><div className="flex justify-between"><div><p className="eyebrow">Today's plans</p><h2 className="mt-2 text-xl font-semibold">{total?`${done}/${total} complete`:"Nothing planned yet"}</h2></div><Link href="/today" className="text-sm text-[var(--accent)]">Edit →</Link></div><div className="mt-6 space-y-2">{today?.plans.length?today.plans.map(p=><div key={p.id} className={`rounded-xl border border-[var(--border)] px-3 py-2.5 text-sm ${p.completed?"text-[var(--muted)] line-through":""}`}>{p.completed?"✓ ":""}{p.title}</div>):<p className="text-sm leading-6 text-[var(--muted)]">Add two or three things you would be glad to finish today.</p>}</div></section>
    </div>
    <section className="mt-5 grid gap-5 lg:grid-cols-2">
      <div className="card p-5 sm:p-7"><div className="flex justify-between"><div><p className="eyebrow">Goals</p><h2 className="mt-2 text-xl font-semibold">Keep moving the bigger things</h2></div><Link href="/goals" className="text-sm text-[var(--accent)]">Manage →</Link></div><div className="mt-5 space-y-3">{goals.length?goals.map(g=>{const d=g.milestones.filter(m=>m.status==="COMPLETED").length;return <Link key={g.id} href={`/goals/${g.id}`} className="block rounded-2xl border border-[var(--border)] p-4"><div className="flex justify-between gap-3"><span className="font-medium">{g.title}</span><span className="text-xs text-[var(--muted)]">{d}/{g.milestones.length}</span></div><div className="mt-3 h-1.5 rounded-full bg-[var(--border)]"><div className="h-full rounded-full bg-[var(--accent)]" style={{width:`${g.milestones.length?d/g.milestones.length*100:0}%`}}/></div></Link>}):<Link href="/goals" className="text-sm text-[var(--muted)]">Create your first goal →</Link>}</div></div>
      <div className="card p-5 sm:p-7"><div className="flex justify-between"><div><p className="eyebrow">Habits</p><h2 className="mt-2 text-xl font-semibold">A few things worth repeating</h2></div><Link href="/habits" className="text-sm text-[var(--accent)]">Manage →</Link></div><div className="mt-5 space-y-2">{habits.length?habits.map(h=><div key={h.id} className="flex items-center justify-between rounded-2xl border border-[var(--border)] p-4"><span className="text-sm">{h.name}</span><span className="text-sm text-[var(--accent)]">{h.logs[0]?.completed?"✓ Done":"Today"}</span></div>):<Link href="/habits" className="text-sm text-[var(--muted)]">Add a habit →</Link>}</div></div>
    </section>
  </main></div>
}
