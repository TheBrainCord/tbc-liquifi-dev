"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  Shield,
  Star,
  Loader2,
  ChevronRight,
  Clock,
  BadgeCheck,
  Zap,
  Phone,
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ConsultationModal } from "@/components/ConsultationModal";

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

// ─── Main Page ────────────────────────────────────────────────────────────────

const PAN_RE = /^[A-Z]{5}[0-9]{4}[A-Z]$/;

export default function CibilFixPage() {
  const [step, setStep] = useState<"form" | "report">("form");

  // Form state
  const [pan, setPan] = useState("");
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [panError, setPanError] = useState("");
  const [formError, setFormError] = useState("");
  const [checking, setChecking] = useState(false);

  // Report state
  const [report, setReport] = useState<CibilReport | null>(null);

  // Consultation modal
  const [showConsult, setShowConsult] = useState(false);

  // ── Check CIBIL ──
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

  return (
    <main className="min-h-screen bg-[#f8fafc]">
      <Navbar />

      {/* Hero */}
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
            call you within 6 hours with a personalised fix plan.
          </p>
          <div className="flex flex-wrap justify-center gap-4 mt-6 text-sm">
            {[
              { icon: Star, text: "4.8★ rated service" },
              { icon: BadgeCheck, text: "2,400+ scores improved" },
              { icon: Clock, text: "Expert calls in 6 hours" },
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
        {/* ── STEP 1: Form ── */}
        {step === "form" && (
          <div className="card p-8">
            <h2 className="text-xl font-black text-[#0f172a] mb-1">
              Check Your Credit Health
            </h2>
            <p className="text-sm text-slate-500 mb-6">
              Takes 10 seconds · completely free · no hard pull
            </p>

            <div className="space-y-4">
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

        {/* ── STEP 2: Report ── */}
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

            {/* What you can do */}
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

            {/* Schedule Expert Call CTA */}
            <div className="card p-6 bg-gradient-to-br from-[#1e3a8a] to-[#1d4ed8] border-0 text-white">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                  <Phone size={18} className="text-white" />
                </div>
                <div>
                  <h3 className="font-black text-lg leading-tight">
                    Talk to a Credit Expert — Free
                  </h3>
                  <p className="text-blue-200 text-xs">
                    No commitment · Expert calls within 6 hours
                  </p>
                </div>
              </div>

              <p className="text-blue-200 text-sm mb-5">
                Schedule a free call. Our expert will review your report,
                explain every issue, and walk you through a personalised fix
                plan. If you decide to proceed, the full report + guided fix
                costs just ₹699.
              </p>

              <div className="grid grid-cols-3 gap-3 mb-5">
                {[
                  { label: "Call within", value: "6 hours" },
                  { label: "Duration", value: "30 min" },
                  { label: "Cost", value: "Free" },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="bg-white/10 rounded-xl p-3 text-center"
                  >
                    <p className="text-white font-black text-base">
                      {item.value}
                    </p>
                    <p className="text-blue-300 text-xs mt-0.5">{item.label}</p>
                  </div>
                ))}
              </div>

              <button
                onClick={() => setShowConsult(true)}
                className="w-full bg-[#ea580c] hover:bg-[#f97316] text-white font-bold rounded-full py-3.5 px-6 flex items-center justify-center gap-2 transition-colors"
              >
                Schedule Free Expert Call <ArrowRight size={16} />
              </button>

              <p className="text-center text-blue-300 text-xs mt-3">
                After the call, get Full CIBIL Report + Fix Plan for ₹699
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
      </div>

      {/* Consultation modal */}
      {showConsult && (
        <ConsultationModal
          phone={phone}
          name={name || undefined}
          consultationType="cibil_fix"
          cibilScore={report?.score}
          onClose={() => setShowConsult(false)}
        />
      )}

      <Footer />
    </main>
  );
}
