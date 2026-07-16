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
  title: "2022-2026 運動X科技預算小幫手",
  description:
    "一頁式互動查詢工具，協助判讀運動科技預算來源、執行程度、地方場域與協會應用端角色。",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
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
