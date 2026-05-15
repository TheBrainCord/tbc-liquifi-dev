"use client";

const PARTNERS = [
  { name: "HDFC Bank", abbr: "HDFC" },
  { name: "ICICI Bank", abbr: "ICICI" },
  { name: "SBI", abbr: "SBI" },
  { name: "Axis Bank", abbr: "AXIS" },
  { name: "Kotak Mahindra", abbr: "KOTAK" },
  { name: "Bajaj Finance", abbr: "BAJAJ" },
  { name: "Tata Capital", abbr: "TATA" },
  { name: "L&T Finance", abbr: "L&T" },
  { name: "Piramal Capital", abbr: "PIRAMAL" },
  { name: "Aditya Birla Finance", abbr: "ABFL" },
  { name: "HDB Financial", abbr: "HDB" },
  { name: "Fullerton India", abbr: "FULLERTON" },
];

export function TrustMarquee() {
  return (
    <section className="bg-white border-y border-[#e2e8f0] py-8">
      <div className="max-w-7xl mx-auto px-4 mb-5 text-center">
        <p className="text-xs font-bold uppercase tracking-[3px] text-slate-400">
          Trusted by 50+ Leading Lenders
        </p>
      </div>

      <div className="overflow-hidden relative">
        {/* Fade edges */}
        <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

        <div className="flex marquee-track">
          {/* Duplicated for seamless loop */}
          {[...PARTNERS, ...PARTNERS].map((partner, idx) => (
            <div
              key={`${partner.abbr}-${idx}`}
              className="flex items-center justify-center mx-6 shrink-0"
            >
              <div className="flex items-center gap-2 px-5 py-3 rounded-xl border border-[#e2e8f0] bg-slate-50 hover:bg-white hover:border-[#1e3a8a] hover:shadow-sm transition-all cursor-default">
                <div className="w-8 h-8 rounded-lg bg-[#1e3a8a]/10 flex items-center justify-center">
                  <span className="text-xs font-black text-[#1e3a8a]">
                    {partner.abbr.charAt(0)}
                  </span>
                </div>
                <span className="text-sm font-bold text-slate-600 whitespace-nowrap">
                  {partner.name}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Stats strip */}
      <div className="max-w-5xl mx-auto px-4 mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { value: "50+", label: "Lending Partners" },
          { value: "72 hrs", label: "Avg. Disbursal Time" },
          { value: "8.5%", label: "Lowest Interest Rate" },
          { value: "₹50 Lakh", label: "Max Loan Amount" },
        ].map(({ value, label }) => (
          <div key={label} className="text-center">
            <div className="text-2xl font-black text-[#1e3a8a]">{value}</div>
            <div className="text-xs text-slate-500 mt-0.5">{label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
