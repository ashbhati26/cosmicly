"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AuthGate from "@/components/AuthGate";
import { useAuthUser } from "@/hooks/useAuthUser";
import { db } from "@/services/firebase";
import { getHoroscope, Period } from "@/services/horoscope";
import {
  doc,
  getDoc,
  addDoc,
  collection,
  serverTimestamp,
} from "firebase/firestore";
import AstroChart from "@/components/AstroChart";
import { Loader2, Star, Save } from "lucide-react";

export default function Page() {
  return (
    <AuthGate>
      <HoroscopeInner />
    </AuthGate>
  );
}

function HoroscopeInner() {
  const { user } = useAuthUser();

  const [period, setPeriod] = useState<Period>("daily");
  const [sign, setSign] = useState<string>("Aries");
  const [natalISO, setNatalISO] = useState<string | undefined>(undefined);
  const [content, setContent] = useState<string>("Loading…");
  const [loading, setLoading] = useState<boolean>(true);
  const [fetching, setFetching] = useState<boolean>(false);

  const canSave = Boolean(user);

  useEffect(() => {
    let alive = true;
    (async () => {
      if (!user) return setLoading(false);
      try {
        const snap = await getDoc(doc(db, "users", user.uid));
        const data = snap.data() as
          | { zodiacSign?: string; dob?: string; time?: string }
          | undefined;

        const s = data?.zodiacSign || "Aries";
        if (alive) setSign(s);

        const dob = data?.dob;
        const time = data?.time;
        if (dob && time) {
          const iso = `${dob}T${time}:00`;
          if (alive) setNatalISO(iso);
        } else {
          if (alive) setNatalISO(undefined);
        }
      } catch {
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [user]);

  useEffect(() => {
    let alive = true;
    if (loading) return;
    setFetching(true);
    (async () => {
      try {
        const h = await getHoroscope(sign, period, natalISO);
        if (alive) setContent(h.content);
      } catch {
        if (alive)
          setContent("Couldn't generate horoscope right now. Please try again.");
      } finally {
        if (alive) setFetching(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [sign, period, natalISO, loading]);

  const title = useMemo(
    () => `${sign} — ${period[0].toUpperCase()}${period.slice(1)}`,
    [sign, period]
  );

  const saveReport = async () => {
    if (!user) return;
    try {
      await addDoc(collection(db, "horoscopes", user.uid, "items"), {
        period,
        sign,
        content,
        createdAt: serverTimestamp(),
      });
      alert("Saved report ✅");
    } catch (e: any) {
      alert(e?.message || "Failed to save report");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen w-full bg-neutral-950 flex items-center justify-center p-6">
        <div className="inline-flex items-center gap-2 text-neutral-300">
          <Loader2 className="h-4 w-4 animate-spin" />
          Loading your profile…
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-neutral-950 flex flex-col items-center px-4 py-10">
      <div className="mb-6 flex w-full max-w-3xl flex-col items-center gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-2 rounded-full border border-neutral-800 bg-neutral-900 px-3 py-1 text-xs font-semibold text-white">
            <Star className="h-3.5 w-3.5" />
            {sign}
          </span>
          <span className="inline-flex items-center rounded-full border border-neutral-800 bg-neutral-900 px-3 py-1 text-[11px] font-medium text-neutral-300">
            IST • UTC+05:30
          </span>
        </div>

        <div className="relative inline-flex rounded-xl bg-neutral-800 p-1">
          {(["daily", "weekly", "monthly"] as Period[]).map((p) => {
            const active = period === p;
            return (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className="relative z-10 rounded-lg px-4 py-1.5 text-sm font-medium capitalize text-neutral-300 data-[active=true]:text-white"
                data-active={active}
              >
                {active && (
                  <motion.span
                    layoutId="horoscope-pill"
                    className="absolute inset-0 -z-10 rounded-lg bg-neutral-700 shadow-sm"
                    transition={{ type: "spring", stiffness: 500, damping: 35 }}
                  />
                )}
                {p}
              </button>
            );
          })}
        </div>
      </div>

      <motion.div
        key={period + sign}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 140, damping: 20 }}
        className="w-full max-w-3xl"
      >
        <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-5 shadow-xl">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">
              {title}
              {fetching && (
                <span className="ml-2 align-middle text-xs font-normal text-neutral-400">
                  · updating…
                </span>
              )}
            </h3>
            {canSave && (
              <motion.button
                whileTap={{ scale: 0.96 }}
                onClick={saveReport}
                className="inline-flex items-center gap-2 rounded-lg bg-white px-3 py-1.5 text-xs font-semibold text-neutral-900 shadow-sm hover:opacity-95"
              >
                <Save className="h-4 w-4" />
                Save
              </motion.button>
            )}
          </div>

          <div className="relative">
            <AnimatePresence mode="wait">
              {fetching ? (
                <motion.div
                  key="skel"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-3"
                >
                  <div className="h-3 w-5/6 rounded bg-neutral-800" />
                  <div className="h-3 w-11/12 rounded bg-neutral-800" />
                  <div className="h-3 w-4/5 rounded bg-neutral-800" />
                  <div className="h-3 w-2/3 rounded bg-neutral-800" />
                </motion.div>
              ) : (
                <motion.p
                  key="content"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  className="whitespace-pre-line leading-7 text-neutral-100"
                >
                  {content}
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 140, damping: 20, delay: 0.05 }}
        className="mt-8 w-full max-w-3xl"
      >
        <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-5 shadow-xl">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">Natal Chart</h3>
            <span className="text-xs text-neutral-400">
              {natalISO ? `Based on ${natalISO} (IST)` : "Birth details missing"}
            </span>
          </div>

          {natalISO ? (
            <div className="overflow-hidden rounded-xl ring-1 ring-neutral-800">
              <AstroChart natalISO={natalISO} />
            </div>
          ) : (
            <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-6 text-sm text-neutral-400">
              Add your date & time of birth in your profile to see your chart.
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
