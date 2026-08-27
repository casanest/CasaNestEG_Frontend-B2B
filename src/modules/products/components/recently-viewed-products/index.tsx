"use client"

import { useState, useCallback, useEffect } from "react"
import useEmblaCarousel from "embla-carousel-react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useLocale } from "next-intl"
import { HttpTypes } from "@medusajs/types"
import { useRecentlyViewed } from "@lib/hooks/use-recently-viewed"
import Product from "../product-preview"

type RecentlyViewedProductsProps = {
  region: HttpTypes.StoreRegion
  countryCode: string
  currentProductId: string
}

export default function RecentlyViewedProducts({
  region,
  countryCode,
  currentProductId,
}: RecentlyViewedProductsProps) {
  const locale = useLocale()
  const isRTL = locale === "ar"
  const { items, hydrated } = useRecentlyViewed()

  const recentItems = items.filter((item) => item.product.id !== currentProductId)
  const recentProducts = recentItems.map((item) => item.product)

  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    containScroll: "trimSnaps",
    dragFree: true,
    direction: isRTL ? "rtl" : "ltr",
    watchDrag: () =>
      typeof window !== "undefined" &&
      window.matchMedia("(max-width: 1023px)").matches,
  })
  const [canPrev, setCanPrev] = useState(false)
  const [canNext, setCanNext] = useState(true)

  const updateButtons = useCallback(() => {
    if (!emblaApi) return
    setCanPrev(emblaApi.canScrollPrev())
    setCanNext(emblaApi.canScrollNext())
  }, [emblaApi])

  useEffect(() => {
    if (!emblaApi) return
    updateButtons()
    emblaApi.on("select", updateButtons)
    emblaApi.on("reInit", updateButtons)
    return () => {
      emblaApi.off("select", updateButtons)
      emblaApi.off("reInit", updateButtons)
    }
  }, [emblaApi, updateButtons])

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi])
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi])

  const prevClick = isRTL ? scrollNext : scrollPrev
  const nextClick = isRTL ? scrollPrev : scrollNext
  const prevDisabled = isRTL ? !canNext : !canPrev
  const nextDisabled = isRTL ? !canPrev : !canNext

  if (!hydrated || recentProducts.length === 0) {
    return null
  }

  return (
    <div className="w-full">
      {/* Section Header */}
      <div className="flex flex-col items-start mb-6">
        <span className="text-[24px] font-medium text-[#707176] mb-1" style={{ fontFamily: "Caveat, cursive" }}>
          {isRTL ? "استكمل التصفح" : "Continue Browsing"}
        </span>
        <p className="text-[28px] font-bold text-[#17284a]">
          {isRTL ? "شوهد مؤخرًا" : "Recently Viewed"}
        </p>
      </div>

      <div className="relative w-full">
        {/* Left arrow — desktop only */}
        {recentProducts.length > 3 && (
          <button
            onClick={prevClick}
            disabled={prevDisabled}
            aria-label="Previous"
            className="hidden lg:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 z-10 items-center justify-center w-10 h-10 rounded-full bg-white border border-[#e5e7eb] text-[#17284a] shadow-md hover:bg-[#17284a] hover:text-white disabled:opacity-0 disabled:pointer-events-none transition-all"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        )}

        <div ref={emblaRef} className="overflow-hidden">
          <div className="flex gap-4">
            {recentProducts.map((product) => (
              <div key={product.id} className="flex-shrink-0 w-[280px] sm:w-[300px]">
                <Product
                  locale={locale}
                  region={region}
                  product={product}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Right arrow — desktop only */}
        {recentProducts.length > 3 && (
          <button
            onClick={nextClick}
            disabled={nextDisabled}
            aria-label="Next"
            className="hidden lg:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 z-10 items-center justify-center w-10 h-10 rounded-full bg-white border border-[#e5e7eb] text-[#17284a] shadow-md hover:bg-[#17284a] hover:text-white disabled:opacity-0 disabled:pointer-events-none transition-all"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  )
}
