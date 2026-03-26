import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

function getGenAI() {
  const key = process.env.GEMINI_API_KEY;
  if (!key) throw new Error("GEMINI_API_KEY is not configured");
  return new GoogleGenAI({ apiKey: key });
}

export async function POST(request: NextRequest) {
  try {
    const {
      city,
      industry,
      emotional_state,
      financial_score,
      career_score,
      health_score,
      composite_score,
      score_drivers,
    } = (await request.json()) as Record<string, unknown>;

    if (
      typeof city !== "string" ||
      typeof industry !== "string" ||
      typeof emotional_state !== "string" ||
      typeof financial_score !== "number" ||
      typeof career_score !== "number" ||
      typeof health_score !== "number" ||
      typeof composite_score !== "number"
    ) {
      return NextResponse.json({ error: "Missing required score fields" }, { status: 400 });
    }

    const prompt = `You are Vyve's score explainer. Produce strict JSON only.
Schema:
{
  "headline": string,
  "explanation": string,
  "strength": string,
  "risk": string,
  "next_step": string
}

Inputs:
- City: ${city}
- Industry: ${industry}
- Emotional state: ${emotional_state}
- Financial: ${financial_score}
- Career: ${career_score}
- Health: ${health_score}
- Composite: ${composite_score}
- Drivers JSON: ${JSON.stringify(score_drivers ?? [])}

Rules:
- Do not invent numeric scores.
- Keep explanation to max 120 words.
- Tone: warm, direct, practical.
- No markdown.
- Output JSON object only.`;

    const genai = getGenAI();
    const response = await genai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
    });

    const text = response.text?.trim() ?? "";
    let parsed: Record<string, unknown> | null = null;
    try {
      parsed = JSON.parse(text);
    } catch {
      parsed = {
        headline: "Your score in context",
        explanation: text || "We could not generate an explanation right now.",
        strength: "Keep compounding your strongest pillar this week.",
        risk: "Address your lowest pillar before it drags the other two.",
        next_step: "Pick one action and complete it in the next 7 days.",
      };
    }

    return NextResponse.json({ success: true, explanation: parsed });
  } catch (error) {
    console.error("Score explain error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
