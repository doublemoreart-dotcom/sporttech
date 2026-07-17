import type { Metadata } from "next";
import { Nunito, Zalando_Sans_Expanded } from "next/font/google";
import "./globals.css";

const nunito = Nunito({
  display: "swap",
  subsets: ["latin"],
  variable: "--font-nunito",
  weight: ["400", "700", "800", "900"],
});

const zalandoSansExpanded = Zalando_Sans_Expanded({
  display: "swap",
  subsets: ["latin"],
  variable: "--font-zalando-sans-expanded",
  weight: "variable",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://dinopeng.com"),
  title: "2022-2026 運動X科技預算小幫手",
  description:
    "一頁式互動查詢工具，協助判讀運動科技預算來源、執行程度、地方場域與協會應用端角色。",
  alternates: {
    canonical: "/sporttech/",
  },
  icons: {
    icon: [
      { url: "https://dinopeng.com/sporttech/assets/favicon.ico", sizes: "any" },
      { url: "https://dinopeng.com/sporttech/assets/favicon.svg", type: "image/svg+xml" },
    ],
    shortcut: "https://dinopeng.com/sporttech/assets/favicon.ico",
  },
  openGraph: {
    title: "2022-2026 運動X科技預算小幫手",
    description:
      "查詢運動科技預算來源、執行程度、地方場域與公開資料線索。",
    url: "/sporttech/",
    siteName: "dinopeng.com",
    locale: "zh_TW",
    type: "website",
    images: [
      {
        url: "https://dinopeng.com/sporttech/assets/og-image.png",
        width: 1200,
        height: 630,
        alt: "運動X科技預算小幫手社群分享縮圖",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "2022-2026 運動X科技預算小幫手",
    description:
      "查詢運動科技預算來源、執行程度、地方場域與公開資料線索。",
    images: ["https://dinopeng.com/sporttech/assets/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-Hant">
      <body className={`${nunito.variable} ${zalandoSansExpanded.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
