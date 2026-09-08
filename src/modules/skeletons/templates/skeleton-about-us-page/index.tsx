import Skeleton from "@modules/skeletons/components/skeleton-base"

const SkeletonAboutUsPage = () => {
  return (
    <div className="bg-white flex flex-col items-center w-full">
      {/* Hero Split */}
      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-8 px-4 md:px-6 py-16 max-w-[calc(70vw+432px)] mx-auto">
        <div className="flex flex-col gap-4 justify-center">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
        <Skeleton className="w-full h-64 md:h-80 rounded-2xl" />
      </div>

      {/* Our Clients */}
      <div className="py-12 px-4 md:px-6 max-w-[calc(70vw+432px)] mx-auto w-full">
        <Skeleton className="h-8 w-48 mx-auto mb-6" />
        <div className="flex gap-4 justify-center flex-wrap">
          {Array.from({ length: 6 }, (_, i) => (
            <Skeleton key={i} className="w-24 h-16" />
          ))}
        </div>
      </div>

      {/* Stats Bar */}
      <div className="py-12 px-4 md:px-6 w-full max-w-[calc(70vw+432px)] mx-auto">
        <div className="flex justify-around">
          {Array.from({ length: 4 }, (_, i) => (
            <div key={i} className="flex flex-col items-center gap-2">
              <Skeleton className="h-10 w-16" />
              <Skeleton className="h-4 w-20" />
            </div>
          ))}
        </div>
      </div>

      {/* Mission Section */}
      <div className="py-16 px-4 md:px-6 max-w-[calc(70vw+432px)] mx-auto w-full">
        <Skeleton className="h-8 w-48 mx-auto mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Array.from({ length: 3 }, (_, i) => (
            <div key={i} className="flex flex-col gap-3">
              <Skeleton className="w-12 h-12 rounded-full" />
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          ))}
        </div>
      </div>

      {/* Arch Showcase */}
      <div className="w-full py-16">
        <Skeleton className="w-full h-64 md:h-96" />
      </div>

      {/* Values Section */}
      <div className="py-16 px-4 md:px-6 max-w-[calc(70vw+432px)] mx-auto w-full">
        <Skeleton className="h-8 w-48 mx-auto mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Array.from({ length: 4 }, (_, i) => (
            <div key={i} className="flex gap-4">
              <Skeleton className="w-16 h-16 rounded-xl shrink-0" />
              <div className="flex flex-col gap-2 flex-1">
                <Skeleton className="h-6 w-2/3" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Team Showcase */}
      <div className="py-16 px-4 md:px-6 max-w-[calc(70vw+432px)] mx-auto w-full">
        <Skeleton className="h-8 w-48 mx-auto mb-8" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {Array.from({ length: 4 }, (_, i) => (
            <div key={i} className="flex flex-col gap-3 items-center">
              <Skeleton className="w-32 h-32 rounded-full" />
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-4 w-16" />
            </div>
          ))}
        </div>
      </div>

      {/* Timeline */}
      <div className="py-16 px-4 md:px-6 max-w-[calc(70vw+432px)] mx-auto w-full">
        <Skeleton className="h-8 w-48 mx-auto mb-8" />
        <div className="flex justify-between gap-4">
          {Array.from({ length: 5 }, (_, i) => (
            <div key={i} className="flex flex-col items-center gap-2 flex-1">
              <Skeleton className="w-8 h-8 rounded-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-3 w-3/4" />
            </div>
          ))}
        </div>
      </div>

      {/* Work Gallery */}
      <div className="py-16 px-4 md:px-6 max-w-[calc(70vw+432px)] mx-auto w-full">
        <Skeleton className="h-8 w-48 mx-auto mb-8" />
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {Array.from({ length: 6 }, (_, i) => (
            <Skeleton key={i} className="w-full h-40 md:h-56 rounded-2xl" />
          ))}
        </div>
      </div>

      {/* Testimonials */}
      <div className="py-16 px-4 md:px-6 bg-[#f8f9fa] w-full">
        <Skeleton className="h-8 w-64 mx-auto mb-8" />
        <div className="flex gap-6 justify-center flex-wrap max-w-[calc(70vw+432px)] mx-auto">
          {Array.from({ length: 3 }, (_, i) => (
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

export default SkeletonAboutUsPage
