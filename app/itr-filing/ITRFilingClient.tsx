"use client";

import { useState } from "react";
import {
  ArrowRight,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  FileText,
  Clock,
  ShieldCheck,
  Loader2,
  Star,
} from "lucide-react";
import { ExpertCallSection } from "@/components/ExpertCallSection";

const PLANS = [
  {
    id: "basic",
    name: "Basic",
    price: "₹499",
    tag: "Most Popular",
    popular: true,
    form: "ITR-1",
    desc: "Perfect for salaried employees with single employer",
    features: [
      "ITR-1 filing (salaried)",
      "Single Form-16",
      "AY 2024-25 & 2023-24",
      "Refund tracking",
      "CA review & sign-off",
      "Filing in 48 hours",
    ],
    color: "#1e3a8a",
    bg: "#eff6ff",
  },
  {
    id: "business",
    name: "Business",
    price: "₹999",
    tag: "Freelancers",
    popular: false,
    form: "ITR-3/4",
    desc: "For freelancers, consultants & self-employed professionals",
    features: [
      "ITR-3 or ITR-4 filing",
      "Multiple income sources",
      "Business expense deductions",
      "GST reconciliation help",
      "Section 44AD presumptive income",
      "CA consultation call included",
    ],
    color: "#7c3aed",
    bg: "#f5f3ff",
  },
  {
    id: "premium",
    name: "Premium",
    price: "₹1,499",
    tag: "HNI / NRI",
    popular: false,
    form: "ITR-2/3",
    desc: "For HNIs, NRIs, and complex income situations",
    features: [
      "Capital gains (equity, MF, property)",
      "Foreign income & DTAA",
      "NRI return filing",
      "Multiple property income",
      "Tax planning strategy call",
      "Priority 24hr filing",
    ],
    color: "#0369a1",
    bg: "#f0f9ff",
  },
];

const HOW_IT_WORKS = [
  {
    step: "01",
    title: "Choose Your Plan",
    time: "1 min",
    desc: "Select the right plan and share your basic details.",
    color: "#1e3a8a",
  },
  {
    step: "02",
    title: "CA Reviews Your Case",
    time: "2 hrs",
    desc: "Our CA contacts you, collects documents, and analyses your tax situation.",
    color: "#7c3aed",
  },
  {
    step: "03",
    title: "Draft Sent for Approval",
    time: "24 hrs",
    desc: "Review your ITR draft. Confirm all deductions and income entries.",
    color: "#0369a1",
  },
  {
    step: "04",
    title: "Filed & Done",
    time: "48 hrs",
    desc: "ITR filed on the IT portal. You get the acknowledgement (ITR-V) instantly.",
    color: "#16a34a",
  },
];

const FAQ = [
  {
    q: "What documents do I need for ITR filing?",
    a: "Form-16 (salaried), bank statements, investment proofs (PPF, ELSS, LIC), home loan interest certificate, rent receipts (HRA), and PAN card. Our CA will send you a complete checklist after booking.",
  },
  {
    q: "What is the last date to file ITR?",
    a: "For AY 2024-25 (FY 2023-24), the last date for individuals is July 31, 2024. Filing late attracts ₹1,000–₹5,000 penalty plus interest on tax due.",
  },
  {
    q: "How long does it take to get a refund?",
    a: "Income tax refunds typically arrive in 15-45 days after filing, directly to your pre-validated bank account. Faster for e-verified returns.",
  },
  {
    q: "Can I file a revised return if I made an error?",
    a: "Yes, revised returns can be filed before December 31 of the assessment year. Our CA can help you file a revised return at no extra cost if we made an error.",
  },
  {
    q: "Do I need to file ITR if my income is below ₹5 lakh?",
    a: "It's not mandatory if income is below ₹2.5L. But filing is recommended — it's required for visa applications, loan approvals, and to claim refunds if TDS was deducted.",
  },
  {
    q: "Can you file for multiple years?",
    a: "Yes, we can file for previous years (updated returns under ITR-U). Applicable from AY 2021-22 onwards with an additional tax of 25-50%. Contact us for details.",
  },
];

interface FormData {
  plan: string;
  name: string;
  phone: string;
  email: string;
  income_type: string;
  filing_year: string;
  notes: string;
}

export function ITRFilingClient() {
  const [step, setStep] = useState<1 | 2>(1);
  const [formData, setFormData] = useState<FormData>({
    plan: "",
    name: "",
    phone: "",
    email: "",
    income_type: "",
    filing_year: "AY 2024-25",
    notes: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  function set(field: keyof FormData, value: string) {
    setFormData((p) => ({ ...p, [field]: value }));
  }

  async function handleSubmit() {
    if (!formData.phone || formData.phone.length !== 10) {
      setError("Enter a valid 10-digit mobile number.");
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/itr/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          plan: formData.plan,
          name: formData.name || undefined,
          phone: formData.phone,
          email: formData.email || undefined,
          income_type: formData.income_type || undefined,
          filing_year: formData.filing_year || undefined,
          notes: formData.notes || undefined,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error ?? "Something went wrong. Please try again.");
        return;
      }
      setSuccess(true);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  const selectedPlan = PLANS.find((p) => p.id === formData.plan);

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-[#0f2460] via-[#1e3a8a] to-[#1d4ed8] pt-28 pb-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm font-semibold text-white backdrop-blur-sm mb-6">
            <FileText size={14} />
            CA-Assisted ITR Filing
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white leading-tight">
            File Your ITR.
            <br />
            <span className="text-[#fb923c]">Expert CA.</span>{" "}
            <span className="underline decoration-[#fb923c] decoration-4">
              Starting ₹499.
            </span>
          </h1>
          <p className="mt-5 text-base text-blue-100 max-w-xl mx-auto">
            100% online, accurate, and stress-free. Our CAs handle everything
            from Form-16 to capital gains. You just review and approve.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            {[
              { label: "Accuracy", value: "99%" },
              { label: "Filing Time", value: "48 hrs" },
              { label: "Returns Filed", value: "10,000+" },
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
          <div className="mt-6 flex flex-wrap justify-center gap-4 text-sm text-blue-100">
            {[
              "Certified Chartered Accountant",
              "100% Online",
              "Income Tax Portal Filing",
            ].map((t) => (
              <span key={t} className="flex items-center gap-1.5">
                <CheckCircle size={13} className="text-green-400" />
                {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing + Booking */}
      <section className="py-16 px-4 bg-[#f8fafc]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <div className="section-tag justify-center">Pricing</div>
            <h2 className="text-2xl sm:text-3xl font-black text-[#0f172a] mt-2">
              Choose Your Filing Plan
            </h2>
            <p className="text-slate-500 mt-2 text-sm">
              All plans include CA review, e-filing, and ITR-V acknowledgement.
            </p>
          </div>

          {/* Plan cards */}
          <div className="grid sm:grid-cols-3 gap-6 mb-12">
            {PLANS.map((plan) => (
              <button
                key={plan.id}
                onClick={() => {
                  set("plan", plan.id);
                  setStep(2);
                }}
                className={`card p-6 text-left relative overflow-hidden transition-all hover:shadow-lg ${
                  formData.plan === plan.id
                    ? "ring-2 ring-[#1e3a8a]"
                    : "hover:ring-1 hover:ring-slate-200"
                }`}
              >
                {plan.popular && (
                  <div className="absolute top-4 right-4 bg-[#1e3a8a] text-white text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
                    <Star size={10} /> {plan.tag}
                  </div>
                )}
                {!plan.popular && (
                  <div
                    className="absolute top-4 right-4 text-xs font-bold px-2.5 py-1 rounded-full"
                    style={{ color: plan.color, background: plan.bg }}
                  >
                    {plan.tag}
                  </div>
                )}
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center mb-4 text-xs font-black"
                  style={{ background: plan.bg, color: plan.color }}
                >
                  {plan.form}
                </div>
                <div
                  className="text-2xl font-black mb-1"
                  style={{ color: plan.color }}
                >
                  {plan.price}
                </div>
                <div className="text-base font-black text-[#0f172a]">
                  {plan.name}
                </div>
                <p className="text-xs text-slate-500 mt-1 mb-4">{plan.desc}</p>
                <ul className="space-y-2">
                  {plan.features.map((f) => (
                    <li
                      key={f}
                      className="flex items-start gap-2 text-xs text-slate-600"
                    >
                      <CheckCircle
                        size={12}
                        className="shrink-0 mt-0.5"
                        style={{ color: plan.color }}
                      />
                      {f}
                    </li>
                  ))}
                </ul>
                <div
                  className="mt-5 w-full py-2.5 rounded-full text-sm font-black text-center transition-all"
                  style={{ background: plan.color, color: "#fff" }}
                >
                  Book Now <ArrowRight size={14} className="inline ml-1" />
                </div>
              </button>
            ))}
          </div>

          {/* Booking form */}
          {step === 2 && !success && (
            <div className="card p-6 sm:p-8 max-w-xl mx-auto">
              <div className="flex items-center gap-3 mb-6">
                {selectedPlan && (
                  <div
                    className="px-3 py-1.5 rounded-full text-xs font-black"
                    style={{
                      background: selectedPlan.bg,
                      color: selectedPlan.color,
                    }}
                  >
                    {selectedPlan.name} — {selectedPlan.price}
                  </div>
                )}
                <button
                  onClick={() => setStep(1)}
                  className="text-xs text-slate-400 hover:text-slate-600 ml-auto"
                >
                  Change plan
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                      Your Name
                    </label>
                    <input
                      type="text"
                      placeholder="Full name"
                      className="input-field"
                      value={formData.name}
                      onChange={(e) => set("name", e.target.value)}
                    />
                  </div>
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
                        placeholder="10-digit number"
                        className="flex-1 rounded-r-xl border border-[#e2e8f0] bg-white px-4 py-3 text-sm font-semibold text-[#0f172a] outline-none focus:border-[#1e3a8a] focus:ring-2 focus:ring-[#1e3a8a]/10"
                        value={formData.phone}
                        onChange={(e) =>
                          set("phone", e.target.value.replace(/\D/g, ""))
                        }
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                    Email{" "}
                    <span className="font-normal text-slate-400">
                      (get your ITR-V here)
                    </span>
                  </label>
                  <input
                    type="email"
                    placeholder="yourname@email.com"
                    className="input-field"
                    value={formData.email}
                    onChange={(e) => set("email", e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Income Type
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: "salaried", label: "Salaried", icon: "💼" },
                      { id: "freelancer", label: "Freelancer", icon: "💻" },
                      { id: "business", label: "Business", icon: "🏪" },
                      { id: "nri", label: "NRI", icon: "✈️" },
                    ].map((opt) => (
                      <button
                        key={opt.id}
                        onClick={() => set("income_type", opt.id)}
                        className={`flex items-center gap-2 rounded-xl border-2 px-3 py-2 text-left text-xs font-semibold transition-all ${
                          formData.income_type === opt.id
                            ? "border-[#1e3a8a] bg-blue-50 text-[#1e3a8a]"
                            : "border-slate-200 text-slate-600 hover:border-slate-300"
                        }`}
                      >
                        <span>{opt.icon}</span> {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Assessment Year
                  </label>
                  <div className="flex gap-2">
                    {["AY 2024-25", "AY 2023-24", "Both"].map((yr) => (
                      <button
                        key={yr}
                        onClick={() => set("filing_year", yr)}
                        className={`flex-1 rounded-xl border-2 px-3 py-2 text-xs font-semibold transition-all ${
                          formData.filing_year === yr
                            ? "border-[#1e3a8a] bg-blue-50 text-[#1e3a8a]"
                            : "border-slate-200 text-slate-600 hover:border-slate-300"
                        }`}
                      >
                        {yr}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                    Anything specific?{" "}
                    <span className="font-normal text-slate-400">
                      (optional)
                    </span>
                  </label>
                  <textarea
                    rows={2}
                    placeholder="e.g. I have capital gains from mutual funds..."
                    className="input-field resize-none"
                    value={formData.notes}
                    onChange={(e) => set("notes", e.target.value)}
                  />
                </div>

                {error && (
                  <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">
                    {error}
                  </p>
                )}

                <button
                  onClick={handleSubmit}
                  disabled={
                    submitting ||
                    !formData.phone ||
                    formData.phone.length !== 10
                  }
                  className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? (
                    <>
                      <Loader2 size={16} className="animate-spin" /> Booking…
                    </>
                  ) : (
                    <>
                      <FileText size={16} /> Confirm ITR Booking
                      <ArrowRight size={16} />
                    </>
                  )}
                </button>
                <p className="text-center text-xs text-slate-400">
                  CA will contact you within 24 hours · Secure & confidential
                </p>
              </div>
            </div>
          )}

          {/* Success */}
          {success && (
            <div className="card p-8 max-w-md mx-auto text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle size={32} className="text-green-600" />
              </div>
              <h3 className="font-black text-[#0f172a] text-xl mb-2">
                Booking Confirmed!
              </h3>
              <p className="text-sm text-slate-500 mb-4">
                Our CA will call you on{" "}
                <strong className="text-[#0f172a]">+91 {formData.phone}</strong>{" "}
                within 24 hours. Keep your documents handy.
                {formData.email && (
                  <>
                    {" "}
                    A confirmation has been sent to{" "}
                    <strong>{formData.email}</strong>.
                  </>
                )}
              </p>
              <div className="bg-blue-50 rounded-xl p-4 text-left text-sm text-[#1e3a8a]">
                <div className="font-semibold mb-2">
                  Documents to keep ready:
                </div>
                <ul className="space-y-1 text-xs text-slate-600">
                  <li>📄 Form-16 from employer</li>
                  <li>🏦 Bank statements (Apr–Mar)</li>
                  <li>📊 Investment proofs (80C, 80D)</li>
                  <li>🪪 PAN card</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <div className="section-tag justify-center">Process</div>
            <h2 className="text-2xl sm:text-3xl font-black text-[#0f172a] mt-2">
              How It Works
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

      {/* Why Us */}
      <section className="py-16 px-4 bg-[#f8fafc]">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="section-tag justify-center">Why LiquiFi CA</div>
            <h2 className="text-2xl sm:text-3xl font-black text-[#0f172a] mt-2">
              Expert Filing. Zero Hassle.
            </h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              {
                Icon: ShieldCheck,
                title: "Certified CA",
                desc: "ICAI-registered Chartered Accountant with 10+ years of ITR experience across all income types.",
                color: "#16a34a",
                bg: "#f0fdf4",
              },
              {
                Icon: Clock,
                title: "48-Hour Filing",
                desc: "Once documents are submitted, your return is filed within 48 hours. Track status in real time.",
                color: "#1e3a8a",
                bg: "#eff6ff",
              },
              {
                Icon: FileText,
                title: "100% Online",
                desc: "Share documents via WhatsApp or email. No office visits. ITR-V sent directly to your inbox.",
                color: "#7c3aed",
                bg: "#f5f3ff",
              },
            ].map(({ Icon, title, desc, color, bg }) => (
              <div key={title} className="card p-6">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                  style={{ background: bg }}
                >
                  <Icon size={22} style={{ color }} />
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

      {/* FAQ */}
      <section className="py-16 px-4 bg-white">
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

      <ExpertCallSection consultationType="loan" loanType="itr_filing" />
    </>
  );
}
