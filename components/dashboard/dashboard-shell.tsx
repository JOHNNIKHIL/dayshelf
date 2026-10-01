"use client";

import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

type User = {
  name: string;
  email: string;
};

export function DashboardShell({ user }: { user: User }) {
  const router = useRouter();

  async function signOut() {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/");
          router.refresh();
        },
      },
    });
  }

  const firstName = user.name.trim().split(" ")[0] || "there";

  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <div className="mx-auto max-w-6xl px-6 py-8 sm:px-10 lg:px-12">
        <header className="flex items-center justify-between border-b border-[var(--border)] pb-6">
          <div className="flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-xl bg-[var(--accent)] font-semibold text-white">D</span>
            <div>
              <p className="font-semibold">DayShelf</p>
              <p className="text-xs text-[var(--muted)]">Your private daily archive</p>
            </div>
          </div>
          <button onClick={signOut} className="rounded-full border border-[var(--border)] px-4 py-2 text-sm font-medium transition hover:bg-[var(--surface)]">Sign out</button>
        </header>

        <section className="py-12">
          <p className="text-sm font-medium text-[var(--accent)]">October 1, 2026</p>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight sm:text-5xl">Good morning, {firstName}.</h1>
          <p className="mt-3 max-w-2xl text-[var(--muted)]">This is the beginning of your DayShelf. We&apos;ll build your daily journal, mood timeline, plans, memories and reflections here.</p>
        </section>

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ["Today", "Write about your day", "✎"],
            ["Mood", "How are you feeling?", "☀"],
            ["Plans", "Set an intention", "→"],
            ["Memories", "Keep something special", "♡"],
          ].map(([title, subtitle, icon]) => (
            <div key={title} className="group rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 transition hover:-translate-y-1 hover:shadow-lg">
              <div className="grid size-11 place-items-center rounded-2xl bg-[var(--accent)]/10 text-lg text-[var(--accent)]">{icon}</div>
              <h2 className="mt-5 font-semibold">{title}</h2>
              <p className="mt-1 text-sm text-[var(--muted)]">{subtitle}</p>
              <div className="mt-6 text-xs font-medium text-[var(--muted)]">Coming in V1 →</div>
            </div>
          ))}
        </section>

        <div className="mt-8 rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-7">
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted)]">V0 foundation</p>
          <div className="mt-3 grid gap-4 sm:grid-cols-3">
            <div><p className="font-medium">✓ Authentication</p><p className="mt-1 text-sm text-[var(--muted)]">Email + password via Better Auth</p></div>
            <div><p className="font-medium">✓ Sessions</p><p className="mt-1 text-sm text-[var(--muted)]">Protected server-side dashboard</p></div>
            <div><p className="font-medium">○ Journal</p><p className="mt-1 text-sm text-[var(--muted)]">The next milestone</p></div>
          </div>
        </div>
      </div>
    </main>
  );
}
