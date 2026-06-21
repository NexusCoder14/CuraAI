import { generateJSON } from "./json";
import { ROADMAP_PROMPT } from "./prompts";

export type RoadmapTask = {
  title: string;
  type: "salon" | "home" | "product" | "consult";
  duration_min: number;
  priority: "high" | "medium" | "low";
};
export type RoadmapWeek = {
  week: number;
  phase: string;
  focus: string;
  tasks: RoadmapTask[];
  milestone: string;
};
export type Roadmap = {
  title: string;
  summary: string;
  total_weeks: number;
  estimated_budget_inr: { min: number; max: number };
  weeks: RoadmapWeek[];
  pro_tips: string[];
};

const FALLBACK: Roadmap = {
  title: "30-Day Radiance Reset",
  summary: "A focused four-week arc to restore glow, refine your signature, and arrive camera-ready.",
  total_weeks: 4,
  estimated_budget_inr: { min: 8000, max: 18000 },
  weeks: [
    {
      week: 1,
      phase: "Foundation",
      focus: "Reset the canvas — skin diagnostic and hydration.",
      tasks: [
        { title: "Hydra-facial consultation", type: "salon", duration_min: 75, priority: "high" },
        { title: "Begin barrier-repair PM routine", type: "home", duration_min: 10, priority: "high" },
        { title: "Switch to ceramide moisturizer", type: "product", duration_min: 5, priority: "medium" },
      ],
      milestone: "Skin reads calm, hydrated, even.",
    },
    {
      week: 2,
      phase: "Refinement",
      focus: "Hair gloss, brow architecture, nail prep.",
      tasks: [
        { title: "Bond-repair hair gloss", type: "salon", duration_min: 90, priority: "high" },
        { title: "Brow lamination & shape", type: "salon", duration_min: 45, priority: "medium" },
        { title: "Cuticle & nail prep ritual", type: "home", duration_min: 20, priority: "low" },
      ],
      milestone: "Frame is sharp — hair, brows, hands.",
    },
    {
      week: 3,
      phase: "Transformation",
      focus: "Signature look trial and styling.",
      tasks: [
        { title: "Makeup trial with stylist", type: "consult", duration_min: 90, priority: "high" },
        { title: "Lash lift & tint", type: "salon", duration_min: 60, priority: "medium" },
        { title: "Color analysis session", type: "consult", duration_min: 45, priority: "low" },
      ],
      milestone: "You can recreate the look in 20 minutes.",
    },
    {
      week: 4,
      phase: "Reveal",
      focus: "Final touch-ups and lock-in.",
      tasks: [
        { title: "Glow facial 48h before event", type: "salon", duration_min: 60, priority: "high" },
        { title: "Final blow-dry & style", type: "salon", duration_min: 60, priority: "high" },
        { title: "Nails — gel finish", type: "salon", duration_min: 60, priority: "medium" },
      ],
      milestone: "Camera-ready, calm, on time.",
    },
  ],
  pro_tips: [
    "Hydrate 3L/day from week 1 — visible by week 3.",
    "Skip new actives in the final 7 days.",
    "Photograph each week in the same light to track progress.",
  ],
};

export async function generateRoadmap(
  goal: string,
  days: number,
  profile?: Record<string, unknown>
): Promise<Roadmap> {
  return generateJSON<Roadmap>(ROADMAP_PROMPT(goal, days, profile), {
    model: "smart",
    temperature: 0.65,
    fallback: { ...FALLBACK, title: `${days}-Day ${goal}` },
  });
}
