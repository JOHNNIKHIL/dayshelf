"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function uid(){const s=await auth.api.getSession({headers:await headers()});if(!s)throw new Error("Unauthorized");return s.user.id}
const text=(fd:FormData,k:string)=>String(fd.get(k)??"").trim();

export async function createHabit(fd:FormData){const userId=await uid();const name=text(fd,"name");if(!name)return;const target=Math.max(1,Math.min(7,Number(text(fd,"targetPerWeek"))||7));await prisma.habit.create({data:{userId,name,description:text(fd,"description")||null,frequency:"weekly",targetPerWeek:target}});revalidatePath("/habits");}
export async function toggleHabit(fd:FormData){const userId=await uid();const habitId=text(fd,"habitId");const date=text(fd,"date");const habit=await prisma.habit.findFirst({where:{id:habitId,userId,archived:false},select:{id:true}});if(!habit)throw new Error("Habit not found.");const d=new Date(`${date}T00:00:00.000Z`);const existing=await prisma.habitLog.findUnique({where:{habitId_date:{habitId,date:d}}});if(existing){await prisma.habitLog.update({where:{id:existing.id},data:{completed:!existing.completed}})}else{await prisma.habitLog.create({data:{habitId,date:d,completed:true}})}revalidatePath("/habits");}
