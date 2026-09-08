import Skeleton from "@modules/skeletons/components/skeleton-base"

const SkeletonProductDetail = () => {
  return (
    <div className="py-12 px-4 md:px-6 max-w-[calc(70vw+432px)] mx-auto">
      {/* Breadcrumb */}
      <div className="flex gap-2 mb-6">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-20" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Image Gallery */}
        <div className="flex flex-col gap-4">
          <Skeleton className="w-full aspect-square rounded-2xl" />
          <div className="flex gap-2">
            {Array.from({ length: 4 }, (_, i) => (
              <Skeleton key={i} className="w-20 h-20 rounded-lg" />
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="flex flex-col gap-4">
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-10 w-32" />
          <div className="flex flex-col gap-2 mt-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
          <div className="flex gap-3 mt-4">
            <Skeleton className="h-12 w-12 rounded-lg" />
            <Skeleton className="h-12 flex-1 rounded-lg" />
            <Skeleton className="h-12 flex-1 rounded-lg" />
          </div>
          <Skeleton className="h-14 w-full rounded-xl mt-4" />
        </div>
      </div>

      {/* Related Products */}
      <div className="mt-16">
        <Skeleton className="h-8 w-48 mx-auto mb-8" />
        <div className="grid grid-cols-2 small:grid-cols-4 gap-x-6 gap-y-8">
          {Array.from({ length: 4 }, (_, i) => (
            <div key={i} className="flex flex-col gap-2">
              <Skeleton className="w-full aspect-[9/16] rounded-lg" />
              <Skeleton className="h-5 w-2/3" />
              <Skeleton className="h-4 w-1/3" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default SkeletonProductDetail
