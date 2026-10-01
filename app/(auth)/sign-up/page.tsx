import { SignUpForm } from "@/components/auth/sign-up-form";
import Link from "next/link";

export default function SignUpPage() {
  return (
    <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-7 shadow-xl shadow-black/5 sm:p-9">
      <div className="mb-8">
        <p className="text-sm font-medium text-[var(--accent)]">Your shelf starts here</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">Create your account</h1>
        <p className="mt-2 text-sm leading-6 text-[var(--muted)]">A private home for your days, thoughts and memories.</p>
      </div>
      <SignUpForm />
      <p className="mt-7 text-center text-sm text-[var(--muted)]">
        Already have an account? <Link href="/sign-in" className="font-medium text-[var(--accent)] hover:underline">Sign in</Link>
      </p>
    </div>
  );
}
