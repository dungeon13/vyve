"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Sparkles, User } from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { href: "/dashboard", label: "Home", icon: Home },
  { href: "/elevate", label: "Elevate", icon: Sparkles },
  { href: "/profile", label: "Profile", icon: User },
] as const;

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 border-t border-[var(--border)] bg-[var(--bg2)]/95 backdrop-blur-md pb-[env(safe-area-inset-bottom)]"
      style={{ minHeight: "60px" }}
      aria-label="Main navigation"
    >
      <div className="mx-auto flex max-w-[480px] items-stretch justify-around px-2 pt-1">
        {items.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              prefetch
              role="tab"
              aria-selected={active}
              className={cn(
                "flex min-h-[44px] min-w-[44px] flex-1 flex-col items-center justify-center gap-0.5 rounded-xl py-2 text-[11px] font-semibold transition-colors",
                active ? "text-[var(--teal)]" : "text-[var(--text3)] hover:text-[var(--text2)]"
              )}
            >
              <Icon className="h-6 w-6" strokeWidth={2} aria-hidden />
              <span>{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
