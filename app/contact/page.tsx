import { LegalPage } from "@/components/LegalPage";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "お問い合わせ",
  description: "不具合報告、コンテンツ、権利関係、広告掲載、その他サービスに関するお問い合わせ窓口です。",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <LegalPage
      title="お問い合わせ"
      lead="猫星ミラージュ占譜へのお問い合わせについて。"
      sections={[
        {
          title: "問い合わせ先",
          body: "お問い合わせは、以下のメールアドレスまでご連絡ください。\n\ngizmo@rakumail.jp\n\n通常、内容を確認したうえで3営業日以内を目安に返信します。ただし、内容によっては返信できない場合があります。",
        },
        {
          title: "受付内容",
          body: "以下の内容を受け付けています。\n\n・不具合報告\n・コンテンツに関するお問い合わせ\n・著作権、商標権、肖像権など権利関係のご連絡\n・広告掲載に関するご相談\n・その他サービスに関するお問い合わせ\n\n占い結果の個別解釈、医療、法律、投資、人生上の重大判断に関する相談には対応できません。",
        },
        {
          title: "注意事項",
          body: "お問い合わせの際は、必要な範囲で状況を具体的に記載してください。不具合報告の場合は、利用端末、ブラウザ、発生した操作、表示された内容が分かると確認しやすくなります。\n\n迷惑メール、営業メール、サービス内容と関係のない連絡、誹謗中傷を含む連絡には返信しない場合があります。鑑定履歴は利用者のブラウザのlocalStorageに保存されるため、お問い合わせ時に不要な個人情報や鑑定履歴全文を送信しないようご注意ください。",
        },
      ]}
    />
  );
}
