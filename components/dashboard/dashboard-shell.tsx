"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { signOut } from "@/lib/auth-client";

type DashboardUser = { name: string; email: string };

export function DashboardShell({ user }: { user: DashboardUser }) {
  const router = useRouter();

  async function handleSignOut() {
    await signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <main className="min-h-screen px-6 py-8 sm:px-10">
      <div className="mx-auto max-w-6xl">
        <header className="flex items-center justify-between border-b border-white/10 pb-5">
          <Link href="/" className="font-semibold tracking-tight">DayShelf</Link>
          <button onClick={handleSignOut} className="rounded-full border border-white/10 px-4 py-2 text-sm text-zinc-300 transition hover:bg-white/5">Sign out</button>
        </header>
        <section className="py-12">
          <p className="text-sm uppercase tracking-[0.2em] text-teal-300/70">Your shelf</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">Good to see you, {user.name}.</h1>
          <p className="mt-4 max-w-2xl text-zinc-400">V0 is alive. Authentication, sessions, PostgreSQL persistence, and the protected dashboard are now the foundation for everything we build next.</p>
          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {[['Today','Journal core','Coming in V1'],['Calendar','Your days','Coming in V1'],['Memories','Life archive','Later in V2.5']].map(([title,label,status]) => (
              <div key={title} className="rounded-2xl border border-white/10 bg-white/[0.035] p-5">
                <p className="text-sm text-zinc-500">{label}</p><h2 className="mt-2 text-xl font-medium">{title}</h2><p className="mt-6 text-sm text-zinc-500">{status}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
