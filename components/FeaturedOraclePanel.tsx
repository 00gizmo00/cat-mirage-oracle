import { getCategory, type FortuneResult } from "@/lib/gachaData";
import { rarityMeta } from "@/lib/rarity";
import { OracleCardArt } from "./OracleCardArt";

type FeaturedOraclePanelProps = {
  history: FortuneResult[];
  onOpenArchive: () => void;
};

const rarityRank = {
  N: 1,
  R: 2,
  SR: 3,
  SSR: 4,
  UR: 5,
};

export function FeaturedOraclePanel({ history, onOpenArchive }: FeaturedOraclePanelProps) {
  const featured = [...history].sort((a, b) => rarityRank[b.rarity] - rarityRank[a.rarity])[0];

  return (
    <section className="px-4">
      <div className="rounded-3xl border border-white/10 bg-white/[0.055] p-3">
        <div className="mb-3 flex items-center justify-between gap-3">
          <div>
            <p className="text-[10px] font-black tracking-[0.26em] text-amber-100/60">BEST ORACLE</p>
            <h2 className="text-sm font-black text-white">所持中の最高神託</h2>
          </div>
          <button
            className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-black text-white/58 active:scale-95"
            onClick={onOpenArchive}
            type="button"
          >
            図鑑へ
          </button>
        </div>

        {featured ? (
          <div className="flex gap-3 rounded-2xl border border-white/10 bg-black/20 p-3">
            <OracleCardArt category={featured.category} rarity={featured.rarity} size="sm" variantKey={featured.id} />
            <div className="min-w-0 flex-1">
              <div className="mb-1 flex items-center gap-2">
                <span className={`rounded-full border px-2 py-0.5 text-[10px] font-black ${rarityMeta[featured.rarity].badge}`}>
                  {featured.rarity}
                </span>
                <span className="truncate text-[10px] font-bold text-white/45">{getCategory(featured.category).name}</span>
              </div>
              <h3 className="truncate text-sm font-black text-white">{featured.title}</h3>
              <p className="mt-1 line-clamp-2 text-[11px] leading-5 text-white/55">{featured.word}</p>
            </div>
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-white/12 bg-black/18 px-4 py-5 text-center text-xs leading-5 text-white/45">
            まだ神託カードはありません。
            <br />
            まずは一枚、運命を開いてください。
          </div>
        )}
      </div>
    </section>
  );
}
