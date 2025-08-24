export const SIGNS = [
  "Aries","Taurus","Gemini","Cancer","Leo","Virgo",
  "Libra","Scorpio","Sagittarius","Capricorn","Aquarius","Pisces",
] as const;
export type Sign = typeof SIGNS[number];

export function inferSignFromDate(d: Date): Sign {
  const m = d.getMonth() + 1, day = d.getDate();
  const table: Array<{ sign: Sign; from: [number, number]; to: [number, number] }> = [
    { sign: "Aries",       from: [3,21],  to:[4,19] },
    { sign: "Taurus",      from: [4,20],  to:[5,20] },
    { sign: "Gemini",      from: [5,21],  to:[6,20] },
    { sign: "Cancer",      from: [6,21],  to:[7,22] },
    { sign: "Leo",         from: [7,23],  to:[8,22] },
    { sign: "Virgo",       from: [8,23],  to:[9,22] },
    { sign: "Libra",       from: [9,23],  to:[10,22] },
    { sign: "Scorpio",     from: [10,23], to:[11,21] },
    { sign: "Sagittarius", from: [11,22], to:[12,21] },
    { sign: "Capricorn",   from: [12,22], to:[1,19] },
    { sign: "Aquarius",    from: [1,20],  to:[2,18] },
    { sign: "Pisces",      from: [2,19],  to:[3,20] },
  ];
  for (const r of table) {
    const [fm, fd] = r.from, [tm, td] = r.to;
    if (fm <= tm) {
      if ((m > fm || (m === fm && day >= fd)) && (m < tm || (m === tm && day <= td))) return r.sign;
    } else {
      if ((m > fm || (m === fm && day >= fd)) || (m < tm || (m === tm && day <= td))) return r.sign;
    }
  }
  return "Aries";
}
