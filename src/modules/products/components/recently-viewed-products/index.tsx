"use client"

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

      {/* Horizontal scroll carousel with faded edge */}
      <div
        className="flex gap-4 overflow-x-auto scrollbar-hide pb-2 -mx-1 px-1"
        style={{
          maskImage: "linear-gradient(to right, transparent 0, black 16px, black calc(100% - 40px), transparent 100%)",
          WebkitMaskImage: "linear-gradient(to right, transparent 0, black 16px, black calc(100% - 40px), transparent 100%)",
        }}
      >
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
  )
}
