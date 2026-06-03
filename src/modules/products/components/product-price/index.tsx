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

  return (
    <div className="flex flex-col gap-3 text-ui-fg-base">
      <div className="flex flex-wrap items-center gap-3">
        {selectedPrice.price_type === "sale" && (
          <span className="rounded-full bg-[#EF4444]/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.15em] text-[#EF4444]">
            {isRTL ? "خصم" : "Sale"}
          </span>
        )}
        <span
          className={clx("text-3xl font-semibold text-[#043364]", {
            "text-[#EF4444]": selectedPrice.price_type === "sale",
          })}
          data-testid="product-price"
          data-value={selectedPrice.calculated_price_number}
        >
          {selectedPrice.calculated_price}
        </span>
        {selectedPrice.price_type === "sale" && (
          <span
            className="text-sm text-slate-400 line-through"
            data-testid="original-product-price"
            data-value={selectedPrice.original_price_number}
          >
            {selectedPrice.original_price}
          </span>
        )}
        {selectedPrice.price_type === "sale" && (
          <span className="rounded-full bg-[#043364]/10 px-2.5 py-1 text-xs font-semibold text-[#043364]">
            -{selectedPrice.percentage_diff}%
          </span>
        )}
      </div>
      {!variant && (
        <span className="text-xs text-slate-400">
          {isRTL ? "السعر يبدأ من" : "Price starts at"}
        </span>
      )}
    </div>
  )
}
