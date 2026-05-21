export type Mission = {
  id: string;
  title: string;
  body: string;
  reward: number;
  completed: boolean;
  progress: number;
  goal: number;
};

type DailyMissionsPanelProps = {
  claimedIds: string[];
  missions: Mission[];
  onClaim: (mission: Mission) => void;
};

export function DailyMissionsPanel({ claimedIds, missions, onClaim }: DailyMissionsPanelProps) {
  const completedCount = missions.filter((mission) => mission.completed).length;

  return (
    <section className="px-4">
      <div className="rounded-3xl border border-white/10 bg-white/[0.055] p-3">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-black tracking-[0.26em] text-amber-100/60">DAILY MISSIONS</p>
            <h2 className="text-sm font-black text-white">本日の任務</h2>
          </div>
          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-bold text-white/55">
            {completedCount} / {missions.length}
          </span>
        </div>

        <div className="space-y-2">
          {missions.map((mission) => {
            const claimed = claimedIds.includes(mission.id);
            const progress = Math.max(0, Math.min(100, (mission.progress / mission.goal) * 100));

            return (
              <article className="rounded-2xl border border-white/10 bg-black/20 p-3" key={mission.id}>
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="text-sm font-black text-white">{mission.title}</h3>
                    <p className="mt-1 text-[11px] leading-5 text-white/50">{mission.body}</p>
                  </div>
                  <button
                    className={`shrink-0 rounded-xl border px-3 py-2 text-[10px] font-black ${
                      claimed
                        ? "border-white/10 bg-white/5 text-white/35"
                        : mission.completed
                          ? "border-amber-100/35 bg-amber-200/14 text-amber-50 shadow-[0_0_18px_rgba(250,204,21,0.16)]"
                          : "border-white/10 bg-white/5 text-white/35"
                    }`}
                    disabled={!mission.completed || claimed}
                    onClick={() => onClaim(mission)}
                    type="button"
                  >
                    {claimed ? "受取済" : `+${mission.reward}回`}
                  </button>
                </div>
                <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-cyan-300 via-fuchsia-300 to-amber-200 transition-all"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <p className="mt-1 text-right text-[10px] font-semibold text-white/38">
                  {Math.min(mission.progress, mission.goal)} / {mission.goal}
                </p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
