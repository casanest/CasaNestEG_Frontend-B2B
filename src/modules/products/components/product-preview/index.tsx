"use client"
import { Text } from "@medusajs/ui"
import { getProductPrice } from "@lib/util/get-product-price"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Thumbnail from "../thumbnail"
import PreviewPrice from "./price"
import { ChevronRight, Sparkles } from "lucide-react"

export default async function ProductPreview({
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
  const { cheapestPrice } = getProductPrice({ product })
  const isRTL = locale === "ar"
  const hasMultipleVariants = product.variants?.length > 1

  return (
    <LocalizedClientLink
      href={`/products/${product.handle}`}
      className="group block h-full"
      locale={locale}
    >
      <div
        dir={isRTL ? "rtl" : "ltr"}
        data-testid="product-wrapper"
        className="flex flex-col gap-3 h-full rounded-2xl overflow-hidden bg-white dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700/50 transition-all duration-500 hover:shadow-2xl hover:shadow-primary-500/10 hover:-translate-y-1 hover:border-primary-400/50 dark:hover:border-primary-500/50"
      >
        {/* Image Container with Advanced Hover Effects */}
        <div className="relative overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
          <Thumbnail
            thumbnail={product.thumbnail}
            images={product.images}
            size="full"
            isFeatured={isFeatured}
            className="w-full aspect-square object-cover object-center transition-all duration-700 group-hover:scale-110 group-hover:rotate-1"
          />

          {/* Gradient Overlay on Hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          {/* Enhanced Badges Container */}
          <div className={`absolute top-4 ${isRTL ? 'right-4' : 'left-4'} flex flex-col gap-2 z-10`}>
            {isFeatured && (
              <span className="bg-gradient-to-r from-primary-500 to-primary-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg backdrop-blur-sm flex items-center gap-1.5 animate-pulse">
                <Sparkles className="h-3 w-3" />
                {isRTL ? "مميز" : "Featured"}
              </span>
            )}
            {cheapestPrice?.price_type === 'sale' && (
              <span className="bg-gradient-to-r from-red-500 to-red-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg backdrop-blur-sm whitespace-nowrap">
                {isRTL ? "خصم" : "Sale"}
              </span>
            )}
          </div>

          {/* Quick View Button (appears on hover) */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0">
            <span className="bg-white/95 dark:bg-gray-900/95 text-primary-600 dark:text-primary-400 font-semibold px-6 py-3 rounded-full flex items-center gap-2 shadow-xl backdrop-blur-md border border-primary-200 dark:border-primary-800 hover:scale-105 transition-transform">
              {isRTL ? (
                <>
                  <span>عرض المنتج</span>
                  <ChevronRight className="h-4 w-4 transform rotate-180" />
                </>
              ) : (
                <>
                  <span>View Product</span>
                  <ChevronRight className="h-4 w-4" />
                </>
              )}
            </span>
          </div>

          {/* Shimmer effect on hover */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 animate-shimmer" />
          </div>
        </div>

        {/* Enhanced Product Info */}
        <div className="flex flex-col gap-3 p-4 flex-grow">
          <Text
            className="text-gray-900 dark:text-white font-semibold text-base line-clamp-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-300"
            data-testid="product-title"
          >
            {isRTL ? (product.metadata?.title_ar as string ?? product.title) : product.title}
          </Text>

          {/* Enhanced Category Badge */}
          {typeof product.metadata?.category === "string" && (
            <Text className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              {isRTL
                ? (product?.metadata.category_ar as string) || (product?.metadata.category as string)
                : (product.metadata.category as string)}
            </Text>
          )}

          {/* Price Section with Enhanced Design */}
          <div className="flex items-end justify-between mt-auto pt-2 border-t border-gray-100 dark:border-gray-700/50">
            <div className="flex flex-col gap-1">
              {cheapestPrice ? (
                <div className="flex items-baseline gap-2">
                  <PreviewPrice price={cheapestPrice} />
                  {cheapestPrice?.price_type === 'sale' && (
                    <span className="text-xs font-semibold text-red-500 dark:text-red-400 bg-red-50 dark:bg-red-900/20 px-2 py-0.5 rounded">
                      {isRTL ? "وفر" : "Save"}
                    </span>
                  )}
                </div>
              ) : (
                <div className="h-6"></div>
              )}

              {/* Original price with better styling */}
              {cheapestPrice?.original_price && (
                <span className="text-sm text-gray-400 dark:text-gray-500 line-through font-medium">
                  {cheapestPrice.original_price}
                </span>
              )}
            </div>

            {/* Enhanced Variants Badge */}
            {hasMultipleVariants && (
              <span className="text-xs font-medium bg-gradient-to-r from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/20 text-primary-700 dark:text-primary-300 px-3 py-1.5 rounded-full border border-primary-200 dark:border-primary-800/50 whitespace-nowrap">
                {isRTL ?
                  `${product.variants?.length} خيارات` :
                  `${product.variants?.length} options`}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Add shimmer animation to global styles if not present */}
      <style jsx global>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%) skewX(-12deg);
          }
          100% {
            transform: translateX(200%) skewX(-12deg);
          }
        }
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
      `}</style>
    </LocalizedClientLink>
  )
}






{/*
  
  import { Text } from "@medusajs/ui"
import { listProducts } from "@lib/data/products"
import { getProductPrice } from "@lib/util/get-product-price"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Thumbnail from "../thumbnail"
import PreviewPrice from "./price"
import { getLocale } from "next-intl/server"

export default async function ProductPreview({
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
  // const pricedProduct = await listProducts({
  //   regionId: region.id,
  //   queryParams: { id: [product.id!] },
  // }).then(({ response }) => response.products[0])

  // if (!pricedProduct) {
  //   return null
  // }

  const { cheapestPrice } = getProductPrice({
    product,
  })

  console.log("Product Preview", 
    product,)


  return (
    <LocalizedClientLink href={`/products/${product.handle}`} className="group" size="small">
      <div dir={locale === "ar" ? "rtl" : "ltr"} data-testid="product-wrapper">
        <Thumbnail
          thumbnail={product.thumbnail}
          images={product.images}
          size="full"
          isFeatured={isFeatured}
        />
        <div className="flex txt-compact-medium mt-4 justify-between">
          <Text className="text-ui-fg-subtle" data-testid="product-title">
            {locale === "ar"
              ? (product.metadata?.title_ar as string ?? product.title)
              : product.title}
          </Text>
          <div className="flex items-center gap-x-2">
            {cheapestPrice && <PreviewPrice price={cheapestPrice} />}
          </div>
        </div>
      </div>
    </LocalizedClientLink>
  )
}

  
  */}