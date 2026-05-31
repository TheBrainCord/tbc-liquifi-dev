import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import Anthropic from "@anthropic-ai/sdk";
import { getSupabaseAdmin } from "@/lib/supabase/server";

const ChatSchema = z.object({
  message: z.string().min(1).max(1000),
  session_id: z.string().min(1),
  user_context: z
    .object({
      name: z.string().optional(),
      cibil_score: z.number().optional(),
      loan_type: z.string().optional(),
    })
    .optional(),
});

const SYSTEM_PROMPT = `You are Lumi, LiquiFi's friendly AI financial advisor for Indian users. Keep all answers under 100 words unless the user asks for more detail. Answer only finance, loan, tax, and CIBIL-related questions. For complex situations always recommend booking a free expert call. Never guarantee loan approvals or specific rates — always say "starting from". Use simple conversational Indian English.

LIQUIFI PRODUCTS (always accurate):
- Personal Loan: from 10.5% p.a., up to ₹40L, up to 7 years
- Home Loan: from 8.5% p.a., up to ₹5Cr, up to 30 years
- Business Loan: from 12% p.a., up to ₹2Cr, up to 5 years
- Car Loan: from 8.75% p.a., up to ₹1Cr
- Education Loan: from 9.5% p.a., up to ₹75L
- Balance Transfer: from 10.5% p.a., up to ₹50L — consolidate high-interest debt
- CIBIL Fix: ₹699 — full report + personalised fix plan
- ITR Filing: from ₹499 — CA-assisted, 100% online`;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);
    if (!body)
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });

    const parsed = ChatSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0].message },
        { status: 422 },
      );
    }

    const { message, session_id, user_context } = parsed.data;

    const apiKey = process.env.ANTHROPIC_API_KEY?.trim();
    if (!apiKey) {
      return NextResponse.json(
        {
          reply:
            "AI chat is not configured yet. Please call 1800-123-4567 or book a free expert call.",
          session_id,
        },
        { status: 200 },
      );
    }

    const admin = getSupabaseAdmin();

    // Fetch last 10 messages for conversation history
    let history: { role: "user" | "assistant"; content: string }[] = [];
    if (admin) {
      const { data } = await admin
        .from("chat_sessions")
        .select("role, content")
        .eq("session_id", session_id)
        .order("created_at", { ascending: true })
        .limit(10);
      history = (data ?? []) as typeof history;
    }

    // Retrieve relevant knowledge via full-text search
    let contextChunks = "";
    if (admin) {
      const { data: kb } = await admin.rpc("search_knowledge", {
        query: message,
        result_limit: 3,
      });
      if (kb && kb.length > 0) {
        contextChunks =
          "\n\nRELEVANT KNOWLEDGE BASE:\n" +
          kb
            .map(
              (r: { question: string; answer: string }) =>
                `Q: ${r.question}\nA: ${r.answer}`,
            )
            .join("\n\n");
      }
    }

    // Build user context addition
    let userContextNote = "";
    if (user_context) {
      const parts: string[] = [];
      if (user_context.name) parts.push(`User's name: ${user_context.name}`);
      if (user_context.cibil_score)
        parts.push(`CIBIL score: ${user_context.cibil_score}`);
      if (user_context.loan_type)
        parts.push(`Interested in: ${user_context.loan_type}`);
      if (parts.length)
        userContextNote = `\n\nUSER CONTEXT: ${parts.join(", ")}`;
    }

    const systemPrompt = SYSTEM_PROMPT + contextChunks + userContextNote;

    const client = new Anthropic({ apiKey });
    const response = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 300,
      system: systemPrompt,
      messages: [
        ...history.map((m) => ({ role: m.role, content: m.content })),
        { role: "user", content: message },
      ],
    });

    const reply = (response.content[0] as { type: string; text: string }).text;

    // Save both messages (fire-and-forget)
    if (admin) {
      Promise.all([
        admin
          .from("chat_sessions")
          .insert({ session_id, role: "user", content: message }),
        admin
          .from("chat_sessions")
          .insert({ session_id, role: "assistant", content: reply }),
      ]).catch((err) => console.error("[support/chat] save:", err));
    }

    return NextResponse.json({ reply, session_id });
  } catch (err) {
    console.error("[support/chat] unexpected:", err);
    return NextResponse.json(
      {
        reply:
          "Sorry, I'm having trouble right now. Please try again or call 1800-123-4567.",
        session_id: "",
      },
      { status: 200 },
    );
  }
}
