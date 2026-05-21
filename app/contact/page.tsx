import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";
import { siteConfig } from "@/lib/siteConfig";

export const metadata: Metadata = {
  title: "お問い合わせ",
  description: `${siteConfig.name}のお問い合わせページです。`,
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <LegalPage
      title="お問い合わせ"
      lead="猫星ミラージュ占譜へのお問い合わせについて。"
      sections={[
        {
          title: "問い合わせ先",
          body: "現在準備中です。公開前に連絡用メールアドレス、フォーム、またはSNSアカウント等を設定してください。",
        },
        {
          title: "お問い合わせ時の注意",
          body: "占い結果はエンタメ用途です。医療、法律、投資、人生上の重大判断に関する個別相談には対応できません。",
        },
        {
          title: "保存データについて",
          body: "鑑定履歴は利用者のブラウザのlocalStorageに保存されます。お問い合わせ時に、不要な個人情報や鑑定履歴の全文を送信しないようご注意ください。",
        },
      ]}
    />
  );
}
