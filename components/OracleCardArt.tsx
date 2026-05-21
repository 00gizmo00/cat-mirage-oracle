import type { GachaCategoryId } from "@/lib/gachaData";
import type { Rarity } from "@/lib/rarity";

type OracleCardArtProps = {
  category: GachaCategoryId;
  rarity: Rarity;
  size?: "xs" | "sm" | "md";
  variantKey?: string;
};

type CardArtVariant = {
  label: string;
  main: string;
  sub: string;
  sigils: string[];
};

const categoryArt: Record<
  GachaCategoryId,
  {
    accent: string;
    variants: CardArtVariant[];
  }
> = {
  love: {
    accent: "from-rose-300 via-fuchsia-300 to-purple-400",
    variants: [
      { label: "LUNAR ROSE", main: "♥", sub: "☾", sigils: ["✦", "✧", "✦", "✧"] },
      { label: "RED THREAD", main: "♢", sub: "∞", sigils: ["☽", "✦", "☾", "✦"] },
      { label: "TWIN HEART", main: "♡", sub: "✧", sigils: ["♥", "✦", "♥", "✦"] },
    ],
  },
  money: {
    accent: "from-amber-200 via-yellow-300 to-lime-300",
    variants: [
      { label: "GILDED COIN", main: "◈", sub: "♛", sigils: ["◇", "✦", "◇", "✦"] },
      { label: "SUN VAULT", main: "◎", sub: "✦", sigils: ["△", "◇", "△", "◇"] },
      { label: "GOLD SCALE", main: "♢", sub: "◌", sigils: ["✧", "◇", "✧", "◇"] },
    ],
  },
  work: {
    accent: "from-cyan-200 via-sky-300 to-indigo-400",
    variants: [
      { label: "IRON SWORD", main: "†", sub: "⚙", sigils: ["△", "✦", "△", "✦"] },
      { label: "STAR GEAR", main: "⚙", sub: "✧", sigils: ["◇", "△", "◇", "△"] },
      { label: "BLUE TOWER", main: "▵", sub: "⌁", sigils: ["✦", "□", "✦", "□"] },
    ],
  },
  relations: {
    accent: "from-emerald-200 via-teal-300 to-cyan-300",
    variants: [
      { label: "TWIN MASK", main: "◑", sub: "∞", sigils: ["☽", "✧", "☾", "✧"] },
      { label: "SILENT KNOT", main: "∞", sub: "☍", sigils: ["◇", "✦", "◇", "✦"] },
      { label: "ECHO MOON", main: "☯", sub: "☾", sigils: ["☽", "◇", "☾", "◇"] },
    ],
  },
  abyss: {
    accent: "from-violet-200 via-fuchsia-300 to-slate-100",
    variants: [
      { label: "ABYSS GATE", main: "◉", sub: "✷", sigils: ["✶", "◇", "✶", "◇"] },
      { label: "VOID EYE", main: "◍", sub: "✦", sigils: ["✷", "△", "✷", "△"] },
      { label: "BLACK STAR", main: "✹", sub: "◌", sigils: ["◇", "✶", "◇", "✶"] },
    ],
  },
};

const rarityFrame: Record<Rarity, string> = {
  N: "border-white/18 shadow-[0_0_20px_rgba(168,85,247,0.2)]",
  R: "border-violet-200/30 shadow-[0_0_26px_rgba(168,85,247,0.32)]",
  SR: "border-amber-100/45 shadow-[0_0_38px_rgba(250,204,21,0.34)]",
  SSR: "border-fuchsia-100/60 shadow-[0_0_48px_rgba(217,70,239,0.5)]",
  UR: "border-amber-100/80 shadow-[0_0_58px_rgba(250,204,21,0.7),0_0_92px_rgba(34,211,238,0.24)]",
};

const sizeClass = {
  xs: {
    shell: "h-14 w-10 rounded-[10px]",
    frame: "inset-1 rounded-[7px]",
    halo: "h-9 w-9",
    ring: "h-9 w-9",
    innerRing: "h-6 w-6",
    label: "top-0.5 text-[3px]",
    sigil: "text-[6px]",
    main: "text-[1.55rem]",
    subWrap: "bottom-2",
    sub: "text-[10px]",
    rule: "bottom-1 w-6",
  },
  sm: {
    shell: "h-20 w-14 rounded-[14px]",
    frame: "inset-1.5 rounded-[10px]",
    halo: "h-12 w-12",
    ring: "h-12 w-12",
    innerRing: "h-8 w-8",
    label: "top-1 text-[4px]",
    sigil: "text-[8px]",
    main: "text-[2.25rem]",
    subWrap: "bottom-3",
    sub: "text-sm",
    rule: "bottom-1.5 w-8",
  },
  md: {
    shell: "h-36 w-28 rounded-[24px]",
    frame: "inset-[7px] rounded-[18px]",
    halo: "h-24 w-24",
    ring: "h-24 w-24",
    innerRing: "h-16 w-16",
    label: "top-2 text-[7px]",
    sigil: "text-[13px]",
    main: "text-[4.6rem]",
    subWrap: "bottom-6",
    sub: "text-2xl",
    rule: "bottom-2 w-16",
  },
};

function getVariantIndex(variantKey?: string) {
  if (!variantKey) return 0;
  const hash = Array.from(variantKey).reduce((sum, char) => sum + char.charCodeAt(0), 0);
  return hash % 3;
}

export function getOracleCardArtMeta(category: GachaCategoryId, variantKey?: string) {
  const art = categoryArt[category];
  return art.variants[getVariantIndex(variantKey)];
}

export function OracleCardArt({ category, rarity, size = "md", variantKey }: OracleCardArtProps) {
  const art = categoryArt[category];
  const variant = art.variants[getVariantIndex(variantKey)];
  const sizing = sizeClass[size];
  const isPremium = rarity === "SR" || rarity === "SSR" || rarity === "UR";
  const isUltra = rarity === "UR";

  return (
    <div
      className={`oracle-card-art relative overflow-hidden border bg-slate-950/88 ${sizing.shell} ${rarityFrame[rarity]} ${
        isPremium ? "oracle-card-art-premium" : ""
      } ${isUltra ? "oracle-card-art-ur" : ""}`}
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${art.accent} opacity-18`} />
      <div className={`absolute border border-white/18 ${sizing.frame}`} />
      <div className="oracle-art-grid absolute inset-0 opacity-35" />
      <div className={`oracle-art-halo absolute left-1/2 top-[46%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br ${art.accent} ${sizing.halo}`} />
      <div className={`oracle-art-ring absolute left-1/2 top-[46%] -translate-x-1/2 -translate-y-1/2 rounded-full ${sizing.ring}`} />
      <div className={`oracle-art-ring oracle-art-ring-inner absolute left-1/2 top-[46%] -translate-x-1/2 -translate-y-1/2 rounded-full ${sizing.innerRing}`} />

      <div className={`absolute left-0 right-0 text-center font-black tracking-[0.24em] text-white/48 ${sizing.label}`}>
        {variant.label}
      </div>

      {variant.sigils.map((sigil, index) => (
        <span
          className={`oracle-art-sigil absolute font-black text-white/58 ${sizing.sigil}`}
          key={`${sigil}-${index}`}
          style={{
            left: index % 2 === 0 ? "13%" : "78%",
            top: index < 2 ? "25%" : "72%",
            animationDelay: `${index * 0.18}s`,
          }}
        >
          {sigil}
        </span>
      ))}

      <div className="absolute inset-0 grid place-items-center">
        <div className={`oracle-art-main bg-gradient-to-br ${art.accent} bg-clip-text font-black leading-none text-transparent ${sizing.main}`}>
          {variant.main}
        </div>
      </div>
      <div className={`absolute inset-x-0 text-center ${sizing.subWrap}`}>
        <span className={`bg-gradient-to-r ${art.accent} bg-clip-text font-black text-transparent drop-shadow-[0_0_16px_rgba(255,255,255,0.45)] ${sizing.sub}`}>
          {variant.sub}
        </span>
      </div>
      <div className={`absolute left-1/2 h-px -translate-x-1/2 bg-gradient-to-r from-transparent via-white/60 to-transparent ${sizing.rule}`} />
      {isPremium ? <div className="oracle-art-shine absolute inset-0" /> : null}
    </div>
  );
}
