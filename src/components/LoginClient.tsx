"use client";

import { useState } from "react";
import { signIn, signUp } from "@/services/auth";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthUser } from "@/hooks/useAuthUser";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

export function LoginClient() {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [busy, setBusy] = useState(false);
  const { user } = useAuthUser();
  const router = useRouter();
  const sp = useSearchParams();

  const goNext = () => router.push(sp.get("next") || "/profile");

  const onSubmit = async () => {
    try {
      setBusy(true);
      if (mode === "signup") await signUp(email, pass);
      else await signIn(email, pass);
      goNext();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Auth error";
      alert(msg);
    } finally {
      setBusy(false);
    }
  };

  if (user) {
    goNext();
    return null;
  }

  return (
    <div className="min-h-screen w-full bg-neutral-950 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 120, damping: 16 }}
        className="grid w-full max-w-5xl grid-cols-1 overflow-hidden rounded-3xl border shadow-xl border-neutral-800 bg-neutral-900 md:grid-cols-2"
      >
        <div className="relative p-6 sm:p-10">
          <div className="pointer-events-none absolute inset-0 [mask-image:radial-gradient(350px_200px_at_20%_15%,#000_40%,transparent_70%)]">
            <div className="h-full w-full bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:16px_16px]" />
          </div>

          <div className="relative z-10 flex items-center justify-between">
            <motion.span
              key={mode}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="rounded-full border px-3 py-1 text-xs font-semibold tracking-wide backdrop-blur border-neutral-700 text-neutral-200"
            >
              {mode === "signup" ? "SIGN UP" : "SIGN IN"}
            </motion.span>

            <div className="relative inline-flex rounded-xl p-1 bg-neutral-800">
              {(["signin", "signup"] as const).map((m) => {
                const active = mode === m;
                return (
                  <button
                    key={m}
                    onClick={() => setMode(m)}
                    className="relative z-10 rounded-lg px-3 py-1.5 text-xs font-semibold uppercase transition-colors text-neutral-300 data-[active=true]:text-white"
                    data-active={active}
                  >
                    {active && (
                      <motion.span
                        layoutId="tab-pill"
                        className="absolute inset-0 -z-10 rounded-lg shadow-sm bg-neutral-700"
                        transition={{ type: "spring", stiffness: 500, damping: 35 }}
                      />
                    )}
                    {m === "signin" ? "Sign in" : "Sign up"}
                  </button>
                );
              })}
            </div>
          </div>

          <motion.div
            key={`title-${mode}`}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="relative z-10 mt-8 space-y-2"
          >
            <h1 className="text-3xl font-bold tracking-tight text-white">Welcome!</h1>
            <p className="text-sm text-neutral-300">
              {mode === "signup"
                ? "Create your account with email and password."
                : "Sign in with your email and password to continue."}
            </p>
          </motion.div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              onSubmit();
            }}
            className="relative z-10 mt-6 space-y-4"
          >
            <label className="mb-1 block text-xs font-medium text-neutral-300">Email</label>
            <motion.input
              whileFocus={{ scale: 1.01 }}
              className="w-full rounded-xl border px-3 py-2.5 text-sm outline-none transition placeholder:text-neutral-400 border-neutral-700 bg-neutral-800/70 text-neutral-100"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />

            <label className="mb-1 mt-2 block text-xs font-medium text-neutral-300">Password</label>
            <motion.input
              whileFocus={{ scale: 1.01 }}
              type="password"
              className="w-full rounded-xl border px-3 py-2.5 text-sm outline-none transition placeholder:text-neutral-400 border-neutral-700 bg-neutral-800/70 text-neutral-100"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              placeholder="••••••••"
            />

            <motion.button
              type="submit"
              disabled={busy}
              whileTap={{ scale: 0.98 }}
              className="mt-4 w-full rounded-xl px-4 py-2.5 text-sm font-semibold shadow-sm transition disabled:opacity-60 bg-white text-neutral-900"
            >
              {busy ? "Please wait…" : mode === "signup" ? "Create account" : "Sign in"}
            </motion.button>
          </form>

          <div className="relative z-10 mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-neutral-400">
            <a href="#" className="hover:underline">Privacy</a>
            <a href="#" className="hover:underline">Terms</a>
            <span className="text-neutral-400">•</span>
            <a href="#" className="hover:underline">Twitter</a>
            <a href="#" className="hover:underline">Discord</a>
          </div>
        </div>

        <div className="relative hidden md:block">
          <AnimatePresence mode="wait">
            <motion.div
              key={mode}
              initial={{ opacity: 0, scale: 1.02 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              transition={{ duration: 0.35 }}
              className="absolute inset-0"
            >
              <Image src="/02.jpg" alt="Scifi landscape" fill priority className="object-cover" />
              <div className="absolute inset-0 rounded-3xl bg-black/25 mix-blend-multiply" />
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
