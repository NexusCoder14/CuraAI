import { generateJSON } from "./json";
import { PERSONA_PROMPT } from "./prompts";

export type TwinProfile = {
  ageRange: string;
  goals: string[];
  styles: string[];
  hairType: string;
  skinType: string;
  budget: string;
  events: string[];
  location?: string;
};

export type BeautyTwin = {
  persona: string;
  tagline: string;
  summary: string;
  signature_traits: string[];
  color_palette: string[];
  style_dna: { minimal: number; glam: number; trend: number; classic: number; edgy: number };
  recommended_vibes: string[];
  beauty_score: number;
  next_best_action: string;
};

const FALLBACK: BeautyTwin = {
  persona: "Luxury Minimalist",
  tagline: "Quiet confidence, polished from within.",
  summary:
    "You gravitate toward refined essentials and effortless finishes. Your beauty signature is clean, intentional, and built around longevity over trend.",
  signature_traits: ["Effortless", "Refined", "Intentional", "Modern"],
  color_palette: ["#0a0f24", "#c4b5fd", "#22d3ee", "#fde68a"],
  style_dna: { minimal: 82, glam: 48, trend: 55, classic: 70, edgy: 30 },
  recommended_vibes: ["Glass skin", "Sculpted lob", "Soft sun-glow makeup"],
  beauty_score: 78,
  next_best_action: "Book a hydration facial to lock in your signature glow.",
};

export async function generateBeautyTwin(profile: TwinProfile): Promise<BeautyTwin> {
  return generateJSON<BeautyTwin>(PERSONA_PROMPT(profile as unknown as Record<string, unknown>), {
    model: "smart",
    temperature: 0.7,
    fallback: { ...FALLBACK },
  });
}
