import type { Metadata } from "next";
import Link from "next/link";
import { ZodiacCatIcon } from "@/components/ZodiacCatIcon";
import { zodiacSigns } from "@/lib/zodiac";

export const metadata: Metadata = {
  title: "12星座猫図鑑",
  description: "猫星ミラージュ占譜の12星座猫アイコンと、星座ごとの基本性格・恋愛・仕事・人間関係を紹介します。",
  alternates: { canonical: "/zodiac" },
};

export default function ZodiacIndexPage() {
  return (
    <main className="min-h-svh px-4 py-8 text-white">
      <article className="mx-auto max-w-[760px] overflow-hidden rounded-[28px] border border-white/10 bg-[#070612]/92 shadow-[0_24px_80px_rgba(0,0,0,0.48)]">
        <header className="relative border-b border-amber-100/12 px-5 py-7">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(217,190,119,0.16),transparent_34%),radial-gradient(circle_at_18%_86%,rgba(88,28,135,0.2),transparent_42%)]" />
          <div className="relative">
            <p className="font-serif text-[10px] font-bold tracking-[0.34em] text-amber-100/58">ZODIAC CAT LIBRARY</p>
            <h1 className="mt-2 font-serif text-3xl font-bold leading-tight">12星座猫図鑑</h1>
            <p className="mt-3 text-sm leading-7 text-violet-50/72">
              12星座を黒猫、金色ライン、深い藍色のタロット風装飾で表現した図鑑です。毎日の猫星ランキングとあわせて、星座ごとの特徴を読み返せます。
            </p>
          </div>
        </header>
        <div className="grid gap-3 px-5 py-6 sm:grid-cols-2">
          {zodiacSigns.map((sign) => (
            <Link
              className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.045] p-3 underline-offset-4 hover:border-amber-100/24 hover:bg-amber-100/[0.05] hover:underline"
              href={`/zodiac/${sign.slug}`}
              key={sign.slug}
            >
              <ZodiacCatIcon sign={sign} size="sm" />
              <div className="min-w-0">
                <p className="font-serif text-[10px] font-bold tracking-[0.22em] text-amber-100/54">{sign.english}</p>
                <h2 className="mt-1 text-base font-black text-white">{sign.name}</h2>
                <p className="mt-1 line-clamp-2 text-xs leading-5 text-violet-50/62">{sign.personality}</p>
              </div>
            </Link>
          ))}
          <Link className="mt-2 inline-flex rounded-full border border-amber-100/24 bg-amber-100/[0.07] px-4 py-2 text-sm font-bold text-amber-50 sm:col-span-2" href="/">
            トップへ戻る
          </Link>
        </div>
      </article>
    </main>
  );
}
