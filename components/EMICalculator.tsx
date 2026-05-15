"use client";

import { useState, useMemo } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { ArrowRight, IndianRupee } from "lucide-react";

function formatINR(n: number) {
  if (n >= 10_000_000) return `₹${(n / 10_000_000).toFixed(2)} Cr`;
  if (n >= 100_000) return `₹${(n / 100_000).toFixed(2)} L`;
  return `₹${Math.round(n).toLocaleString("en-IN")}`;
}

export function EMICalculator() {
  const [principal, setPrincipal] = useState(500000);
  const [rate, setRate] = useState(12);
  const [tenure, setTenure] = useState(24);

  const { emi, totalInterest, totalAmount } = useMemo(() => {
    const r = rate / 12 / 100;
    const n = tenure;
    const emi =
      r === 0
        ? principal / n
        : (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const total = emi * n;
    return {
      emi: Math.round(emi),
      totalInterest: Math.round(total - principal),
      totalAmount: Math.round(total),
    };
  }, [principal, rate, tenure]);

  const chartData = [
    { name: "Principal", value: principal, color: "#1e3a8a" },
    { name: "Total Interest", value: totalInterest, color: "#ea580c" },
  ];

  return (
    <section id="emi-calculator" className="py-20 bg-[#f8fafc]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <div className="section-tag justify-center">Smart Calculator</div>
          <h2 className="text-3xl sm:text-4xl font-black text-[#0f172a] mt-2">
            Plan Your <span className="gradient-text-blue">EMI Payments</span>
          </h2>
          <p className="text-slate-500 mt-3 max-w-xl mx-auto">
            Adjust loan amount, interest rate, and tenure to see your exact
            monthly payment and total cost.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-[#e2e8f0] shadow-sm overflow-hidden max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2">
            {/* Controls */}
            <div className="p-8 space-y-7 border-b md:border-b-0 md:border-r border-[#e2e8f0]">
              <Slider
                label="Loan Amount"
                value={principal}
                min={50000}
                max={5000000}
                step={50000}
                display={formatINR(principal)}
                onChange={setPrincipal}
              />
              <Slider
                label="Interest Rate (per annum)"
                value={rate}
                min={7}
                max={36}
                step={0.5}
                display={`${rate}%`}
                onChange={setRate}
              />
              <Slider
                label="Tenure"
                value={tenure}
                min={3}
                max={84}
                step={3}
                display={
                  tenure < 12
                    ? `${tenure} mo`
                    : `${(tenure / 12).toFixed(1)} yr`
                }
                onChange={setTenure}
              />

              {/* Result strip */}
              <div className="bg-gradient-to-r from-[#1e3a8a] to-[#2563eb] rounded-xl p-5 text-white">
                <div className="text-sm text-blue-200 mb-1">Monthly EMI</div>
                <div className="text-4xl font-black">{formatINR(emi)}</div>
                <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <div className="text-blue-200">Total Interest</div>
                    <div className="font-bold">{formatINR(totalInterest)}</div>
                  </div>
                  <div>
                    <div className="text-blue-200">Total Payable</div>
                    <div className="font-bold">{formatINR(totalAmount)}</div>
                  </div>
                </div>
              </div>

              <a
                href="#check-eligibility"
                className="btn-primary w-full justify-center"
              >
                <IndianRupee size={16} />
                Apply for This Loan <ArrowRight size={16} />
              </a>
            </div>

            {/* Chart */}
            <div className="p-8 flex flex-col items-center justify-center gap-6">
              <div className="text-center">
                <div className="text-sm font-bold text-slate-500 uppercase tracking-wide mb-1">
                  Payment Breakdown
                </div>
                <div className="text-xs text-slate-400">
                  Principal vs Interest
                </div>
              </div>

              <div className="w-full h-52">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={85}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value: number) => [formatINR(value)]}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Legend */}
              <div className="space-y-2 w-full">
                {chartData.map((item) => (
                  <div
                    key={item.name}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ background: item.color }}
                      />
                      <span className="text-sm text-slate-600">
                        {item.name}
                      </span>
                    </div>
                    <span className="text-sm font-bold text-[#0f172a]">
                      {formatINR(item.value)}
                    </span>
                  </div>
                ))}
                <div className="flex items-center justify-between pt-2 border-t border-[#e2e8f0]">
                  <span className="text-sm font-bold text-slate-700">
                    Total Cost
                  </span>
                  <span className="text-sm font-black text-[#1e3a8a]">
                    {formatINR(totalAmount)}
                  </span>
                </div>
              </div>

              {/* Interest ratio indicator */}
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                <div
                  className="h-full bg-[#ea580c] rounded-full transition-all duration-500"
                  style={{
                    width: `${((totalInterest / totalAmount) * 100).toFixed(1)}%`,
                  }}
                />
              </div>
              <p className="text-xs text-slate-500 text-center">
                Interest is{" "}
                <strong className="text-[#ea580c]">
                  {((totalInterest / totalAmount) * 100).toFixed(1)}%
                </strong>{" "}
                of total repayment
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Slider({
  label,
  value,
  min,
  max,
  step,
  display,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  display: string;
  onChange: (v: number) => void;
}) {
  const pct = ((value - min) / (max - min)) * 100;

  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <label className="text-sm font-semibold text-slate-700">{label}</label>
        <span className="text-sm font-black text-[#1e3a8a] bg-blue-50 px-3 py-1 rounded-full">
          {display}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-2 rounded-full appearance-none cursor-pointer"
        style={{
          background: `linear-gradient(to right, #1e3a8a 0%, #1e3a8a ${pct}%, #e2e8f0 ${pct}%, #e2e8f0 100%)`,
        }}
      />
      <div className="flex justify-between text-xs text-slate-400 mt-1">
        <span>{min === 50000 ? formatINR(min) : min}</span>
        <span>{min === 50000 ? formatINR(max) : max}</span>
      </div>
    </div>
  );
}
