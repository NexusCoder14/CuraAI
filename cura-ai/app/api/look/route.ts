import { NextResponse } from "next/server";
import { generateLook } from "@/lib/ai/recommendations";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const { description } = await req.json();
  const blueprint = await generateLook(description);
  return NextResponse.json(blueprint);
}
