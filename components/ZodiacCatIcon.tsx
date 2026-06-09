import type { ZodiacSign } from "@/lib/zodiac";

type ZodiacCatIconProps = {
  sign: Pick<ZodiacSign, "name" | "english" | "motif" | "symbol" | "imageSrc">;
  size?: "sm" | "md" | "lg";
};

const sizeClasses = {
  sm: "h-16 w-16",
  md: "h-24 w-24",
  lg: "h-36 w-36",
};

export function ZodiacCatIcon({ sign, size = "md" }: ZodiacCatIconProps) {
  return (
    <div
      className={`relative grid shrink-0 place-items-center overflow-hidden rounded-[22%] border border-amber-100/36 bg-[#050713] p-1 shadow-[0_0_28px_rgba(217,190,119,0.16)] ${sizeClasses[size]}`}
      aria-label={`${sign.name}の黒猫アイコン`}
      title={`${sign.name} ${sign.motif}`}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_12%,rgba(217,190,119,0.18),transparent_34%),radial-gradient(circle_at_50%_82%,rgba(88,28,135,0.28),transparent_42%)]" />
      {sign.imageSrc ? (
        <img
          alt={`${sign.name}の猫星イラスト`}
          className="relative h-full w-full rounded-[18%] object-cover shadow-[inset_0_0_0_1px_rgba(217,190,119,0.25)]"
          draggable={false}
          src={sign.imageSrc}
        />
      ) : (
        <div className="relative grid h-full w-full place-items-center rounded-[18%] border border-amber-100/18 bg-black/50 text-center">
          <span className="text-lg font-black text-amber-100">{sign.symbol}</span>
        </div>
      )}
      <div className="pointer-events-none absolute inset-1 rounded-[18%] border border-amber-100/22" />
      <div className="pointer-events-none absolute inset-2 rounded-[14%] border border-amber-100/10" />
    </div>
  );
}
