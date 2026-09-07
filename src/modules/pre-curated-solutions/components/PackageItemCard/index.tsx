"use client"

import { PackageDetail } from "@lib/data/packages"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { Check, Minus, Plus, Package as PackageIcon } from "lucide-react"

type PackageItemCardProps = {
  product: PackageDetail["titles"][0]["products"][0]
  locale: string
  selected: boolean
  quantity: number
  onToggle: () => void
  onIncrement: () => void
  onDecrement: () => void
}

export default function PackageItemCard({
  product,
  locale,
  selected,
  quantity,
  onToggle,
  onIncrement,
  onDecrement,
}: PackageItemCardProps) {
  const isRTL = locale === "ar"
  const moq = product.moq || 1
  const productTitle = isRTL
    ? (product.title_ar ?? product.title)
    : product.title
  const minOrderQtyText = isRTL
    ? `الحد الأدنى : ${moq} قطعة`
    : `Min. Order Qty: ${moq} pcs`

  const priceText = product.price && product.show_price
    ? `${product.price.currency_code.toUpperCase()} ${product.price.amount.toLocaleString("en-US")}`
    : isRTL
      ? "السعر عند الطلب"
      : "Price on Request"

  return (
    <LocalizedClientLink
      href={`/products/${product.handle}`}
      locale={locale}
      className={`bg-white border border-[#e5e7eb] border-solid flex flex-col gap-1.5 md:gap-1 items-start p-3 md:pt-2 md:px-2 md:pb-3 rounded-2xl w-full transition-opacity ${
        selected ? "" : "opacity-45 md:opacity-40"
      }`}
    >
      {/* Image area */}
      <div className="flex flex-col gap-1.5 items-start w-full">
        <div className="relative h-[156px] md:h-[clamp(130px,11.7vw,169px)] rounded-lg overflow-hidden w-full bg-[#f3f4f6]">
          {product.thumbnail ? (
            <img
              src={product.thumbnail}
              alt={productTitle}
              className="absolute inset-0 w-full h-full object-cover rounded-lg"
            />
          ) : (
            <div className="absolute inset-0 bg-[#f3f4f6] flex items-center justify-center">
              <PackageIcon className="w-10 h-10 text-[#9CA3AF]" />
            </div>
          )}
          {/* Check / Uncheck icon */}
          <button
            onClick={(e) => { e.stopPropagation(); e.preventDefault(); onToggle() }}
            className="absolute top-2 left-2 z-10"
            aria-label={selected ? "Deselect item" : "Select item"}
          >
            {selected ? (
              <div className="w-[22px] h-[22px] md:w-5 md:h-5 bg-[#17284a] border-[1.5px] border-[#17284a] border-solid rounded-[6px] flex items-center justify-center">
                <Check className="w-3 h-3 text-white" strokeWidth={3} />
              </div>
            ) : (
              <div className="w-[22px] h-[22px] md:w-5 md:h-5 bg-transparent border-[1.5px] border-[#17284a] border-solid rounded-[6px]" />
            )}
          </button>
        </div>

        {/* Title */}
        <p className="font-satoshi font-bold leading-[1.3] text-[#17284a] text-[16px] w-full min-h-[42px] line-clamp-2 md:min-h-[42px] md:line-clamp-2">
          {productTitle}
        </p>

      </div>

      {/* Price + Quantity controls */}
      <div className="flex flex-col gap-2 items-center justify-center w-full md:mt-[0.5vw]">
        {/* Min Order Qty */}
        <div className="flex gap-1 md:gap-1 items-center w-full">
          <PackageIcon className="w-3 h-3 md:w-4 md:h-4 text-[#5d5d61] shrink-0" />
          <p className="font-satoshi font-normal leading-[1.5] text-[#5d5d61] text-[12px] whitespace-normal md:whitespace-nowrap">
            {minOrderQtyText}
          </p>
        </div>
        {/* Price pill */}
        <div className="bg-[#f3f4f6] flex items-center justify-center px-2 md:px-3 py-1.5 rounded-md w-full">
          <p className="font-satoshi font-bold leading-[1.5] text-[#17284a] text-[14px] whitespace-normal md:whitespace-nowrap">
            {priceText}
          </p>
        </div>

        {/* Quantity box */}
        <div className="bg-white border border-[#e5e7eb] border-solid flex flex-row items-center justify-center p-1.5 md:p-2 gap-2 md:gap-3 rounded-lg w-full md:w-[100px] md:h-[37px] md:rounded-[8px] md:border-[1px]">
          <button
            onClick={(e) => { e.stopPropagation(); e.preventDefault(); onDecrement() }}
            className="shrink-0 flex items-center justify-center"
            aria-label="Decrease quantity"
          >
            <Minus className="w-3.5 h-3.5 md:w-5 md:h-5 text-[#141B34]" strokeWidth={1.5} />
          </button>
          <p className="font-satoshi font-bold leading-[1.5] text-[#1c1b1c] text-[14px] whitespace-nowrap">
            {quantity}
          </p>
          <button
            onClick={(e) => { e.stopPropagation(); e.preventDefault(); onIncrement() }}
            className="shrink-0 flex items-center justify-center"
            aria-label="Increase quantity"
          >
            <Plus className="w-3.5 h-3.5 md:w-5 md:h-5 text-[#141B34]" strokeWidth={1.5} />
          </button>
        </div>
      </div>
    </LocalizedClientLink>
  )
}
