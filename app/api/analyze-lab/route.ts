// import { NextRequest, NextResponse } from "next/server";
// import Anthropic from "@anthropic-ai/sdk";

// const client = new Anthropic({
//   apiKey: process.env.ANTHROPIC_API_KEY,
// });

// export async function POST(request: NextRequest) {
//   try {
//     const { text } = await request.json();

//     if (!text) {
//       return NextResponse.json({ error: "No text provided" }, { status: 400 });
//     }

//     const message = await client.messages.create({
//       model: "claude-opus-4-5",
//       max_tokens: 1500,
//       messages: [
//         {
//           role: "user",
//           content: `You are a medical AI assistant that translates complex lab results into plain English for patients. Analyze these lab results and respond ONLY with valid JSON (no markdown, no backticks):

// ${text}

// Return this exact structure:
// {
//   "summary": "2-3 sentence plain English summary for a patient",
//   "critical": ["array of concerning findings in plain English"],
//   "normal": ["array of normal results written simply"],
//   "metrics": [
//     {"name": "Metric Name", "value": "numeric value", "unit": "units", "status": "normal|high|low|critical", "plain": "plain English explanation"}
//   ],
//   "action": "One clear recommended next step for the patient"
// }`,
//         },
//       ],
//     });

//     const responseText = message.content
//       .map((block) => (block.type === "text" ? block.text : ""))
//       .join("");

//     const cleaned = responseText.replace(/```json|```/g, "").trim();
//     const result = JSON.parse(cleaned);

//     return NextResponse.json(result);
//   } catch (error) {
//     console.error("Lab analysis error:", error);
//     return NextResponse.json(
//       { error: "Analysis failed. Please try again." },
//       { status: 500 }
//     );
//   }
// }

import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { text, file } = await request.json();

    if (!text && !file) {
      return NextResponse.json({ error: "No text or file provided" }, { status: 400 });
    }

    let messageContent = text;

    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (ev.target?.result) {
          messageContent = ev.target.result as string;
          processMessage();
        }
      };
      reader.readAsText(file);
    } else {
      processMessage();
    }

    async function processMessage() {
      const message = await client.messages.create({
        model: "claude-opus-4-5",
        max_tokens: 1500,
        messages: [
          {
            role: "user",
            content: `You are a medical AI assistant that translates complex lab results into plain English for patients. Analyze these lab results and respond ONLY with valid JSON (no markdown, no backticks):

${messageContent}

Return this exact structure:
{
  "summary": "2-3 sentence plain English summary for a patient",
  "critical": ["array of concerning findings in plain English"],
  "normal": ["array of normal results written simply"],
  "metrics": [
    {"name": "Metric Name", "value": "numeric value", "unit": "units", "status": "normal|high|low|critical", "plain": "plain English explanation"}
  ],
  "action": "One clear recommended next step for the patient"
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
    }
  } catch (error) {
    console.error("Lab analysis error:", error);
    return NextResponse.json(
      { error: "Analysis failed. Please try again." },
      { status: 500 }
    );
  }
}
