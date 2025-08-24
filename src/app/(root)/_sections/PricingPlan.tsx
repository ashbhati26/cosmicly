"use client";

import React from "react";
import { Check } from "lucide-react";

interface PricingPlan {
  name: string;
  price: number;
  period: string;
  description: string;
  buttonText: string;
  buttonVariant: "outline" | "primary";
  isPopular?: boolean;
  features: string[];
}

const PricingComponent: React.FC = () => {
  const plans: PricingPlan[] = [
    {
      name: "Stargazer (Free)",
      price: 0,
      period: "per month",
      description: "Start your cosmic journey with essential guidance.",
      buttonText: "Begin for Free",
      buttonVariant: "outline",
      features: [
        "Daily horoscope for your Sun sign",
        "Weekly cosmic insights",
        "1 compatibility check / month",
        "Basic birth chart (whole-sign)",
        "Save up to 3 profiles",
      ],
    },
    {
      name: "Astro Pro",
      price: 19,
      period: "per month",
      description: "Deeper charts, personal transit alerts, and more.",
      buttonText: "Start Free Trial",
      buttonVariant: "primary",
      isPopular: true,
      features: [
        "Detailed birth chart with aspects & houses",
        "Personal transit alerts & reminders",
        "Unlimited compatibility reports",
        "Tarot 3-card daily pulls",
        "Ad-free experience",
        "Priority email support",
      ],
    },
  ];

  return (
    <div className="min-h-screen">
      <main className="px-8 py-16 max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="font-bold text-4xl md:text-7xl bg-clip-text text-transparent bg-gradient-to-b from-neutral-100 to-neutral-400">
            Pricing
          </h1>
          <p className="text-neutral-400 text-lg max-w-2xl mx-auto">
            Find your cosmic fit — from daily horoscopes to pro-level charts and
            insights.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-2xl p-8 border transition-all hover:scale-105 ${
                plan.isPopular
                  ? "border-green-500 bg-gradient-to-b from-green-900/20 to-transparent shadow-2xl shadow-green-500/20"
                  : "border-gray-800 bg-gray-900/50"
              }`}
            >
              {plan.isPopular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-green-500 text-black px-4 py-1 rounded-full text-sm font-medium">
                    Most Popular
                  </div>
                </div>
              )}

              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-2">{plan.name}</h3>
                <div className="flex items-baseline mb-2">
                  <span className="text-4xl font-bold">${plan.price}</span>
                  <span className="text-gray-400 ml-2">{plan.period}</span>
                </div>
                <p className="text-gray-400 text-sm">{plan.description}</p>
              </div>

              <button
                className={`w-full py-3 rounded-lg font-medium mb-6 transition-colors ${
                  plan.buttonVariant === "primary"
                    ? "bg-green-500 hover:bg-green-600 text-black"
                    : "border border-gray-600 hover:border-gray-500 text-white"
                }`}
              >
                {plan.buttonText}
              </button>

              <p className="text-gray-500 text-center text-sm mb-6">
                Billed monthly.
              </p>

              <div className="space-y-4">
                <p className="font-medium text-gray-300">
                  {plan.name.startsWith("Stargazer")
                    ? "Includes"
                    : `Everything in Stargazer, plus`}
                </p>
                <ul className="space-y-3">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start">
                      <Check className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-300 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default PricingComponent;
