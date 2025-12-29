import type { Metadata } from "next";

import { Noto_Sans_JP, Zen_Kaku_Gothic_New } from "next/font/google";

import "../index.css";
import Providers from "@/components/providers";

const zenKaku = Zen_Kaku_Gothic_New({
  variable: "--font-zen-kaku",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

const notoSansJP = Noto_Sans_JP({
  variable: "--font-noto-sans-jp",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: "算命学鑑定",
  description: "生年月日から宿命を読み解く算命学鑑定アプリ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" suppressHydrationWarning>
      <body className={`${zenKaku.variable} ${notoSansJP.variable} antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
