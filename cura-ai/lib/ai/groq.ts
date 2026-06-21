import Groq from "groq-sdk";

// Centralized Groq client. Reads from GROQ_API_KEY.
// All AI features in CURA route through this single client.
let _client: Groq | null = null;

export function getGroq(): Groq {
  if (_client) return _client;
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    // Don't throw at import — only when actually used. Allows demo mode fallback.
    throw new Error("GROQ_API_KEY missing");
  }
  _client = new Groq({ apiKey });
  return _client;
}

export const GROQ_MODELS = {
  // Fast conversational
  fast: "llama-3.1-8b-instant",
  // Higher quality reasoning for personas, roadmaps, matchmaking
  smart: "llama-3.3-70b-versatile",
} as const;

export function hasGroq(): boolean {
  return Boolean(process.env.GROQ_API_KEY);
}
