"use client"

import { useState, useRef, useCallback } from "react"
import { Text, clx } from "@medusajs/ui"
import { getProductPrice } from "@lib/util/get-product-price"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Thumbnail from "../thumbnail"
import PreviewPrice from "./price"
import { ChevronRight, Sparkles } from "lucide-react"

export default function ProductPreview({
  product,
  isFeatured,
  region,
  locale,
}: {
  product: HttpTypes.StoreProduct
  isFeatured?: boolean
  region: HttpTypes.StoreRegion
  locale: string
}) {
  const [activeIndex, setActiveIndex] = useState(0)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const { cheapestPrice } = getProductPrice({ product })
  const isRTL = locale === "ar"

  const title = (isRTL ? product?.metadata?.localizations?.ar?.title : product.title) || product.title
  const description = (isRTL ? product?.metadata?.localizations?.ar?.description : product.description) || product.description
  const images = product.images || []

  const startCycling = useCallback(() => {
    if (images.length <= 1) return
    let idx = 0
    intervalRef.current = setInterval(() => {
      idx = (idx + 1) % images.length
      setActiveIndex(idx)
    }, 1500) // كل 1500ms يقلب صورة
  }, [images.length])

  const stopCycling = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    setActiveIndex(0)
  }, [])

  return (
    <LocalizedClientLink
      href={`/products/${product.handle}`}
      className="group block rounded-[.5rem]"
      locale={locale}
    >
      <div
        dir={isRTL ? "rtl" : "ltr"}
        className="relative flex flex-col h-full rounded-[.5rem] overflow-hidden bg-white "
        onMouseEnter={startCycling}
        onMouseLeave={stopCycling}
      >
        {/* Image Section */}
        <div className="relative aspect-[4/4] bg-gray-100 overflow-hidden ">
          <Thumbnail
            thumbnail={product.thumbnail}
            images={images}
            size="full"
            isFeatured={isFeatured}
            activeIndex={activeIndex} // ✅ بنمرر الـ index
            className="w-full h-full rounded-0"
          />

          {/* Pagination Dots */}
          {images.length > 1 && (
            <div className="absolute bottom-5 inset-x-0 flex justify-center gap-1.5 z-20 pointer-events-none">
              {images.map((_, idx) => (
                <div
                  key={idx}
                  className={clx(
                    "h-1 rounded-full transition-all duration-300",
                    activeIndex === idx
                      ? "w-4 bg-[#043364] shadow-sm"
                      : "w-1 bg-[#043364]/50"
                  )}
                />
              ))}
            </div>
          )}

          {/* Badges */}
          <div className={clx("absolute top-4 flex flex-col gap-2 z-10", isRTL ? "right-4" : "left-4")}>
            {isFeatured && (
              <div className="bg-white/70 backdrop-blur-md text-black text-[9px] font-bold uppercase tracking-[0.15em] px-3 py-1.5 rounded-full shadow-sm flex items-center gap-1.5 border border-white/40">
                <Sparkles className="h-3 w-3 text-amber-500" />
                {isRTL ? "حصري" : "Bestseller"}
              </div>
            )}
            {cheapestPrice?.price_type === 'sale' && (
              <div className="bg-red-500 text-white text-[9px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full shadow-lg self-start">
                {isRTL ? "خصم" : "Sale"}
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-col flex-1 py-5">
          <div className="flex flex-col gap-1 mb-4">
            <Text className="text-gray-900  font-bold text-base line-clamp-2 group-hover:text-[#043364] dark:group-hover:text-blue-400 transition-colors">
              {title}
            </Text>
            {description && (
              <p className="text-gray-500 dark:text-gray-400 text-xs line-clamp-3 min-h-[2.5rem] leading-relaxed font-medium">
                {description}
              </p>
            )}
          </div>

          <div className="mt-auto pt-2 border-t border-gray-50 dark:border-gray-800 flex items-center justify-between">
            <div className="flex flex-col gap-0.5">
              <span className="text-[10px] uppercase tracking-tighter text-gray-400 font-bold">
                {isRTL ? "السعر" : "Price"}
              </span>
              {cheapestPrice ? (
                <div className="flex items-center gap-2">
                  <PreviewPrice price={cheapestPrice} />
                  {cheapestPrice?.price_type === 'sale' && (
                    <span className="text-[10px] font-bold text-red-500">
                      -{cheapestPrice.percentage_diff}%
                    </span>
                  )}
                </div>
              ) : (
                <div className="w-16 h-5 bg-gray-100 dark:bg-gray-800 animate-pulse rounded" />
              )}
            </div>
          </div>
        </div>
      </div>
    </LocalizedClientLink>
  )
}