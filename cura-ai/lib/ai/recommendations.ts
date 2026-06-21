import { generateJSON } from "./json";
import { MATCH_PROMPT, LOOK_PROMPT, INSIGHTS_PROMPT } from "./prompts";
import type { Salon } from "../data/salons";

export type SalonMatch = {
  salon_id: string;
  compatibility: number;
  style_match: number;
  budget_match: number;
  goal_match: number;
  reasoning: string;
  signature_service: string;
};

export async function matchSalons(
  twin: unknown,
  salons: Salon[],
  filters: { location?: string; budget?: string; goal?: string }
): Promise<{ matches: SalonMatch[] }> {
  const compact = salons.map((s) => ({
    id: s.id,
    name: s.name,
    area: s.area,
    specialties: s.specialties,
    price_band: s.priceBand,
    vibes: s.vibes,
    rating: s.rating,
  }));
  const fallback = {
    matches: salons.slice(0, 6).map((s, i) => ({
      salon_id: s.id,
      compatibility: 92 - i * 4,
      style_match: 88 - i * 3,
      budget_match: 80 - i * 2,
      goal_match: 90 - i * 4,
      reasoning: `${s.name} aligns with your vibe — ${s.vibes[0]} and strong ${s.specialties[0]}.`,
      signature_service: s.specialties[0],
    })),
  };
  return generateJSON(MATCH_PROMPT(twin, compact, filters), {
    model: "smart",
    temperature: 0.5,
    fallback,
  });
}

export type LookBlueprint = {
  look_name: string;
  aesthetic_summary: string;
  mood_keywords: string[];
  color_palette: string[];
  hair: { style: string; color: string; treatments: string[] };
  skin: { finish: string; routine: string[] };
  makeup: { eyes: string; lips: string; complexion: string };
  recommended_services: string[];
  celebrity_references: string[];
  estimated_sessions: number;
  estimated_budget_inr: { min: number; max: number };
};

const LOOK_FALLBACK: LookBlueprint = {
  look_name: "Modern Editorial",
  aesthetic_summary:
    "A refined, magazine-cover finish — sculpted features, luminous skin, and a confident neutral palette that reads expensive in any light.",
  mood_keywords: ["sculpted", "luminous", "considered", "magnetic", "modern"],
  color_palette: ["#1a1a2e", "#c9a17a", "#f5e6d3", "#7c3aed"],
  hair: { style: "Sleek collarbone lob", color: "Espresso with subtle face-framing", treatments: ["Bond gloss", "Keratin smoothing"] },
  skin: { finish: "Lit-from-within satin", routine: ["Gentle cleanse", "Niacinamide", "SPF 50"] },
  makeup: { eyes: "Bronze-smoked liner", lips: "Stained rose nude", complexion: "Sheer skin tint + cream blush" },
  recommended_services: ["Hydra-facial", "Bond gloss", "Brow lamination", "Lash lift"],
  celebrity_references: ["Deepika Padukone", "Zoë Kravitz"],
  estimated_sessions: 4,
  estimated_budget_inr: { min: 10000, max: 22000 },
};

export async function generateLook(description: string): Promise<LookBlueprint> {
  return generateJSON(LOOK_PROMPT(description), {
    model: "smart",
    temperature: 0.75,
    fallback: { ...LOOK_FALLBACK },
  });
}

export type Insights = {
  beauty_score: number;
  score_delta: number;
  strengths: { label: string; score: number; note: string }[];
  improvements: { label: string; score: number; note: string }[];
  weekly_recommendations: { title: string; why: string; category: string }[];
  trending_for_you: string[];
  next_milestone: string;
};

const INSIGHTS_FALLBACK: Insights = {
  beauty_score: 82,
  score_delta: 6,
  strengths: [
    { label: "Skin Consistency", score: 88, note: "Barrier health is steady — visible glow week-over-week." },
    { label: "Hair Health", score: 80, note: "Bond integrity improving since last gloss." },
    { label: "Routine Discipline", score: 84, note: "5/7 days completed last week." },
  ],
  improvements: [
    { label: "Brow Architecture", score: 58, note: "A shaping session would sharpen your frame." },
    { label: "Nail Care", score: 62, note: "Cuticles need weekly attention." },
  ],
  weekly_recommendations: [
    { title: "Book a brow lamination", why: "Frames your eyes — biggest visual lift this week.", category: "makeup" },
    { title: "Add a vitamin C serum", why: "Targets the uneven tone flagged last cycle.", category: "skin" },
    { title: "Hair mask, Sunday ritual", why: "Locks in last week's gloss treatment.", category: "hair" },
  ],
  trending_for_you: ["Glass skin", "Cinnamon brunette", "Almond nails"],
  next_milestone: "Hit 85 Beauty Score by completing 3 priority tasks this week.",
};

export async function generateInsights(twin: unknown, activity: unknown): Promise<Insights> {
  return generateJSON(INSIGHTS_PROMPT(twin, activity), {
    model: "smart",
    temperature: 0.6,
    fallback: { ...INSIGHTS_FALLBACK },
  });
}
