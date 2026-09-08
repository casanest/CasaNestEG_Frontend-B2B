import Skeleton from "@modules/skeletons/components/skeleton-base"

const SkeletonContactPage = () => {
  return (
    <div className="bg-[#f8f9fa] font-satoshi">
      <div className="w-full">
        <div className="flex flex-col lg:flex-row gap-[32px] lg:gap-[60px] items-start px-[16px] lg:px-[60px] py-[44px] lg:py-[80px] max-w-[1512px] mx-auto">
          {/* Left Column - Info */}
          <div className="flex-1 flex flex-col justify-between gap-[24px] lg:gap-[40px] py-0 lg:py-[40px] w-full lg:order-2">
            {/* Heading */}
            <div className="flex flex-col gap-[8px] lg:gap-[16px]">
              <Skeleton className="h-8 w-40" />
              <Skeleton className="h-10 w-72" />
              <Skeleton className="h-5 w-full max-w-[549px]" />
            </div>

            {/* Contact Cards */}
            <div className="flex flex-col gap-[12px] lg:gap-[20px] w-full">
              <div className="flex gap-[12px] lg:gap-[20px]">
                {Array.from({ length: 2 }, (_, i) => (
                  <div key={i} className="flex-1 bg-white border border-[#e5e7eb] rounded-[12px] p-[16px] lg:p-[20px] flex flex-col gap-[8px] lg:gap-[12px]">
                    <Skeleton className="w-[40px] h-[40px] lg:w-[44px] lg:h-[44px] rounded-full" />
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-5 w-28" />
                  </div>
                ))}
              </div>
              {Array.from({ length: 3 }, (_, i) => (
                <div key={i} className="bg-white border border-[#e5e7eb] rounded-[12px] p-[16px] lg:p-[20px] w-full flex flex-row gap-[16px] items-center">
                  <Skeleton className="w-[40px] h-[40px] lg:w-[44px] lg:h-[44px] rounded-full shrink-0" />
                  <div className="flex flex-col gap-[4px]">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-5 w-48" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column - Form Card */}
          <div className="flex-1 lg:order-1 w-full">
            <div className="bg-white border border-[#e5e7eb] rounded-[16px] p-[24px] lg:p-[40px] flex flex-col gap-[20px]">
              {Array.from({ length: 5 }, (_, i) => (
                <div key={i} className="flex flex-col gap-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-12 w-full rounded-lg" />
                </div>
              ))}
              <Skeleton className="h-14 w-full rounded-xl mt-2" />
            </div>
          </div>
        </div>
      </div>

      {/* Social Media Section */}
      <div className="bg-[#f8f9fa] w-full">
        <div className="flex flex-col gap-[28px] lg:gap-[40px] px-[16px] lg:px-[60px] py-[44px] lg:py-[80px] max-w-[1512px] mx-auto">
          <div className="flex flex-col gap-[8px] items-center text-center">
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-10 w-48" />
            <Skeleton className="h-5 w-72 max-w-full" />
          </div>
          <div className="grid grid-cols-2 lg:flex lg:justify-center gap-[16px]">
            {Array.from({ length: 6 }, (_, i) => (
              <Skeleton key={i} className="h-[233px] lg:h-[392px] w-full lg:w-[13vw] rounded-[20px]" />
            ))}
          </div>
        </div>
      </div>

      {/* Map Section */}
      <div className="w-full">
        <div className="flex flex-col gap-[24px] lg:gap-[32px] px-[16px] lg:px-[60px] py-[44px] lg:py-[80px] max-w-[1512px] mx-auto">
          <div className="flex flex-col gap-[8px]">
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-10 w-48" />
          </div>
          <div className="flex flex-col lg:flex-row gap-[20px] lg:gap-[32px] w-full">
            {Array.from({ length: 2 }, (_, i) => (
              <div key={i} className="flex flex-col gap-[12px] w-full lg:flex-1">
                <div className="flex items-start gap-[10px]">
                  <Skeleton className="w-[36px] h-[36px] rounded-full shrink-0" />
                  <div className="flex flex-col gap-[4px]">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-5 w-48" />
                  </div>
                </div>
                <Skeleton className="w-full h-[280px] lg:h-[400px] rounded-[16px]" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default SkeletonContactPage
