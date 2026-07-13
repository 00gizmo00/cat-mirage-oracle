import Link from "next/link";
import { articles } from "@/lib/articles";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "猫タロットと占いの読み物",
  description: "猫タロットの考え方、占い結果との向き合い方、占い帳の習慣化など、日常で読み返せる記事をまとめています。",
  path: "/articles",
});

export default function ArticlesPage() {
  return (
    <main className="min-h-svh px-4 py-8 text-white">
      <article className="mx-auto max-w-[760px] overflow-hidden rounded-[28px] border border-white/10 bg-[#070612]/92 shadow-[0_24px_80px_rgba(0,0,0,0.48)]">
        <header className="relative border-b border-amber-100/12 px-5 py-7">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(217,190,119,0.16),transparent_34%),radial-gradient(circle_at_18%_86%,rgba(88,28,135,0.2),transparent_42%)]" />
          <div className="relative">
            <p className="font-serif text-[10px] font-bold tracking-[0.34em] text-amber-100/58">CAT MIRAGE ARTICLES</p>
            <h1 className="mt-2 font-serif text-3xl font-bold leading-tight">読み物アーカイブ</h1>
            <p className="mt-3 text-sm leading-7 text-violet-50/72">
              猫タロット、占い結果、占い帳、日常での使い方についての読み物をまとめています。
            </p>
          </div>
        </header>
        <div className="grid gap-4 px-5 py-6">
          {articles.map((article) => (
            <Link
              className="rounded-2xl border border-white/10 bg-white/[0.045] p-4 underline-offset-4 hover:border-amber-100/24 hover:bg-amber-100/[0.05] hover:underline"
              href={`/articles/${article.slug}`}
              key={article.slug}
            >
              <h2 className="text-base font-black text-amber-50">{article.title}</h2>
              <p className="mt-2 text-sm leading-7 text-violet-50/74">{article.description}</p>
            </Link>
          ))}
          <Link className="inline-flex rounded-full border border-amber-100/24 bg-amber-100/[0.07] px-4 py-2 text-sm font-bold text-amber-50" href="/">
            トップへ戻る
          </Link>
        </div>
      </article>
    </main>
  );
}
