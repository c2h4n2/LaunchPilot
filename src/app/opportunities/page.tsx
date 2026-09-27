"use client";

import { useEffect, useState } from "react";
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
  targetCustomer: string;
  firstOffer: string;
  score: number;
  reasons: string[];
};

export default function OpportunitiesPage() {
  const router = useRouter();

  const [profile, setProfile] = useState<Profile | null>(null);
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [regenerating, setRegenerating] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("launchpilot-founder-profile");

    if (!saved) {
      router.replace("/onboarding");
      return;
    }

    try {
      const parsedProfile = JSON.parse(saved);
      setProfile(parsedProfile);

      const cached = localStorage.getItem(
        "launchpilot-ai-opportunities"
      );

      if (cached) {
        const parsed = JSON.parse(cached);

        if (Array.isArray(parsed) && parsed.length > 0) {
          setOpportunities(parsed);
          setLoading(false);
          return;
        }
      }

      generateOpportunities(parsedProfile);
    } catch {
      router.replace("/onboarding");
    }
  }, [router]);

  async function generateOpportunities(
    founderProfile: Profile,
    force = false
  ) {
    if (force) {
      setRegenerating(true);
    } else {
      setLoading(true);
    }

    setError("");

    try {
      const response = await fetch("/api/opportunities", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(founderProfile),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Unable to generate opportunities."
        );
      }

      if (
        !data.opportunities ||
        !Array.isArray(data.opportunities)
      ) {
        throw new Error("Invalid opportunity response.");
      }

      const sorted = [...data.opportunities].sort(
        (a: Opportunity, b: Opportunity) => b.score - a.score
      );

      setOpportunities(sorted);

      localStorage.setItem(
        "launchpilot-ai-opportunities",
        JSON.stringify(sorted)
      );
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong while generating opportunities."
      );
    } finally {
      setLoading(false);
      setRegenerating(false);
    }
  }

  function chooseOpportunity(opportunity: Opportunity) {
    localStorage.setItem(
      "launchpilot-selected-opportunity",
      JSON.stringify(opportunity)
    );

    localStorage.removeItem("launchpilot-completed-tasks");

    router.push(`/plan/${opportunity.id}`);
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#07111f] px-6 text-white">
        <div className="w-full max-w-xl text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-500 font-bold">
            L
          </div>

          <p className="mt-8 text-sm font-semibold uppercase tracking-[0.2em] text-blue-400">
            Opportunity Engine
          </p>

          <h1 className="mt-4 text-3xl font-bold">
            Analyzing your founder profile...
          </h1>

          <p className="mt-4 leading-7 text-slate-400">
            LaunchPilot is comparing your skills, interests, budget,
            available time, experience, and goals to generate business
            opportunities tailored to you.
          </p>

          <div className="mx-auto mt-8 h-2 max-w-sm overflow-hidden rounded-full bg-slate-800">
            <div className="h-full w-2/3 animate-pulse rounded-full bg-blue-500" />
          </div>

          <p className="mt-4 text-sm text-slate-500">
            This can take several seconds.
          </p>
        </div>
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
          onClick={() => {
            localStorage.removeItem(
              "launchpilot-ai-opportunities"
            );
            router.push("/onboarding");
          }}
          className="text-sm text-slate-400 transition hover:text-white"
        >
          Edit founder profile
        </button>
      </nav>

      <section className="mx-auto max-w-6xl px-6 pb-24 pt-12">
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-400">
              AI Opportunity Engine
            </p>

            <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
              Your personalized business opportunities.
            </h1>

            <p className="mt-5 text-lg leading-8 text-slate-400">
              LaunchPilot analyzed your founder profile and generated
              business concepts designed around your current constraints
              and goals.
            </p>
          </div>

          {profile && (
            <button
              disabled={regenerating}
              onClick={() =>
                generateOpportunities(profile, true)
              }
              className="shrink-0 rounded-xl border border-slate-700 px-5 py-3 text-sm font-semibold transition hover:border-slate-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {regenerating
                ? "Generating..."
                : "Generate new ideas"}
            </button>
          )}
        </div>

        {error && (
          <div className="mt-10 rounded-2xl border border-red-500/30 bg-red-500/10 p-6">
            <p className="font-semibold text-red-300">
              We couldn't generate your opportunities.
            </p>

            <p className="mt-2 text-sm text-red-200/70">
              {error}
            </p>

            {profile && (
              <button
                onClick={() =>
                  generateOpportunities(profile)
                }
                className="mt-5 rounded-xl bg-white px-4 py-2 text-sm font-semibold text-slate-950"
              >
                Try again
              </button>
            )}
          </div>
        )}

        {!error && (
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

                    <p className="mt-1 text-sm text-slate-500">
                      profile match
                    </p>
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
                      <p className="text-xs text-slate-500">
                        {label}
                      </p>

                      <p className="mt-2 text-sm font-medium">
                        {value}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  <div className="rounded-xl border border-slate-800 bg-[#091422] p-5">
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Target customer
                    </p>

                    <p className="mt-3 text-sm leading-6 text-slate-300">
                      {opportunity.targetCustomer}
                    </p>
                  </div>

                  <div className="rounded-xl border border-slate-800 bg-[#091422] p-5">
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                      First offer
                    </p>

                    <p className="mt-3 text-sm leading-6 text-slate-300">
                      {opportunity.firstOffer}
                    </p>
                  </div>
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
                    onClick={() =>
                      chooseOpportunity(opportunity)
                    }
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
        )}

        {!error && opportunities.length > 0 && (
          <p className="mt-8 text-center text-xs leading-5 text-slate-600">
            Match scores, startup costs, and launch timelines are
            planning estimates generated from your profile, not
            guarantees of business performance.
          </p>
        )}
      </section>
    </main>
  );
}
