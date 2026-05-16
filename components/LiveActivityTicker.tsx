"use client";

import { useEffect, useState } from "react";

const ACTIVITIES = [
  {
    name: "Priya S.",
    city: "Mumbai",
    action: "got ₹5L Personal Loan approved",
    emoji: "🎉",
  },
  {
    name: "Arjun M.",
    city: "Delhi",
    action: "CIBIL score improved by 83 points",
    emoji: "📈",
  },
  {
    name: "Kiran R.",
    city: "Bengaluru",
    action: "received 9 loan offers from lenders",
    emoji: "🏦",
  },
  {
    name: "Deepa V.",
    city: "Chennai",
    action: "got ₹30L Home Loan at 8.6%",
    emoji: "🏠",
  },
  {
    name: "Rohit K.",
    city: "Hyderabad",
    action: "Business Loan of ₹25L sanctioned",
    emoji: "💼",
  },
  {
    name: "Ananya B.",
    city: "Pune",
    action: "Car Loan approved in 4 hours",
    emoji: "🚗",
  },
  {
    name: "Vijay P.",
    city: "Ahmedabad",
    action: "CIBIL fixed from 580 to 720",
    emoji: "⭐",
  },
  {
    name: "Meena T.",
    city: "Kolkata",
    action: "saved ₹18,000/yr on loan interest",
    emoji: "💰",
  },
];

export function LiveActivityTicker() {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setIndex((i) => (i + 1) % ACTIVITIES.length);
        setVisible(true);
      }, 400);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const item = ACTIVITIES[index];

  return (
    <div className="bg-[#0f172a] border-b border-white/5 py-2.5 px-4">
      <div className="max-w-7xl mx-auto flex items-center gap-3">
        <div className="flex items-center gap-1.5 shrink-0">
          <span className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
          <span className="text-xs font-bold text-green-400 uppercase tracking-wider">
            Live
          </span>
        </div>
        <div
          className="text-xs text-slate-300 transition-opacity duration-300"
          style={{ opacity: visible ? 1 : 0 }}
        >
          <span className="mr-1">{item.emoji}</span>
          <span className="font-semibold text-white">
            {item.name}
          </span> from <span className="text-slate-400">{item.city}</span>
          {" — "}
          {item.action}
        </div>
        <div className="ml-auto shrink-0 hidden sm:flex items-center gap-1.5 text-xs text-slate-500">
          <span className="h-1.5 w-1.5 rounded-full bg-slate-500" />
          <span>1,247 applications today</span>
        </div>
      </div>
    </div>
  );
}
