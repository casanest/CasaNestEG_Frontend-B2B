import Skeleton from "@modules/skeletons/components/skeleton-base"

export default function Loading() {
  return (
    <div className="w-full max-w-4xl mx-auto py-12 px-4">
      <Skeleton className="h-8 w-48 mb-8" />
      <div className="flex flex-col gap-4">
        {Array.from({ length: 4 }, (_, i) => (
          <div key={i} className="flex items-center gap-4 p-4 border border-gray-200 rounded-xl">
            <Skeleton className="w-12 h-12 rounded-full shrink-0" />
            <div className="flex flex-col gap-2 flex-1">
              <Skeleton className="h-5 w-2/3" />
              <Skeleton className="h-4 w-1/3" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
