"use client";

import { useState } from "react";
import { PhoneCall, ArrowRight, CheckCircle } from "lucide-react";
import { ConsultationModal } from "@/components/ConsultationModal";

type ConsultationType = "cibil_fix" | "loan";

interface ExpertCallSectionProps {
  consultationType?: ConsultationType;
  loanType?: string;
}

export function ExpertCallSection({
  consultationType = "loan",
  loanType,
}: ExpertCallSectionProps) {
  const [phone, setPhone] = useState("");
  const [showModal, setShowModal] = useState(false);

  const valid = phone.length === 10;

  return (
    <>
      <section className="bg-gradient-to-r from-[#0f2460] via-[#1e3a8a] to-[#1d4ed8] py-16">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm font-semibold text-white backdrop-blur-sm">
            <PhoneCall size={14} />
            Free Expert Consultation
          </div>

          <h2 className="text-3xl font-black text-white sm:text-4xl">
            Not sure where to start?
            <br />
            <span className="text-[#fb923c]">Talk to our experts — free.</span>
          </h2>

          <p className="mx-auto mt-4 max-w-xl text-base text-blue-100">
            Whether it&apos;s a loan, credit repair, or CIBIL fix — our experts
            will guide you in a free 15-minute call. No commitment required.
          </p>

          <div className="mt-4 flex flex-wrap justify-center gap-4">
            {[
              "Loan eligibility check",
              "CIBIL score analysis",
              "Credit repair roadmap",
            ].map((item) => (
              <span
                key={item}
                className="flex items-center gap-1.5 text-sm text-blue-100"
              >
                <CheckCircle size={14} className="text-green-400" />
                {item}
              </span>
            ))}
          </div>

          <div className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row">
            <div className="flex flex-1">
              <span className="flex items-center rounded-l-xl border border-r-0 border-white/20 bg-white/10 px-3 text-sm font-semibold text-white backdrop-blur-sm">
                +91
              </span>
              <input
                type="tel"
                maxLength={10}
                placeholder="Enter mobile number"
                className="flex-1 rounded-r-xl border border-white/20 bg-white/10 px-4 py-3 text-sm font-semibold text-white placeholder-blue-300 backdrop-blur-sm outline-none focus:border-white/50 focus:bg-white/15"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                onKeyDown={(e) =>
                  e.key === "Enter" && valid && setShowModal(true)
                }
              />
            </div>
            <button
              onClick={() => setShowModal(true)}
              disabled={!valid}
              className="flex items-center justify-center gap-2 rounded-xl bg-[#fb923c] px-6 py-3 text-sm font-black text-white transition-all hover:bg-[#f97316] disabled:cursor-not-allowed disabled:opacity-50"
            >
              Book Free Call <ArrowRight size={16} />
            </button>
          </div>

          <p className="mt-3 text-xs text-blue-300">
            Our expert will connect with you shortly · 100% free · No spam
          </p>
        </div>
      </section>

      {showModal && (
        <ConsultationModal
          phone={phone}
          consultationType={consultationType}
          loanType={loanType}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
}
