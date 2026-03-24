import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const { phone } = await request.json();

    if (!phone || !phone.startsWith("+91") || phone.length < 13) {
      return NextResponse.json({ error: "Invalid phone number" }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();

    const { error } = await supabase.auth.signInWithOtp({
      phone,
    });

    if (error) {
      console.error("OTP send error:", error);
      return NextResponse.json({ error: "Failed to send OTP" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("OTP error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
