"use client";

import { useEffect, useMemo, useState } from "react";
import { computeLongitudes, PLANETS } from "@/services/astro";

type Props = {
  natalISO?: string;
  size?: number;
};

const ZODIAC = [
  "Aries","Taurus","Gemini","Cancer","Leo","Virgo",
  "Libra","Scorpio","Sagittarius","Capricorn","Aquarius","Pisces",
] as const;

const GLYPH: Record<string, string> = {
  Sun: "☉",
  Moon: "☽",
  Mercury: "☿",
  Venus: "♀",
  Mars: "♂",
  Jupiter: "♃",
  Saturn: "♄",
};

function toRad(deg: number) {
  return (deg * Math.PI) / 180;
}

export default function AstroChart({ natalISO, size = 520 }: Props) {
  const [natal, setNatal] = useState<Record<string, number> | null>(null);
  const [transit, setTransit] = useState<Record<string, number> | null>(null);

  useEffect(() => {
    const nowISO = new Date().toISOString();
    setTransit(computeLongitudes(nowISO));
    if (natalISO) {
      setNatal(computeLongitudes(natalISO));
    } else {
      setNatal(null);
    }
  }, [natalISO]);

  const cx = size / 2;
  const cy = size / 2;
  const outerR = size * 0.42;
  const innerR = size * 0.32;
  const ringR  = size * 0.44;
  const signLabelR = size * 0.36;

  function polar(deg: number, r: number) {
    const th = toRad(deg);
    return { x: cx + r * Math.cos(th), y: cy - r * Math.sin(th) };
  }

  const signBoundaries = useMemo(() => {
    return Array.from({ length: 12 }, (_, i) => i * 30);
  }, []);

  return (
    <div className="w-full flex justify-center">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="drop-shadow-sm">
        <defs>
          <radialGradient id="bg" cx="50%" cy="50%">
            <stop offset="0%" stopColor="#111827" />
            <stop offset="100%" stopColor="#0a0a0a" />
          </radialGradient>
        </defs>
        <circle cx={cx} cy={cy} r={size * 0.48} fill="url(#bg)" stroke="#1f2937" />

        <circle cx={cx} cy={cy} r={outerR} fill="none" stroke="#374151" strokeDasharray="2 6" />
        <circle cx={cx} cy={cy} r={innerR} fill="none" stroke="#374151" strokeDasharray="2 6" />

        {signBoundaries.map((deg, i) => {
          const p1 = polar(deg, size * 0.48);
          const p2 = polar(deg, size * 0.18);
          return (
            <line
              key={`slice-${i}`}
              x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y}
              stroke="#30363d" strokeWidth={1}
            />
          );
        })}

        {ZODIAC.map((name, i) => {
          const midDeg = i * 30 + 15;
          const pos = polar(midDeg, signLabelR);
          return (
            <text
              key={`label-${name}`}
              x={pos.x}
              y={pos.y}
              textAnchor="middle"
              dominantBaseline="central"
              fill="#e5e7eb"
              fontSize={12}
              style={{ fontWeight: 600, letterSpacing: "0.02em" }}
            >
              {name}
            </text>
          );
        })}

        {Array.from({ length: 36 }, (_, i) => i * 10).map((deg) => {
          const pOuter = polar(deg, ringR);
          const pInner = polar(deg, ringR - 8);
          const isMajor = deg % 30 === 0;
          return (
            <line
              key={`tick-${deg}`}
              x1={pOuter.x} y1={pOuter.y} x2={pInner.x} y2={pInner.y}
              stroke={isMajor ? "#6b7280" : "#4b5563"}
              strokeWidth={isMajor ? 2 : 1}
            />
          );
        })}

        {natal &&
          PLANETS.map((body) => {
            const name = body.toString();
            const lon = natal[name];
            if (lon == null) return null;
            const pos = polar(lon, innerR);
            return (
              <g key={`natal-${name}`}>
                <circle cx={pos.x} cy={pos.y} r={8} fill="#111827" stroke="#9ca3af" />
                <text
                  x={pos.x}
                  y={pos.y}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize={13}
                  fill="#e5e7eb"
                >
                  {GLYPH[name] ?? name[0]}
                </text>
              </g>
            );
          })}

        {transit &&
          PLANETS.map((body) => {
            const name = body.toString();
            const lon = transit[name];
            if (lon == null) return null;
            const pos = polar(lon, outerR);
            return (
              <g key={`transit-${name}`}>
                <circle cx={pos.x} cy={pos.y} r={9.5} fill="#0b1220" stroke="#60a5fa" />
                <text
                  x={pos.x}
                  y={pos.y}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize={13}
                  fill="#dbeafe"
                >
                  {GLYPH[name] ?? name[0]}
                </text>
              </g>
            );
          })}

        <circle cx={cx} cy={cy} r={3} fill="#9ca3af" />
      </svg>
    </div>
  );
}
