import Link from "next/link";
import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createMilestone, toggleMilestone } from "../actions";
import { AppNav } from "@/components/app-nav";

export default async function GoalPage({params}:{params:Promise<{id:string}>}){
  const session=await auth.api.getSession({headers:await headers()}); if(!session) redirect("/sign-in");
  const {id}=await params;
  const goal=await prisma.goal.findFirst({where:{id,userId:session.user.id},include:{milestones:{orderBy:{sortOrder:"asc"}}}});
  if(!goal) notFound();
  const done=goal.milestones.filter(m=>m.status==="COMPLETED").length;
  return <div className="app-frame"><AppNav user={session.user}/><main className="app-main"><Link href="/goals" className="text-sm text-[var(--muted)] hover:text-[var(--foreground)]">← All goals</Link><section className="page-hero !pb-8"><div className="flex flex-wrap items-center gap-2"><span className={`status status-${goal.status.toLowerCase()}`}>{goal.status}</span>{goal.targetDate&&<span className="text-xs text-[var(--muted)]">Target {goal.targetDate.toISOString().slice(0,10)}</span>}</div><h1 className="mt-3">{goal.title}</h1>{goal.description&&<p>{goal.description}</p>}</section>
    <div className="grid gap-5 lg:grid-cols-[1.1fr_.9fr]"><section className="card p-5 sm:p-7"><div className="flex items-end justify-between"><div><h2 className="text-xl font-semibold">Milestones</h2><p className="mt-1 text-sm text-[var(--muted)]">{done} of {goal.milestones.length} complete.</p></div></div><div className="mt-6 space-y-3">{goal.milestones.map(m=><div key={m.id} className="flex items-center gap-3 rounded-2xl border border-[var(--border)] p-4"><form action={toggleMilestone}><input type="hidden" name="milestoneId" value={m.id}/><button className={`grid size-7 place-items-center rounded-full border text-xs ${m.status==="COMPLETED"?"border-[var(--accent)] bg-[var(--accent)] text-white":"border-[var(--border)]"}`}>{m.status==="COMPLETED"?"✓":""}</button></form><div className="min-w-0 flex-1"><p className={`font-medium ${m.status==="COMPLETED"?"text-[var(--muted)] line-through":""}`}>{m.title}</p>{m.description&&<p className="mt-1 text-xs text-[var(--muted)]">{m.description}</p>}</div></div>)}</div><form action={createMilestone} className="mt-5 flex gap-2"><input type="hidden" name="goalId" value={goal.id}/><input name="title" required className="field" placeholder="Add a milestone"/><button className="button-primary">Add</button></form></section><section className="card p-5 sm:p-7"><p className="text-sm text-[var(--muted)]">Connect the goal to your month</p><h2 className="mt-1 text-xl font-semibold">Make progress visible.</h2><p className="mt-3 text-sm leading-6 text-[var(--muted)]">Monthly objectives and daily plans can be connected to this goal as the planning layer grows.</p><Link href="/planning" className="button-primary mt-5 inline-flex">Open planning</Link></section></div>
  </main></div>
}
