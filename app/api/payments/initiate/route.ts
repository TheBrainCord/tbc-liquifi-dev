import { NextRequest, NextResponse } from "next/server";
import { PaymentInitiateSchema } from "@/lib/validations";
import { getSupabaseAdmin } from "@/lib/supabase/server";

const PLANS = {
  basic: {
    name: "Basic Consultation",
    amount: 499,
    calls: 1,
    description: "1 expert call + personalised CIBIL action plan",
  },
  premium: {
    name: "Premium CIBIL Fix",
    amount: 999,
    calls: 3,
    description: "3 expert calls + full dispute support + 90-day monitoring",
  },
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);
    if (!body) {
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 },
      );
    }

    const parsed = PaymentInitiateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0].message },
        { status: 422 },
      );
    }

    const { plan, phone, name } = parsed.data;
    const planDetails = PLANS[plan];

    // Dummy order — replace with Razorpay in production
    const orderId = `LQF_${Date.now()}_${Math.random().toString(36).slice(2, 8).toUpperCase()}`;

    // Save lead so agent knows to call
    const admin = getSupabaseAdmin();
    if (admin) {
      await admin
        .from("leads")
        .upsert(
          {
            phone,
            name: name ?? null,
            loan_type: "cibil_fix",
            loan_amount: String(planDetails.amount),
          },
          { onConflict: "phone,loan_type" },
        )
        .then(
          () => null,
          () => null,
        );
    }

    return NextResponse.json({
      success: true,
      order_id: orderId,
      amount: planDetails.amount,
      plan_name: planDetails.name,
      currency: "INR",
    });
  } catch (err) {
    console.error("[payments/initiate] unexpected:", err);
    return NextResponse.json(
      { error: "Payment initiation failed" },
      { status: 500 },
    );
  }
}
