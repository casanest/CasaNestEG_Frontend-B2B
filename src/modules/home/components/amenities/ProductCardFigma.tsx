"use client"

import React, { useState } from "react"
import { HttpTypes } from "@medusajs/types"
import { getProductPrice, getPricesForVariant } from "@lib/util/get-product-price"
import { normalizeProductImageUrl } from "@lib/util/product-image-url"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { Package, Check } from "lucide-react"
import { useCartStore } from "@lib/store/useCartStore"

type ProductCardFigmaProps = {
  product: HttpTypes.StoreProduct
  locale: string
}

export default function ProductCardFigma({
  product,
  locale,
}: ProductCardFigmaProps) {
  const { cheapestPrice } = getProductPrice({ product })
  const [imageFailed, setImageFailed] = useState(false)
  const [isAdding, setIsAdding] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const isRTL = locale === "ar"

  const addItem = useCartStore((state) => state.addItem)

  const originalPrice = cheapestPrice?.original_price
  const calculatedPrice = cheapestPrice?.calculated_price
  const currencyCode = cheapestPrice?.currency_code?.toUpperCase() || ""

  const imageSrc =
    product.thumbnail ??
    product.images?.find((img) => Boolean(img?.url))?.url ??
    null

  const productCode =
    (product.metadata?.code as string) ||
    (product.metadata?.product_code as string) ||
    `CD-${product.id.slice(-4)}`

  const rawMoq =
    (product as any).moq ||
    (product.metadata?.min_order_qty as number) ||
    (product.metadata?.MOQ as number) ||
    null
  const moq = rawMoq ? (typeof rawMoq === "string" ? parseInt(rawMoq, 10) : rawMoq) : null

  const category = isRTL
    ? (product.metadata?.category_ar as string) ||
      (product.metadata?.category_en as string) ||
      (product.categories?.[0]?.name as string) ||
      ""
    : (product.metadata?.category_en as string) ||
      (product.categories?.[0]?.name as string) ||
      ""

  const title = isRTL
    ? (product.metadata?.title_ar as string) || product.title
    : product.title

  const description = isRTL
    ? (product.metadata?.description_ar as string) ||
      (product.metadata?.description_en as string) ||
      product.description
    : (product.metadata?.description_en as string) || product.description

  const formatPrice = (val: string | number | undefined | null) => {
    if (val === undefined || val === null) return ""
    return new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(Number(val))
  }

  const defaultVariant = product.variants?.[0]
  const defaultVariantId = defaultVariant?.id || ""

  const handleAddToQuoteList = async (e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()

    if (!defaultVariantId) return
    setIsAdding(true)

    try {
      const variant = defaultVariant as any
      const priceInfo = getPricesForVariant(variant)
      const cat = product.categories?.[0] as any

      addItem({
        productId: product.id,
        variantId: defaultVariantId,
        productHandle: product.handle || "",
        productTitle: product.title,
        productTitleAr: (product.metadata as any)?.localizations?.ar?.title as string | undefined,
        productDescription: product.description || undefined,
        productDescriptionAr: (product.metadata as any)?.localizations?.ar?.description as string | undefined,
        thumbnail: product.thumbnail || null,
        images: (product.images || []).filter((img) => Boolean(img?.url)).map((img) => ({ url: normalizeProductImageUrl(img.url!) })),
        quantity: moq && moq > 1 ? moq : 1,
        variantTitle: variant?.title,
        variantTitleAr: (variant?.metadata as any)?.localizations?.ar?.title as string | undefined,
        variantOptions: variant?.options?.map((opt: any) => ({ option_id: opt.option_id, value: opt.value, metadata: opt.metadata })),
        variantMetadata: variant?.metadata,
        productMetadata: product.metadata as any,
        unitPrice: priceInfo?.calculated_price_number ?? null,
        originalPrice: priceInfo?.original_price_number ?? null,
        currencyCode: priceInfo?.currency_code || "usd",
        categoryName: cat?.name,
        categoryNameAr: cat?.metadata?.localizations?.ar?.name as string | undefined,
        categoryMetadata: cat?.metadata,
        manageInventory: variant?.manage_inventory,
        allowBackorder: variant?.allow_backorder,
        inventoryQuantity: variant?.inventory_quantity,
        minOrderQty: moq && moq > 1 ? moq : undefined,
      })
      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 2000)
    } catch (error) {
      console.error("Error adding to quote list:", error)
    } finally {
      setIsAdding(false)
    }
  }

  return (
    <LocalizedClientLink
      href={`/products/${product.handle}`}
      locale={locale}
      className="block"
    >
      <div
        className="flex flex-col items-start p-0 relative w-[clamp(240px,22vw,320px)] h-[clamp(420px,38vw,541px)] rounded-[20px] overflow-hidden"
        style={{
          background: "linear-gradient(180deg, #17284A 0%, #2A456C 100%)",
          boxShadow: "0px 8px 16px rgba(0, 0, 0, 0.08)",
        }}
      >
        {/* Image Area */}
        <div className="flex flex-col justify-center items-center w-full h-[clamp(170px,15vw,220px)] relative isolate -mb-[clamp(20px,2vw,28px)] z-0">
          <div
            className="w-full h-[clamp(170px,15vw,221px)] relative"
            style={{ boxShadow: "0px 12px 20px rgba(0, 0, 0, 0.19)" }}
          >
            {imageSrc && !imageFailed ? (
              <img
                src={normalizeProductImageUrl(imageSrc)}
                alt={title || ""}
                className="absolute inset-0 w-full h-full object-cover"
                onError={() => setImageFailed(true)}
              />
            ) : (
              <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-[#2A456C] to-[#17284A] flex items-center justify-center">
                <Package className="w-[clamp(28px,2.5vw,48px)] h-[clamp(28px,2.5vw,48px)] text-white/30" />
              </div>
            )}
          </div>

          {/* Code badge */}
          <div
            className="absolute top-0 right-0 flex items-center px-[clamp(10px,1vw,16px)] py-[clamp(4px,0.5vw,6px)] z-10"
            style={{
              background: "#FDB022",
              borderRadius: "0px 0px 0px 12px",
            }}
          >
            <span
              className="font-bold text-[clamp(9px,0.8vw,12px)] leading-[150%] whitespace-nowrap"
              style={{ color: "#17284A", fontFamily: "Satoshi, sans-serif" }}
            >
              {productCode}
            </span>
          </div>
        </div>

        {/* White Content */}
        <div
          className="flex flex-col items-start p-0 gap-[clamp(10px,1.2vw,16px)] w-full h-full bg-white px-[clamp(14px,1.5vw,20px)] py-[clamp(16px,1.6vw,24px)] rounded-tl-[26px] rounded-tr-[26px] flex-1"
        >
          {/* Frame: category + title + description */}
          <div className="flex flex-col items-start gap-[clamp(6px,0.6vw,8px)] w-full">
            {/* Category pill */}
            {category && (
              <div
                className="flex flex-row justify-center items-center gap-[6px] px-[8px] py-[4px] h-[clamp(20px,1.8vw,26px)]"
                style={{
                  background: "#F3F4F6",
                  border: "1px solid #CCCCCC",
                  borderRadius: "100px",
                }}
              >
                <Package className="w-[clamp(12px,1vw,16px)] h-[clamp(12px,1vw,16px)]" style={{ color: "#17284A" }} />
                <span
                  className="font-medium text-[clamp(9px,0.8vw,12px)] leading-[150%] whitespace-nowrap"
                  style={{
                    color: "#17284A",
                    fontFamily: "Satoshi, sans-serif",
                  }}
                >
                  {category}
                </span>
              </div>
            )}

            {/* Title */}
            <p
              className="font-bold text-[clamp(12px,1.1vw,16px)] leading-[150%] line-clamp-2 w-full"
              style={{ color: "#17284A", fontFamily: "Satoshi, sans-serif" }}
            >
              {title}
            </p>

            {/* Description */}
            {description && (
              <p
                className="font-normal text-[clamp(10px,1.9vw,14px)] leading-[150%] line-clamp-2 w-full"
                style={{
                  color: "#707176",
                  fontFamily: "Satoshi, sans-serif",
                }}
              >
                {description}
              </p>
            )}
          </div>

          {/* Price */}
          <div className="flex flex-col items-start gap-[2px]">
            {calculatedPrice != null && (
              <span
                className="font-bold text-[clamp(12px,1.1vw,16px)] leading-[150%]"
                style={{ color: "#17284A", fontFamily: "Satoshi, sans-serif" }}
              >
                {currencyCode} {formatPrice(calculatedPrice)}
              </span>
            )}
            {originalPrice != null &&
              calculatedPrice != null &&
              Number(originalPrice) > Number(calculatedPrice) && (
                <span
                  className="font-normal text-[clamp(9px,0.8vw,12px)] leading-[150%] line-through"
                  style={{
                    color: "#707176",
                    fontFamily: "Satoshi, sans-serif",
                  }}
                >
                  {currencyCode} {formatPrice(originalPrice)}
                </span>
              )}
          </div>

          {/* Min order */}
          {moq && (
            <div className="flex flex-row items-center gap-[6px] w-full">
              <Package className="w-[clamp(12px,1vw,16px)] h-[clamp(12px,1vw,16px)] shrink-0" style={{ color: "#707176" }} />
              <span
                className="font-normal text-[clamp(10px,1.9vw,14px)] leading-[150%]"
                style={{
                  color: "#707176",
                  fontFamily: "Satoshi, sans-serif",
                }}
              >
                {isRTL ? (
                  <>الحد الأدنى للطلب: <span className="font-bold text-black">{moq} قطعة</span></>
                ) : (
                  <>Min. Order Qty: <span className="font-bold text-black">{moq} pcs</span></>
                )}
              </span>
            </div>
          )}

          {/* Add to Quote List Button */}
          <button
            onClick={handleAddToQuoteList}
            disabled={isAdding}
            className="flex flex-row justify-center items-center gap-[8px] w-full h-[clamp(44px,3.8vw,56px)] px-[clamp(20px,2.5vw,36px)] py-[clamp(12px,1.2vw,16px)] mt-auto transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              background: showSuccess ? "#FDB022" : "#17284A",
              borderRadius: "16px",
            }}
          >
            {isAdding ? (
              <svg
                className="animate-spin h-[clamp(16px,1.3vw,20px)] w-[clamp(16px,1.3vw,20px)] text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
            ) : showSuccess ? (
              <Check className="w-[clamp(16px,1.3vw,20px)] h-[clamp(16px,1.3vw,20px)] text-white" />
            ) : null}
            <span
              className="font-medium text-[clamp(12px,1.1vw,16px)] leading-[150%] text-center text-white whitespace-nowrap"
              style={{ fontFamily: "Satoshi, sans-serif" }}
            >
              {showSuccess
                ? (isRTL ? "تمت الإضافة" : "Added!")
                : (isRTL ? "إضافة إلى قائمة التسعير" : "Add to Quote List")}
            </span>
          </button>
        </div>
      </div>
    </LocalizedClientLink>
  )
}
