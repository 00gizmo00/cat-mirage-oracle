import { getCategory, type FortuneResult } from "@/lib/gachaData";
import { rarityMeta } from "@/lib/rarity";
import { OracleCardArt } from "./OracleCardArt";

type HistoryPanelProps = {
  history: FortuneResult[];
  onClear: () => void;
};

export function HistoryPanel({ history, onClear }: HistoryPanelProps) {
  return (
    <section className="px-4">
      <div className="rounded-3xl border border-white/10 bg-white/[0.055] p-3">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-black tracking-[0.26em] text-violet-100/55">ORACLE LOG</p>
            <h2 className="text-sm font-black text-white">召喚ログ</h2>
          </div>
          <button
            className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-bold text-white/50 active:scale-95"
            onClick={onClear}
            type="button"
          >
            クリア
          </button>
        </div>

        {history.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/12 bg-black/18 px-4 py-5 text-center text-xs leading-5 text-white/45">
            まだ履歴はありません。
            <br />
            神託を引くとここに記録されます。
          </div>
        ) : (
          <div className="max-h-64 space-y-2 overflow-y-auto pr-1">
            {history.map((result, index) => {
              const category = getCategory(result.category);
              const meta = rarityMeta[result.rarity];

              return (
                <article
                  className="flex gap-3 rounded-2xl border border-white/10 bg-black/20 p-3"
                  key={`${result.id}-${index}`}
                >
                  <OracleCardArt category={result.category} rarity={result.rarity} size="sm" variantKey={result.id} />
                  <div className="min-w-0 flex-1">
                    <div className="mb-1 flex items-center justify-between gap-2">
                      <span className={`rounded-full border px-2 py-0.5 text-[10px] font-black ${meta.badge}`}>
                        {result.rarity}
                      </span>
                      <span className="truncate text-[10px] font-bold text-white/45">{category.name}</span>
                    </div>
                    <h3 className="truncate text-sm font-black text-white">{result.title}</h3>
                    <p className="mt-1 line-clamp-2 text-[11px] leading-5 text-white/55">{result.word}</p>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
