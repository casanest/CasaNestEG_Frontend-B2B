import Skeleton from "@modules/skeletons/components/skeleton-base"
import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid"

const SkeletonCollectionPage = () => {
  return (
    <div className="py-12 px-4 md:px-6 max-w-[calc(70vw+432px)] mx-auto">
      {/* Breadcrumb */}
      <div className="flex gap-2 mb-6">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-4 w-24" />
      </div>

      {/* Collection Title */}
      <Skeleton className="h-10 w-64 mb-8" />

      {/* Sort Bar */}
      <div className="flex items-center justify-between mb-6">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-10 w-40 rounded-lg" />
      </div>

      <SkeletonProductGrid numberOfProducts={8} />
    </div>
  )
}

export default SkeletonCollectionPage
