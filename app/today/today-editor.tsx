"use client";
import Link from "next/link";
import { FormEvent, useState } from "react";
import { addEvent, addPlan, deleteEvent, deletePlan, saveDay, togglePlan } from "./actions";
import { DailyVisuals } from "./daily-visuals";

type DayData={id:string;date:Date;title:string|null;thoughts:string|null;gratitude:string|null;highlights:string|null;challenges:string|null;wins:string|null;mood:"VERY_LOW"|"LOW"|"OKAY"|"GOOD"|"GREAT"|null;energy:number|null;stress:number|null;productivity:number|null;social:number|null;sleep:number|null;events:{id:string;time:string|null;title:string;description:string|null;category:string|null}[];plans:{id:string;title:string;completed:boolean}[]};
type HistoryDay={date:string;mood:string|null;energy:number|null;stress:number|null;productivity:number|null;social:number|null;sleep:number|null;planTotal:number;planDone:number};
const moods=[['VERY_LOW','Very low','😞'],['LOW','Low','😕'],['OKAY','Okay','😐'],['GOOD','Good','🙂'],['GREAT','Great','😄']] as const;
const metrics=[['energy','Energy','How charged did you feel?'],['stress','Stress','1 low · 5 high'],['productivity','Productivity','How much useful progress?'],['social','Social','How connected were you?'],['sleep','Sleep','How restorative was sleep?']] as const;
const scaleLabels=['Low','Below average','Okay','Good','High'];

function MetricScale({name,label,help,value,onChange}:{name:string;label:string;help:string;value:number|null;onChange:(v:number)=>void}){
 return <div className="metric-input">
   <div className="flex items-end justify-between gap-2"><div><span className="text-sm font-semibold">{label}</span><p className="mt-1 text-[11px] text-[var(--muted)]">{help}</p></div><span className="metric-badge">{value ? `${value}/5` : '—'}</span></div>
   <input type="hidden" name={name} value={value ?? ''}/>
   <div className="mt-3 grid grid-cols-5 gap-1.5" role="radiogroup" aria-label={label}>
     {[1,2,3,4,5].map(v=><button key={v} type="button" onClick={()=>onChange(v)} aria-pressed={value===v} className={`scale-button ${value===v?'is-selected':''}`}><span>{v}</span><small>{scaleLabels[v-1]}</small></button>)}
   </div>
 </div>
}

export function TodayEditor({day,dateKey,history}:{day:DayData;dateKey:string;history:HistoryDay[]}){
 const [saving,setSaving]=useState(false);
 const [metricValues,setMetricValues]=useState<Record<string,number|null>>({energy:day.energy,stress:day.stress,productivity:day.productivity,social:day.social,sleep:day.sleep});
 const progress=day.plans.length?Math.round(day.plans.filter(p=>p.completed).length/day.plans.length*100):0;
 const [eventTime,setEventTime]=useState('');
 const [eventCategory,setEventCategory]=useState('');
 function submitDay(){setSaving(true)}
 function jumpDate(e:FormEvent<HTMLInputElement>){const value=e.currentTarget.value;if(value) window.location.href=`/today?date=${value}`;}
 return <div className="space-y-8">
   <section className="card p-5 sm:p-7 animate-rise">
    <form action={async fd=>{setSaving(true);try{await saveDay(fd)}finally{setSaving(false)}}}>
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between"><div><p className="eyebrow">Daily journal</p><h2 className="mt-2 text-2xl font-semibold">How did today feel?</h2><p className="mt-1 text-sm text-[var(--muted)]">Capture the signal. The story can be as short or as deep as you want.</p></div><button disabled={saving} className="button-primary save-glow" onClick={submitDay}>{saving?'Saving…':'Save day'}</button></div>
      <input type="hidden" name="dayId" value={day.id}/>
      <div className="mt-7 grid gap-5 lg:grid-cols-[1fr_auto] lg:items-end"><label className="block text-sm"><span className="label">Day title</span><input name="title" defaultValue={day.title??''} className="field field-lg" placeholder="Give this day a name"/></label><label className="date-jump"><span>Jump to date</span><input type="date" value={dateKey} onChange={jumpDate}/></label></div>
      <div className="mt-8"><div className="flex items-end justify-between"><div><span className="label">Mood</span><p className="text-xs text-[var(--muted)]">Choose the closest overall feeling.</p></div></div><div className="mood-grid mt-3">{moods.map(([v,l,e])=><label key={v} className="mood-option"><input type="radio" name="mood" value={v} defaultChecked={day.mood===v} className="peer sr-only"/><span><b>{e}</b><small>{l}</small></span></label>)}</div></div>
      <div className="mt-8 grid gap-4 xl:grid-cols-5">{metrics.map(([n,l,h])=><MetricScale key={n} name={n} label={l} help={h} value={metricValues[n]} onChange={v=>setMetricValues(s=>({...s,[n]:v}))}/>)}</div>
      <div className="mt-8 grid gap-5 lg:grid-cols-[1.1fr_.9fr]"><label className="text-sm"><span className="label">Thoughts</span><textarea name="thoughts" defaultValue={day.thoughts??''} rows={8} className="field field-textarea resize-y" placeholder="What stayed with you today?"/></label><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1"><label className="text-sm"><span className="label">Highlights</span><textarea name="highlights" defaultValue={day.highlights??''} rows={4} className="field resize-y" placeholder="Moments worth remembering"/></label><label className="text-sm"><span className="label">Small wins</span><textarea name="wins" defaultValue={day.wins??''} rows={4} className="field resize-y" placeholder="What are you glad you did?"/></label></div></div>
      <div className="mt-4 grid gap-5 sm:grid-cols-2"><label className="text-sm"><span className="label">Gratitude</span><textarea name="gratitude" defaultValue={day.gratitude??''} rows={4} className="field resize-y" placeholder="Something you appreciated"/></label><label className="text-sm"><span className="label">Challenges</span><textarea name="challenges" defaultValue={day.challenges??''} rows={4} className="field resize-y" placeholder="What felt difficult?"/></label></div>
    </form>
   </section>

   <DailyVisuals days={history}/>

   <section className="grid gap-5 xl:grid-cols-[1.25fr_.75fr]">
    <section className="card p-5 sm:p-7 animate-rise">
      <div className="section-heading"><div><p className="eyebrow">Timeline</p><h2>Moments worth keeping</h2><p>Add what happened as it happened. Your day becomes a sequence, not a wall of text.</p></div><span className="pill">{day.events.length} moments</span></div>
      <div className="timeline mt-6">{day.events.length?day.events.map((e,i)=><div key={e.id} className="timeline-item"><div className="timeline-marker">{i+1}</div><div className="timeline-card"><div className="flex flex-wrap items-start justify-between gap-3"><div><div className="flex flex-wrap items-center gap-2"><span className="timeline-time">{e.time||'Time not set'}</span>{e.category&&<span className="category-chip">{e.category}</span>}</div><p className="mt-2 text-base font-semibold">{e.title}</p>{e.description&&<p className="mt-1 text-sm leading-6 text-[var(--muted)]">{e.description}</p>}</div><form action={deleteEvent}><input type="hidden" name="eventId" value={e.id}/><button className="ghost-danger">Delete</button></form></div></div></div>):<div className="empty-timeline"><span>✦</span><div><p className="font-semibold">Your timeline is empty</p><p className="mt-1 text-sm text-[var(--muted)]">Add a moment below and this space will become your visual history for the day.</p></div></div>}</div>
      <form action={addEvent} className="moment-composer mt-6"><input type="hidden" name="dayId" value={day.id}/><div className="composer-top"><label><span>Time</span><input name="time" type="time" value={eventTime} onChange={e=>setEventTime(e.target.value)} className="field"/></label><label><span>Moment</span><input name="title" required className="field" placeholder="What happened?"/></label><label><span>Category</span><input name="category" value={eventCategory} onChange={e=>setEventCategory(e.target.value)} className="field" placeholder="Work, family, travel…"/></label></div><label className="mt-3 block"><span>Details <em>optional</em></span><textarea name="description" rows={3} className="field resize-y" placeholder="A little context, a person, a place, or how it felt…"/></label><div className="mt-3 flex flex-wrap gap-2"><button type="button" className="quick-chip" onClick={()=>setEventTime('09:00')}>Morning</button><button type="button" className="quick-chip" onClick={()=>setEventTime('13:00')}>Afternoon</button><button type="button" className="quick-chip" onClick={()=>setEventTime('18:00')}>Evening</button><button className="button-primary ml-auto" type="submit">+ Add moment</button></div></form>
    </section>
    <aside className="card p-5 sm:p-7 h-fit sticky top-24 animate-rise"><div className="section-heading"><div><p className="eyebrow">Intentions</p><h2>Plan for today</h2></div><span className="metric-badge">{progress}%</span></div><div className="progress-track mt-4"><div style={{width:`${progress}%`}}/></div><div className="mt-4 flex items-center justify-between text-xs text-[var(--muted)]"><span>{day.plans.filter(p=>p.completed).length} completed</span><span>{day.plans.length} total</span></div><div className="mt-5 space-y-2">{day.plans.map(p=><div key={p.id} className="plan-row"><form action={togglePlan}><input type="hidden" name="planId" value={p.id}/><button aria-label={p.completed?'Mark incomplete':'Mark complete'} className={`plan-check ${p.completed?'done':''}`}>{p.completed?'✓':''}</button></form><span className={p.completed?'line-through text-[var(--muted)]':''}>{p.title}</span><form action={deletePlan} className="ml-auto"><input type="hidden" name="planId" value={p.id}/><button className="icon-button" aria-label="Delete plan">×</button></form></div>)}</div><form action={addPlan} className="mt-5 flex gap-2"><input type="hidden" name="dayId" value={day.id}/><input name="title" required className="field" placeholder="Add an intention"/><button className="button-primary" type="submit">Add</button></form><Link href="/planning" className="subtle-link mt-4 block">Open full planning →</Link></aside>
   </section>
 </div>
}
