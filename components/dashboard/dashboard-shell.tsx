"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export function DashboardShell({ user }: { user: { name: string; email: string } }) {
  const router = useRouter();
  async function handleSignOut() { await authClient.signOut(); router.push("/"); router.refresh(); }
  return <main className="min-h-screen px-6 py-8 sm:px-10"><div className="mx-auto max-w-6xl"><header className="flex items-center justify-between border-b border-[var(--border)] pb-5"><Link href="/" className="font-semibold tracking-tight">DayShelf</Link><button onClick={handleSignOut} className="rounded-full border border-[var(--border)] px-4 py-2 text-sm">Sign out</button></header><section className="py-12"><p className="text-sm uppercase tracking-[.2em] text-[var(--accent)]">Your shelf</p><h1 className="mt-3 text-4xl font-semibold tracking-tight">Good to see you, {user.name}.</h1></section></div></main>;
}
