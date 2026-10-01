import { SignInForm } from "@/components/auth/sign-in-form";
import Link from "next/link";

export default function SignInPage() {
  return (
    <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-7 shadow-xl shadow-black/5 sm:p-9">
      <div className="mb-8">
        <p className="text-sm font-medium text-[var(--accent)]">Welcome back</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">Sign in to DayShelf</h1>
        <p className="mt-2 text-sm leading-6 text-[var(--muted)]">Pick up where you left off.</p>
      </div>
      <SignInForm />
      <p className="mt-7 text-center text-sm text-[var(--muted)]">
        New to DayShelf? <Link href="/sign-up" className="font-medium text-[var(--accent)] hover:underline">Create an account</Link>
      </p>
    </div>
  );
}
