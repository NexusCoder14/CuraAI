# CURA AI — The AI Beauty Operating System

> Meet your AI Beauty Agent. Built with **Vite + React + Express + Groq** for sub-100ms page navigation.

Mumbai-based, AI-first beauty platform. This is **not** a salon directory — it's an AI agent that orchestrates your entire beauty journey.

## Why Vite instead of Next.js

Next.js dev mode compiles routes on-demand → 1–3s lag on first visit per page.
**Vite is ~20× faster**: routes are pure client-side React, code-split, and cached after first load. Page transitions feel native-app smooth.

## 🚀 Run

```bash
cp .env.example .env
# (optional) add GROQ_API_KEY — demo mode works without one

npm install
npm run dev
```

- Web: http://localhost:5173
- API: http://localhost:5174

`npm run dev` starts both the Vite frontend and the Express API in parallel. Vite proxies `/api/*` to the Express server so it feels like one app.

## 🏗️ Architecture

```
server/
  index.mjs         # Express app — single entry, all 6 AI endpoints
  groq.mjs          # Single Groq client, model registry
  prompts.mjs       # All 6 prompt templates
  chat.mjs          # Streaming chat agent + 18-topic demo fallback
  json.mjs          # JSON-mode helper with safe fallbacks
  fallbacks.mjs     # Realistic offline responses for every module
  salons.mjs        # Mock Mumbai salon data

src/
  routes/           # 10 React Router routes (code-split with React.lazy)
  components/       # Shared, landing, chat, twin, roadmap, salons
  lib/
    store/useCura   # Persisted Zustand store (twin, roadmap, bookings)
    data/salons     # Salon types & data
    utils/cn        # className helper
  App.tsx           # Router + AnimatePresence page transitions
  main.tsx          # Entry, removes boot loader once React mounts
```

## ⚡ Performance choices

- **Vite** for instant HMR (~50ms reload)
- **`React.lazy` per route** → tiny per-page chunks
- **`manualChunks`** for react/router and framer-motion → cached separately
- **Suspense with shimmer skeleton** during route load → no blank pages
- **Boot orb in `index.html`** → users never see a white flash before React mounts
- **AnimatePresence page transitions** → smooth 250ms fade between routes
- **No SSR overhead** → all data fetching is client-side, all renders are instant

## 🧠 Six AI Modules

| Module | Endpoint | Model |
|---|---|---|
| Beauty Agent (streaming chat) | `POST /api/chat` | llama-3.1-8b-instant |
| Beauty Twin (persona) | `POST /api/twin` | llama-3.3-70b-versatile |
| Roadmap (week-by-week plan) | `POST /api/roadmap` | llama-3.3-70b-versatile |
| Salon Matchmaker | `POST /api/match` | llama-3.3-70b-versatile |
| Look Explorer | `POST /api/look` | llama-3.3-70b-versatile |
| Beauty Insights | `POST /api/insights` | llama-3.3-70b-versatile |

Each endpoint has a realistic offline fallback so the demo works without `GROQ_API_KEY`.

## 📦 Build for production

```bash
npm run build       # bundle the SPA into dist/
npm start           # serves dist/ + /api/* from one Node process on PORT
```

One-binary deployment. Drop on any Node host.
