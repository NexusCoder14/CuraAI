import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";
import fs from "node:fs";
import { streamChat } from "./chat.mjs";
import { generateJSON } from "./json.mjs";
import { PERSONA_PROMPT, ROADMAP_PROMPT, MATCH_PROMPT, LOOK_PROMPT, INSIGHTS_PROMPT } from "./prompts.mjs";
import { LOOK_FALLBACK, INSIGHTS_FALLBACK } from "./fallbacks.mjs";
import { generateSmartTwin } from "./smart-twin.mjs";
import { generateSmartRoadmap } from "./smart-roadmap.mjs";
import { hasGroq } from "./groq.mjs";
import { SALONS } from "./salons.mjs";

// Load .env if present (no extra dep)
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.resolve(__dirname, "../.env");
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, "utf8").split("\n")) {
    const m = line.match(/^\s*([A-Z_][A-Z0-9_]*)\s*=\s*(.*)\s*$/i);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^['"]|['"]$/g, "");
  }
}

const app = express();
app.use(express.json({ limit: "1mb" }));

/* -------- API -------- */

app.post("/api/chat", async (req, res) => {
  const { messages = [], twin } = req.body ?? {};
  res.setHeader("Content-Type", "text/plain; charset=utf-8");
  res.setHeader("Cache-Control", "no-cache, no-transform");
  res.setHeader("X-Accel-Buffering", "no");
  try {
    for await (const chunk of streamChat(messages, twin)) res.write(chunk);
  } catch (e) {
    res.write("\n[error] " + String(e));
  } finally {
    res.end();
  }
});

// Beauty Twin generation.
// With Groq → use real LLM. Without Groq → use the smart input-aware generator
// (24+ persona possibilities scored from the user's actual answers).
app.post("/api/twin", async (req, res) => {
  const profile = req.body ?? {};
  const smartFallback = generateSmartTwin(profile);
  if (!hasGroq()) return res.json(smartFallback);
  const twin = await generateJSON(PERSONA_PROMPT(profile), {
    model: "smart", temperature: 0.8, fallback: smartFallback,
  });
  res.json(twin);
});

// Roadmap generation.
// With Groq → real LLM. Without → smart goal-aware generator
// (6 categories × randomized task selection × profile-aware tips).
app.post("/api/roadmap", async (req, res) => {
  const { goal = "", days = 30, profile = {} } = req.body ?? {};
  const smartFallback = generateSmartRoadmap(goal, days, profile);
  if (!hasGroq()) return res.json(smartFallback);
  const roadmap = await generateJSON(ROADMAP_PROMPT(goal, Number(days) || 30, profile), {
    model: "smart", temperature: 0.7, fallback: smartFallback,
  });
  res.json(roadmap);
});

app.post("/api/match", async (req, res) => {
  const { twin = {}, filters = {} } = req.body ?? {};
  const filtered = SALONS.filter((s) => {
    if (filters.location && filters.location !== "All" && !s.area.toLowerCase().includes(String(filters.location).toLowerCase())) return false;
    if (filters.priceBand && filters.priceBand !== "All" && s.priceBand !== filters.priceBand) return false;
    return true;
  });
  const compact = filtered.map((s) => ({ id: s.id, name: s.name, area: s.area, specialties: s.specialties, price_band: s.priceBand, vibes: s.vibes, rating: s.rating }));
  // Smart fallback: scores vary by twin persona traits when available.
  const personaBoost = (s) => {
    const v = (twin?.persona || "").toLowerCase();
    if (v.includes("bridal") && s.specialties.some((x) => /bridal|pre.?bridal/i.test(x))) return 8;
    if (v.includes("corporate") && s.specialties.some((x) => /precision|cut|smoothing|color/i.test(x))) return 6;
    if (v.includes("trend") && /editorial|avant|color/i.test(s.specialties.join(" "))) return 8;
    if (v.includes("k-beauty") && /facial|hydra|skin/i.test(s.specialties.join(" "))) return 6;
    return 0;
  };
  const fallback = {
    matches: filtered
      .map((s, i) => ({
        salon_id: s.id,
        compatibility: Math.min(98, 78 + personaBoost(s) + Math.floor(Math.random() * 14) - i),
        style_match: Math.min(96, 75 + Math.floor(Math.random() * 18)),
        budget_match: Math.min(95, 70 + Math.floor(Math.random() * 25)),
        goal_match: Math.min(97, 76 + personaBoost(s) + Math.floor(Math.random() * 16)),
        reasoning: `${s.name} aligns with your vibe — strong in ${s.specialties[0].toLowerCase()} and a ${s.vibes[0].toLowerCase()} energy.`,
        signature_service: s.specialties[0],
      }))
      .sort((a, b) => b.compatibility - a.compatibility),
  };
  const result = hasGroq()
    ? await generateJSON(MATCH_PROMPT(twin, compact, filters), { model: "smart", temperature: 0.55, fallback })
    : fallback;
  const enriched = (result.matches || []).map((m) => ({ ...m, salon: SALONS.find((s) => s.id === m.salon_id) })).filter((m) => m.salon);
  res.json({ matches: enriched });
});

app.post("/api/look", async (req, res) => {
  const look = await generateJSON(LOOK_PROMPT(req.body?.description ?? ""), {
    model: "smart", temperature: 0.8, fallback: { ...LOOK_FALLBACK },
  });
  res.json(look);
});

app.post("/api/insights", async (req, res) => {
  const insights = await generateJSON(INSIGHTS_PROMPT(req.body?.twin ?? {}, req.body?.activity ?? {}), {
    model: "smart", temperature: 0.7, fallback: { ...INSIGHTS_FALLBACK },
  });
  res.json(insights);
});

app.get("/api/salons", (_req, res) => res.json({ salons: SALONS }));
app.get("/api/health", (_req, res) => res.json({ ok: true, groq: Boolean(process.env.GROQ_API_KEY) }));

/* -------- Static (production) -------- */
const dist = path.resolve(__dirname, "../dist");
if (fs.existsSync(dist)) {
  app.use(express.static(dist));
  app.get("*", (_req, res) => res.sendFile(path.join(dist, "index.html")));
}

const PORT = process.env.PORT || 5174;
app.listen(PORT, () => console.log(`✨ CURA API on http://localhost:${PORT} ${hasGroq() ? "[Groq]" : "[Smart fallback]"}`));
