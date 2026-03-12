import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { text } = await request.json();

    if (!text) {
      return NextResponse.json({ error: "No text provided" }, { status: 400 });
    }

    const message = await client.messages.create({
      model: "claude-opus-4-5",
      max_tokens: 1500,
      messages: [
        {
          role: "user",
          content: `You are a lease auditor AI for small business owners. Analyze this lease and respond ONLY with valid JSON (no markdown, no backticks):

${text}

Return this exact structure:
{
  "riskScore": 75,
  "summary": "2-3 sentence plain English summary of key risks",
  "keyDates": [
    {"label": "Date Name", "date": "date string", "daysUntil": 120, "urgent": false, "note": "what to do"}
  ],
  "hiddenFees": [
    {"name": "Fee Name", "amount": "$X/mo", "risk": "high|medium|low", "explanation": "plain English explanation"}
  ],
  "gotchaClauses": [
    {"type": "clause category", "title": "Short title", "detail": "plain English explanation of the risk", "severity": "high|medium|low"}
  ],
  "savings": "One specific actionable negotiation tip to save money or reduce risk"
}`,
        },
      ],
    });

    const responseText = message.content
      .map((block) => (block.type === "text" ? block.text : ""))
      .join("");

    const cleaned = responseText.replace(/```json|```/g, "").trim();
    const result = JSON.parse(cleaned);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Lease analysis error:", error);
    return NextResponse.json(
      { error: "Analysis failed. Please try again." },
      { status: 500 }
    );
  }
}
