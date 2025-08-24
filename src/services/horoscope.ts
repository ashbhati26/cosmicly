import { buildNatal, computeLongitudes, findTransitAspects } from "./astro";
import { assembleDaily } from "./interpretation";

export type Period = "daily" | "weekly" | "monthly";

export async function getHoroscope(sign: string, period: Period, natalISO?: string) {
  const nowISO = new Date().toISOString();

  let natal = natalISO ? buildNatal(natalISO) : undefined;

  if (!natal) {
    const dummyDate = new Date(nowISO);
    const longitudes: Record<string, number> = {};
    const signIndex = ["Aries","Taurus","Gemini","Cancer","Leo","Virgo","Libra","Scorpio","Sagittarius","Capricorn","Aquarius","Pisces"].indexOf(sign) || 0;
    longitudes["Sun"] = signIndex * 30 + 15;
    natal = { dateISO: dummyDate.toISOString(), longitudes, signs: { Sun: sign as any } };
  }

  const transitLongitudes = computeLongitudes(nowISO);
  const aspects = findTransitAspects(natal, transitLongitudes);

  let content = assembleDaily(aspects, sign);

  if (period === "weekly") {
    content = `Weekly overview for ${sign}: ${content} Focus on repeating what works 3–4 times this week.`;
  } else if (period === "monthly") {
    content = `Monthly theme for ${sign}: ${content} Pick one habit to practice daily this month.`;
  }

  return {
    sign,
    period,
    content,
    createdAt: nowISO,
  };
}
