"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export function SignUpForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (password.length < 8) {
      setError("Your password must contain at least 8 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("The passwords do not match.");
      return;
    }

    setLoading(true);
    const { error } = await authClient.signUp.email({
      name: name.trim(),
      email: email.trim(),
      password,
      callbackURL: "/dashboard",
    });

    if (error) {
      setError(error.message || "We couldn't create your account. Please try again.");
      setLoading(false);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <label className="block">
        <span className="mb-2 block text-sm font-medium">Name</span>
        <input value={name} onChange={(e) => setName(e.target.value)} type="text" autoComplete="name" required minLength={2} placeholder="Your name" className="field" />
      </label>
      <label className="block">
        <span className="mb-2 block text-sm font-medium">Email</span>
        <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" autoComplete="email" required placeholder="you@example.com" className="field" />
      </label>
      <label className="block">
        <span className="mb-2 block text-sm font-medium">Password</span>
        <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" autoComplete="new-password" required minLength={8} placeholder="At least 8 characters" className="field" />
      </label>
      <label className="block">
        <span className="mb-2 block text-sm font-medium">Confirm password</span>
        <input value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} type="password" autoComplete="new-password" required minLength={8} placeholder="Repeat your password" className="field" />
      </label>
      {error && <p role="alert" className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-500">{error}</p>}
      <button disabled={loading} className="button-primary w-full" type="submit">
        {loading ? "Creating your shelf…" : "Create account"}
      </button>
    </form>
  );
}
