import Link from "next/link";

const footerLinks = [
  { href: "/about", label: "このサイトについて" },
  { href: "/guide", label: "ガイド" },
  { href: "/tarot", label: "猫タロット解説" },
  { href: "/zodiac", label: "12星座猫図鑑" },
  { href: "/journal", label: "占い帳について" },
  { href: "/contact", label: "お問い合わせ" },
  { href: "/privacy", label: "プライバシーポリシー" },
  { href: "/terms", label: "利用規約" },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-white/10 bg-[#03030b]/92 px-5 py-6 text-center text-[11px] text-white/46">
      <nav className="mx-auto flex max-w-[430px] flex-wrap justify-center gap-x-4 gap-y-2" aria-label="公開情報">
        {footerLinks.map((link) => (
          <Link className="font-bold underline-offset-4 hover:text-amber-100 hover:underline" href={link.href} key={link.href}>
            {link.label}
          </Link>
        ))}
      </nav>
      <p className="mt-4 leading-5">猫星ミラージュ占譜はエンタメ用途の占いWebアプリです。</p>
    </footer>
  );
}
