import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createHabit, toggleHabit } from "./actions";
import { AppNav } from "@/components/app-nav";
import { getTodayDateKey, dateFromKey, addDays, dateKeyFromDate } from "@/lib/day";

export default async function HabitsPage(){
  const session=await auth.api.getSession({headers:await headers()});if(!session)redirect("/sign-in");
  const todayKey=getTodayDateKey(); const today=dateFromKey(todayKey); const start=addDays(today,-6);
  const habits=await prisma.habit.findMany({where:{userId:session.user.id,archived:false},include:{logs:{where:{date:{gte:start,lte:today}},orderBy:{date:"asc"}}},orderBy:{createdAt:"desc"}});
  return <div className="app-frame"><AppNav user={session.user}/><main className="app-main"><section className="page-hero"><p className="eyebrow">Habits</p><h1>Small things, repeated on purpose.</h1><p>Track lightweight routines without turning your life into a spreadsheet.</p></section>
    <div className="grid gap-5 xl:grid-cols-[.65fr_1.35fr]"><section className="card p-5 sm:p-7"><h2 className="text-xl font-semibold">New habit</h2><form action={createHabit} className="mt-5 space-y-4"><label className="text-sm"><span className="label">Habit</span><input name="name" required className="field" placeholder="Read for 20 minutes"/></label><label className="text-sm"><span className="label">Description</span><textarea name="description" rows={3} className="field resize-y" placeholder="Optional"/></label><label className="text-sm"><span className="label">Target per week</span><select name="targetPerWeek" defaultValue="7" className="field">{[1,2,3,4,5,6,7].map(n=><option key={n} value={n}>{n} day{n===1?"":"s"}</option>)}</select></label><button className="button-primary w-full">Add habit</button></form></section>
    <section className="space-y-4">{habits.length===0?<div className="card p-7"><p className="text-sm text-[var(--muted)]">No habits yet. Add one routine that is genuinely useful.</p></div>:habits.map(h=><article key={h.id} className="card p-5 sm:p-6"><div className="flex items-start justify-between gap-4"><div><h2 className="font-semibold">{h.name}</h2>{h.description&&<p className="mt-1 text-sm text-[var(--muted)]">{h.description}</p>}</div><span className="pill">{h.targetPerWeek}/week</span></div><div className="mt-5 grid grid-cols-7 gap-2">{Array.from({length:7},(_,i)=>{const d=addDays(today,i-6);const key=dateKeyFromDate(d);const log=h.logs.find(x=>dateKeyFromDate(x.date)===key);return <form action={toggleHabit} key={key}><input type="hidden" name="habitId" value={h.id}/><input type="hidden" name="date" value={key}/><button className={`w-full rounded-2xl border p-2 text-center transition ${log?.completed?"border-[var(--accent)] bg-[var(--accent)]/10":"border-[var(--border)] hover:bg-[var(--background)]"}`}><span className="block text-[10px] text-[var(--muted)]">{new Intl.DateTimeFormat("en-IN",{weekday:"short",timeZone:"UTC"}).format(d)}</span><span className="mt-1 block text-sm">{log?.completed?"✓":"·"}</span></button></form>})}</div></article>)}</section></div>
  </main></div>
}
