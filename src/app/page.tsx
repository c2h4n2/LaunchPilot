"use client";

import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-[#07111f] text-white">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6 lg:px-8">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500 font-bold">
            L
          </div>
          <span className="text-xl font-semibold">LaunchPilot</span>
        </div>

        <div className="hidden items-center gap-8 text-sm text-slate-300 md:flex">
          <a href="#how-it-works" className="hover:text-white">
            How it works
          </a>
          <a href="#features" className="hover:text-white">
            Features
          </a>
          <button className="hover:text-white">Sign in</button>
        </div>
      </nav>

      <section className="mx-auto grid min-h-[78vh] max-w-7xl items-center gap-16 px-6 py-16 lg:grid-cols-2 lg:px-8">
        <div>
          <div className="mb-6 inline-flex rounded-full border border-blue-400/20 bg-blue-400/10 px-4 py-2 text-sm text-blue-300">
            AI-powered business builder
          </div>

          <h1 className="max-w-3xl text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
            Turn what you know into a business.
          </h1>

          <p className="mt-7 max-w-2xl text-lg leading-8 text-slate-400">
            Tell LaunchPilot about your skills, budget, interests and goals.
            We&apos;ll uncover business opportunities that fit you and turn the
            best one into an actionable launch plan.
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <button
              onClick={() => router.push("/onboarding")}
              className="rounded-xl bg-blue-500 px-7 py-4 font-semibold transition hover:bg-blue-400"
            >
              Find my opportunity →
            </button>

            <a
              href="#how-it-works"
              className="rounded-xl border border-slate-700 px-7 py-4 font-semibold text-slate-200 transition hover:border-slate-500"
            >
              See how it works
            </a>
          </div>

          <p className="mt-5 text-sm text-slate-500">
            Start free. No business idea required.
          </p>
        </div>

        <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 shadow-2xl">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">LaunchPilot</p>
              <h2 className="mt-1 text-xl font-semibold">
                Opportunity analysis
              </h2>
            </div>
            <span className="rounded-full bg-emerald-400/10 px-3 py-1 text-xs text-emerald-300">
              Ready
            </span>
          </div>

          <div className="space-y-4">
            <div className="rounded-2xl border border-slate-800 bg-[#0a1525] p-5">
              <p className="text-xs uppercase tracking-wider text-slate-500">
                Your profile
              </p>
              <p className="mt-2 text-slate-200">
                Tech skills · $500 budget · 10 hrs/week
              </p>
            </div>

            <div className="rounded-2xl border border-blue-500/30 bg-blue-500/5 p-5">
              <div className="flex justify-between gap-4">
                <div>
                  <p className="text-sm text-blue-300">Top opportunity</p>
                  <h3 className="mt-2 text-xl font-semibold">
                    Niche AI service business
                  </h3>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold">92</p>
                  <p className="text-xs text-slate-500">match</p>
                </div>
              </div>

              <div className="mt-5 h-2 overflow-hidden rounded-full bg-slate-800">
                <div className="h-full w-[92%] rounded-full bg-blue-500" />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {[
                ["Startup cost", "Low"],
                ["Time to launch", "7 days"],
                ["Revenue model", "Recurring"],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="rounded-xl border border-slate-800 bg-[#0a1525] p-4"
                >
                  <p className="text-xs text-slate-500">{label}</p>
                  <p className="mt-2 text-sm font-medium">{value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section
        id="how-it-works"
        className="border-t border-slate-800 bg-[#091422] px-6 py-24"
      >
        <div className="mx-auto max-w-7xl">
          <p className="text-sm font-semibold uppercase tracking-widest text-blue-400">
            How it works
          </p>

          <h2 className="mt-4 max-w-2xl text-3xl font-bold sm:text-4xl">
            From idea to execution.
          </h2>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {[
              [
                "01",
                "Tell us about yourself",
                "Your skills, interests, budget, available time and goals.",
              ],
              [
                "02",
                "Discover opportunities",
                "LaunchPilot analyzes business models that fit your situation.",
              ],
              [
                "03",
                "Build your launch plan",
                "Choose an opportunity and get a practical roadmap to launch it.",
              ],
            ].map(([number, title, description]) => (
              <div
                key={number}
                className="rounded-2xl border border-slate-800 bg-slate-900/40 p-7"
              >
                <p className="text-sm font-semibold text-blue-400">{number}</p>
                <h3 className="mt-5 text-xl font-semibold">{title}</h3>
                <p className="mt-3 leading-7 text-slate-400">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
