import type { ZodiacSign } from "@/lib/zodiac";

type ZodiacCatIconProps = {
  sign: Pick<ZodiacSign, "name" | "english" | "motif" | "symbol">;
  size?: "sm" | "md" | "lg";
};

const sizeClasses = {
  sm: "h-14 w-14",
  md: "h-20 w-20",
  lg: "h-28 w-28",
};

export function ZodiacCatIcon({ sign, size = "md" }: ZodiacCatIconProps) {
  return (
    <div
      className={`relative grid shrink-0 place-items-center overflow-hidden rounded-full border border-amber-100/32 bg-[#050713] shadow-[0_0_28px_rgba(217,190,119,0.16)] ${sizeClasses[size]}`}
      aria-label={`${sign.name}の黒猫アイコン`}
      title={`${sign.name} ${sign.motif}`}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_28%,rgba(217,190,119,0.18),transparent_34%),radial-gradient(circle_at_50%_78%,rgba(88,28,135,0.34),transparent_42%)]" />
      <div className="absolute inset-[7px] rounded-full border border-amber-100/18" />
      <div className="absolute left-1/2 top-[18%] h-[38%] w-[48%] -translate-x-1/2 rounded-full border border-amber-100/26 bg-black/74" />
      <div className="absolute left-[28%] top-[15%] h-[25%] w-[18%] rotate-[-18deg] border-l border-t border-amber-100/45 bg-black/70" />
      <div className="absolute right-[28%] top-[15%] h-[25%] w-[18%] rotate-[18deg] border-r border-t border-amber-100/45 bg-black/70" />
      <div className="absolute left-[36%] top-[34%] h-1.5 w-1.5 rounded-full bg-amber-100 shadow-[0_0_8px_rgba(250,204,21,0.6)]" />
      <div className="absolute right-[36%] top-[34%] h-1.5 w-1.5 rounded-full bg-amber-100 shadow-[0_0_8px_rgba(250,204,21,0.6)]" />
      <div className="absolute top-[49%] text-[10px] font-black text-amber-100/80">{sign.symbol}</div>
      <div className="absolute bottom-[13%] rounded-full border border-amber-100/26 bg-black/46 px-2 py-0.5 font-serif text-[8px] font-bold tracking-[0.14em] text-amber-50/72">
        {sign.english}
      </div>
      <div className="absolute top-[7%] font-serif text-[10px] font-black text-amber-100/74">{sign.motif}</div>
    </div>
  );
}
