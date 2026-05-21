type DrawCounterProps = {
  drawsLeft: number;
  maxDrawStock: number;
  pityCount: number;
  pityLimit: number;
  totalDraws: number;
  nextResetLabel: string;
  onRestore: () => void;
};

export function DrawCounter({
  drawsLeft,
  maxDrawStock,
  pityCount,
  pityLimit,
  totalDraws,
  nextResetLabel,
  onRestore,
}: DrawCounterProps) {
  const progress = Math.max(0, Math.min(100, (drawsLeft / maxDrawStock) * 100));
  const pityProgress = Math.max(0, Math.min(100, (pityCount / pityLimit) * 100));
  const untilHighRarity = Math.max(0, pityLimit - pityCount);

  return (
    <section className="px-4">
      <div className="rounded-3xl border border-white/10 bg-white/[0.055] p-3">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-[10px] font-black tracking-[0.26em] text-amber-100/60">DAILY SUMMON</p>
            <h2 className="text-sm font-black text-white">
              召喚ストック <span className="text-amber-100">{drawsLeft}</span> / {maxDrawStock} 回
            </h2>
          </div>
          <button
            className="rounded-2xl border border-amber-100/25 bg-amber-200/10 px-3 py-2 text-[11px] font-black text-amber-50 active:scale-95"
            onClick={onRestore}
            type="button"
          >
            広告で+3
          </button>
        </div>
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-black/30">
          <div
            className="h-full rounded-full bg-gradient-to-r from-violet-500 via-fuchsia-400 to-amber-300 shadow-[0_0_18px_rgba(217,70,239,0.35)] transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="mt-3 rounded-2xl border border-fuchsia-100/12 bg-black/18 p-2">
          <div className="flex items-center justify-between text-[10px] font-black text-fuchsia-100/70">
            <span>禁断ゲージ</span>
            <span>{untilHighRarity === 0 ? "SSR以上確定" : `あと${untilHighRarity}回でSSR以上`}</span>
          </div>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-gradient-to-r from-fuchsia-500 via-purple-300 to-amber-200 transition-all"
              style={{ width: `${pityProgress}%` }}
            />
          </div>
        </div>
        <div className="mt-2 flex items-center justify-between text-[10px] font-semibold text-white/42">
          <span>広告・任務で回復可</span>
          <span>累計 {totalDraws} 回</span>
          <span>{nextResetLabel} リセット</span>
        </div>
      </div>
    </section>
  );
}
