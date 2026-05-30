"use client";

import { useState, useMemo } from "react";
import {
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  TrendingDown,
  LayoutList,
  ShieldCheck,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  Loader2,
  Phone,
  Clock,
} from "lucide-react";
import { ExpertCallSection } from "@/components/ExpertCallSection";
import { ConsultationModal } from "@/components/ConsultationModal";

const LOAN_TYPE_OPTIONS = [
  { id: "credit_card", label: "Credit Card Dues", icon: "💳" },
  { id: "personal_loan", label: "Personal Loan", icon: "👤" },
  { id: "home_loan", label: "Home Loan", icon: "🏠" },
  { id: "car_loan", label: "Car Loan", icon: "🚗" },
  { id: "business_loan", label: "Business Loan", icon: "💼" },
  { id: "education_loan", label: "Education Loan", icon: "🎓" },
];

const HOW_IT_WORKS = [
  {
    step: "01",
    title: "Share Your Debt Details",
    time: "2 min",
    desc: "Tell us your loans, credit card dues, amounts and rates.",
    color: "#1e3a8a",
  },
  {
    step: "02",
    title: "We Analyse Your Profile",
    time: "60 sec",
    desc: "Our system calculates your burden and matches you with the best lenders.",
    color: "#7c3aed",
  },
  {
    step: "03",
    title: "Expert Calls You — Free",
    time: "6 hrs",
    desc: "A dedicated advisor confirms the best rate and guides the paperwork.",
    color: "#0369a1",
  },
  {
    step: "04",
    title: "Single EMI. Done.",
    time: "48 hrs",
    desc: "Old loans closed, new lower-rate loan active. One EMI. Peace of mind.",
    color: "#16a34a",
  },
];

const BENEFITS = [
  {
    Icon: TrendingDown,
    title: "Cut Your EMI by Up to 40%",
    desc: "Credit card at 42% costs ₹3,500/mo per ₹1L. At 12%, it's ₹1,350. Real savings every month.",
    stat: "Up to 40% lower EMI",
    color: "#16a34a",
    bg: "#f0fdf4",
  },
  {
    Icon: LayoutList,
    title: "One Loan Replaces Many",
    desc: "Merge 4 different EMI dates into a single predictable monthly payment.",
    stat: "1 EMI instead of many",
    color: "#1e3a8a",
    bg: "#eff6ff",
  },
  {
    Icon: ShieldCheck,
    title: "No Prepayment Penalty",
    desc: "All LiquiFi balance transfer partners offer zero prepayment penalties on floating-rate loans.",
    stat: "Zero exit charges",
    color: "#7c3aed",
    bg: "#f5f3ff",
  },
];

const FAQ = [
  {
    q: "What is a balance transfer loan?",
    a: "A balance transfer moves high-interest debt (credit cards, personal loans) to a new lender at a lower rate. You repay at a lower EMI, saving money every month.",
  },
  {
    q: "Can I transfer credit card dues to a loan?",
    a: "Yes — the most common balance transfer. Cards charge 36-48% p.a. A personal loan through LiquiFi starts at 10.5% — up to 4× cheaper.",
  },
  {
    q: "Will a balance transfer affect my CIBIL score?",
    a: "Closing multiple loans may temporarily dip your score 5-10 points but lower utilisation and on-time payments typically improve it within 3-6 months.",
  },
  {
    q: "Is there a minimum amount?",
    a: "Most lenders require a minimum outstanding of ₹50,000. No upper limit — we've processed transfers above ₹50 lakh.",
  },
  {
    q: "How long does it take?",
    a: "48-72 hours from application to disbursement. The new lender pays off your old loans directly.",
  },
  {
    q: "Are there any charges?",
    a: "No LiquiFi fee. The new lender may charge a processing fee (0.5-2%). We negotiate to minimise this for you.",
  },
];

function calcEMI(p: number, rAnnual: number, n: number) {
  const r = rAnnual / 12 / 100;
  return r === 0
    ? p / n
    : (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
}

const NEW_RATE = 12;
const CALC_TENURE = 36;

interface FormData {
  loanTypes: string[];
  totalOutstanding: string;
  currentRate: string;
  employmentType: string;
  monthlyIncome: string;
  mobile: string;
}

export function BalanceTransferClient() {
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
  const [formData, setFormData] = useState<FormData>({
    loanTypes: [],
    totalOutstanding: "",
    currentRate: "",
    employmentType: "",
    monthlyIncome: "",
    mobile: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState("");
  const [showConsultModal, setShowConsultModal] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const savings = useMemo(() => {
    const p = parseFloat(formData.totalOutstanding) || 500000;
    const curR = parseFloat(formData.currentRate) || 36;
    const curEMI = Math.round(calcEMI(p, curR, CALC_TENURE));
    const newEMI = Math.round(calcEMI(p, NEW_RATE, CALC_TENURE));
    return {
      curEMI,
      newEMI,
      monthly: Math.max(0, curEMI - newEMI),
      total: Math.max(0, curEMI - newEMI) * CALC_TENURE,
    };
  }, [formData.totalOutstanding, formData.currentRate]);

  function toggleLoanType(id: string) {
    setFormData((prev) => ({
      ...prev,
      loanTypes: prev.loanTypes.includes(id)
        ? prev.loanTypes.filter((t) => t !== id)
        : [...prev.loanTypes, id],
    }));
  }

  async function handleLeadCapture() {
    if (formData.mobile.length !== 10) {
      setApiError("Enter a valid 10-digit mobile number.");
      return;
    }
    setSubmitting(true);
    setApiError("");
    try {
      const res = await fetch("/api/leads/capture", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: formData.mobile,
          loan_type: "balance_transfer",
          loan_amount: formData.totalOutstanding || undefined,
          employment_type: formData.employmentType || undefined,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setApiError(data.error ?? "Something went wrong. Please try again.");
        return;
      }
      setShowConsultModal(true);
    } catch {
      setApiError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  const fmt = (n: number) => "₹" + n.toLocaleString("en-IN");

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-[#0f2460] via-[#1e3a8a] to-[#0369a1] pt-28 pb-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm font-semibold text-white backdrop-blur-sm mb-6">
            <RefreshCw size={14} />
            Loan Consolidation & Balance Transfer
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white leading-tight">
            Stop Paying 42% on
            <br />
            <span className="text-[#fb923c]">Credit Card Debt.</span>
            <br />
            Transfer to{" "}
            <span className="underline decoration-[#fb923c] decoration-4">
              10.5%
            </span>
            .
          </h1>
          <p className="mt-5 text-base text-blue-100 max-w-xl mx-auto">
            Merge all your high-interest loans and credit card dues into one
            single low-EMI loan. Our experts handle everything — free.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-4">
            {[
              { label: "Rate from", value: "10.5% p.a." },
              { label: "EMI Reduction", value: "Up to 40%" },
              { label: "Disbursement", value: "48 hrs" },
            ].map(({ label, value }) => (
              <div
                key={label}
                className="bg-white/10 border border-white/20 rounded-2xl px-5 py-3 backdrop-blur-sm"
              >
                <div className="text-xl font-black text-white">{value}</div>
                <div className="text-xs text-blue-200 mt-0.5">{label}</div>
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap justify-center gap-4 text-sm text-blue-100">
            {[
              "50+ bank partners",
              "Zero LiquiFi fee",
              "Free expert consultation",
            ].map((t) => (
              <span key={t} className="flex items-center gap-1.5">
                <CheckCircle size={13} className="text-green-400" />
                {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Form + Live Savings Panel */}
      <section className="py-16 px-4 bg-[#f8fafc]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <div className="section-tag justify-center">Get Started</div>
            <h2 className="text-2xl sm:text-3xl font-black text-[#0f172a] mt-2">
              See How Much You Can Save
            </h2>
          </div>

          <div className="grid lg:grid-cols-5 gap-8 items-start">
            {/* Multi-step form */}
            <div className="lg:col-span-3 card p-6 sm:p-8">
              {/* Step pills */}
              <div className="flex items-center gap-2 mb-8">
                {([1, 2, 3] as const).map((s) => (
                  <div key={s} className="flex items-center gap-2">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-black transition-colors ${
                        currentStep === s
                          ? "bg-[#1e3a8a] text-white"
                          : currentStep > s
                            ? "bg-green-500 text-white"
                            : "bg-slate-100 text-slate-400"
                      }`}
                    >
                      {currentStep > s ? <CheckCircle size={14} /> : s}
                    </div>
                    {s < 3 && (
                      <div
                        className={`h-0.5 w-8 sm:w-12 rounded ${
                          currentStep > s ? "bg-green-400" : "bg-slate-200"
                        }`}
                      />
                    )}
                  </div>
                ))}
                <span className="ml-2 text-xs text-slate-400 font-semibold">
                  Step {currentStep} of 3
                </span>
              </div>

              {/* Step 1 */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-3">
                      Which loans do you want to consolidate?{" "}
                      <span className="font-normal text-slate-400">
                        (select all that apply)
                      </span>
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {LOAN_TYPE_OPTIONS.map((opt) => (
                        <button
                          key={opt.id}
                          onClick={() => toggleLoanType(opt.id)}
                          className={`flex items-center gap-2 rounded-xl border-2 px-3 py-2.5 text-left text-xs font-semibold transition-all ${
                            formData.loanTypes.includes(opt.id)
                              ? "border-[#1e3a8a] bg-blue-50 text-[#1e3a8a]"
                              : "border-slate-200 text-slate-600 hover:border-slate-300"
                          }`}
                        >
                          <span>{opt.icon}</span>
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                      Total Outstanding Amount (₹)
                    </label>
                    <input
                      type="number"
                      placeholder="e.g. 500000"
                      className="input-field"
                      value={formData.totalOutstanding}
                      onChange={(e) =>
                        setFormData((p) => ({
                          ...p,
                          totalOutstanding: e.target.value,
                        }))
                      }
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                      Current Avg. Interest Rate (% p.a.)
                    </label>
                    <input
                      type="number"
                      placeholder="e.g. 36"
                      className="input-field"
                      value={formData.currentRate}
                      onChange={(e) =>
                        setFormData((p) => ({
                          ...p,
                          currentRate: e.target.value,
                        }))
                      }
                    />
                    <p className="text-xs text-slate-400 mt-1">
                      Credit cards: 36-48% · Personal loans: 18-24%
                    </p>
                  </div>

                  <button
                    onClick={() => setCurrentStep(2)}
                    className="btn-primary w-full"
                  >
                    Continue <ArrowRight size={16} />
                  </button>
                </div>
              )}

              {/* Step 2 */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-3">
                      Employment Type
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: "salaried", label: "Salaried", icon: "💼" },
                        {
                          id: "self_employed",
                          label: "Self-Employed",
                          icon: "🧑‍💻",
                        },
                        {
                          id: "business_owner",
                          label: "Business Owner",
                          icon: "🏪",
                        },
                      ].map((opt) => (
                        <button
                          key={opt.id}
                          onClick={() =>
                            setFormData((p) => ({
                              ...p,
                              employmentType: opt.id,
                            }))
                          }
                          className={`flex flex-col items-center gap-1.5 rounded-xl border-2 px-2 py-3 text-xs font-semibold transition-all ${
                            formData.employmentType === opt.id
                              ? "border-[#1e3a8a] bg-blue-50 text-[#1e3a8a]"
                              : "border-slate-200 text-slate-600 hover:border-slate-300"
                          }`}
                        >
                          <span className="text-xl">{opt.icon}</span>
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                      Monthly Income (₹)
                    </label>
                    <input
                      type="number"
                      placeholder="e.g. 60000"
                      className="input-field"
                      value={formData.monthlyIncome}
                      onChange={(e) =>
                        setFormData((p) => ({
                          ...p,
                          monthlyIncome: e.target.value,
                        }))
                      }
                    />
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => setCurrentStep(1)}
                      className="btn-ghost flex-1"
                    >
                      <ArrowLeft size={16} /> Back
                    </button>
                    <button
                      onClick={() => setCurrentStep(3)}
                      className="btn-primary flex-2 flex-1"
                    >
                      Continue <ArrowRight size={16} />
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3 */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                      Mobile Number
                    </label>
                    <div className="flex">
                      <span className="flex items-center rounded-l-xl border border-r-0 border-[#e2e8f0] bg-[#f8fafc] px-3 text-sm font-semibold text-slate-500">
                        +91
                      </span>
                      <input
                        type="tel"
                        maxLength={10}
                        placeholder="10-digit mobile number"
                        className="flex-1 rounded-r-xl border border-[#e2e8f0] bg-white px-4 py-3 text-sm font-semibold text-[#0f172a] outline-none focus:border-[#1e3a8a] focus:ring-2 focus:ring-[#1e3a8a]/10"
                        value={formData.mobile}
                        onChange={(e) =>
                          setFormData((p) => ({
                            ...p,
                            mobile: e.target.value.replace(/\D/g, ""),
                          }))
                        }
                        onKeyDown={(e) =>
                          e.key === "Enter" &&
                          formData.mobile.length === 10 &&
                          handleLeadCapture()
                        }
                      />
                    </div>
                  </div>

                  <div className="bg-blue-50 rounded-xl p-4 text-sm text-[#1e3a8a]">
                    <div className="font-semibold mb-1">
                      Your estimated savings:
                    </div>
                    <div className="text-2xl font-black">
                      {fmt(savings.monthly)}/month
                    </div>
                    <div className="text-xs text-slate-500 mt-1">
                      {fmt(savings.total)} saved over 36 months
                    </div>
                  </div>

                  {apiError && (
                    <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">
                      {apiError}
                    </p>
                  )}

                  <div className="flex gap-3">
                    <button
                      onClick={() => setCurrentStep(2)}
                      className="btn-ghost"
                    >
                      <ArrowLeft size={16} />
                    </button>
                    <button
                      onClick={handleLeadCapture}
                      disabled={submitting || formData.mobile.length !== 10}
                      className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {submitting ? (
                        <>
                          <Loader2 size={16} className="animate-spin" />{" "}
                          Processing…
                        </>
                      ) : (
                        <>
                          <Phone size={16} /> Get Free Expert Call
                          <ArrowRight size={16} />
                        </>
                      )}
                    </button>
                  </div>

                  <p className="text-center text-xs text-slate-400">
                    Free consultation · No commitment · No spam
                  </p>
                </div>
              )}
            </div>

            {/* Live Savings Panel */}
            <div className="lg:col-span-2 space-y-4 lg:sticky lg:top-24">
              <div className="card p-5">
                <div className="flex items-center gap-2 mb-4">
                  <TrendingDown size={16} className="text-green-600" />
                  <span className="text-sm font-bold text-[#0f172a]">
                    Live Savings Estimate
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2.5 border-b border-slate-100">
                    <span className="text-xs text-slate-500">
                      Current Monthly EMI
                    </span>
                    <span className="text-sm font-black text-red-500">
                      {fmt(savings.curEMI)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2.5 border-b border-slate-100">
                    <span className="text-xs text-slate-500">
                      New EMI at {NEW_RATE}%
                    </span>
                    <span className="text-sm font-black text-green-600">
                      {fmt(savings.newEMI)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2.5 border-b border-slate-100">
                    <span className="text-xs text-slate-500">
                      Monthly Savings
                    </span>
                    <span className="text-base font-black text-[#1e3a8a]">
                      {fmt(savings.monthly)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2.5">
                    <span className="text-xs text-slate-500">
                      Total Savings (36 mo)
                    </span>
                    <span className="text-base font-black text-[#1e3a8a]">
                      {fmt(savings.total)}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-400 mt-3">
                  Based on {CALC_TENURE}-month tenure at {NEW_RATE}% p.a. Actual
                  rates may vary.
                </p>
              </div>

              <div className="card p-5 bg-[#fff7ed] border border-orange-100">
                <div className="flex items-start gap-3">
                  <Clock
                    size={18}
                    className="text-orange-500 shrink-0 mt-0.5"
                  />
                  <div>
                    <div className="text-sm font-bold text-orange-800">
                      Expert calls within 6 hours
                    </div>
                    <div className="text-xs text-orange-700 mt-1">
                      Our advisor will confirm the exact rate for your profile
                      and guide you through the entire process.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <div className="section-tag justify-center">Process</div>
            <h2 className="text-2xl sm:text-3xl font-black text-[#0f172a] mt-2">
              How Balance Transfer Works
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {HOW_IT_WORKS.map((item) => (
              <div key={item.step} className="card p-6 text-center">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center text-white font-black text-lg mx-auto mb-4"
                  style={{ background: item.color }}
                >
                  {item.step}
                </div>
                <div className="text-xs font-bold text-slate-400 mb-1">
                  ~{item.time}
                </div>
                <h3 className="text-sm font-black text-[#0f172a] mb-2">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 px-4 bg-[#f8fafc]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <div className="section-tag justify-center">
              Why Balance Transfer
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-[#0f172a] mt-2">
              Real Benefits. Real Savings.
            </h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-6">
            {BENEFITS.map(({ Icon, title, desc, stat, color, bg }) => (
              <div key={title} className="card p-6">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                  style={{ background: bg }}
                >
                  <Icon size={22} style={{ color }} />
                </div>
                <div
                  className="text-xs font-bold mb-2 px-2 py-1 rounded-full inline-block"
                  style={{ color, background: bg }}
                >
                  {stat}
                </div>
                <h3 className="text-base font-black text-[#0f172a] mb-2">
                  {title}
                </h3>
                <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Standalone Savings Calculator */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <div className="section-tag justify-center">Calculator</div>
            <h2 className="text-2xl sm:text-3xl font-black text-[#0f172a] mt-2">
              Calculate Your Exact Savings
            </h2>
            <p className="text-slate-500 mt-2 text-sm">
              Adjust sliders to see real-time savings.
            </p>
          </div>
          <SavingsCalculator />
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 px-4 bg-[#f8fafc]">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-10">
            <div className="section-tag justify-center">FAQ</div>
            <h2 className="text-2xl sm:text-3xl font-black text-[#0f172a] mt-2">
              Common Questions
            </h2>
          </div>
          <div className="space-y-3">
            {FAQ.map((item, i) => (
              <div key={i} className="card overflow-hidden">
                <button
                  className="w-full flex items-center justify-between px-5 py-4 text-left text-sm font-semibold text-[#0f172a]"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  {item.q}
                  {openFaq === i ? (
                    <ChevronUp size={16} className="shrink-0 text-slate-400" />
                  ) : (
                    <ChevronDown
                      size={16}
                      className="shrink-0 text-slate-400"
                    />
                  )}
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-4 text-sm text-slate-500 leading-relaxed border-t border-slate-100 pt-3">
                    {item.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Expert Call Section */}
      <ExpertCallSection consultationType="loan" loanType="balance_transfer" />

      {/* Consultation Modal */}
      {showConsultModal && (
        <ConsultationModal
          phone={formData.mobile}
          consultationType="loan"
          loanType="balance_transfer"
          onClose={() => setShowConsultModal(false)}
        />
      )}
    </>
  );
}

function SavingsCalculator() {
  const [outstanding, setOutstanding] = useState(500000);
  const [currentRate, setCurrentRate] = useState(36);

  const savings = useMemo(() => {
    const curEMI = Math.round(calcEMI(outstanding, currentRate, CALC_TENURE));
    const newEMI = Math.round(calcEMI(outstanding, NEW_RATE, CALC_TENURE));
    return {
      curEMI,
      newEMI,
      monthly: Math.max(0, curEMI - newEMI),
      total: Math.max(0, curEMI - newEMI) * CALC_TENURE,
    };
  }, [outstanding, currentRate]);

  const fmt = (n: number) => "₹" + n.toLocaleString("en-IN");

  return (
    <div className="card p-6 sm:p-8">
      <div className="space-y-6 mb-8">
        <div>
          <div className="flex justify-between mb-2">
            <label className="text-sm font-semibold text-slate-700">
              Total Outstanding
            </label>
            <span className="text-sm font-black text-[#1e3a8a]">
              {fmt(outstanding)}
            </span>
          </div>
          <input
            type="range"
            min={50000}
            max={5000000}
            step={50000}
            value={outstanding}
            onChange={(e) => setOutstanding(Number(e.target.value))}
            className="w-full accent-[#1e3a8a]"
          />
          <div className="flex justify-between text-xs text-slate-400 mt-1">
            <span>₹50K</span>
            <span>₹50L</span>
          </div>
        </div>

        <div>
          <div className="flex justify-between mb-2">
            <label className="text-sm font-semibold text-slate-700">
              Current Interest Rate
            </label>
            <span className="text-sm font-black text-red-500">
              {currentRate}% p.a.
            </span>
          </div>
          <input
            type="range"
            min={10}
            max={48}
            step={1}
            value={currentRate}
            onChange={(e) => setCurrentRate(Number(e.target.value))}
            className="w-full accent-[#1e3a8a]"
          />
          <div className="flex justify-between text-xs text-slate-400 mt-1">
            <span>10%</span>
            <span>48%</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          {
            label: "Current EMI",
            value: fmt(savings.curEMI),
            accent: "text-red-500",
          },
          {
            label: `New EMI (${NEW_RATE}%)`,
            value: fmt(savings.newEMI),
            accent: "text-green-600",
          },
          {
            label: "Monthly Savings",
            value: fmt(savings.monthly),
            accent: "text-[#1e3a8a]",
          },
          {
            label: "Total Savings",
            value: fmt(savings.total),
            accent: "text-[#1e3a8a]",
          },
        ].map(({ label, value, accent }) => (
          <div key={label} className="bg-[#f8fafc] rounded-xl p-4 text-center">
            <div className={`text-lg font-black ${accent}`}>{value}</div>
            <div className="text-xs text-slate-400 mt-1">{label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
