"use client";

import { useEffect, useState } from "react";

export type RewardAction = "detail" | "ur-reroll" | "restore-draws";

type RewardAdModalProps = {
  action: RewardAction;
  onClose: () => void;
  onComplete: () => void;
};

const actionCopy: Record<RewardAction, { title: string; reward: string; body: string }> = {
  detail: {
    title: "詳細神託を解放",
    reward: "結果カードに追加診断を表示",
    body: "ここは将来、リワード広告SDKを呼び出す場所です。今はMVP用のダミー広告として動作します。",
  },
  "ur-reroll": {
    title: "UR再抽選",
    reward: "同じカテゴリでUR確定の神託を再召喚",
    body: "本番では広告視聴完了コールバック後に、UR確定抽選を実行します。",
  },
  "restore-draws": {
    title: "召喚回数を回復",
    reward: "今日の無料召喚を3回追加",
    body: "本番ではリワード広告視聴完了後に、無料回数や専用チケットを付与します。",
  },
};

export function RewardAdModal({ action, onClose, onComplete }: RewardAdModalProps) {
  const [watching, setWatching] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(3);
  const copy = actionCopy[action];

  useEffect(() => {
    if (!watching) return;

    if (secondsLeft === 0) {
      onComplete();
      return;
    }

    const timer = window.setTimeout(() => setSecondsLeft((current) => current - 1), 800);
    return () => window.clearTimeout(timer);
  }, [onComplete, secondsLeft, watching]);

  return (
    <div className="absolute inset-0 z-50 grid place-items-center bg-black/76 px-5 backdrop-blur-md">
      <section className="relative w-full overflow-hidden rounded-[30px] border border-white/18 bg-slate-950 p-4 shadow-[0_0_60px_rgba(168,85,247,0.38)]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(250,204,21,0.18),transparent_38%),radial-gradient(circle_at_85%_82%,rgba(217,70,239,0.18),transparent_34%)]" />
        <div className="relative">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-black tracking-[0.28em] text-amber-100/60">REWARD AD</p>
              <h2 className="mt-1 text-xl font-black text-white">{copy.title}</h2>
            </div>
            <button
              className="grid h-9 w-9 place-items-center rounded-full border border-white/10 bg-white/5 text-white/60 active:scale-95"
              disabled={watching}
              onClick={onClose}
              type="button"
            >
              ×
            </button>
          </div>

          <div className="grid min-h-36 place-items-center rounded-3xl border border-dashed border-amber-100/25 bg-black/28 p-4 text-center">
            <p className="text-[10px] font-black tracking-[0.3em] text-white/35">ADVERTISEMENT MOCK</p>
            <p className="mt-2 text-2xl font-black text-amber-50">{watching ? `${secondsLeft}` : "AD"}</p>
            <p className="mt-2 text-xs leading-5 text-white/48">{copy.body}</p>
          </div>

          <div className="mt-3 rounded-2xl border border-cyan-100/16 bg-cyan-200/8 p-3">
            <p className="text-[10px] font-black tracking-[0.22em] text-cyan-100/50">REWARD</p>
            <p className="mt-1 text-sm font-bold text-cyan-50">{copy.reward}</p>
          </div>

          <button
            className="mt-4 w-full rounded-2xl border border-amber-100/35 bg-gradient-to-r from-amber-500 via-fuchsia-600 to-violet-700 px-4 py-3 text-sm font-black tracking-[0.1em] text-white shadow-[0_0_28px_rgba(250,204,21,0.25)] disabled:opacity-60"
            disabled={watching}
            onClick={() => {
              setWatching(true);
              setSecondsLeft(3);
            }}
            type="button"
          >
            {watching ? "視聴中..." : "広告を見る"}
          </button>
        </div>
      </section>
    </div>
  );
}
