import Skeleton from "@modules/skeletons/components/skeleton-base"
import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid"

const SkeletonStorePage = () => {
  return (
    <div className="py-12 px-4 md:px-6 max-w-[calc(70vw+432px)] mx-auto">
      {/* Page Title */}
      <Skeleton className="h-10 w-48 mb-8" />

      <div className="flex gap-8">
        {/* Filter Sidebar */}
        <div className="hidden small:flex flex-col gap-6 w-64">
          <Skeleton className="h-6 w-20 mb-2" />
          {repeat(4).map((i) => (
            <div key={i} className="flex flex-col gap-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          ))}
        </div>

        {/* Product Grid */}
        <div className="flex-1">
          {/* Sort Bar */}
          <div className="flex items-center justify-between mb-6">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-10 w-40 rounded-lg" />
          </div>
          <SkeletonProductGrid numberOfProducts={8} />
        </div>
      </div>
    </div>
  )
}

function repeat(n: number) {
  return Array.from({ length: n }, (_, i) => i)
}

export default SkeletonStorePage
