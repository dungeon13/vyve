import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/server";
import { GoogleGenAI } from "@google/genai";

function getGenAI() {
  return new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
}

export async function POST(request: NextRequest) {
  try {
    const { user_id } = await request.json();

    if (!user_id) {
      return NextResponse.json({ error: "Missing user_id" }, { status: 400 });
    }

    const supabaseAdmin = getSupabaseAdmin();

    const { data: scores } = await supabaseAdmin
      .from("vyve_scores")
      .select("*")
      .eq("user_id", user_id)
      .order("created_at", { ascending: false })
      .limit(2);

    if (!scores || scores.length === 0) {
      return NextResponse.json({ error: "No scores found" }, { status: 404 });
    }

    const latest = scores[0];
    const previous = scores.length > 1 ? scores[1] : null;
    const scoreChange = previous
      ? latest.composite_score - previous.composite_score
      : 0;

    const { data: actions } = await supabaseAdmin
      .from("vyve_actions")
      .select("*")
      .eq("user_id", user_id)
      .eq("status", "recommended")
      .limit(3);

    const prompt = buildBriefPrompt(latest, scoreChange, actions || []);

    const genai = getGenAI();
    const response = await genai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
    });

    const briefBody = response.text || "Your weekly brief is being prepared.";

    const weekNumber = getWeekNumber();

    const { data: brief } = await supabaseAdmin
      .from("vyve_monday_briefs")
      .insert({
        user_id,
        week_number: weekNumber,
        score_change: scoreChange,
        brief_body: briefBody,
        delivered_at: new Date().toISOString(),
      })
      .select("id")
      .single();

    return NextResponse.json({
      success: true,
      brief_id: brief?.id,
      brief_body: briefBody,
      score_change: scoreChange,
    });
  } catch (error) {
    console.error("Brief generation error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

function buildBriefPrompt(
  score: Record<string, unknown>,
  scoreChange: number,
  actions: Record<string, unknown>[]
): string {
  const changeText = scoreChange > 0
    ? `up ${scoreChange} points`
    : scoreChange < 0
      ? `down ${Math.abs(scoreChange)} points`
      : "unchanged";

  return `You are Vyve, a life benchmarking assistant. Write a Monday morning brief for a user.

Their current scores:
- Financial: ${score.financial_score}/100
- Career: ${score.career_score}/100
- Health: ${score.health_score}/100
- Composite: ${score.composite_score}/100
- Emotional state: ${score.emotional_state}
- Score change from last week: ${changeText}

Pending actions: ${actions.map((a) => a.title).join(", ") || "None yet"}

Write a brief that is:
1. Under 150 words
2. Warm but direct
3. Starts with one key insight about their week
4. Gives one specific thing to do this week
5. Ends with encouragement

Tone: Like a smart friend who genuinely cares, not a corporate wellness app.
Do NOT use emojis. Do NOT use bullet points. Write in flowing prose.`;
}

function getWeekNumber(): number {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 1);
  const diff = now.getTime() - start.getTime();
  return Math.ceil(diff / (7 * 24 * 60 * 60 * 1000));
}
