# CURA AI — The AI Beauty Operating System

> Meet your AI Beauty Agent.
> Personalized beauty planning, salon discovery, and style transformation — powered by Groq.

Mumbai-based, AI-first beauty platform. Built for the Beauty OS Hackathon.
This is **not** a salon directory. It's an AI agent that orchestrates your entire beauty journey — the marketplace is just one feature.

---

## ✨ The Six AI Modules

| Module | What it does | API |
|---|---|---|
| **AI Beauty Agent** | Streaming conversational concierge (Groq Llama 3.1 8B) with conversation memory and Twin context. | `/api/chat` |
| **Beauty Twin** 🔥 | Generates a vivid persona, style DNA, color palette, and beauty score from a 7-step onboarding. | `/api/twin` |
| **Beauty Roadmap** | Week-by-week, task-by-task plan toward any goal (wedding, glow-up, new role). | `/api/roadmap` |
| **Salon Matchmaker** | AI-ranked salons with compatibility, style, budget, and goal scores + reasoning. | `/api/match` |
| **Look Explorer** | Generates a full aesthetic blueprint (hair / skin / makeup / services / budget) from one sentence. | `/api/look` |
| **Beauty Insights** | Personalized analytics dashboard: strengths, weaknesses, weekly recs, trends. | `/api/insights` |

All six are powered by a single, centralized Groq service layer in `lib/ai/`.

---

## 🏗️ AI Architecture

```
lib/ai/
  groq.ts            # Single Groq client, model registry, demo-mode flag
  prompts.ts         # Versioned prompt templates (one per capability)
  chat.ts            # Streaming chat agent (async generator)
  json.ts            # Generic JSON-mode helper with safe fallbacks
  beautyTwin.ts      # Persona generation
  roadmap.ts         # Week-by-week planner
  recommendations.ts # Matchmaker + Look + Insights
```

Every AI feature:
- Routes through **one** Groq client.
- Uses **structured JSON output** with strict prompts.
- Has a **fallback** for graceful demo mode without an API key.
- Streams responses where it matters (chat).

---

## 🎨 Design System

**Dark Luxury Futurism.** Inspired by Apple Vision Pro, Linear, Arc, Raycast, Stripe, Perplexity, OpenAI.

- Background `#050816` with multi-layer aurora gradients
- Glassmorphism + liquid glass surfaces
- Electric Violet · Neon Cyan · Aurora Blue · Plasma Magenta accents
- Floating particles, glow effects, soft shadows, animated grid
- Magnetic buttons, Framer Motion page transitions, GSAP-grade micro-interactions
- Beauty Intelligence Sphere on the hero — cursor-reactive 3D orb

---

## 🛠️ Tech Stack

- **Next.js 15** (App Router) · **TypeScript** · **Tailwind**
- **Framer Motion** for all motion
- **Groq SDK** — `llama-3.3-70b-versatile` for reasoning, `llama-3.1-8b-instant` for chat
- **Zustand** (persisted) for client state
- **Lucide** icons

---

## 🚀 Run it

```bash
cp .env.example .env.local
# add your GROQ_API_KEY (free at console.groq.com)

npm install
npm run dev
```

> **No key? No problem.** CURA runs in demo mode with realistic mock responses, so judges can experience every flow even offline.

---

## 🗺️ Pages

- `/` — Landing (hero, features, how-it-works, CTA)
- `/twin/onboarding` — 7-step Beauty Twin creation
- `/twin` — Beauty Twin dashboard (persona, style DNA, palette, score)
- `/chat` — Streaming AI Agent
- `/roadmap` — Goal → week-by-week plan
- `/salons` — AI matchmaker
- `/look` — Look blueprint generator
- `/insights` — Personalized analytics
- `/booking/[id]` — Booking flow
- `/profile` — Account & data

---

## 💡 Why CURA wins

1. **AI is the product, not a feature.** Six Groq-powered modules, one OS.
2. **Production-grade architecture.** One AI service layer. Versioned prompts. JSON-mode with fallbacks. Streaming. Persisted state.
3. **Real product thinking.** Beauty Twin → Roadmap → Matchmaker → Booking is a coherent funnel a venture investor can underwrite.
4. **Design judges remember.** The hero orb, aurora, glass, and motion language make CURA feel like a Vision Pro app, not a salon site.

Built in Mumbai · 2026
