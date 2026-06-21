export const TWIN_FALLBACK = {
  persona: "Luxury Minimalist",
  tagline: "Quiet confidence, polished from within.",
  summary: "You gravitate toward refined essentials and effortless finishes. Your beauty signature is clean, intentional, and built around longevity over trend.",
  signature_traits: ["Effortless", "Refined", "Intentional", "Modern"],
  color_palette: ["#0a0f24", "#c4b5fd", "#22d3ee", "#fde68a"],
  style_dna: { minimal: 82, glam: 48, trend: 55, classic: 70, edgy: 30 },
  recommended_vibes: ["Glass skin", "Sculpted lob", "Soft sun-glow makeup"],
  beauty_score: 78,
  next_best_action: "Book a hydration facial to lock in your signature glow.",
};

export const ROADMAP_FALLBACK = {
  title: "30-Day Radiance Reset",
  summary: "A focused four-week arc to restore glow, refine your signature, and arrive camera-ready.",
  total_weeks: 4,
  estimated_budget_inr: { min: 8000, max: 18000 },
  weeks: [
    { week: 1, phase: "Foundation", focus: "Reset the canvas — skin diagnostic and hydration.", tasks: [
      { title: "Hydra-facial consultation", type: "salon", duration_min: 75, priority: "high" },
      { title: "Begin barrier-repair PM routine", type: "home", duration_min: 10, priority: "high" },
      { title: "Switch to ceramide moisturizer", type: "product", duration_min: 5, priority: "medium" },
    ], milestone: "Skin reads calm, hydrated, even." },
    { week: 2, phase: "Refinement", focus: "Hair gloss, brow architecture, nail prep.", tasks: [
      { title: "Bond-repair hair gloss", type: "salon", duration_min: 90, priority: "high" },
      { title: "Brow lamination & shape", type: "salon", duration_min: 45, priority: "medium" },
      { title: "Cuticle & nail prep ritual", type: "home", duration_min: 20, priority: "low" },
    ], milestone: "Frame is sharp — hair, brows, hands." },
    { week: 3, phase: "Transformation", focus: "Signature look trial and styling.", tasks: [
      { title: "Makeup trial with stylist", type: "consult", duration_min: 90, priority: "high" },
      { title: "Lash lift & tint", type: "salon", duration_min: 60, priority: "medium" },
      { title: "Color analysis session", type: "consult", duration_min: 45, priority: "low" },
    ], milestone: "You can recreate the look in 20 minutes." },
    { week: 4, phase: "Reveal", focus: "Final touch-ups and lock-in.", tasks: [
      { title: "Glow facial 48h before event", type: "salon", duration_min: 60, priority: "high" },
      { title: "Final blow-dry & style", type: "salon", duration_min: 60, priority: "high" },
      { title: "Nails — gel finish", type: "salon", duration_min: 60, priority: "medium" },
    ], milestone: "Camera-ready, calm, on time." },
  ],
  pro_tips: [
    "Hydrate 3L/day from week 1 — visible by week 3.",
    "Skip new actives in the final 7 days.",
    "Photograph each week in the same light to track progress.",
  ],
};

export const LOOK_FALLBACK = {
  look_name: "Modern Editorial",
  aesthetic_summary: "A refined, magazine-cover finish — sculpted features, luminous skin, and a confident neutral palette that reads expensive in any light.",
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

export const INSIGHTS_FALLBACK = {
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
