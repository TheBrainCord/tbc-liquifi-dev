"use client";

import {
  Smartphone,
  FileSearch,
  GitCompareArrows,
  BadgeCheck,
  IndianRupee,
} from "lucide-react";

const STEPS = [
  {
    icon: Smartphone,
    step: "01",
    title: "Enter Your Details",
    desc: "Share your mobile number and basic info. Takes under 2 minutes. No paperwork.",
    color: "#1e3a8a",
    bg: "#eff6ff",
  },
  {
    icon: FileSearch,
    step: "02",
    title: "Free CIBIL Check",
    desc: "We fetch your CIBIL score instantly with zero impact on your credit history.",
    color: "#7c3aed",
    bg: "#f5f3ff",
  },
  {
    icon: GitCompareArrows,
    step: "03",
    title: "Compare 50+ Lenders",
    desc: "Our AI matches you with lenders most likely to approve at the best rates.",
    color: "#0891b2",
    bg: "#ecfeff",
  },
  {
    icon: BadgeCheck,
    step: "04",
    title: "Get Approved",
    desc: "Choose your preferred offer. Submit documents digitally. Approval in 24 hours.",
    color: "#16a34a",
    bg: "#f0fdf4",
  },
  {
    icon: IndianRupee,
    step: "05",
    title: "Money in Your Account",
    desc: "Funds disbursed directly to your bank account within 72 hours of approval.",
    color: "#ea580c",
    bg: "#fff7ed",
  },
];

const CIBIL_FIX_STEPS = [
  {
    step: "01",
    title: "Free Score Audit",
    desc: "We pull your full CIBIL report and identify every negative entry — errors, late payments, defaults.",
  },
  {
    step: "02",
    title: "Dispute & Negotiate",
    desc: "Our experts raise formal disputes with CIBIL for errors and negotiate settlements for genuine dues.",
  },
  {
    step: "03",
    title: "Credit Building",
    desc: "We guide you to take small credit actions that build positive history and boost your score.",
  },
  {
    step: "04",
    title: "+120 Points in 90 Days",
    desc: "Track your progress live. Most customers see 120+ point improvements within 3 months.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Loan Journey */}
        <div className="text-center mb-14">
          <div className="section-tag justify-center">Simple Process</div>
          <h2 className="text-3xl sm:text-4xl font-black text-[#0f172a] mt-2">
            From Application to{" "}
            <span className="gradient-text-blue">Disbursal in 5 Steps</span>
          </h2>
          <p className="text-slate-500 mt-3 max-w-xl mx-auto">
            Our streamlined process eliminates the traditional banking hassle.
            No branch visits, no endless paperwork.
          </p>
        </div>

        {/* Desktop: horizontal stepper */}
        <div className="hidden lg:flex items-start gap-0 mb-20 relative">
          {STEPS.map((s, i) => {
            const Icon = s.icon;
            return (
              <div key={s.step} className="flex-1 relative">
                {/* Connector line */}
                {i < STEPS.length - 1 && (
                  <div className="absolute top-8 left-1/2 w-full h-0.5 bg-gradient-to-r from-[#e2e8f0] to-[#e2e8f0] z-0">
                    <div
                      className="h-full bg-gradient-to-r from-[#1e3a8a] to-[#ea580c] opacity-30"
                      style={{ width: "100%" }}
                    />
                  </div>
                )}

                <div className="flex flex-col items-center text-center px-3 relative z-10">
                  <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4 shadow-sm"
                    style={{
                      background: s.bg,
                      border: `1.5px solid ${s.color}22`,
                    }}
                  >
                    <Icon size={24} style={{ color: s.color }} />
                  </div>
                  <div
                    className="text-xs font-black mb-2 px-2 py-0.5 rounded-full"
                    style={{ color: s.color, background: s.bg }}
                  >
                    STEP {s.step}
                  </div>
                  <h3 className="text-sm font-black text-[#0f172a] mb-1.5">
                    {s.title}
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    {s.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Mobile: vertical stepper */}
        <div className="lg:hidden space-y-6 mb-20">
          {STEPS.map((s, i) => {
            const Icon = s.icon;
            return (
              <div key={s.step} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: s.bg }}
                  >
                    <Icon size={20} style={{ color: s.color }} />
                  </div>
                  {i < STEPS.length - 1 && (
                    <div className="w-0.5 flex-1 bg-[#e2e8f0] mt-2 min-h-8" />
                  )}
                </div>
                <div className="pb-6">
                  <div
                    className="text-xs font-black mb-1"
                    style={{ color: s.color }}
                  >
                    STEP {s.step}
                  </div>
                  <h3 className="font-black text-[#0f172a] mb-1">{s.title}</h3>
                  <p className="text-sm text-slate-500">{s.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* CIBIL Fix path */}
        <div className="bg-gradient-to-br from-[#0f2460] to-[#1e3a8a] rounded-2xl p-8 sm:p-12 text-white">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 text-sm font-semibold mb-5">
                <span className="w-2 h-2 rounded-full bg-orange-400 animate-pulse" />
                CIBIL Fix Program
              </div>
              <h2 className="text-2xl sm:text-3xl font-black mb-4 leading-tight">
                Score Below 700?{" "}
                <span className="text-[#fb923c]">We Fix It.</span>
              </h2>
              <p className="text-blue-200 mb-6">
                90-day structured credit repair with expert guidance. Average
                improvement of 120+ points — or your money back.
              </p>
              <div className="grid grid-cols-3 gap-4 mb-6">
                {[
                  { value: "120+", label: "Avg. points gained" },
                  { value: "90", label: "Days to results" },
                  { value: "94%", label: "Success rate" },
                ].map(({ value, label }) => (
                  <div key={label} className="text-center">
                    <div className="text-2xl font-black text-[#fb923c]">
                      {value}
                    </div>
                    <div className="text-xs text-blue-200">{label}</div>
                  </div>
                ))}
              </div>
              <a
                href="#check-eligibility"
                className="inline-flex items-center gap-2 bg-[#ea580c] hover:bg-[#f97316] text-white font-bold px-6 py-3 rounded-full transition-colors"
              >
                Start CIBIL Fix — Free Audit
              </a>
            </div>

            <div className="space-y-4">
              {CIBIL_FIX_STEPS.map((s, i) => (
                <div key={s.step} className="flex gap-4 items-start">
                  <div className="w-8 h-8 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-xs font-black text-[#fb923c] shrink-0">
                    {s.step}
                  </div>
                  <div>
                    <div className="font-bold text-sm mb-0.5">{s.title}</div>
                    <div className="text-xs text-blue-200">{s.desc}</div>
                    {i < CIBIL_FIX_STEPS.length - 1 && (
                      <div className="w-px h-4 bg-white/10 ml-0 mt-2" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
