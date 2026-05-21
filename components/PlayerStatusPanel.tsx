import { categories, type FortuneResult } from "@/lib/gachaData";
import { rarityMeta, type Rarity } from "@/lib/rarity";

type PlayerStatusPanelProps = {
  history: FortuneResult[];
  totalDraws: number;
};

const rarityOrder: Rarity[] = ["N", "R", "SR", "SSR", "UR"];
const totalCollectionSlots = categories.length * rarityOrder.length;

function getHighestRarity(history: FortuneResult[]): Rarity {
  const ranks = new Map<Rarity, number>(rarityOrder.map((rarity, index) => [rarity, index]));
  return history.reduce<Rarity>((highest, result) => {
    return (ranks.get(result.rarity) ?? 0) > (ranks.get(highest) ?? 0) ? result.rarity : highest;
  }, "N");
}

function getTitle(totalDraws: number, collectionRate: number, highestRarity: Rarity) {
  if (highestRarity === "UR") return "禁断神託の継承者";
  if (collectionRate >= 60) return "星図を埋める者";
  if (highestRarity === "SSR") return "運命反転の観測者";
  if (totalDraws >= 20) return "夜半の召喚士";
  if (totalDraws >= 7) return "電脳タロット見習い";
  return "はじまりの参拝者";
}

export function PlayerStatusPanel({ history, totalDraws }: PlayerStatusPanelProps) {
  const discovered = new Set(history.map((result) => `${result.category}:${result.rarity}`));
  const collectionRate = Math.round((discovered.size / totalCollectionSlots) * 100);
  const level = Math.max(1, Math.floor(totalDraws / 5) + 1);
  const levelProgress = ((totalDraws % 5) / 5) * 100;
  const highestRarity = getHighestRarity(history);
  const meta = rarityMeta[highestRarity];
  const title = getTitle(totalDraws, collectionRate, highestRarity);

  return (
    <section className="px-4">
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.055] p-3">
        <div className={`absolute -right-12 -top-14 h-28 w-28 rounded-full bg-gradient-to-br ${meta.aura} opacity-25 blur-2xl`} />
        <div className="relative">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-black tracking-[0.26em] text-violet-100/55">ORACLE STATUS</p>
              <h2 className="mt-1 text-base font-black text-white">{title}</h2>
            </div>
            <div className="text-right">
              <p className="text-xl font-black text-amber-100">Lv.{level}</p>
              <p className="text-[10px] font-semibold text-white/42">最高 {highestRarity}</p>
            </div>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-black/30">
            <div
              className="h-full rounded-full bg-gradient-to-r from-cyan-300 via-fuchsia-300 to-amber-200 transition-all"
              style={{ width: `${levelProgress}%` }}
            />
          </div>
          <div className="mt-2 grid grid-cols-3 gap-2 text-center text-[10px] font-semibold">
            <div className="rounded-xl border border-white/10 bg-black/18 px-2 py-2">
              <p className="text-white/38">召喚</p>
              <p className="mt-0.5 font-black text-white">{totalDraws}</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-black/18 px-2 py-2">
              <p className="text-white/38">図鑑</p>
              <p className="mt-0.5 font-black text-white">{collectionRate}%</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-black/18 px-2 py-2">
              <p className="text-white/38">解放</p>
              <p className="mt-0.5 font-black text-white">{discovered.size}/{totalCollectionSlots}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
