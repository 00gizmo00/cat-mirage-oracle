import { categories, fortuneResults, type GachaCategoryId } from "@/lib/gachaData";
import { rarityMeta, type Rarity } from "@/lib/rarity";
import { OracleCardArt } from "./OracleCardArt";

type CollectionPanelProps = {
  discoveredIds: string[];
};

const rarityOrder: Rarity[] = ["N", "R", "SR", "SSR", "UR"];
const totalSlots = fortuneResults.length;

export function CollectionPanel({ discoveredIds }: CollectionPanelProps) {
  const discovered = new Set(discoveredIds);
  const discoveredCount = discovered.size;
  const progress = Math.round((discoveredCount / totalSlots) * 100);

  const categoryResults = (categoryId: GachaCategoryId) =>
    fortuneResults.filter((result) => result.category === categoryId);

  const categoryProgress = (categoryId: GachaCategoryId) =>
    categoryResults(categoryId).filter((result) => discovered.has(result.id)).length;

  return (
    <section className="px-4">
      <div className="rounded-3xl border border-white/10 bg-white/[0.055] p-3">
        <div className="mb-3 flex items-center justify-between gap-3">
          <div>
            <p className="text-[10px] font-black tracking-[0.26em] text-cyan-100/55">ORACLE ARCHIVE</p>
            <h2 className="text-sm font-black text-white">神託カード図鑑</h2>
          </div>
          <div className="text-right">
            <p className="text-lg font-black text-amber-100">{progress}%</p>
            <p className="text-[10px] font-semibold text-white/42">
              {discoveredCount} / {totalSlots}
            </p>
          </div>
        </div>

        <div className="mb-3 h-2 overflow-hidden rounded-full bg-black/30">
          <div
            className="h-full rounded-full bg-gradient-to-r from-cyan-300 via-fuchsia-300 to-amber-200 shadow-[0_0_18px_rgba(34,211,238,0.28)] transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>

        <p className="mb-3 rounded-2xl border border-white/10 bg-black/18 px-3 py-2 text-[11px] leading-5 text-white/50">
          各カテゴリに15枚、合計75枚。 同じレア度でも3種類の神託カードがあります。
        </p>

        <div className="space-y-3">
          {categories.map((category) => {
            const unlocked = categoryProgress(category.id);
            const total = categoryResults(category.id).length;

            return (
              <article className="rounded-2xl border border-white/10 bg-black/18 p-3" key={category.id}>
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex min-w-0 items-center gap-2">
                    <span className={`h-2.5 w-2.5 shrink-0 rounded-full bg-gradient-to-r ${category.tone}`} />
                    <h3 className="truncate text-xs font-black text-white">{category.name}</h3>
                  </div>
                  <span className="text-[10px] font-bold text-white/42">
                    {unlocked} / {total}
                  </span>
                </div>

                <div className="space-y-2">
                  {rarityOrder.map((rarity) => {
                    const cards = fortuneResults.filter(
                      (result) => result.category === category.id && result.rarity === rarity,
                    );
                    const foundCount = cards.filter((card) => discovered.has(card.id)).length;
                    const meta = rarityMeta[rarity];

                    return (
                      <div className="rounded-2xl border border-white/8 bg-white/[0.035] p-2" key={rarity}>
                        <div className="mb-2 flex items-center justify-between">
                          <span className={`rounded-full border px-2 py-0.5 text-[9px] font-black ${meta.badge}`}>
                            {rarity}
                          </span>
                          <span className="text-[9px] font-bold text-white/35">{foundCount} / {cards.length}</span>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                          {cards.map((card, index) => {
                            const found = discovered.has(card.id);

                            return (
                              <div
                                className={`grid place-items-center rounded-xl border py-2 ${
                                  found
                                    ? "border-white/12 bg-black/24"
                                    : "border-dashed border-white/10 bg-black/20"
                                }`}
                                key={card.id}
                              >
                                {found ? (
                                  <OracleCardArt
                                    category={card.category}
                                    rarity={card.rarity}
                                    size="xs"
                                    variantKey={card.id}
                                  />
                                ) : (
                                  <div className="grid h-14 w-10 place-items-center rounded-[10px] border border-dashed border-white/12 bg-black/35 text-[10px] font-black text-white/18">
                                    {index + 1}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
