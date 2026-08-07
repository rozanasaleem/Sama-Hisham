import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { headers } from "next/headers";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  const headerStore = await headers();
  const host = headerStore.get("x-forwarded-host") ?? headerStore.get("host");
  const protocol = headerStore.get("x-forwarded-proto") ?? "https";
  const metadataBase = host
    ? new URL(`${protocol}://${host}`)
    : new URL("https://sama-hisham-wedding.site");

  return {
    metadataBase,
    title: "Sama Matar & Hisham Daraghmeh",
    description:
      "Wedding invitation and RSVP for Sama Matar and Hisham Daraghmeh, 10 October 2026 at Odeh Hotel, Aida's Garden.",
    openGraph: {
      title: "Sama & Hisham",
      description: "10 October 2026 at Odeh Hotel, Aida's Garden.",
      images: [{ url: "/og.png", width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: "Sama & Hisham",
      description: "10 October 2026 at Odeh Hotel, Aida's Garden.",
      images: ["/og.png"],
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
