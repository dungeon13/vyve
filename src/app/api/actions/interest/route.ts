import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const {
      session_id,
      action_key,
      action_title,
      pillar,
      name,
      email,
      phone,
    } = (await request.json()) as {
      session_id?: string;
      action_key?: string;
      action_title?: string;
      pillar?: "financial" | "career" | "health";
      name?: string;
      email?: string;
      phone?: string;
    };

    if (!session_id || !action_key || !action_title || !pillar) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();

    const { error: interestError } = await supabase.from("vyve_action_interest").insert({
      session_id,
      action_key,
      action_title,
      pillar,
      name: name?.trim() || null,
      email: email?.trim() || null,
      phone: phone?.trim() || null,
    });

    if (interestError) {
      console.error("Action interest insert error:", interestError);
      return NextResponse.json({ error: "Failed to save interest" }, { status: 500 });
    }

    await supabase.from("vyve_engagement_events").insert({
      session_id,
      event_type: "action_coming_soon_interest",
      event_data: {
        action_key,
        action_title,
        pillar,
        has_name: Boolean(name?.trim()),
        has_email: Boolean(email?.trim()),
        has_phone: Boolean(phone?.trim()),
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Action interest API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
