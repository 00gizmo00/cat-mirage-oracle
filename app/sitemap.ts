import type { MetadataRoute } from "next";
import { articles } from "@/lib/articles";
import { absoluteUrl } from "@/lib/seo";
import { tarotDetails } from "@/lib/tarotDetails";
import { zodiacSigns } from "@/lib/zodiac";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    { path: "", changeFrequency: "daily" as const, priority: 1 },
    { path: "/about", changeFrequency: "monthly" as const, priority: 0.8 },
    { path: "/guide", changeFrequency: "weekly" as const, priority: 0.86 },
    { path: "/how-to-use", changeFrequency: "monthly" as const, priority: 0.8 },
    { path: "/articles", changeFrequency: "weekly" as const, priority: 0.85 },
    { path: "/tarot", changeFrequency: "monthly" as const, priority: 0.8 },
    { path: "/zodiac", changeFrequency: "daily" as const, priority: 0.82 },
    { path: "/journal", changeFrequency: "monthly" as const, priority: 0.7 },
    { path: "/privacy", changeFrequency: "monthly" as const, priority: 0.5 },
    { path: "/terms", changeFrequency: "monthly" as const, priority: 0.5 },
    { path: "/disclaimer", changeFrequency: "monthly" as const, priority: 0.5 },
    { path: "/contact", changeFrequency: "monthly" as const, priority: 0.4 },
  ];

  const articleRoutes = articles.map((article) => ({
    path: `/articles/${article.slug}`,
    changeFrequency: "monthly" as const,
    priority: 0.72,
  }));

  const tarotRoutes = tarotDetails.map((card) => ({
    path: `/tarot/${card.slug}`,
    changeFrequency: "monthly" as const,
    priority: 0.68,
  }));

  const zodiacRoutes = zodiacSigns.map((sign) => ({
    path: `/zodiac/${sign.slug}`,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const routes = [...staticRoutes, ...articleRoutes, ...tarotRoutes, ...zodiacRoutes];

  return routes.map((route) => ({
    url: absoluteUrl(route.path || "/"),
    lastModified: new Date(),
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
