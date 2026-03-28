import type { ReactNode } from "react";
import { AppShell } from "@/components/dashboard/app-shell";

export default function ElevateLayout({ children }: { children: ReactNode }) {
  return <AppShell>{children}</AppShell>;
}
