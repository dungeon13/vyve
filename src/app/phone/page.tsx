"use client";

import { useRouter } from "next/navigation";
import { PhoneCapture } from "@/components/score/phone-capture";

export default function PhonePage() {
  const router = useRouter();

  return (
    <PhoneCapture
      onVerified={() => router.push("/dashboard")}
      onSkip={() => router.push("/dashboard")}
    />
  );
}
