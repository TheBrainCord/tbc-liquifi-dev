import { NextRequest, NextResponse } from "next/server";
import { ConsultationSchema } from "@/lib/validations";
import { getSupabaseAdmin } from "@/lib/supabase/server";

const TIME_LABELS: Record<string, string> = {
  asap: "ASAP",
  morning: "Morning (9AM – 1PM)",
  afternoon: "Afternoon (1PM – 5PM)",
  evening: "Evening (5PM – 8PM)",
};

async function notifyWhatsApp(details: {
  phone: string;
  name?: string | null;
  consultationType: string;
  loanType?: string | null;
  cibilScore?: number | null;
  timePreference: string;
  notes?: string | null;
}) {
  const apiKey = process.env.CALLMEBOT_WHATSAPP_API_KEY?.trim();
  const adminPhone = process.env.WHATSAPP_NOTIFY_PHONE ?? "917829816599";

  const typeLabel =
    details.consultationType === "cibil_fix"
      ? "CIBIL Fix"
      : `Loan${details.loanType ? ` – ${details.loanType}` : ""}`;

  const lines = [
    "🔔 New Consultation Request",
    `Name: ${details.name ?? "Not provided"}`,
    `Phone: +91 ${details.phone}`,
    `Type: ${typeLabel}`,
    ...(details.cibilScore ? [`CIBIL Score: ${details.cibilScore}`] : []),
    `Time: ${TIME_LABELS[details.timePreference] ?? details.timePreference}`,
    ...(details.notes ? [`Notes: ${details.notes}`] : []),
  ];

  const message = lines.join("\n");

  if (!apiKey) {
    console.log("[whatsapp/notify] (no key — log only)\n" + message);
    return;
  }

  const url = `https://api.callmebot.com/whatsapp.php?phone=${adminPhone}&text=${encodeURIComponent(message)}&apikey=${apiKey}`;
  try {
    const res = await fetch(url, { method: "GET" });
    if (!res.ok) {
      const body = await res.text().catch(() => "");
      console.error("[whatsapp/notify] failed:", res.status, body);
    }
  } catch (err) {
    console.error("[whatsapp/notify] error:", err);
  }
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

    const parsed = ConsultationSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0].message },
        { status: 422 },
      );
    }

    const {
      phone,
      name,
      consultation_type,
      loan_type,
      cibil_score,
      time_preference,
      notes,
    } = parsed.data;

    const callbackByTime = new Date(
      Date.now() + 6 * 60 * 60 * 1000,
    ).toISOString();

    // Fire-and-forget WhatsApp notification to admin
    notifyWhatsApp({
      phone,
      name,
      consultationType: consultation_type,
      loanType: loan_type,
      cibilScore: cibil_score,
      timePreference: time_preference,
      notes,
    }).catch((err) => console.error("[whatsapp/notify] unhandled:", err));

    // Persist to DB — best-effort (table may not exist; don't fail the user)
    let consultationId: string | null = null;
    const admin = getSupabaseAdmin();
    if (admin) {
      const { data, error } = await admin
        .from("expert_consultations")
        .insert({
          phone,
          name: name ?? null,
          consultation_type,
          loan_type: loan_type ?? null,
          cibil_score: cibil_score ?? null,
          time_preference,
          notes: notes ?? null,
          callback_by: callbackByTime,
        })
        .select("id")
        .single();

      if (error) {
        console.error("[consultations/schedule] db:", error.message);
      } else {
        consultationId = data.id;
      }
    } else {
      console.warn(
        "[consultations/schedule] admin client unavailable — skipping db write",
      );
    }

    return NextResponse.json({
      success: true,
      consultation_id: consultationId,
      callback_by: callbackByTime,
    });
  } catch (err) {
    console.error("[consultations/schedule] unexpected:", err);
    return NextResponse.json(
      { error: "Failed to schedule consultation" },
      { status: 500 },
    );
  }
}
