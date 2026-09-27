"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type Profile = Record<string, string>;

type Opportunity = {
  id: string;
  name: string;
  description: string;
  cost: string;
  launchTime: string;
  model: string;
  difficulty: string;
  tags: string[];
  score: number;
  reasons: string[];
};

const baseOpportunities = [
  {
    id: "ai-service",
    name: "AI Service Business",
    description:
      "Help businesses adopt AI through automation, content systems, customer support, or workflow improvements.",
    cost: "$50–$500",
    launchTime: "3–7 days",
    model: "Service + recurring",
    difficulty: "Beginner–Intermediate",
    tags: ["Technology & AI", "Services / agency", "Work directly with customers"],
  },
  {
    id: "affiliate",
    name: "Niche Affiliate Business",
    description:
      "Build useful content around a focused buying niche and earn commissions when visitors purchase recommended products.",
    cost: "$50–$300",
    launchTime: "7–14 days",
    model: "Affiliate commissions",
    difficulty: "Beginner",
    tags: ["Affiliate marketing", "Content & media", "Mostly automated"],
  },
  {
    id: "digital-products",
    name: "Digital Product Business",
    description:
      "Create templates, guides, toolkits, courses, or other digital assets that can be sold repeatedly.",
    cost: "$0–$300",
    launchTime: "5–14 days",
    model: "Product sales",
    difficulty: "Beginner–Intermediate",
    tags: ["Digital products", "Design & creative", "Writing & content", "Sell products"],
  },
  {
    id: "micro-saas",
    name: "Micro SaaS",
    description:
      "Build a focused software product that solves one recurring problem for a specific customer group.",
    cost: "$100–$2,000",
    launchTime: "2–6 weeks",
    model: "Subscription",
    difficulty: "Intermediate",
    tags: ["Technology & AI", "AI / software", "Mostly automated", "Build a scalable company"],
  },
  {
    id: "content-business",
    name: "Niche Content Business",
    description:
      "Build an audience around valuable specialized content and monetize through products, sponsorships, affiliates, or memberships.",
    cost: "$0–$300",
    launchTime: "3–10 days",
    model: "Multiple revenue streams",
    difficulty: "Beginner",
    tags: ["Content & media", "Writing & content", "Build an audience"],
  },
  {
    id: "local-service",
    name: "Productized Service Business",
    description:
      "Sell a clearly defined service with standardized pricing and delivery to a specific type of customer.",
    cost: "$0–$500",
    launchTime: "2–7 days",
    model: "Service revenue",
    difficulty: "Beginner",
    tags: [
      "Services / agency",
      "Business & operations",
      "Sales & marketing",
      "Hands-on / local services",
      "Work directly with customers",
    ],
  },
];

function scoreOpportunity(
  opportunity: (typeof baseOpportunities)[number],
  profile: Profile
) {
  let score = 58;
  const reasons: string[] = [];

  const values = Object.values(profile);

  for (const tag of opportunity.tags) {
    if (values.includes(tag)) {
      score += 9;
      reasons.push(`Matches your preference for ${tag.toLowerCase()}.`);
    }
  }

  if (
    profile.budget === "$0 – $100" &&
    ["digital-products", "content-business", "local-service"].includes(
      opportunity.id
    )
  ) {
    score += 7;
    reasons.push("Fits a very lean starting budget.");
  }

  if (
    profile.time === "Under 5 hours" &&
    ["affiliate", "digital-products", "content-business"].includes(
      opportunity.id
    )
  ) {
    score += 5;
    reasons.push("Can be started around a limited weekly schedule.");
  }

  if (
    profile.goal === "Build a scalable company" &&
    ["micro-saas", "digital-products", "content-business"].includes(
      opportunity.id
    )
  ) {
    score += 7;
    reasons.push("Has room to grow beyond trading time directly for money.");
  }

  if (
    profile.experience === "Complete beginner" &&
    ["affiliate", "digital-products", "local-service", "content-business"].includes(
      opportunity.id
    )
  ) {
    score += 5;
    reasons.push("Has a relatively accessible path for a first-time founder.");
  }

  if (reasons.length === 0) {
    reasons.push("Provides a flexible path based on your founder profile.");
  }

  return {
    ...opportunity,
    score: Math.min(score, 97),
    reasons: reasons.slice(0, 3),
  };
}

export default function OpportunitiesPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("launchpilot-founder-profile");

    if (!saved) {
      router.replace("/onboarding");
      return;
    }

    try {
      setProfile(JSON.parse(saved));
    } catch {
      router.replace("/onboarding");
    }
  }, [router]);

  const opportunities = useMemo<Opportunity[]>(() => {
    if (!profile) return [];

    return baseOpportunities
      .map((opportunity) => scoreOpportunity(opportunity, profile))
      .sort((a, b) => b.score - a.score);
  }, [profile]);

  if (!profile) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#07111f] text-white">
        <p className="text-slate-400">Analyzing your founder profile...</p>
      </main>
    );
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

        <button
          onClick={() => router.push("/onboarding")}
          className="text-sm text-slate-400 transition hover:text-white"
        >
          Edit founder profile
        </button>
      </nav>

      <section className="mx-auto max-w-6xl px-6 pb-24 pt-12">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-400">
            Opportunity Engine
          </p>

          <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
            Your best business opportunities.
          </h1>

          <p className="mt-5 text-lg leading-8 text-slate-400">
            We compared your founder profile against several online business
            models. These are your strongest matches right now.
          </p>
        </div>

        <div className="mt-12 space-y-6">
          {opportunities.map((opportunity, index) => (
            <article
              key={opportunity.id}
              className={`rounded-3xl border p-7 ${
                index === 0
                  ? "border-blue-500/50 bg-blue-500/5"
                  : "border-slate-800 bg-slate-900/40"
              }`}
            >
              <div className="flex flex-col justify-between gap-6 md:flex-row">
                <div className="max-w-3xl">
                  <div className="flex flex-wrap items-center gap-3">
                    {index === 0 && (
                      <span className="rounded-full bg-blue-500 px-3 py-1 text-xs font-semibold">
                        TOP MATCH
                      </span>
                    )}

                    <span className="text-sm text-slate-500">
                      #{index + 1}
                    </span>
                  </div>

                  <h2 className="mt-4 text-2xl font-semibold">
                    {opportunity.name}
                  </h2>

                  <p className="mt-3 leading-7 text-slate-400">
                    {opportunity.description}
                  </p>
                </div>

                <div className="min-w-28 md:text-right">
                  <p className="text-4xl font-bold">
                    {opportunity.score}%
                  </p>
                  <p className="mt-1 text-sm text-slate-500">profile match</p>
                </div>
              </div>

              <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {[
                  ["Startup cost", opportunity.cost],
                  ["Time to launch", opportunity.launchTime],
                  ["Revenue model", opportunity.model],
                  ["Difficulty", opportunity.difficulty],
                ].map(([label, value]) => (
                  <div
                    key={label}
                    className="rounded-xl border border-slate-800 bg-[#091422] p-4"
                  >
                    <p className="text-xs text-slate-500">{label}</p>
                    <p className="mt-2 text-sm font-medium">{value}</p>
                  </div>
                ))}
              </div>

              <div className="mt-7 border-t border-slate-800 pt-6">
                <p className="text-sm font-semibold text-slate-300">
                  Why this fits you
                </p>

                <div className="mt-3 flex flex-wrap gap-2">
                  {opportunity.reasons.map((reason) => (
                    <span
                      key={reason}
                      className="rounded-lg bg-slate-800/70 px-3 py-2 text-sm text-slate-300"
                    >
                      ✓ {reason}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-7">
                <button
                  onClick={() => {
                    localStorage.setItem(
                      "launchpilot-selected-opportunity",
                      JSON.stringify(opportunity)
                    );
                    router.push(`/plan/${opportunity.id}`);
                  }}
                  className={`rounded-xl px-5 py-3 text-sm font-semibold transition ${
                    index === 0
                      ? "bg-blue-500 hover:bg-blue-400"
                      : "border border-slate-700 hover:border-slate-500"
                  }`}
                >
                  Build this business →
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
