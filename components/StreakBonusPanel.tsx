type StreakBonusPanelProps = {
  bonusAmount: number;
  canClaim: boolean;
  streak: number;
  onClaim: () => void;
};

export function StreakBonusPanel({ bonusAmount, canClaim, streak, onClaim }: StreakBonusPanelProps) {
  return (
    <section className="px-4">
      <div className="relative overflow-hidden rounded-3xl border border-cyan-100/16 bg-cyan-200/[0.06] p-3">
        <div className="absolute -left-8 -top-10 h-24 w-24 rounded-full bg-cyan-300/20 blur-2xl" />
        <div className="relative flex items-center justify-between gap-3">
          <div>
            <p className="text-[10px] font-black tracking-[0.28em] text-cyan-100/60">DAILY RITUAL</p>
            <h2 className="mt-1 text-sm font-black text-white">連続参拝 {streak} 日目</h2>
            <p className="mt-1 text-[11px] leading-5 text-white/48">
              今日の参拝報酬で召喚ストックを回復できます。
            </p>
          </div>
          <button
            className={`shrink-0 rounded-2xl border px-3 py-2 text-[11px] font-black active:scale-95 ${
              canClaim
                ? "border-cyan-100/35 bg-cyan-200/14 text-cyan-50 shadow-[0_0_18px_rgba(34,211,238,0.16)]"
                : "border-white/10 bg-white/5 text-white/35"
            }`}
            disabled={!canClaim}
            onClick={onClaim}
            type="button"
          >
            {canClaim ? `+${bonusAmount}回` : "受取済"}
          </button>
        </div>
      </div>
    </section>
  );
}
