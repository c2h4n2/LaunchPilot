"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";

type FounderProfile = {
  goal?: string;
  skills?: string;
  interest?: string;
  budget?: string;
  time?: string;
  experience?: string;
  model?: string;
  income?: string;
  [key: string]: unknown;
};

type Opportunity = {
  id: string;
  name: string;
  description?: string;
  score?: number;
  cost?: string;
  launchTime?: string;
  model?: string;
  difficulty?: string;
  targetCustomer?: string;
  firstOffer?: string;
  reasons?: string[];
  [key: string]: unknown;
};

type PlanTask = {
  id: string;
  title: string;
  description: string;
};

type PlanWeek = {
  week: number;
  title: string;
  objective: string;
  tasks: PlanTask[];
};

type LaunchPlan = {
  businessName: string;
  concept: string;
  targetCustomer: string;
  firstOffer: string;
  revenueModel: string;
  thirtyDayGoal: string;
  weeks: PlanWeek[];
};

const PROFILE_KEY = "launchpilot-founder-profile";
const OPPORTUNITY_KEY = "launchpilot-selected-opportunity";
const PLAN_CACHE_KEY = "launchpilot-ai-launch-plan";
const COMPLETED_KEY = "launchpilot-completed-tasks";

export default function PlanPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const opportunityId = params?.id;

  const [profile, setProfile] = useState<FounderProfile | null>(null);
  const [opportunity, setOpportunity] = useState<Opportunity | null>(null);
  const [plan, setPlan] = useState<LaunchPlan | null>(null);
  const [completed, setCompleted] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [regenerating, setRegenerating] = useState(false);

  useEffect(() => {
    const rawProfile = localStorage.getItem(PROFILE_KEY);
    const rawOpportunity = localStorage.getItem(OPPORTUNITY_KEY);
    const rawCompleted = localStorage.getItem(COMPLETED_KEY);

    if (!rawProfile || !rawOpportunity) {
      router.replace("/opportunities");
      return;
    }

    try {
      const parsedProfile = JSON.parse(rawProfile) as FounderProfile;
      const parsedOpportunity = JSON.parse(rawOpportunity) as Opportunity;

      setProfile(parsedProfile);
      setOpportunity(parsedOpportunity);

      if (rawCompleted) {
        setCompleted(JSON.parse(rawCompleted));
      }

      const rawPlan = localStorage.getItem(PLAN_CACHE_KEY);

      if (rawPlan) {
        const cached = JSON.parse(rawPlan) as {
          opportunityId?: string;
          plan?: LaunchPlan;
        };

        if (
          cached?.opportunityId === parsedOpportunity.id &&
          cached?.plan
        ) {
          setPlan(cached.plan);
          setLoading(false);
          return;
        }
      }

      void generatePlan(parsedProfile, parsedOpportunity);
    } catch {
      setError("We couldn't load your saved founder profile and opportunity.");
      setLoading(false);
    }
  }, [router]);

  async function generatePlan(
    founderProfile: FounderProfile,
    selectedOpportunity: Opportunity,
    force = false
  ) {
    if (force) setRegenerating(true);
    else setLoading(true);

    setError("");

    try {
      const response = await fetch("/api/plan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          profile: founderProfile,
          opportunity: selectedOpportunity,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data?.plan) {
        throw new Error(data?.error || "Unable to generate your launch plan.");
      }

      const nextPlan = data.plan as LaunchPlan;
      setPlan(nextPlan);

      localStorage.setItem(
        PLAN_CACHE_KEY,
        JSON.stringify({
          opportunityId: selectedOpportunity.id,
          plan: nextPlan,
        })
      );

      if (force) {
        setCompleted([]);
        localStorage.removeItem(COMPLETED_KEY);
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to generate your launch plan right now."
      );
    } finally {
      setLoading(false);
      setRegenerating(false);
    }
  }

  function toggleTask(taskId: string) {
    setCompleted((current) => {
      const next = current.includes(taskId)
        ? current.filter((id) => id !== taskId)
        : [...current, taskId];

      localStorage.setItem(COMPLETED_KEY, JSON.stringify(next));
      return next;
    });
  }

  const allTasks = useMemo(
    () => plan?.weeks.flatMap((week) => week.tasks) ?? [],
    [plan]
  );

  const completedCount = allTasks.filter((task) =>
    completed.includes(task.id)
  ).length;

  const progress =
    allTasks.length === 0
      ? 0
      : Math.round((completedCount / allTasks.length) * 100);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#07111f] text-white">
        <Header />
        <div className="mx-auto flex min-h-[70vh] max-w-5xl items-center justify-center px-6">
          <div className="text-center">
            <div className="mx-auto mb-6 h-10 w-10 animate-spin rounded-full border-2 border-slate-700 border-t-cyan-400" />
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-400">
              Launch Plan Engine
            </p>
            <h1 className="mt-3 text-3xl font-bold">
              Building your personalized 30-day plan...
            </h1>
            <p className="mx-auto mt-3 max-w-xl text-slate-400">
              LaunchPilot is turning your founder profile and chosen business into
              concrete weekly actions.
            </p>
          </div>
        </div>
      </main>
    );
  }

  if (error && !plan) {
    return (
      <main className="min-h-screen bg-[#07111f] text-white">
        <Header />
        <div className="mx-auto max-w-3xl px-6 py-24 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-rose-400">
            Plan generation failed
          </p>
          <h1 className="mt-3 text-3xl font-bold">
            We couldn't build your launch plan.
          </h1>
          <p className="mt-4 text-slate-400">{error}</p>
          <button
            onClick={() => {
              if (profile && opportunity) {
                void generatePlan(profile, opportunity);
              }
            }}
            className="mt-8 rounded-xl bg-cyan-400 px-5 py-3 font-semibold text-slate-950 transition hover:bg-cyan-300"
          >
            Try again
          </button>
        </div>
      </main>
    );
  }

  if (!plan || !opportunity) return null;

  return (
    <main className="min-h-screen bg-[#07111f] text-white">
      <Header />

      <section className="border-b border-white/10">
        <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
          <button
            onClick={() => router.push("/opportunities")}
            className="mb-8 text-sm font-medium text-slate-400 transition hover:text-white"
          >
            ← Back to opportunities
          </button>

          <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-400">
                Your 30-day launch plan
              </p>
              <h1 className="mt-3 max-w-4xl text-4xl font-bold tracking-tight md:text-5xl">
                {plan.businessName}
              </h1>
              <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-300">
                {plan.concept}
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-400">
                  Plan progress
                </span>
                <span className="font-bold text-cyan-400">{progress}%</span>
              </div>
              <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-800">
                <div
                  className="h-full rounded-full bg-cyan-400 transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="mt-3 text-sm text-slate-400">
                {completedCount} of {allTasks.length} tasks complete
              </p>

              <button
                disabled={regenerating}
                onClick={() => {
                  if (profile && opportunity) {
                    void generatePlan(profile, opportunity, true);
                  }
                }}
                className="mt-6 w-full rounded-xl border border-white/10 px-4 py-3 text-sm font-semibold transition hover:border-cyan-400/40 hover:bg-white/[0.04] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {regenerating ? "Generating..." : "Regenerate plan"}
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
        {error && (
          <div className="mb-8 rounded-xl border border-amber-400/20 bg-amber-400/10 p-4 text-sm text-amber-100">
            {error}
          </div>
        )}

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <SummaryCard title="Target customer" body={plan.targetCustomer} />
          <SummaryCard title="First offer" body={plan.firstOffer} />
          <SummaryCard title="Revenue model" body={plan.revenueModel} />
          <SummaryCard title="30-day goal" body={plan.thirtyDayGoal} />
        </div>

        <div className="mt-12">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-400">
              Roadmap
            </p>
            <h2 className="mt-2 text-3xl font-bold">
              Your first four weeks
            </h2>
          </div>

          <div className="mt-8 space-y-6">
            {plan.weeks.map((week) => (
              <article
                key={week.week}
                className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]"
              >
                <div className="border-b border-white/10 p-6 md:flex md:items-start md:justify-between md:gap-8">
                  <div>
                    <p className="text-sm font-semibold text-cyan-400">
                      WEEK {week.week}
                    </p>
                    <h3 className="mt-1 text-2xl font-bold">{week.title}</h3>
                  </div>
                  <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400 md:mt-0">
                    {week.objective}
                  </p>
                </div>

                <div className="divide-y divide-white/10">
                  {week.tasks.map((task) => {
                    const isDone = completed.includes(task.id);

                    return (
                      <button
                        key={task.id}
                        onClick={() => toggleTask(task.id)}
                        className="flex w-full gap-4 p-6 text-left transition hover:bg-white/[0.03]"
                      >
                        <span
                          className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md border text-sm ${
                            isDone
                              ? "border-cyan-400 bg-cyan-400 text-slate-950"
                              : "border-slate-600 text-transparent"
                          }`}
                        >
                          ✓
                        </span>
                        <span>
                          <span
                            className={`block font-semibold ${
                              isDone
                                ? "text-slate-500 line-through"
                                : "text-white"
                            }`}
                          >
                            {task.title}
                          </span>
                          <span
                            className={`mt-1 block text-sm leading-6 ${
                              isDone ? "text-slate-600" : "text-slate-400"
                            }`}
                          >
                            {task.description}
                          </span>
                        </span>
                      </button>
                    );
                  })}
                </div>
              </article>
            ))}
          </div>

          <p className="mt-8 text-center text-xs leading-5 text-slate-500">
            LaunchPilot plans are planning guidance, not guarantees of revenue,
            demand, or business results. Validate assumptions with real customers
            and current platform or affiliate-program terms.
          </p>
        </div>
      </section>
    </main>
  );
}

function SummaryCard({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
        {title}
      </p>
      <p className="mt-3 text-sm leading-6 text-slate-200">{body}</p>
    </div>
  );
}

function Header() {
  return (
    <header className="border-b border-white/10 bg-[#07111f]/95">
      <div className="mx-auto flex h-16 max-w-7xl items-center px-6 lg:px-8">
        <a href="/" className="flex items-center gap-3 font-bold">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-400 text-slate-950">
            L
          </span>
          <span>LaunchPilot</span>
        </a>
      </div>
    </header>
  );
}
