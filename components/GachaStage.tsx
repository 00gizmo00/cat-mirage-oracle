import { getCategory, type FortuneResult, type GachaCategoryId } from "@/lib/gachaData";
import { rarityMeta, type Rarity } from "@/lib/rarity";
import { OracleCardArt } from "./OracleCardArt";
import { ResultCard } from "./ResultCard";

export type AnimationPhase = "idle" | "charge" | "reveal" | "result";

type GachaStageProps = {
  canDraw: boolean;
  detailUnlocked: boolean;
  duplicateShards: number;
  drawsLeft: number;
  animationPhase: AnimationPhase;
  isNewCard: boolean;
  isDrawing: boolean;
  predictedRarity: Rarity | null;
  result: FortuneResult | null;
  selectedCategory: GachaCategoryId;
  onDraw: () => void;
  onRequestDetail: () => void;
  onRequestUrReroll: () => void;
  onReset: () => void;
};

const particlePositions = [
  ["12%", "72%", "0s"],
  ["22%", "42%", "0.18s"],
  ["34%", "80%", "0.33s"],
  ["46%", "28%", "0.08s"],
  ["58%", "66%", "0.26s"],
  ["68%", "46%", "0.41s"],
  ["78%", "74%", "0.14s"],
  ["88%", "36%", "0.31s"],
];

const sparkPositions = [
  ["10%", "22%", "0.05s"],
  ["18%", "64%", "0.24s"],
  ["29%", "36%", "0.12s"],
  ["40%", "78%", "0.36s"],
  ["52%", "18%", "0.18s"],
  ["63%", "70%", "0.02s"],
  ["74%", "30%", "0.3s"],
  ["86%", "56%", "0.16s"],
  ["91%", "20%", "0.42s"],
  ["8%", "82%", "0.5s"],
];

const lightningBolts = [
  ["15%", "18%", "-18deg", "0.04s"],
  ["74%", "16%", "17deg", "0.18s"],
  ["25%", "66%", "21deg", "0.28s"],
  ["82%", "62%", "-22deg", "0.12s"],
];

export function GachaStage({
  canDraw,
  detailUnlocked,
  duplicateShards,
  drawsLeft,
  animationPhase,
  isNewCard,
  isDrawing,
  predictedRarity,
  result,
  selectedCategory,
  onDraw,
  onRequestDetail,
  onRequestUrReroll,
  onReset,
}: GachaStageProps) {
  const category = getCategory(selectedCategory);
  const activeRarity = result?.rarity ?? predictedRarity ?? "R";
  const meta = rarityMeta[activeRarity];
  const isSr = activeRarity === "SR";
  const isSsr = activeRarity === "SSR";
  const isUr = activeRarity === "UR";
  const isHighRarity = isSr || isSsr || isUr;
  const showSummonFx = isDrawing && (animationPhase === "charge" || animationPhase === "reveal");
  const showPremiumFx = isDrawing && isHighRarity;
  const showCutIn = isDrawing && (isSsr || isUr) && animationPhase === "reveal";
  const showRarity = isDrawing && animationPhase === "reveal";

  if (result && animationPhase === "result") {
    return (
      <div className="px-4">
        <ResultCard
          detailUnlocked={detailUnlocked}
          duplicateShards={duplicateShards}
          isNewCard={isNewCard}
          result={result}
          onRequestDetail={onRequestDetail}
          onRequestUrReroll={onRequestUrReroll}
          onReset={onReset}
        />
      </div>
    );
  }

  return (
    <section className="px-4">
      <div
        className={`mystic-noise relative min-h-[372px] overflow-hidden rounded-[32px] border border-white/15 bg-black/35 p-4 shadow-oracle transition duration-500 ${meta.stage} ${
          isSsr && isDrawing ? "animate-shake" : ""
        }`}
      >
        {showSummonFx ? (
          <>
            <div className={`summon-vortex pointer-events-none absolute inset-[-18%] ${isUr ? "summon-vortex-ur" : ""}`} />
            <div className="screen-burst pointer-events-none absolute inset-0" />
            <div className="spark-field pointer-events-none absolute inset-0">
              {sparkPositions.map(([left, top, delay], index) => (
                <span
                  key={`${left}-${top}`}
                  style={{
                    left,
                    top,
                    animationDelay: delay,
                    color: isUr
                      ? index % 3 === 0
                        ? "#67e8f9"
                        : index % 2
                          ? "#fde68a"
                          : "#f0abfc"
                      : isSsr
                        ? "#f0abfc"
                        : isSr
                          ? "#fde68a"
                          : "#c4b5fd",
                  }}
                />
              ))}
            </div>
          </>
        ) : null}

        {isDrawing && isHighRarity ? (
          <div className="particle-field pointer-events-none absolute inset-0">
            {particlePositions.map(([left, top, delay], index) => (
              <span
                key={`${left}-${top}`}
                style={{
                  left,
                  top,
                  animationDelay: delay,
                  color: isUr ? (index % 2 ? "#f0abfc" : "#fde68a") : "#d8b4fe",
                }}
              />
            ))}
          </div>
        ) : null}

        {showPremiumFx ? (
          <div className="shockwave-field pointer-events-none absolute inset-0">
            <span className={isUr ? "shockwave-ur" : ""} />
            <span className={isUr ? "shockwave-ur" : ""} />
            <span className={isUr ? "shockwave-ur" : ""} />
          </div>
        ) : null}

        {isDrawing && (isSsr || isUr) ? (
          <div className="lightning-field pointer-events-none absolute inset-0">
            {lightningBolts.map(([left, top, rotate, delay]) => (
              <span
                key={`${left}-${top}`}
                style={{
                  left,
                  top,
                  rotate,
                  animationDelay: delay,
                  color: isUr ? "#fde68a" : "#f0abfc",
                }}
              />
            ))}
          </div>
        ) : null}

        {isUr && isDrawing ? (
          <div className="absolute inset-0 bg-[conic-gradient(from_180deg,rgba(250,204,21,0.34),rgba(217,70,239,0.34),rgba(34,211,238,0.28),rgba(250,204,21,0.34))] opacity-90 blur-md" />
        ) : null}
        {isSsr && isDrawing ? <div className="absolute inset-0 bg-black/62" /> : null}
        {showCutIn ? (
          <div className="oracle-cut-in absolute left-[-12%] top-24 z-20 w-[124%] border-y border-white/30 bg-black/80 py-4 text-center shadow-[0_0_42px_rgba(217,70,239,0.55)]">
            <p className={`text-sm font-black tracking-[0.34em] ${isUr ? "text-amber-100" : "text-fuchsia-100"}`}>
              {isUr ? "FORBIDDEN ORACLE" : "FATE REVERSAL"}
            </p>
            <p className={`mt-1 text-3xl font-black tracking-[0.08em] ${isUr ? "text-amber-50" : "text-purple-50"}`}>
              {isUr ? "禁断神託 解放" : "運命反転"}
            </p>
          </div>
        ) : null}
        {showRarity ? (
          <div className="pointer-events-none absolute inset-0 z-10 grid place-items-center">
            <div className={`rarity-slam text-7xl font-black tracking-[0.1em] ${isUr ? "text-amber-100" : isSsr ? "text-fuchsia-100" : "text-violet-100"} drop-shadow-[0_0_28px_rgba(255,255,255,0.8)]`}>
              {activeRarity}
            </div>
          </div>
        ) : null}
        {showRarity && (isSsr || isUr) ? (
          <div className={`oracle-flash pointer-events-none absolute inset-0 z-30 ${isUr ? "bg-amber-100" : "bg-purple-200"}`} />
        ) : null}

        <div className="relative flex min-h-[340px] flex-col items-center justify-between rounded-[26px] border border-white/10 bg-slate-950/55 px-4 py-5">
          <div className="flex w-full items-center justify-between text-[11px] font-bold tracking-[0.2em] text-white/48">
            <span>{category.name}</span>
            <span>{isDrawing ? "CASTING" : "READY"}</span>
          </div>

          <div className="relative grid h-52 w-52 place-items-center">
            <div className={`absolute h-52 w-52 rounded-full border border-white/10 bg-gradient-to-br ${category.tone} opacity-20 blur-xl`} />
            {showSummonFx ? <div className={`absolute h-60 w-60 rounded-full ${isUr ? "ur-prism-ring" : "summon-ring"}`} /> : null}
            <div className={`absolute h-44 w-44 animate-spinSlow rounded-full border border-dashed ${isHighRarity ? "border-fuchsia-200/70" : "border-violet-200/35"}`} />
            <div className={`absolute h-32 w-32 rounded-full border ${isHighRarity ? "border-amber-100/60" : "border-white/15"} animate-pulseRune`} />
            <div className="absolute text-[9rem] leading-none text-white/5">✦</div>
            <div
              className={`relative grid place-items-center transition ${
                isDrawing ? "scale-110 rotate-6" : "animate-floaty"
              } ${isHighRarity && isDrawing ? "card-summon-burst" : ""}`}
            >
              <OracleCardArt category={selectedCategory} rarity={activeRarity} size="sm" />
              {isDrawing ? <span className="absolute inset-y-0 left-0 w-10 animate-shimmer bg-white/25 blur-sm" /> : null}
            </div>
          </div>

          <div className="w-full text-center">
            {isUr && isDrawing ? (
              <p className="animate-urBurst text-xl font-black tracking-[0.12em] text-amber-100 drop-shadow-[0_0_18px_rgba(250,204,21,0.85)]">
                禁断神託 解放
              </p>
            ) : isSsr && isDrawing ? (
              <p className="text-lg font-black tracking-[0.14em] text-purple-100 drop-shadow-[0_0_16px_rgba(168,85,247,0.8)]">
                運命反転中...
              </p>
            ) : isDrawing ? (
              <p className="text-sm font-bold tracking-[0.16em] text-violet-100/80">星読み演算中...</p>
            ) : (
              <div>
                <p className="text-2xl font-black text-white">神託を起動</p>
                <p className="mt-1 text-xs leading-5 text-white/48">{category.description}</p>
              </div>
            )}

            <button
              className={`mt-4 w-full overflow-hidden rounded-2xl border px-5 py-4 text-base font-black tracking-[0.12em] text-white transition active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-55 ${
                isDrawing
                  ? "border-white/10 bg-white/10"
                  : "border-fuchsia-100/35 bg-gradient-to-r from-violet-700 via-fuchsia-600 to-amber-500 shadow-[0_0_34px_rgba(217,70,239,0.45)]"
              }`}
              disabled={isDrawing || !canDraw}
              onClick={() => onDraw()}
              type="button"
            >
              {isDrawing ? "召喚中" : canDraw ? "神託を引く" : "本日の無料分終了"}
            </button>
            {!isDrawing && !canDraw ? (
              <p className="mt-2 text-[11px] font-semibold text-amber-100/70">
                広告を見ると3回分だけ回復できます。
              </p>
            ) : (
              <p className="mt-2 text-[11px] font-semibold text-white/38">本日の残り召喚 {drawsLeft} 回</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
