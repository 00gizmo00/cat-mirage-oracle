import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ContentPage } from "@/components/ContentPage";
import { getRelatedArticles } from "@/lib/articles";
import { createPageMetadata } from "@/lib/seo";
import { getRelatedZodiacSigns, getZodiacSign, zodiacSigns } from "@/lib/zodiac";

type ZodiacPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return zodiacSigns.map((sign) => ({ slug: sign.slug }));
}

export async function generateMetadata({ params }: ZodiacPageProps): Promise<Metadata> {
  const { slug } = await params;
  const sign = getZodiacSign(slug);
  if (!sign) return {};

  return createPageMetadata({
    title: `${sign.name} ${sign.english}｜12星座猫図鑑`,
    description: `${sign.name}の基本性格、猫星から見た特徴、恋愛傾向、仕事傾向、人間関係、ラッキーアイテムを紹介します。`,
    path: `/zodiac/${sign.slug}`,
    image: sign.imageSrc,
  });
}

export default async function ZodiacDetailPage({ params }: ZodiacPageProps) {
  const { slug } = await params;
  const sign = getZodiacSign(slug);
  if (!sign) notFound();

  return (
    <ContentPage
      title={`${sign.name} ${sign.english}`}
      lead={`${sign.name}は、猫星ミラージュ占譜では「${sign.motif}」をまとった黒猫として読みます。星座の性質を未来の断定ではなく、日々の気分整理や行動のヒントとして受け取ってください。`}
      breadcrumbs={[
        { href: "/", label: "トップ" },
        { href: "/zodiac", label: "12星座猫図鑑" },
        { href: `/zodiac/${sign.slug}`, label: sign.name },
      ]}
      relatedLinks={[
        ...getRelatedZodiacSigns(sign.slug, 3),
        { href: "/zodiac", label: "12星座猫図鑑" },
        { href: "/articles/tarot-in-daily-life", label: "タロットを日常生活に活かす方法" },
        ...getRelatedArticles("", 2),
      ]}
      sections={[
        {
          title: "基本性格",
          body: `${sign.personality}\n\nこの星座は、生まれ持った性格を一つに決めつけるためのものではありません。猫星ミラージュ占譜では、星座を「どんな場面で力が出やすいか」「どんな時に疲れやすいか」を見るための象徴として扱います。自分に当てはまるところだけを拾い、違うと感じる部分は今の状態を知るための比較材料にしてください。`,
        },
        {
          title: "猫星から見た特徴",
          body: `${sign.catFeature}\n\n黒猫は、夜の静けさ、自由な距離感、言葉になる前の直感を象徴します。そこに星座モチーフを重ねることで、一般的な星座占いよりも少し神秘的で、日常の気分に寄り添う読み方になります。${sign.name}の猫は、強みだけでなく、迷い方や休み方にも個性があります。`,
        },
        {
          title: "恋愛傾向",
          body: `${sign.love}\n\n恋愛で星座を見る時は、相手の気持ちを決めつけるのではなく、自分が安心できる距離や伝え方を確認することが大切です。好きな気持ちが強いほど、占いの言葉に寄りかかりすぎることがあります。猫星の読みでは、行動を一つ小さくすることで、関係を無理なく整えることをすすめています。`,
        },
        {
          title: "仕事傾向",
          body: `${sign.work}\n\n仕事では、星座の得意分野をそのまま肩書きにする必要はありません。どんな作業で集中しやすいか、どんな役割で疲れやすいかを知るための目安として読んでください。今日の猫星ランキングで上位の日は、得意な動きを少し前に出すと流れが作りやすくなります。下位の日は、攻めるより整える日にしても十分です。`,
        },
        {
          title: "人間関係",
          body: `${sign.relationship}\n\n人間関係では、自分の反応の癖を知ることが役に立ちます。近づきたい時、離れたい時、頼られた時、断りたい時にどんな振る舞いをしやすいかを見てください。星座は相性を固定するものではなく、相手と自分の違いを少しやわらかく眺めるための言葉です。`,
        },
        {
          title: "ラッキーアイテム",
          body: `${sign.name}のラッキーアイテムは「${sign.luckyItem}」です。これは運命を変える特別な道具というより、今日の気分を切り替えるための小さな合図です。持ち歩く、机に置く、似た色や質感のものを選ぶだけでも構いません。目に入るたびに、今日の自分が大切にしたい感覚を思い出すために使ってください。`,
        },
      ]}
    />
  );
}
