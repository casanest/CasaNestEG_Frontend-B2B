"use client"

import { clx } from "@medusajs/ui"
import { useCartStore, QuoteItem } from "@lib/store/useCartStore"
import ErrorMessage from "@modules/checkout/components/error-message"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Spinner from "@modules/common/icons/spinner"
import Thumbnail from "@modules/products/components/thumbnail"
import { useState } from "react"
import { useLocale } from "next-intl"
import { Minus, Plus, Trash2 } from "lucide-react"
import { convertToLocale } from "@lib/util/money"

type ItemProps = {
  item: QuoteItem
  type?: "full" | "preview"
  currencyCode: string
}

const Item = ({ item, type = "full", currencyCode }: ItemProps) => {
  const locale = useLocale()
  const isRTL = locale === "ar"
  const [updating, setUpdating] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const updateItemQuantity = useCartStore((state) => state.updateItemQuantity)
  const removeItem = useCartStore((state) => state.removeItem)

  const changeQuantity = async (quantity: number) => {
    if (quantity < 1) return
    setError(null)
    setUpdating(true)

    try {
      updateItemQuantity(item.id, quantity)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setUpdating(false)
    }
  }

  const handleDelete = async (id: string) => {
    setDeleting(true)
    removeItem(id)
    setDeleting(false)
  }

  const maxQtyFromInventory = 10
  const maxQuantity = item.manageInventory ? 10 : maxQtyFromInventory

  const productTitle = isRTL
    ? item.productTitleAr ?? item.productTitle
    : item.productTitle

  const categoryName = item.categoryName
    ? isRTL
      ? item.categoryNameAr ?? item.categoryName
      : item.categoryName
    : null

  const variantTitle = item.variantTitle
  const isDefaultVariant = !variantTitle || variantTitle.trim().toLowerCase() === "default variant"

  let specs: string | null = null

  if (!isDefaultVariant) {
    specs = isRTL
      ? (item.variantTitleAr ?? variantTitle!)
      : variantTitle!
  } else if (item.variantOptions && item.variantOptions.length > 0) {
    const optionValues = item.variantOptions
      .slice(0, 3)
      .map((opt) => {
        if (isRTL) {
          return (opt.metadata?.localizations?.ar?.value as string) ?? opt.value
        }
        return opt.value
      })
      .filter(Boolean)
    if (optionValues.length > 0) {
      specs = optionValues.join(" · ")
    }
  }

  const itemTotal = item.unitPrice != null ? item.unitPrice * item.quantity : null

  if (type === "preview") {
    return (
      <div
        className="flex gap-3 items-center p-3 border-b border-[#e5e7eb] last:border-b-0"
        dir={isRTL ? "rtl" : "ltr"}
        data-testid="product-row"
      >
        <LocalizedClientLink
          href={`/products/${item.productHandle}`}
          className="shrink-0 w-12 small:w-16"
        >
          <Thumbnail
            thumbnail={item.thumbnail}
            images={item.images}
            size="square"
            className="rounded-md object-cover"
            data-testid="product-thumbnail"
          />
        </LocalizedClientLink>
        <div className="flex-1 min-w-0">
          <p className="text-[14px] font-medium text-[#17284a] truncate" data-testid="product-title">
            {productTitle}
          </p>
          <div className={clx("flex items-center gap-2", { "flex-row-reverse": isRTL })}>
            <span className="text-[12px] text-[#707176]">{item.quantity}x</span>
            <span className="text-[14px] font-bold text-[#17284a]">
              {itemTotal != null
                ? convertToLocale({ amount: itemTotal, currency_code: currencyCode })
                : (isRTL ? "السعر عند الطلب" : "Price on Request")}
            </span>
          </div>
        </div>
      </div>
    )
  }

  const priceText = itemTotal != null
    ? convertToLocale({ amount: itemTotal, currency_code: currencyCode })
    : (isRTL ? "السعر عند الطلب" : "Price on Request")

  return (
    <>
      {/* Mobile: Card layout */}
      <div
        className="lg:hidden bg-white border border-[#e5e7eb] border-solid flex flex-col gap-[16px] items-start p-[16px] relative w-full rounded-[16px]"
        data-testid="product-row-mobile"
        dir={isRTL ? "rtl" : "ltr"}
      >
        {/* Delete Button */}
        <button
          onClick={() => handleDelete(item.id)}
          className={clx("absolute top-3 text-[#707176] hover:text-red-500 transition-colors", isRTL ? "left-3" : "right-3")}
          data-testid="product-delete-button"
          aria-label="Remove item"
        >
          {deleting ? <Spinner /> : <Trash2 className="size-4" />}
        </button>

        {/* Top half: thumbnail + info */}
        <div className="flex gap-[12px] items-start w-full">
          <LocalizedClientLink
            href={`/products/${item.productHandle}`}
            className="shrink-0"
          >
            <div className="border border-[#e5e7eb] border-solid rounded-[12px] size-[80px] overflow-hidden">
              <Thumbnail
                thumbnail={item.thumbnail}
                images={item.images}
                size="square"
                className="rounded-[12px] object-cover size-full"
                data-testid="product-thumbnail"
              />
            </div>
          </LocalizedClientLink>

          <div className="flex-1 min-w-0 flex flex-col gap-[6px] items-start">
            {categoryName && (
              <div className="bg-[#f3f4f6] border border-[#ccc] border-solid flex gap-[4px] items-center justify-center px-[8px] py-[2px] rounded-[100px] shrink-0">
                <span className="font-medium text-[12px] text-[#17284a] leading-[1.5] whitespace-nowrap">
                  {categoryName}
                </span>
              </div>
            )}
            <p
              className="font-bold text-[16px] leading-[1.5] text-[#17284a] overflow-hidden text-ellipsis whitespace-nowrap w-full"
              data-testid="product-title"
            >
              {productTitle}
            </p>
            {specs && (
              <p className="font-normal text-[14px] leading-[1.5] text-[#707176] w-full">
                {specs}
              </p>
            )}
          </div>
        </div>

        {/* Bottom half: stepper + price */}
        <div className="flex items-center justify-between w-full">
          <div className="bg-white border border-[#e5e7eb] border-solid flex gap-[12px] h-[40px] items-center justify-center p-[6px] rounded-[8px] shrink-0">
            <button
              onClick={() => changeQuantity(item.quantity - 1)}
              className="text-[#707176] hover:text-[#17284a] transition-colors disabled:opacity-30"
              disabled={updating || item.quantity <= 1}
              data-testid="product-decrease-quantity"
              aria-label="Decrease quantity"
            >
              <Minus className="size-6" />
            </button>
            <span className="font-bold text-[14px] text-[#1c1b1c] leading-[1.5] min-w-[20px] text-center">
              {item.quantity}
            </span>
            <button
              onClick={() => changeQuantity(item.quantity + 1)}
              className="text-[#707176] hover:text-[#17284a] transition-colors disabled:opacity-30"
              disabled={updating || item.quantity >= maxQuantity}
              data-testid="product-increase-quantity"
              aria-label="Increase quantity"
            >
              <Plus className="size-6" />
            </button>
          </div>
          <p
            className="font-bold text-[18px] leading-[1.5] text-[#17284a] whitespace-nowrap"
            data-testid="product-price"
          >
            {priceText}
          </p>
        </div>

        {updating && (
          <div className="flex justify-center w-full">
            <Spinner />
          </div>
        )}
        <ErrorMessage error={error} data-testid="product-error-message" />
      </div>

      {/* Desktop: Row layout */}
      <div
        className="hidden lg:flex bg-white border-[#e5e7eb] border-b border-solid gap-[clamp(8px,2vw,24px)] items-center p-[clamp(12px,2vw,20px)] relative w-full last:border-b-0"
        data-testid="product-row"
        dir={isRTL ? "rtl" : "ltr"}
      >
        {/* Thumbnail */}
        <LocalizedClientLink
          href={`/products/${item.productHandle}`}
          className="shrink-0"
        >
          <div className="border border-[#e5e7eb] border-solid rounded-[12px] size-[clamp(64px,8vw,100px)] overflow-hidden">
            <Thumbnail
              thumbnail={item.thumbnail}
              images={item.images}
              size="square"
              className="rounded-[12px] object-cover size-full"
              data-testid="product-thumbnail"
            />
          </div>
        </LocalizedClientLink>

        {/* Product Info */}
        <div className="flex-1 min-w-0 flex flex-col gap-1.5 items-start">
          {categoryName && (
            <div className="bg-[#f3f4f6] border border-[#ccc] border-solid flex gap-1.5 items-center justify-center px-2 py-1 rounded-full shrink-0">
              <span className="font-medium text-[12px] text-[#17284a] leading-[1.5] whitespace-nowrap">
                {categoryName}
              </span>
            </div>
          )}
          <p
            className="font-bold text-[14px] small:text-[16px] leading-[1.5] text-[#17284a] overflow-hidden text-ellipsis whitespace-nowrap w-full"
            data-testid="product-title"
          >
            {productTitle}
          </p>
          {specs && (
            <p className="font-medium text-[12px] small:text-[14px] leading-[1.5] text-[#707176] truncate w-full">
              {specs}
            </p>
          )}
        </div>

        {/* Quantity Box */}
        <div className="shrink-0 w-[clamp(80px,10vw,120px)]">
          <div className="bg-white border border-[#e5e7eb] border-solid flex gap-3 items-center justify-center p-2 rounded-[8px]">
            <button
              onClick={() => changeQuantity(item.quantity - 1)}
              className="text-[#707176] hover:text-[#17284a] transition-colors disabled:opacity-30"
              disabled={updating || item.quantity <= 1}
              data-testid="product-decrease-quantity"
              aria-label="Decrease quantity"
            >
              <Minus className="size-5" />
            </button>
            <span className="font-bold text-[14px] text-[#1c1b1c] leading-[1.5] min-w-[20px] text-center">
              {item.quantity}
            </span>
            <button
              onClick={() => changeQuantity(item.quantity + 1)}
              className="text-[#707176] hover:text-[#17284a] transition-colors disabled:opacity-30"
              disabled={updating || item.quantity >= maxQuantity}
              data-testid="product-increase-quantity"
              aria-label="Increase quantity"
            >
              <Plus className="size-5" />
            </button>
          </div>
          {updating && (
            <div className="flex justify-center mt-1">
              <Spinner />
            </div>
          )}
          <ErrorMessage error={error} data-testid="product-error-message" />
        </div>

        {/* Price */}
        <p
          className="font-bold text-[clamp(13px,1.3vw,18px)] leading-[1.5] text-[#17284a] text-right w-[clamp(90px,14vw,180px)] shrink-0"
          data-testid="product-price"
        >
          {priceText}
        </p>

        {/* Delete Button */}
        <button
          onClick={() => handleDelete(item.id)}
          className={clx("absolute top-[clamp(6px,0.6vw,12px)] text-[#707176] hover:text-red-500 transition-colors", isRTL ? "left-[clamp(6px,0.6vw,12px)]" : "right-[clamp(6px,0.6vw,12px)]")}
          data-testid="product-delete-button"
          aria-label="Remove item"
        >
          {deleting ? <Spinner /> : <Trash2 className="size-4" />}
        </button>
      </div>
    </>
  )
}

export default Item