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
  })

  const selectedPrice = variant ? variantPrice : cheapestPrice

  if (!selectedPrice) {
    return <div className="block w-32 h-9 bg-gray-100 animate-pulse" />
  }

  const isSale = selectedPrice.price_type === "sale"
  const mainNumber = selectedPrice.calculated_price_number
  const formattedNumber = mainNumber.toLocaleString(isRTL ? "ar-EG" : "en-US")
  const decimalPart = mainNumber % 1 === 0 ? ".00" : ""

  return (
    <div className="flex flex-col gap-1">
      {/* Sale badge */}
      {isSale && (
        <span className="rounded-full bg-[#EF4444]/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.15em] text-[#EF4444] self-start mb-1">
          {isRTL ? "خصم" : "Sale"}
        </span>
      )}

      {/* Main Price */}
      <div className="flex items-baseline gap-1 text-[#17284a]">
        <span className="text-[14px] font-medium leading-[1.5]">
          {isRTL ? "ج.م" : "EGP"}
        </span>
        <span
          className={clx("text-[24px] font-bold leading-[1.3]", isSale && "text-[#EF4444]")}
          data-testid="product-price"
          data-value={mainNumber}
        >
          {formattedNumber}
        </span>
        <span className="text-[14px] font-medium leading-[1.5]">{decimalPart}</span>
      </div>

      {/* Compare price */}
      {isSale && (
        <span
          className="text-[14px] text-[#707176] line-through"
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
