import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/features/Navbar";
import { Footer } from "@/components/features/Footer";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "TalentDash — Compensation Intelligence Platform",
    template: "%s | TalentDash",
  },
  description:
    "Real salary data for software engineers across top tech companies in India and worldwide. Compare compensation packages, explore levels, and make informed career decisions.",
  metadataBase: new URL("https://talentdash.vercel.app"),
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://talentdash.vercel.app",
    siteName: "TalentDash",
    title: "TalentDash — Compensation Intelligence Platform",
    description:
      "Real salary data for software engineers across top tech companies.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.className} h-full`}>
      <body className="min-h-full flex flex-col bg-background text-body antialiased">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
