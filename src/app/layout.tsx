import type { Metadata } from "next";
import { Sora, Geist } from "next/font/google";
import CustomCursor from "@/components/ui/custom-cursor";
import "./globals.css";

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AI Buddies | AI Automation Agency",
  description: "We build AI systems that run your business — so you don't have to. Agents · Automations · AI Skills operating 24/7.",
  openGraph: {
    title: "AI Buddies | AI Automation Agency",
    description: "We build AI systems that run your business — so you don't have to. Agents · Automations · AI Skills operating 24/7.",
    url: "https://aibuddies.agency", // Placeholder for Vercel deploy
    siteName: "AI Buddies",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Buddies | AI Automation Agency",
    description: "We build AI systems that run your business — so you don't have to. Agents · Automations · AI Skills operating 24/7.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${sora.variable} ${geistSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-surface-base text-white">
        <CustomCursor />
        {children}
      </body>
    </html>
  );
}
