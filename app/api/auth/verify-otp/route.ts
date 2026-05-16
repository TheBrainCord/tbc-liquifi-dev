import { NextRequest, NextResponse } from "next/server";
import { VerifyOTPSchema } from "@/lib/validations";
import { getSupabaseAnon, getSupabaseAdmin } from "@/lib/supabase/server";

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
    const supabase = getSupabaseAnon();

    if (!supabase) {
      return NextResponse.json(
        { error: "Authentication service not configured" },
        { status: 503 },
      );
    }

    const { data: authData, error: authError } = await supabase.auth.verifyOtp({
      phone: `+91${phone}`,
      token,
      type: "sms",
    });

    if (authError || !authData.user) {
      return NextResponse.json(
        { error: "Invalid or expired OTP. Please try again." },
        { status: 401 },
      );
    }

    // Upsert user profile — on first verify the record won't exist yet
    const admin = getSupabaseAdmin();
    if (admin) {
      await admin.from("users").upsert(
        {
          id: authData.user.id,
          phone,
          full_name: name ?? null,
        },
        { onConflict: "id" },
      );

      // Link any matching lead to this user (best-effort)
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
        access_token: authData.session?.access_token,
        refresh_token: authData.session?.refresh_token,
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
