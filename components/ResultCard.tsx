"use client";

import { useMemo, useState } from "react";
import { getCategory, type FortuneResult } from "@/lib/gachaData";
import { rarityMeta } from "@/lib/rarity";
import { getOracleCardArtMeta, OracleCardArt } from "./OracleCardArt";

type ResultCardProps = {
  detailUnlocked: boolean;
  duplicateShards: number;
  isNewCard: boolean;
  result: FortuneResult;
  onRequestDetail: () => void;
  onRequestUrReroll: () => void;
  onReset: () => void;
};

const resultBurstPieces = [
  ["8%", "18%", "-18deg", "0.03s"],
  ["18%", "78%", "22deg", "0.19s"],
  ["28%", "10%", "34deg", "0.31s"],
  ["41%", "88%", "-28deg", "0.12s"],
  ["55%", "8%", "-8deg", "0.24s"],
  ["68%", "82%", "18deg", "0.07s"],
  ["82%", "16%", "-34deg", "0.36s"],
  ["91%", "62%", "28deg", "0.15s"],
  ["12%", "48%", "8deg", "0.42s"],
  ["78%", "44%", "-12deg", "0.27s"],
];

function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function splitLines(value: string, maxLength: number) {
  const chars = Array.from(value);
  const lines: string[] = [];

  for (let index = 0; index < chars.length; index += maxLength) {
    lines.push(chars.slice(index, index + maxLength).join(""));
  }

  return lines;
}

function getSvgCardArt(result: FortuneResult) {
  return getOracleCardArtMeta(result.category, result.id);
}

function buildResultSvg(result: FortuneResult, categoryName: string) {
  const titleLines = splitLines(result.title, 11);
  const bodyLines = splitLines(result.body, 24).slice(0, 6);
  const wordLines = splitLines(result.word, 18).slice(0, 2);
  const cardArt = getSvgCardArt(result);
  const rareGradient =
    result.rarity === "UR"
      ? ["#fde68a", "#e879f9", "#67e8f9"]
      : result.rarity === "SSR"
        ? ["#e9d5ff", "#d946ef", "#7c3aed"]
        : ["#ddd6fe", "#8b5cf6", "#1e1b4b"];

  const text = (lines: string[], x: number, y: number, size: number, lineHeight: number, weight = "700") =>
    lines
      .map(
        (line, index) =>
          `<text x="${x}" y="${y + index * lineHeight}" font-size="${size}" font-weight="${weight}" fill="#fff7ed">${escapeXml(line)}</text>`,
      )
      .join("");

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1350" viewBox="0 0 1080 1350">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#05030a"/>
      <stop offset="0.5" stop-color="#241044"/>
      <stop offset="1" stop-color="#08040f"/>
    </linearGradient>
    <linearGradient id="rare" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${rareGradient[0]}"/>
      <stop offset="0.55" stop-color="${rareGradient[1]}"/>
      <stop offset="1" stop-color="${rareGradient[2]}"/>
    </linearGradient>
    <filter id="glow">
      <feGaussianBlur stdDeviation="15" result="coloredBlur"/>
      <feMerge>
        <feMergeNode in="coloredBlur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>
  <rect width="1080" height="1350" fill="url(#bg)"/>
  <circle cx="540" cy="330" r="250" fill="url(#rare)" opacity="0.25" filter="url(#glow)"/>
  <circle cx="170" cy="160" r="90" fill="#67e8f9" opacity="0.16"/>
  <circle cx="910" cy="1080" r="150" fill="#f0abfc" opacity="0.14"/>
  <rect x="76" y="76" width="928" height="1198" rx="58" fill="#090613" opacity="0.86" stroke="#ffffff" stroke-opacity="0.22" stroke-width="3"/>
  <rect x="116" y="116" width="848" height="112" rx="34" fill="#ffffff" opacity="0.08"/>
  <text x="148" y="164" font-size="24" font-weight="900" letter-spacing="10" fill="#f5d0fe">CYBER TAROT ORACLE</text>
  <text x="148" y="204" font-size="34" font-weight="900" fill="#ffffff">神託ガチャ</text>
  <text x="822" y="196" font-size="52" font-weight="900" fill="url(#rare)" text-anchor="middle">${result.rarity}</text>
  <rect x="200" y="298" width="680" height="340" rx="46" fill="#000000" opacity="0.28" stroke="#ffffff" stroke-opacity="0.18" stroke-width="2"/>
  <circle cx="540" cy="468" r="138" fill="none" stroke="url(#rare)" stroke-width="5" stroke-dasharray="18 15" opacity="0.9"/>
  <rect x="432" y="326" width="216" height="276" rx="38" fill="#090613" opacity="0.96" stroke="url(#rare)" stroke-opacity="0.9" stroke-width="4"/>
  <rect x="454" y="348" width="172" height="232" rx="26" fill="url(#rare)" opacity="0.2" stroke="#ffffff" stroke-opacity="0.24" stroke-width="2"/>
  <text x="540" y="384" font-size="20" font-weight="900" letter-spacing="4" fill="#fff7ed" opacity="0.65" text-anchor="middle">${cardArt.label}</text>
  <circle cx="540" cy="468" r="72" fill="none" stroke="url(#rare)" stroke-width="4" stroke-dasharray="13 10" opacity="0.95"/>
  <circle cx="540" cy="468" r="48" fill="none" stroke="#ffffff" stroke-width="2" opacity="0.34"/>
  <text x="540" y="500" font-size="112" font-weight="900" fill="url(#rare)" text-anchor="middle">${cardArt.main}</text>
  <text x="540" y="558" font-size="46" font-weight="900" fill="#fff7ed" opacity="0.9" text-anchor="middle">${cardArt.sub}</text>
  <text x="132" y="712" font-size="26" font-weight="900" letter-spacing="8" fill="#f0abfc">ORACLE RESULT</text>
  <text x="132" y="766" font-size="30" font-weight="800" fill="#d8b4fe">${escapeXml(categoryName)}</text>
  ${text(titleLines, 132, 842, 58, 68, "900")}
  ${text(bodyLines, 132, 1020, 34, 48, "600")}
  <rect x="132" y="1130" width="816" height="92" rx="28" fill="#fef3c7" opacity="0.11" stroke="#fde68a" stroke-opacity="0.28" stroke-width="2"/>
  <text x="162" y="1170" font-size="22" font-weight="900" letter-spacing="6" fill="#fde68a">TODAY'S WORD</text>
  ${text(wordLines, 162, 1208, 30, 40, "800")}
</svg>`;
}

function buildDetailOracle(result: FortuneResult, categoryName: string) {
  const details = {
    N: "今は派手に動くより、目の前の違和感をひとつ整えるほど運が安定します。",
    R: "小さな選択が次の流れを呼びます。誰かの言葉より、自分が軽くなる方を選んでください。",
    SR: "近いうちに、停滞していたものへ新しい意味が与えられます。準備していた人ほど早く気づけます。",
    SSR: "運命の向きが変わる前には、必ず微細なノイズが走ります。今日の違和感は捨てずに記録してください。",
    UR: "選ばなかった未来が、別の扉からあなたを呼んでいます。偶然を一度だけ信じると、世界線が近づきます。",
  };

  return `${categoryName}の深層神託: ${details[result.rarity]} ラッキーアイテム「${result.luckyItem}」は、迷った時に視線を戻すための小さな依代です。`;
}

export function ResultCard({
  detailUnlocked,
  duplicateShards,
  isNewCard,
  result,
  onRequestDetail,
  onRequestUrReroll,
  onReset,
}: ResultCardProps) {
  const [feedback, setFeedback] = useState("");
  const category = getCategory(result.category);
  const meta = rarityMeta[result.rarity];
  const isUltra = result.rarity === "UR";
  const isSsr = result.rarity === "SSR";
  const shareText = useMemo(
    () =>
      `【${result.rarity}】${category.name}\n${result.title}\n${result.body}\n\nラッキーアイテム: ${result.luckyItem}\nラッキーカラー: ${result.luckyColor}\n#神託ガチャ`,
    [category.name, result],
  );

  const copyShareText = async () => {
    try {
      await navigator.clipboard.writeText(shareText);
      setFeedback("共有文をコピーしました");
    } catch {
      setFeedback("コピーに失敗しました");
    }
  };

  const shareResult = async () => {
    if (!navigator.share) {
      await copyShareText();
      return;
    }

    try {
      await navigator.share({
        title: `神託ガチャ ${result.rarity}`,
        text: shareText,
      });
      setFeedback("共有を開きました");
    } catch {
      setFeedback("");
    }
  };

  const saveResultCard = () => {
    const svg = buildResultSvg(result, category.name);
    const blob = new Blob([svg], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `shintaku-gacha-${result.rarity}-${result.id}.svg`;
    anchor.click();
    URL.revokeObjectURL(url);
    setFeedback("結果カードを保存しました");
  };

  return (
    <section
      className={`result-card-pop relative animate-cardFlip overflow-hidden rounded-[28px] border border-white/20 bg-slate-950/82 p-4 shadow-oracle ${
        isSsr ? "result-card-premium" : ""
      } ${isUltra ? "result-card-ur shadow-ur" : ""}`}
    >
      {(isSsr || isUltra) ? (
        <>
          <div className="result-entry-flash pointer-events-none absolute inset-0" />
          <div className="result-prism-sweep pointer-events-none absolute inset-[-30%]" />
          <div className="result-shockwave pointer-events-none absolute inset-0">
            <span />
            <span />
          </div>
          <div className="result-burst-pieces pointer-events-none absolute inset-0">
            {resultBurstPieces.map(([left, top, rotate, delay], index) => (
              <span
                key={`${left}-${top}`}
                style={{
                  left,
                  top,
                  rotate,
                  animationDelay: delay,
                  color: isUltra
                    ? index % 3 === 0
                      ? "#67e8f9"
                      : index % 2
                        ? "#fde68a"
                        : "#f0abfc"
                    : "#f0abfc",
                }}
              />
            ))}
          </div>
        </>
      ) : null}
      <div className={`absolute -right-12 -top-14 h-36 w-36 rounded-full bg-gradient-to-br ${meta.aura} opacity-35 blur-2xl`} />
      <div className={`absolute -left-10 top-24 h-28 w-28 rounded-full bg-gradient-to-br ${meta.aura} opacity-20 blur-2xl`} />
      <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.13),transparent_28%,rgba(168,85,247,0.12)_62%,transparent)]" />
      {isNewCard ? (
        <div className="new-card-stamp pointer-events-none absolute right-3 top-14 z-20 rounded-2xl border border-amber-100/50 bg-amber-300/20 px-4 py-2 text-center shadow-[0_0_36px_rgba(250,204,21,0.5)]">
          <p className="text-[10px] font-black tracking-[0.26em] text-amber-100">NEW CARD</p>
          <p className="text-lg font-black text-white">獲得!</p>
        </div>
      ) : duplicateShards > 0 ? (
        <div className="new-card-stamp pointer-events-none absolute right-3 top-14 z-20 rounded-2xl border border-fuchsia-100/35 bg-fuchsia-300/16 px-4 py-2 text-center shadow-[0_0_32px_rgba(217,70,239,0.42)]">
          <p className="text-[10px] font-black tracking-[0.22em] text-fuchsia-100">DUPLICATE</p>
          <p className="text-lg font-black text-white">+{duplicateShards}</p>
        </div>
      ) : null}
      <div className="relative">
        <div className="mb-3 flex items-center justify-between">
          <span className={`rounded-full border px-3 py-1 text-xs font-black tracking-[0.2em] ${meta.badge}`}>{result.rarity}</span>
          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-semibold text-white/70">{category.name}</span>
        </div>

        <div className={`result-card-stage mb-4 grid min-h-40 place-items-center rounded-3xl border border-white/15 bg-black/24 ${isUltra ? "animate-urBurst" : ""}`}>
          {(isSsr || isUltra) ? (
            <>
              <div className="result-stage-aura absolute h-44 w-44 rounded-full" />
              <div className="result-stage-ring absolute h-36 w-36 rounded-full" />
            </>
          ) : null}
          <div className={`result-inner-card relative ${(isSsr || isUltra) ? "result-inner-card-premium" : ""}`}>
            {(isSsr || isUltra) ? (
              <div className="absolute -inset-5 rounded-[28px] border border-fuchsia-200/30 shadow-[0_0_42px_rgba(217,70,239,0.46)]" />
            ) : null}
            <OracleCardArt category={result.category} rarity={result.rarity} variantKey={result.id} />
          </div>
        </div>

        {(isSsr || isUltra) ? (
          <div className="mb-3 rounded-2xl border border-amber-100/20 bg-amber-100/10 px-3 py-2 text-center">
            <p className="text-[10px] font-black tracking-[0.28em] text-amber-100/70">
              {isUltra ? "FORBIDDEN ORACLE UNLOCKED" : "FATE REVERSAL CONFIRMED"}
            </p>
          </div>
        ) : null}

        {isNewCard ? (
          <div className="mb-3 rounded-2xl border border-amber-100/30 bg-amber-200/12 px-3 py-2 text-center">
            <p className="text-[10px] font-black tracking-[0.24em] text-amber-100/75">COLLECTION UPDATED</p>
            <p className="mt-1 text-sm font-black text-white">図鑑に新しい神託カードが刻まれました</p>
          </div>
        ) : duplicateShards > 0 ? (
          <div className="mb-3 rounded-2xl border border-fuchsia-100/25 bg-fuchsia-200/10 px-3 py-2 text-center">
            <p className="text-[10px] font-black tracking-[0.24em] text-fuchsia-100/70">SOUL SHARDS</p>
            <p className="mt-1 text-sm font-black text-white">所持済みカードを +{duplicateShards} 欠片に変換</p>
          </div>
        ) : null}

        <p className="text-[11px] font-bold tracking-[0.24em] text-fuchsia-100/60">ORACLE RESULT</p>
        <h2 className="mt-1 text-2xl font-black leading-tight text-white text-balance">{result.title}</h2>
        <p className="mt-3 text-sm leading-7 text-violet-50/84">{result.body}</p>

        <dl className="mt-4 grid grid-cols-2 gap-2 text-xs">
          <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-3">
            <dt className="text-white/45">ラッキーアイテム</dt>
            <dd className="mt-1 font-bold text-white">{result.luckyItem}</dd>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-3">
            <dt className="text-white/45">ラッキーカラー</dt>
            <dd className="mt-1 font-bold text-white">{result.luckyColor}</dd>
          </div>
        </dl>

        <div className="mt-3 rounded-2xl border border-amber-100/20 bg-amber-100/10 p-3">
          <p className="text-[10px] font-bold tracking-[0.22em] text-amber-100/55">TODAY&apos;S WORD</p>
          <p className="mt-1 text-sm font-bold text-amber-50">{result.word}</p>
        </div>

        {detailUnlocked ? (
          <div className="mt-3 rounded-2xl border border-fuchsia-100/20 bg-fuchsia-200/10 p-3">
            <p className="text-[10px] font-black tracking-[0.22em] text-fuchsia-100/55">DEEP ORACLE</p>
            <p className="mt-1 text-xs leading-6 text-fuchsia-50/84">{buildDetailOracle(result, category.name)}</p>
          </div>
        ) : (
          <button
            className="mt-3 w-full rounded-2xl border border-fuchsia-100/20 bg-fuchsia-200/10 px-4 py-3 text-xs font-black text-fuchsia-50 shadow-[0_0_22px_rgba(217,70,239,0.16)] active:scale-[0.98]"
            onClick={onRequestDetail}
            type="button"
          >
            広告で詳細神託を解放
          </button>
        )}

        {result.rarity !== "UR" ? (
          <button
            className="mt-2 w-full rounded-2xl border border-amber-100/25 bg-amber-200/10 px-4 py-3 text-xs font-black text-amber-50 shadow-[0_0_22px_rgba(250,204,21,0.13)] active:scale-[0.98]"
            onClick={onRequestUrReroll}
            type="button"
          >
            広告でUR再抽選
          </button>
        ) : null}

        <div className="mt-4 grid grid-cols-2 gap-2">
          <button
            className="rounded-2xl border border-cyan-100/20 bg-cyan-200/10 px-3 py-3 text-xs font-black text-cyan-50 active:scale-[0.98]"
            onClick={shareResult}
            type="button"
          >
            共有する
          </button>
          <button
            className="rounded-2xl border border-amber-100/25 bg-amber-200/10 px-3 py-3 text-xs font-black text-amber-50 active:scale-[0.98]"
            onClick={saveResultCard}
            type="button"
          >
            カード保存
          </button>
        </div>
        <button
          className="mt-2 w-full rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-sm font-black text-white shadow-[inset_0_0_18px_rgba(255,255,255,0.08)] active:scale-[0.98]"
          onClick={onReset}
          type="button"
        >
          もう一度引く
        </button>
        {feedback ? <p className="mt-2 text-center text-[11px] font-semibold text-white/55">{feedback}</p> : null}
      </div>
    </section>
  );
}
