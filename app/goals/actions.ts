"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function uid() { const s = await auth.api.getSession({ headers: await headers() }); if (!s) throw new Error("Unauthorized"); return s.user.id; }
const text=(fd:FormData,k:string)=>String(fd.get(k)??"").trim();

export async function createGoal(fd:FormData){
  const userId=await uid(); const title=text(fd,"title"); if(!title) return;
  const target=text(fd,"targetDate");
  await prisma.goal.create({data:{userId,title,description:text(fd,"description")||null,targetDate:target?new Date(`${target}T00:00:00.000Z`):null}});
  revalidatePath("/goals"); revalidatePath("/planning");
}
export async function updateGoalStatus(fd:FormData){
  const userId=await uid(); const id=text(fd,"goalId"); const status=text(fd,"status");
  if(!["ACTIVE","COMPLETED","PAUSED"].includes(status)) throw new Error("Invalid status.");
  const g=await prisma.goal.findFirst({where:{id,userId},select:{id:true}}); if(!g) throw new Error("Goal not found.");
  await prisma.goal.update({where:{id},data:{status:status as any}}); revalidatePath("/goals"); revalidatePath(`/goals/${id}`); revalidatePath("/planning");
}
export async function createMilestone(fd:FormData){
  const userId=await uid(); const goalId=text(fd,"goalId"); const title=text(fd,"title"); if(!title) return;
  const g=await prisma.goal.findFirst({where:{id:goalId,userId},select:{id:true}}); if(!g) throw new Error("Goal not found.");
  const max=await prisma.milestone.aggregate({where:{goalId},_max:{sortOrder:true}});
  await prisma.milestone.create({data:{goalId,title,description:text(fd,"description")||null,sortOrder:(max._max.sortOrder??-1)+1}});
  revalidatePath(`/goals/${goalId}`); revalidatePath("/goals"); revalidatePath("/planning");
}
export async function toggleMilestone(fd:FormData){
  const userId=await uid(); const id=text(fd,"milestoneId");
  const m=await prisma.milestone.findFirst({where:{id,goal:{userId}},select:{id:true,status:true,goalId:true}}); if(!m) throw new Error("Milestone not found.");
  const status=m.status==="COMPLETED"?"TODO":"COMPLETED";
  await prisma.milestone.update({where:{id},data:{status}}); revalidatePath(`/goals/${m.goalId}`); revalidatePath("/goals"); revalidatePath("/planning");
}
