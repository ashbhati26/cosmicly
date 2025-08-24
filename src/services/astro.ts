import {
  Body, Ecliptic, Vector, GeoVector, MakeTime
} from "astronomy-engine";

export const ZODIAC = [
  "Aries","Taurus","Gemini","Cancer","Leo","Virgo",
  "Libra","Scorpio","Sagittarius","Capricorn","Aquarius","Pisces",
] as const;
export type Zodiac = typeof ZODIAC[number];

export function zodiacOfLongitude(lambdaDeg: number): Zodiac {
  const idx = Math.floor(((lambdaDeg % 360) + 360) % 360 / 30);
  return ZODIAC[idx]!;
}

export const PLANETS: Body[] = [
  Body.Sun, Body.Moon, Body.Mercury, Body.Venus, Body.Mars, Body.Jupiter, Body.Saturn,
];

export type PlanetLongitudes = Record<string, number>;

function timeFromISO(iso: string) {
  return MakeTime(new Date(iso));
}

function eclipticLongitude(body: Body, t: ReturnType<typeof MakeTime>): number {
  const vec: Vector = GeoVector(body, t, /* aberration= */ true);
  const ecl = Ecliptic(vec);
  const deg = (ecl.elon * 180) / Math.PI;
  return ((deg % 360) + 360) % 360;
}

export function computeLongitudes(whenISO: string): PlanetLongitudes {
  const t = timeFromISO(whenISO);
  const out: PlanetLongitudes = {};
  for (const b of PLANETS) {
    out[Body[b]] = eclipticLongitude(b, t);
  }
  return out;
}

export type NatalLite = {
  dateISO: string;           
  longitudes: PlanetLongitudes;
  signs: Record<string, Zodiac>;
};

export function buildNatal(dateISO: string): NatalLite {
  const longitudes = computeLongitudes(dateISO);
  const signs: Record<string, Zodiac> = {};
  for (const key of Object.keys(longitudes)) {
    signs[key] = zodiacOfLongitude(longitudes[key]!);
  }
  return { dateISO, longitudes, signs };
}

export type AspectType = "conjunction" | "sextile" | "square" | "trine" | "opposition";
export type TransitAspect = {
  transitBody: string;
  natalBody: string;
  type: AspectType;
  orbDeg: number;           
  exactAngle: number;        
  transitLon: number;
  natalLon: number;
};

const ASPECTS: Record<AspectType, { angle: number; orb: number }> = {
  conjunction: { angle: 0,   orb: 7 },
  sextile:     { angle: 60,  orb: 4 },
  square:      { angle: 90,  orb: 6 },
  trine:       { angle: 120, orb: 6 },
  opposition:  { angle: 180, orb: 7 },
};

function angleDiff(a: number, b: number): number {
  const d = Math.abs(((a - b + 540) % 360) - 180);
  return d;
}

export function findTransitAspects(natal: NatalLite, transitLongitudes: PlanetLongitudes): TransitAspect[] {
  const hits: TransitAspect[] = [];
  for (const tb of Object.keys(transitLongitudes)) {
    for (const nb of Object.keys(natal.longitudes)) {
      const tLon = transitLongitudes[tb]!;
      const nLon = natal.longitudes[nb]!;
      const diff = angleDiff(tLon, nLon);
      for (const [type, { angle, orb }] of Object.entries(ASPECTS) as [AspectType, { angle:number; orb:number }][]) {
        const orbDeg = Math.abs(diff - angle);
        if (orbDeg <= orb) {
          hits.push({
            transitBody: tb, natalBody: nb, type, orbDeg, exactAngle: angle,
            transitLon: tLon, natalLon: nLon
          });
        }
      }
    }
  }
  const weight = (b: string) => ["Sun","Moon","Mercury","Venus","Mars"].includes(b) ? 2 : 1;
  hits.sort((a, b) => (a.orbDeg - b.orbDeg) || (weight(b.transitBody) - weight(a.transitBody)));
  return hits;
}
