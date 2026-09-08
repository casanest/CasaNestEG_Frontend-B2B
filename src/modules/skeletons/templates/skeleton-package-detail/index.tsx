import Skeleton from "@modules/skeletons/components/skeleton-base"

const SkeletonPackageDetail = () => {
  return (
    <div className="py-12 px-4 md:px-6 max-w-[calc(70vw+432px)] mx-auto">
      {/* Breadcrumb */}
      <div className="flex gap-2 mb-6">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-4 w-24" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Image */}
        <Skeleton className="w-full aspect-square rounded-2xl" />

        {/* Info */}
        <div className="flex flex-col gap-4">
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-10 w-32" />
          <div className="flex flex-col gap-2 mt-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
          <Skeleton className="h-14 w-full rounded-xl mt-4" />
        </div>
      </div>

      {/* Product List */}
      <div className="mt-12">
        <Skeleton className="h-8 w-48 mb-6" />
        <div className="flex flex-col gap-4">
          {Array.from({ length: 4 }, (_, i) => (
            <div key={i} className="flex items-center gap-4 p-4 border border-gray-200 rounded-xl">
              <Skeleton className="w-20 h-20 rounded-lg" />
              <div className="flex flex-col gap-2 flex-1">
                <Skeleton className="h-5 w-2/3" />
                <Skeleton className="h-4 w-1/3" />
              </div>
              <Skeleton className="h-10 w-24 rounded-lg" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default SkeletonPackageDetail
