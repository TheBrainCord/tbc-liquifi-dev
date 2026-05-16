"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  IndianRupee,
  Loader2,
  Zap,
} from "lucide-react";
import { OTPModal } from "@/components/OTPModal";
import { useAuth } from "@/lib/supabase/auth-provider";

function calcEMI(p: number, rAnnual: number, nMonths: number) {
  const r = rAnnual / 12 / 100;
  if (r === 0) return p / nMonths;
  return (p * r * Math.pow(1 + r, nMonths)) / (Math.pow(1 + r, nMonths) - 1);
}

function formatINR(n: number) {
  if (n >= 10_000_000) return `₹${(n / 10_000_000).toFixed(1)}Cr`;
  if (n >= 100_000) return `₹${(n / 100_000).toFixed(1)}L`;
  return `₹${Math.round(n).toLocaleString("en-IN")}`;
}

export interface LoanConfig {
  title: string;
  badge: string;
  headline: string;
  subhead: string;
  gradient: string;
  color: string;
  rate: number;
  rateDisplay: string;
  maxAmountDisplay: string;
  maxAmount: number;
  tenureMonths: number;
  tenureDisplay: string;
  approvalTime: string;
  loanType: "personal" | "home" | "business" | "car";
  disbursementSteps: {
    step: string;
    title: string;
    time: string;
    desc: string;
  }[];
  highlights: { title: string; desc: string; stat: string }[];
  faq: { q: string; a: string }[];
}

export function LoanDetailPage({ loan }: { loan: LoanConfig }) {
  const { user } = useAuth();
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [otpPhone, setOtpPhone] = useState<string | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const defaultPrincipal = Math.min(Math.round(loan.maxAmount * 0.2), 1000000);
  const defaultTenure = Math.min(loan.tenureMonths, 60);

  const [principal, setPrincipal] = useState(defaultPrincipal);
  const [rate, setRate] = useState(loan.rate);
  const [tenure, setTenure] = useState(defaultTenure);

  const emi = useMemo(
    () => Math.round(calcEMI(principal, rate, tenure)),
    [principal, rate, tenure],
  );
  const totalPaid = useMemo(() => Math.round(emi * tenure), [emi, tenure]);
  const totalInterest = useMemo(
    () => totalPaid - principal,
    [totalPaid, principal],
  );

  const handleApply = async () => {
    if (phone.length < 10) return;
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/leads/capture", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, loan_type: loan.loanType }),
      });
      if (!res.ok) {
        let msg = "Something went wrong. Please try again.";
        try {
          const d = await res.json();
          msg = d.error ?? msg;
        } catch {
          /* non-JSON body */
        }
        throw new Error(msg);
      }
      setOtpPhone(phone);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      {otpPhone && (
        <OTPModal
          phone={otpPhone}
          loanType={loan.loanType}
          onClose={() => setOtpPhone(null)}
        />
      )}

      {/* ── Hero ── */}
      <section
        className={`relative pt-24 pb-20 bg-gradient-to-br ${loan.gradient} overflow-hidden`}
      >
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "radial-gradient(circle at 25% 60%, rgba(255,255,255,0.3) 0%, transparent 50%), radial-gradient(circle at 75% 30%, rgba(255,255,255,0.2) 0%, transparent 45%)",
          }}
        />
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.15) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col lg:flex-row gap-12 items-start lg:items-center">
            {/* Left */}
            <div className="flex-1 text-white space-y-6">
              <Link
                href="/#personal-loan"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-white/60 hover:text-white/90 transition-colors"
              >
                ← All Loan Products
              </Link>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold backdrop-blur-sm">
                <span className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
                {loan.badge}
              </div>
              <h1 className="text-4xl sm:text-5xl font-black leading-tight">
                {loan.headline}
              </h1>
              <p className="text-lg text-white/80 max-w-xl leading-relaxed">
                {loan.subhead}
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { label: "Rate from", value: loan.rateDisplay },
                  { label: "Max Amount", value: loan.maxAmountDisplay },
                  { label: "Tenure", value: loan.tenureDisplay },
                  { label: "Approval", value: loan.approvalTime },
                ].map(({ label, value }) => (
                  <div
                    key={label}
                    className="rounded-xl bg-white/10 border border-white/15 backdrop-blur-sm p-3 text-center"
                  >
                    <div className="text-lg font-black text-white">{value}</div>
                    <div className="text-xs text-white/60 mt-0.5">{label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Apply card */}
            <div className="w-full lg:w-96 bg-white rounded-2xl shadow-2xl p-7 space-y-5">
              <div>
                <h2 className="text-xl font-black text-[#0f172a]">
                  Apply for {loan.title}
                </h2>
                <p className="text-sm text-slate-500 mt-1">
                  Takes 2 minutes · No CIBIL impact
                </p>
              </div>

              {user ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-2.5 rounded-xl bg-green-50 border border-green-100 px-4 py-3">
                    <CheckCircle
                      size={18}
                      className="text-green-600 shrink-0"
                    />
                    <div className="text-sm">
                      <div className="font-semibold text-green-800">
                        Signed in as {user.phone}
                      </div>
                      <div className="text-green-600 text-xs">
                        Manage your applications from the dashboard
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => router.push("/dashboard")}
                    className="w-full py-3 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90"
                    style={{ background: loan.color }}
                  >
                    Go to Dashboard →
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                      Mobile Number
                    </label>
                    <div className="flex">
                      <span className="flex items-center rounded-l-xl border border-r-0 border-slate-200 bg-slate-50 px-3 text-sm font-semibold text-slate-500">
                        +91
                      </span>
                      <input
                        type="tel"
                        maxLength={10}
                        placeholder="10-digit mobile"
                        className="flex-1 rounded-r-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        value={phone}
                        onChange={(e) =>
                          setPhone(e.target.value.replace(/\D/g, ""))
                        }
                      />
                    </div>
                  </div>

                  {[
                    "Free eligibility check — no CIBIL impact",
                    "Matched with best offer in 60 seconds",
                    "100% digital — zero branch visits",
                  ].map((item) => (
                    <div
                      key={item}
                      className="flex items-center gap-2 text-xs text-slate-500"
                    >
                      <CheckCircle
                        size={12}
                        className="text-green-500 shrink-0"
                      />
                      {item}
                    </div>
                  ))}

                  {error && (
                    <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
                      {error}
                    </p>
                  )}

                  <button
                    onClick={handleApply}
                    disabled={phone.length < 10 || submitting}
                    className="w-full py-3 rounded-xl text-sm font-bold text-white flex items-center justify-center gap-2 transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ background: loan.color }}
                  >
                    {submitting ? (
                      <>
                        <Loader2 size={16} className="animate-spin" /> Checking…
                      </>
                    ) : (
                      <>
                        Check My Eligibility <ArrowRight size={16} />
                      </>
                    )}
                  </button>
                  <p className="text-center text-xs text-slate-400">
                    🔒 256-bit SSL secured · Data never sold
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── Disbursement Timeline ── */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-1.5 text-xs font-bold text-slate-600 uppercase tracking-wider mb-4">
              How It Works
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-[#0f172a]">
              From Application to{" "}
              <span style={{ color: loan.color }}>Disbursement</span>
            </h2>
            <p className="text-slate-500 mt-3 max-w-lg mx-auto">
              Our streamlined process gets money in your account faster than any
              bank branch.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {loan.disbursementSteps.map((s) => (
              <div
                key={s.step}
                className="rounded-2xl border border-slate-100 bg-white shadow-sm hover:shadow-md transition-shadow p-6 space-y-4"
              >
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl font-black text-white"
                  style={{ background: loan.color }}
                >
                  {s.step}
                </div>
                <div>
                  <div className="inline-flex items-center gap-1.5 rounded-full bg-slate-50 border border-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-500 mb-2">
                    <Zap size={10} style={{ color: loan.color }} />
                    {s.time}
                  </div>
                  <h3 className="font-black text-[#0f172a] text-lg">
                    {s.title}
                  </h3>
                  <p className="text-sm text-slate-500 mt-1.5 leading-relaxed">
                    {s.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Highlights ── */}
      <section className="py-16 bg-[#f8fafc]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid sm:grid-cols-3 gap-6">
            {loan.highlights.map((h) => (
              <div
                key={h.title}
                className="rounded-2xl bg-white border border-slate-100 shadow-sm p-7 space-y-4 hover:shadow-md transition-shadow"
              >
                <div
                  className="text-xs font-black uppercase tracking-widest px-3 py-1.5 rounded-full inline-block text-white"
                  style={{ background: loan.color }}
                >
                  {h.stat}
                </div>
                <h3 className="text-xl font-black text-[#0f172a]">{h.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">
                  {h.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── EMI Calculator ── */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-1.5 text-xs font-bold text-slate-600 uppercase tracking-wider mb-4">
              EMI Calculator
            </div>
            <h2 className="text-3xl font-black text-[#0f172a]">
              Calculate Your Monthly Payment
            </h2>
          </div>

          <div className="rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="grid md:grid-cols-2">
              <div className="p-8 space-y-8 border-b md:border-b-0 md:border-r border-slate-200">
                <SliderField
                  label="Loan Amount"
                  value={principal}
                  min={100000}
                  max={loan.maxAmount}
                  step={50000}
                  format={formatINR}
                  onChange={setPrincipal}
                  color={loan.color}
                />
                <SliderField
                  label="Interest Rate (% p.a.)"
                  value={rate}
                  min={7}
                  max={24}
                  step={0.25}
                  format={(v) => `${v.toFixed(2)}%`}
                  onChange={setRate}
                  color={loan.color}
                />
                <SliderField
                  label="Tenure (Months)"
                  value={tenure}
                  min={6}
                  max={loan.tenureMonths}
                  step={6}
                  format={(v) => `${v} mo`}
                  onChange={setTenure}
                  color={loan.color}
                />
              </div>

              <div className="p-8 flex flex-col justify-center space-y-6 bg-slate-50">
                <div className="text-center">
                  <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                    Monthly EMI
                  </div>
                  <div
                    className="text-5xl font-black"
                    style={{ color: loan.color }}
                  >
                    {formatINR(emi)}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {[
                    {
                      label: "Principal",
                      value: formatINR(principal),
                      sub: "amount borrowed",
                    },
                    {
                      label: "Total Interest",
                      value: formatINR(totalInterest),
                      sub: "over full tenure",
                    },
                    {
                      label: "Total Payable",
                      value: formatINR(totalPaid),
                      sub: "principal + interest",
                    },
                    {
                      label: "Tenure",
                      value: `${tenure} mo`,
                      sub: `${(tenure / 12).toFixed(1)} years`,
                    },
                  ].map(({ label, value, sub }) => (
                    <div
                      key={label}
                      className="rounded-xl bg-white border border-slate-100 p-4 text-center"
                    >
                      <div className="text-xs text-slate-400 mb-0.5">
                        {label}
                      </div>
                      <div className="font-black text-[#0f172a]">{value}</div>
                      <div className="text-xs text-slate-400">{sub}</div>
                    </div>
                  ))}
                </div>

                <div>
                  <div className="h-3 rounded-full bg-slate-200 overflow-hidden mb-2">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${Math.round((principal / Math.max(totalPaid, 1)) * 100)}%`,
                        background: loan.color,
                      }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span className="flex items-center gap-1.5">
                      <span
                        className="h-2.5 w-2.5 rounded-full"
                        style={{ background: loan.color }}
                      />
                      Principal{" "}
                      {Math.round((principal / Math.max(totalPaid, 1)) * 100)}%
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="h-2.5 w-2.5 rounded-full bg-slate-300" />
                      Interest{" "}
                      {Math.round(
                        (totalInterest / Math.max(totalPaid, 1)) * 100,
                      )}
                      %
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl font-black text-[#0f172a] text-center mb-10">
            Frequently Asked Questions
          </h2>
          <div className="space-y-3">
            {loan.faq.map((item, i) => (
              <div
                key={i}
                className="rounded-xl bg-white border border-slate-100 overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-6 py-4 text-left"
                >
                  <span className="font-semibold text-[#0f172a] text-sm">
                    {item.q}
                  </span>
                  {openFaq === i ? (
                    <ChevronUp size={16} className="text-slate-400 shrink-0" />
                  ) : (
                    <ChevronDown
                      size={16}
                      className="text-slate-400 shrink-0"
                    />
                  )}
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-5 text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-4">
                    {item.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Bottom CTA ── */}
      <section
        className={`py-20 bg-gradient-to-br ${loan.gradient} text-white`}
      >
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold backdrop-blur-sm">
            <span className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
            Apply in 2 minutes · No branch visit needed
          </div>
          <h2 className="text-3xl sm:text-4xl font-black">
            Ready for Your {loan.title}?
          </h2>
          <p className="text-white/80 text-lg">
            Join 24 lakh+ Indians who got better loan deals through LiquiFi.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/#check-eligibility"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-white font-bold transition-all hover:bg-white/90 hover:shadow-lg text-sm"
              style={{ color: loan.color }}
            >
              Check Eligibility <ArrowRight size={16} />
            </Link>
            <Link
              href="/#emi-calculator"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full border-2 border-white/40 font-bold text-white text-sm transition-all hover:border-white hover:bg-white/10"
            >
              <IndianRupee size={16} />
              EMI Calculator
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

function SliderField({
  label,
  value,
  min,
  max,
  step,
  format,
  onChange,
  color,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  format: (v: number) => string;
  onChange: (v: number) => void;
  color: string;
}) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-semibold text-slate-600">{label}</label>
        <span className="text-sm font-black text-[#0f172a]">
          {format(value)}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-2 rounded-full appearance-none cursor-pointer"
        style={{
          background: `linear-gradient(to right, ${color} ${pct}%, #e2e8f0 ${pct}%)`,
        }}
      />
      <div className="flex justify-between text-xs text-slate-400">
        <span>{format(min)}</span>
        <span>{format(max)}</span>
      </div>
    </div>
  );
}
