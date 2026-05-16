import { NextRequest, NextResponse } from "next/server";
import { SendOTPSchema } from "@/lib/validations";
import { getSupabaseAnon } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
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

  const { error } = await supabase.auth.signInWithOtp({
    phone: `+91${phone}`,
  });

  if (error) {
    // Surface rate-limit errors clearly; mask internals
    if (error.status === 429) {
      return NextResponse.json(
        { error: "Too many attempts. Please wait a minute and try again." },
        { status: 429 },
      );
    }
    console.error("[auth/send-otp]", error.message);
    return NextResponse.json({ error: "Failed to send OTP" }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
