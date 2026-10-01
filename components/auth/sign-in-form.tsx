"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export function SignInForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    const { error } = await authClient.signIn.email({
      email: email.trim(),
      password,
      rememberMe,
      callbackURL: "/dashboard",
    });

    if (error) {
      setError(error.message || "We couldn't sign you in. Check your details and try again.");
      setLoading(false);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <label className="block">
        <span className="mb-2 block text-sm font-medium">Email</span>
        <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" autoComplete="email" required placeholder="you@example.com" className="field" />
      </label>
      <label className="block">
        <span className="mb-2 block text-sm font-medium">Password</span>
        <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" autoComplete="current-password" required placeholder="Your password" className="field" />
      </label>
      <label className="flex items-center gap-2 text-sm text-[var(--muted)]">
        <input checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} type="checkbox" className="size-4 accent-[var(--accent)]" />
        Keep me signed in
      </label>
      {error && <p role="alert" className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-500">{error}</p>}
      <button disabled={loading} className="button-primary w-full" type="submit">
        {loading ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
