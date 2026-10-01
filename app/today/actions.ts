"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import type { Mood } from "@/generated/prisma/client";

async function requireUserId() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new Error("Unauthorized");
  return session.user.id;
}

function textValue(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function optionalText(value: string) { return value || null; }

function metric(formData: FormData, key: string) {
  const raw = textValue(formData, key);
  if (!raw) return null;
  const value = Number(raw);
  if (!Number.isInteger(value) || value < 1 || value > 5) throw new Error("Metrics must be between 1 and 5.");
  return value;
}

async function ownedDay(userId: string, dayId: string) {
  const day = await prisma.day.findFirst({ where: { id: dayId, userId }, select: { id: true } });
  if (!day) throw new Error("Day not found.");
  return day.id;
}

export async function saveDay(formData: FormData) {
  const userId = await requireUserId();
  const dayId = textValue(formData, "dayId");
  const id = await ownedDay(userId, dayId);
  const mood = textValue(formData, "mood");
  const allowedMood = ["VERY_LOW", "LOW", "OKAY", "GOOD", "GREAT"] as const;

  await prisma.day.update({
    where: { id },
    data: {
      title: optionalText(textValue(formData, "title")),
      thoughts: optionalText(textValue(formData, "thoughts")),
      gratitude: optionalText(textValue(formData, "gratitude")),
      highlights: optionalText(textValue(formData, "highlights")),
      challenges: optionalText(textValue(formData, "challenges")),
      wins: optionalText(textValue(formData, "wins")),
      mood: allowedMood.includes(mood as Mood) ? (mood as Mood) : null,
      energy: metric(formData, "energy"),
      stress: metric(formData, "stress"),
      productivity: metric(formData, "productivity"),
      social: metric(formData, "social"),
      sleep: metric(formData, "sleep"),
    },
  });
  revalidatePath("/today");
  revalidatePath("/dashboard");
}

export async function addEvent(formData: FormData) {
  const userId = await requireUserId();
  const dayId = await ownedDay(userId, textValue(formData, "dayId"));
  const title = textValue(formData, "title");
  if (!title) throw new Error("Event title is required.");
  const max = await prisma.dayEvent.aggregate({ where: { dayId }, _max: { sortOrder: true } });
  await prisma.dayEvent.create({ data: { dayId, title, time: optionalText(textValue(formData, "time")), category: optionalText(textValue(formData, "category")), description: optionalText(textValue(formData, "description")), sortOrder: (max._max.sortOrder ?? -1) + 1 } });
  revalidatePath("/today");
  revalidatePath("/dashboard");
}

export async function deleteEvent(formData: FormData) {
  const userId = await requireUserId();
  const eventId = textValue(formData, "eventId");
  const event = await prisma.dayEvent.findFirst({ where: { id: eventId, day: { userId } }, select: { id: true } });
  if (!event) throw new Error("Event not found.");
  await prisma.dayEvent.delete({ where: { id: event.id } });
  revalidatePath("/today");
}

export async function addPlan(formData: FormData) {
  const userId = await requireUserId();
  const dayId = await ownedDay(userId, textValue(formData, "dayId"));
  const title = textValue(formData, "title");
  if (!title) throw new Error("Plan title is required.");
  const max = await prisma.dayPlan.aggregate({ where: { dayId }, _max: { priority: true } });
  await prisma.dayPlan.create({ data: { dayId, title, priority: (max._max.priority ?? -1) + 1 } });
  revalidatePath("/today");
  revalidatePath("/dashboard");
}

export async function togglePlan(formData: FormData) {
  const userId = await requireUserId();
  const planId = textValue(formData, "planId");
  const plan = await prisma.dayPlan.findFirst({ where: { id: planId, day: { userId } }, select: { id: true, completed: true } });
  if (!plan) throw new Error("Plan not found.");
  await prisma.dayPlan.update({ where: { id: plan.id }, data: { completed: !plan.completed } });
  revalidatePath("/today");
  revalidatePath("/dashboard");
}

export async function deletePlan(formData: FormData) {
  const userId = await requireUserId();
  const planId = textValue(formData, "planId");
  const plan = await prisma.dayPlan.findFirst({ where: { id: planId, day: { userId } }, select: { id: true } });
  if (!plan) throw new Error("Plan not found.");
  await prisma.dayPlan.delete({ where: { id: plan.id } });
  revalidatePath("/today");
}
