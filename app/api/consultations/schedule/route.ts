import { NextRequest, NextResponse } from "next/server";
import { ConsultationSchema } from "@/lib/validations";
import { getSupabaseAdmin } from "@/lib/supabase/server";

const TIME_LABELS: Record<string, string> = {
  asap: "ASAP",
  morning: "Morning (9AM – 1PM)",
  afternoon: "Afternoon (1PM – 5PM)",
  evening: "Evening (5PM – 8PM)",
};

type NotifyDetails = {
  phone: string;
  name?: string | null;
  consultationType: string;
  loanType?: string | null;
  cibilScore?: number | null;
  timePreference: string;
  notes?: string | null;
};

function buildMessage(details: NotifyDetails): string {
  const typeLabel =
    details.consultationType === "cibil_fix"
      ? "CIBIL Fix"
      : `Loan${details.loanType ? ` – ${details.loanType}` : ""}`;

  return [
    "🔔 New Consultation Request — LiquiFi",
    `Name: ${details.name ?? "Not provided"}`,
    `Phone: +91 ${details.phone}`,
    `Type: ${typeLabel}`,
    ...(details.cibilScore ? [`CIBIL Score: ${details.cibilScore}`] : []),
    `Time: ${TIME_LABELS[details.timePreference] ?? details.timePreference}`,
    ...(details.notes ? [`Notes: ${details.notes}`] : []),
    `Respond within 6 hours.`,
  ].join("\n");
}

async function notifyWhatsApp(details: NotifyDetails) {
  const apiKey = process.env.CALLMEBOT_WHATSAPP_API_KEY?.trim();
  const adminPhone = process.env.WHATSAPP_NOTIFY_PHONE ?? "917829816599";
  const message = buildMessage(details);

  if (!apiKey) {
    console.log("[whatsapp/notify] no key — skipping\n" + message);
    return;
  }

  const url = `https://api.callmebot.com/whatsapp.php?phone=${adminPhone}&text=${encodeURIComponent(message)}&apikey=${apiKey}`;
  try {
    const res = await fetch(url, { method: "GET" });
    if (!res.ok) {
      console.error(
        "[whatsapp/notify] failed:",
        res.status,
        await res.text().catch(() => ""),
      );
    } else {
      console.log("[whatsapp/notify] sent ✓");
    }
  } catch (err) {
    console.error("[whatsapp/notify] error:", err);
  }
}

async function notifyEmail(details: NotifyDetails) {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!apiKey) return;

  const adminEmail =
    process.env.ADMIN_NOTIFY_EMAIL ?? "thebraincordservices@gmail.com";

  const typeLabel =
    details.consultationType === "cibil_fix"
      ? "CIBIL Fix"
      : `Loan${details.loanType ? ` – ${details.loanType}` : ""}`;

  const subject = `🔔 New ${typeLabel} Consultation — +91 ${details.phone}`;

  const html = `
<div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:24px;background:#f8fafc;border-radius:12px">
  <div style="background:#1e3a8a;border-radius:8px;padding:16px 20px;margin-bottom:20px">
    <h2 style="color:#fff;margin:0;font-size:18px">🔔 New Consultation Request</h2>
    <p style="color:#bfdbfe;margin:4px 0 0;font-size:13px">LiquiFi · Expert Call Booked</p>
  </div>
  <table style="width:100%;border-collapse:collapse;background:#fff;border-radius:8px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.08)">
    <tr style="background:#f1f5f9"><td style="padding:10px 14px;font-size:12px;color:#64748b;font-weight:600;width:36%">NAME</td><td style="padding:10px 14px;font-size:14px;color:#0f172a;font-weight:700">${details.name ?? "Not provided"}</td></tr>
    <tr><td style="padding:10px 14px;font-size:12px;color:#64748b;font-weight:600">PHONE</td><td style="padding:10px 14px;font-size:14px;color:#0f172a;font-weight:700">+91 ${details.phone}</td></tr>
    <tr style="background:#f1f5f9"><td style="padding:10px 14px;font-size:12px;color:#64748b;font-weight:600">TYPE</td><td style="padding:10px 14px;font-size:14px;color:#0f172a;font-weight:700">${typeLabel}</td></tr>
    ${details.cibilScore ? `<tr><td style="padding:10px 14px;font-size:12px;color:#64748b;font-weight:600">CIBIL SCORE</td><td style="padding:10px 14px;font-size:14px;color:#0f172a;font-weight:700">${details.cibilScore}</td></tr>` : ""}
    <tr${details.cibilScore ? ' style="background:#f1f5f9"' : ""}><td style="padding:10px 14px;font-size:12px;color:#64748b;font-weight:600">CALL TIME</td><td style="padding:10px 14px;font-size:14px;color:#0f172a;font-weight:700">${TIME_LABELS[details.timePreference] ?? details.timePreference}</td></tr>
    ${details.notes ? `<tr style="background:#f1f5f9"><td style="padding:10px 14px;font-size:12px;color:#64748b;font-weight:600">NOTES</td><td style="padding:10px 14px;font-size:14px;color:#0f172a">${details.notes}</td></tr>` : ""}
  </table>
  <p style="margin:16px 0 0;font-size:12px;color:#94a3b8;text-align:center">Respond within 6 hours · LiquiFi.cash</p>
</div>`;

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "LiquiFi Alerts <onboarding@resend.dev>",
        to: adminEmail,
        subject,
        html,
      }),
    });
    if (!res.ok) {
      console.error(
        "[email/notify] failed:",
        res.status,
        await res.json().catch(() => ({})),
      );
    } else {
      console.log("[email/notify] sent ✓ →", adminEmail);
    }
  } catch (err) {
    console.error("[email/notify] error:", err);
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

    const notifyDetails: NotifyDetails = {
      phone,
      name,
      consultationType: consultation_type,
      loanType: loan_type,
      cibilScore: cibil_score,
      timePreference: time_preference,
      notes,
    };

    // Fire-and-forget — both run in parallel, neither blocks the response
    Promise.all([
      notifyWhatsApp(notifyDetails),
      notifyEmail(notifyDetails),
    ]).catch((err) => console.error("[notify] unhandled:", err));

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
