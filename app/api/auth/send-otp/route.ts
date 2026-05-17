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
  const apiKey = process.env.FAST2SMS_API_KEY?.trim();

  if (!apiKey) {
    console.log(`[dev/otp] ${phone} → ${otp}`);
    return { ok: true };
  }

  console.log(`[fast2sms] key=${apiKey.slice(0, 6)}… len=${apiKey.length}`);

  try {
    const res = await fetch("https://www.fast2sms.com/dev/bulkV2", {
      method: "POST",
      headers: {
        authorization: apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        route: "otp",
        variables_values: otp,
        numbers: phone,
        flash: "0",
      }),
    });

    const data = await res.json().catch(() => ({}));
    console.log(`[fast2sms] status=${res.status} body=${JSON.stringify(data)}`);

    if (!data.return) {
      const msg = Array.isArray(data.message) ? data.message[0] : data.message;
      return { ok: false, error: msg ?? "Failed to send OTP" };
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
