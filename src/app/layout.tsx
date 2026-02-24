import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Providers } from "@/components/providers";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LotoSmart - Gerador Inteligente de Jogos da Loteria",
  description:
    "Gere jogos da loteria federal com inteligência artificial, análise estatística e filtros avançados. Mega-Sena, Lotofácil, Quina e mais.",
  keywords: [
    "loteria",
    "mega-sena",
    "lotofácil",
    "gerador de jogos",
    "inteligência artificial",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
