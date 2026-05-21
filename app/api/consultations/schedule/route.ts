import { NextRequest, NextResponse } from "next/server";
import { ConsultationSchema } from "@/lib/validations";
import { getSupabaseAdmin } from "@/lib/supabase/server";

// Callback window: 6 hours from now
function callbackBy() {
  return new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString();
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

    const admin = getSupabaseAdmin();
    if (!admin) {
      return NextResponse.json(
        { error: "Service not configured" },
        { status: 503 },
      );
    }

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
        callback_by: callbackBy(),
      })
      .select("id, callback_by")
      .single();

    if (error) {
      console.error("[consultations/schedule]", error.message);
      return NextResponse.json(
        { error: "Failed to schedule consultation" },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      consultation_id: data.id,
      callback_by: data.callback_by,
    });
  } catch (err) {
    console.error("[consultations/schedule] unexpected:", err);
    return NextResponse.json(
      { error: "Failed to schedule consultation" },
      { status: 500 },
    );
  }
}
