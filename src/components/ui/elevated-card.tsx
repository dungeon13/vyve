import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function ElevatedCard({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("elevated-card p-7", className)}>{children}</div>
  );
}
