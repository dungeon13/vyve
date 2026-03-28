"use client";

import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export function BackButton({ href, label = "Back" }: { href: string; label?: string }) {
  return (
    <Link
      href={href}
      prefetch
      className="inline-flex min-h-[44px] min-w-[44px] items-center gap-1 rounded-xl px-2 font-semibold text-[var(--text2)] transition-colors hover:text-[var(--text)]"
      aria-label={label}
    >
      <ChevronLeft className="h-5 w-5 shrink-0" aria-hidden />
      <span className="text-sm">{label}</span>
    </Link>
  );
}
