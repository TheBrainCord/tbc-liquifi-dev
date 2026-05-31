import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getSupabaseAdmin } from "@/lib/supabase/server";

const ITRBookingSchema = z.object({
  name: z.string().min(2).optional(),
  phone: z.string().regex(/^\d{10}$/, "Enter a valid 10-digit mobile number"),
  email: z.string().email().optional(),
  plan: z.enum(["basic", "business", "premium"]),
  income_type: z.string().optional(),
  filing_year: z.string().optional(),
  notes: z.string().max(500).optional(),
});

async function sendEmail(to: string, subject: string, html: string) {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!apiKey) return;
  await fetch("https://api.resend.com/emails", {
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
  }).catch((err) => console.error("[itr/book] email error:", err));
}

const PLAN_LABELS: Record<string, string> = {
  basic: "Basic — ₹499 (ITR-1 Salaried)",
  business: "Business — ₹999 (ITR-3/4 Self-Employed)",
  premium: "Premium — ₹1,499 (HNI / NRI / Capital Gains)",
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);
    if (!body)
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 },
      );

    const parsed = ITRBookingSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0].message },
        { status: 422 },
      );
    }

    const { name, phone, email, plan, income_type, filing_year, notes } =
      parsed.data;
    const planLabel = PLAN_LABELS[plan];

    // Persist booking
    let bookingId: string | null = null;
    const admin = getSupabaseAdmin();
    if (admin) {
      const { data, error } = await admin
        .from("itr_bookings")
        .insert({
          name: name ?? null,
          phone,
          email: email ?? null,
          plan,
          income_type: income_type ?? null,
          filing_year: filing_year ?? null,
          notes: notes ?? null,
        })
        .select("id")
        .single();
      if (error) console.error("[itr/book] db:", error.message);
      else bookingId = data.id;
    }

    const caEmail =
      process.env.CA_NOTIFY_EMAIL ??
      process.env.ADMIN_NOTIFY_EMAIL ??
      "thebraincordservices@gmail.com";
    const adminSubject = `📋 New ITR Booking — ${planLabel} — +91 ${phone}`;
    const adminHtml = `
<div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:24px;background:#f8fafc;border-radius:12px">
  <div style="background:#1e3a8a;border-radius:8px;padding:16px 20px;margin-bottom:20px">
    <h2 style="color:#fff;margin:0;font-size:18px">📋 New ITR Filing Booking</h2>
    <p style="color:#bfdbfe;margin:4px 0 0;font-size:13px">LiquiFi · Tax Filing Service</p>
  </div>
  <table style="width:100%;border-collapse:collapse;background:#fff;border-radius:8px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.08)">
    <tr style="background:#f1f5f9"><td style="padding:10px 14px;font-size:12px;color:#64748b;font-weight:600;width:36%">NAME</td><td style="padding:10px 14px;font-size:14px;color:#0f172a;font-weight:700">${name ?? "Not provided"}</td></tr>
    <tr><td style="padding:10px 14px;font-size:12px;color:#64748b;font-weight:600">PHONE</td><td style="padding:10px 14px;font-size:14px;color:#0f172a;font-weight:700">+91 ${phone}</td></tr>
    ${email ? `<tr style="background:#f1f5f9"><td style="padding:10px 14px;font-size:12px;color:#64748b;font-weight:600">EMAIL</td><td style="padding:10px 14px;font-size:14px;color:#0f172a;font-weight:700">${email}</td></tr>` : ""}
    <tr style="background:#f1f5f9"><td style="padding:10px 14px;font-size:12px;color:#64748b;font-weight:600">PLAN</td><td style="padding:10px 14px;font-size:14px;color:#0f172a;font-weight:700">${planLabel}</td></tr>
    ${income_type ? `<tr><td style="padding:10px 14px;font-size:12px;color:#64748b;font-weight:600">INCOME TYPE</td><td style="padding:10px 14px;font-size:14px;color:#0f172a;font-weight:700">${income_type}</td></tr>` : ""}
    ${filing_year ? `<tr style="background:#f1f5f9"><td style="padding:10px 14px;font-size:12px;color:#64748b;font-weight:600">FILING YEAR</td><td style="padding:10px 14px;font-size:14px;color:#0f172a;font-weight:700">${filing_year}</td></tr>` : ""}
    ${notes ? `<tr><td style="padding:10px 14px;font-size:12px;color:#64748b;font-weight:600">NOTES</td><td style="padding:10px 14px;font-size:14px;color:#0f172a">${notes}</td></tr>` : ""}
  </table>
  <p style="margin:16px 0 0;font-size:12px;color:#94a3b8;text-align:center">Contact client within 24 hours · LiquiFi.cash</p>
</div>`;

    const userHtml = `
<div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:24px;background:#f8fafc;border-radius:12px">
  <div style="background:#1e3a8a;border-radius:8px;padding:20px;margin-bottom:20px;text-align:center">
    <div style="font-size:32px;margin-bottom:8px">✅</div>
    <h2 style="color:#fff;margin:0;font-size:20px">ITR Booking Confirmed!</h2>
    <p style="color:#bfdbfe;margin:6px 0 0;font-size:13px">${planLabel}</p>
  </div>
  <div style="background:#fff;border-radius:8px;padding:20px;box-shadow:0 1px 3px rgba(0,0,0,0.08)">
    <p style="margin:0 0 12px;font-size:15px;color:#0f172a;font-weight:700">Hi ${name ?? "there"},</p>
    <p style="margin:0 0 16px;font-size:14px;color:#475569;line-height:1.6">
      Your ITR filing booking is confirmed. Our CA will contact you on
      <strong style="color:#1e3a8a">+91 ${phone}</strong> within 24 hours to collect your documents and begin filing.
    </p>
    <div style="background:#f0f9ff;border-left:3px solid #1e3a8a;border-radius:4px;padding:12px 14px;font-size:13px;color:#1e3a8a">
      📄 Keep your Form-16 / bank statements handy. The CA will guide you through the rest.
    </div>
  </div>
  <p style="margin:16px 0 0;font-size:11px;color:#94a3b8;text-align:center">LiquiFi.cash · Powered by TheBrainCord</p>
</div>`;

    Promise.all([
      sendEmail(caEmail, adminSubject, adminHtml),
      email
        ? sendEmail(email, "Your ITR Filing is Booked ✓ — LiquiFi", userHtml)
        : Promise.resolve(),
    ]).catch((err) => console.error("[itr/book] notify:", err));

    return NextResponse.json({ success: true, booking_id: bookingId });
  } catch (err) {
    console.error("[itr/book] unexpected:", err);
    return NextResponse.json(
      { error: "Failed to book. Please try again." },
      { status: 500 },
    );
  }
}
