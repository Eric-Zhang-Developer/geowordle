import type { Metadata } from "next";
import { Rye, Special_Elite } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const rye = Rye({ subsets: ["latin"], weight: "400", variable: "--font-rye" });
const specialElite = Special_Elite({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-special-elite",
});

export const metadata: Metadata = {
  title: "Statle",
  description: "Guess the US state from statistical clues",
  icons: { icon: "/state-pics/Favicon.png" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${rye.variable} ${specialElite.variable} font-special-elite antialiased text-stone-900`}
      >
        {children}
        <Analytics />
      </body>
    </html>
  );
}
