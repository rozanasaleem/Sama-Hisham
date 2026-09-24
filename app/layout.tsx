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
      </head>
      <body>{children}</body>
    </html>
  );
}
