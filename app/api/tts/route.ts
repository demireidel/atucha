import type { NextRequest } from "next/server";
export const runtime = "edge";
const cache = new Map<string, ArrayBuffer>();
async function fetchJSON(path: string, origin: string) {
  const res = await fetch(new URL(path, origin).toString(), { cache: "no-store" });
  if (!res.ok) return null;
  return await res.json();
}
async function loadTourCopy(origin: string, lang: "en" | "es", id: string): Promise<string | null> {
  const json = await fetchJSON(`/data/tour.${lang}.json`, origin) as { steps: Array<{ id: string; copy?: string; title?: string }> } | null;
  if (!json) return null; const step = json.steps.find(s => s.id === id); if (!step) return null;
  return step.copy ?? step.title ?? null;
}
async function loadSSML(origin: string, lang: "en" | "es", id: string): Promise<string | null> {
  const json = await fetchJSON(`/data/ssml.${lang}.json`, origin) as Record<string,string> | null;
  if (!json) return null; return json[id] || null;
}
function wrapSSMLFromText(text: string, rate: "slow"|"medium"|"fast") {
  const rateMap: Record<string,string> = { slow: "80%", medium: "100%", fast: "120%" };
  const r = rateMap[rate] || "100%";
  return `<speak><prosody rate="${r}">${text}</prosody></speak>`;
}
export async function GET(req: NextRequest) {
  const origin = new URL(req.url).origin;
  const { searchParams } = new URL(req.url);
  const lang = (searchParams.get("lang") || "en").toLowerCase() as "en" | "es";
  const id = (searchParams.get("id") || "").toLowerCase();
  const voice = (searchParams.get("voice") || "alloy");
  const rate = (searchParams.get("rate") || "medium") as "slow"|"medium"|"fast";
  const useSSML = (searchParams.get("ssml") || "1") === "1";
  if (!id) return new Response("Missing ?id", { status: 400 });
  const cacheKey = `${lang}:${id}:${voice}:${rate}:${useSSML}`;
  if (cache.has(cacheKey)) {
    const buf = cache.get(cacheKey)!;
    return new Response(buf, { status: 200, headers: { "Content-Type": "audio/mpeg", "Cache-Control": "public, max-age=86400" } });
  }
  const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
  if (!OPENAI_API_KEY) return new Response("Server missing OPENAI_API_KEY", { status: 500 });
  // prefer local mp3 if present
  const head = await fetch(new URL(`/audio/${lang}/step-${id}.mp3`, origin), { method: "HEAD" });
  if (head.ok) {
    const mp3 = await fetch(new URL(`/audio/${lang}/step-${id}.mp3`, origin));
    const buf = await mp3.arrayBuffer();
    cache.set(cacheKey, buf);
    return new Response(buf, { status: 200, headers: { "Content-Type": "audio/mpeg" } });
  }
  let payload: any;
  if (useSSML) {
    const ssml = (await loadSSML(origin, lang, id)) || wrapSSMLFromText((await loadTourCopy(origin, lang, id)) || "", rate);
    if (!ssml) return new Response("No SSML/text", { status: 404 });
    payload = { model: "gpt-4o-mini-tts", voice, format: "mp3", input: ssml, input_format: "ssml" };
  } else {
    const text = await loadTourCopy(origin, lang, id);
    if (!text) return new Response("No text", { status: 404 });
    payload = { model: "gpt-4o-mini-tts", voice, input: text, format: "mp3" };
  }
  const ttsRes = await fetch("https://api.openai.com/v1/audio/speech", {
    method: "POST",
    headers: { "Authorization": `Bearer ${OPENAI_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  if (!ttsRes.ok) {
    const err = await ttsRes.text();
    return new Response(`TTS error: ${err}`, { status: 502 });
  }
  const audioBuf = await ttsRes.arrayBuffer();
  cache.set(cacheKey, audioBuf);
  return new Response(audioBuf, { status: 200, headers: { "Content-Type": "audio/mpeg", "Cache-Control": "public, max-age=86400" } });
}
