import Skeleton from '@/components/ui/Skeleton';

export default function FilterSkeleton() {
  return (
    <div className="space-y-4">
      <div className="p-4 rounded-xl border border-primary-100 bg-white shadow-sm">
        <Skeleton className="h-10 w-full rounded-md" />
      </div>
      <div className="p-4 rounded-xl border border-primary-100 bg-white shadow-sm space-y-3">
        <Skeleton className="h-5 w-32" />
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3">
            <Skeleton className="h-5 w-5 rounded-full" />
            <Skeleton className="h-4 w-40" />
          </div>
        ))}
      </div>
      <div className="p-4 rounded-xl border border-primary-100 bg-white shadow-sm space-y-3">
        <Skeleton className="h-5 w-28" />
        <Skeleton className="h-2 w-full rounded-full" />
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-20 rounded-md" />
          <Skeleton className="h-8 w-20 rounded-md" />
        </div>
      </div>
    </div>
  );
}
