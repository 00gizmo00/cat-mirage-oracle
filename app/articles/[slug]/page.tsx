import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ContentPage } from "@/components/ContentPage";
import { articles, getArticle, getRelatedArticles } from "@/lib/articles";
import { createPageMetadata, trimDescription } from "@/lib/seo";

type ArticlePageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return articles.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) return {};

  return createPageMetadata({
    title: article.title,
    description: trimDescription(article.description),
    path: `/articles/${article.slug}`,
    type: "article",
  });
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) notFound();

  return (
    <ContentPage
      title={article.title}
      lead={article.lead}
      sections={article.sections}
      breadcrumbs={[
        { href: "/", label: "トップ" },
        { href: "/articles", label: "読み物アーカイブ" },
        { href: `/articles/${article.slug}`, label: article.title },
      ]}
      relatedLinks={getRelatedArticles(article.slug)}
    />
  );
}
