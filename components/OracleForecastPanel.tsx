import { getCategory, type GachaCategoryId } from "@/lib/gachaData";
import { rarityWeights, type Rarity } from "@/lib/rarity";
import { OracleCardArt } from "./OracleCardArt";

type OracleForecastPanelProps = {
  pityCount: number;
  pityLimit: number;
  selectedCategory: GachaCategoryId;
};

const rareOrder: Rarity[] = ["UR", "SSR", "SR", "R", "N"];

export function OracleForecastPanel({ pityCount, pityLimit, selectedCategory }: OracleForecastPanelProps) {
  const category = getCategory(selectedCategory);
  const remaining = Math.max(0, pityLimit - pityCount);
  const gauge = Math.min(100, (pityCount / pityLimit) * 100);

  return (
    <section className="px-4">
      <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.055] p-3">
        <div className="mb-3 flex items-center gap-3">
          <OracleCardArt category={selectedCategory} rarity={remaining <= 1 ? "SSR" : "SR"} size="sm" />
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-black tracking-[0.26em] text-fuchsia-100/55">FATE FORECAST</p>
            <h2 className="truncate text-sm font-black text-white">{category.name}</h2>
            <p className="mt-1 text-[11px] leading-5 text-white/50">
              {remaining <= 1
                ? "次の神託は高レアの気配が濃くなっています。"
                : `禁断ゲージ発動まで残り ${remaining} 回`}
            </p>
          </div>
        </div>

        <div className="mb-3 h-2 overflow-hidden rounded-full bg-black/35">
          <div
            className="h-full rounded-full bg-gradient-to-r from-violet-400 via-fuchsia-300 to-amber-200 shadow-[0_0_20px_rgba(217,70,239,0.34)] transition-all"
            style={{ width: `${gauge}%` }}
          />
        </div>

        <div className="grid grid-cols-5 gap-1.5">
          {rareOrder.map((rarity) => (
            <div className="rounded-xl border border-white/10 bg-black/20 px-1.5 py-2 text-center" key={rarity}>
              <p className="text-[10px] font-black text-white">{rarity}</p>
              <p className="mt-0.5 text-[10px] font-bold text-white/44">{rarityWeights[rarity]}%</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
