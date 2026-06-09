import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ContentPage } from "@/components/ContentPage";
import { getRelatedArticles } from "@/lib/articles";
import { getRelatedTarotCards, getTarotDetail, tarotDetails } from "@/lib/tarotDetails";

type TarotPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return tarotDetails.map((card) => ({ slug: card.slug }));
}

export async function generateMetadata({ params }: TarotPageProps): Promise<Metadata> {
  const { slug } = await params;
  const card = getTarotDetail(slug);
  if (!card) return {};

  return {
    title: `${card.arcana} ${card.english} | 猫タロット大アルカナ`,
    description: `猫タロット大アルカナ「${card.arcana}」の意味、正位置、逆位置、恋愛、仕事、人間関係、自己成長での読み方を解説します。`,
    alternates: { canonical: `/tarot/${card.slug}` },
  };
}

export default async function TarotDetailPage({ params }: TarotPageProps) {
  const { slug } = await params;
  const card = getTarotDetail(slug);
  if (!card) notFound();

  const relatedLinks = [
    ...getRelatedTarotCards(card.slug, 3),
    ...getRelatedArticles("", 3),
  ];

  return (
    <ContentPage
      title={`${card.arcana} ${card.english}`}
      lead={`${card.summary} 猫星ミラージュ占譜では、このカードを未来の断定ではなく、今日の気分や行動を整えるための象徴として読みます。`}
      sections={[
        {
          title: "カード概要",
          body: `${card.summary}\n\n猫タロットとして眺める時は、カード名だけで吉凶を決めません。猫の姿、背景の月や星、持っている道具、こちらを見る視線の強さを合わせて読みます。大アルカナは人生の大きな流れを表すカード群ですが、日常の小さな選択にも使えます。このカードが出た日は、まず「何を急ぎ、何を待ち、何を手放したいのか」を静かに確認してください。`,
        },
        {
          title: "正位置",
          body: `${card.upright}\n\n正位置は、そのカードの力が比較的まっすぐ表れやすい状態です。ただし、良いカードだから何もしなくてよい、強いカードだから必ず大きな出来事が起きる、という意味ではありません。今の状況で使いやすい力がどこにあるのかを読む位置です。`,
        },
        {
          title: "逆位置",
          body: `${card.reversed}\n\n逆位置は、カードの意味が弱まる、裏返る、内側へ向かう、または過剰に出る状態として扱います。悪い結果と決めつけず、どこで無理が起きているのか、何を見落としているのかを確認するための合図として読んでください。`,
        },
        {
          title: "恋愛",
          body: `${card.love}\n\n恋愛で読む場合、相手の気持ちを断定するより、自分がどんな距離感を望んでいるのかを見ることが大切です。占いだけで関係を決めず、実際の会話、相手の行動、自分の安心感を合わせて判断してください。`,
        },
        {
          title: "仕事",
          body: `${card.work}\n\n仕事で読む場合は、感情論だけでなく、期限、条件、役割、優先順位へ落とし込むと役立ちます。カードの言葉をそのまま命令にせず、今日できる一つの行動へ変えることをおすすめします。`,
        },
        {
          title: "人間関係",
          body: `${card.relationship}\n\n人間関係では、相手を変えるためではなく、自分の反応を知るためにカードを使います。距離を縮める、置く、待つ、確認する。どの選択が今の自分にとって無理が少ないかを考えてください。`,
        },
        {
          title: "自己成長",
          body: `${card.growth}\n\n自己成長の読みでは、理想の自分を急いで作るより、今の自分がどこで立ち止まっているのかを眺めます。カードは欠点を責めるためではなく、次の小さな練習を見つけるためのものです。`,
        },
        {
          title: "猫星ミラージュ独自解釈",
          body: `${card.mirage}\n\nこの独自解釈では、猫を単なるかわいいモチーフとしてではなく、タロットの役割を演じる象徴として扱います。夜色、金の装飾、月相、星の配置を重ねることで、現実の悩みを少し離れた場所から眺められるようにしています。読んだあとに残った一文を、今日の行動メモとして持ち帰ってください。`,
        },
      ]}
      relatedLinks={relatedLinks}
    />
  );
}
