"use client";

import Link from "next/link";
import {
  User,
  Home,
  Briefcase,
  Car,
  GraduationCap,
  Heart,
  ArrowRight,
  CheckCircle,
} from "lucide-react";

const PRODUCTS = [
  {
    icon: User,
    title: "Personal Loan",
    subtitle: "For any purpose",
    rate: "10.5% p.a.",
    max: "₹40 Lakh",
    tenure: "Up to 7 years",
    color: "#1e3a8a",
    bg: "#eff6ff",
    features: [
      "No collateral required",
      "Instant approval in 24 hrs",
      "Minimal documentation",
    ],
    popular: true,
    href: "/loans/personal",
  },
  {
    icon: Home,
    title: "Home Loan",
    subtitle: "Buy your dream home",
    rate: "8.5% p.a.",
    max: "₹5 Crore",
    tenure: "Up to 30 years",
    color: "#16a34a",
    bg: "#f0fdf4",
    features: [
      "Lowest interest rates",
      "Tax benefit under 80C",
      "Balance transfer available",
    ],
    popular: false,
    href: "/loans/home",
  },
  {
    icon: Briefcase,
    title: "Business Loan",
    subtitle: "Fuel your growth",
    rate: "12% p.a.",
    max: "₹2 Crore",
    tenure: "Up to 5 years",
    color: "#7c3aed",
    bg: "#f5f3ff",
    features: [
      "Collateral-free up to ₹50L",
      "Flexible repayment",
      "GST-based underwriting",
    ],
    popular: false,
    href: "/loans/business",
  },
  {
    icon: Car,
    title: "Car Loan",
    subtitle: "New & used vehicles",
    rate: "8.75% p.a.",
    max: "₹1 Crore",
    tenure: "Up to 7 years",
    color: "#ea580c",
    bg: "#fff7ed",
    features: [
      "90% on-road funding",
      "Same day approval",
      "Used car financing",
    ],
    popular: false,
    href: "/loans/car",
  },
  {
    icon: GraduationCap,
    title: "Education Loan",
    subtitle: "Invest in your future",
    rate: "9.5% p.a.",
    max: "₹75 Lakh",
    tenure: "Up to 15 years",
    color: "#0891b2",
    bg: "#ecfeff",
    features: [
      "Moratorium during study",
      "India & abroad courses",
      "Tax deduction u/s 80E",
    ],
    popular: false,
    href: "#check-eligibility",
  },
  {
    icon: Heart,
    title: "Medical Loan",
    subtitle: "Emergency healthcare",
    rate: "11% p.a.",
    max: "₹25 Lakh",
    tenure: "Up to 5 years",
    color: "#be185d",
    bg: "#fdf2f8",
    features: [
      "Disbursed in 4 hours",
      "Cashless at hospitals",
      "Zero processing fee",
    ],
    popular: false,
    href: "#check-eligibility",
  },
];

export function LoanProducts() {
  return (
    <section id="personal-loan" className="py-20 bg-[#f8fafc]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-14">
          <div className="section-tag justify-center">Loan Products</div>
          <h2 className="text-3xl sm:text-4xl font-black text-[#0f172a] mt-2">
            Every Loan You Need,{" "}
            <span className="gradient-text-orange">Under One Roof</span>
          </h2>
          <p className="text-slate-500 mt-3 max-w-xl mx-auto">
            Compare offers from 50+ banks and NBFCs. Apply once, get multiple
            approvals.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {PRODUCTS.map((product) => {
            const Icon = product.icon;
            return (
              <div
                key={product.title}
                className={`card p-6 relative overflow-hidden ${product.popular ? "ring-2 ring-[#1e3a8a]" : ""}`}
              >
                {product.popular && (
                  <div className="absolute top-4 right-4 bg-[#1e3a8a] text-white text-xs font-bold px-2.5 py-1 rounded-full">
                    Most Popular
                  </div>
                )}

                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                  style={{ background: product.bg }}
                >
                  <Icon size={22} style={{ color: product.color }} />
                </div>

                <h3 className="text-lg font-black text-[#0f172a]">
                  {product.title}
                </h3>
                <p className="text-sm text-slate-500 mb-4">
                  {product.subtitle}
                </p>

                <div className="grid grid-cols-3 gap-2 mb-5 py-4 border-y border-[#e2e8f0]">
                  <div className="text-center">
                    <div
                      className="text-sm font-black"
                      style={{ color: product.color }}
                    >
                      {product.rate}
                    </div>
                    <div className="text-xs text-slate-400">Interest</div>
                  </div>
                  <div className="text-center border-x border-[#e2e8f0]">
                    <div className="text-sm font-black text-[#0f172a]">
                      {product.max}
                    </div>
                    <div className="text-xs text-slate-400">Max Amount</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-black text-[#0f172a]">
                      {product.tenure}
                    </div>
                    <div className="text-xs text-slate-400">Tenure</div>
                  </div>
                </div>

                <ul className="space-y-2 mb-5">
                  {product.features.map((f) => (
                    <li
                      key={f}
                      className="flex items-center gap-2 text-sm text-slate-600"
                    >
                      <CheckCircle
                        size={13}
                        style={{ color: product.color }}
                        className="shrink-0"
                      />
                      {f}
                    </li>
                  ))}
                </ul>

                <Link
                  href={product.href}
                  className="flex items-center justify-center gap-2 w-full py-2.5 rounded-full text-sm font-bold border-2 transition-all hover:shadow-sm hover:text-white"
                  style={{
                    borderColor: product.color,
                    color: product.color,
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.background =
                      product.color;
                    (e.currentTarget as HTMLElement).style.color = "#fff";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.background = "";
                    (e.currentTarget as HTMLElement).style.color =
                      product.color;
                  }}
                >
                  Apply Now <ArrowRight size={14} />
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
