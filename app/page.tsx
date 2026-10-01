import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-[var(--background)] text-[var(--foreground)]">
      <section className="relative mx-auto flex min-h-screen max-w-6xl flex-col px-6 py-8 sm:px-10 lg:px-12">
        <header className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 font-semibold tracking-tight">
            <span className="grid size-9 place-items-center rounded-xl bg-[var(--accent)] text-sm text-white shadow-lg shadow-[var(--accent)]/20">D</span>
            <span>DayShelf</span>
          </Link>
          <Link href="/sign-in" className="rounded-full border border-[var(--border)] px-4 py-2 text-sm font-medium transition hover:bg-[var(--surface)]">
            Sign in
          </Link>
        </header>

        <div className="pointer-events-none absolute -right-40 top-20 size-[28rem] rounded-full bg-[var(--accent)]/10 blur-3xl" />
        <div className="pointer-events-none absolute -left-40 bottom-0 size-[24rem] rounded-full bg-sky-400/5 blur-3xl" />

        <div className="relative flex flex-1 items-center py-20">
          <div className="grid w-full gap-14 lg:grid-cols-[1.1fr_.9fr] lg:items-center">
            <div>
              <p className="mb-5 inline-flex rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 py-1.5 text-xs font-medium text-[var(--muted)]">
                A private place for your everyday life
              </p>
              <h1 className="max-w-3xl text-5xl font-semibold tracking-[-0.04em] sm:text-6xl lg:text-7xl">
                Keep the days you don&apos;t want to forget.
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-8 text-[var(--muted)]">
                DayShelf is your personal archive for thoughts, moments, plans, moods and memories — designed to feel calm, private and genuinely yours.
              </p>
              <div className="mt-9 flex flex-wrap gap-3">
                <Link href="/sign-up" className="rounded-full bg-[var(--accent)] px-6 py-3 font-medium text-white shadow-lg shadow-[var(--accent)]/20 transition hover:-translate-y-0.5 hover:brightness-110">
                  Create your shelf
                </Link>
                <Link href="/sign-in" className="rounded-full border border-[var(--border)] bg-[var(--surface)] px-6 py-3 font-medium transition hover:-translate-y-0.5">
                  I already have an account
                </Link>
              </div>
              <p className="mt-5 text-xs text-[var(--muted)]">V0 • Email & password authentication • Google login can be added later</p>
            </div>

            <div className="relative">
              <div className="rounded-[2rem] border border-[var(--border)] bg-[var(--surface)] p-4 shadow-2xl shadow-black/10 backdrop-blur">
                <div className="rounded-[1.5rem] border border-[var(--border)] bg-[var(--background)] p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted)]">Wednesday</p>
                      <h2 className="mt-1 text-2xl font-semibold">October 1, 2026</h2>
                    </div>
                    <div className="grid size-12 place-items-center rounded-2xl bg-amber-400/10 text-2xl">☀️</div>
                  </div>
                  <div className="mt-8 space-y-3">
                    {[
                      ["09:10", "Started something worth building", "Work"],
                      ["13:40", "A good lunch and a better conversation", "Life"],
                      ["19:25", "Wrote down what I want tomorrow to feel like", "Reflection"],
                    ].map(([time, title, tag]) => (
                      <div key={time} className="flex gap-4 rounded-2xl border border-[var(--border)] p-4">
                        <span className="pt-0.5 text-xs text-[var(--muted)]">{time}</span>
                        <div className="min-w-0 flex-1">
                          <p className="font-medium">{title}</p>
                          <span className="mt-2 inline-block rounded-full bg-[var(--accent)]/10 px-2.5 py-1 text-[11px] text-[var(--accent)]">{tag}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-5 grid grid-cols-3 gap-3 text-center text-xs">
                    <div className="rounded-2xl border border-[var(--border)] p-3"><div className="text-lg">😊</div><span className="text-[var(--muted)]">Mood</span></div>
                    <div className="rounded-2xl border border-[var(--border)] p-3"><div className="text-lg">⚡</div><span className="text-[var(--muted)]">Energy</span></div>
                    <div className="rounded-2xl border border-[var(--border)] p-3"><div className="text-lg">✓</div><span className="text-[var(--muted)]">Wins</span></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <footer className="border-t border-[var(--border)] py-5 text-xs text-[var(--muted)]">
          Private by design. Your journal belongs to you.
        </footer>
      </section>
    </main>
  );
}
