import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";
import { siteConfig } from "@/lib/siteConfig";

export const metadata: Metadata = {
  title: "免責事項",
  description: `${siteConfig.name}の免責事項です。`,
  alternates: { canonical: "/disclaimer" },
};

export default function DisclaimerPage() {
  return (
    <LegalPage
      title="免責事項"
      lead="猫星ミラージュ占譜の鑑定結果および表示内容に関する免責事項です。"
      sections={[
        {
          title: "占い結果について",
          body: "本アプリの占い結果は娯楽・エンタメ用途のコンテンツです。結果の正確性、将来予測、心理状態、相性、運勢等を保証するものではありません。",
        },
        {
          title: "重大な判断について",
          body: "医療、法律、投資、金融、就職、進学、結婚、離婚、人間関係、その他人生上の重大な判断について、本アプリの表示内容を根拠にしないでください。必要な場合は医師、弁護士、金融専門家等の専門家に相談してください。",
        },
        {
          title: "データ保存について",
          body: "鑑定履歴はlocalStorageに保存されます。端末やブラウザの状態により保存内容が失われる場合があります。当方は保存データの消失、表示不具合、利用不能により生じた損害について責任を負いません。",
        },
        {
          title: "広告について",
          body: "広告配信を導入した場合、広告内容やリンク先は第三者により提供されます。広告の利用、商品・サービスの購入等は利用者自身の判断と責任で行ってください。",
        },
      ]}
    />
  );
}
