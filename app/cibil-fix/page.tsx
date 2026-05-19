"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  Phone,
  Shield,
  Star,
  Loader2,
  ChevronRight,
  Clock,
  BadgeCheck,
  Zap,
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Issue {
  id: string;
  label: string;
  description: string;
  impact: "high" | "medium" | "low";
}

interface CibilReport {
  score: number;
  zone: { label: string; color: string; bg: string };
  issues: Issue[];
  recommendations: string[];
  potential_score: number;
  timeline_days: number;
}

// ─── Arc Gauge ────────────────────────────────────────────────────────────────

function ArcGauge({ score, color }: { score: number; color: string }) {
  const cx = 100;
  const cy = 100;
  const r = 75;

  function polarToCartesian(deg: number) {
    const rad = (deg * Math.PI) / 180;
    return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
  }

  function describeArc(startDeg: number, endDeg: number) {
    const s = polarToCartesian(startDeg);
    const e = polarToCartesian(endDeg);
    const large = endDeg - startDeg > 180 ? 1 : 0;
    return `M ${s.x} ${s.y} A ${r} ${r} 0 ${large} 1 ${e.x} ${e.y}`;
  }

  const normalized = (score - 300) / 600;
  const fillAngle = -225 + normalized * 270;
  const needleAngle = -135 + normalized * 270;
  const needleRad = (needleAngle * Math.PI) / 180;
  const needleTip = {
    x: cx + 60 * Math.cos(needleRad),
    y: cy + 60 * Math.sin(needleRad),
  };

  return (
    <svg viewBox="0 0 200 150" className="w-full max-w-[260px] mx-auto">
      <path
        d={describeArc(-225, 45)}
        fill="none"
        stroke="#e2e8f0"
        strokeWidth="14"
        strokeLinecap="round"
      />
      {score > 300 && (
        <path
          d={describeArc(-225, Math.min(fillAngle, 44))}
          fill="none"
          stroke={color}
          strokeWidth="14"
          strokeLinecap="round"
          style={{ transition: "all 1s cubic-bezier(0.34,1.56,0.64,1)" }}
        />
      )}
      <line
        x1={cx}
        y1={cy}
        x2={needleTip.x}
        y2={needleTip.y}
        stroke="#1e3a8a"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <circle cx={cx} cy={cy} r="6" fill="#1e3a8a" />
      <circle cx={cx} cy={cy} r="3" fill="white" />
      <text x="28" y="130" fontSize="9" fill="#94a3b8" textAnchor="middle">
        300
      </text>
      <text x="172" y="130" fontSize="9" fill="#94a3b8" textAnchor="middle">
        900
      </text>
    </svg>
  );
}

// ─── Impact badge ─────────────────────────────────────────────────────────────

function ImpactBadge({ impact }: { impact: Issue["impact"] }) {
  const styles = {
    high: "bg-red-50 text-red-600 border-red-200",
    medium: "bg-orange-50 text-orange-600 border-orange-200",
    low: "bg-yellow-50 text-yellow-600 border-yellow-200",
  };
  return (
    <span
      className={`text-[10px] font-bold uppercase tracking-wide border rounded-full px-2 py-0.5 ${styles[impact]}`}
    >
      {impact} impact
    </span>
  );
}

// ─── Plan card ────────────────────────────────────────────────────────────────

const PLANS = [
  {
    id: "basic" as const,
    name: "Basic",
    price: 499,
    calls: 1,
    features: [
      "1 expert consultation call (30 min)",
      "Personalised CIBIL action plan",
      "Top 3 issues identified & explained",
      "Email summary with next steps",
    ],
    popular: false,
  },
  {
    id: "premium" as const,
    name: "Premium",
    price: 999,
    calls: 3,
    features: [
      "3 expert calls over 90 days",
      "Full dispute filing support",
      "Credit utilization coaching",
      "Monthly score progress tracking",
      "Priority WhatsApp support",
    ],
    popular: true,
  },
];

// ─── Main Page ────────────────────────────────────────────────────────────────

const PAN_RE = /^[A-Z]{5}[0-9]{4}[A-Z]$/;

export default function CibilFixPage() {
  const [step, setStep] = useState<"form" | "report" | "plans" | "success">(
    "form",
  );

  // Form state
  const [pan, setPan] = useState("");
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [panError, setPanError] = useState("");
  const [formError, setFormError] = useState("");
  const [checking, setChecking] = useState(false);

  // Report state
  const [report, setReport] = useState<CibilReport | null>(null);

  // Payment state
  const [selectedPlan, setSelectedPlan] = useState<"basic" | "premium">(
    "premium",
  );
  const [paying, setPaying] = useState(false);
  const [payError, setPayError] = useState("");

  // ── Step 1: Check CIBIL ──
  async function handleCheck() {
    setFormError("");
    if (!PAN_RE.test(pan)) {
      setPanError("Enter a valid PAN number (e.g. ABCDE1234F)");
      return;
    }
    if (!/^\d{10}$/.test(phone)) {
      setFormError("Enter a valid 10-digit mobile number");
      return;
    }

    setChecking(true);
    try {
      const res = await fetch("/api/cibil/check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pan, phone, name: name || undefined }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setFormError(data.error ?? "Failed to check. Please try again.");
        return;
      }
      setReport(data.report);
      setStep("report");
    } catch {
      setFormError("Network error. Please try again.");
    } finally {
      setChecking(false);
    }
  }

  // ── Step 3: Initiate payment ──
  async function handlePayment() {
    setPaying(true);
    setPayError("");
    try {
      const res = await fetch("/api/payments/initiate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          plan: selectedPlan,
          pan,
          phone,
          name: name || undefined,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setPayError(data.error ?? "Payment failed. Please try again.");
        setPaying(false);
        return;
      }
      // Dummy: simulate 2s payment processing then success
      await new Promise((r) => setTimeout(r, 2000));
      setStep("success");
    } catch {
      setPayError("Network error. Please try again.");
      setPaying(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#f8fafc]">
      <Navbar />

      {/* ── Hero banner ── */}
      <div className="hero-gradient pt-24 pb-16 px-4">
        <div className="max-w-3xl mx-auto text-center text-white">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 text-sm font-semibold mb-6">
            <Shield size={14} className="text-[#2DD4BF]" />
            Free CIBIL Check · No Score Impact
          </div>
          <h1 className="text-3xl sm:text-5xl font-black leading-tight">
            Fix Your CIBIL Score in{" "}
            <span className="text-[#f97316]">90 Days</span>
          </h1>
          <p className="mt-4 text-blue-200 text-lg max-w-xl mx-auto">
            Enter your PAN to get a free credit health report. Our experts will
            call you with a personalised fix plan.
          </p>
          <div className="flex flex-wrap justify-center gap-4 mt-6 text-sm">
            {[
              { icon: Star, text: "4.8★ rated service" },
              { icon: BadgeCheck, text: "2,400+ scores improved" },
              { icon: Clock, text: "Results in 90 days" },
            ].map(({ icon: Icon, text }) => (
              <div
                key={text}
                className="flex items-center gap-1.5 text-blue-200"
              >
                <Icon size={14} className="text-[#2DD4BF]" />
                {text}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-10">
        {/* ══════════════════════════════════════════════════════════
            STEP 1 — PAN form
        ══════════════════════════════════════════════════════════ */}
        {step === "form" && (
          <div className="card p-8">
            <h2 className="text-xl font-black text-[#0f172a] mb-1">
              Check Your Credit Health
            </h2>
            <p className="text-sm text-slate-500 mb-6">
              Takes 10 seconds · completely free · no hard pull
            </p>

            <div className="space-y-4">
              {/* PAN */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  PAN Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="ABCDE1234F"
                  maxLength={10}
                  className="input-field font-mono uppercase tracking-widest"
                  value={pan}
                  onChange={(e) => {
                    const v = e.target.value
                      .toUpperCase()
                      .replace(/[^A-Z0-9]/g, "");
                    setPan(v);
                    setPanError("");
                  }}
                  onBlur={() => {
                    if (pan && !PAN_RE.test(pan))
                      setPanError("Enter a valid PAN (e.g. ABCDE1234F)");
                  }}
                />
                {panError && (
                  <p className="text-xs text-red-500 mt-1">{panError}</p>
                )}
              </div>

              {/* Name */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Full Name{" "}
                  <span className="text-slate-400 font-normal">(optional)</span>
                </label>
                <input
                  type="text"
                  placeholder="As on PAN card"
                  className="input-field"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Mobile Number <span className="text-red-500">*</span>
                </label>
                <div className="flex">
                  <span className="flex items-center px-3 bg-slate-100 border border-r-0 border-slate-200 rounded-l-[10px] text-sm font-semibold text-slate-600">
                    +91
                  </span>
                  <input
                    type="tel"
                    maxLength={10}
                    placeholder="10-digit mobile number"
                    className="input-field rounded-l-none"
                    value={phone}
                    onChange={(e) => {
                      setPhone(e.target.value.replace(/\D/g, ""));
                      setFormError("");
                    }}
                  />
                </div>
              </div>

              {formError && (
                <p className="text-sm text-red-600 bg-red-50 rounded-lg px-4 py-2">
                  {formError}
                </p>
              )}

              <button
                onClick={handleCheck}
                disabled={checking || !pan || !phone}
                className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {checking ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Checking your CIBIL…
                  </>
                ) : (
                  <>
                    Check My CIBIL Score Free <ArrowRight size={16} />
                  </>
                )}
              </button>
            </div>

            <p className="text-center text-xs text-slate-400 mt-4">
              🔒 Your PAN data is encrypted and never shared with third parties.
            </p>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════
            STEP 2 — Report
        ══════════════════════════════════════════════════════════ */}
        {step === "report" && report && (
          <div className="space-y-5">
            {/* Score card */}
            <div className="card p-6 text-center">
              <p className="text-sm font-semibold text-slate-500 mb-2">
                Your Estimated CIBIL Score
              </p>
              <ArcGauge score={report.score} color={report.zone.color} />
              <div className="mt-2">
                <div
                  className="text-5xl font-black"
                  style={{ color: report.zone.color }}
                >
                  {report.score}
                </div>
                <span
                  className="inline-block mt-2 text-sm font-bold px-3 py-1 rounded-full"
                  style={{
                    color: report.zone.color,
                    background: report.zone.bg,
                  }}
                >
                  {report.zone.label}
                </span>
              </div>

              {/* Potential */}
              <div className="mt-5 p-4 bg-blue-50 rounded-xl border border-blue-100 text-left">
                <div className="flex items-center gap-2 text-sm font-bold text-[#1e3a8a]">
                  <TrendingUp size={16} />
                  Potential score after {report.timeline_days} days:{" "}
                  <span className="text-green-600 text-base">
                    {report.potential_score}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Our experts can help you gain up to{" "}
                  <strong>
                    {report.potential_score - report.score} points
                  </strong>{" "}
                  by addressing the issues below.
                </p>
              </div>
            </div>

            {/* Issues */}
            {report.issues.length > 0 && (
              <div className="card p-6">
                <h3 className="font-black text-[#0f172a] mb-4 flex items-center gap-2">
                  <AlertTriangle size={18} className="text-orange-500" />
                  Issues Found ({report.issues.length})
                </h3>
                <div className="space-y-3">
                  {report.issues.map((issue) => (
                    <div
                      key={issue.id}
                      className="flex gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100"
                    >
                      <AlertTriangle
                        size={16}
                        className="shrink-0 mt-0.5"
                        style={{
                          color:
                            issue.impact === "high"
                              ? "#ef4444"
                              : issue.impact === "medium"
                                ? "#f97316"
                                : "#eab308",
                        }}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <span className="text-sm font-bold text-[#0f172a]">
                            {issue.label}
                          </span>
                          <ImpactBadge impact={issue.impact} />
                        </div>
                        <p className="text-xs text-slate-500">
                          {issue.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recommendations */}
            <div className="card p-6">
              <h3 className="font-black text-[#0f172a] mb-4 flex items-center gap-2">
                <Zap size={18} className="text-[#ea580c]" />
                What You Can Do
              </h3>
              <div className="space-y-2.5">
                {report.recommendations.map((rec, i) => (
                  <div key={i} className="flex gap-3 text-sm text-slate-700">
                    <ChevronRight
                      size={16}
                      className="shrink-0 mt-0.5 text-[#1e3a8a]"
                    />
                    {rec}
                  </div>
                ))}
              </div>

              <div className="mt-5 p-4 rounded-xl border border-orange-200 bg-orange-50 text-sm text-orange-800">
                <strong>⚠️ Doing this alone is hard.</strong> Most people try
                and give up within 2 weeks. Our credit experts handle the
                disputes, negotiations, and follow-ups for you.
              </div>
            </div>

            {/* CTA */}
            <div className="card p-6 border-[#1e3a8a]/20 bg-gradient-to-br from-[#1e3a8a] to-[#1d4ed8] text-white">
              <h3 className="font-black text-xl mb-2">
                Get Expert Help — Fix It in {report.timeline_days} Days
              </h3>
              <p className="text-blue-200 text-sm mb-5">
                Book a consultation with our credit expert. They will call you,
                review your full report, and create a personalised fix plan.
              </p>
              <button
                onClick={() => setStep("plans")}
                className="w-full bg-[#ea580c] hover:bg-[#f97316] text-white font-bold rounded-full py-3.5 px-6 flex items-center justify-center gap-2 transition-colors"
              >
                Book Expert Consultation <ArrowRight size={16} />
              </button>
              <p className="text-center text-blue-300 text-xs mt-3">
                Starting at ₹499 · Agent calls within 24 hours
              </p>
            </div>

            <button
              onClick={() => setStep("form")}
              className="w-full text-center text-sm text-slate-400 hover:text-slate-600 py-2"
            >
              ← Check a different PAN
            </button>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════
            STEP 3 — Plans
        ══════════════════════════════════════════════════════════ */}
        {step === "plans" && (
          <div className="space-y-5">
            <div className="text-center">
              <h2 className="text-2xl font-black text-[#0f172a]">
                Choose Your Plan
              </h2>
              <p className="text-slate-500 text-sm mt-1">
                Our credit expert will call you within 24 hours of payment.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              {PLANS.map((plan) => (
                <button
                  key={plan.id}
                  onClick={() => setSelectedPlan(plan.id)}
                  className={`relative text-left rounded-2xl border-2 p-5 transition-all ${
                    selectedPlan === plan.id
                      ? "border-[#1e3a8a] bg-blue-50"
                      : "border-slate-200 bg-white hover:border-slate-300"
                  }`}
                >
                  {plan.popular && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#ea580c] text-white text-xs font-bold px-3 py-1 rounded-full">
                      Most Popular
                    </span>
                  )}
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="font-black text-[#0f172a]">{plan.name}</p>
                      <p className="text-xs text-slate-500">
                        {plan.calls} expert call{plan.calls > 1 ? "s" : ""}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-black text-[#0f172a]">
                        ₹{plan.price}
                      </p>
                      <p className="text-xs text-slate-400">one-time</p>
                    </div>
                  </div>
                  <ul className="space-y-1.5">
                    {plan.features.map((f) => (
                      <li key={f} className="flex gap-2 text-xs text-slate-600">
                        <CheckCircle
                          size={13}
                          className="shrink-0 mt-0.5 text-green-500"
                        />
                        {f}
                      </li>
                    ))}
                  </ul>
                  {selectedPlan === plan.id && (
                    <div className="absolute top-4 right-4">
                      <CheckCircle size={20} className="text-[#1e3a8a]" />
                    </div>
                  )}
                </button>
              ))}
            </div>

            {/* Confirm CTA */}
            <div className="card p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="font-semibold text-slate-700">
                  {PLANS.find((p) => p.id === selectedPlan)?.name}
                </span>
                <span className="text-xl font-black text-[#0f172a]">
                  ₹{PLANS.find((p) => p.id === selectedPlan)?.price}
                </span>
              </div>

              <div className="flex items-center gap-2 text-xs text-slate-500 mb-4">
                <Phone size={12} />
                Agent will call{" "}
                <strong className="text-[#0f172a]">+91 {phone}</strong> within
                24 hours
              </div>

              {payError && (
                <p className="text-sm text-red-600 bg-red-50 rounded-lg px-4 py-2 mb-3">
                  {payError}
                </p>
              )}

              <button
                onClick={handlePayment}
                disabled={paying}
                className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {paying ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Processing Payment…
                  </>
                ) : (
                  <>
                    Pay ₹{PLANS.find((p) => p.id === selectedPlan)?.price} &amp;
                    Book Call <ArrowRight size={16} />
                  </>
                )}
              </button>
              <p className="text-center text-xs text-slate-400 mt-3">
                🔒 Secure payment · Refundable if agent doesn't call within 24
                hours
              </p>
            </div>

            <button
              onClick={() => setStep("report")}
              className="w-full text-center text-sm text-slate-400 hover:text-slate-600 py-2"
            >
              ← Back to my report
            </button>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════
            STEP 4 — Success
        ══════════════════════════════════════════════════════════ */}
        {step === "success" && (
          <div className="card p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle size={32} className="text-green-600" />
            </div>
            <h2 className="text-2xl font-black text-[#0f172a] mb-2">
              Booking Confirmed!
            </h2>
            <p className="text-slate-500 text-sm mb-6">
              Payment received. Your credit expert will call you at{" "}
              <strong className="text-[#0f172a]">+91 {phone}</strong> within the
              next 24 hours.
            </p>

            <div className="bg-blue-50 border border-blue-100 rounded-xl p-5 text-left space-y-3 mb-6">
              <h3 className="font-bold text-[#0f172a] text-sm">
                What happens next?
              </h3>
              {[
                {
                  step: "1",
                  text: "Expert reviews your PAN & full CIBIL report (within 2 hours)",
                },
                {
                  step: "2",
                  text:
                    "Call scheduled on +91 " + phone + " — pick up, it's us!",
                },
                {
                  step: "3",
                  text: "You receive a personalised action plan via WhatsApp",
                },
                {
                  step: "4",
                  text: "We track your score monthly and adjust the plan",
                },
              ].map((item) => (
                <div key={item.step} className="flex gap-3 text-sm">
                  <span className="w-6 h-6 bg-[#1e3a8a] text-white rounded-full flex items-center justify-center text-xs font-bold shrink-0">
                    {item.step}
                  </span>
                  <span className="text-slate-600">{item.text}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/" className="btn-ghost flex-1 text-center">
                Back to Home
              </Link>
              <Link
                href="/dashboard"
                className="btn-secondary flex-1 text-center"
              >
                Go to Dashboard
              </Link>
            </div>

            <p className="text-xs text-slate-400 mt-4">
              Reference: LQF_CIBIL_{phone.slice(-4)}_
              {Date.now().toString().slice(-6)}
            </p>
          </div>
        )}
      </div>

      <Footer />
    </main>
  );
}
