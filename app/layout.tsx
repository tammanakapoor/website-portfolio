import type { Metadata } from "next";
import { Caveat, Cormorant_Garamond, Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant-garamond",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});
const caveat = Caveat({ variable: "--font-caveat", subsets: ["latin"] });

const title = "Tammana Kapoor — Ideas that grow gently";
const description = "The moonlit portfolio pond of Tammana Kapoor—an educator, designer and curious maker creating thoughtful experiences for the web.";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.SITE_URL ?? "http://localhost:3000"),
  title,
  description,
  openGraph: { title, description, type: "website", images: ["/og-pond.png"] },
  twitter: { card: "summary_large_image", title, description, images: ["/og-pond.png"] },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} ${cormorant.variable} ${caveat.variable}`}>{children}</body>
    </html>
  );
}
