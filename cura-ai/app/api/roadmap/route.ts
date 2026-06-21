import { NextResponse } from "next/server";
import { generateRoadmap } from "@/lib/ai/roadmap";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const { goal, days, profile } = await req.json();
  const roadmap = await generateRoadmap(goal, Number(days) || 30, profile);
  return NextResponse.json(roadmap);
}
