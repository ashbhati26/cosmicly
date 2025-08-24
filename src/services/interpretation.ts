import { TransitAspect } from "./astro";

const meanings: Record<string, string> = {
  "Venus|conjunction|Sun": "Warm charm meets identity—great for love, aesthetics, and self-expression.",
  "Venus|trine|Moon": "Emotional harmony—relationships feel easy and supportive.",
  "Mars|square|Sun": "High drive—channel it into a single task to avoid friction.",
  "Mercury|sextile|Sun": "Clear thinking and smooth conversations—send that message.",
  "Jupiter|trine|Sun": "Confidence + opportunity—pitch, publish, or apply.",
  "Saturn|opposition|Sun": "Responsibility check—trim commitments and focus.",
  "Venus|*": "Social and aesthetic themes highlighted—connect, beautify, appreciate.",
  "Mars|*": "Energy and initiative—move body, start small, finish one thing.",
  "Mercury|*": "Thinking and communication—plan, write, clarify.",
  "Jupiter|*": "Growth and optimism—learn, teach, or expand.",
  "Saturn|*": "Discipline and structure—set boundaries, build steadily.",
  "Moon|*": "Mood and needs—rest, hydrate, and stay present.",
  "Sun|*": "Identity and vitality—act in alignment with your values.",
};

function keyOf(transitBody: string, type: string, natalBody: string) {
  return `${transitBody}|${type}|${natalBody}`;
}

function fallbackOf(transitBody: string) {
  return `${transitBody}|*`;
}

export function aspectToSentence(a: TransitAspect): string {
  const specific = meanings[keyOf(a.transitBody, a.type, a.natalBody)];
  const generic = meanings[fallbackOf(a.transitBody)] || "Notable transit—notice the theme and act mindfully.";
  const base = specific ?? generic;
  const closeness = a.orbDeg < 1 ? " (peaks now)" : a.orbDeg < 3 ? " (strong)" : " (mild)";
  return `${base}${closeness}`;
}

export function assembleDaily(aspects: TransitAspect[], signLabel: string): string {
  if (!aspects.length) {
    return `For ${signLabel}, the sky is relatively quiet—focus on simple, consistent progress.`;
  }
  const top = aspects.slice(0, 3).map(aspectToSentence);
  return top.join(" ");
}
