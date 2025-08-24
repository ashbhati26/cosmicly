"use client";

import { ChevronDown } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { twMerge } from "tailwind-merge";

const faqs = [
  {
    question: "Who is this website designed for?",
    answer:
      "Our astrology platform is created for anyone seeking cosmic guidance — from beginners curious about horoscopes to astrology enthusiasts exploring charts, transits, and compatibility.",
  },
  {
    question: "What features does the platform offer?",
    answer:
      "We provide daily and weekly horoscopes, detailed birth charts, compatibility reports, personalized insights, tarot pulls, and resources to help you understand your zodiac sign and planetary influences.",
  },
  {
    question: "Do I need to sign in to use the website?",
    answer:
      "You can read daily horoscopes without signing in, but creating an account lets you unlock full features such as saving your birth chart, tracking transits, and accessing personalized insights.",
  },
  {
    question: "Is this platform free to use?",
    answer:
      "Yes! Many core features like horoscopes and basic charts are free. Premium features such as advanced reports, tarot readings, and unlimited compatibility checks are available in our Pro plan.",
  },
  {
    question: "Can I share my astrology insights with others?",
    answer:
      "Absolutely! You can share compatibility reports or daily horoscopes with friends, and even export personalized astrology reports for guidance.",
  },
];



export default function Faqs() {
  const [selectedIndex, setSelectedIndex] = useState(0);

  return (
    <section className="py-16 px-4 flex justify-center">
      <div className="container">
        <h1 className="relative z-10 text-4xl md:text-7xl bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-neutral-600 text-center font-sans font-bold">
          Questions? We&apos;ve got <br /> answers
        </h1>
        <div className="mt-12 px-2 flex flex-col gap-6 max-w-xl mx-auto cursor-pointer">
          {faqs.map((faq, faqIndex) => (
            <div
              key={faq.question}
              className="bg-neutral-900 rounded-2xl border border-white/10 p-6"
            >
              <div
                className="flex justify-between items-center"
                onClick={() => setSelectedIndex(faqIndex)}
              >
                <h3 className="font-medium">{faq.question}</h3>
                <ChevronDown
                  className={twMerge(
                    "text-[#3A5EFF] flex-shrink-0 transi duration-300",
                    selectedIndex === faqIndex && "rotate-180"
                  )}
                />
              </div>
              <AnimatePresence>
                {selectedIndex === faqIndex && (
                  <motion.div
                    initial={{
                      height: 0,
                      marginTop: 0,
                    }}
                    animate={{
                      height: "auto",
                      marginTop: 24,
                    }}
                    exit={{
                      height: 0,
                      marginTop: 0,
                    }}
                    className={twMerge("overflow-hidden")}
                  >
                    <p className="text-white/50">{faq.answer}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
