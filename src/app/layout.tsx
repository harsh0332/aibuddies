import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import CustomCursor from "@/components/ui/custom-cursor";
import SmoothScrollProvider from "@/components/ui/smooth-scroll-provider";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
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
      className={`${plusJakartaSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-surface-base text-white">
        <SmoothScrollProvider>
          <CustomCursor />
          {children}
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
