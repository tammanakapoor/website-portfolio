import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Tammana Kapoor — Creator, curious learner & vibe coder",
  description: "Tammana Kapoor is a creator, curious learner and vibe coder making thoughtful little experiences for the web.",
  openGraph: {
    title: "Tammana Kapoor — Creator, curious learner & vibe coder",
    description: "Learning new things and making thoughtful little experiences for the web.",
    type: "website",
  },
  twitter: { card: "summary" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body className={`${geistSans.variable} ${geistMono.variable}`}>{children}</body></html>;
}
