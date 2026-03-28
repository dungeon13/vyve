import type { ReactNode } from "react";
import { BottomNav } from "./bottom-nav";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[var(--bg)] pb-[calc(60px+env(safe-area-inset-bottom))]">
      {children}
      <BottomNav />
    </div>
  );
}
