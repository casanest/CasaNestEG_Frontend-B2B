"use client"

import { clx } from "@medusajs/ui"

import { getProductPrice } from "@lib/util/get-product-price"
import { HttpTypes } from "@medusajs/types"
import { useLocale } from "next-intl"

export default function ProductPrice({
  product,
  variant,
}: {
  product: HttpTypes.StoreProduct
  variant?: HttpTypes.StoreProductVariant
}) {
  const locale = useLocale()
  const isRTL = locale === "ar"
  const { cheapestPrice, variantPrice } = getProductPrice({
    product,
    variantId: variant?.id,
    locale,
  })

  const selectedPrice = variant ? variantPrice : cheapestPrice

  if (!selectedPrice) {
    if (variant) {
      return (
        <div className="flex flex-col gap-1">
          <span className="text-[18px] font-bold text-[#17284a]">
            {isRTL ? "اطلب عرض سعر" : "Request a Quote"}
          </span>
        </div>
      )
    }
    return <div className="block w-32 h-9 bg-gray-100 animate-pulse" />
  }

  const isSale = selectedPrice.price_type === "sale"

  return (
    <div className="flex flex-col gap-1">
      {/* Sale badge */}
      {isSale && (
        <span className="rounded-full bg-[#EF4444]/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.15em] text-[#EF4444] self-start mb-1">
          {isRTL ? "خصم" : "Sale"}
        </span>
      )}

      {/* Main Price */}
      <div className="flex items-baseline gap-2 text-[#17284a] tabular-nums" dir={isRTL ? "rtl" : "ltr"}>
        <span
          className={clx("text-[24px] font-bold leading-[1.3] tabular-nums", isSale && "text-[#EF4444]")}
          data-testid="product-price"
          data-value={selectedPrice.calculated_price_number}
        >
          {selectedPrice.calculated_price}
        </span>
      </div>

      {/* Compare price */}
      {isSale && (
        <span
          className="text-[14px] text-[#707176] line-through tabular-nums"
          data-testid="original-product-price"
          data-value={selectedPrice.original_price_number}
        >
          {selectedPrice.original_price}
        </span>
      )}

      {!variant && (
        <span className="text-[12px] text-[#707176] mt-1">
          {isRTL ? "السعر يبدأ من" : "Price starts at"}
        </span>
      )}
    </div>
  )
}
