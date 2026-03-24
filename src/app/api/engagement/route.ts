import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const { session_id, event_type, event_data, user_id } = await request.json();

    if (!session_id || !event_type) {
      return NextResponse.json({ error: "Missing session_id or event_type" }, { status: 400 });
    }

    await supabaseAdmin.from("vyve_engagement_events").insert({
      session_id,
      user_id: user_id || null,
      event_type,
      event_data: event_data || {},
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Engagement tracking error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const metric = searchParams.get("metric");

  if (!metric) {
    return NextResponse.json({ error: "Specify a metric" }, { status: 400 });
  }

  try {
    switch (metric) {
      case "quiz_completion_rate": {
        const { count: started } = await supabaseAdmin
          .from("vyve_engagement_events")
          .select("*", { count: "exact", head: true })
          .eq("event_type", "quiz_started");

        const { count: completed } = await supabaseAdmin
          .from("vyve_engagement_events")
          .select("*", { count: "exact", head: true })
          .eq("event_type", "quiz_completed");

        const rate = started ? ((completed || 0) / started) * 100 : 0;
        return NextResponse.json({ metric, value: Math.round(rate), started, completed });
      }

      case "share_rate": {
        const { count: scored } = await supabaseAdmin
          .from("vyve_engagement_events")
          .select("*", { count: "exact", head: true })
          .eq("event_type", "score_revealed");

        const { count: shared } = await supabaseAdmin
          .from("vyve_engagement_events")
          .select("*", { count: "exact", head: true })
          .in("event_type", ["share_whatsapp_clicked", "share_link_copied"]);

        const rate = scored ? ((shared || 0) / scored) * 100 : 0;
        return NextResponse.json({ metric, value: Math.round(rate), scored, shared });
      }

      case "overview": {
        const { count: totalQuizzes } = await supabaseAdmin
          .from("vyve_quiz_responses")
          .select("*", { count: "exact", head: true });

        const { count: totalScores } = await supabaseAdmin
          .from("vyve_scores")
          .select("*", { count: "exact", head: true });

        const { count: totalUsers } = await supabaseAdmin
          .from("vyve_users")
          .select("*", { count: "exact", head: true });

        const { data: recentScores } = await supabaseAdmin
          .from("vyve_scores")
          .select("composite_score, financial_score, career_score, health_score, created_at")
          .order("created_at", { ascending: false })
          .limit(20);

        return NextResponse.json({
          metric,
          total_quizzes: totalQuizzes || 0,
          total_scores: totalScores || 0,
          total_users: totalUsers || 0,
          recent_scores: recentScores || [],
        });
      }

      default:
        return NextResponse.json({ error: "Unknown metric" }, { status: 400 });
    }
  } catch (error) {
    console.error("Engagement metrics error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
