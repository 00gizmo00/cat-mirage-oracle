import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";
import { siteConfig } from "@/lib/siteConfig";

export const metadata: Metadata = {
  title: "プライバシーポリシー",
  description: `${siteConfig.name}のプライバシーポリシーです。`,
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <LegalPage
      title="プライバシーポリシー"
      lead="本ページは、猫星ミラージュ占譜における情報の取り扱いについて説明します。"
      sections={[
        {
          title: "保存される情報",
          body: "本アプリでは、入力されたお名前、生年月日、占いテーマ、鑑定履歴などをブラウザのlocalStorageに保存する場合があります。これらは端末内のブラウザに保存され、現時点ではサーバー送信、ログイン管理、データベース保存は行いません。",
        },
        {
          title: "利用目的",
          body: "保存された情報は、鑑定履歴の再表示、毎日の利用状況の表示、ユーザー体験の向上のために利用します。占い結果はエンタメ用途であり、医療、法律、投資、人生上の重大な判断の根拠として利用しないでください。",
        },
        {
          title: "広告について",
          body: "将来的にAdSense、AdMob、その他広告配信サービスを導入する場合があります。その際、広告配信事業者によりCookie、広告識別情報、端末情報、閲覧情報等が利用される可能性があります。",
        },
        {
          title: "お問い合わせ",
          body: "問い合わせ先は現在準備中です。",
        },
      ]}
    />
  );
}
