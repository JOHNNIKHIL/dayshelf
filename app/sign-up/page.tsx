"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signUp } from "@/lib/auth-client";

export default function SignUpPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    const result = await signUp.email({ name, email, password });
    setLoading(false);

    if (result.error) {
      setError(result.error.message ?? "Unable to create the account.");
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <main className="grid min-h-screen place-items-center px-6 py-10">
      <div className="w-full max-w-md">
        <Link href="/" className="text-sm text-zinc-500 hover:text-zinc-300">← DayShelf</Link>
        <div className="mt-8 rounded-3xl border border-white/10 bg-white/[0.035] p-7 shadow-2xl shadow-black/20">
          <h1 className="text-3xl font-semibold tracking-tight">Create your shelf</h1>
          <p className="mt-2 text-sm text-zinc-400">Start with a private DayShelf account.</p>

          <form onSubmit={submit} className="mt-7 space-y-4">
            <label className="block text-sm">
              <span className="mb-2 block text-zinc-300">Name</span>
              <input required value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 outline-none ring-teal-300/40 transition focus:ring-2" autoComplete="name" />
            </label>
            <label className="block text-sm">
              <span className="mb-2 block text-zinc-300">Email</span>
              <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 outline-none ring-teal-300/40 transition focus:ring-2" autoComplete="email" />
            </label>
            <label className="block text-sm">
              <span className="mb-2 block text-zinc-300">Password</span>
              <input required minLength={8} type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 outline-none ring-teal-300/40 transition focus:ring-2" autoComplete="new-password" />
            </label>

            {error && <p className="rounded-xl border border-red-400/20 bg-red-400/5 px-3 py-2 text-sm text-red-300">{error}</p>}

            <button disabled={loading} className="w-full rounded-xl bg-white px-4 py-3 font-semibold text-zinc-950 transition hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-60">
              {loading ? "Creating…" : "Create account"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-zinc-500">
            Already have an account? <Link href="/sign-in" className="text-zinc-200 hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </main>
  );
}
