import { NextRequest, NextResponse } from "next/server";
import { CibilCheckSchema } from "@/lib/validations";
import { getSupabaseAdmin } from "@/lib/supabase/server";

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

// Deterministic mock score derived from PAN digits (positions 5–8)
function mockScore(pan: string): number {
  const digits = pan.slice(5, 9).split("").map(Number);
  const sum = digits.reduce((a, b) => a + b, 0); // 0–36
  return Math.round(300 + (sum / 36) * 550); // 300–850
}

type Impact = "high" | "medium" | "low";

interface Issue {
  id: string;
  label: string;
  description: string;
  impact: Impact;
}

function buildReport(pan: string) {
  const score = mockScore(pan);
  const zone = getZone(score);

  const ALL_ISSUES: (Issue & { maxScore: number })[] = [
    {
      id: "late_payments",
      label: "Late Payments on Record",
      description:
        "3 EMI payments were delayed by 30+ days in the last 12 months, heavily impacting your score.",
      impact: "high",
      maxScore: 699,
    },
    {
      id: "high_utilization",
      label: "High Credit Card Utilization",
      description:
        "Your credit utilization is at 78% — lenders prefer below 30%. This is reducing your score significantly.",
      impact: "high",
      maxScore: 719,
    },
    {
      id: "multiple_inquiries",
      label: "Multiple Hard Inquiries",
      description:
        "5 loan or card applications in the last 6 months have triggered hard pulls, lowering your score.",
      impact: "medium",
      maxScore: 739,
    },
    {
      id: "short_history",
      label: "Short Credit History",
      description:
        "Your oldest credit account is less than 2 years old. A longer history improves lender confidence.",
      impact: "medium",
      maxScore: 679,
    },
    {
      id: "credit_mix",
      label: "Limited Credit Mix",
      description:
        "You only have credit cards. Adding a secured loan (home/car) improves your credit profile.",
      impact: "low",
      maxScore: 759,
    },
  ];

  const issues = ALL_ISSUES.filter((i) => score <= i.maxScore).map(
    ({ id, label, description, impact }) => ({
      id,
      label,
      description,
      impact,
    }),
  );

  const recommendations: string[] = [];
  if (score < 700)
    recommendations.push(
      "Pay every EMI and credit card bill on time for 90 days without exception",
    );
  if (score < 720)
    recommendations.push(
      "Reduce credit card outstanding to below 30% of your total credit limit",
    );
  if (score < 740)
    recommendations.push(
      "Stop applying for new loans or cards for the next 3 months",
    );
  if (score < 680)
    recommendations.push(
      "Raise a dispute for any incorrect entries in your CIBIL report",
    );
  recommendations.push(
    "Maintain at least one secured loan (home or car) for a healthier credit mix",
  );

  const potential_score = Math.min(
    900,
    score + Math.round((900 - score) * 0.45),
  );
  const timeline_days = score >= 750 ? 30 : score >= 650 ? 60 : 90;

  return {
    score,
    zone: { label: zone.label, color: zone.color, bg: zone.bg },
    issues,
    recommendations: recommendations.slice(0, 4),
    potential_score,
    timeline_days,
  };
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);
    if (!body) {
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 },
      );
    }

    const parsed = CibilCheckSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0].message },
        { status: 422 },
      );
    }

    const { pan, phone, name } = parsed.data;
    const report = buildReport(pan);

    // Best-effort DB saves — don't block the response
    const admin = getSupabaseAdmin();
    if (admin) {
      await Promise.allSettled([
        admin.from("cibil_checks").insert({
          score: report.score,
          report_json: {
            pan_masked: pan.slice(0, 5) + "XXXXX",
            phone,
            ...report,
          },
        }),
        admin
          .from("leads")
          .upsert(
            { phone, name: name ?? null, loan_type: "cibil_fix" },
            { onConflict: "phone,loan_type" },
          ),
      ]);
    }

    return NextResponse.json({ success: true, report });
  } catch (err) {
    console.error("[cibil/check] unexpected:", err);
    return NextResponse.json(
      { error: "Failed to check CIBIL score" },
      { status: 500 },
    );
  }
}
