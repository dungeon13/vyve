import type { Metadata } from "next";
import {
  Playfair_Display,
  DM_Sans,
  JetBrains_Mono,
} from "next/font/google";
import "./globals.css";
import { PostHogProvider } from "@/lib/analytics/posthog-provider";
import { AppShell } from "@/components/dashboard/app-shell";
import { AppProviders } from "./providers";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  weight: ["300", "400", "500", "600", "700"],
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
  title: "LifeScore — Know Where You Stand in India",
  description:
    "Holistic life benchmarking for Indian professionals. Financial, career, and health — vs real peers. 2 minutes. Free.",
  openGraph: {
    title: "LifeScore — Know Where You Stand",
    description:
      "Benchmark money, career, and wellness against peers your age, city, and industry.",
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
      <body
        className={`${playfair.variable} ${dmSans.variable} ${jetbrains.variable} min-h-screen`}
      >
        <PostHogProvider>
          <AppProviders>
            <AppShell>{children}</AppShell>
          </AppProviders>
        </PostHogProvider>
      </body>
    </html>
  );
}
