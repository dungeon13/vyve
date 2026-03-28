import { Skeleton } from "@/components/ui/skeleton";

export function DashboardPageSkeleton() {
  return (
    <div className="mx-auto max-w-[480px] px-[var(--pad-x)] pb-8 pt-8" aria-busy aria-label="Loading dashboard">
      <div className="mb-8 flex items-center justify-between gap-3">
        <div className="space-y-2">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-32" />
        </div>
        <Skeleton className="h-14 w-14 shrink-0 rounded-full" />
      </div>
      <div className="elevated-card p-6">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="mt-4 h-16 w-28" />
        <Skeleton className="mt-3 h-3 w-full max-w-[200px]" />
      </div>
      <div className="mt-4 grid grid-cols-3 gap-2">
        <Skeleton className="h-28 rounded-[22px]" />
        <Skeleton className="h-28 rounded-[22px]" />
        <Skeleton className="h-28 rounded-[22px]" />
      </div>
      <Skeleton className="mt-6 h-36 rounded-[var(--radius-card)]" />
      <Skeleton className="mt-8 h-12 rounded-[18px]" />
    </div>
  );
}

export function ProfilePageSkeleton() {
  return (
    <div className="mx-auto max-w-[480px] px-[var(--pad-x)] pb-10 pt-8" aria-busy aria-label="Loading profile">
      <Skeleton className="h-3 w-20" />
      <div className="mt-4 flex items-center gap-4">
        <Skeleton className="h-20 w-20 shrink-0 rounded-full" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-7 w-40" />
          <Skeleton className="h-4 w-56" />
        </div>
      </div>
      <div className="mt-8 grid grid-cols-3 gap-2">
        <Skeleton className="h-24 rounded-2xl" />
        <Skeleton className="h-24 rounded-2xl" />
        <Skeleton className="h-24 rounded-2xl" />
      </div>
      <Skeleton className="mt-8 h-64 rounded-[20px]" />
    </div>
  );
}

export function BriefPageSkeleton() {
  return (
    <div className="mx-auto max-w-[480px] px-[var(--pad-x)] pb-12 pt-10" aria-busy aria-label="Loading brief">
      <Skeleton className="h-3 w-28" />
      <Skeleton className="mt-4 h-10 w-full max-w-[280px]" />
      <Skeleton className="mt-3 h-3 w-48" />
      <Skeleton className="mt-8 h-40 rounded-[20px]" />
      <Skeleton className="mt-4 h-28 rounded-[20px]" />
      <Skeleton className="mt-4 h-28 rounded-[20px]" />
    </div>
  );
}

export function ElevatePageSkeleton() {
  return (
    <div className="mx-auto max-w-[480px] px-[var(--pad-x)] pb-12 pt-8" aria-busy aria-label="Loading elevate">
      <Skeleton className="h-3 w-16" />
      <Skeleton className="mt-4 h-9 w-56" />
      <Skeleton className="mt-2 h-4 w-full" />
      <Skeleton className="mt-8 h-52 rounded-[var(--radius-card)]" />
      <Skeleton className="mt-5 h-52 rounded-[var(--radius-card)]" />
      <Skeleton className="mt-5 h-52 rounded-[var(--radius-card)]" />
      <Skeleton className="mt-8 h-14 rounded-[18px]" />
    </div>
  );
}

export function SharePageSkeleton() {
  return (
    <div className="mx-auto max-w-[480px] px-[var(--pad-x)] py-10" aria-busy aria-label="Loading share">
      <div className="mb-8 flex flex-col items-center">
        <Skeleton className="h-8 w-8 rounded-lg" />
        <Skeleton className="mt-4 h-8 w-64" />
        <Skeleton className="mt-2 h-4 w-full max-w-[280px]" />
      </div>
      <Skeleton className="h-56 rounded-[20px]" />
      <Skeleton className="mt-4 h-56 rounded-[20px]" />
      <Skeleton className="mt-8 h-14 rounded-[18px]" />
    </div>
  );
}

export function DrilldownPageSkeleton() {
  return (
    <div className="mx-auto max-w-[480px] px-[var(--pad-x)] pb-12 pt-6" aria-busy aria-label="Loading drilldown">
      <Skeleton className="h-10 w-24" />
      <Skeleton className="mt-6 h-4 w-20" />
      <Skeleton className="mt-2 h-9 w-48" />
      <Skeleton className="mt-2 h-4 w-full" />
      <Skeleton className="mt-6 h-36 rounded-[20px]" />
      <Skeleton className="mt-6 h-24 rounded-[20px]" />
      <Skeleton className="mt-3 h-24 rounded-[20px]" />
    </div>
  );
}
