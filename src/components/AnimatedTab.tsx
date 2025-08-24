"use client";

import Link from "next/link";
import { useRef } from "react";

interface AnimatedTabProps {
  label: string;
  href: string;
  setPosition: (pos: { left: number; width: number; opacity: number }) => void;
}

export const AnimatedTab = ({ label, href, setPosition }: AnimatedTabProps) => {
  const ref = useRef<HTMLLIElement>(null);

  return (
    <li
      ref={ref}
      onMouseEnter={() => {
        if (!ref.current) return;
        const { width } = ref.current.getBoundingClientRect();
        setPosition({
          left: ref.current.offsetLeft,
          width,
          opacity: 1,
        });
      }}
      className="relative z-10 cursor-pointer px-4 py-2 md:px-6 md:py-3 text-sm md:text-base uppercase font-semibold hover:text-[#101010] transition-all"
    >
      <Link href={href} className="font-medium">
        {label}
      </Link>
    </li>
  );
};
