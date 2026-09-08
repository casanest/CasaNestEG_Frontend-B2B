import Skeleton from "@modules/skeletons/components/skeleton-base"

const SkeletonFaqPage = () => {
  return (
    <div className="bg-[#f8f9fa] flex flex-col items-start relative w-full">
      {/* Header */}
      <div className="flex flex-col gap-4 items-center px-6 md:px-[60px] py-10 md:py-[40px] w-full">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-12 w-80" />
        <Skeleton className="h-5 w-96 max-w-full" />
      </div>

      {/* FAQ List */}
      <div className="flex flex-col gap-4 md:gap-[16px] items-center px-6 md:px-[60px] py-10 md:py-[80px] w-full">
        {Array.from({ length: 5 }, (_, i) => (
          <div key={i} className="w-full max-w-[800px] bg-white border border-gray-200 rounded-2xl p-5 flex items-center gap-4">
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-6 rounded shrink-0" />
          </div>
        ))}
      </div>

      {/* CTA Card */}
      <div className="bg-white flex flex-col items-center justify-center p-6 md:p-[60px] w-full">
        <div className="bg-[#262d3b] flex flex-col gap-8 items-center justify-center px-6 md:px-[40px] py-10 md:py-[50px] rounded-[24px] md:rounded-[40px] w-full max-w-[1392px]">
          <div className="flex flex-col gap-3 items-center text-center">
            <Skeleton className="h-10 w-64" />
            <Skeleton className="h-5 w-72" />
          </div>
          <Skeleton className="h-14 w-full sm:w-[240px] rounded-[16px]" />
        </div>
      </div>
    </div>
  )
}

export default SkeletonFaqPage
