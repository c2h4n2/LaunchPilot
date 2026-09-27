"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const steps = [
  {
    key: "goal",
    title: "What do you want LaunchPilot to help you achieve?",
    subtitle: "Choose the outcome that matters most right now.",
    options: [
      "Build a side income",
      "Replace my job income",
      "Start my first business",
      "Build a scalable company",
    ],
  },
  {
    key: "skills",
    title: "What are you good at?",
    subtitle: "Choose the area that best represents your strongest skills.",
    options: [
      "Technology & AI",
      "Sales & marketing",
      "Design & creative",
      "Writing & content",
      "Business & operations",
      "Hands-on / local services",
    ],
  },
  {
    key: "interest",
    title: "What kind of business interests you?",
    subtitle: "We'll use this to narrow down opportunities you'll actually want to build.",
    options: [
      "AI / software",
      "Content & media",
      "E-commerce",
      "Affiliate marketing",
      "Digital products",
      "Services / agency",
      "I'm open to anything",
    ],
  },
  {
    key: "budget",
    title: "How much can you invest to get started?",
    subtitle: "We'll avoid opportunities that don't fit your starting budget.",
    options: ["$0 – $100", "$100 – $500", "$500 – $2,000", "$2,000+"],
  },
  {
    key: "time",
    title: "How much time can you commit each week?",
    subtitle: "Your opportunity should fit your real schedule.",
    options: ["Under 5 hours", "5 – 10 hours", "10 – 20 hours", "20+ hours"],
  },
  {
    key: "experience",
    title: "What's your business experience?",
    subtitle: "This helps us recommend the right level of complexity.",
    options: [
      "Complete beginner",
      "I've tried a few projects",
      "I've made money online",
      "I've run a business before",
    ],
  },
  {
    key: "model",
    title: "What kind of business would you prefer?",
    subtitle: "Pick the model that sounds most appealing.",
    options: [
      "Mostly automated",
      "Work directly with customers",
      "Build an audience",
      "Sell products",
      "No preference",
    ],
  },
  {
    key: "income",
    title: "What's your monthly income goal?",
    subtitle: "We'll prioritize opportunities capable of reaching your target.",
    options: ["$500+", "$1,000+", "$3,000+", "$5,000+", "$10,000+"],
  },
];

export default function Onboarding() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const current = steps[step];
  const progress = ((step + 1) / steps.length) * 100;

  function selectAnswer(answer: string) {
    const nextAnswers = {
      ...answers,
      [current.key]: answer,
    };

    setAnswers(nextAnswers);

    if (step < steps.length - 1) {
      setTimeout(() => setStep((value) => value + 1), 180);
      return;
    }

    localStorage.setItem("launchpilot-founder-profile", JSON.stringify(nextAnswers));
    router.push("/opportunities");
  }

  return (
    <main className="min-h-screen bg-[#07111f] text-white">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-7">
        <button
          onClick={() => router.push("/")}
          className="flex items-center gap-3"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500 font-bold">
            L
          </div>
          <span className="font-semibold">LaunchPilot</span>
        </button>

        <span className="text-sm text-slate-500">
          Founder profile
        </span>
      </nav>

      <div className="mx-auto max-w-3xl px-6 pb-20 pt-12 sm:pt-20">
        <div className="mb-14">
          <div className="mb-3 flex justify-between text-sm">
            <span className="text-slate-400">
              Step {step + 1} of {steps.length}
            </span>
            <span className="text-slate-500">
              {Math.round(progress)}%
            </span>
          </div>

          <div className="h-2 overflow-hidden rounded-full bg-slate-800">
            <div
              className="h-full rounded-full bg-blue-500 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-blue-400">
          Build your founder profile
        </p>

        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          {current.title}
        </h1>

        <p className="mt-5 text-lg leading-8 text-slate-400">
          {current.subtitle}
        </p>

        <div className="mt-10 grid gap-4">
          {current.options.map((option) => {
            const selected = answers[current.key] === option;

            return (
              <button
                key={option}
                onClick={() => selectAnswer(option)}
                className={`flex w-full items-center justify-between rounded-2xl border p-5 text-left transition ${
                  selected
                    ? "border-blue-500 bg-blue-500/10"
                    : "border-slate-800 bg-slate-900/50 hover:border-slate-600 hover:bg-slate-900"
                }`}
              >
                <span className="font-medium">{option}</span>

                <span
                  className={`flex h-6 w-6 items-center justify-center rounded-full border ${
                    selected
                      ? "border-blue-500 bg-blue-500"
                      : "border-slate-600"
                  }`}
                >
                  {selected && "✓"}
                </span>
              </button>
            );
          })}
        </div>

        <div className="mt-10 flex items-center justify-between">
          <button
            onClick={() => {
              if (step === 0) {
                router.push("/");
              } else {
                setStep((value) => value - 1);
              }
            }}
            className="text-sm font-medium text-slate-400 transition hover:text-white"
          >
            ← {step === 0 ? "Back home" : "Previous"}
          </button>

          <span className="text-sm text-slate-600">
            Your answers are used to personalize your opportunities.
          </span>
        </div>
      </div>
    </main>
  );
}
