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
  href: string;
};

const fallbackLinks: Record<AdBannerVariant, string> = {
  "top-sticky": "/guide",
  "result-inline": "/articles/tarot-in-daily-life",
  "archive-inline": "/journal",
};

const affiliateLinks: Record<AdBannerVariant, string | undefined> = {
  "top-sticky": process.env.NEXT_PUBLIC_AFFILIATE_TOP_URL,
  "result-inline": process.env.NEXT_PUBLIC_AFFILIATE_RESULT_URL,
  "archive-inline": process.env.NEXT_PUBLIC_AFFILIATE_ARCHIVE_URL,
};

const recommendations: Record<AdBannerVariant, Omit<Recommendation, "href">> = {
  "top-sticky": {
    label: "PR / RECOMMEND",
    title: "今日の占いを深く読むために",
    body: "猫タロットの見方や、毎日の振り返りに役立つ読み物へ案内します。",
    cta: "ガイドを見る",
  },
  "result-inline": {
    label: "PR / NEXT STEP",
    title: "結果をもう少し掘り下げる",
    body: "引いたカードを日常でどう使うか、関連する読み物や外部サービス導線をここへ配置できます。",
    cta: "関連ガイドへ",
  },
  "archive-inline": {
    label: "PR / JOURNAL",
    title: "占い帳を続けるための道具",
    body: "保存した鑑定を振り返る習慣に合うノート、カード、読み物の紹介枠です。",
    cta: "占い帳を見る",
  },
};

export function AdBanner({ variant = "top-sticky", slotId }: AdBannerProps) {
  const [hidden, setHidden] = useState(false);
  const isTop = variant === "top-sticky";
  const copy = recommendations[variant];
  const href = affiliateLinks[variant] || fallbackLinks[variant];
  const isAffiliate = Boolean(affiliateLinks[variant]);

  useEffect(() => {
    // 開発確認用: localStorage.setItem("cat_mirage_ad_free", "true") でPR枠を非表示にできます。
    setHidden(window.localStorage.getItem("cat_mirage_ad_free") === "true");
  }, []);

  if (hidden) return null;

  return (
    <aside
      className={`relative overflow-hidden border-white/10 bg-[#05040d]/82 px-4 py-3 shadow-[0_16px_40px_rgba(0,0,0,0.36)] backdrop-blur-xl ${
        isTop ? "h-[96px] rounded-b-[28px] border-b" : "mx-4 my-4 min-h-[86px] rounded-[22px] border"
      }`}
      data-affiliate-slot={slotId ?? `cat-mirage-${variant}`}
      data-affiliate-variant={variant}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_28%_16%,rgba(250,204,21,0.12),transparent_30%),radial-gradient(circle_at_76%_44%,rgba(34,211,238,0.11),transparent_36%)]" />
      <div className="scanline absolute inset-0 opacity-16" />
      <div className="relative flex h-full items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/[0.045] px-4">
        <div className="min-w-0">
          <p className="text-[10px] font-bold tracking-[0.26em] text-amber-100/64">{copy.label}</p>
          <p className="mt-1 truncate text-xs font-black text-white/86 sm:text-sm">{copy.title}</p>
          <p className="mt-0.5 line-clamp-2 text-[11px] font-semibold leading-5 text-white/58">{copy.body}</p>
        </div>
        <a
          className="grid shrink-0 place-items-center rounded-full border border-amber-200/30 bg-amber-200/10 px-3 py-2 text-[10px] font-black text-amber-100 shadow-[0_0_20px_rgba(250,204,21,0.13)] transition active:scale-95"
          href={href}
          rel={isAffiliate ? "sponsored nofollow noopener noreferrer" : undefined}
          target={isAffiliate ? "_blank" : undefined}
        >
          {copy.cta}
        </a>
      </div>
    </aside>
  );
}
