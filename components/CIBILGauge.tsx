"use client";

import { useState } from "react";
import { TrendingUp, AlertTriangle, CheckCircle, Info } from "lucide-react";

const SCORE_ZONES = [
  { min: 300, max: 549, label: "Poor", color: "#ef4444", bg: "#fef2f2" },
  { min: 550, max: 649, label: "Fair", color: "#f97316", bg: "#fff7ed" },
  { min: 650, max: 699, label: "Good", color: "#eab308", bg: "#fefce8" },
  { min: 700, max: 749, label: "Very Good", color: "#22c55e", bg: "#f0fdf4" },
  { min: 750, max: 900, label: "Excellent", color: "#16a34a", bg: "#dcfce7" },
];

function getZone(score: number) {
  return (
    SCORE_ZONES.find((z) => score >= z.min && score <= z.max) ?? SCORE_ZONES[0]
  );
}

function scoreToAngle(score: number) {
  const normalized = (score - 300) / (900 - 300);
  return -135 + normalized * 270;
}

function ArcGauge({ score }: { score: number }) {
  const zone = getZone(score);
  const angle = scoreToAngle(score);
  const cx = 100;
  const cy = 100;
  const r = 75;

  const startAngle = -225;
  const totalAngle = 270;
  const normalized = (score - 300) / 600;
  const fillAngle = startAngle + normalized * totalAngle;

  function polarToCartesian(deg: number) {
    const rad = (deg * Math.PI) / 180;
    return {
      x: cx + r * Math.cos(rad),
      y: cy + r * Math.sin(rad),
    };
  }

  function describeArc(startDeg: number, endDeg: number) {
    const s = polarToCartesian(startDeg);
    const e = polarToCartesian(endDeg);
    const large = endDeg - startDeg > 180 ? 1 : 0;
    return `M ${s.x} ${s.y} A ${r} ${r} 0 ${large} 1 ${e.x} ${e.y}`;
  }

  const needleRad = (angle * Math.PI) / 180;
  const needleTip = {
    x: cx + 60 * Math.cos(needleRad),
    y: cy + 60 * Math.sin(needleRad),
  };

  return (
    <svg viewBox="0 0 200 150" className="w-full max-w-xs mx-auto">
      {/* Track */}
      <path
        d={describeArc(-225, 45)}
        fill="none"
        stroke="#e2e8f0"
        strokeWidth="14"
        strokeLinecap="round"
      />

      {/* Zone segments */}
      {SCORE_ZONES.map((zone, i) => {
        const segStart = -225 + (i / SCORE_ZONES.length) * 270;
        const segEnd = -225 + ((i + 1) / SCORE_ZONES.length) * 270;
        return (
          <path
            key={zone.label}
            d={describeArc(segStart, segEnd - 2)}
            fill="none"
            stroke={zone.color}
            strokeWidth="14"
            strokeLinecap="round"
            opacity="0.25"
          />
        );
      })}

      {/* Fill arc */}
      {score > 300 && (
        <path
          d={describeArc(-225, Math.min(fillAngle, 44))}
          fill="none"
          stroke={zone.color}
          strokeWidth="14"
          strokeLinecap="round"
          style={{
            transition: "all 1s cubic-bezier(0.34,1.56,0.64,1)",
          }}
        />
      )}

      {/* Needle */}
      <line
        x1={cx}
        y1={cy}
        x2={needleTip.x}
        y2={needleTip.y}
        stroke="#1e3a8a"
        strokeWidth="2.5"
        strokeLinecap="round"
        style={{ transition: "all 1s cubic-bezier(0.34,1.56,0.64,1)" }}
      />
      <circle cx={cx} cy={cy} r="6" fill="#1e3a8a" />
      <circle cx={cx} cy={cy} r="3" fill="white" />

      {/* Score labels */}
      <text x="28" y="130" fontSize="9" fill="#94a3b8" textAnchor="middle">
        300
      </text>
      <text x="172" y="130" fontSize="9" fill="#94a3b8" textAnchor="middle">
        900
      </text>
    </svg>
  );
}

export function CIBILGauge() {
  const [score, setScore] = useState(680);
  const zone = getZone(score);

  return (
    <section id="cibil-fix" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <div className="section-tag justify-center">CIBIL Score Checker</div>
          <h2 className="text-3xl sm:text-4xl font-black text-[#0f172a] mt-2">
            Where Does Your Score{" "}
            <span className="gradient-text-orange">Stand?</span>
          </h2>
          <p className="text-slate-500 mt-3 max-w-xl mx-auto">
            Move the slider to see what your CIBIL score means for your loan
            eligibility and which lenders will approve you.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
          {/* Gauge + slider */}
          <div className="bg-gradient-to-b from-slate-50 to-white rounded-2xl border border-[#e2e8f0] p-8 text-center">
            <ArcGauge score={score} />

            {/* Score display */}
            <div className="mt-2 mb-6">
              <div
                className="text-5xl font-black transition-colors duration-500"
                style={{ color: zone.color }}
              >
                {score}
              </div>
              <div
                className="text-sm font-bold mt-1 px-3 py-1 rounded-full inline-block"
                style={{ color: zone.color, background: zone.bg }}
              >
                {zone.label}
              </div>
            </div>

            {/* Slider */}
            <div className="px-2">
              <input
                type="range"
                min={300}
                max={900}
                value={score}
                onChange={(e) => setScore(Number(e.target.value))}
                className="w-full h-2 rounded-full appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, ${zone.color} 0%, ${zone.color} ${((score - 300) / 600) * 100}%, #e2e8f0 ${((score - 300) / 600) * 100}%, #e2e8f0 100%)`,
                }}
              />
              <div className="flex justify-between text-xs text-slate-400 mt-1.5">
                <span>300</span>
                <span>900</span>
              </div>
            </div>
          </div>

          {/* Info panel */}
          <div className="space-y-5">
            <div
              className="rounded-2xl p-5 border"
              style={{ background: zone.bg, borderColor: zone.color + "33" }}
            >
              <div className="flex items-start gap-3">
                {score >= 700 ? (
                  <CheckCircle
                    size={20}
                    style={{ color: zone.color }}
                    className="shrink-0 mt-0.5"
                  />
                ) : (
                  <AlertTriangle
                    size={20}
                    style={{ color: zone.color }}
                    className="shrink-0 mt-0.5"
                  />
                )}
                <div>
                  <div
                    className="font-bold text-sm"
                    style={{ color: zone.color }}
                  >
                    {zone.label} Score — What This Means
                  </div>
                  <p className="text-sm text-slate-600 mt-1">
                    {score >= 750
                      ? "Excellent! You qualify for the best interest rates. Multiple lenders will compete for your business."
                      : score >= 700
                        ? "Great score. Most banks will approve you. You can negotiate for lower rates."
                        : score >= 650
                          ? "Average score. Some lenders will approve but at higher rates. Consider CIBIL Fix."
                          : score >= 550
                            ? "Below average. Most banks will reject. Our CIBIL Fix program can help in 90 days."
                            : "Critical. Loan rejection is likely. Enroll in CIBIL Fix immediately."}
                  </p>
                </div>
              </div>
            </div>

            {/* Lender eligibility */}
            <div className="space-y-3">
              <h3 className="font-bold text-[#0f172a] text-sm uppercase tracking-wide">
                Lender Eligibility at Score {score}
              </h3>
              {[
                { name: "PSU Banks (SBI, PNB)", minScore: 700, rate: "10.5%" },
                {
                  name: "Private Banks (HDFC, ICICI)",
                  minScore: 680,
                  rate: "11%",
                },
                { name: "NBFCs (Bajaj, Tata)", minScore: 620, rate: "14%" },
                { name: "Fintech Lenders", minScore: 550, rate: "18%" },
              ].map((lender) => {
                const eligible = score >= lender.minScore;
                return (
                  <div
                    key={lender.name}
                    className={`flex items-center justify-between p-3 rounded-xl border text-sm ${
                      eligible
                        ? "bg-green-50 border-green-200"
                        : "bg-slate-50 border-slate-200 opacity-60"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {eligible ? (
                        <CheckCircle size={14} className="text-green-600" />
                      ) : (
                        <AlertTriangle size={14} className="text-slate-400" />
                      )}
                      <span
                        className={
                          eligible
                            ? "font-semibold text-[#0f172a]"
                            : "text-slate-400"
                        }
                      >
                        {lender.name}
                      </span>
                    </div>
                    <span
                      className={`font-bold text-xs ${eligible ? "text-green-700" : "text-slate-400"}`}
                    >
                      {eligible
                        ? `From ${lender.rate}`
                        : `Min ${lender.minScore}`}
                    </span>
                  </div>
                );
              })}
            </div>

            {score < 700 && (
              <div className="bg-[#1e3a8a] text-white rounded-xl p-4 flex items-start gap-3">
                <Info size={16} className="text-blue-300 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-sm">
                    Improve by{" "}
                    <span className="text-orange-300">
                      +{700 - score} points
                    </span>{" "}
                    to unlock prime rates
                  </div>
                  <a
                    href="#cibil-fix-program"
                    className="text-xs text-blue-300 underline mt-1 inline-block"
                  >
                    Start CIBIL Fix Program →
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
