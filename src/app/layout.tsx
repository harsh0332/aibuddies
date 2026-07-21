import type { Metadata } from "next";
import CustomCursor from "@/components/ui/custom-cursor";
import SmoothScrollProvider from "@/components/ui/smooth-scroll-provider";
import { BRAND_CONFIG } from "@/config/content";
import "./globals.css";

const plusJakartaSans = {
  variable: "--font-jakarta",
};

export const metadata: Metadata = {
  title: `${BRAND_CONFIG.name} | AI Automation Agency`,
  description: `${BRAND_CONFIG.primaryTagline} ${BRAND_CONFIG.categoryLine}`,
  openGraph: {
    title: `${BRAND_CONFIG.name} | AI Automation Agency`,
    description: `${BRAND_CONFIG.primaryTagline} ${BRAND_CONFIG.categoryLine}`,
    url: "https://aibuddies.agency", // Placeholder for Vercel deploy
    siteName: BRAND_CONFIG.name,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${BRAND_CONFIG.name} | AI Automation Agency`,
    description: `${BRAND_CONFIG.primaryTagline} ${BRAND_CONFIG.categoryLine}`,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": "https://aibuddies.agency/#organization",
        "name": BRAND_CONFIG.name,
        "url": "https://aibuddies.agency",
        "logo": "https://aibuddies.agency/logo.png",
        "sameAs": [
          BRAND_CONFIG.contact.instagramLink
        ],
        "contactPoint": {
          "@type": "ContactPoint",
          "telephone": BRAND_CONFIG.contact.whatsapp,
          "contactType": "customer service"
        }
      },
      {
        "@type": "Service",
        "name": "AI Systems Automation",
        "provider": {
          "@id": "https://aibuddies.agency/#organization"
        },
        "description": BRAND_CONFIG.primaryTagline,
        "areaServed": "Worldwide"
      }
    ]
  };

  return (
    <html
      lang="en"
      className={`${plusJakartaSans.variable} h-full antialiased`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-surface-base text-white">
        <SmoothScrollProvider>
          <CustomCursor />
          {children}
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
