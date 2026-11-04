"use client";

import { useActionState } from "react";
import { loginAdmin } from "@/app/actions/admin";

export default function AdminLoginPage() {
  const [state, action, pending] = useActionState(loginAdmin, {});
  return (
    <main className="section-wrap py-16">
      <form action={action} className="panel mx-auto grid max-w-md gap-4 p-6">
        <p className="text-sm font-semibold tracking-wide text-gold uppercase">RAK TRADERS</p>
        <h1 className="text-3xl font-semibold text-forest">Admin sign in</h1>
        {state.error ? <p className="rounded-xl bg-[#f8ece4] px-4 py-3">{state.error}</p> : null}
        <label className="field"><span>Email</span><input name="email" type="email" autoComplete="username" required /></label>
        <label className="field"><span>Password</span><input name="password" type="password" autoComplete="current-password" required /></label>
        <button className="btn btn-primary" type="submit" disabled={pending}>{pending ? "Signing in…" : "Sign in"}</button>
      </form>
    </main>
  );
}
