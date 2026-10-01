import Link from "next/link";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { addDays, dateFromKey, formatDate, getTodayDateKey, isDateKey } from "@/lib/day";
import { TodayEditor } from "./today-editor";
import { AppNav } from "@/components/app-nav";

export default async function TodayPage({searchParams}:{searchParams:Promise<{date?:string}>}){
  const session=await auth.api.getSession({headers:await headers()});if(!session)redirect("/sign-in");
  const params=await searchParams;const requested=params.date&&isDateKey(params.date)?params.date:getTodayDateKey();const date=dateFromKey(requested);const todayKey=getTodayDateKey();
  const day=await prisma.day.upsert({where:{userId_date:{userId:session.user.id,date}},create:{userId:session.user.id,date},update:{},include:{events:{orderBy:[{sortOrder:"asc"},{createdAt:"asc"}]},plans:{orderBy:[{completed:"asc"},{priority:"asc"}]}}});
  const previous=addDays(date,-1).toISOString().slice(0,10),next=addDays(date,1).toISOString().slice(0,10),isToday=requested===todayKey;
  const historyStart=addDays(date,-13);
  const history=await prisma.day.findMany({where:{userId:session.user.id,date:{gte:historyStart,lte:date}},orderBy:{date:"asc"},include:{plans:{select:{completed:true}}}});
  const historyData=history.map(d=>({date:d.date.toISOString().slice(0,10),mood:d.mood,energy:d.energy,stress:d.stress,productivity:d.productivity,social:d.social,sleep:d.sleep,planTotal:d.plans.length,planDone:d.plans.filter(p=>p.completed).length}));
  if(!historyData.some(d=>d.date===requested)) historyData.push({date:requested,mood:day.mood,energy:day.energy,stress:day.stress,productivity:day.productivity,social:day.social,sleep:day.sleep,planTotal:day.plans.length,planDone:day.plans.filter(p=>p.completed).length});
  return <div className="app-frame"><AppNav user={session.user}/><main className="app-main">
    <section className="page-hero"><div className="flex flex-wrap items-center gap-2"><p className="eyebrow">{isToday?"Today":"Journal day"}</p>{day.mood&&<span className="pill">{day.mood.replace("_"," ").toLowerCase()}</span>}</div><div className="mt-3 flex flex-col justify-between gap-5 lg:flex-row lg:items-end"><div><h1>{formatDate(day.date)}</h1><p>What happened. What mattered. What comes next.</p></div><nav className="flex gap-2"><Link href={`/today?date=${previous}`} className="rounded-full border border-[var(--border)] px-3 py-2 text-sm">←</Link>{!isToday&&<Link href="/today" className="rounded-full border border-[var(--border)] px-4 py-2 text-sm">Today</Link>}<Link href={`/today?date=${next}`} className="rounded-full border border-[var(--border)] px-3 py-2 text-sm">→</Link></nav></div></section>
    <TodayEditor day={day} dateKey={requested} history={historyData}/>
  </main></div>
}
