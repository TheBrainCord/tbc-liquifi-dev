import { NextRequest, NextResponse } from "next/server";
import { LeadCaptureSchema } from "@/lib/validations";
import { getSupabaseAdmin } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body) {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 },
    );
  }

  const parsed = LeadCaptureSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.errors[0].message },
      { status: 422 },
    );
  }

  const { phone, name, loan_type, loan_amount, employment_type, pincode } =
    parsed.data;

  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    null;

  const utmSource = req.nextUrl.searchParams.get("utm_source");
  const utmMedium = req.nextUrl.searchParams.get("utm_medium");
  const utmCampaign = req.nextUrl.searchParams.get("utm_campaign");

  const supabase = getSupabaseAdmin();

  const { error } = await supabase.from("leads").upsert(
    {
      phone,
      name,
      loan_type,
      loan_amount,
      employment_type,
      pincode,
      ip_address: ip,
      utm_source: utmSource,
      utm_medium: utmMedium,
      utm_campaign: utmCampaign,
    },
    { onConflict: "phone,loan_type" },
  );

  if (error) {
    console.error("[leads/capture]", error.message);
    return NextResponse.json({ error: "Failed to save lead" }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
