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

const title = "Tammana Kapoor — Creator, curious learner & vibe coder";
const description = "Tammana Kapoor is a creator, curious learner and vibe coder making thoughtful little experiences for the web.";

export const metadata: Metadata = {
  title,
  description,
  openGraph: { title, description, type: "website", images: ["/og.png"] },
  twitter: { card: "summary_large_image", title, description, images: ["/og.png"] },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} ${cormorant.variable} ${caveat.variable}`}>{children}</body>
    </html>
  );
}
