"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  CheckCircle,
  Star,
  TrendingUp,
  CreditCard,
  Users,
  Loader2,
  LayoutDashboard,
} from "lucide-react";
import { OTPModal } from "@/components/OTPModal";
import { useAuth } from "@/lib/supabase/auth-provider";

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
  const { user } = useAuth();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<"loan" | "cibil">("loan");
  const [step, setStep] = useState(1);
  const [loanData, setLoanData] = useState({
    mobile: "",
    amount: "",
    type: "",
    employment: "",
    name: "",
    pincode: "",
    pan: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [otp, setOtp] = useState<OTPState | null>(null);

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
      let msg = "Something went wrong. Please try again.";
      try {
        const data = await res.json();
        msg = data.error ?? msg;
      } catch {
        /* non-JSON error body */
      }
      throw new Error(msg);
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

  return (
    <>
      {otp && (
        <OTPModal
          phone={otp.phone}
          name={otp.name}
          loanType={otp.loanType}
          onClose={() => setOtp(null)}
        />
      )}

      <section className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#0f2460] via-[#1e3a8a] to-[#1d4ed8] pb-16 pt-28">
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

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            {/* Left: Headline */}
            <div className="space-y-6 text-white">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm font-semibold backdrop-blur-sm">
                <span className="h-2 w-2 animate-pulse rounded-full bg-green-400" />
                RBI Registered &amp; 100% Secure
              </div>

              <h1 className="text-4xl font-black leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
                Fix Your Credit.
                <br />
                <span className="text-[#fb923c]">Fund Your Dreams.</span>
              </h1>

              <p className="max-w-lg text-lg leading-relaxed text-blue-100">
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

              <div className="grid grid-cols-2 gap-4 pt-4 sm:grid-cols-4">
                {TRUST_ITEMS.map(({ icon: Icon, value, label }) => (
                  <div key={label} className="text-center">
                    <Icon size={18} className="mx-auto mb-1 text-blue-300" />
                    <div className="text-xl font-black text-white">{value}</div>
                    <div className="text-xs text-blue-300">{label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Lead capture card */}
            <div
              id="check-eligibility"
              className="overflow-hidden rounded-2xl bg-white shadow-2xl"
            >
              {user ? (
                /* ── Already logged in ── */
                <div className="p-8 text-center space-y-5">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                    <CheckCircle size={32} className="text-green-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-[#0f172a]">
                      Welcome back!
                    </h2>
                    <p className="mt-1 text-sm text-slate-500">
                      You&apos;re signed in as{" "}
                      <span className="font-semibold text-[#1e3a8a]">
                        {user.phone}
                      </span>
                    </p>
                  </div>
                  <button
                    onClick={() => router.push("/dashboard")}
                    className="btn-primary w-full"
                  >
                    <LayoutDashboard size={16} />
                    Go to Dashboard
                  </button>
                </div>
              ) : (
                <>
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
                            ? "-mb-px border-b-2 border-[#1e3a8a] bg-blue-50 text-[#1e3a8a]"
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

                  <div className="flex items-center justify-center gap-2 px-6 pb-4 text-xs text-slate-400">
                    <CheckCircle size={12} className="text-green-500" />
                    256-bit SSL Encrypted &nbsp;|&nbsp; Your data is 100% secure
                  </div>
                </>
              )}
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
    pan: string;
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
  const [panError, setPanError] = useState("");
  const PAN_REGEX = /^[A-Z]{5}[0-9]{4}[A-Z]$/;
  const steps = ["Loan Details", "Personal Info", "Employment"];

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-black text-[#0f172a]">
          Check Loan Eligibility
        </h2>
        <p className="mt-0.5 text-sm text-slate-500">
          Takes only 2 minutes. No credit impact.
        </p>
      </div>

      {/* Step indicator */}
      <div className="flex items-center gap-2">
        {steps.map((s, i) => (
          <div key={s} className="flex flex-1 items-center gap-2">
            <div
              className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
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
            <label className="mb-1.5 block text-sm font-semibold text-slate-700">
              Loan Type
            </label>
            <div className="grid grid-cols-2 gap-2">
              {loanTypes.map((t) => (
                <button
                  key={t}
                  onClick={() => setData({ ...data, type: t })}
                  className={`rounded-lg border-2 px-3 py-2.5 text-sm font-semibold transition-all ${
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
            <label className="mb-1.5 block text-sm font-semibold text-slate-700">
              Loan Amount Required
            </label>
            <div className="flex flex-wrap gap-2">
              {loanAmounts.map((a) => (
                <button
                  key={a}
                  onClick={() => setData({ ...data, amount: a })}
                  className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition-all ${
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
            <label className="mb-1.5 block text-sm font-semibold text-slate-700">
              Mobile Number
            </label>
            <div className="flex">
              <span className="flex items-center rounded-l-lg border border-r-0 border-[#e2e8f0] bg-slate-100 px-3 text-sm font-semibold text-slate-500">
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
            className="btn-primary w-full disabled:cursor-not-allowed disabled:opacity-50"
          >
            Next Step <ArrowRight size={16} />
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-slate-700">
              Full Name
            </label>
            <input
              type="text"
              placeholder="As per PAN card"
              className="input-field"
              value={data.name}
              onChange={(e) => setData({ ...data, name: e.target.value })}
            />
            <p className="mt-1 text-xs text-slate-400">
              Required for credit check. Your PAN data is never stored.
            </p>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-slate-700">
              PAN Card{" "}
              <span className="font-normal text-slate-400">(Optional)</span>
            </label>
            <input
              type="text"
              maxLength={10}
              placeholder="ABCDE1234F"
              className={`input-field font-mono uppercase tracking-wider ${panError ? "border-red-400 focus:border-red-400 focus:ring-red-100" : ""}`}
              value={data.pan}
              onChange={(e) => {
                const val = e.target.value
                  .toUpperCase()
                  .replace(/[^A-Z0-9]/g, "");
                setData({ ...data, pan: val });
                if (panError && PAN_REGEX.test(val)) setPanError("");
              }}
              onBlur={() => {
                if (data.pan && !PAN_REGEX.test(data.pan)) {
                  setPanError("Invalid PAN format (e.g. ABCDE1234F)");
                } else {
                  setPanError("");
                }
              }}
            />
            {panError ? (
              <p className="mt-1 text-xs text-red-500">{panError}</p>
            ) : (
              <p className="mt-1 text-xs text-slate-400">
                Used for faster credit matching. Never stored.
              </p>
            )}
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-slate-700">
              Pin Code
            </label>
            <input
              type="text"
              maxLength={6}
              placeholder="6-digit pincode"
              className="input-field"
              value={data.pincode}
              onChange={(e) =>
                setData({ ...data, pincode: e.target.value.replace(/\D/g, "") })
              }
            />
          </div>
          <button
            onClick={onNext}
            disabled={
              !data.name ||
              data.pincode.length < 6 ||
              (!!data.pan && !PAN_REGEX.test(data.pan))
            }
            className="btn-primary w-full disabled:cursor-not-allowed disabled:opacity-50"
          >
            Next Step <ArrowRight size={16} />
          </button>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-slate-700">
              Employment Type
            </label>
            <div className="space-y-2">
              {employmentTypes.map((e) => (
                <button
                  key={e}
                  onClick={() => setData({ ...data, employment: e })}
                  className={`w-full rounded-lg border-2 px-4 py-3 text-left text-sm font-semibold transition-all ${
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
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
              {submitError}
            </p>
          )}

          <button
            onClick={onSubmit}
            disabled={!data.employment || submitting}
            className="btn-primary w-full disabled:cursor-not-allowed disabled:opacity-50"
          >
            {submitting ? (
              <>
                <Loader2 size={16} className="animate-spin" /> Saving…
              </>
            ) : (
              <>
                Check My Eligibility <ArrowRight size={16} />
              </>
            )}
          </button>
          <p className="text-center text-xs text-slate-400">
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
        <p className="mt-0.5 text-sm text-slate-500">
          Check your score without impacting it. Get a personalised repair plan.
        </p>
      </div>

      <div className="rounded-xl border border-blue-100 bg-gradient-to-r from-blue-50 to-orange-50 p-4">
        <div className="flex items-start gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#ea580c]">
            <TrendingUp size={14} className="text-white" />
          </div>
          <div>
            <div className="text-sm font-bold text-[#0f172a]">
              CIBIL Fix Program
            </div>
            <div className="mt-0.5 text-xs text-slate-600">
              Low score? Our experts dispute errors, clear dues &amp; improve
              your score in 90 days — guaranteed.
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-slate-700">
            Mobile Number
          </label>
          <div className="flex">
            <span className="flex items-center rounded-l-lg border border-r-0 border-[#e2e8f0] bg-slate-100 px-3 text-sm font-semibold text-slate-500">
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
            <CheckCircle size={14} className="shrink-0 text-green-500" />
            {item}
          </div>
        ))}

        {error && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
            {error}
          </p>
        )}

        <button
          onClick={handleSubmit}
          disabled={mobile.length < 10 || submitting}
          className="btn-primary w-full disabled:cursor-not-allowed disabled:opacity-50"
        >
          {submitting ? (
            <>
              <Loader2 size={16} className="animate-spin" /> Saving…
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
