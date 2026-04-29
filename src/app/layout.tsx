import type { Metadata } from "next";
import { Inter, Noto_Sans_Ethiopic } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const notoEthiopic = Noto_Sans_Ethiopic({
  variable: "--font-noto-ethiopic",
  subsets: ["ethiopic"],
});

export const metadata: Metadata = {
  title: "Ethiopian Lutheran Liturgical Engine",
  description: "An open-source, community-collaborated liturgical data engine for Ethiopian Lutheran churches (LCE, EECMY, EELC). Computes the Bahire Hasab, tracks the 3-year lectionary, and provides scriptural readings.",
  keywords: ["Ethiopian Lutheran", "LCE", "EECMY", "EELC", "Ethiopian Calendar", "Bahire Hasab", "Liturgical Engine", "Lectionary", "Open Source", "Ethiopia"],
  authors: [{ name: "Open Source Community" }],
  openGraph: {
    title: "Ethiopian Lutheran Liturgical Engine",
    description: "An open-source, community-collaborated liturgical data engine for Ethiopian Lutheran churches (LCE, EECMY, EELC).",
    type: "website",
  },
  icons: {
    icon: "/luther-rose.svg",
    apple: "/luther-rose.svg",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${notoEthiopic.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col"><ThemeProvider>{children}</ThemeProvider></body>
    </html>
  );
}
