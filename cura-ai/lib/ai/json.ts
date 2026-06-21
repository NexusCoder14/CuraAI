import { getGroq, GROQ_MODELS, hasGroq } from "./groq";

// Generic helper: call Groq for a JSON-only response and parse safely.
export async function generateJSON<T>(
  prompt: string,
  opts: { model?: "fast" | "smart"; temperature?: number; fallback: T } = { fallback: {} as T }
): Promise<T> {
  if (!hasGroq()) return opts.fallback;
  try {
    const client = getGroq();
    const completion = await client.chat.completions.create({
      model: GROQ_MODELS[opts.model ?? "smart"],
      temperature: opts.temperature ?? 0.6,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: "You output ONLY valid JSON. No markdown, no prose." },
        { role: "user", content: prompt },
      ],
    });
    const raw = completion.choices?.[0]?.message?.content ?? "{}";
    return JSON.parse(raw) as T;
  } catch (err) {
    console.error("generateJSON error", err);
    return opts.fallback;
  }
}
