"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { db } from "@/services/firebase";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { useAuthUser } from "@/hooks/useAuthUser";
import { useEffect, useState } from "react";
import { SIGNS, inferSignFromDate } from "@/lib/zodiac";
import { Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

const TZ_OPTS = ["UTC+05:30"] as const;

const schema = z.object({
  name: z.string().min(2, "Enter your name"),
  dob: z.string().min(1, "Pick date"),
  time: z.string().regex(/^\d{2}:\d{2}$/, "Use HH:mm"),
  place: z.string().min(2, "Enter birthplace"),
  timezone: z.enum(TZ_OPTS),
  zodiacSign: z.enum(SIGNS),
});
type FormValues = z.infer<typeof schema>;

type UserProfileDoc = {
  name?: string;
  dob?: string;    // "YYYY-MM-DD"
  time?: string;   // "HH:mm"
  place?: string;
  timezone?: (typeof TZ_OPTS)[number];
  zodiacSign?: (typeof SIGNS)[number];
  createdAt?: unknown;
  updatedAt?: unknown;
};

export default function BirthForm() {
  const { user } = useAuthUser();
  const [loading, setLoading] = useState(true);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { timezone: "UTC+05:30" },
  });

  useEffect(() => {
    let alive = true;
    (async () => {
      if (!user) return setLoading(false);
      const ref = doc(db, "users", user.uid);
      const snap = await getDoc(ref);
      if (alive && snap.exists()) {
        const data = snap.data() as Partial<UserProfileDoc>;
        const preloadKeys: Array<keyof FormValues> = ["name", "dob", "time", "place"];
        preloadKeys.forEach((k) => {
          const val = data[k];
          setValue(k, (typeof val === "string" ? val : "") as FormValues[typeof k]);
        });
        // lock to IST for now
        setValue("timezone", "UTC+05:30");
        if (data.zodiacSign) setValue("zodiacSign", data.zodiacSign);
      }
      setLoading(false);
    })();
    return () => {
      alive = false;
    };
  }, [user, setValue]);

  const dob = watch("dob");
  useEffect(() => {
    if (!dob) return;
    setValue("zodiacSign", inferSignFromDate(new Date(dob)));
  }, [dob, setValue]);

  const onSubmit = async (v: FormValues) => {
    if (!user) return;
    await setDoc(
      doc(db, "users", user.uid),
      {
        ...v,
        timezone: "UTC+05:30",
        updatedAt: serverTimestamp(),
        createdAt: serverTimestamp(),
      },
      { merge: true }
    );
    alert("Profile saved ✅");
  };

  if (loading) {
    return (
      <div className="flex h-48 items-center justify-center text-neutral-400">
        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Loading…
      </div>
    );
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
            <div className="h-full w-full bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.06)_1px,transparent_1px)] [background-size:16px_16px]" />
          </div>

          <motion.h2
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative z-10 text-2xl font-bold text-white"
          >
            Birth Details
          </motion.h2>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="relative z-10 mt-6 space-y-5"
          >
            <div>
              <label className="mb-1 block text-xs font-medium text-neutral-300">
                Name
              </label>
              <motion.input
                whileFocus={{ scale: 1.01 }}
                className="w-full rounded-xl border border-neutral-700 bg-neutral-800/70 px-3 py-2.5 text-sm text-white outline-none placeholder:text-neutral-400"
                {...register("name")}
                placeholder="Your full name"
              />
              {errors.name && (
                <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>
              )}
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-neutral-300">
                Date of Birth
              </label>
              <motion.input
                whileFocus={{ scale: 1.01 }}
                type="date"
                className="w-full rounded-xl border border-neutral-700 bg-neutral-800/70 px-3 py-2.5 text-sm text-white outline-none"
                {...register("dob")}
              />
              {errors.dob && (
                <p className="mt-1 text-xs text-red-500">{errors.dob.message}</p>
              )}
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-neutral-300">
                Time (HH:mm)
              </label>
              <motion.input
                whileFocus={{ scale: 1.01 }}
                type="time"
                className="w-full rounded-xl border border-neutral-700 bg-neutral-800/70 px-3 py-2.5 text-sm text-white outline-none"
                {...register("time")}
              />
              {errors.time && (
                <p className="mt-1 text-xs text-red-500">{errors.time.message}</p>
              )}
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-neutral-300">
                Place
              </label>
              <motion.input
                whileFocus={{ scale: 1.01 }}
                className="w-full rounded-xl border border-neutral-700 bg-neutral-800/70 px-3 py-2.5 text-sm text-white outline-none placeholder:text-neutral-400"
                {...register("place")}
                placeholder="City, Country"
              />
              {errors.place && (
                <p className="mt-1 text-xs text-red-500">{errors.place.message}</p>
              )}
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-neutral-300">
                Timezone
              </label>
              <input
                className="w-full rounded-xl border border-neutral-700 bg-neutral-800/70 px-3 py-2.5 text-sm text-white outline-none"
                value="UTC+05:30 (India Standard Time)"
                disabled
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-neutral-300">
                Zodiac Sign
              </label>
              <select
                className="w-full rounded-xl border border-neutral-700 bg-neutral-800/70 px-3 py-2.5 text-sm text-white outline-none"
                {...register("zodiacSign")}
              >
                <option value="" disabled>
                  Select your sign
                </option>
                {SIGNS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
              {errors.zodiacSign && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.zodiacSign.message}
                </p>
              )}
            </div>

            <motion.button
              type="submit"
              disabled={isSubmitting}
              whileTap={{ scale: 0.98 }}
              className="mt-2 w-full rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-neutral-900 shadow-sm transition disabled:opacity-60"
            >
              {isSubmitting ? "Saving…" : "Save"}
            </motion.button>
          </form>
        </div>

        <div className="relative hidden md:block">
          <AnimatePresence mode="wait">
            <motion.div
              key="birth-art"
              initial={{ opacity: 0, scale: 1.02 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              transition={{ duration: 0.35 }}
              className="absolute inset-0"
            >
              <Image
                src="/01.jpg"
                alt="Zodiac"
                fill
                priority
                className="object-cover"
              />
              <div className="absolute inset-0 rounded-3xl bg-black/40 mix-blend-multiply" />
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
