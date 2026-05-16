"use client";

import { useState } from "react";
import {
  ArrowRight,
  CheckCircle,
  Star,
  TrendingUp,
  CreditCard,
  Users,
  Loader2,
} from "lucide-react";
import { OTPModal } from "@/components/OTPModal";

const LOAN_TYPES = ["Personal Loan", "Home Loan", "Business Loan", "Car Loan"];
const LOAN_AMOUNTS = [
  "₹1 Lakh",
  "₹5 Lakh",
  "₹10 Lakh",
  "₹25 Lakh",
  "₹50 Lakh+",
];
const EMPLOYMENT_TYPES = ["Salaried", "Self-Employed", "Business Owner"];

const LOAN_TYPE_MAP: Record<string, string> = {
  "Personal Loan": "personal",
  "Home Loan": "home",
  "Business Loan": "business",
  "Car Loan": "car",
};

const EMPLOYMENT_MAP: Record<string, string> = {
  Salaried: "salaried",
  "Self-Employed": "self_employed",
  "Business Owner": "business_owner",
};

const TRUST_ITEMS = [
  { icon: Users, value: "2.4M+", label: "Happy Customers" },
  { icon: TrendingUp, value: "₹12,000 Cr+", label: "Loans Disbursed" },
  { icon: Star, value: "4.8/5", label: "App Rating" },
  { icon: CreditCard, value: "90 Days", label: "CIBIL Fix Guarantee" },
];

interface OTPState {
  phone: string;
  name?: string;
  loanType?: string;
}

export function HeroSection() {
  const [activeTab, setActiveTab] = useState<"loan" | "cibil">("loan");
  const [step, setStep] = useState(1);
  const [loanData, setLoanData] = useState({
    mobile: "",
    amount: "",
    type: "",
    employment: "",
    name: "",
    pincode: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [otp, setOtp] = useState<OTPState | null>(null);
  const [verified, setVerified] = useState(false);

  const captureLead = async (payload: {
    phone: string;
    name?: string;
    loan_type: string;
    loan_amount?: string;
    employment_type?: string;
    pincode?: string;
  }) => {
    const res = await fetch("/api/leads/capture", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error ?? "Something went wrong");
    }
  };

  const handleLoanSubmit = async () => {
    setSubmitting(true);
    setSubmitError("");
    try {
      await captureLead({
        phone: loanData.mobile,
        name: loanData.name || undefined,
        loan_type: LOAN_TYPE_MAP[loanData.type] ?? "personal",
        loan_amount: loanData.amount || undefined,
        employment_type: EMPLOYMENT_MAP[loanData.employment] ?? undefined,
        pincode: loanData.pincode || undefined,
      });
      setOtp({
        phone: loanData.mobile,
        name: loanData.name || undefined,
        loanType: LOAN_TYPE_MAP[loanData.type],
      });
    } catch (e) {
      setSubmitError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  const handleVerified = () => {
    setOtp(null);
    setVerified(true);
  };

  if (verified) {
    return (
      <section className="relative min-h-screen bg-gradient-to-br from-[#0f2460] via-[#1e3a8a] to-[#1d4ed8] pt-28 pb-16 overflow-hidden flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-2xl p-10 max-w-md w-full mx-4 text-center space-y-5">
          <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto">
            <CheckCircle size={40} className="text-green-600" />
          </div>
          <h2 className="text-2xl font-black text-[#0f172a]">
            You&apos;re Verified!
          </h2>
          <p className="text-slate-600 text-sm">
            Our credit expert will call you within 30 minutes with personalised
            loan offers matched to your profile.
          </p>
          <div className="bg-blue-50 rounded-xl p-4 text-sm font-semibold text-[#1e3a8a]">
            Average approval time:{" "}
            <span className="text-green-600">24 hours</span>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      {otp && (
        <OTPModal
          phone={otp.phone}
          name={otp.name}
          loanType={otp.loanType}
          onVerified={handleVerified}
          onClose={() => setOtp(null)}
        />
      )}

      <section className="relative min-h-screen bg-gradient-to-br from-[#0f2460] via-[#1e3a8a] to-[#1d4ed8] pt-28 pb-16 overflow-hidden">
        {/* Background decoration */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 50%, #60a5fa 0%, transparent 50%), radial-gradient(circle at 80% 20%, #f97316 0%, transparent 45%)",
          }}
        />
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Headline */}
            <div className="text-white space-y-6">
              <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 text-sm font-semibold backdrop-blur-sm">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                RBI Registered &amp; 100% Secure
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-[1.05] tracking-tight">
                Fix Your Credit.
                <br />
                <span className="text-[#fb923c]">Fund Your Dreams.</span>
              </h1>

              <p className="text-lg text-blue-100 max-w-lg leading-relaxed">
                India&apos;s smartest loan marketplace. Check your CIBIL score
                for free, get matched with 50+ lenders, or repair your credit in
                90 days with our AI-powered CIBIL Fix program.
              </p>

              <div className="flex flex-wrap gap-3">
                {[
                  "Free CIBIL Check",
                  "No Hidden Charges",
                  "Instant Approval",
                ].map((item) => (
                  <span
                    key={item}
                    className="flex items-center gap-1.5 text-sm text-blue-100"
                  >
                    <CheckCircle size={15} className="text-green-400" />
                    {item}
                  </span>
                ))}
              </div>

              {/* Trust metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4">
                {TRUST_ITEMS.map(({ icon: Icon, value, label }) => (
                  <div key={label} className="text-center">
                    <Icon size={18} className="text-blue-300 mx-auto mb-1" />
                    <div className="text-xl font-black text-white">{value}</div>
                    <div className="text-xs text-blue-300">{label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Lead capture card */}
            <div
              id="check-eligibility"
              className="bg-white rounded-2xl shadow-2xl overflow-hidden"
            >
              {/* Tabs */}
              <div className="flex border-b border-[#e2e8f0]">
                {(
                  [
                    { id: "loan", label: "Apply for Loan" },
                    { id: "cibil", label: "CIBIL Fix" },
                  ] as const
                ).map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id);
                      setStep(1);
                      setSubmitError("");
                    }}
                    className={`flex-1 py-4 text-sm font-bold transition-colors ${
                      activeTab === tab.id
                        ? "text-[#1e3a8a] border-b-2 border-[#1e3a8a] -mb-px bg-blue-50"
                        : "text-slate-500 hover:text-slate-700"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <div className="p-6">
                {activeTab === "loan" ? (
                  <LoanForm
                    step={step}
                    data={loanData}
                    setData={setLoanData}
                    onNext={() => setStep((s) => Math.min(s + 1, 3))}
                    onSubmit={handleLoanSubmit}
                    submitting={submitting}
                    submitError={submitError}
                    loanTypes={LOAN_TYPES}
                    loanAmounts={LOAN_AMOUNTS}
                    employmentTypes={EMPLOYMENT_TYPES}
                  />
                ) : (
                  <CIBILFixForm
                    onOTPRequired={(phone) =>
                      setOtp({ phone, loanType: "cibil_fix" })
                    }
                  />
                )}
              </div>

              <div className="px-6 pb-4 flex items-center justify-center gap-2 text-xs text-slate-400">
                <CheckCircle size={12} className="text-green-500" />
                256-bit SSL Encrypted &nbsp;|&nbsp; Your data is 100% secure
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function LoanForm({
  step,
  data,
  setData,
  onNext,
  onSubmit,
  submitting,
  submitError,
  loanTypes,
  loanAmounts,
  employmentTypes,
}: {
  step: number;
  data: {
    mobile: string;
    amount: string;
    type: string;
    employment: string;
    name: string;
    pincode: string;
  };
  setData: (d: typeof data) => void;
  onNext: () => void;
  onSubmit: () => void;
  submitting: boolean;
  submitError: string;
  loanTypes: string[];
  loanAmounts: string[];
  employmentTypes: string[];
}) {
  const steps = ["Loan Details", "Personal Info", "Employment"];

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-black text-[#0f172a]">
          Check Loan Eligibility
        </h2>
        <p className="text-sm text-slate-500 mt-0.5">
          Takes only 2 minutes. No credit impact.
        </p>
      </div>

      {/* Step indicator */}
      <div className="flex items-center gap-2">
        {steps.map((s, i) => (
          <div key={s} className="flex items-center gap-2 flex-1">
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                i + 1 <= step
                  ? "bg-[#1e3a8a] text-white"
                  : "bg-slate-100 text-slate-400"
              }`}
            >
              {i + 1 < step ? <CheckCircle size={13} /> : i + 1}
            </div>
            <span
              className={`text-xs font-semibold ${i + 1 <= step ? "text-[#1e3a8a]" : "text-slate-400"}`}
            >
              {s}
            </span>
            {i < steps.length - 1 && (
              <div
                className={`h-px flex-1 ${i + 1 < step ? "bg-[#1e3a8a]" : "bg-slate-200"}`}
              />
            )}
          </div>
        ))}
      </div>

      {step === 1 && (
        <div className="space-y-4">
          <div>
            <label className="text-sm font-semibold text-slate-700 block mb-1.5">
              Loan Type
            </label>
            <div className="grid grid-cols-2 gap-2">
              {loanTypes.map((t) => (
                <button
                  key={t}
                  onClick={() => setData({ ...data, type: t })}
                  className={`py-2.5 px-3 rounded-lg text-sm font-semibold border-2 transition-all ${
                    data.type === t
                      ? "border-[#1e3a8a] bg-blue-50 text-[#1e3a8a]"
                      : "border-[#e2e8f0] text-slate-600 hover:border-[#1e3a8a]"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-sm font-semibold text-slate-700 block mb-1.5">
              Loan Amount Required
            </label>
            <div className="flex flex-wrap gap-2">
              {loanAmounts.map((a) => (
                <button
                  key={a}
                  onClick={() => setData({ ...data, amount: a })}
                  className={`py-1.5 px-3 rounded-full text-xs font-semibold border transition-all ${
                    data.amount === a
                      ? "border-[#ea580c] bg-orange-50 text-[#ea580c]"
                      : "border-[#e2e8f0] text-slate-500 hover:border-[#ea580c]"
                  }`}
                >
                  {a}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-sm font-semibold text-slate-700 block mb-1.5">
              Mobile Number
            </label>
            <div className="flex">
              <span className="flex items-center px-3 bg-slate-100 border border-r-0 border-[#e2e8f0] rounded-l-lg text-sm font-semibold text-slate-500">
                +91
              </span>
              <input
                type="tel"
                maxLength={10}
                placeholder="Enter 10-digit mobile"
                className="input-field rounded-l-none border-l-0"
                value={data.mobile}
                onChange={(e) =>
                  setData({
                    ...data,
                    mobile: e.target.value.replace(/\D/g, ""),
                  })
                }
              />
            </div>
          </div>
          <button
            onClick={onNext}
            disabled={!data.type || !data.amount || data.mobile.length < 10}
            className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next Step <ArrowRight size={16} />
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4">
          <div>
            <label className="text-sm font-semibold text-slate-700 block mb-1.5">
              Full Name
            </label>
            <input
              type="text"
              placeholder="As per PAN card"
              className="input-field"
              value={data.name}
              onChange={(e) => setData({ ...data, name: e.target.value })}
            />
            <p className="text-xs text-slate-400 mt-1">
              Required for credit check. Your PAN data is never stored.
            </p>
          </div>
          <div>
            <label className="text-sm font-semibold text-slate-700 block mb-1.5">
              Pin Code
            </label>
            <input
              type="text"
              maxLength={6}
              placeholder="6-digit pincode"
              className="input-field"
              value={data.pincode}
              onChange={(e) =>
                setData({
                  ...data,
                  pincode: e.target.value.replace(/\D/g, ""),
                })
              }
            />
          </div>
          <button
            onClick={onNext}
            disabled={!data.name || data.pincode.length < 6}
            className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next Step <ArrowRight size={16} />
          </button>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-4">
          <div>
            <label className="text-sm font-semibold text-slate-700 block mb-1.5">
              Employment Type
            </label>
            <div className="space-y-2">
              {employmentTypes.map((e) => (
                <button
                  key={e}
                  onClick={() => setData({ ...data, employment: e })}
                  className={`w-full py-3 px-4 rounded-lg text-sm font-semibold border-2 text-left transition-all ${
                    data.employment === e
                      ? "border-[#1e3a8a] bg-blue-50 text-[#1e3a8a]"
                      : "border-[#e2e8f0] text-slate-600 hover:border-[#1e3a8a]"
                  }`}
                >
                  {e}
                </button>
              ))}
            </div>
          </div>

          {submitError && (
            <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">
              {submitError}
            </p>
          )}

          <button
            onClick={onSubmit}
            disabled={!data.employment || submitting}
            className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Saving…
              </>
            ) : (
              <>
                Check My Eligibility <ArrowRight size={16} />
              </>
            )}
          </button>
          <p className="text-xs text-center text-slate-400">
            By continuing, you agree to our{" "}
            <a href="#terms" className="text-[#1e3a8a] underline">
              T&amp;C
            </a>{" "}
            &amp;{" "}
            <a href="#privacy" className="text-[#1e3a8a] underline">
              Privacy Policy
            </a>
          </p>
        </div>
      )}
    </div>
  );
}

function CIBILFixForm({
  onOTPRequired,
}: {
  onOTPRequired: (phone: string) => void;
}) {
  const [mobile, setMobile] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (mobile.length < 10) return;
    setSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/leads/capture", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: mobile, loan_type: "cibil_fix" }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Something went wrong");
      }
      onOTPRequired(mobile);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-black text-[#0f172a]">Free CIBIL Check</h2>
        <p className="text-sm text-slate-500 mt-0.5">
          Check your score without impacting it. Get a personalized repair plan.
        </p>
      </div>

      <div className="bg-gradient-to-r from-blue-50 to-orange-50 rounded-xl p-4 border border-blue-100">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-[#ea580c] flex items-center justify-center shrink-0">
            <TrendingUp size={14} className="text-white" />
          </div>
          <div>
            <div className="text-sm font-bold text-[#0f172a]">
              CIBIL Fix Program
            </div>
            <div className="text-xs text-slate-600 mt-0.5">
              Low score? Our experts dispute errors, clear dues &amp; improve
              your score in 90 days — guaranteed.
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <div>
          <label className="text-sm font-semibold text-slate-700 block mb-1.5">
            Mobile Number
          </label>
          <div className="flex">
            <span className="flex items-center px-3 bg-slate-100 border border-r-0 border-[#e2e8f0] rounded-l-lg text-sm font-semibold text-slate-500">
              +91
            </span>
            <input
              type="tel"
              maxLength={10}
              placeholder="Enter 10-digit mobile"
              className="input-field rounded-l-none border-l-0"
              value={mobile}
              onChange={(e) => setMobile(e.target.value.replace(/\D/g, ""))}
            />
          </div>
        </div>

        {[
          "Free CIBIL score report",
          "No credit impact check",
          "Expert call within 30 min",
        ].map((item) => (
          <div
            key={item}
            className="flex items-center gap-2 text-sm text-slate-600"
          >
            <CheckCircle size={14} className="text-green-500 shrink-0" />
            {item}
          </div>
        ))}

        {error && (
          <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">
            {error}
          </p>
        )}

        <button
          onClick={handleSubmit}
          disabled={mobile.length < 10 || submitting}
          className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Saving…
            </>
          ) : (
            <>
              Get Free CIBIL Report <ArrowRight size={16} />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
