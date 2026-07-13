import type { Metadata, Viewport } from "next";
import { SiteFooter } from "@/components/SiteFooter";
import { siteConfig } from "@/lib/siteConfig";
import "./globals.css";

const logoImage = "/brand/cat-mirage-logo.png";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  applicationName: siteConfig.name,
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  icons: {
    icon: logoImage,
    apple: logoImage,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body>
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
