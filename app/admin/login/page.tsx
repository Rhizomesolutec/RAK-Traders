"use client";

import Image from "next/image";
import { useActionState } from "react";
import { loginAdmin } from "@/app/actions/admin";
import { COMPANY } from "@/lib/company";

export default function AdminLoginPage() {
  const [state, action, pending] = useActionState(loginAdmin, {});
  return (
    <main className="flex min-h-svh items-center justify-center bg-[#f4f5f7] px-4 py-8">
      <div className="grid w-full max-w-4xl overflow-hidden rounded-xl border border-[#e4e7ec] bg-white shadow-[0_16px_40px_rgba(31,41,51,0.12)] md:grid-cols-[0.9fr_1.1fr]">
        <div className="relative flex min-h-52 flex-col justify-end overflow-hidden bg-[#1f2933] px-6 py-7 text-white md:min-h-[28rem] md:px-8 md:py-10">
          <Image
            src="/images/products/moti/Cutout_Moti.png"
            alt=""
            fill
            priority
            className="object-contain object-bottom opacity-35"
            sizes="(max-width: 768px) 100vw, 420px"
          />
          <div className="relative">
            <p className="text-xs font-semibold tracking-[0.2em] text-white/80 uppercase">{COMPANY.brand}</p>
            <h1 className="mt-2 text-3xl font-semibold leading-tight">Admin sign in</h1>
            <p className="mt-3 max-w-xs text-sm leading-6 text-white/80">
              Manage grades, today’s rates, orders, dispatch, and delivery PIN codes.
            </p>
          </div>
        </div>
        <form action={action} className="grid content-center gap-4 p-6 sm:p-8">
          <div>
            <p className="text-sm font-semibold tracking-wide text-forest uppercase">{COMPANY.legalName}</p>
            <p className="mt-1 text-sm text-muted">Use the admin email and password for this shop.</p>
          </div>
          {state.error ? <p className="rounded-lg bg-[#fdecec] px-4 py-3 text-sm text-[#b91c1c]">{state.error}</p> : null}
          <label className="field">
            <span>Email</span>
            <input name="email" type="email" autoComplete="username" required placeholder="admin@raktraders.local" />
          </label>
          <label className="field">
            <span>Password</span>
            <input name="password" type="password" autoComplete="current-password" required placeholder="Password" />
          </label>
          <button className="btn btn-primary mt-1 w-full" type="submit" disabled={pending}>
            {pending ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>
    </main>
  );
}
