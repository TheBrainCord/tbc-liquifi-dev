import { NextRequest, NextResponse } from "next/server";
import { SendOTPSchema } from "@/lib/validations";
import { getSupabaseAnon } from "@/lib/supabase/server";

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
    const supabase = getSupabaseAnon();

    if (!supabase) {
      return NextResponse.json(
        { error: "Authentication service not configured" },
        { status: 503 },
      );
    }

    const { error } = await supabase.auth.signInWithOtp({
      phone: `+91${phone}`,
    });

    if (error) {
      if (error.status === 429) {
        return NextResponse.json(
          { error: "Too many attempts. Please wait a minute and try again." },
          { status: 429 },
        );
      }
      console.error("[auth/send-otp]", error.message);
      return NextResponse.json(
        { error: "Failed to send OTP" },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[auth/send-otp] unexpected:", err);
    return NextResponse.json({ error: "Failed to send OTP" }, { status: 500 });
  }
}
