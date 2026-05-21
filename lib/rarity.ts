export type Rarity = "N" | "R" | "SR" | "SSR" | "UR";

export const rarityWeights: Record<Rarity, number> = {
  N: 60,
  R: 25,
  SR: 10,
  SSR: 4,
  UR: 1,
};

export const rarityMeta: Record<
  Rarity,
  {
    label: string;
    aura: string;
    badge: string;
    stage: string;
    durationMs: number;
  }
> = {
  N: {
    label: "N",
    aura: "from-slate-400 via-violet-300 to-slate-500",
    badge: "border-slate-300/50 bg-slate-200/10 text-slate-100",
    stage: "shadow-[0_0_28px_rgba(148,163,184,0.22)]",
    durationMs: 1550,
  },
  R: {
    label: "R",
    aura: "from-cyan-300 via-indigo-300 to-violet-400",
    badge: "border-cyan-200/60 bg-cyan-300/12 text-cyan-100",
    stage: "shadow-[0_0_34px_rgba(34,211,238,0.26)]",
    durationMs: 1700,
  },
  SR: {
    label: "SR",
    aura: "from-fuchsia-300 via-violet-300 to-cyan-300",
    badge: "border-fuchsia-200/70 bg-fuchsia-400/15 text-fuchsia-50",
    stage: "shadow-[0_0_46px_rgba(217,70,239,0.36)]",
    durationMs: 2050,
  },
  SSR: {
    label: "SSR",
    aura: "from-purple-300 via-fuchsia-300 to-indigo-200",
    badge: "border-purple-100 bg-purple-400/20 text-purple-50",
    stage: "shadow-[0_0_70px_rgba(168,85,247,0.55)]",
    durationMs: 2350,
  },
  UR: {
    label: "UR",
    aura: "from-amber-200 via-fuchsia-300 to-cyan-200",
    badge: "border-amber-100 bg-amber-300/20 text-amber-50",
    stage: "shadow-ur",
    durationMs: 2500,
  },
};

export function drawRarity(): Rarity {
  const roll = Math.random() * 100;
  let cursor = 0;

  for (const rarity of Object.keys(rarityWeights) as Rarity[]) {
    cursor += rarityWeights[rarity];
    if (roll < cursor) return rarity;
  }

  return "N";
}
