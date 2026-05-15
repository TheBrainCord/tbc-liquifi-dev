"use client";

import { Star, Quote } from "lucide-react";

const STORIES = [
  {
    name: "Rajesh Kumar",
    city: "Mumbai",
    loanType: "Personal Loan",
    amount: "₹8 Lakh",
    score: "CIBIL 720",
    rating: 5,
    quote:
      "Applied at 10 PM, got approval by 8 AM next morning. The rate was better than what my own bank offered. LiquiFi's lender comparison saved me ₹40,000 in interest.",
    initials: "RK",
    color: "#1e3a8a",
  },
  {
    name: "Priya Sharma",
    city: "Bangalore",
    loanType: "CIBIL Fix",
    amount: "+145 Points",
    score: "CIBIL 580 → 725",
    rating: 5,
    quote:
      "I was rejected by 3 banks before LiquiFi. Their CIBIL Fix team removed 2 errors from my report and helped settle an old credit card default. In 3 months my score jumped from 580 to 725.",
    initials: "PS",
    color: "#ea580c",
    highlight: true,
  },
  {
    name: "Amit Patel",
    city: "Ahmedabad",
    loanType: "Business Loan",
    amount: "₹35 Lakh",
    score: "Disbursed in 3 days",
    rating: 5,
    quote:
      "Running a textile business needs fast capital. Traditional banks took 45 days just for processing. LiquiFi connected me with an NBFC that disbursed ₹35L in 72 hours.",
    initials: "AP",
    color: "#16a34a",
  },
  {
    name: "Sunita Reddy",
    city: "Hyderabad",
    loanType: "Home Loan",
    amount: "₹55 Lakh",
    score: "Rate: 8.6% p.a.",
    rating: 5,
    quote:
      "The transparent comparison helped me choose the right lender. No hidden fees, no surprises at signing. The door-step document pickup was the cherry on top.",
    initials: "SR",
    color: "#7c3aed",
  },
];

export function Testimonials() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-14">
          <div className="section-tag justify-center">Success Stories</div>
          <h2 className="text-3xl sm:text-4xl font-black text-[#0f172a] mt-2">
            Real People.{" "}
            <span className="gradient-text-blue">Real Results.</span>
          </h2>
          <p className="text-slate-500 mt-3 max-w-xl mx-auto">
            Over 2.4 million Indians have used LiquiFi to get loans faster or
            repair their credit scores.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {STORIES.map((story) => (
            <div
              key={story.name}
              className={`relative rounded-2xl p-6 border transition-all hover:-translate-y-1 hover:shadow-lg ${
                story.highlight
                  ? "bg-gradient-to-b from-[#0f2460] to-[#1e3a8a] text-white border-[#1e3a8a]"
                  : "bg-white border-[#e2e8f0]"
              }`}
            >
              <Quote
                size={24}
                className={`mb-3 ${story.highlight ? "text-blue-300" : "text-slate-200"}`}
              />

              <p
                className={`text-sm leading-relaxed mb-5 ${
                  story.highlight ? "text-blue-100" : "text-slate-600"
                }`}
              >
                &ldquo;{story.quote}&rdquo;
              </p>

              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-black shrink-0"
                  style={{
                    background: story.highlight ? "#ea580c" : story.color,
                  }}
                >
                  {story.initials}
                </div>
                <div>
                  <div
                    className={`font-bold text-sm ${story.highlight ? "text-white" : "text-[#0f172a]"}`}
                  >
                    {story.name}
                  </div>
                  <div
                    className={`text-xs ${story.highlight ? "text-blue-300" : "text-slate-400"}`}
                  >
                    {story.city}
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-white/10">
                <div>
                  <div
                    className={`text-xs font-semibold ${story.highlight ? "text-blue-300" : "text-slate-400"}`}
                  >
                    {story.loanType}
                  </div>
                  <div
                    className={`text-sm font-black ${story.highlight ? "text-[#fb923c]" : "text-[#0f172a]"}`}
                  >
                    {story.amount}
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex gap-0.5 justify-end mb-0.5">
                    {Array.from({ length: story.rating }).map((_, i) => (
                      <Star
                        key={i}
                        size={11}
                        fill="#f59e0b"
                        className="text-amber-400"
                      />
                    ))}
                  </div>
                  <div
                    className={`text-xs ${story.highlight ? "text-blue-200" : "text-slate-400"}`}
                  >
                    {story.score}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Rating summary */}
        <div className="mt-12 bg-[#f8fafc] rounded-2xl border border-[#e2e8f0] p-6 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="text-center sm:text-left">
            <div className="text-4xl font-black text-[#0f172a]">4.8</div>
            <div className="flex gap-1 my-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  size={16}
                  fill={i < 5 ? "#f59e0b" : "#e2e8f0"}
                  className={i < 5 ? "text-amber-400" : "text-slate-200"}
                />
              ))}
            </div>
            <div className="text-sm text-slate-500">
              Based on 1,20,000+ reviews
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
            {[
              { platform: "Google Play", score: "4.8" },
              { platform: "App Store", score: "4.7" },
              { platform: "Trustpilot", score: "4.9" },
              { platform: "Facebook", score: "4.8" },
            ].map(({ platform, score }) => (
              <div key={platform}>
                <div className="text-xl font-black text-[#1e3a8a]">{score}</div>
                <div className="text-xs text-slate-500">{platform}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
