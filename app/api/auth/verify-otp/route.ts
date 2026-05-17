import { NextRequest, NextResponse } from "next/server";
import { VerifyOTPSchema } from "@/lib/validations";
import { getSupabaseAdmin, getSupabaseAnon } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);
    if (!body) {
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 },
      );
    }

    const parsed = VerifyOTPSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0].message },
        { status: 422 },
      );
    }

    const { phone, token, name, loan_type } = parsed.data;
    const admin = getSupabaseAdmin();
    const anon = getSupabaseAnon();

    if (!admin || !anon) {
      return NextResponse.json(
        { error: "Authentication service not configured" },
        { status: 503 },
      );
    }

    // 1 — Verify OTP from our table
    const { data: otpRow, error: otpFetchError } = await admin
      .from("phone_otps")
      .select("otp_code, expires_at")
      .eq("phone", phone)
      .single();

    if (otpFetchError || !otpRow) {
      return NextResponse.json(
        { error: "OTP not found. Please request a new one." },
        { status: 401 },
      );
    }

    if (new Date(otpRow.expires_at) < new Date()) {
      await admin.from("phone_otps").delete().eq("phone", phone);
      return NextResponse.json(
        { error: "OTP expired. Please request a new one." },
        { status: 401 },
      );
    }

    if (otpRow.otp_code !== token) {
      return NextResponse.json(
        { error: "Invalid OTP. Please check and try again." },
        { status: 401 },
      );
    }

    // OTP valid — consume it immediately
    await admin.from("phone_otps").delete().eq("phone", phone);

    // 2 — Create Supabase auth user if not already present
    const autoEmail = `ph${phone}@auth.liquifi.cash`;

    const { error: createError } = await admin.auth.admin.createUser({
      email: autoEmail,
      email_confirm: true,
      phone: `+91${phone}`,
      phone_confirm: true,
      user_metadata: { phone, full_name: name ?? null },
    });

    // Ignore "already registered" — means the user exists and we can proceed
    if (
      createError &&
      !createError.message?.toLowerCase().includes("already")
    ) {
      console.error("[verify-otp] createUser:", createError.message);
      return NextResponse.json(
        { error: "Failed to create account" },
        { status: 500 },
      );
    }

    // 3 — Generate a one-time magic link token for this user
    const { data: linkData, error: linkError } =
      await admin.auth.admin.generateLink({
        type: "magiclink",
        email: autoEmail,
      });

    if (linkError || !linkData?.properties?.hashed_token) {
      console.error("[verify-otp] generateLink:", linkError?.message);
      return NextResponse.json(
        { error: "Failed to create session" },
        { status: 500 },
      );
    }

    // 4 — Exchange the hashed token for a real session
    const { data: sessionData, error: sessionError } =
      await anon.auth.verifyOtp({
        token_hash: linkData.properties.hashed_token,
        type: "magiclink",
      });

    if (sessionError || !sessionData.session) {
      console.error("[verify-otp] verifyOtp:", sessionError?.message);
      return NextResponse.json(
        { error: "Failed to establish session" },
        { status: 500 },
      );
    }

    const userId = sessionData.user?.id;

    // 5 — Upsert user profile row
    if (userId) {
      await admin
        .from("users")
        .upsert(
          { id: userId, phone, full_name: name ?? null },
          { onConflict: "id" },
        );

      if (loan_type) {
        await admin
          .from("leads")
          .update({ name: name ?? undefined })
          .eq("phone", phone)
          .eq("loan_type", loan_type);
      }
    }

    return NextResponse.json({
      success: true,
      session: {
        access_token: sessionData.session.access_token,
        refresh_token: sessionData.session.refresh_token,
      },
    });
  } catch (err) {
    console.error("[auth/verify-otp] unexpected:", err);
    return NextResponse.json(
      { error: "Failed to verify OTP" },
      { status: 500 },
    );
  }
}
