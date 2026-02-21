import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ThemeProvider } from "@/components/theme-provider";
import { ReduxProvider } from "@/lib/redux/provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Rakibul | FullStack Developer",
  description: "Explore the portfolio of a skilled Full-Stack Developer with expertise in React, Next.js, Node.js, and AWS. 2+ years of experience building production-grade applications.",
  keywords: ["full-stack developer", "react", "next.js", "node.js", "typescript", "aws", "portfolio"],
  authors: [{ name: "Rakibul Islam" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://yourportfolio.com",
    title: "Rakibul",
    description: "FullStack Developer with modern technologies",
    siteName: "Portfolio",
  },
  twitter: {
    card: "summary_large_image",
    title: "Rakibul",
    description: "FullStck with modern technologies",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <ReduxProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange={false}>
            <Navbar />
            <main className="min-h-screen pt-16 md:pt-20 xl:28">
              {children}
            </main>
            <Footer />
          </ThemeProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
