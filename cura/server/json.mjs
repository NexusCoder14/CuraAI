import { getGroq, hasGroq, MODELS } from "./groq.mjs";

export async function generateJSON(prompt, { model = "smart", temperature = 0.6, fallback = {} } = {}) {
  if (!hasGroq()) return fallback;
  try {
    const client = getGroq();
    const r = await client.chat.completions.create({
      model: MODELS[model],
      temperature,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: "You output ONLY valid JSON. No markdown, no prose." },
        { role: "user", content: prompt },
      ],
    });
    return JSON.parse(r.choices?.[0]?.message?.content ?? "{}");
  } catch (e) {
    console.error("generateJSON error", e);
    return fallback;
  }
}
