import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const { phone, otp } = await request.json() as { phone: string; otp: string };

    if (!phone || !otp) {
      return NextResponse.json({ error: "Missing phone or OTP" }, { status: 400 });
    }

    const { data, error } = await supabase.auth.verifyOtp({
      phone,
      token: otp,
      type: "sms",
    });

    if (error) {
      console.error("OTP verify error:", error);
      return NextResponse.json({ error: "Invalid OTP" }, { status: 401 });
    }

    if (data.user) {
      await supabase.from("vyve_users").upsert(
        { id: data.user.id, phone, country_code: "IN" },
        { onConflict: "id" }
      );
    }

    return NextResponse.json({
      success: true,
      user_id: data.user?.id,
      session: data.session,
    });
  } catch (error) {
    console.error("Verify error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
