import { Skeleton } from "@workspace/ui/components/skeleton";

export default function CompetitionsLoading() {
  return (
    <div className="min-h-[60vh] container mx-auto px-4 py-10 space-y-6">
      <Skeleton className="h-10 w-56" />
      <Skeleton className="h-5 w-full max-w-2xl" />
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, idx) => (
          <div key={idx} className="rounded-xl border p-4 space-y-4">
            <Skeleton className="h-40 w-full" />
            <Skeleton className="h-6 w-2/3" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-4/5" />
          </div>
        ))}
      </div>
    </div>
  );
}
