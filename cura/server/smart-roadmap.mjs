/**
 * Smart, goal-aware Roadmap generator.
 * Parses the user's goal into a category, then assembles a week-by-week plan
 * from a library of phase-specific task pools. No two roadmaps are identical:
 * tasks are selected based on the category, days, and slight randomness so
 * re-running with the same goal produces variation but stays on-brief.
 */

const CATEGORIES = {
  wedding: {
    keys: ["wedding", "bridal", "shaadi", "engagement", "haldi", "mehendi", "sangeet", "marriage"],
    title: (d) => `${d}-Day Bridal Arc`,
    summary: "A staged bridal program — diagnostic, refinement, transformation, and reveal — calibrated to your day.",
    budget: (d) => ({ min: 12000 + d * 350, max: 28000 + d * 700 }),
    phases: ["Foundation", "Refinement", "Transformation", "Trial", "Reveal"],
    tasks: {
      Foundation: [
        { title: "Skin diagnostic + first hydra-facial", type: "salon", duration_min: 75, priority: "high" },
        { title: "Bond integrity test + scalp analysis", type: "consult", duration_min: 30, priority: "high" },
        { title: "Begin barrier-repair PM routine", type: "home", duration_min: 10, priority: "high" },
        { title: "Switch to sulphate-free shampoo + bond mask", type: "product", duration_min: 5, priority: "medium" },
        { title: "Hydration journal — track 3L water/day", type: "home", duration_min: 5, priority: "medium" },
        { title: "Iron + Vitamin D blood test", type: "consult", duration_min: 30, priority: "low" },
      ],
      Refinement: [
        { title: "Bond-repair hair gloss", type: "salon", duration_min: 90, priority: "high" },
        { title: "Brow lamination + shape + tint", type: "salon", duration_min: 60, priority: "high" },
        { title: "Lash lift + tint", type: "salon", duration_min: 60, priority: "medium" },
        { title: "Pre-bridal body polish", type: "salon", duration_min: 75, priority: "medium" },
        { title: "Begin Vitamin C serum AM", type: "product", duration_min: 5, priority: "medium" },
        { title: "Cuticle + nail prep ritual", type: "home", duration_min: 20, priority: "low" },
      ],
      Transformation: [
        { title: "Makeup trial with senior artist", type: "consult", duration_min: 120, priority: "high" },
        { title: "Hair trial — final updo decision", type: "consult", duration_min: 90, priority: "high" },
        { title: "Second hydra-facial — deeper exfoliation", type: "salon", duration_min: 75, priority: "high" },
        { title: "Saree-blouse fitting + makeup match", type: "consult", duration_min: 60, priority: "medium" },
        { title: "Photograph the trial in event lighting", type: "home", duration_min: 15, priority: "low" },
      ],
      Trial: [
        { title: "Full dress rehearsal + photo test", type: "consult", duration_min: 180, priority: "high" },
        { title: "Final hair color touch-up", type: "salon", duration_min: 90, priority: "high" },
        { title: "Lock signature lip + finalize palette", type: "consult", duration_min: 30, priority: "medium" },
        { title: "Stop all new actives — skin in cruise mode", type: "home", duration_min: 5, priority: "high" },
      ],
      Reveal: [
        { title: "Glow facial 48h before the event", type: "salon", duration_min: 60, priority: "high" },
        { title: "Bridal mehendi appointment", type: "salon", duration_min: 180, priority: "high" },
        { title: "Final blow-dry + style rehearsal", type: "salon", duration_min: 60, priority: "high" },
        { title: "Bridal manicure + pedicure", type: "salon", duration_min: 90, priority: "high" },
        { title: "8h sleep + full hydration day-before", type: "home", duration_min: 5, priority: "high" },
      ],
    },
    tips: [
      "Schedule the trial 2 weeks out — leaves room to refine.",
      "Skip any new active in the final 10 days. Skin in cruise mode wins.",
      "Photograph each week in the same window light to track progress.",
      "Hydration shows on camera. 3L water daily, starting week 1.",
    ],
  },

  glow: {
    keys: ["glow", "glow-up", "glow up", "radiant", "skin", "transform", "brighten", "dull"],
    title: (d) => `${d}-Day Radiance Reset`,
    summary: "A focused arc to restore the barrier, build glow, and lock in a sustainable skin signature.",
    budget: (d) => ({ min: 6000 + d * 200, max: 14000 + d * 400 }),
    phases: ["Reset", "Build", "Amplify", "Lock"],
    tasks: {
      Reset: [
        { title: "Skin diagnostic + barrier-repair facial", type: "salon", duration_min: 75, priority: "high" },
        { title: "Switch to gentle gel cleanser AM + PM", type: "product", duration_min: 5, priority: "high" },
        { title: "Add ceramide moisturizer PM", type: "product", duration_min: 5, priority: "high" },
        { title: "Lock in daily SPF 50 PA++++", type: "home", duration_min: 5, priority: "high" },
        { title: "Cut active acids for 7 days", type: "home", duration_min: 0, priority: "medium" },
      ],
      Build: [
        { title: "Begin niacinamide 5% AM", type: "product", duration_min: 5, priority: "high" },
        { title: "Hydra-facial — round 2", type: "salon", duration_min: 75, priority: "high" },
        { title: "Add Vitamin C serum AM (only after barrier calm)", type: "product", duration_min: 5, priority: "medium" },
        { title: "Weekly PHA toner pad night", type: "home", duration_min: 10, priority: "medium" },
        { title: "Begin gua sha — 5 min nightly", type: "home", duration_min: 10, priority: "low" },
      ],
      Amplify: [
        { title: "Introduce retinal 0.025% PM — 2x/week", type: "product", duration_min: 5, priority: "high" },
        { title: "LED light therapy session", type: "salon", duration_min: 45, priority: "medium" },
        { title: "Lactic acid mask Sunday night", type: "home", duration_min: 20, priority: "medium" },
        { title: "Face yoga — 5 min daily", type: "home", duration_min: 10, priority: "low" },
      ],
      Lock: [
        { title: "Final hydra-glow facial", type: "salon", duration_min: 75, priority: "high" },
        { title: "Photograph progress in the same window light", type: "home", duration_min: 10, priority: "low" },
        { title: "Lock the keeper routine — AM (4 steps) + PM (5 steps)", type: "home", duration_min: 5, priority: "high" },
      ],
    },
    tips: [
      "Glow is hydration + exfoliation + sleep. Cut shortcuts.",
      "Never layer 5 actives — your barrier pays the bill.",
      "Visible glow appears in week 3, not week 1. Stay the course.",
    ],
  },

  corporate: {
    keys: ["corporate", "office", "professional", "interview", "new job", "new role", "promotion", "polished"],
    title: (d) => `${d}-Day Corporate Polish`,
    summary: "Sharp framing, composed skin, and rituals that survive a 14-hour workday — built in stages.",
    budget: (d) => ({ min: 5000 + d * 180, max: 11000 + d * 360 }),
    phases: ["Audit", "Sharpen", "Sustain"],
    tasks: {
      Audit: [
        { title: "Precision cut consultation — collarbone lob or pro bob", type: "consult", duration_min: 45, priority: "high" },
        { title: "Color-band tone analysis for wardrobe", type: "consult", duration_min: 45, priority: "medium" },
        { title: "Skin diagnostic + barrier reset", type: "salon", duration_min: 60, priority: "high" },
        { title: "Lock in 4-step AM routine (cleanse → vit C → moisturize → SPF)", type: "home", duration_min: 8, priority: "high" },
      ],
      Sharpen: [
        { title: "Precision cut + keratin gloss", type: "salon", duration_min: 120, priority: "high" },
        { title: "Brow lamination + tint", type: "salon", duration_min: 60, priority: "high" },
        { title: "Gel manicure — clean almond shape", type: "salon", duration_min: 60, priority: "medium" },
        { title: "5-minute makeup mastery — tinted SPF + brow + blush + lip", type: "home", duration_min: 5, priority: "medium" },
      ],
      Sustain: [
        { title: "Monthly hydra-facial subscription", type: "salon", duration_min: 60, priority: "high" },
        { title: "6-weekly cut + gloss to maintain shape", type: "salon", duration_min: 90, priority: "medium" },
        { title: "Sunday hair mask + scalp ritual", type: "home", duration_min: 30, priority: "low" },
      ],
    },
    tips: [
      "Frame > makeup. Brows and a sharp cut do 80% of the work.",
      "Keep one signature lip and one signature scent. Calibration.",
      "Schedule beauty like a recurring meeting — it sticks.",
    ],
  },

  vacation: {
    keys: ["vacation", "holiday", "beach", "trip", "getaway", "honeymoon"],
    title: (d) => `${d}-Day Vacation Prep`,
    summary: "Low-maintenance glow that survives sun, salt, and chlorine — and reads great in photos.",
    budget: (d) => ({ min: 4000 + d * 150, max: 9000 + d * 300 }),
    phases: ["Prep", "Polish", "Pack"],
    tasks: {
      Prep: [
        { title: "Hair bond gloss + gentle balayage refresh", type: "salon", duration_min: 150, priority: "high" },
        { title: "Body polish + spray tan consultation", type: "salon", duration_min: 90, priority: "medium" },
        { title: "Switch to mineral SPF (reef-safe)", type: "product", duration_min: 5, priority: "high" },
      ],
      Polish: [
        { title: "Lash lift + tint — wakes up with you", type: "salon", duration_min: 60, priority: "high" },
        { title: "Brow shape — minimal upkeep needed", type: "salon", duration_min: 30, priority: "medium" },
        { title: "Gel pedicure + neutral mani", type: "salon", duration_min: 90, priority: "medium" },
      ],
      Pack: [
        { title: "Travel skincare kit — 4 essentials only", type: "home", duration_min: 15, priority: "medium" },
        { title: "Pack: tinted SPF, mascara, lip balm, hair oil", type: "home", duration_min: 10, priority: "high" },
        { title: "Hair silk scarf + leave-in conditioner travel size", type: "product", duration_min: 5, priority: "low" },
      ],
    },
    tips: [
      "Lash lift + tint = vacation cheat code. Wake up done.",
      "Reapply SPF every 90 min in the sun. No exceptions.",
      "Pack a satin scrunchie. Your hair will thank you.",
    ],
  },

  hair: {
    keys: ["hair", "haircut", "color", "balayage", "blonde", "thinning", "hair fall"],
    title: (d) => `${d}-Day Hair Transformation`,
    summary: "A staged hair arc — diagnose, treat, transform, maintain — for visible change without damage.",
    budget: (d) => ({ min: 5500 + d * 220, max: 12000 + d * 450 }),
    phases: ["Diagnose", "Treat", "Transform", "Maintain"],
    tasks: {
      Diagnose: [
        { title: "Scalp + hair density consultation", type: "consult", duration_min: 45, priority: "high" },
        { title: "Begin scalp serum (redensyl/procapil) 3x/week", type: "product", duration_min: 5, priority: "high" },
        { title: "Filter shower head (Kent / AquaBliss)", type: "product", duration_min: 30, priority: "medium" },
      ],
      Treat: [
        { title: "Bond-repair hair gloss (Olaplex No.3)", type: "salon", duration_min: 90, priority: "high" },
        { title: "Begin rosemary water rinse 2x/week", type: "home", duration_min: 10, priority: "medium" },
        { title: "Weekly deep-conditioning mask", type: "home", duration_min: 30, priority: "medium" },
        { title: "Switch to sulphate-free shampoo", type: "product", duration_min: 5, priority: "high" },
      ],
      Transform: [
        { title: "Precision cut + layered shape", type: "salon", duration_min: 90, priority: "high" },
        { title: "Color: balayage or face-framing", type: "salon", duration_min: 180, priority: "high" },
        { title: "Keratin gloss for finish", type: "salon", duration_min: 120, priority: "medium" },
      ],
      Maintain: [
        { title: "6-weekly trim ritual", type: "salon", duration_min: 60, priority: "medium" },
        { title: "Olaplex No.3 every 2 weeks at home", type: "home", duration_min: 30, priority: "high" },
        { title: "Silk pillowcase swap", type: "product", duration_min: 5, priority: "low" },
      ],
    },
    tips: [
      "Hair fall: filter + protein + sleep. In that order.",
      "Color is 30% the salon, 70% the aftercare.",
      "Heat above 150°C kills bond integrity. Use heat protectant always.",
    ],
  },

  date: {
    keys: ["date", "date night", "dinner", "evening", "occasion"],
    title: (d) => `${d}-Day Date Night Prep`,
    summary: "A short, sharp arc to peak on the night — polished hair, lit skin, signature finish.",
    budget: (d) => ({ min: 3500 + d * 100, max: 7500 + d * 250 }),
    phases: ["Polish", "Peak"],
    tasks: {
      Polish: [
        { title: "Hydra-facial — 5 days before", type: "salon", duration_min: 60, priority: "high" },
        { title: "Brow shape + tint", type: "salon", duration_min: 45, priority: "high" },
        { title: "Lash lift OR mascara mastery practice", type: "salon", duration_min: 60, priority: "medium" },
        { title: "Gel manicure — short almond", type: "salon", duration_min: 60, priority: "medium" },
      ],
      Peak: [
        { title: "Blow-dry day-of", type: "salon", duration_min: 60, priority: "high" },
        { title: "Skin tint + cream blush rehearsal", type: "home", duration_min: 15, priority: "high" },
        { title: "Final signature lip pick", type: "home", duration_min: 5, priority: "medium" },
      ],
    },
    tips: [
      "Hydra-facial 5 days out — skin peaks on day 3.",
      "Don't experiment day-of. Rehearse 48h before.",
      "Less is more in evening light. Trust the glow.",
    ],
  },
};

const DEFAULT = {
  title: (d) => `${d}-Day Beauty Plan`,
  summary: "A balanced arc to refine your signature, build new rituals, and arrive at week-end feeling intentional.",
  budget: (d) => ({ min: 5000 + d * 150, max: 11000 + d * 350 }),
  phases: ["Foundation", "Refinement", "Polish", "Lock"],
  tasks: {
    Foundation: [
      { title: "Hydra-facial diagnostic", type: "salon", duration_min: 75, priority: "high" },
      { title: "Begin barrier-repair PM routine", type: "home", duration_min: 10, priority: "high" },
      { title: "Switch to ceramide moisturizer", type: "product", duration_min: 5, priority: "medium" },
    ],
    Refinement: [
      { title: "Bond-repair hair gloss", type: "salon", duration_min: 90, priority: "high" },
      { title: "Brow lamination + shape", type: "salon", duration_min: 45, priority: "medium" },
      { title: "Cuticle + nail prep ritual", type: "home", duration_min: 20, priority: "low" },
    ],
    Polish: [
      { title: "Lash lift + tint", type: "salon", duration_min: 60, priority: "medium" },
      { title: "Color analysis session", type: "consult", duration_min: 45, priority: "low" },
      { title: "Practice 12-min everyday face", type: "home", duration_min: 15, priority: "medium" },
    ],
    Lock: [
      { title: "Final glow facial", type: "salon", duration_min: 60, priority: "high" },
      { title: "Signature blow-dry rehearsal", type: "salon", duration_min: 60, priority: "high" },
      { title: "Gel manicure for finish", type: "salon", duration_min: 60, priority: "medium" },
    ],
  },
  tips: [
    "Track water daily — 3L moves the needle on skin in 3 weeks.",
    "Skip new actives in the final 7 days of any arc.",
    "Photograph the journey weekly in the same light.",
  ],
};

const MILESTONES = {
  Foundation: ["Skin reads calm, hydrated, even.", "Routine is locked — you don't have to think.", "Barrier is restored."],
  Reset: ["Barrier feels strong, skin no longer reactive.", "AM routine takes under 4 minutes."],
  Build: ["Tone evens out, glow starts showing.", "Routine is steady, no flare-ups."],
  Amplify: ["Visible radiance — others start noticing.", "Skin texture refined, makeup glides."],
  Lock: ["Signature is yours, repeatable in 15 minutes.", "Camera-ready in any light."],
  Refinement: ["Frame is sharp — hair, brows, hands.", "You feel pulled-together without thinking."],
  Transformation: ["You can recreate the look in 20 minutes.", "Trial photos confirm the direction."],
  Trial: ["Look is final, signature locked.", "Dress rehearsal complete."],
  Reveal: ["Camera-ready, calm, on time.", "Glow visible across the room."],
  Polish: ["Daily face is 12 minutes flat.", "Hair holds shape between washes."],
  Audit: ["You know exactly what you're tuning.", "Baseline photos and notes captured."],
  Sharpen: ["Cut + brows + nails — frame is unmistakable.", "Wardrobe palette is locked."],
  Sustain: ["Beauty is on autopilot — calendar does the work.", "Nothing slips between sessions."],
  Prep: ["Hair + skin are vacation-ready.", "Packing list is complete."],
  Peak: ["You peak on the night — exactly as planned.", "Signature is unmistakable."],
  Diagnose: ["You know your hair's true baseline.", "Treatment plan is locked."],
  Treat: ["Scalp inflammation down, shine returns.", "Bond integrity measurably better."],
  Maintain: ["Hair holds its shape between salon visits.", "Color stays true for 8+ weeks."],
};

// Order matters: more specific categories first.
// "hair transformation" must match `hair`, not `glow` (because of "transform").
const CATEGORY_ORDER = ["wedding", "corporate", "vacation", "hair", "date", "glow"];

function pickCategory(goal) {
  const g = (goal || "").toLowerCase();
  for (const name of CATEGORY_ORDER) {
    const def = CATEGORIES[name];
    if (def?.keys.some((k) => g.includes(k))) return { name, def };
  }
  return { name: "default", def: DEFAULT };
}

function pick(arr, n) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a.slice(0, n);
}

export function generateSmartRoadmap(goal, days = 30, profile = {}) {
  const total_weeks = Math.max(1, Math.min(12, Math.ceil(Number(days) / 7)));
  const { def } = pickCategory(goal);

  // Cycle through phases for as many weeks as we have.
  const weeks = [];
  for (let w = 1; w <= total_weeks; w++) {
    const phase = def.phases[Math.min(w - 1, def.phases.length - 1)];
    const taskCount = 3 + Math.floor(Math.random() * 2); // 3 or 4 tasks
    const tasks = pick(def.tasks[phase] ?? [], taskCount);
    const milestones = MILESTONES[phase] ?? ["Phase complete."];
    weeks.push({
      week: w,
      phase,
      focus: `${phaseFocus(phase, goal, profile)}`,
      tasks,
      milestone: milestones[Math.floor(Math.random() * milestones.length)],
    });
  }

  // Personalize tips slightly based on profile.
  let tips = [...def.tips];
  if (profile?.skinType?.toLowerCase()?.includes("oily")) {
    tips.push("Your oily skin: blot, don't strip. Niacinamide stays in the routine.");
  } else if (profile?.skinType?.toLowerCase()?.includes("dry")) {
    tips.push("Your dry skin: ceramide cream on damp skin doubles absorption.");
  }
  if (profile?.hairType?.toLowerCase()?.includes("curl")) {
    tips.push("Your curls: co-wash mid-week, never brush dry. Diffuse on low.");
  }

  return {
    title: def.title(Number(days)),
    summary: def.summary,
    total_weeks,
    estimated_budget_inr: def.budget(Number(days)),
    weeks,
    pro_tips: tips.slice(0, 4),
  };
}

function phaseFocus(phase, goal, profile) {
  const base = {
    Foundation: "Reset the canvas — diagnostic, hydration, barrier repair.",
    Reset: "Strip back to essentials and rebuild the barrier.",
    Build: "Layer in active ingredients carefully, build glow.",
    Amplify: "Push the glow with retinoids, LED, and ritual.",
    Lock: "Make the new signature repeatable in under 15 minutes.",
    Refinement: "Sharpen the frame — hair, brows, hands.",
    Transformation: "Trial the signature look, photograph, refine.",
    Trial: "Full dress rehearsal — everything as it'll be on the day.",
    Reveal: "Final touch-ups and lock-in for the big day.",
    Polish: "Add the high-impact 30-min upgrades.",
    Audit: "Baseline everything — cut, color, skin, routine.",
    Sharpen: "Execute the sharper version of your current signature.",
    Sustain: "Lock the recurring rituals so beauty runs on autopilot.",
    Prep: "Pre-trip hair + skin foundation.",
    Peak: "Day-of choreography — peak when it counts.",
    Diagnose: "Understand the hair's true baseline.",
    Treat: "Active treatment — bond repair, scalp care.",
    Maintain: "Lock the long-term ritual.",
  };
  return base[phase] ?? "Move the plan forward.";
}
