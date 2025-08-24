"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Spotlight } from "../_components/Spotlight";

export function HeroSection() {
  return (
    <div className="relative mx-auto my-10 flex max-w-7xl flex-col items-center justify-center">
      <Spotlight className="-top-40 left-0 md:-top-20 md:left-60" fill="blue" />
      <div className="px-4 py-10 md:py-20">
        <h1 className="relative z-10 mx-auto max-w-4xl text-center font-bold text-4xl md:text-7xl font-sans">
          {"Discover Your Cosmic Path".split(" ").map((word, index) => (
            <motion.span
              key={index}
              initial={{ opacity: 0, filter: "blur(4px)", y: 10 }}
              animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
              transition={{
                duration: 0.3,
                delay: index * 0.1,
                ease: "easeInOut",
              }}
              className="mr-2 inline-block bg-clip-text text-transparent bg-gradient-to-b from-neutral-100 to-neutral-400"
            >
              {word}
            </motion.span>
          ))}
        </h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.8 }}
          className="relative z-10 mx-auto max-w-xl py-4 text-center text-lg font-normal text-neutral-400"
        >
          With astrology, uncover the wisdom of the stars. Get daily guidance,
          zodiac insights, and personalized reports designed to illuminate your
          journey.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 1 }}
          className="relative z-10 mt-8 flex flex-wrap items-center justify-center gap-4"
        >
          <Link
            href="/login"
            className="w-60 transform rounded-lg px-6 py-2 text-center font-medium transition-all duration-300 hover:-translate-y-0.5 bg-white text-black hover:bg-gray-200"
          >
            Login
          </Link>
          <Link
            href="/#contact"
            className="w-60 transform rounded-lg border px-6 py-2 text-center font-medium text-white transition-all duration-300 hover:-translate-y-0.5 border-gray-700"
          >
            Contact Support
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
