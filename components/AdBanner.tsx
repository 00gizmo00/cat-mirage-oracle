"use client";

import { useEffect, useState } from "react";

export type AdBannerVariant = "top-sticky" | "result-inline" | "archive-inline";

type AdBannerProps = {
  variant?: AdBannerVariant;
  slotId?: string;
};

const showAdPlaceholders = false;
const isAdsenseReviewMode = process.env.NEXT_PUBLIC_ADSENSE_REVIEW_MODE === "true";

const adSlots: Record<AdBannerVariant, string> = {
  "top-sticky": "cat-mirage-top-sticky-demo",
  "result-inline": "cat-mirage-result-inline-demo",
  "archive-inline": "cat-mirage-archive-inline-demo",
};

const adCopy: Record<AdBannerVariant, { label: string; body: string }> = {
  "top-sticky": {
    label: "ADVERTISEMENT",
    body: "鑑定を読みながら表示される広告枠",
  },
  "result-inline": {
    label: "SPONSORED ORACLE",
    body: "鑑定結果の下に差し込むインライン広告枠",
  },
  "archive-inline": {
    label: "ARCHIVE AD",
    body: "鑑定履歴まわりに差し込む広告枠",
  },
};

export function AdBanner({ variant = "top-sticky", slotId }: AdBannerProps) {
  const [adFree, setAdFree] = useState(false);
  const isTop = variant === "top-sticky";
  const copy = adCopy[variant];

  useEffect(() => {
    // 開発確認用: localStorage.setItem("cat_mirage_ad_free", "true") で広告枠を非表示にできます。
    setAdFree(window.localStorage.getItem("cat_mirage_ad_free") === "true");
  }, []);

  if (isAdsenseReviewMode || !showAdPlaceholders || adFree) return null;

  return (
    <aside
      className={`relative overflow-hidden border-white/10 bg-[#05040d]/82 px-4 py-3 shadow-[0_16px_40px_rgba(0,0,0,0.36)] backdrop-blur-xl ${
        isTop ? "h-[96px] rounded-b-[28px] border-b" : "mx-4 my-4 min-h-[76px] rounded-[22px] border"
      }`}
      data-ad-slot={slotId ?? adSlots[variant]}
      data-ad-variant={variant}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_28%_16%,rgba(250,204,21,0.14),transparent_30%),radial-gradient(circle_at_76%_44%,rgba(168,85,247,0.18),transparent_36%)]" />
      <div className="scanline absolute inset-0 opacity-20" />
      <div className="relative flex h-full items-center justify-between rounded-2xl border border-white/10 bg-white/[0.045] px-4">
        <div>
          <p className="text-[10px] font-bold tracking-[0.28em] text-amber-100/64">{copy.label}</p>
          <p className="mt-1 text-xs font-semibold text-white/72 sm:text-sm">{copy.body}</p>
        </div>
        <div
          className={`${isTop ? "h-12 w-12 text-lg" : "h-10 w-10 text-sm"} grid shrink-0 place-items-center rounded-full border border-amber-200/30 bg-amber-200/10 font-black text-amber-100 shadow-[0_0_20px_rgba(250,204,21,0.16)]`}
        >
          AD
        </div>
      </div>
    </aside>
  );
}
