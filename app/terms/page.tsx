import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";
import { siteConfig } from "@/lib/siteConfig";

export const metadata: Metadata = {
  title: "利用規約",
  description: `${siteConfig.name}の利用規約です。`,
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <LegalPage
      title="利用規約"
      lead="本規約は、猫星ミラージュ占譜の利用条件を定めるものです。"
      sections={[
        {
          title: "サービスの性質",
          body: "本アプリは、姓名判断、星の暦、猫タロットをモチーフにしたエンタメ用途の占いコンテンツです。鑑定結果の正確性、完全性、将来の出来事の実現を保証するものではありません。",
        },
        {
          title: "禁止事項",
          body: "本アプリの表示内容を、医療、法律、投資、契約、進路、結婚、その他人生上の重大な判断の唯一の根拠として利用することを禁止します。必要に応じて専門家へ相談してください。",
        },
        {
          title: "保存機能",
          body: "鑑定履歴はブラウザのlocalStorageに保存されます。ブラウザの設定変更、キャッシュ削除、端末変更等により履歴が消える場合があります。",
        },
        {
          title: "広告",
          body: "将来的に広告枠へ本広告を表示する場合があります。広告の内容、リンク先、広告配信事業者による情報の取り扱いについては、各広告配信事業者の規約やポリシーをご確認ください。",
        },
      ]}
    />
  );
}
