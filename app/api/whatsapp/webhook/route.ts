import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const SYSTEM_PROMPT = `You are Lumi, LiquiFi's WhatsApp financial advisor. Keep replies under 80 words. Only answer finance, loan, tax, and CIBIL questions. For complex cases recommend booking a free expert call at LiquiFi.cash. Use simple Indian English. No markdown — plain text only.

LIQUIFI PRODUCTS: Personal Loan 10.5%+ up to ₹40L | Home Loan 8.5%+ up to ₹5Cr | Business 12%+ up to ₹2Cr | Car 8.75%+ | Education 9.5%+ | Balance Transfer 10.5%+ | CIBIL Fix ₹699 | ITR Filing from ₹499`;

async function sendWhatsAppReply(to: string, body: string) {
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  const token = process.env.WHATSAPP_ACCESS_TOKEN;

  if (!phoneNumberId || !token) {
    console.log("[whatsapp/webhook] no credentials — skipping reply");
    return;
  }

  await fetch(`https://graph.facebook.com/v19.0/${phoneNumberId}/messages`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      messaging_product: "whatsapp",
      to,
      type: "text",
      text: { body },
    }),
  }).catch((err) => console.error("[whatsapp/webhook] send error:", err));
}

// Meta webhook verification
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const mode = searchParams.get("hub.mode");
  const token = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");

  if (mode === "subscribe" && token === process.env.WHATSAPP_VERIFY_TOKEN) {
    return new NextResponse(challenge, { status: 200 });
  }
  return new NextResponse("Forbidden", { status: 403 });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);
    if (!body) return NextResponse.json({ status: "ok" });

    const entry = body?.entry?.[0];
    const change = entry?.changes?.[0];
    const message = change?.value?.messages?.[0];

    if (!message || message.type !== "text") {
      return NextResponse.json({ status: "ok" });
    }

    const from = message.from as string;
    const userMessage = message.text.body as string;

    // Reply via Claude — fire-and-forget (WhatsApp requires 200 fast)
    (async () => {
      try {
        const response = await client.messages.create({
          model: "claude-sonnet-4-6",
          max_tokens: 200,
          system: SYSTEM_PROMPT,
          messages: [{ role: "user", content: userMessage }],
        });
        const reply =
          response.content[0].type === "text"
            ? response.content[0].text
            : "Hi! I am Lumi from LiquiFi. How can I help you with loans or CIBIL today?";
        await sendWhatsAppReply(from, reply);
      } catch (err) {
        console.error("[whatsapp/webhook] claude error:", err);
        await sendWhatsAppReply(
          from,
          "Hi! I am Lumi from LiquiFi. For instant help visit LiquiFi.cash or call 1800-123-4567.",
        );
      }
    })();

    return NextResponse.json({ status: "ok" });
  } catch (err) {
    console.error("[whatsapp/webhook] unexpected:", err);
    return NextResponse.json({ status: "ok" });
  }
}
