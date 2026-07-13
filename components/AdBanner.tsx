"use client";

import { useEffect, useState } from "react";

export type AdBannerVariant = "top-sticky" | "result-inline" | "archive-inline";

type AdBannerProps = {
  variant?: AdBannerVariant;
  slotId?: string;
};

type Recommendation = {
  label: string;
  title: string;
  body: string;
  cta: string;
  href?: string;
};

const affiliateLinks: Record<AdBannerVariant, string | undefined> = {
  "top-sticky": process.env.NEXT_PUBLIC_AFFILIATE_TOP_URL,
  "result-inline": process.env.NEXT_PUBLIC_AFFILIATE_RESULT_URL,
  "archive-inline": process.env.NEXT_PUBLIC_AFFILIATE_ARCHIVE_URL,
};

const recommendations: Record<AdBannerVariant, Omit<Recommendation, "href">> = {
  "top-sticky": {
    label: "PR",
    title: "猫星ミラージュからのおすすめ",
    body: "占い、タロット、日々の振り返りに関連するサービスを紹介します。",
    cta: "詳しく見る",
  },
  "result-inline": {
    label: "PR",
    title: "もっと今日を深く知りたい方へ",
    body: "鑑定結果とは別枠の紹介です。気になったテーマを、外部サービスや読み物でさらに掘り下げられます。",
    cta: "詳細を見る",
  },
  "archive-inline": {
    label: "PR",
    title: "占い帳を続けるためのおすすめ",
    body: "保存した鑑定を振り返る習慣に合うサービスやアイテムを紹介します。",
    cta: "見に行く",
  },
};

export function AdBanner({ variant = "top-sticky", slotId }: AdBannerProps) {
  const [hidden, setHidden] = useState(false);
  const href = affiliateLinks[variant];
  const copy = recommendations[variant];

  useEffect(() => {
    // 開発確認用: localStorage.setItem("cat_mirage_ad_free", "true") でPR枠を非表示にできます。
    setHidden(window.localStorage.getItem("cat_mirage_ad_free") === "true");
  }, []);

  if (hidden || !href) return null;

  return (
    <aside
      className="mx-4 my-4 overflow-hidden rounded-[22px] border border-amber-100/18 bg-[#070612]/92 p-4 shadow-[0_18px_52px_rgba(0,0,0,0.32)]"
      data-affiliate-slot={slotId ?? `cat-mirage-${variant}`}
      data-affiliate-variant={variant}
    >
      <div className="border-b border-white/10 pb-3">
        <p className="inline-flex rounded-full border border-amber-100/30 bg-amber-100/10 px-2.5 py-1 text-[10px] font-black tracking-[0.22em] text-amber-50">
          {copy.label}
        </p>
        <h2 className="mt-3 text-base font-black leading-6 text-white">{copy.title}</h2>
      </div>
      <p className="mt-3 text-xs font-bold leading-6 text-violet-50/68">{copy.body}</p>
      <a
        className="mt-3 inline-flex rounded-full border border-amber-100/30 bg-amber-100/[0.08] px-4 py-2 text-xs font-black text-amber-50 transition active:scale-95"
        href={href}
        rel="sponsored nofollow noopener noreferrer"
        target="_blank"
      >
        {copy.cta}
      </a>
    </aside>
  );
}
