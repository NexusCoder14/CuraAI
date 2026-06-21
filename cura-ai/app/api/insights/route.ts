import { NextResponse } from "next/server";
import { generateInsights } from "@/lib/ai/recommendations";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const { twin, activity } = await req.json();
  const insights = await generateInsights(twin ?? {}, activity ?? {});
  return NextResponse.json(insights);
}
