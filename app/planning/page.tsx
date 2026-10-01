import Link from "next/link";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { addMonthlyItem, deleteMonthlyItem, saveMonthlyPlan, toggleMonthlyItem } from "./actions";
import { AppNav } from "@/components/app-nav";

export default async function PlanningPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/sign-in");
  const now = new Date();
  const month = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
  const monthKey = month.toISOString().slice(0, 7);
  const plan = await prisma.monthlyPlan.upsert({
    where: { userId_month: { userId: session.user.id, month } },
    create: { userId: session.user.id, month },
    update: {},
    include: { items: { orderBy: [{ completed: "asc" }, { priority: "asc" }] } },
  });
  const goals = await prisma.goal.findMany({ where: { userId: session.user.id, status: "ACTIVE" }, include: { milestones: true }, orderBy: { createdAt: "desc" }, take: 4 });
  const completed = plan.items.filter((i) => i.completed).length;
  return <div className="app-frame"><AppNav user={session.user}/><main className="app-main"><section className="page-hero"><p className="eyebrow">Planning</p><h1>Turn intentions into a month you can actually see.</h1><p>One monthly focus, a small set of objectives, and a clear bridge from goals to today's work.</p></section>
    <div className="grid gap-5 xl:grid-cols-[1.2fr_.8fr]">
      <section className="card p-5 sm:p-7">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start"><div><p className="text-sm text-[var(--muted)]">{new Intl.DateTimeFormat("en-IN",{month:"long",year:"numeric",timeZone:"UTC"}).format(month)}</p><h2 className="mt-1 text-2xl font-semibold">Monthly plan</h2></div><span className="pill">{completed}/{plan.items.length || 0} complete</span></div>
        <form action={saveMonthlyPlan} className="mt-6 grid gap-3 sm:grid-cols-2"><input type="hidden" name="month" value={monthKey}/><label className="sm:col-span-2 text-sm"><span className="label">Title</span><input name="title" defaultValue={plan.title ?? ""} className="field" placeholder="What do you want this month to be about?"/></label><label className="sm:col-span-2 text-sm"><span className="label">Focus</span><textarea name="focus" defaultValue={plan.focus ?? ""} rows={3} className="field resize-y" placeholder="The few things that deserve your attention."/></label><button className="button-primary sm:w-fit">Save month</button></form>
        <div className="mt-8 border-t border-[var(--border)] pt-6"><div className="flex items-center justify-between"><div><h3 className="font-semibold">Objectives</h3><p className="mt-1 text-xs text-[var(--muted)]">Keep this list intentionally short.</p></div><span className="text-xs text-[var(--muted)]">{plan.items.length} items</span></div>
          <div className="mt-4 space-y-2">{plan.items.map(item=><div key={item.id} className="flex items-center gap-3 rounded-2xl border border-[var(--border)] p-3"><form action={toggleMonthlyItem}><input type="hidden" name="itemId" value={item.id}/><button className={`grid size-7 place-items-center rounded-full border text-xs ${item.completed?"border-[var(--accent)] bg-[var(--accent)] text-white":"border-[var(--border)]"}`}>{item.completed?"✓":""}</button></form><span className={`min-w-0 flex-1 text-sm ${item.completed?"text-[var(--muted)] line-through":""}`}>{item.title}</span><form action={deleteMonthlyItem}><input type="hidden" name="itemId" value={item.id}/><button className="text-xs text-[var(--muted)]">×</button></form></div>)}</div>
          <form action={addMonthlyItem} className="mt-4 flex gap-2"><input type="hidden" name="planId" value={plan.id}/><input name="title" required className="field" placeholder="Add an objective"/><button className="button-primary">Add</button></form>
        </div>
      </section>
      <section className="space-y-5">
        <div className="card p-5 sm:p-7"><div className="flex items-center justify-between"><div><p className="text-sm text-[var(--muted)]">Active goals</p><h2 className="mt-1 text-xl font-semibold">What are you moving forward?</h2></div><Link href="/goals" className="text-sm text-[var(--accent)]">View all →</Link></div><div className="mt-5 space-y-3">{goals.length ? goals.map(g=><Link key={g.id} href={`/goals/${g.id}`} className="block rounded-2xl border border-[var(--border)] p-4 transition hover:bg-[var(--background)]"><div className="flex justify-between gap-3"><span className="font-medium">{g.title}</span><span className="text-xs text-[var(--muted)]">{g.milestones.filter(m=>m.status==="COMPLETED").length}/{g.milestones.length}</span></div><div className="mt-3 h-1.5 rounded-full bg-[var(--border)]"><div className="h-full rounded-full bg-[var(--accent)]" style={{width:`${g.milestones.length ? g.milestones.filter(m=>m.status==="COMPLETED").length/g.milestones.length*100:0}%`}}/></div></Link>) : <p className="text-sm text-[var(--muted)]">Create your first goal to connect long-term direction with this month.</p>}</div></div>
        <div className="card p-5 sm:p-7"><p className="text-sm text-[var(--muted)]">Daily bridge</p><h2 className="mt-1 text-xl font-semibold">Make today's work count.</h2><p className="mt-2 text-sm leading-6 text-[var(--muted)]">Your daily plans stay in the journal, while monthly objectives and goals provide the bigger picture.</p><Link href="/today" className="button-primary mt-5 inline-flex">Open today</Link></div>
      </section>
    </div>
  </main></div>;
}
