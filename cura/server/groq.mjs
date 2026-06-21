import Groq from "groq-sdk";

let _client = null;
export function getGroq() {
  if (_client) return _client;
  if (!process.env.GROQ_API_KEY) throw new Error("GROQ_API_KEY missing");
  _client = new Groq({ apiKey: process.env.GROQ_API_KEY });
  return _client;
}
export const hasGroq = () => Boolean(process.env.GROQ_API_KEY);
export const MODELS = { fast: "llama-3.1-8b-instant", smart: "llama-3.3-70b-versatile" };
