import { getGroq, GROQ_MODELS, hasGroq } from "./groq";
import { SYSTEM_AGENT } from "./prompts";

export type ChatMessage = { role: "user" | "assistant" | "system"; content: string };

export async function* streamChat(
  messages: ChatMessage[],
  twinContext?: Record<string, unknown>
): AsyncGenerator<string> {
  if (!hasGroq()) {
    // Demo-mode fallback: simulate a thoughtful streaming response.
    const reply = demoReply(messages, twinContext);
    for (const chunk of chunkString(reply, 5)) {
      await new Promise((r) => setTimeout(r, 14));
      yield chunk;
    }
    return;
  }

  const client = getGroq();
  const sys = twinContext
    ? `${SYSTEM_AGENT}\n\nUser BeautyTwin context:\n${JSON.stringify(twinContext)}`
    : SYSTEM_AGENT;

  const stream = await client.chat.completions.create({
    model: GROQ_MODELS.fast,
    temperature: 0.7,
    max_tokens: 700,
    stream: true,
    messages: [{ role: "system", content: sys }, ...messages],
  });

  for await (const part of stream) {
    const delta = part.choices?.[0]?.delta?.content ?? "";
    if (delta) yield delta;
  }
}

function chunkString(s: string, size: number): string[] {
  const out: string[] = [];
  for (let i = 0; i < s.length; i += size) out.push(s.slice(i, i + size));
  return out;
}

/* ============================================================
   DEMO RESPONSE ENGINE
   A keyword-rich, conversation-aware fallback that handles any
   beauty question. Used when GROQ_API_KEY is not configured.
   ============================================================ */

type Topic = {
  match: RegExp;
  reply: (ctx: { input: string; turn: number; persona?: string }) => string;
};

const TOPICS: Topic[] = [
  // Weddings / events
  {
    match: /\b(weddings?|bridal|shaadi|sangeet|haldi|mehendi|reception|engagement)\b/i,
    reply: ({ turn }) =>
      `Beautiful — let's design your bridal arc. ✨\n\n` +
      `A 30–45 day runway lets us layer treatments without rushing:\n\n` +
      `- **Week 1:** Skin diagnostic + first hydra-facial at **The Bridal Studio, Bandra** (~₹3,500–5,500)\n` +
      `- **Week 2:** Bond-repair hair gloss at **Hakim's Aalim, Khar**\n` +
      `- **Week 3:** Makeup trial + lash lift + brow lamination\n` +
      `- **Week 4:** Final glow facial, gel nails, blow-dry rehearsal\n\n` +
      (turn > 1
        ? `Want me to also block buffer days for any reactions, or add a pre-bridal body polish?`
        : `Want me to convert this into a full **Beauty Roadmap** with reminders?`),
  },

  // Salons by area
  {
    match: /\b(salon|parlour|parlor|near|bandra|juhu|powai|andheri|bkc|worli|khar|lower parel|colaba|malad|goregaon)\b/i,
    reply: ({ input }) => {
      const area = (input.match(/\b(bandra|juhu|powai|andheri|bkc|worli|khar|lower parel|colaba|malad|goregaon)\b/i) || [, "Mumbai"])[1];
      const map: Record<string, string[]> = {
        bandra: ["**Lakmé Salon, Linking Road** — modern glam, reliable.", "**The Bridal Studio, Pali Hill** — pre-bridal expertise.", "**BBlunt, Pali Naka** — editorial cuts."],
        juhu: ["**BBlunt, Juhu Tara** — best cuts in the area.", "**Hakim's Aalim** — celebrity stylists.", "**Anoos Spa** — relaxing body rituals."],
        powai: ["**Lakmé Salon, Hiranandani** — everyday polished.", "**Enrich Salon, Powai Plaza** — strong color work.", "**BBlunt, Galleria** — trend-forward."],
        andheri: ["**Anoos Salon, Lokhandwala** — wellness focus.", "**Jean-Claude Biguine** — French finesse.", "**Enrich Salon, 7 Bungalows**."],
        bkc: ["**Toni & Guy, BKC** — international precision.", "**Jean-Claude Biguine, BKC** — premium spa.", "**Lakmé Absolute Salon**."],
        worli: ["**Page 3 Salon, Sea Face** — quick polish.", "**Bodycraft Spa** — relaxing rituals.", "**Looks Salon, Worli**."],
        khar: ["**Hakim's Aalim** — flagship celebrity studio.", "**BBlunt, Linking Road**.", "**Enrich Salon, 16th Road**."],
        "lower parel": ["**SkinLab Clinic, Kamala Mills** — medi-facials.", "**Toni & Guy, Palladium** — precision.", "**Bodycraft, Phoenix**."],
      };
      const picks = map[area.toLowerCase()] ?? [
        "**Lakmé Salon (multiple locations)** — modern glam.",
        "**BBlunt** — editorial cuts.",
        "**SkinLab Clinic, Lower Parel** — skin-first.",
      ];
      return (
        `Here are 3 ${area.charAt(0).toUpperCase() + area.slice(1)} picks aligned with your style:\n\n- ${picks.join("\n- ")}\n\n` +
        `Open the **Salon Matchmaker** for compatibility scores against your Beauty Twin?`
      );
    },
  },

  // Skin / skincare general
  {
    match: /\b(skincare|skin care|routine|cleanser|moisturizer|moisturiser|spf|sunscreen|toner|serum)\b/i,
    reply: () =>
      `For Mumbai's humidity, a **lightweight, barrier-first** routine wins:\n\n` +
      `**AM**\n` +
      `- Gentle gel cleanser (Cetaphil / La Roche-Posay Toleriane)\n` +
      `- Niacinamide 5% serum — controls oil, evens tone\n` +
      `- Lightweight moisturizer + **SPF 50 PA++++** (non-negotiable)\n\n` +
      `**PM**\n` +
      `- Oil cleanse → water-based cleanse (double cleanse)\n` +
      `- Hydrating toner (PHA or hyaluronic)\n` +
      `- Active 2–3x/week: retinal or AHA — never both same night\n` +
      `- Ceramide-rich moisturizer to seal\n\n` +
      `Want a **30-day skin roadmap** built around this?`,
  },

  // Acne
  {
    match: /\b(acne|pimples?|breakouts?|whiteheads?|blackheads?|congested|zits?)\b/i,
    reply: () =>
      `Acne in Mumbai usually has 3 triggers: **humidity-clogged pores, occlusive sunscreen, and sweat under masks.** Try this for 4 weeks:\n\n` +
      `- **Cleanse:** salicylic 2% face wash 1x/day (CeraVe SA / Minimalist)\n` +
      `- **Treat:** adapalene 0.1% PM, pea-sized for entire face (not spot)\n` +
      `- **Hydrate:** oil-free gel moisturizer (Neutrogena Hydro Boost)\n` +
      `- **Protect:** mineral SPF 50 (ISDIN Fusion Fluid / Re'equil)\n\n` +
      `Skip: scrubs, layering 5 actives, "natural" face oils on active acne.\n\n` +
      `If cystic — a single **derm consult at SkinLab, Lower Parel** is worth it. Want me to book one?`,
  },

  // Anti-aging
  {
    match: /\b(anti.?aging|wrinkle|fine line|sagging|botox|filler|collagen|elastin)\b/i,
    reply: () =>
      `Three pillars actually move the needle on aging skin:\n\n` +
      `1. **Daily SPF 50** — single biggest factor. Reapply at lunch.\n` +
      `2. **Retinoid at night** — start 0.025% retinal 2x/week, ramp up over 6 weeks.\n` +
      `3. **Peptides + Vitamin C AM** — Medik8 C-Tetra or The Ordinary Argireline.\n\n` +
      `In-clinic: **Hydra-facial monthly**, microneedling quarterly (SkinLab or Kaya). Botox/filler is a personal call — start subtle, find a trusted derm, never a salon.\n\n` +
      `Want a personalized **anti-aging roadmap** by decade?`,
  },

  // Glow up
  {
    match: /\b(glow|glow.?up|radiant|brighten|dull)\b/i,
    reply: () =>
      `Glow is mostly **hydration + exfoliation + sleep.** A 21-day reset:\n\n` +
      `- **Daily:** 3L water, 10mg Vit C serum AM, ceramide cream PM\n` +
      `- **Weekly:** Lactic acid mask (Sundays), face massage with gua sha (3x)\n` +
      `- **Monthly:** One hydra-facial — visible glow for 10 days\n` +
      `- **Lifestyle:** 7h sleep, cut refined sugar, walk 8K steps\n\n` +
      `Bonus: **face yoga 5 min/day** lifts cheek tone in 4 weeks. Want a full 30-day glow roadmap?`,
  },

  // Hair fall
  {
    match: /\b(hair fall|hair loss|thin(ning)? hair|bald|baldness|alopecia)\b/i,
    reply: () =>
      `Hair fall in Mumbai is often **water hardness + protein deficit + scalp inflammation**. A 90-day plan:\n\n` +
      `- **Filter your shower head** (Kent / AquaBliss) — biggest single change\n` +
      `- **Scalp serum** with redensyl/procapil 3x/week (Minimalist 03%)\n` +
      `- **Rosemary water** rinse 2x/week — clinically comparable to minoxidil 2%\n` +
      `- **Protein:** 1g per kg bodyweight daily. Iron + Vit D test recommended.\n` +
      `- **Avoid:** tight ponytails, heat styling >150°C, sulphate shampoos\n\n` +
      `If clumps in the shower drain — see a trichologist (Dr. Batra's / RichFeel). Want me to add scalp treatments to your roadmap?`,
  },

  // Hair color
  {
    match: /\b(color|colour|highlights|balayage|ombre|blonde|brunette|red|copper|grey)\b/i,
    reply: () =>
      `For Mumbai sun + chlorine + saltwater, color needs serious aftercare:\n\n` +
      `- **First choice:** balayage or face-framing — grows out cleanest (~₹6,500–9,500 at BBlunt)\n` +
      `- **Bold:** copper or cinnamon brunette suit Indian skin tones in any light\n` +
      `- **Aftercare:** sulphate-free shampoo (L'Oréal Vitamino Color), purple shampoo 1x/week if blonde, **bond builder** (Olaplex No.3) every 2 weeks\n\n` +
      `Book a consultation first — most colorists are happy to talk through tone options before scheduling. Want me to match you with a colorist?`,
  },

  // Hairstyle / cut
  {
    match: /\b(haircut|hairstyles?|cut|trim|fringe|bangs|lob|bob|layers|length)\b/i,
    reply: ({ input }) => {
      const corporate = /\b(corporate|office|professional|interview|work)\b/i.test(input);
      if (corporate) {
        return (
          `For a corporate look, three styles read **competent + modern**:\n\n` +
          `1. **Collarbone lob** with subtle face-framing layers — polished, low maintenance\n` +
          `2. **Sleek mid-back with curtain bangs** — softens features, works in heat\n` +
          `3. **Sharp shoulder bob** — high-impact for leadership presence\n\n` +
          `Pair with a **monthly blow-dry** and a keratin gloss every 3 months for camera-ready finish. Want salon recommendations near your office?`
        );
      }
      return (
        `Three timeless cuts worth considering:\n\n` +
        `- **Modern shag** — adds movement, fits wavy/curly hair\n` +
        `- **Italian bob** — chin-length, very on-trend, easy daily styling\n` +
        `- **Layered lob** — works for almost any face shape\n\n` +
        `Tell me your face shape and current length and I'll narrow it to one.`
      );
    },
  },

  // Makeup looks
  {
    match: /\b(makeup|make.?up|lipstick|eyeshadow|liner|mascara|foundation|concealer|contour|blush)\b/i,
    reply: () =>
      `A modern Indian everyday face in 6 steps (under 12 minutes):\n\n` +
      `1. **Skin tint** (Charlotte Tilbury / Smashbox Halo) — never full coverage in humidity\n` +
      `2. **Cream blush** on cheekbones (Rare Beauty / Tira) — pinch + tap\n` +
      `3. **Bronzer** lightly around hairline + jaw\n` +
      `4. **Brow gel** — frame is everything\n` +
      `5. **Mascara** — one coat top lashes only\n` +
      `6. **Lip + cheek tint** for cohesion\n\n` +
      `Going out? Add **cat-eye liner** and a **glossy nude**. Want a look blueprint for a specific occasion?`,
  },

  // Brows / lashes
  {
    match: /\b(brows?|eyebrows?|lash|lashes|threading|lamination|extensions|tint)\b/i,
    reply: () =>
      `**Brow lamination + tint** is the single highest-impact 30-min upgrade. Sets brows for 6–8 weeks, makes the face look more rested.\n\n` +
      `- **Lamination + shape + tint:** ~₹1,500–2,800 at BBlunt or Lakmé\n` +
      `- **Lash lift + tint:** ~₹2,000–3,500 — feels like mascara without makeup\n` +
      `- **Classic lash extensions:** ~₹3,500–6,000, refill every 3 weeks\n\n` +
      `Pro tip: never get both done in one sitting — your eyes need a break. Want me to add one to your roadmap?`,
  },

  // Nails
  {
    match: /\b(nails?|manicure|pedicure|gel polish|acrylics?|cuticles?)\b/i,
    reply: () =>
      `For Mumbai's monsoon and AC-heavy offices, gel manicures with a **strengthening base** outlast everything else (3 weeks easy).\n\n` +
      `- **Gel manicure:** ₹1,500–2,500 (Lakmé, The Nail Lounge, Iris)\n` +
      `- **Spa pedicure:** ₹1,200–1,800 — once a month, non-negotiable for sandal season\n` +
      `- **At home:** cuticle oil nightly (Sally Hansen), gentle file (never saw back-and-forth)\n\n` +
      `Trending shapes for 2026: **soft almond** and **short squoval**. Avoid stiletto unless you type with knuckles.`,
  },

  // Diet / wellness
  {
    match: /\b(diet|nutrition|food|eat|water|hydration|sleep|exercise|workout|stress)\b/i,
    reply: () =>
      `Beauty results plateau without these basics — they're the unsexy 80%:\n\n` +
      `- **Water:** 3L/day. Most "dull skin" is dehydration.\n` +
      `- **Protein:** 1–1.2g per kg bodyweight. Hair, nails, collagen all depend on it.\n` +
      `- **Omega-3:** 1g daily (fish oil / flaxseed) — visible skin lipid improvement in 6 weeks.\n` +
      `- **Sleep:** 7–9h. Your skin only repairs between 11pm–3am.\n` +
      `- **Walk:** 8K+ steps. Lymph drainage = clearer skin.\n` +
      `- **Cut:** refined sugar, dairy if acne-prone, alcohol 2 days before any event.\n\n` +
      `Want a weekly tracker added to your dashboard?`,
  },

  // Budget / pricing
  {
    match: /\b(budget|price|cost|cheap|affordable|expensive|how much)\b/i,
    reply: () =>
      `Rough Mumbai pricing for common services (premium salons):\n\n` +
      `- **Haircut:** ₹1,200–6,000\n` +
      `- **Hair color/balayage:** ₹3,500–12,000\n` +
      `- **Hydra-facial:** ₹2,500–6,500\n` +
      `- **Bridal makeup:** ₹15,000–60,000\n` +
      `- **Gel manicure:** ₹1,500–2,500\n` +
      `- **Brow lamination + tint:** ₹1,500–2,800\n\n` +
      `A realistic **monthly maintenance** budget for a polished look: ₹4,000–8,000. Pre-event months: 2–3x that. Want me to build a budget-aware roadmap?`,
  },

  // Korean / glass skin
  {
    match: /\b(korean|k.?beauty|glass skin|japanese|j.?beauty)\b/i,
    reply: () =>
      `**Glass skin** is achievable — it's hydration layered like glaze:\n\n` +
      `1. **Double cleanse** (oil → gel)\n` +
      `2. **Toner pad** with PHA (Cosrx / Beauty of Joseon)\n` +
      `3. **Essence** patted in 7 times (the "7-skin method")\n` +
      `4. **Hyaluronic + niacinamide serum**\n` +
      `5. **Snail mucin or rice cream** to lock\n` +
      `6. AM: **Beauty of Joseon Rice SPF**\n\n` +
      `Allow 6–8 weeks of consistency. Pair with **monthly hydra-facials** for compounding. Want a full K-beauty roadmap?`,
  },

  // Greeting
  {
    match: /^(hi|hello|hey|namaste|yo|sup|good (morning|evening|afternoon))\b/i,
    reply: ({ persona }) =>
      persona
        ? `Hi! I have your **${persona}** persona loaded — ready to plan. Tell me what we're working on: a wedding, a glow-up, a new hairstyle, a Mumbai salon you're curious about, or anything else.`
        : `Hi! I'm **CURA** — your AI Beauty Concierge. Ask me about skin, hair, salons, weddings, looks, routines, ingredients — anything beauty. For full personalization, create your **Beauty Twin** in 60 seconds.`,
  },

  // Thanks
  {
    match: /\b(thank|thanks|thx|ty)\b/i,
    reply: () =>
      `Anytime. Want me to **save this to your roadmap** or **find a salon** that fits what we discussed?`,
  },

  // Who are you
  {
    match: /\b(who are you|what are you|what can you do|help|capabilities)\b/i,
    reply: () =>
      `I'm **CURA**, an AI Beauty Operating System. I can:\n\n` +
      `- **Chat** through any skin, hair, makeup, or styling question\n` +
      `- Build your **Beauty Twin** — a living style persona\n` +
      `- Generate **week-by-week roadmaps** for any goal\n` +
      `- **Match you** with Mumbai salons based on compatibility (not search)\n` +
      `- Explore **looks** from one sentence ("Modern Bollywood elegance")\n` +
      `- Track **insights** — your beauty score, strengths, trending picks\n\n` +
      `What would you like to start with?`,
  },
];

// Generic, varied fallbacks for unmatched queries — never the same twice.
const GENERIC_REPLIES = [
  (q: string) =>
    `Good question. Let me think about "${trim(q)}" through your beauty lens.\n\n` +
    `The best answers usually combine three things: **what suits your features**, **what fits your lifestyle**, and **what you can maintain weekly**. ` +
    `Tell me a bit more — your hair/skin type, the occasion, or the vibe you're going for — and I'll get specific. ` +
    `If you'd rather, I can also generate a full **Look Blueprint** or **Roadmap** around this.`,
  (q: string) =>
    `Interesting — "${trim(q)}" can go a few directions. Quick clarifiers:\n\n` +
    `- Is this for an **everyday upgrade** or a **specific event**?\n` +
    `- What's your **time horizon** — a week, a month, longer?\n` +
    `- What's your **comfort zone** — minimal, glam, editorial?\n\n` +
    `Answer any one and I'll get tactical.`,
  (q: string) =>
    `Let's break "${trim(q)}" down into something actionable:\n\n` +
    `- **Today:** one quick win you can do at home\n` +
    `- **This week:** one salon-grade upgrade\n` +
    `- **This month:** one transformation milestone\n\n` +
    `Tell me your starting point and I'll fill in the specifics — or I can build a full **Beauty Roadmap** if you give me a goal and timeline.`,
];

function trim(s: string, max = 60) {
  return s.length > max ? s.slice(0, max - 1).trim() + "…" : s;
}

function demoReply(messages: ChatMessage[], twin?: Record<string, unknown>): string {
  const lastUser = [...messages].reverse().find((m) => m.role === "user");
  const input = lastUser?.content ?? "";
  const turn = messages.filter((m) => m.role === "user").length;
  const persona = (twin?.persona as string) ?? undefined;

  // Find the best matching topic
  for (const topic of TOPICS) {
    if (topic.match.test(input)) return topic.reply({ input, turn, persona });
  }

  // Conversation-aware generic reply: rotate based on turn number so users
  // never see the same generic answer twice in a session.
  const idx = (turn - 1) % GENERIC_REPLIES.length;
  return GENERIC_REPLIES[idx](input || "your question");
}
