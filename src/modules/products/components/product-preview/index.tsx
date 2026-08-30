"use client"

import { useState, useRef, useCallback } from "react"
import Image from "next/image"
import { clx } from "@medusajs/ui"
import { getProductPrice } from "@lib/util/get-product-price"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { Sparkles, Package, Tag } from "lucide-react"
import { addToCart } from "@lib/data/cart"
import { useParams } from "next/navigation"
import { normalizeProductImageUrl, shouldUseUnoptimizedImage } from "@lib/util/product-image-url"
import PlaceholderImage from "@modules/common/icons/placeholder-image"

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
  const [isAdding, setIsAdding] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const { cheapestPrice } = getProductPrice({ product })
  const isRTL = locale === "ar"
  const countryCode = useParams().countryCode as string

  const title = (isRTL ? product?.metadata?.localizations?.ar?.title : product.title) || product.title
  const description = (isRTL ? product?.metadata?.localizations?.ar?.description : product.description) || product.description
  const images = product.images || []
  const allImages = images.length
    ? images.filter((img) => Boolean(img?.url)).map((img) => ({ url: normalizeProductImageUrl(img.url) }))
    : product.thumbnail
      ? [{ url: normalizeProductImageUrl(product.thumbnail) }]
      : []
  const currentImage = allImages[activeIndex]?.url || null

  const defaultVariant = product.variants?.[0]
  const defaultVariantId = defaultVariant?.id || ""

  const minOrderQty = (product.metadata?.min_order_qty as string | number) || null
  const productCode = (product.metadata?.product_code as string) || product.variants?.[0]?.sku || null

  const categoryName = product.categories?.[0]
    ? (isRTL
      ? (product.categories[0] as any)?.metadata?.localizations?.ar?.name
      : (product.categories[0] as any)?.name)
      || (product.categories[0] as any)?.name
      || (product.categories[0] as any)?.metadata?.localizations?.en?.name
    : null

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

  const handleAddToQuote = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    e.preventDefault()
    if (!defaultVariantId) return
    setIsAdding(true)
    try {
      await addToCart({
        variantId: defaultVariantId,
        quantity: minOrderQty ? parseInt(String(minOrderQty)) : 1,
        countryCode,
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
      className="group block h-full"
      locale={locale}
    >
      <div
        dir={isRTL ? "rtl" : "ltr"}
        className="relative flex flex-col h-full bg-white rounded-[26px] overflow-hidden border border-gray-100 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
        onMouseEnter={startCycling}
        onMouseLeave={stopCycling}
      >
        {/* Image Section - full width, no horizontal margins per Figma */}
        <div className="relative aspect-[4/3] overflow-hidden bg-gray-50">
          {currentImage ? (
            <Image
              src={currentImage}
              alt={product.title}
              className="absolute inset-0 object-cover object-center transition-opacity duration-500 ease-in-out"
              draggable={false}
              quality={70}
              sizes="(max-width: 576px) 100vw, (max-width: 768px) 50vw, (max-width: 1200px) 33vw, 280px"
              fill
              unoptimized={shouldUseUnoptimizedImage(currentImage)}
            />
          ) : (
            <div className="w-full h-full absolute inset-0 flex items-center justify-center">
              <PlaceholderImage size={24} />
            </div>
          )}

          {/* Pagination Dots */}
          {images.length > 1 && (
            <div className="absolute bottom-3 inset-x-0 flex justify-center gap-1.5 z-20 pointer-events-none">
              {images.map((_, idx) => (
                <div
                  key={idx}
                  className={clx(
                    "h-1 rounded-full transition-all duration-300",
                    activeIndex === idx
                      ? "w-4 bg-[#17284a] shadow-sm"
                      : "w-1 bg-[#17284a]/50"
                  )}
                />
              ))}
            </div>
          )}

          {/* Badges - top left */}
          <div className={clx("absolute top-0 flex flex-col gap-2 z-10", isRTL ? "left-0" : "right-0")}>
            {isFeatured && (
              <div className="bg-white/70 backdrop-blur-md text-black text-[9px] font-bold uppercase tracking-[0.15em] px-3 py-1.5 rounded-full shadow-sm flex items-center gap-1.5 border border-white/40 m-2">
                <Sparkles className="h-3 w-3 text-amber-500" />
                {isRTL ? "حصري" : "Bestseller"}
              </div>
            )}
            {cheapestPrice?.price_type === 'sale' && (
              <div className="bg-red-500 text-white text-[9px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full shadow-lg self-start m-2">
                {isRTL ? "خصم" : "Sale"}
              </div>
            )}
          </div>

          {/* Product Code Badge - top right (amber) */}
          {productCode && (
            <div className="absolute top-0 right-0 z-10 bg-[#fdb022] px-4 py-1.5 rounded-bl-[12px]">
              <span className="text-[12px] font-bold text-[#17284a] whitespace-nowrap">
                {productCode}
              </span>
            </div>
          )}
        </div>

        {/* White Content Area - Overlapping Effect */}
        <div className="relative z-10 -mt-6 flex flex-col flex-1 bg-white rounded-t-[24px] px-5 pt-6 pb-6 gap-3">
          {/* Category Pill */}
          {categoryName && (
            <div className="inline-flex items-center gap-1.5 bg-white border border-gray-200 rounded-full px-3 py-1.5 w-fit">
              <Tag className="h-3.5 w-3.5 text-[#1E293B]"/>
              <span className="text-[13px] text-[#1E293B] whitespace-nowrap">
                {categoryName}
              </span>
            </div>
          )}

          {/* Title */}
          <h3 className="text-[18px] font-bold text-[#0F172A] leading-snug line-clamp-2 min-h-[2.6rem] group-hover:text-[#17284a] transition-colors mt-1">
            {title}
          </h3>

          {/* Description */}
          {description && (
            <p className="text-[14px] text-gray-500 leading-relaxed line-clamp-2 min-h-[2.5rem]">
              {description}
            </p>
          )}

          {/* Price / Price on Request */}
          <div className="mt-2">
            {cheapestPrice ? (
              <div className="flex items-center gap-2 flex-wrap">
                {cheapestPrice.price_type === "sale" && (
                  <span className="text-[14px] line-through text-[#707176]">
                    {cheapestPrice.original_price}
                  </span>
                )}
                <span
                  className={clx(
                    "text-[18px] font-bold",
                    cheapestPrice.price_type === "sale" ? "text-red-600" : "text-[#17284a]"
                  )}
                >
                  {cheapestPrice.calculated_price}
                </span>
                {cheapestPrice?.price_type === 'sale' && (
                  <span className="text-[10px] font-bold text-red-500">
                    -{cheapestPrice.percentage_diff}%
                  </span>
                )}
              </div>
            ) : (
              <div className="inline-flex items-center gap-2 bg-[#F1F5F9] rounded-full px-4 py-2 w-fit">
                <Tag className="h-4 w-4 text-[#0F172A]"/>
                <span className="text-[14px] font-medium text-[#0F172A] whitespace-nowrap">
                  {isRTL ? "السعر عند الطلب" : "Price on Request"}
                </span>
              </div>
            )}
          </div>

          {/* Min Order Qty */}
          {minOrderQty && (
            <div className="flex items-center gap-2 mt-2 mb-2">
              <Package className="h-[18px] w-[18px] text-gray-500"/>
              <span className="text-[14px] text-gray-500 whitespace-nowrap">
                {isRTL ? `الحد الأدنى للطلب: ${minOrderQty} قطعة` : `Min. Order Qty: ${minOrderQty} pcs`}
              </span>
            </div>
          )}

          {/* Add to Quote List Button */}
          <button
            onClick={handleAddToQuote}
            disabled={isAdding}
            className={clx(
              "mt-auto w-full h-12 rounded-xl flex items-center justify-center gap-2 text-[15px] font-medium transition-all duration-300 active:scale-[0.98]",
              showSuccess
                ? "bg-green-600 text-white"
                : "bg-[#1E293B] text-white hover:bg-[#0F172A] hover:shadow-md"
            )}
            aria-label={isRTL ? "إضافة إلى قائمة التسعير" : "Add to Quote List"}
          >
            {isAdding ? (
              <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            ) : showSuccess ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <span>{isRTL ? "إضافة إلى قائمة التسعير" : "Add to Quote List"}</span>
            )}
          </button>
        </div>
      </div>
    </LocalizedClientLink>
  )
}