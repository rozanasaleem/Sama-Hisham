import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const headerStore = await headers();
  const host = headerStore.get("x-forwarded-host") ?? headerStore.get("host");
  const protocol = headerStore.get("x-forwarded-proto") ?? "https";
  const metadataBase = host
    ? new URL(`${protocol}://${host}`)
    : new URL("https://sama-hisham-wedding.site");

  return {
    metadataBase,
    title: "Sama Matar & Hisham Daraghme",
    description:
      "Wedding invitation and RSVP for Sama Matar and Hisham Daraghme, 10 October 2026 at 5:00 PM at Odeh Hotel, Aida's Garden.",
    icons: {
      icon: [
        { url: "/favicon-32x32.png?v=2", sizes: "32x32", type: "image/png" },
        { url: "/favicon-16x16.png?v=2", sizes: "16x16", type: "image/png" },
        { url: "/icon-192.png?v=2", sizes: "192x192", type: "image/png" },
      ],
      apple: [{ url: "/apple-touch-icon.png?v=2", sizes: "180x180", type: "image/png" }],
    },
    openGraph: {
      title: "Sama & Hisham",
      description: "10 October 2026 at 5:00 PM at Odeh Hotel, Aida's Garden.",
      images: [{ url: "/og.png", width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: "Sama & Hisham",
      description: "10 October 2026 at 5:00 PM at Odeh Hotel, Aida's Garden.",
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
      <head>
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png?v=2" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png?v=2" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png?v=2" />
      </head>
      <body>{children}</body>
    </html>
  );
}
