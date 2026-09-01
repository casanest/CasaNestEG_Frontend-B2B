"use client"

import { PackageDetail } from "@lib/data/packages"
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
  const description = isRTL ? product.description_ar : product.description_en
  const minOrderQtyText = isRTL
    ? `الحد الأدنى : ${moq} قطعة`
    : `Min. Order Qty: ${moq} pcs`

  const priceText = product.price
    ? `${product.price.currency_code.toUpperCase()} ${product.price.amount.toLocaleString("en-US")}`
    : isRTL
      ? "السعر عند الطلب"
      : "Price on Request"

  return (
    <div
      className={`bg-white border border-[#e5e7eb] border-solid flex flex-col gap-3 md:gap-2 md:justify-between items-start p-3 md:pt-2 md:px-2 md:pb-3 rounded-2xl w-full md:h-[clamp(280px,26vw,372px)] transition-opacity ${
        selected ? "" : "opacity-45 md:opacity-40"
      }`}
    >
      {/* Image area */}
      <div className="flex flex-col gap-1.5 items-start w-full">
        <div className="relative h-[120px] md:h-[clamp(100px,9vw,130px)] rounded-lg overflow-hidden w-full bg-[#f3f4f6]">
          {product.thumbnail ? (
            <img
              src={product.thumbnail}
              alt={product.title}
              className="absolute inset-0 w-full h-full object-cover rounded-lg"
            />
          ) : (
            <div className="absolute inset-0 bg-[#f3f4f6] flex items-center justify-center">
              <PackageIcon className="w-10 h-10 text-[#9CA3AF]" />
            </div>
          )}
          {/* Check / Uncheck icon */}
          <button
            onClick={onToggle}
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
        <p className="font-satoshi font-bold leading-[1.5] text-[#17284a] text-[16px] w-full line-clamp-1 overflow-hidden text-ellipsis">
          {product.title}
        </p>

        {/* Description */}
        {description && (
          <p className="font-satoshi font-normal leading-[1.5] text-[#707176] text-[14px] w-full h-[42px] line-clamp-2 overflow-hidden text-ellipsis">
            {description}
          </p>
        )}

      </div>

      {/* Price + Quantity controls */}
      <div className="flex flex-col gap-2 items-center justify-center w-full">
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
        <div className="bg-white border border-[#e5e7eb] border-solid flex gap-3 md:gap-3 items-center justify-center p-1.5 md:p-2 rounded-lg w-full md:w-[clamp(80px,7vw,100px)]">
          <button
            onClick={onDecrement}
            className="shrink-0 hover:text-[#17284a] transition-colors"
            aria-label="Decrease quantity"
          >
            <Minus className="w-3.5 h-3.5 md:w-5 md:h-5 text-[#1c1b1c]" />
          </button>
          <p className="font-satoshi font-bold leading-[1.5] text-[#1c1b1c] text-[14px] whitespace-normal md:whitespace-nowrap">
            {quantity}
          </p>
          <button
            onClick={onIncrement}
            className="shrink-0 hover:text-[#17284a] transition-colors"
            aria-label="Increase quantity"
          >
            <Plus className="w-3.5 h-3.5 md:w-5 md:h-5 text-[#1c1b1c]" />
          </button>
        </div>
      </div>
    </div>
  )
}
