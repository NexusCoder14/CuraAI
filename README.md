# ✨ CURA AI

### The AI Beauty Operating System

**Meet your AI Beauty Agent.**
Personalized beauty planning, salon discovery, and style transformation — orchestrated by a real-time AI that understands you.

🔗 **Live:** [https://curaai-c541.onrender.com](https://curaai-c541.onrender.com)

---

## About

Mumbai's beauty industry runs on word-of-mouth and gut feel. Existing apps are glorified directories — search, scroll, call. **CURA AI flips the model: AI is the product, salons are a feature.**

CURA is a venture-grade, AI-first platform that turns vague beauty intentions ("I want to look amazing for my wedding", "help me glow up", "what hairstyle suits a corporate look?") into a complete, personalized plan — with a streaming conversational concierge, a living style persona, week-by-week roadmaps, and direct salon booking.

Built for the **Mumbai Beauty Salon Hackathon**, designed to launch publicly tomorrow.

---

## Features

### 🤖 AI Beauty Agent
A streaming conversational concierge powered by Groq's Llama 3.1 8B. Ask anything — skincare for Mumbai humidity, salons near Powai, wedding prep, hair fall, K-beauty routines — and get sub-second, markdown-formatted, context-aware answers. The agent remembers your conversation and personalizes responses to your Beauty Twin.

### 🧬 Beauty Twin *(flagship)*
A 7-step onboarding (age, goals, styles, hair, skin, budget, events) generates a vivid persona from 14 possibilities: **Luxury Minimalist, Modern Glam, Bandra Bohemian, Bridal Radiance, Trend Architect, Corporate Powerhouse, K-Beauty Glow, Edgy Avant, Classic Elegance, Wellness Radiance, Festive Maximalist, Coastal Effortless, Modern Groom, Trend Explorer**.

Each Twin includes a tagline, summary written in second person, signature traits, a 5-dimension Style DNA radar (minimal · glam · trend · classic · edgy), a custom color palette, recommended vibes, an animated beauty score, and a next-best-action.

### 🗺️ Beauty Roadmap
Tell CURA your goal and timeline. It generates a week-by-week arc across 6 categories — **Wedding · Glow · Corporate · Vacation · Hair · Date Night** — with named phases (e.g., Foundation → Refinement → Transformation → Reveal for weddings), 3-5 tasks per week tagged as salon/home/product/consult, priorities, durations, milestones, budget estimates in INR, and profile-specific pro tips.

### 🪄 Look Explorer
Describe an aesthetic in one sentence ("Elegant Bollywood actress on a magazine cover", "Modern Korean glow"). CURA generates the full blueprint: hair (style, color, treatments), skin (finish, routine), makeup (eyes, lips, complexion), recommended services, celebrity references, estimated sessions, and budget range.

### 📊 Beauty Insights
A personalized analytics dashboard synthesized from your Twin and activity: animated beauty score with weekly delta, strengths with notes, areas to improve with scores, weekly recommendations by category (hair/skin/nails/makeup/wellness), trending picks, and your next milestone.

### 📅 Direct Booking
Browse all Mumbai salons with search, area filters, price filters, and sort (recommended / top-rated / price). Each salon card shows specialties, vibes, service preview with prices, ratings, and a one-tap **Book a slot** button. The booking flow includes:
- Date picker locked to today through +90 days
- Quick-pick day chips for the next 7 days
- Live time slot grid with **past slots auto-disabled** (15-min buffer) and **already-booked slots locked**
- Service selector with prices and durations
- Booking summary and confirmation screen
- Persisted bookings — your reservations survive page reloads

---

## Design

**Dark Luxury Futurism** — inspired by Apple Vision Pro, Linear, Arc Browser, Raycast, Stripe, Perplexity, and OpenAI.

- Multi-layer aurora background that breathes (radial gradients animated with Framer Motion)
- Glassmorphism + liquid glass surfaces throughout
- Electric Violet · Neon Cyan · Aurora Blue · Plasma Magenta accent palette
- Hero **Orbital Beauty Constellation** — faceted prism core, 3 tilted orbital rings, floating beauty signal chips (Hair/Skin/Style/Glow), HUD scanline, corner brackets, cursor-reactive 3D parallax — all pure SVG, no canvas
- Framer Motion page transitions, layout-shared nav indicator, animated score rings, shimmer skeletons, magnetic micro-interactions

---

## Tech Stack

- **Frontend:** React 18, Vite, TypeScript, React Router 6
- **Styling:** Tailwind CSS 3 with custom design tokens
- **Animation:** Framer Motion 11
- **State:** Zustand 5 (persisted to localStorage — Twin, Roadmap, Bookings survive refresh)
- **Backend:** Express 4 (single Node process serves SPA + API)
- **AI:** Groq SDK with Llama 3.3 70B (reasoning) and Llama 3.1 8B (streaming chat)
- **Icons:** Lucide React

### Project Structure

```
cura/
├── server/            Express backend
│   ├── index.mjs      Entry — serves dist/ + /api/*
│   ├── groq.mjs       Centralized Groq client
│   ├── prompts.mjs    All 6 prompt templates
│   ├── chat.mjs       Streaming chat agent
│   ├── smart-twin.mjs       Input-aware persona engine (fallback)
│   ├── smart-roadmap.mjs    Goal-aware roadmap engine (fallback)
│   └── salons.mjs     Mumbai salon data
│
└── src/               React SPA
    ├── routes/        10 pages, code-split with React.lazy
    ├── components/    Constellation, Aurora, Nav, etc.
    └── lib/           Zustand store, salon data, utils
```

### The Smart Fallback Engine

Even without a Groq API key, CURA produces unique, personalized outputs. The Beauty Twin scores user profiles across 14 personas using weighted signals from events, styles, goals, age, budget, hair, and skin — so 8 different profiles yield 7+ different personas. The Roadmap engine parses goals into 6 categories with phase-specific task pools and dynamic budgets. When `GROQ_API_KEY` is set, real Llama 3.3 70B inference replaces these; the smart engine stays as a guaranteed fallback.

---

## Run Locally

```bash
git clone https://github.com/YOUR_USERNAME/cura-ai.git
cd cura-ai/cura

cp .env.example .env
# Add your Groq key from https://console.groq.com (optional — demo works without it)

npm install
npm run dev
```
---
## Deployment

Deployed on **Render**.

🔗 **[https://curaai-c541.onrender.com](https://curaai-c541.onrender.com)**

---
