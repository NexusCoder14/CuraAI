/**
 * Smart, input-aware Beauty Twin generator.
 * Runs as the fallback when GROQ_API_KEY is absent — but produces wildly different
 * personas based on the user's actual onboarding answers (not a single hardcoded twin).
 *
 * Algorithm:
 *   1. Score the profile across 5 style archetypes (minimal, glam, trend, classic, edgy)
 *      using weighted contributions from goals, styles, events, age, hair, budget.
 *   2. Add modifier bonuses from events (wedding → bridal radiance, corporate → powerhouse).
 *   3. Pick the winning persona from 14 candidates and assemble a matching twin object
 *      with tagline, summary, traits, palette, vibes, score, next action.
 */

const PERSONAS = {
  bridal_radiance: {
    persona: "Bridal Radiance",
    tagline: "Heirloom-quality glow, for the moment that matters most.",
    traits: ["Radiant", "Heirloom", "Timeless", "Ceremonial"],
    palette: ["#7c1d3f", "#f5d491", "#fef3c7", "#92400e"],
    vibes: ["Soft glam makeup", "Bridal updo", "Pre-bridal glow facial"],
    next: "Book a pre-bridal skin diagnostic at The Bridal Studio, Bandra.",
    dna: { minimal: 35, glam: 88, trend: 55, classic: 80, edgy: 18 },
  },
  modern_glam: {
    persona: "Modern Glam",
    tagline: "Polished, photographed, and entirely on your terms.",
    traits: ["Polished", "Magnetic", "Sculpted", "Confident"],
    palette: ["#1a1a2e", "#e879f9", "#fbcfe8", "#a78bfa"],
    vibes: ["Bronzed glow", "Glossy lip", "Sculpted lash lift"],
    next: "Try a bond gloss + makeup trial combo at BBlunt, Juhu.",
    dna: { minimal: 30, glam: 92, trend: 70, classic: 55, edgy: 45 },
  },
  luxury_minimalist: {
    persona: "Luxury Minimalist",
    tagline: "Quiet confidence, polished from within.",
    traits: ["Effortless", "Refined", "Intentional", "Modern"],
    palette: ["#0a0f24", "#c4b5fd", "#22d3ee", "#fde68a"],
    vibes: ["Glass skin", "Sculpted lob", "Soft sun-glow makeup"],
    next: "Lock in your signature with a monthly hydra-facial.",
    dna: { minimal: 90, glam: 40, trend: 50, classic: 70, edgy: 22 },
  },
  corporate_powerhouse: {
    persona: "Corporate Powerhouse",
    tagline: "The room reads you before you speak.",
    traits: ["Decisive", "Sharp", "Composed", "Authoritative"],
    palette: ["#111827", "#9ca3af", "#dbeafe", "#1d4ed8"],
    vibes: ["Sleek collarbone lob", "Bare-skin polish", "Architectural brow"],
    next: "Schedule a precision cut + keratin gloss at Toni & Guy, BKC.",
    dna: { minimal: 78, glam: 52, trend: 48, classic: 82, edgy: 28 },
  },
  bandra_bohemian: {
    persona: "Bandra Bohemian",
    tagline: "Beachside ease meets weekday creativity.",
    traits: ["Effortless", "Sun-warmed", "Lived-in", "Playful"],
    palette: ["#7c2d12", "#facc15", "#fed7aa", "#c2410c"],
    vibes: ["Beachy waves", "Bronze cheek", "Almond gel nails"],
    next: "Try a balayage + cut combo at BBlunt, Pali Naka.",
    dna: { minimal: 55, glam: 60, trend: 78, classic: 50, edgy: 58 },
  },
  trend_architect: {
    persona: "Trend Architect",
    tagline: "You don't follow the moment — you set it.",
    traits: ["Editorial", "Daring", "Curated", "Now"],
    palette: ["#0f172a", "#22d3ee", "#f472b6", "#a855f7"],
    vibes: ["Italian bob", "Graphic liner", "Chrome gel nails"],
    next: "Book a colorist consultation at Hakim's Aalim, Khar.",
    dna: { minimal: 28, glam: 75, trend: 95, classic: 25, edgy: 72 },
  },
  coastal_effortless: {
    persona: "Coastal Effortless",
    tagline: "Saltwater skin, sun-touched hair, zero performance.",
    traits: ["Sunlit", "Loose", "Tactile", "Unbothered"],
    palette: ["#0c4a6e", "#7dd3fc", "#fef3c7", "#a16207"],
    vibes: ["Beach waves", "Tinted SPF", "Cream blush"],
    next: "Add a weekly hair mask + monthly trim ritual.",
    dna: { minimal: 70, glam: 35, trend: 60, classic: 55, edgy: 30 },
  },
  k_beauty_glow: {
    persona: "K-Beauty Glow",
    tagline: "Glass skin discipline meets cinematic finish.",
    traits: ["Glossy", "Hydrated", "Soft-lit", "Layered"],
    palette: ["#fce7f3", "#a78bfa", "#fbbf24", "#0c0a09"],
    vibes: ["Dewy skin", "Tinted lip oil", "Straight glossy hair"],
    next: "Begin a 7-skin layering routine and book a hydra-facial.",
    dna: { minimal: 72, glam: 58, trend: 80, classic: 48, edgy: 22 },
  },
  edgy_avant: {
    persona: "Edgy Avant",
    tagline: "Hard edges, soft skin — a deliberate contrast.",
    traits: ["Sculpted", "Confrontational", "Architectural", "Cool"],
    palette: ["#000000", "#f43f5e", "#9333ea", "#27272a"],
    vibes: ["Sharp blunt bob", "Smoky liner", "Black mani"],
    next: "Try a graphic blunt cut at Hakim's Aalim, Khar.",
    dna: { minimal: 38, glam: 72, trend: 78, classic: 22, edgy: 92 },
  },
  classic_elegance: {
    persona: "Classic Elegance",
    tagline: "Timeless beats trending — always has.",
    traits: ["Composed", "Refined", "Cultivated", "Enduring"],
    palette: ["#7f1d1d", "#fef2f2", "#fde68a", "#1f2937"],
    vibes: ["Soft chignon", "Red lip", "French manicure"],
    next: "Book a signature facial and a classic blow-dry monthly.",
    dna: { minimal: 60, glam: 65, trend: 30, classic: 92, edgy: 18 },
  },
  wellness_radiance: {
    persona: "Wellness Radiance",
    tagline: "Glow built from sleep, water, and sunlight.",
    traits: ["Restored", "Grounded", "Luminous", "Mindful"],
    palette: ["#064e3b", "#86efac", "#fef3c7", "#0e7490"],
    vibes: ["Bare skin glow", "Scalp ritual", "Body oil massage"],
    next: "Book an aroma body massage + scalp ritual at Anoos Spa.",
    dna: { minimal: 78, glam: 32, trend: 45, classic: 65, edgy: 18 },
  },
  festive_maximalist: {
    persona: "Festive Maximalist",
    tagline: "Color, sparkle, story — turn it all the way up.",
    traits: ["Vivid", "Ornate", "Joyful", "Ceremonial"],
    palette: ["#7e22ce", "#f59e0b", "#dc2626", "#fbcfe8"],
    vibes: ["Kohl eyes", "Statement lip", "Gilded nails"],
    next: "Book a festive HD makeup trial + nail art combo.",
    dna: { minimal: 22, glam: 90, trend: 75, classic: 60, edgy: 55 },
  },
  groom_modern: {
    persona: "Modern Groom",
    tagline: "Sharp, considered, camera-ready.",
    traits: ["Precise", "Groomed", "Composed", "Modern"],
    palette: ["#1e293b", "#94a3b8", "#cbd5e1", "#0ea5e9"],
    vibes: ["Sharp fade", "Beard sculpt", "Clean facial"],
    next: "Book a master cut + beard shape at Hakim's Aalim.",
    dna: { minimal: 70, glam: 45, trend: 55, classic: 75, edgy: 35 },
  },
  trend_explorer: {
    persona: "Trend Explorer",
    tagline: "Curious, current, never copy-paste.",
    traits: ["Curious", "Open", "Iterative", "Modern"],
    palette: ["#1e1b4b", "#818cf8", "#fcd34d", "#f472b6"],
    vibes: ["Face-framing layers", "Cream blush", "Soft glazed nails"],
    next: "Try one new service this month — start with brow lamination.",
    dna: { minimal: 55, glam: 60, trend: 82, classic: 48, edgy: 42 },
  },
};

/** Score each persona based on the profile and return the best match. */
function scoreProfile(p) {
  const goals = (p.goals || []).map((s) => s.toLowerCase());
  const styles = (p.styles || []).map((s) => s.toLowerCase());
  const events = (p.events || []).map((s) => s.toLowerCase());
  const age = p.ageRange || "";
  const budget = p.budget || "";
  const hair = (p.hairType || "").toLowerCase();
  const skin = (p.skinType || "").toLowerCase();

  const has = (arr, needle) => arr.some((x) => x.includes(needle));

  const scores = {};
  for (const k of Object.keys(PERSONAS)) scores[k] = 0;

  // --- Event-driven boosts (strongest signal) ---
  if (has(events, "wedding") || has(events, "engagement") || has(goals, "bridal")) {
    scores.bridal_radiance += 50;
    scores.modern_glam += 20;
    scores.festive_maximalist += 15;
    scores.classic_elegance += 10;
  }
  if (has(events, "photoshoot")) {
    scores.modern_glam += 30;
    scores.trend_architect += 25;
    scores.edgy_avant += 15;
  }
  if (has(events, "festival")) {
    scores.festive_maximalist += 40;
    scores.bandra_bohemian += 15;
  }
  if (has(events, "vacation")) {
    scores.coastal_effortless += 40;
    scores.bandra_bohemian += 25;
    scores.wellness_radiance += 10;
  }
  if (has(events, "job interview") || has(goals, "corporate") || has(goals, "confidence")) {
    scores.corporate_powerhouse += 35;
    scores.luxury_minimalist += 15;
    scores.classic_elegance += 10;
  }
  if (has(events, "date night")) {
    scores.modern_glam += 25;
    scores.trend_architect += 15;
  }

  // --- Style preference boosts ---
  if (has(styles, "minimal")) { scores.luxury_minimalist += 30; scores.k_beauty_glow += 10; scores.corporate_powerhouse += 10; }
  if (has(styles, "glam")) { scores.modern_glam += 30; scores.festive_maximalist += 15; }
  if (has(styles, "editorial")) { scores.trend_architect += 30; scores.edgy_avant += 20; scores.modern_glam += 10; }
  if (has(styles, "bohemian")) { scores.bandra_bohemian += 35; scores.coastal_effortless += 15; }
  if (has(styles, "corporate")) { scores.corporate_powerhouse += 30; scores.classic_elegance += 10; }
  if (has(styles, "trend-forward") || has(styles, "trend forward")) { scores.trend_architect += 25; scores.trend_explorer += 25; }
  if (has(styles, "classic")) { scores.classic_elegance += 35; scores.luxury_minimalist += 10; }
  if (has(styles, "edgy")) { scores.edgy_avant += 35; scores.trend_architect += 15; }

  // --- Goal boosts ---
  if (has(goals, "glow")) { scores.k_beauty_glow += 20; scores.wellness_radiance += 15; scores.luxury_minimalist += 10; }
  if (has(goals, "hair")) { scores.coastal_effortless += 10; scores.trend_explorer += 10; }
  if (has(goals, "anti-aging") || has(goals, "anti aging")) { scores.classic_elegance += 20; scores.luxury_minimalist += 15; scores.wellness_radiance += 10; }
  if (has(goals, "daily routine")) { scores.wellness_radiance += 15; scores.luxury_minimalist += 15; }
  if (has(goals, "event ready")) { scores.modern_glam += 20; scores.festive_maximalist += 10; }

  // --- Age modifiers ---
  if (age.startsWith("18") || age.startsWith("25")) { scores.trend_architect += 8; scores.trend_explorer += 10; scores.k_beauty_glow += 8; }
  if (age.startsWith("33") || age.startsWith("41")) { scores.classic_elegance += 10; scores.luxury_minimalist += 10; }
  if (age.startsWith("50")) { scores.wellness_radiance += 15; scores.classic_elegance += 15; }

  // --- Budget modifiers ---
  if (budget.includes("Under") || budget.includes("3K")) { scores.trend_explorer += 8; scores.wellness_radiance += 5; }
  if (budget.includes("30K")) { scores.bridal_radiance += 10; scores.modern_glam += 10; scores.luxury_minimalist += 8; }

  // --- Hair / Skin nudges ---
  if (hair.includes("curl") || hair.includes("coily")) scores.bandra_bohemian += 10;
  if (hair.includes("colo")) scores.trend_architect += 8;
  if (skin.includes("oily") || skin.includes("acne")) scores.k_beauty_glow += 8;
  if (skin.includes("dry") || skin.includes("sensitive")) scores.wellness_radiance += 8;

  // Slight randomness so identical profiles still feel alive across sessions
  for (const k of Object.keys(scores)) scores[k] += Math.random() * 4;

  const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
  return sorted[0][0];
}

function calcScore(p) {
  let s = 60;
  if ((p.goals || []).length >= 2) s += 6;
  if ((p.styles || []).length >= 2) s += 6;
  if (p.budget?.includes("15K") || p.budget?.includes("30K")) s += 8;
  if (p.budget?.includes("Under")) s -= 4;
  if (p.skinType?.toLowerCase().includes("normal")) s += 6;
  if (p.skinType?.toLowerCase().includes("acne")) s -= 4;
  if (p.hairType?.toLowerCase().includes("thick") || p.hairType?.toLowerCase().includes("colo")) s += 4;
  s += Math.floor(Math.random() * 8);
  return Math.max(45, Math.min(96, s));
}

/** Build the human-readable summary using profile details for color. */
function buildSummary(profile, persona) {
  const goals = (profile.goals || []).slice(0, 2).join(" and ").toLowerCase();
  const style = (profile.styles?.[0] || "modern").toLowerCase();
  const skin = (profile.skinType || "").toLowerCase();
  const event = (profile.events || []).find((e) => e !== "Nothing big");

  let line1, line2;
  switch (persona.persona) {
    case "Bridal Radiance":
      line1 = `You're approaching ${event ? `your ${event.toLowerCase()}` : "your big day"} with intention — and CURA can see it in your answers.`;
      line2 = `Your signature blends ceremonial richness with skin that reads camera-ready under any light.`;
      break;
    case "Corporate Powerhouse":
      line1 = `You want your beauty to do work — and quietly. The brief is composure, polish, and zero maintenance debt.`;
      line2 = `Your signature is sharp framing, neutral skin, and rituals that survive a 14-hour day.`;
      break;
    case "Bandra Bohemian":
      line1 = `Your style answers point to lived-in ease — sun-touched hair, tactile makeup, nothing trying too hard.`;
      line2 = `You'd rather look like you woke up this way than like you booked an appointment.`;
      break;
    case "Trend Architect":
      line1 = `You're not browsing trends — you're auditioning them. CURA picked up a clear editorial eye in your answers.`;
      line2 = `Your signature is sharp, current, and unafraid of a strong silhouette or a saturated color.`;
      break;
    case "K-Beauty Glow":
      line1 = `Your priorities lean toward skin-first beauty — glass finish, layered hydration, soft features.`;
      line2 = `Your signature is dewy, glossy, and disciplined. Less makeup, more skincare.`;
      break;
    case "Luxury Minimalist":
      line1 = `You gravitate toward refined essentials — your answers signal restraint, intention, and longevity over trend.`;
      line2 = `Your signature reads expensive in any light because nothing about it is trying too hard.`;
      break;
    case "Modern Glam":
      line1 = `You're not afraid of a polished, sculpted finish — and your style answers confirm it.`;
      line2 = `Your signature is bronzed cheeks, a glossed lip, and skin that catches light from across the room.`;
      break;
    case "Coastal Effortless":
      line1 = `Sun, salt, ease — your answers map to a coastal sensibility built for Mumbai's climate.`;
      line2 = `Your signature is low-maintenance, lit-from-within, and impossible to overdo.`;
      break;
    case "Edgy Avant":
      line1 = `You favor strong silhouettes and high contrast — your answers tell CURA you're not here for "pretty."`;
      line2 = `Your signature is sculpted, deliberate, and reads as a statement before you even speak.`;
      break;
    case "Classic Elegance":
      line1 = `Your taste is timeless and resists noise — your answers point to legacy beauty, not trend cycles.`;
      line2 = `Your signature is a soft chignon, a true red, and skin that ages on your terms.`;
      break;
    case "Wellness Radiance":
      line1 = `Your priorities are restorative — sleep, water, sunlight, ritual. CURA respects that brief.`;
      line2 = `Your signature is bare-skin glow, gentle scalp work, and beauty that compounds quietly.`;
      break;
    case "Festive Maximalist":
      line1 = `You answered with color, occasion, and joy in mind — CURA reads you as gloriously maximal.`;
      line2 = `Your signature is kohl-rimmed eyes, statement lips, and a willingness to celebrate every detail.`;
      break;
    case "Modern Groom":
      line1 = `You want sharp, considered, and camera-ready — your answers map cleanly to that brief.`;
      line2 = `Your signature is a fresh fade, sculpted beard, and skin that reads rested without effort.`;
      break;
    case "Trend Explorer":
      line1 = `You're curious — your answers signal openness, iteration, and an appetite for one new service a month.`;
      line2 = `Your signature is still forming, and that's exactly the point. CURA will iterate with you.`;
      break;
    default:
      line1 = `Your profile points to ${goals || "a balanced beauty arc"} with a ${style} sensibility.`;
      line2 = `CURA will tune every recommendation to that direction.`;
  }
  if (skin.includes("oily") || skin.includes("combination")) {
    line2 += ` Your ${skin} skin is factored into every product call.`;
  } else if (skin.includes("dry") || skin.includes("sensitive")) {
    line2 += ` Your ${skin} skin means barrier-first routines, no aggressive actives.`;
  }
  return `${line1} ${line2}`;
}

export function generateSmartTwin(profile = {}) {
  const winnerKey = scoreProfile(profile);
  const p = PERSONAS[winnerKey];
  const score = calcScore(profile);

  return {
    persona: p.persona,
    tagline: p.tagline,
    summary: buildSummary(profile, p),
    signature_traits: p.traits,
    color_palette: p.palette,
    style_dna: {
      minimal: clamp(p.dna.minimal + jitter(8)),
      glam: clamp(p.dna.glam + jitter(8)),
      trend: clamp(p.dna.trend + jitter(8)),
      classic: clamp(p.dna.classic + jitter(8)),
      edgy: clamp(p.dna.edgy + jitter(8)),
    },
    recommended_vibes: p.vibes,
    beauty_score: score,
    next_best_action: p.next,
  };
}

function clamp(n) { return Math.max(5, Math.min(100, Math.round(n))); }
function jitter(range) { return Math.round((Math.random() - 0.5) * range); }
