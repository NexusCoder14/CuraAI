import { NextResponse } from "next/server";
import { matchSalons } from "@/lib/ai/recommendations";
import { SALONS } from "@/lib/data/salons";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const { twin, filters } = await req.json();
  const filtered = SALONS.filter((s) => {
    if (filters?.location && filters.location !== "All" && !s.area.toLowerCase().includes(filters.location.toLowerCase())) return false;
    if (filters?.priceBand && filters.priceBand !== "All" && s.priceBand !== filters.priceBand) return false;
    return true;
  });
  const result = await matchSalons(twin ?? {}, filtered, filters ?? {});
  // attach the salon objects so the client can render without a second lookup
  const enriched = result.matches.map((m) => ({
    ...m,
    salon: SALONS.find((s) => s.id === m.salon_id),
  })).filter((m) => m.salon);
  return NextResponse.json({ matches: enriched });
}
