import Skeleton from "@modules/skeletons/components/skeleton-base"
import SkeletonProductPreview from "@modules/skeletons/components/skeleton-product-preview"
import repeat from "@lib/util/repeat"

const SkeletonHomePage = () => {
  return (
    <div className="w-full">
      {/* Hero Section */}
      <div className="w-full h-[60vh] md:h-[80vh] skeleton-shimmer" />

      {/* Our Clients */}
      <div className="py-12 px-4 md:px-6 max-w-[calc(70vw+432px)] mx-auto">
        <Skeleton className="h-8 w-48 mx-auto mb-6" />
        <div className="flex gap-4 justify-center flex-wrap">
          {repeat(6).map((i) => (
            <Skeleton key={i} className="w-24 h-16" />
          ))}
        </div>
      </div>

      {/* Amenities / Product Grid */}
      <div className="py-12 px-4 md:px-6 max-w-[calc(70vw+432px)] mx-auto">
        <Skeleton className="h-8 w-64 mx-auto mb-8" />
        <ul className="grid grid-cols-2 small:grid-cols-4 medium:grid-cols-5 gap-x-6 gap-y-8">
          {repeat(5).map((i) => (
            <li key={i}>
              <SkeletonProductPreview />
            </li>
          ))}
        </ul>
      </div>

      {/* Pre-Curated Solutions */}
      <div className="py-12 px-4 md:px-6 bg-[#f8f9fa]">
        <Skeleton className="h-8 w-64 mx-auto mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-x-5 md:gap-y-7 max-w-[calc(70vw+432px)] mx-auto">
          {repeat(4).map((i) => (
            <div key={i} className="flex flex-col gap-3">
              <Skeleton className="w-full h-48 md:h-56 rounded-2xl" />
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-10 w-full rounded-xl" />
            </div>
          ))}
        </div>
      </div>

      {/* Stats Bar */}
      <div className="py-12 px-4 md:px-6">
        <div className="flex justify-around max-w-[calc(70vw+432px)] mx-auto">
          {repeat(4).map((i) => (
            <div key={i} className="flex flex-col items-center gap-2">
              <Skeleton className="h-10 w-16" />
              <Skeleton className="h-4 w-20" />
            </div>
          ))}
        </div>
      </div>

      {/* Our Partners */}
      <div className="py-12 px-4 md:px-6 max-w-[calc(70vw+432px)] mx-auto">
        <Skeleton className="h-8 w-48 mx-auto mb-6" />
        <div className="flex gap-4 justify-center flex-wrap">
          {repeat(6).map((i) => (
            <Skeleton key={i} className="w-24 h-16" />
          ))}
        </div>
      </div>

      {/* Our Work / Portfolio */}
      <div className="py-12 px-4 md:px-6 max-w-[calc(70vw+432px)] mx-auto">
        <Skeleton className="h-8 w-48 mx-auto mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {repeat(3).map((i) => (
            <div key={i} className="flex flex-col gap-3">
              <Skeleton className="w-full h-56 rounded-2xl" />
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))}
        </div>
      </div>

      {/* Testimonials */}
      <div className="py-12 px-4 md:px-6 bg-[#f8f9fa]">
        <Skeleton className="h-8 w-64 mx-auto mb-8" />
        <div className="flex gap-6 justify-center flex-wrap max-w-[calc(70vw+432px)] mx-auto">
          {repeat(3).map((i) => (
            <div key={i} className="flex flex-col gap-3 max-w-sm flex-1">
              <Skeleton className="w-16 h-16 rounded-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-6 w-32 mt-2" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default SkeletonHomePage
