import { buildNatal, computeLongitudes, findTransitAspects } from "./astro";
import { aspectToSentence } from "./interpretation";

function intentOf(msg: string): "love" | "career" | "health" | "generic" {
  const s = (msg || "").toLowerCase();
  if (/(love|relationship|partner|crush|romance|date)/.test(s)) return "love";
  if (/(career|job|work|project|interview|promotion|startup|business)/.test(s)) return "career";
  if (/(health|stress|sleep|anxiety|energy|diet|exercise|workout)/.test(s)) return "health";
  return "generic";
}

const SIGN_TAGLINE: Record<string, string> = {
  aries: "bold momentum",
  taurus: "steady focus",
  gemini: "curious flow",
  cancer: "deep intuition",
  leo: "bright confidence",
  virgo: "quiet precision",
  libra: "calm balance",
  scorpio: "focused intensity",
  sagittarius: "open horizons",
  capricorn: "disciplined climb",
  aquarius: "original insight",
  pisces: "gentle vision",
};

export function botReply(msg: string, sign: string): string {
  const intent = intentOf(msg);
  const signKey = (sign || "").toLowerCase();
  const spice = SIGN_TAGLINE[signKey] ? ` · ${SIGN_TAGLINE[signKey]}` : "";

  const base =
    intent === "love"
      ? "Relationships: lead with kindness and clear signals."
      : intent === "career"
      ? "Career: pick the one task that moves the needle and ship it today."
      : intent === "health"
      ? "Health: light movement + water + sleep target—keep it simple."
      : "Today: simplicity beats complexity—one small clear action.";

  return `${base}${spice}`;
}

export async function smartBotReply(msg: string, natalISO?: string): Promise<string> {
  const nowISO = new Date().toISOString();

  let flavor = "";
  try {
    if (natalISO) {
      const natal = buildNatal(natalISO);           
      const transits = computeLongitudes(nowISO);   
      const aspects = findTransitAspects(natal, transits); 
      if (Array.isArray(aspects) && aspects.length) {
        flavor = aspectToSentence(aspects[0]);    
      }
    }
  } catch {
  }

  const intent = intentOf(msg);
  const base =
    intent === "love"
      ? "Relationships: lead with kindness and clear signals."
      : intent === "career"
      ? "Career: pick the one task that moves the needle and ship it today."
      : intent === "health"
      ? "Health: light movement + water + sleep target—keep it simple."
      : "Today: simplicity beats complexity—one small clear action.";

  return flavor ? `${base} • Transit highlight: ${flavor}` : base;
}

export default botReply;
