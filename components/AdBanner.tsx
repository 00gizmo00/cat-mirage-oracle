"use client";

export type AdBannerVariant = "top-sticky" | "result-inline" | "archive-inline";

type AdBannerProps = {
  variant?: AdBannerVariant;
  slotId?: string;
};

const rakutenTarotClickUrl =
  "https://rpx.a8.net/svt/ejp?a8mat=4B7ZH3+88HW1E+2HOM+BW8O1&rakuten=y&a8ejpredirect=http%3A%2F%2Fhb.afl.rakuten.co.jp%2Fhgc%2F0ea62065.34400275.0ea62066.204f04c0%2Fa26071334564_4B7ZH3_88HW1E_2HOM_BW8O1%3Fpc%3Dhttps%253A%252F%252Fitem.rakuten.co.jp%252Fmitakeshop%252Fta001%252F%253Fscid%253Dwi_ich_iphoneapp_item_share%26m%3Dhttps%253A%252F%252Fitem.rakuten.co.jp%252Fmitakeshop%252Fta001%252F%253Fscid%253Dwi_ich_iphoneapp_item_share";

const rakutenTarotTrackingUrl = "https://www12.a8.net/0.gif?a8mat=4B7ZH3+88HW1E+2HOM+BW8O1";

export function AdBanner({ variant = "archive-inline", slotId }: AdBannerProps) {
  if (variant !== "archive-inline") return null;

  return (
    <aside
      className="mx-4 my-4 overflow-hidden rounded-[22px] border border-amber-100/18 bg-[#070612]/92 p-4 shadow-[0_18px_52px_rgba(0,0,0,0.32)]"
      data-affiliate-slot={slotId ?? "cat-mirage-rakuten-tarot-a8"}
      data-affiliate-variant={variant}
    >
      <div className="border-b border-white/10 pb-3">
        <p className="inline-flex rounded-full border border-amber-100/30 bg-amber-100/10 px-2.5 py-1 text-[10px] font-black tracking-[0.22em] text-amber-50">
          PR
        </p>
        <h2 className="mt-3 text-base font-black leading-6 text-white">猫タロットを手元でも楽しむ</h2>
      </div>
      <p className="mt-3 text-xs font-bold leading-6 text-violet-50/68">
        今日の占いをきっかけに、実際のタロットカードにも触れてみたい方へ。楽天市場で関連アイテムを確認できます。
      </p>
      <p className="mt-2 text-[11px] font-bold leading-5 text-white/42">楽天市場の商品ページへ移動します。</p>
      <a
        className="mt-3 inline-flex max-w-full items-center gap-2 rounded-full border border-amber-100/30 bg-amber-100/[0.08] px-4 py-2 text-xs font-black text-amber-50 transition active:scale-95"
        href={rakutenTarotClickUrl}
        rel="sponsored nofollow noopener noreferrer"
        target="_blank"
      >
        <span>タロットカードを見る</span>
        <span aria-hidden="true">↗</span>
      </a>
      <img src={rakutenTarotTrackingUrl} width="1" height="1" alt="" aria-hidden="true" />
    </aside>
  );
}
