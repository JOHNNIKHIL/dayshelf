import Link from "next/link";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createGoal, updateGoalStatus } from "./actions";
import { AppNav } from "@/components/app-nav";

export default async function GoalsPage(){
  const session=await auth.api.getSession({headers:await headers()}); if(!session) redirect("/sign-in");
  const goals=await prisma.goal.findMany({where:{userId:session.user.id},include:{milestones:true},orderBy:[{status:"asc"},{createdAt:"desc"}]});
  const active=goals.filter(g=>g.status==="ACTIVE");
  return <div className="app-frame"><AppNav user={session.user}/><main className="app-main"><section className="page-hero"><p className="eyebrow">Goals</p><h1>Give the important things somewhere to go.</h1><p>Goals hold the bigger direction. Milestones turn that direction into visible progress.</p></section>
    <div className="grid gap-5 xl:grid-cols-[.75fr_1.25fr]">
      <section className="card p-5 sm:p-7"><h2 className="text-xl font-semibold">New goal</h2><form action={createGoal} className="mt-5 space-y-4"><label className="text-sm"><span className="label">Goal</span><input name="title" required className="field" placeholder="e.g. Finish my research paper"/></label><label className="text-sm"><span className="label">Description</span><textarea name="description" rows={4} className="field resize-y" placeholder="Why does this matter?"/></label><label className="text-sm"><span className="label">Target date</span><input name="targetDate" type="date" className="field"/></label><button className="button-primary w-full">Create goal</button></form></section>
      <section className="space-y-4">{goals.length===0?<div className="card p-7"><p className="text-sm text-[var(--muted)]">No goals yet. Start with one thing you genuinely want to move forward.</p></div>:goals.map(g=>{const done=g.milestones.filter(m=>m.status==="COMPLETED").length; const pct=g.milestones.length?Math.round(done/g.milestones.length*100):0; return <article key={g.id} className="card p-5 sm:p-7"><div className="flex flex-col justify-between gap-3 sm:flex-row"><div><div className="flex items-center gap-2"><span className={`status status-${g.status.toLowerCase()}`}>{g.status}</span>{g.targetDate&&<span className="text-xs text-[var(--muted)]">Target {g.targetDate.toISOString().slice(0,10)}</span>}</div><Link href={`/goals/${g.id}`} className="mt-2 block text-xl font-semibold hover:text-[var(--accent)]">{g.title}</Link>{g.description&&<p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--muted)]">{g.description}</p>}</div><div className="flex items-start gap-2">{g.status!=="COMPLETED"&&<form action={updateGoalStatus}><input type="hidden" name="goalId" value={g.id}/><input type="hidden" name="status" value="COMPLETED"/><button className="rounded-full border border-[var(--border)] px-3 py-1.5 text-xs">Complete</button></form>}</div></div><div className="mt-6"><div className="flex justify-between text-xs text-[var(--muted)]"><span>Milestones</span><span>{done}/{g.milestones.length} · {pct}%</span></div><div className="mt-2 h-2 rounded-full bg-[var(--border)]"><div className="h-full rounded-full bg-[var(--accent)]" style={{width:`${pct}%`}}/></div></div></article>})}</section>
    </div>
  </main></div>
}
