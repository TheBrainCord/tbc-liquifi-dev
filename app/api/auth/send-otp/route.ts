import { NextRequest, NextResponse } from "next/server";
import { SendOTPSchema } from "@/lib/validations";
import { getSupabaseAdmin } from "@/lib/supabase/server";

function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

async function sendSMS(
  phone: string,
  otp: string,
): Promise<{ ok: boolean; error?: string }> {
  const apiKey = process.env.TWOFACTOR_API_KEY?.trim();

  if (!apiKey) {
    // Dev fallback — OTP visible in server logs only
    console.log(`[dev/otp] ${phone} → ${otp}`);
    return { ok: true };
  }

  try {
    // 2Factor.in OTP API: GET /API/V1/{key}/SMS/{phone}/{otp}
    const res = await fetch(
      `https://2factor.in/API/V1/${apiKey}/SMS/${phone}/${otp}`,
      { method: "GET" },
    );

    const data = await res.json().catch(() => ({}));
    console.log(`[2factor] status=${res.status} body=${JSON.stringify(data)}`);

    if (data.Status !== "Success") {
      return { ok: false, error: data.Details ?? "Failed to send OTP" };
    }
    return { ok: true };
  } catch (err) {
    console.error("[sms]", err);
    return { ok: false, error: "SMS service unavailable. Please try again." };
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

    const parsed = SendOTPSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0].message },
        { status: 422 },
      );
    }

    const { phone } = parsed.data;
    const admin = getSupabaseAdmin();

    if (!admin) {
      return NextResponse.json(
        { error: "Service not configured" },
        { status: 503 },
      );
    }

    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString();

    const { error: storeError } = await admin
      .from("phone_otps")
      .upsert(
        { phone, otp_code: otp, expires_at: expiresAt },
        { onConflict: "phone" },
      );

    if (storeError) {
      console.error("[send-otp] store:", storeError.message);
      return NextResponse.json(
        { error: "Failed to process request" },
        { status: 500 },
      );
    }

    const sms = await sendSMS(phone, otp);
    if (!sms.ok) {
      return NextResponse.json(
        { error: sms.error ?? "Failed to send OTP" },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[auth/send-otp] unexpected:", err);
    return NextResponse.json({ error: "Failed to send OTP" }, { status: 500 });
  }
}
