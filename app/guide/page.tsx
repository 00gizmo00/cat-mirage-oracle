import Link from "next/link";
import { createPageMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/siteConfig";

export const metadata = createPageMetadata({
  title: "はじめての方へ・使い方ガイド",
  description: "初めて猫星ミラージュ占譜を使う方向けに、占いの流れ、猫星ランキング、図鑑、占い帳、読み物への入口をまとめます。",
  path: "/guide",
});

const featureLinks = [
  {
    href: "/tarot",
    title: "猫タロット図鑑",
    body: "22枚の大アルカナを猫の姿で読み解く図鑑です。カード名、正位置、逆位置、恋愛、仕事、人間関係の見方を確認できます。",
  },
  {
    href: "/zodiac",
    title: "12星座猫図鑑",
    body: "12星座を黒猫のイラストで表現した図鑑です。今日の猫星ランキングから気になった星座を深掘りできます。",
  },
  {
    href: "/journal",
    title: "占い帳",
    body: "保存した鑑定を読み返すための説明ページです。履歴の保存場所、振り返り方、毎日の使い方をまとめています。",
  },
  {
    href: "/articles",
    title: "読み物アーカイブ",
    body: "猫タロット、占い結果との向き合い方、日常での使い方など、少し長めの読み物をまとめています。",
  },
];

const faqs = [
  {
    question: "猫星ミラージュ占譜は何を占うサイトですか？",
    answer: "姓名判断風の数、星の暦、猫タロットの三枚読みを組み合わせて、今日の気分整理や行動のヒントを読むエンタメ占いです。",
  },
  {
    question: "名前や生年月日は保存されますか？",
    answer: "入力内容と保存した鑑定履歴は、基本的に利用中のブラウザのlocalStorageに保存されます。ログインやサーバー側の鑑定履歴管理は行っていません。",
  },
  {
    question: "今日の猫星ランキングは毎日変わりますか？",
    answer: "日付ごとの固定シードで順位を作っているため、同じ日であれば同じランキングが表示され、日付が変わると更新されます。",
  },
  {
    question: "占い結果はどのくらい信じればよいですか？",
    answer: "結果は未来を断定するものではありません。心に残った言葉を、今日の小さな行動や気分整理のきっかけとして扱うことをおすすめします。",
  },
  {
    question: "保存した鑑定はどこで見られますか？",
    answer: "トップページ内の猫星占い帳から確認できます。保存履歴は同じブラウザ内に残りますが、キャッシュ削除や端末変更で消える場合があります。",
  },
  {
    question: "SNS共有で個人名は出ますか？",
    answer: "SNS向けの共有文や画像では、個人名が出ないように調整しています。共有前には表示内容を一度確認してください。",
  },
  {
    question: "医療・法律・投資などの判断に使えますか？",
    answer: "使えません。本サイトはエンタメ用途です。医療、法律、投資、契約、進路などの重大な判断は、必ず専門家や信頼できる情報を確認してください。",
  },
];

export default function GuidePage() {
  return (
    <main className="min-h-svh px-4 py-8 text-white">
      <article className="mx-auto max-w-[820px] overflow-hidden rounded-[28px] border border-white/10 bg-[#070612]/92 shadow-[0_24px_80px_rgba(0,0,0,0.48)]">
        <header className="relative border-b border-amber-100/12 px-5 py-7">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(217,190,119,0.16),transparent_34%),radial-gradient(circle_at_18%_86%,rgba(88,28,135,0.2),transparent_42%)]" />
          <div className="relative">
            <p className="font-serif text-[10px] font-bold tracking-[0.34em] text-amber-100/58">{siteConfig.name}</p>
            <h1 className="mt-2 font-serif text-3xl font-bold leading-tight">ガイド</h1>
            <p className="mt-3 text-sm leading-7 text-violet-50/72">
              はじめて使う方に向けて、猫星ミラージュ占譜でできること、毎日の楽しみ方、保存履歴や図鑑の見方をまとめました。
            </p>
          </div>
        </header>

        <div className="space-y-5 px-5 py-6">
          <section className="rounded-2xl border border-white/10 bg-white/[0.045] p-4">
            <h2 className="text-base font-black text-amber-50">はじめての方へ</h2>
            <p className="mt-2 text-sm leading-7 text-violet-50/74">
              トップページで名前、生年月日、占いたいテーマを入力し、「今日の占譜を開く」を押すと鑑定結果が表示されます。結果は、姓名判断風の数、星の暦、猫タロット三枚読みを組み合わせたエンタメ占いです。最初は難しく考えず、心に残った一文を今日の行動メモとして受け取ってください。
            </p>
          </section>

          <section className="rounded-2xl border border-white/10 bg-white/[0.045] p-4">
            <h2 className="text-base font-black text-amber-50">このサイトでできること</h2>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {[
                "今日の猫星ランキングを見る",
                "猫タロット占いを引く",
                "鑑定結果を保存して占い帳で読み返す",
                "SNS向けの共有文や画像を作る",
                "猫タロット図鑑で22枚の意味を読む",
                "12星座猫図鑑で星座ごとの特徴を読む",
              ].map((item) => (
                <div className="rounded-2xl border border-amber-100/12 bg-black/24 px-3 py-3 text-sm font-bold leading-6 text-violet-50/76" key={item}>
                  {item}
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-2xl border border-white/10 bg-white/[0.045] p-4">
            <h2 className="text-base font-black text-amber-50">今日の猫星ランキング</h2>
            <p className="mt-2 text-sm leading-7 text-violet-50/74">
              12星座の運勢を毎日ランキング形式で表示します。順位は日付ごとの固定シードで作られるため、同じ日なら同じランキングになります。ラッキーカラー、ラッキーアクション、猫からの一言を見て、今日の小さな行動を決める入口として使えます。
            </p>
          </section>

          <section className="rounded-2xl border border-white/10 bg-white/[0.045] p-4">
            <h2 className="text-base font-black text-amber-50">猫タロット占いの使い方</h2>
            <p className="mt-2 text-sm leading-7 text-violet-50/74">
              鑑定では、過去・現在・近未来の三枚の猫タロットを表示します。カードは未来を固定するものではなく、最近の流れ、今のテーマ、これから意識したい兆しを眺めるための象徴です。結果を読んだら、カード名、総合メッセージ、今日の行動の中から一つだけ持ち帰る言葉を選んでください。
            </p>
          </section>

          <section className="rounded-2xl border border-white/10 bg-white/[0.045] p-4">
            <h2 className="text-base font-black text-amber-50">占い帳・保存履歴の使い方</h2>
            <p className="mt-2 text-sm leading-7 text-violet-50/74">
              気になった鑑定は保存できます。保存した結果はトップページの猫星占い帳から読み返せます。朝に引いた結果を夜に見返すと、言葉の印象が変わることがあります。お気に入りを付けて、あとから読み返したい鑑定を分けておく使い方もできます。
            </p>
          </section>

          <section className="rounded-2xl border border-amber-100/14 bg-amber-100/[0.055] p-4">
            <h2 className="text-base font-black text-amber-50">図鑑と読み物</h2>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              {featureLinks.map((link) => (
                <Link
                  className="rounded-2xl border border-white/10 bg-black/24 px-4 py-4 text-sm leading-6 text-violet-50/76 underline-offset-4 hover:text-amber-100 hover:underline"
                  href={link.href}
                  key={link.href}
                >
                  <span className="block text-base font-black text-white">{link.title}</span>
                  <span className="mt-1 block">{link.body}</span>
                </Link>
              ))}
            </div>
          </section>

          <section className="rounded-2xl border border-white/10 bg-white/[0.045] p-4">
            <h2 className="text-base font-black text-amber-50">よくある質問</h2>
            <div className="mt-3 space-y-3">
              {faqs.map((faq) => (
                <div className="rounded-2xl border border-white/10 bg-black/22 p-3" key={faq.question}>
                  <h3 className="text-sm font-black text-white">{faq.question}</h3>
                  <p className="mt-1 text-xs leading-6 text-violet-50/70">{faq.answer}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-2xl border border-rose-100/14 bg-rose-100/[0.045] p-4">
            <h2 className="text-base font-black text-rose-50">エンタメ用途である注意</h2>
            <p className="mt-2 text-sm leading-7 text-violet-50/74">
              猫星ミラージュ占譜の鑑定結果、ランキング、図鑑、読み物はエンタメ用途のコンテンツです。医療、法律、投資、契約、進路、結婚など人生上の重大な判断は、このサイトだけを根拠にせず、必要に応じて専門家や信頼できる情報を確認してください。
            </p>
          </section>

          <Link className="inline-flex rounded-full border border-amber-100/24 bg-amber-100/[0.07] px-4 py-2 text-sm font-bold text-amber-50" href="/">
            トップへ戻る
          </Link>
        </div>
      </article>
    </main>
  );
}
