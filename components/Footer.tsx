"use client";

import { Phone, Mail, MapPin, Shield, Lock, ExternalLink } from "lucide-react";

const LOAN_LINKS = [
  { label: "Personal Loan", href: "#personal-loan" },
  { label: "Home Loan", href: "#home-loan" },
  { label: "Business Loan", href: "#business-loan" },
  { label: "Car Loan", href: "#car-loan" },
  { label: "Education Loan", href: "#check-eligibility" },
  { label: "Medical Loan", href: "#check-eligibility" },
  { label: "Balance Transfer", href: "/balance-transfer" },
];

const COMPANY_LINKS = [
  { label: "About Us", href: "#" },
  { label: "Careers", href: "#" },
  { label: "Blog", href: "#" },
  { label: "Press", href: "#" },
  { label: "Partners", href: "#" },
];

const SUPPORT_LINKS = [
  { label: "Help Center", href: "#" },
  { label: "Track Application", href: "#" },
  { label: "EMI Calculator", href: "#emi-calculator" },
  { label: "CIBIL Check", href: "#cibil-fix" },
  { label: "Grievance Redressal", href: "#" },
];

const LEGAL_LINKS = [
  { label: "Privacy Policy", href: "#" },
  { label: "Terms of Service", href: "#" },
  { label: "Cookie Policy", href: "#" },
  { label: "Fair Practice Code", href: "#" },
  { label: "KYC Policy", href: "#" },
];

export function Footer() {
  return (
    <footer className="bg-[#0f172a] text-white">
      {/* Pre-footer CTA */}
      <div className="bg-gradient-to-r from-[#1e3a8a] to-[#1d4ed8] py-12 px-4">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <h2 className="text-2xl sm:text-3xl font-black">
            Ready to Get the Loan You Deserve?
          </h2>
          <p className="text-blue-200">
            Join 2.4 million Indians who got better rates through LiquiFi.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="#check-eligibility"
              className="btn-primary inline-flex items-center justify-center gap-2"
            >
              Check Eligibility Free
            </a>
            <a
              href="tel:18001234567"
              className="inline-flex items-center justify-center gap-2 border-2 border-white/30 text-white font-bold px-6 py-3 rounded-full hover:bg-white/10 transition-colors"
            >
              <Phone size={16} />
              1800-123-4567
            </a>
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
        {/* Brand */}
        <div className="col-span-2 md:col-span-3 lg:col-span-1 space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#1e3a8a] flex items-center justify-center">
              <span className="text-white font-black text-sm">L</span>
            </div>
            <span className="font-black text-xl">
              Liqui<span className="text-[#ea580c]">Fi</span>
            </span>
          </div>
          <p className="text-sm text-slate-400 leading-relaxed">
            India&apos;s trusted loan marketplace and credit repair platform.
            Fix your CIBIL. Fund your dreams.
          </p>
          <div className="space-y-2 text-sm text-slate-400">
            <div className="flex items-center gap-2">
              <Phone size={13} className="text-slate-500" />
              <span>1800-123-4567 (Toll Free)</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail size={13} className="text-slate-500" />
              <span>support@liquifi.in</span>
            </div>
            <div className="flex items-start gap-2">
              <MapPin size={13} className="text-slate-500 mt-0.5 shrink-0" />
              <span>Mumbai, Maharashtra — 400001</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 pt-2">
            {[
              { icon: Shield, label: "RBI Registered" },
              { icon: Lock, label: "SSL Secured" },
            ].map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex items-center gap-1.5 bg-white/5 border border-white/10 rounded-full px-3 py-1.5 text-xs text-slate-300"
              >
                <Icon size={11} className="text-green-400" />
                {label}
              </div>
            ))}
          </div>
        </div>

        {/* Services */}
        <div>
          <h3 className="text-sm font-bold uppercase tracking-widest text-slate-300 mb-4">
            Services
          </h3>
          <ul className="space-y-2.5">
            {[
              { label: "CIBIL Fix", href: "/cibil-fix" },
              { label: "ITR Filing", href: "/itr-filing" },
              { label: "Balance Transfer", href: "/balance-transfer" },
            ].map(({ label, href }) => (
              <li key={label}>
                <a
                  href={href}
                  className="text-sm text-slate-400 hover:text-white transition-colors"
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Loan Products */}
        <div>
          <h3 className="text-sm font-bold uppercase tracking-widest text-slate-300 mb-4">
            Loan Products
          </h3>
          <ul className="space-y-2.5">
            {LOAN_LINKS.map(({ label, href }) => (
              <li key={label}>
                <a
                  href={href}
                  className="text-sm text-slate-400 hover:text-white transition-colors"
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Company */}
        <div>
          <h3 className="text-sm font-bold uppercase tracking-widest text-slate-300 mb-4">
            Company
          </h3>
          <ul className="space-y-2.5">
            {COMPANY_LINKS.map(({ label, href }) => (
              <li key={label}>
                <a
                  href={href}
                  className="text-sm text-slate-400 hover:text-white transition-colors"
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Support */}
        <div>
          <h3 className="text-sm font-bold uppercase tracking-widest text-slate-300 mb-4">
            Support
          </h3>
          <ul className="space-y-2.5">
            {SUPPORT_LINKS.map(({ label, href }) => (
              <li key={label}>
                <a
                  href={href}
                  className="text-sm text-slate-400 hover:text-white transition-colors"
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Legal */}
        <div>
          <h3 className="text-sm font-bold uppercase tracking-widest text-slate-300 mb-4">
            Legal
          </h3>
          <ul className="space-y-2.5">
            {LEGAL_LINKS.map(({ label, href }) => (
              <li key={label}>
                <a
                  href={href}
                  className="text-sm text-slate-400 hover:text-white transition-colors flex items-center gap-1"
                >
                  {label}
                  <ExternalLink size={10} className="opacity-50" />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Legal disclaimer */}
      <div className="border-t border-white/5 px-4 sm:px-6 py-8">
        <div className="max-w-7xl mx-auto space-y-4">
          <p className="text-xs text-slate-500 leading-relaxed">
            <strong className="text-slate-400">Disclaimer:</strong> LiquiFi is a
            loan marketplace and credit advisory platform. We are not a bank or
            NBFC. We facilitate connections between borrowers and registered
            lending partners. All loan approvals, interest rates, and disbursal
            are at the sole discretion of the lending institution. CIBIL scores
            displayed are indicative. Actual scores may vary. The CIBIL Fix
            program is an advisory service; results vary based on individual
            credit profiles. Past performance does not guarantee future results.
          </p>
          <p className="text-xs text-slate-500 leading-relaxed">
            <strong className="text-slate-400">Regulatory:</strong> LiquiFi
            Financial Services Pvt. Ltd. is registered with the Reserve Bank of
            India as a Non-Banking Financial Company (NBFC). Registration No:
            N-XX.XXXXX.XXXX. Our lending partners are all RBI-regulated
            entities. We comply with the Prevention of Money Laundering Act
            (PMLA) 2002 and KYC guidelines issued by RBI. This website is
            intended for residents of India only.
          </p>
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-4 border-t border-white/5">
            <p className="text-xs text-slate-500">
              © 2025 LiquiFi Financial Services Pvt. Ltd. All rights reserved.
            </p>
            <div className="flex flex-wrap gap-4">
              {LEGAL_LINKS.slice(0, 3).map(({ label, href }) => (
                <a
                  key={label}
                  href={href}
                  className="text-xs text-slate-500 hover:text-slate-300 transition-colors"
                >
                  {label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
