import type { Metadata } from "next";
import { Inter, DM_Sans } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/shared/Header";
import { Footer } from "@/components/shared/Footer";
import { SmoothScroll } from "@/components/ui/SmoothScroll";
import { NoiseOverlay } from "@/components/ui/NoiseOverlay";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const dmSans = DM_Sans({
  variable: "--font-heading",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DealFlow | Premium M&A Brokerage",
  description: "Povezujemo vlasnike tvrtki i kvalificirane kupce u Hrvatskoj.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="hr"
      className={`${inter.variable} ${dmSans.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col">
        <NoiseOverlay />
        <SmoothScroll>
          <Header />
          <main className="flex-1 flex flex-col">{children}</main>
          <Footer />
        </SmoothScroll>
      </body>
    </html>
  );
}
