import { redirect } from "next/navigation";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Check Your Vyve Score — Free",
  description:
    "Your money. Your career. Your health. Compared to real peers. 2 minutes. Free. No sign-up.",
  openGraph: {
    title: "Where Do You Really Stand?",
    description:
      "Benchmark your financial health, career trajectory, and wellness against thousands of professionals like you.",
    images: [{ url: "/api/og?text=Where%20do%20you%20really%20stand%3F", width: 1200, height: 630 }],
  },
};

export default function CheckPage() {
  redirect("/");
}
