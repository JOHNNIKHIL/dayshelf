import Link from "next/link";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { SignOutButton } from "@/app/dashboard/sign-out-button";

export default async function DashboardPage() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    redirect("/sign-in");
  }

  return (
    <main className="min-h-screen px-6 py-8 sm:px-10">
      <div className="mx-auto max-w-6xl">
        <header className="flex items-center justify-between border-b border-white/10 pb-5">
          <Link href="/" className="font-semibold tracking-tight">DayShelf</Link>
          <SignOutButton />
        </header>

        <section className="py-12">
          <p className="text-sm uppercase tracking-[0.2em] text-teal-300/70">Your shelf</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">Good to see you, {session.user.name}.</h1>
          <p className="mt-4 max-w-2xl text-zinc-400">V0 is alive. Authentication, sessions, PostgreSQL persistence, and the protected dashboard are now the foundation for everything we build next.</p>

          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {[
              ["Today", "Journal core", "Coming in V1"],
              ["Calendar", "Your days", "Coming in V1"],
              ["Memories", "Life archive", "Later in V2.5"],
            ].map(([title, label, status]) => (
              <div key={title} className="rounded-2xl border border-white/10 bg-white/[0.035] p-5">
                <p className="text-sm text-zinc-500">{label}</p>
                <h2 className="mt-2 text-xl font-medium">{title}</h2>
                <p className="mt-6 text-sm text-zinc-500">{status}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
