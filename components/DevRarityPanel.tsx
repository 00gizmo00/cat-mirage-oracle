import { type Rarity } from "@/lib/rarity";

type FixedRarity = Rarity | "AUTO";

type DevRarityPanelProps = {
  disabled: boolean;
  fixedRarity: FixedRarity;
  onChange: (rarity: FixedRarity) => void;
};

const options: FixedRarity[] = ["AUTO", "N", "R", "SR", "SSR", "UR"];

export function DevRarityPanel({ disabled, fixedRarity, onChange }: DevRarityPanelProps) {
  return (
    <section className="px-4">
      <div className="rounded-3xl border border-white/10 bg-white/[0.055] p-3 shadow-[0_0_24px_rgba(0,0,0,0.18)]">
        <div className="mb-2 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-black tracking-[0.26em] text-amber-100/60">DEV SUMMON</p>
            <h2 className="text-sm font-black text-white">レア度固定テスト</h2>
          </div>
          <span className="rounded-full border border-amber-100/20 bg-amber-100/10 px-2 py-1 text-[10px] font-bold text-amber-50">
            調整用
          </span>
        </div>
        <div className="grid grid-cols-6 gap-1.5">
          {options.map((option) => {
            const active = fixedRarity === option;

            return (
              <button
                className={`rounded-xl border px-2 py-2 text-[11px] font-black transition active:scale-95 ${
                  active
                    ? "border-amber-100/50 bg-amber-200/18 text-amber-50 shadow-[0_0_18px_rgba(250,204,21,0.18)]"
                    : "border-white/10 bg-black/18 text-white/45"
                } ${disabled ? "cursor-not-allowed opacity-50" : ""}`}
                disabled={disabled}
                key={option}
                onClick={() => onChange(option)}
                type="button"
              >
                {option}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
