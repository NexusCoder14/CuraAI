import { NextResponse } from "next/server";
import { generateBeautyTwin } from "@/lib/ai/beautyTwin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const profile = await req.json();
  const twin = await generateBeautyTwin(profile);
  return NextResponse.json(twin);
}
