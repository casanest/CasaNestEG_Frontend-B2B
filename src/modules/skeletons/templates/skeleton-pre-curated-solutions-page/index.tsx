import Skeleton from "@modules/skeletons/components/skeleton-base"

const SkeletonPreCuratedSolutionsPage = () => {
  return (
    <div className="w-full py-8 bg-[#f8f9fa]">
      {/* Section Header */}
      <div className="flex flex-col items-center gap-3 px-4 md:px-6 mb-8">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-10 w-80" />
        <Skeleton className="h-5 w-96 max-w-full" />
      </div>

      {/* Cards Grid */}
      <div className="mt-6 md:mt-10 px-2 md:px-4 lg:px-[clamp(16px,2vw,30px)]">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-x-5 md:gap-y-7">
          {Array.from({ length: 4 }, (_, i) => (
            <div key={i} className="flex flex-col gap-3">
              <Skeleton className="w-full h-48 md:h-56 rounded-2xl" />
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-10 w-full rounded-xl" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default SkeletonPreCuratedSolutionsPage
