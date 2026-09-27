"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Opportunity = {
  id: string;
  name: string;
  description: string;
  cost: string;
  launchTime: string;
  model: string;
  difficulty: string;
  score: number;
};

type Profile = Record<string, string>;

const planTemplates: Record<
  string,
  {
    concept: string;
    customer: string;
    offer: string;
    revenue: string;
    tasks: string[][];
  }
> = {
  affiliate: {
    concept:
      "Build a focused buying-guide website around a niche where people actively research products before purchasing.",
    customer:
      "People already searching for comparisons, reviews, best-of lists, and product recommendations.",
    offer:
      "Useful product research that helps buyers choose the right product faster.",
    revenue:
      "Affiliate commissions from qualified purchase-intent traffic.",
    tasks: [
      [
        "Choose one high-intent niche",
        "Identify 20 buyer-focused search topics",
        "Research competing websites",
      ],
      [
        "Create the website structure",
        "Publish the first 5 buying guides",
        "Add clear affiliate CTAs",
      ],
      [
        "Publish comparison content",
        "Strengthen internal linking",
        "Apply to relevant affiliate programs",
      ],
      [
        "Review traffic and clicks",
        "Improve highest-potential pages",
        "Plan the next 20 articles",
      ],
    ],
  },

  "ai-service": {
    concept:
      "Offer one clearly defined AI-powered service that saves businesses time or improves a repetitive workflow.",
    customer:
      "Small businesses with repetitive administrative, marketing, support, or content tasks.",
    offer:
      "A fixed-scope AI implementation or automation package with a measurable business outcome.",
    revenue:
      "Upfront implementation fees plus optional monthly support or optimization retainers.",
    tasks: [
      [
        "Choose one customer niche",
        "Identify one expensive repetitive problem",
        "Define a simple AI-powered solution",
      ],
      [
        "Create your service offer",
        "Build a demonstration",
        "Create a simple landing page",
      ],
      [
        "Build a list of 50 prospects",
        "Begin personalized outreach",
        "Run discovery conversations",
      ],
      [
        "Close the first client",
        "Document delivery",
        "Turn the process into a repeatable service",
      ],
    ],
  },

  "digital-products": {
    concept:
      "Create a useful digital asset that solves one narrow problem and can be sold repeatedly without custom delivery.",
    customer:
      "A specific audience with a recurring problem that can be solved using templates, guides, systems, or resources.",
    offer:
      "A focused digital toolkit designed to produce a clear outcome quickly.",
    revenue:
      "One-time digital product sales with opportunities for bundles and premium versions.",
    tasks: [
      [
        "Choose one audience",
        "Identify a painful recurring problem",
        "Validate demand through existing communities",
      ],
      [
        "Design the minimum viable product",
        "Create the core files",
        "Set initial pricing",
      ],
      [
        "Create the sales page",
        "Prepare launch content",
        "Recruit initial testers",
      ],
      [
        "Launch publicly",
        "Collect customer feedback",
        "Improve the product and offer",
      ],
    ],
  },

  "micro-saas": {
    concept:
      "Build a small software product that solves one narrow recurring problem exceptionally well.",
    customer:
      "A defined professional or business niche currently solving the problem manually or with complicated software.",
    offer:
      "A focused application that saves users time, reduces repetitive work, or improves a measurable workflow.",
    revenue:
      "Monthly or annual software subscriptions.",
    tasks: [
      [
        "Choose one customer niche",
        "Identify a recurring workflow problem",
        "Interview potential users",
      ],
      [
        "Define the smallest useful MVP",
        "Design the core workflow",
        "Build the first prototype",
      ],
      [
        "Test with early users",
        "Fix the biggest friction points",
        "Add payments and onboarding",
      ],
      [
        "Launch the MVP",
        "Contact potential customers",
        "Measure activation and retention",
      ],
    ],
  },

  "content-business": {
    concept:
      "Build a trusted content brand around one specialized topic and develop multiple ways to monetize the audience.",
    customer:
      "People repeatedly looking for useful information, recommendations, education, or analysis within one niche.",
    offer:
      "Consistently useful specialized content that becomes a trusted resource for the audience.",
    revenue:
      "Affiliate revenue, sponsorships, digital products, memberships, or advertising.",
    tasks: [
      [
        "Choose a focused content niche",
        "Define the target audience",
        "Create 30 content ideas",
      ],
      [
        "Set up the publishing platform",
        "Create your first cornerstone content",
        "Establish a publishing schedule",
      ],
      [
        "Publish consistently",
        "Begin audience distribution",
        "Start collecting email subscribers",
      ],
      [
        "Analyze engagement",
        "Identify monetization opportunities",
        "Double down on winning topics",
      ],
    ],
  },

  "local-service": {
    concept:
      "Turn one valuable skill into a standardized service with a clear deliverable, price, and target customer.",
    customer:
      "Businesses or consumers who already pay to solve the problem and value speed, reliability, or expertise.",
    offer:
      "A simple productized service with a defined scope and outcome rather than open-ended hourly work.",
    revenue:
      "Fixed project fees with an option to introduce recurring service packages.",
    tasks: [
      [
        "Choose one customer type",
        "Identify one valuable problem",
        "Define your service outcome",
      ],
      [
        "Package the service",
        "Choose pricing",
        "Create a simple sales page",
      ],
      [
        "Build a prospect list",
        "Start direct outreach",
        "Book initial conversations",
      ],
      [
        "Deliver the first project",
        "Collect proof and feedback",
        "Standardize the delivery process",
      ],
    ],
  },
};

export default function LaunchPlanPage() {
  const router = useRouter();
  const [opportunity, setOpportunity] = useState<Opportunity | null>(null);
  const [profile, setProfile] = useState<Profile>({});
  const [completed, setCompleted] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const selected = localStorage.getItem("launchpilot-selected-opportunity");
    const savedProfile = localStorage.getItem("launchpilot-founder-profile");
    const savedTasks = localStorage.getItem("launchpilot-completed-tasks");

    if (!selected) {
      router.replace("/opportunities");
      return;
    }

    try {
      setOpportunity(JSON.parse(selected));

      if (savedProfile) {
        setProfile(JSON.parse(savedProfile));
      }

      if (savedTasks) {
        setCompleted(JSON.parse(savedTasks));
      }
    } catch {
      router.replace("/opportunities");
    }
  }, [router]);

  function toggleTask(key: string) {
    const next = {
      ...completed,
      [key]: !completed[key],
    };

    setCompleted(next);
    localStorage.setItem(
      "launchpilot-completed-tasks",
      JSON.stringify(next)
    );
  }

  if (!opportunity) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#07111f] text-white">
        <p className="text-slate-400">Building your launch plan...</p>
      </main>
    );
  }

  const plan = planTemplates[opportunity.id] ?? planTemplates["local-service"];

  const totalTasks = plan.tasks.flat().length;
  const completedTasks = Object.values(completed).filter(Boolean).length;
  const progress = Math.min(
    100,
    Math.round((completedTasks / totalTasks) * 100)
  );

  return (
    <main className="min-h-screen bg-[#07111f] text-white">
      <nav className="border-b border-slate-800">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
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
            onClick={() => router.push("/opportunities")}
            className="text-sm text-slate-400 transition hover:text-white"
          >
            ← Opportunities
          </button>
        </div>
      </nav>

      <section className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-400">
              Your Launch Plan
            </p>

            <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
              {opportunity.name}
            </h1>

            <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-400">
              {plan.concept}
            </p>

            <div className="mt-10 grid gap-4 md:grid-cols-3">
              <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5">
                <p className="text-xs uppercase tracking-wider text-slate-500">
                  Target customer
                </p>
                <p className="mt-3 leading-6 text-slate-200">
                  {plan.customer}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5">
                <p className="text-xs uppercase tracking-wider text-slate-500">
                  First offer
                </p>
                <p className="mt-3 leading-6 text-slate-200">
                  {plan.offer}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5">
                <p className="text-xs uppercase tracking-wider text-slate-500">
                  Revenue model
                </p>
                <p className="mt-3 leading-6 text-slate-200">
                  {plan.revenue}
                </p>
              </div>
            </div>

            <div className="mt-12">
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-sm font-semibold text-blue-400">
                    30-DAY ROADMAP
                  </p>
                  <h2 className="mt-2 text-3xl font-bold">
                    Your path to launch
                  </h2>
                </div>

                <p className="text-sm text-slate-500">
                  {completedTasks}/{totalTasks} tasks
                </p>
              </div>

              <div className="mt-8 space-y-6">
                {plan.tasks.map((week, weekIndex) => (
                  <div
                    key={weekIndex}
                    className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6"
                  >
                    <div className="mb-5 flex items-center gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 font-semibold text-blue-400">
                        {weekIndex + 1}
                      </div>

                      <div>
                        <p className="font-semibold">
                          Week {weekIndex + 1}
                        </p>
                        <p className="text-sm text-slate-500">
                          {weekIndex === 0 && "Validate the opportunity"}
                          {weekIndex === 1 && "Build the foundation"}
                          {weekIndex === 2 && "Reach the market"}
                          {weekIndex === 3 && "Launch and improve"}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {week.map((task, taskIndex) => {
                        const key = `${opportunity.id}-${weekIndex}-${taskIndex}`;
                        const isDone = Boolean(completed[key]);

                        return (
                          <button
                            key={key}
                            onClick={() => toggleTask(key)}
                            className={`flex w-full items-center gap-4 rounded-xl border p-4 text-left transition ${
                              isDone
                                ? "border-emerald-500/30 bg-emerald-500/5 text-slate-500"
                                : "border-slate-800 bg-[#091422] hover:border-slate-600"
                            }`}
                          >
                            <span
                              className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md border text-xs ${
                                isDone
                                  ? "border-emerald-500 bg-emerald-500 text-white"
                                  : "border-slate-600"
                              }`}
                            >
                              {isDone ? "✓" : ""}
                            </span>

                            <span className={isDone ? "line-through" : ""}>
                              {task}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <aside>
            <div className="sticky top-8 rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
              <p className="text-sm font-semibold">Launch progress</p>

              <div className="mt-5 flex items-end gap-2">
                <span className="text-4xl font-bold">{progress}%</span>
                <span className="pb-1 text-sm text-slate-500">complete</span>
              </div>

              <div className="mt-5 h-2 overflow-hidden rounded-full bg-slate-800">
                <div
                  className="h-full rounded-full bg-blue-500 transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>

              <div className="mt-7 space-y-4 border-t border-slate-800 pt-6 text-sm">
                <div className="flex justify-between gap-4">
                  <span className="text-slate-500">Match</span>
                  <span>{opportunity.score}%</span>
                </div>

                <div className="flex justify-between gap-4">
                  <span className="text-slate-500">Startup cost</span>
                  <span>{opportunity.cost}</span>
                </div>

                <div className="flex justify-between gap-4">
                  <span className="text-slate-500">Time to launch</span>
                  <span>{opportunity.launchTime}</span>
                </div>

                <div className="flex justify-between gap-4">
                  <span className="text-slate-500">Weekly time</span>
                  <span>{profile.time ?? "Not set"}</span>
                </div>
              </div>

              <button
                onClick={() => router.push("/opportunities")}
                className="mt-7 w-full rounded-xl border border-slate-700 px-4 py-3 text-sm font-semibold transition hover:border-slate-500"
              >
                Explore another idea
              </button>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
