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
  email?: string | null;
  consultationType: string;
  loanType?: string | null;
  cibilScore?: number | null;
  timePreference: string;
  notes?: string | null;
  callbackBy: string;
};

function typeLabel(consultationType: string, loanType?: string | null) {
  return consultationType === "cibil_fix"
    ? "CIBIL Fix"
    : `Loan${loanType ? ` – ${loanType}` : ""}`;
}

async function sendEmail(to: string, subject: string, html: string) {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!apiKey) {
    console.log("[email/notify] no RESEND_API_KEY — skipping");
    return;
  }
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "LiquiFi <onboarding@resend.dev>",
        to,
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
      console.log("[email/notify] sent ✓ →", to);
    }
  } catch (err) {
    console.error("[email/notify] error:", err);
  }
}

async function notifyAdmin(details: NotifyDetails) {
  const adminEmail =
    process.env.ADMIN_NOTIFY_EMAIL ?? "thebraincordservices@gmail.com";
  const label = typeLabel(details.consultationType, details.loanType);
  const subject = `🔔 New ${label} Consultation — +91 ${details.phone}`;

  const html = `
<div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:24px;background:#f8fafc;border-radius:12px">
  <div style="background:#1e3a8a;border-radius:8px;padding:16px 20px;margin-bottom:20px">
    <h2 style="color:#fff;margin:0;font-size:18px">🔔 New Consultation Request</h2>
    <p style="color:#bfdbfe;margin:4px 0 0;font-size:13px">LiquiFi · Expert Call Booked</p>
  </div>
  <table style="width:100%;border-collapse:collapse;background:#fff;border-radius:8px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.08)">
    <tr style="background:#f1f5f9"><td style="padding:10px 14px;font-size:12px;color:#64748b;font-weight:600;width:36%">NAME</td><td style="padding:10px 14px;font-size:14px;color:#0f172a;font-weight:700">${details.name ?? "Not provided"}</td></tr>
    <tr><td style="padding:10px 14px;font-size:12px;color:#64748b;font-weight:600">PHONE</td><td style="padding:10px 14px;font-size:14px;color:#0f172a;font-weight:700">+91 ${details.phone}</td></tr>
    ${details.email ? `<tr style="background:#f1f5f9"><td style="padding:10px 14px;font-size:12px;color:#64748b;font-weight:600">EMAIL</td><td style="padding:10px 14px;font-size:14px;color:#0f172a;font-weight:700">${details.email}</td></tr>` : ""}
    <tr${details.email ? "" : ' style="background:#f1f5f9"'}><td style="padding:10px 14px;font-size:12px;color:#64748b;font-weight:600">TYPE</td><td style="padding:10px 14px;font-size:14px;color:#0f172a;font-weight:700">${label}</td></tr>
    ${details.cibilScore ? `<tr style="background:#f1f5f9"><td style="padding:10px 14px;font-size:12px;color:#64748b;font-weight:600">CIBIL SCORE</td><td style="padding:10px 14px;font-size:14px;color:#0f172a;font-weight:700">${details.cibilScore}</td></tr>` : ""}
    <tr style="background:#f1f5f9"><td style="padding:10px 14px;font-size:12px;color:#64748b;font-weight:600">CALL TIME</td><td style="padding:10px 14px;font-size:14px;color:#0f172a;font-weight:700">${TIME_LABELS[details.timePreference] ?? details.timePreference}</td></tr>
    ${details.notes ? `<tr><td style="padding:10px 14px;font-size:12px;color:#64748b;font-weight:600">NOTES</td><td style="padding:10px 14px;font-size:14px;color:#0f172a">${details.notes}</td></tr>` : ""}
  </table>
  <p style="margin:16px 0 0;font-size:12px;color:#94a3b8;text-align:center">Respond within 6 hours · LiquiFi.cash</p>
</div>`;

  await sendEmail(adminEmail, subject, html);
}

async function notifyUser(details: NotifyDetails) {
  if (!details.email) return;

  const label = typeLabel(details.consultationType, details.loanType);
  const callbackTime = new Date(details.callbackBy).toLocaleTimeString(
    "en-IN",
    {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
      timeZone: "Asia/Kolkata",
    },
  );

  const subject = `Your LiquiFi Expert Call is Confirmed ✓`;

  const html = `
<div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:24px;background:#f8fafc;border-radius:12px">
  <div style="background:#1e3a8a;border-radius:8px;padding:20px;margin-bottom:20px;text-align:center">
    <div style="font-size:32px;margin-bottom:8px">✅</div>
    <h2 style="color:#fff;margin:0;font-size:20px">You're all set!</h2>
    <p style="color:#bfdbfe;margin:6px 0 0;font-size:13px">Your free expert consultation is booked</p>
  </div>

  <div style="background:#fff;border-radius:8px;padding:20px;box-shadow:0 1px 3px rgba(0,0,0,0.08);margin-bottom:16px">
    <p style="margin:0 0 12px;font-size:15px;color:#0f172a;font-weight:700">Hi ${details.name ?? "there"},</p>
    <p style="margin:0 0 16px;font-size:14px;color:#475569;line-height:1.6">
      Our <strong>${label}</strong> expert will call you on
      <strong style="color:#1e3a8a">+91 ${details.phone}</strong> by
      <strong style="color:#1e3a8a">${callbackTime} IST</strong> today.
      This is a <strong>100% free consultation</strong> — no commitment needed.
    </p>
    <div style="background:#f0f9ff;border-left:3px solid #1e3a8a;border-radius:4px;padding:12px 14px;font-size:13px;color:#1e3a8a">
      📞 Keep your phone nearby. The call may appear from an unknown number.
    </div>
  </div>

  ${
    details.consultationType === "cibil_fix"
      ? `<div style="background:#fff7ed;border:1px solid #fed7aa;border-radius:8px;padding:14px;font-size:13px;color:#9a3412;margin-bottom:16px">
      <strong>After the call:</strong> If you'd like to proceed, our expert will share a link for the
      <strong>Full CIBIL Report + Fix Plan (₹699)</strong>.
    </div>`
      : ""
  }

  <p style="margin:0;font-size:11px;color:#94a3b8;text-align:center">LiquiFi.cash · Powered by TheBrainCord</p>
</div>`;

  await sendEmail(details.email, subject, html);
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
      email,
      consultation_type,
      loan_type,
      cibil_score,
      time_preference,
      notes,
    } = parsed.data;

    const callbackByTime = new Date(
      Date.now() + 6 * 60 * 60 * 1000,
    ).toISOString();

    const details: NotifyDetails = {
      phone,
      name,
      email,
      consultationType: consultation_type,
      loanType: loan_type,
      cibilScore: cibil_score,
      timePreference: time_preference,
      notes,
      callbackBy: callbackByTime,
    };

    // Fire-and-forget — both run in parallel, neither blocks the response
    Promise.all([notifyAdmin(details), notifyUser(details)]).catch((err) =>
      console.error("[notify] unhandled:", err),
    );

    // Persist to DB — best-effort
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
