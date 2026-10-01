"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "@/lib/auth-client";

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    const result = await signIn.email({ email, password });
    setLoading(false);

    if (result.error) {
      setError(result.error.message ?? "Unable to sign in.");
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
          <h1 className="text-3xl font-semibold tracking-tight">Welcome back</h1>
          <p className="mt-2 text-sm text-zinc-400">Open your shelf and continue where you left off.</p>

          <form onSubmit={submit} className="mt-7 space-y-4">
            <label className="block text-sm">
              <span className="mb-2 block text-zinc-300">Email</span>
              <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 outline-none ring-teal-300/40 transition focus:ring-2" autoComplete="email" />
            </label>
            <label className="block text-sm">
              <span className="mb-2 block text-zinc-300">Password</span>
              <input required type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 outline-none ring-teal-300/40 transition focus:ring-2" autoComplete="current-password" />
            </label>

            {error && <p className="rounded-xl border border-red-400/20 bg-red-400/5 px-3 py-2 text-sm text-red-300">{error}</p>}

            <button disabled={loading} className="w-full rounded-xl bg-white px-4 py-3 font-semibold text-zinc-950 transition hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-60">
              {loading ? "Signing in…" : "Sign in"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-zinc-500">
            New here? <Link href="/sign-up" className="text-zinc-200 hover:underline">Create an account</Link>
          </p>
        </div>
      </div>
    </main>
  );
}
