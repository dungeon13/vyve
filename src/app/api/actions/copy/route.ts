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
      weakest_pillar,
      recommendations,
      budget_band,
      time_budget_minutes,
    } = (await request.json()) as Record<string, unknown>;

    if (
      typeof city !== "string" ||
      typeof weakest_pillar !== "string" ||
      !Array.isArray(recommendations)
    ) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const prompt = `You are Vyve's action coach. Return strict JSON only.
Schema:
{
  "summary": string,
  "cards": [
    {
      "title": string,
      "why_it_works": string,
      "time_commitment": string,
      "cost_note": string,
      "cta": string
    }
  ]
}

Context:
- City: ${city}
- Weakest pillar: ${weakest_pillar}
- Budget band: ${String(budget_band ?? "unknown")}
- Time budget (minutes per day): ${String(time_budget_minutes ?? "unknown")}
- Recommendation candidates: ${JSON.stringify(recommendations)}

Rules:
- Keep cards practical and specific.
- Keep total response under 180 words.
- No markdown.
- Output valid JSON only.`;

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
        summary: "Start with one action you can finish this week.",
        cards: (recommendations as unknown[]).slice(0, 3).map((_, i) => ({
          title: `Recommended action ${i + 1}`,
          why_it_works: "Aligned with your weakest pillar and city context.",
          time_commitment: "20-30 min",
          cost_note: "Low to medium",
          cta: "Start this week",
        })),
      };
    }

    return NextResponse.json({ success: true, action_copy: parsed });
  } catch (error) {
    console.error("Action copy generation error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
