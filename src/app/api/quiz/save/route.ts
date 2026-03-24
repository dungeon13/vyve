import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const { answers, result, session_id } = await request.json();

    if (!answers || !result || !session_id) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const { data: quizData, error: quizError } = await supabaseAdmin
      .from("vyve_quiz_responses")
      .insert({
        session_id,
        country_code: "IN",
        answers,
        completed_at: new Date().toISOString(),
      })
      .select("id")
      .single();

    if (quizError) {
      console.error("Quiz save error:", quizError);
      return NextResponse.json({ error: "Failed to save quiz" }, { status: 500 });
    }

    const { error: scoreError } = await supabaseAdmin
      .from("vyve_scores")
      .insert({
        session_id,
        quiz_response_id: quizData.id,
        financial_score: result.financial_score,
        career_score: result.career_score,
        health_score: result.health_score,
        emotional_state: result.emotional_state,
        composite_score: result.composite_score,
        cohort_key: result.cohort_key,
      });

    if (scoreError) {
      console.error("Score save error:", scoreError);
      return NextResponse.json({ error: "Failed to save score" }, { status: 500 });
    }

    // Track engagement event
    await supabaseAdmin.from("vyve_engagement_events").insert({
      session_id,
      event_type: "quiz_completed",
      event_data: {
        composite_score: result.composite_score,
        lowest_pillar: result.lowest_pillar,
        emotional_state: result.emotional_state,
      },
    });

    return NextResponse.json({ success: true, quiz_id: quizData.id });
  } catch (error) {
    console.error("Quiz save error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
