import { NextRequest, NextResponse } from "next/server";
import { INDIA_QUIZ_CONFIG } from "@/lib/config/india";

const CONFIGS: Record<string, unknown> = {
  IN: INDIA_QUIZ_CONFIG,
};

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ country: string }> }
) {
  const { country } = await params;
  const config = CONFIGS[country.toUpperCase()];

  if (!config) {
    return NextResponse.json({ error: "Country not supported" }, { status: 404 });
  }

  return NextResponse.json(config);
}
