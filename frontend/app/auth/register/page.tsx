"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import { api } from "@/lib/api";
import { setToken } from "@/lib/auth";

function getApiErrorMessage(detail: unknown, fallback: string): string {
  if (typeof detail === "string" && detail.trim()) return detail;
  if (Array.isArray(detail) && detail.length > 0) {
    const first = detail[0];
    if (typeof first === "string" && first.trim()) return first;
    if (first && typeof first === "object" && "msg" in first) {
      const msg = (first as { msg?: unknown }).msg;
      if (typeof msg === "string" && msg.trim()) return msg;
    }
  }
  return fallback;
}

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);
    try {
      await api.post("/auth/register", { name, email, password, risk_profile: "medium" });
      const login = await api.post<{ access_token: string }>("/auth/login", { email, password });
      setToken(login.data.access_token);
      router.push("/swipe");
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const message = getApiErrorMessage(err.response?.data?.detail, "Sign up failed. Please verify your details.");
        setError(message);
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md items-center p-6">
      <form onSubmit={onSubmit} className="glass-panel w-full space-y-3 rounded-3xl p-6">
        <h1 className="mb-1 text-3xl font-semibold tracking-tight">Create account</h1>
        <p className="mb-4 text-sm text-slate-400">Set up your profile and get your first AI-curated deck.</p>
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" className="input-premium" />
        <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="input-premium" />
        <input value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" type="password" className="input-premium" />
        {error ? <p className="text-sm text-rose-400">{error}</p> : null}
        <button disabled={isSubmitting} className="w-full rounded-xl bg-gradient-to-r from-violet-500 to-cyan-400 px-4 py-2 font-semibold text-black disabled:cursor-not-allowed disabled:opacity-60">
          {isSubmitting ? "Creating account..." : "Register"}
        </button>
        <button type="button" className="w-full rounded-xl border border-white/20 bg-white/[0.03] px-4 py-2">
          Continue with Google
        </button>
        <Link href="/auth/login" className="block w-full rounded-xl border border-white/20 px-4 py-2 text-center">
          Login
        </Link>
      </form>
    </main>
  );
}
