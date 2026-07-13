import Link from "next/link";
import { absoluteUrl } from "@/lib/seo";
import { siteConfig } from "@/lib/siteConfig";

type ContentSection = {
  title: string;
  body: string;
};

type ContentPageProps = {
  title: string;
  lead: string;
  sections: ContentSection[];
  breadcrumbs?: { href: string; label: string }[];
  relatedLinks?: { href: string; label: string }[];
};

export function ContentPage({ title, lead, sections, breadcrumbs = [], relatedLinks = [] }: ContentPageProps) {
  const breadcrumbJsonLd =
    breadcrumbs.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: breadcrumbs.map((item, index) => ({
            "@type": "ListItem",
            position: index + 1,
            name: item.label,
            item: absoluteUrl(item.href),
          })),
        }
      : null;

  return (
    <main className="min-h-svh px-4 py-8 text-white">
      {breadcrumbJsonLd ? (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      ) : null}
      <article className="mx-auto max-w-[760px] overflow-hidden rounded-[28px] border border-white/10 bg-[#070612]/92 shadow-[0_24px_80px_rgba(0,0,0,0.48)]">
        <header className="relative border-b border-amber-100/12 px-5 py-7">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(217,190,119,0.16),transparent_34%),radial-gradient(circle_at_18%_86%,rgba(88,28,135,0.2),transparent_42%)]" />
          <div className="relative">
            {breadcrumbs.length > 0 ? (
              <nav className="mb-4 flex flex-wrap items-center gap-2 text-[11px] font-bold text-white/46" aria-label="パンくず">
                {breadcrumbs.map((item, index) => (
                  <span className="flex items-center gap-2" key={item.href}>
                    {index > 0 ? <span className="text-amber-100/34">/</span> : null}
                    {index === breadcrumbs.length - 1 ? (
                      <span className="text-amber-50/78">{item.label}</span>
                    ) : (
                      <Link className="underline-offset-4 hover:text-amber-100 hover:underline" href={item.href}>
                        {item.label}
                      </Link>
                    )}
                  </span>
                ))}
              </nav>
            ) : null}
            <p className="font-serif text-[10px] font-bold tracking-[0.34em] text-amber-100/58">{siteConfig.name}</p>
            <h1 className="mt-2 font-serif text-3xl font-bold leading-tight">{title}</h1>
            <p className="mt-3 text-sm leading-7 text-violet-50/72">{lead}</p>
          </div>
        </header>
        <div className="space-y-5 px-5 py-6">
          {sections.map((section) => (
            <section className="rounded-2xl border border-white/10 bg-white/[0.045] p-4" key={section.title}>
              <h2 className="text-base font-black text-amber-50">{section.title}</h2>
              <p className="mt-2 whitespace-pre-line text-sm leading-7 text-violet-50/74">{section.body}</p>
            </section>
          ))}
          {relatedLinks.length > 0 ? (
            <section className="rounded-2xl border border-amber-100/14 bg-amber-100/[0.055] p-4">
              <h2 className="text-base font-black text-amber-50">おすすめ記事</h2>
              <div className="mt-3 grid gap-2 sm:grid-cols-3">
                {relatedLinks.map((link) => (
                  <Link
                    className="rounded-2xl border border-white/10 bg-black/24 px-3 py-3 text-sm font-bold leading-5 text-violet-50/78 underline-offset-4 hover:text-amber-100 hover:underline"
                    href={link.href}
                    key={link.href}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </section>
          ) : null}
          <Link className="inline-flex rounded-full border border-amber-100/24 bg-amber-100/[0.07] px-4 py-2 text-sm font-bold text-amber-50" href="/">
            トップへ戻る
          </Link>
        </div>
      </article>
    </main>
  );
}
