"use client";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";
export function SignOutButton(){const[loading,setLoading]=useState(false);async function handle(){setLoading(true);try{await authClient.signOut();window.location.href="/sign-in"}finally{setLoading(false)}}return <button onClick={handle} disabled={loading} className="rounded-full border border-[var(--border)] px-4 py-2 text-sm font-medium transition hover:bg-[var(--surface)] disabled:opacity-50">{loading?"Signing out…":"Sign out"}</button>}
