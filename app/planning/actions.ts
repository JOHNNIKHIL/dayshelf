"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function userId() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new Error("Unauthorized");
  return session.user.id;
}
const text = (fd: FormData, key: string) => String(fd.get(key) ?? "").trim();

export async function saveMonthlyPlan(fd: FormData) {
  const uid = await userId();
  const month = text(fd, "month");
  if (!/^\d{4}-\d{2}$/.test(month)) throw new Error("Invalid month.");
  await prisma.monthlyPlan.upsert({
    where: { userId_month: { userId: uid, month: new Date(`${month}-01T00:00:00.000Z`) } },
    create: { userId: uid, month: new Date(`${month}-01T00:00:00.000Z`), title: text(fd, "title") || null, focus: text(fd, "focus") || null },
    update: { title: text(fd, "title") || null, focus: text(fd, "focus") || null },
  });
  revalidatePath("/planning");
}

export async function addMonthlyItem(fd: FormData) {
  const uid = await userId();
  const planId = text(fd, "planId");
  const title = text(fd, "title");
  if (!title) return;
  const plan = await prisma.monthlyPlan.findFirst({ where: { id: planId, userId: uid }, select: { id: true } });
  if (!plan) throw new Error("Plan not found.");
  const max = await prisma.monthlyPlanItem.aggregate({ where: { monthlyPlanId: planId }, _max: { priority: true } });
  await prisma.monthlyPlanItem.create({ data: { monthlyPlanId: planId, title, priority: (max._max.priority ?? -1) + 1 } });
  revalidatePath("/planning");
}

export async function toggleMonthlyItem(fd: FormData) {
  const uid = await userId();
  const id = text(fd, "itemId");
  const item = await prisma.monthlyPlanItem.findFirst({ where: { id, monthlyPlan: { userId: uid } }, select: { id: true, completed: true } });
  if (!item) throw new Error("Item not found.");
  await prisma.monthlyPlanItem.update({ where: { id }, data: { completed: !item.completed } });
  revalidatePath("/planning");
}

export async function deleteMonthlyItem(fd: FormData) {
  const uid = await userId();
  const id = text(fd, "itemId");
  const item = await prisma.monthlyPlanItem.findFirst({ where: { id, monthlyPlan: { userId: uid } }, select: { id: true } });
  if (!item) throw new Error("Item not found.");
  await prisma.monthlyPlanItem.delete({ where: { id } });
  revalidatePath("/planning");
}
