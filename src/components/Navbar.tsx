"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuthUser } from "@/hooks/useAuthUser";
import { signOut } from "@/services/auth";
import { Menu, X, LogOut, LogIn } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { AnimatedTab } from "@/components/AnimatedTab";

type TabItem = { label: string; href: string };

export default function Navbar() {
  const { user } = useAuthUser();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const [slider, setSlider] = useState({ left: 0, width: 0, opacity: 0 });
  const listRef = useRef<HTMLUListElement>(null);

  const tabs: TabItem[] = [
    { label: "Profile", href: "/profile" },
    { label: "Horoscope", href: "/horoscope" },
    { label: "Chat", href: "/chat" },
  ];

  const snapToActive = () => {
    if (!listRef.current) return;
    const items = Array.from(listRef.current.children) as HTMLLIElement[];
    const idx = tabs.findIndex((t) => pathname?.startsWith(t.href));
    if (idx >= 0 && items[idx]) {
      const el = items[idx];
      const { width } = el.getBoundingClientRect();
      setSlider({ left: el.offsetLeft, width, opacity: 1 });
    } else {
      setSlider((p) => ({ ...p, opacity: 0 }));
    }
  };

  useEffect(() => {
    setOpen(false);
    snapToActive();
    const onResize = () => snapToActive();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [pathname]);

  return (
    <header className="fixed top-0 z-50 w-full">
      <div className="mx-auto max-w-6xl items-center px-4">
        <div className="mt-3 rounded-full border border-gray-800 bg-[#151517]/20 px-4 py-3 shadow-lg backdrop-blur">
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="flex items-center gap-2 font-semibold tracking-tight"
            >
              <span className="text-lg sm:text-xl text-neutral-300">
                COSMICLY
              </span>
            </Link>

            {user ? (
              <nav className="relative mx-2 hidden md:block">
                <ul
                  ref={listRef}
                  onMouseLeave={() =>
                    setSlider((prev) => ({ ...prev, opacity: 0 }))
                  }
                  className="relative flex items-center gap-1"
                >
                  <motion.div
                    className="absolute inset-y-1 rounded-full bg-white shadow-sm"
                    animate={slider}
                    transition={{ type: "spring", stiffness: 420, damping: 36 }}
                  />
                  {tabs.map((t) => (
                    <AnimatedTab
                      key={t.href}
                      label={t.label}
                      href={t.href}
                      setPosition={({ left, width, opacity }) =>
                        setSlider({ left, width, opacity })
                      }
                    />
                  ))}
                </ul>
              </nav>
            ) : null}

            <div className="flex items-center gap-2">
              <div className="hidden md:flex">
                {user ? (
                  <button
                    onClick={() => signOut()}
                    className="inline-flex items-center gap-2 rounded-lg border border-white px-4 py-2 text-md font-medium shadow-sm transition-all duration-200 hover:bg-white hover:text-black"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign out
                  </button>
                ) : (
                  <Link
                    href="/login"
                    className="inline-flex items-center gap-2 rounded-lg border border-white px-4 py-2 text-md font-medium shadow-sm transition-all duration-200 hover:bg-white hover:text-black"
                  >
                    <LogIn className="h-4 w-4" />
                    Sign in
                  </Link>
                )}
              </div>

              <button
                className="inline-flex h-10 w-10 items-center justify-center rounded-xl ring-1 ring-neutral-200/70 hover:bg-neutral-50 md:hidden"
                onClick={() => setOpen((v) => !v)}
                aria-label="Toggle menu"
                aria-expanded={open}
              >
                {open ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            key="mobile-drawer"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 90, damping: 18 }}
            className="fixed right-0 top-0 z-40 h-screen w-[88%] max-w-sm bg-white/5 p-6 backdrop-blur md:hidden"
          >
            <div className="mb-6 flex items-center justify-between">
              <Link
                href="/"
                className="flex items-center gap-2 font-semibold tracking-tight"
                onClick={() => setOpen(false)}
              >
                <span className="text-lg">COSMICLY</span>
              </Link>
              <button
                onClick={() => setOpen(false)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-xl ring-1 ring-neutral-200/70"
                aria-label="Close menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <ul className="flex flex-col gap-2">
              {tabs.map((t, i) => (
                <motion.li
                  key={t.href}
                  initial={{ x: 12, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.04 * i }}
                >
                  <Link
                    href={t.href}
                    onClick={() => setOpen(false)}
                    className="block rounded-xl bg-white text-black px-4 py-3 text-sm font-medium ring-1 ring-black/10"
                  >
                    {t.label}
                  </Link>
                </motion.li>
              ))}

              <motion.li
                initial={{ x: 12, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                {user ? (
                  <button
                    onClick={() => {
                      setOpen(false);
                      signOut();
                    }}
                    className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-black px-4 py-3 text-sm font-medium text-white shadow-sm"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign out
                  </button>
                ) : (
                  <Link
                    href="/login"
                    onClick={() => setOpen(false)}
                    className="mt-2 block rounded-xl bg-black px-4 py-3 text-sm font-medium text-white shadow-sm"
                  >
                    <LogIn className="mr-2 inline h-4 w-4" />
                    Sign in
                  </Link>
                )}
              </motion.li>
            </ul>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
