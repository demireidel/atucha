export async function loadSteps(lang: "en"|"es") {
  const res = await fetch(`/data/tour.${lang}.json`, { cache: "no-store" });
  if (!res.ok) return [];
  return res.json();
}
