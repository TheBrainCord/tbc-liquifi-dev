"use client";

import { useState, useEffect } from "react";
import { Phone, Shield, Menu, X, ChevronDown } from "lucide-react";

const NAV_LINKS = [
  {
    label: "Loans",
    children: [
      { label: "Personal Loan", href: "#personal-loan" },
      { label: "Home Loan", href: "#home-loan" },
      { label: "Business Loan", href: "#business-loan" },
      { label: "Car Loan", href: "#car-loan" },
      { label: "Balance Transfer", href: "/balance-transfer" },
    ],
  },
  { label: "CIBIL Fix", href: "#cibil-fix" },
  { label: "EMI Calculator", href: "#emi-calculator" },
  { label: "How It Works", href: "#how-it-works" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white shadow-md border-b border-[#e2e8f0]"
          : "bg-white/95 backdrop-blur-sm"
      }`}
    >
      {/* Trust bar */}
      <div className="bg-[#1e3a8a] text-white text-xs py-1.5 px-4 flex items-center justify-between">
        <span className="flex items-center gap-1.5">
          <Shield size={11} className="text-green-300" />
          RBI Registered NBFC Partner &nbsp;|&nbsp; 256-bit SSL Secured
        </span>
        <a
          href="tel:18001234567"
          className="flex items-center gap-1.5 font-semibold hover:text-orange-300 transition-colors"
        >
          <Phone size={11} />
          Toll Free: 1800-123-4567
        </a>
      </div>

      <nav className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
        {/* Logo */}
        <a href="/" className="flex items-center gap-2 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-[#1e3a8a] flex items-center justify-center">
            <span className="text-white font-black text-sm">L</span>
          </div>
          <span className="font-black text-xl text-[#1e3a8a]">
            Liqui<span className="text-[#ea580c]">Fi</span>
          </span>
        </a>

        {/* Desktop nav */}
        <ul className="hidden lg:flex items-center gap-1">
          {NAV_LINKS.map((link) =>
            link.children ? (
              <li
                key={link.label}
                className="relative"
                onMouseEnter={() => setOpenDropdown(link.label)}
                onMouseLeave={() => setOpenDropdown(null)}
              >
                <button className="flex items-center gap-1 px-4 py-2 text-sm font-semibold text-slate-700 hover:text-[#1e3a8a] rounded-lg hover:bg-blue-50 transition-colors">
                  {link.label}
                  <ChevronDown
                    size={14}
                    className={`transition-transform ${openDropdown === link.label ? "rotate-180" : ""}`}
                  />
                </button>
                {openDropdown === link.label && (
                  <div className="absolute top-full left-0 mt-1 w-52 bg-white rounded-xl shadow-xl border border-[#e2e8f0] py-2 z-50">
                    {link.children.map((child) => (
                      <a
                        key={child.label}
                        href={child.href}
                        className="block px-4 py-2.5 text-sm text-slate-600 hover:text-[#1e3a8a] hover:bg-blue-50 transition-colors"
                      >
                        {child.label}
                      </a>
                    ))}
                  </div>
                )}
              </li>
            ) : (
              <li key={link.label}>
                <a
                  href={link.href}
                  className="block px-4 py-2 text-sm font-semibold text-slate-700 hover:text-[#1e3a8a] rounded-lg hover:bg-blue-50 transition-colors"
                >
                  {link.label}
                </a>
              </li>
            ),
          )}
        </ul>

        {/* CTA + mobile toggle */}
        <div className="flex items-center gap-3">
          <a
            href="tel:18001234567"
            className="hidden md:flex items-center gap-2 px-4 py-2 border-2 border-[#1e3a8a] text-[#1e3a8a] rounded-full text-sm font-semibold hover:bg-[#1e3a8a] hover:text-white transition-all"
          >
            <Phone size={14} />
            Call Support
          </a>
          <a
            href="#check-eligibility"
            className="btn-primary !py-2.5 !px-5 !text-sm"
          >
            Check Eligibility
          </a>
          <button
            className="lg:hidden p-2 text-slate-600 hover:text-[#1e3a8a]"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-white border-t border-[#e2e8f0] px-4 py-4 space-y-1 shadow-lg">
          {NAV_LINKS.map((link) =>
            link.children ? (
              <div key={link.label}>
                <div className="px-3 py-2 text-xs font-bold uppercase tracking-widest text-slate-400">
                  {link.label}
                </div>
                {link.children.map((child) => (
                  <a
                    key={child.label}
                    href={child.href}
                    className="block px-6 py-2 text-sm text-slate-600 hover:text-[#1e3a8a]"
                    onClick={() => setMobileOpen(false)}
                  >
                    {child.label}
                  </a>
                ))}
              </div>
            ) : (
              <a
                key={link.label}
                href={link.href}
                className="block px-3 py-2.5 text-sm font-semibold text-slate-700 hover:text-[#1e3a8a] rounded-lg hover:bg-blue-50"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </a>
            ),
          )}
          <div className="pt-3 border-t border-[#e2e8f0]">
            <a
              href="tel:18001234567"
              className="flex items-center gap-2 px-3 py-2 text-sm font-semibold text-[#1e3a8a]"
            >
              <Phone size={14} />
              1800-123-4567
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
