"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

const items = [
  { href: "/dashboard", label: "Overview", icon: "⌂" },
  { href: "/today", label: "Today", icon: "✦" },
  { href: "/planning", label: "Planning", icon: "✓" },
  { href: "/goals", label: "Goals", icon: "◎" },
  { href: "/habits", label: "Habits", icon: "↗" },
  { href: "/calendar", label: "Calendar", icon: "□" },
  { href: "/insights", label: "Insights", icon: "◒" },
];

export function AppNav({ user }: { user: { name: string; email?: string } }) {
  const pathname = usePathname();
  const router = useRouter();

  async function signOut() {
    await authClient.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <>
      <aside className="hidden lg:flex fixed inset-y-0 left-0 z-30 w-64 flex-col border-r border-[var(--border)] bg-[var(--surface)]/90 px-4 py-5 backdrop-blur-xl">
        <Link href="/dashboard" className="flex items-center gap-3 px-3 py-2">
          <span className="grid size-9 place-items-center rounded-xl bg-[var(--accent)] text-sm font-bold text-white shadow-lg shadow-[var(--accent)]/20">D</span>
          <div><div className="font-semibold tracking-tight">DayShelf</div><div className="text-[10px] uppercase tracking-[.18em] text-[var(--muted)]">Your life, archived</div></div>
        </Link>
        <nav className="mt-8 space-y-1">
          {items.map((item) => {
            const active = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href + "/"));
            return <Link key={item.href} href={item.href} className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition ${active ? "bg-[var(--accent)]/10 font-medium text-[var(--accent)]" : "text-[var(--muted)] hover:bg-[var(--background)] hover:text-[var(--foreground)]"}`}><span className="grid size-6 place-items-center text-xs">{item.icon}</span>{item.label}</Link>;
          })}
        </nav>
        <div className="mt-auto rounded-2xl border border-[var(--border)] bg-[var(--background)] p-3">
          <p className="truncate text-sm font-medium">{user.name}</p>
          {user.email && <p className="mt-0.5 truncate text-xs text-[var(--muted)]">{user.email}</p>}
          <button onClick={signOut} className="mt-3 text-xs text-[var(--muted)] hover:text-[var(--foreground)]">Sign out</button>
        </div>
      </aside>

      <div className="lg:hidden sticky top-0 z-30 border-b border-[var(--border)] bg-[var(--surface)]/90 px-4 py-3 backdrop-blur-xl">
        <div className="flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2 font-semibold"><span className="grid size-8 place-items-center rounded-lg bg-[var(--accent)] text-xs font-bold text-white">D</span>DayShelf</Link>
          <button onClick={signOut} className="rounded-full border border-[var(--border)] px-3 py-1.5 text-xs">Sign out</button>
        </div>
        <nav className="mt-3 flex gap-1 overflow-x-auto pb-0.5">
          {items.map((item) => <Link key={item.href} href={item.href} className={`shrink-0 rounded-full px-3 py-1.5 text-xs ${pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href + "/")) ? "bg-[var(--accent)]/10 text-[var(--accent)]" : "text-[var(--muted)]"}`}>{item.label}</Link>)}
        </nav>
      </div>
    </>
  );
}
