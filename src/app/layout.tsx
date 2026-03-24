import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { PostHogProvider } from "@/lib/analytics/posthog-provider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-display",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
  title: "Vyve — See Your Life Clearly",
  description:
    "Your money. Your career. Your health. Compared to real peers. 2 minutes. Free. No sign-up.",
  openGraph: {
    title: "Vyve — Where Do You Really Stand?",
    description:
      "Benchmark your financial health, career trajectory, and wellness against thousands of professionals like you. Free. 2 minutes.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${plusJakarta.variable} font-sans`}>
        <PostHogProvider>{children}</PostHogProvider>
      </body>
    </html>
  );
}
