type AffiliateDisclosureProps = {
  compact?: boolean;
};

export function AffiliateDisclosure({ compact = false }: AffiliateDisclosureProps) {
  return (
    <section className={compact ? "px-5 pb-4" : "px-4 pb-6"}>
      <div className="rounded-[20px] border border-amber-100/14 bg-amber-100/[0.055] p-4 text-left">
        <p className="font-serif text-[10px] font-bold tracking-[0.28em] text-amber-100/58">PR POLICY</p>
        <p className="mt-2 text-xs leading-6 text-violet-50/68">
          本サイトには、商品・サービス紹介のためのアフィリエイトリンクを掲載する場合があります。
          リンク先で購入や申込みが発生した場合、運営者が報酬を受け取ることがありますが、鑑定結果やカード解説の内容は報酬条件によって変更しません。
        </p>
      </div>
    </section>
  );
}
