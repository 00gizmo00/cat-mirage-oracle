type ShardBankPanelProps = {
  lastDuplicateShards: number;
  soulShards: number;
};

export function ShardBankPanel({ lastDuplicateShards, soulShards }: ShardBankPanelProps) {
  const nextMilestone = soulShards >= 100 ? 100 : soulShards >= 50 ? 100 : 50;
  const progress = Math.min(100, (soulShards / nextMilestone) * 100);

  return (
    <section className="px-4">
      <div className="overflow-hidden rounded-3xl border border-amber-100/15 bg-amber-100/[0.07] p-3 shadow-[0_0_28px_rgba(250,204,21,0.08)]">
        <div className="mb-3 flex items-center justify-between gap-3">
          <div>
            <p className="text-[10px] font-black tracking-[0.26em] text-amber-100/60">DUPLICATE BONUS</p>
            <h2 className="text-sm font-black text-white">神託の欠片</h2>
          </div>
          <div className="rounded-2xl border border-amber-100/20 bg-black/24 px-3 py-2 text-right">
            <p className="text-xl font-black text-amber-100">{soulShards}</p>
            <p className="text-[9px] font-bold text-white/38">SHARDS</p>
          </div>
        </div>

        <div className="h-2 overflow-hidden rounded-full bg-black/35">
          <div
            className="h-full rounded-full bg-gradient-to-r from-amber-200 via-fuchsia-300 to-cyan-200 shadow-[0_0_18px_rgba(250,204,21,0.32)] transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="mt-2 flex items-center justify-between text-[10px] font-bold text-white/42">
          <span>欠片交換の予感</span>
          <span>{Math.min(soulShards, nextMilestone)} / {nextMilestone}</span>
        </div>

        {lastDuplicateShards > 0 ? (
          <div className="mt-3 rounded-2xl border border-fuchsia-100/18 bg-fuchsia-200/10 px-3 py-2 text-center">
            <p className="text-[10px] font-black tracking-[0.2em] text-fuchsia-100/70">DUPLICATE CONVERTED</p>
            <p className="mt-1 text-sm font-black text-white">+{lastDuplicateShards} 欠片を獲得</p>
          </div>
        ) : (
          <p className="mt-3 text-[11px] leading-5 text-white/48">
            所持済みカードは欠片に変換されます。高レアほど大量獲得。
          </p>
        )}
      </div>
    </section>
  );
}
