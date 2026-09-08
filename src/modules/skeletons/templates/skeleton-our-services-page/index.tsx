import Skeleton from "@modules/skeletons/components/skeleton-base"

const SkeletonOurServicesPage = () => {
  return (
    <div className="py-12 px-4 md:px-6 max-w-[calc(70vw+432px)] mx-auto">
      {/* Page Title */}
      <Skeleton className="h-10 w-64 mx-auto mb-8" />

      {/* Category Tabs */}
      <div className="flex gap-3 justify-center mb-8">
        {Array.from({ length: 5 }, (_, i) => (
          <Skeleton key={i} className="h-10 w-24 rounded-full" />
        ))}
      </div>

      {/* Project Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }, (_, i) => (
          <div key={i} className="flex flex-col gap-3">
            <Skeleton className="w-full h-56 rounded-2xl" />
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        ))}
      </div>
    </div>
  )
}

export default SkeletonOurServicesPage
