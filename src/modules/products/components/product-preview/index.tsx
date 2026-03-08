"use client"

import { Text, clx } from "@medusajs/ui"
import { getProductPrice } from "@lib/util/get-product-price"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Thumbnail from "../thumbnail"
import PreviewPrice from "./price"
import { ChevronRight, Sparkles, ShoppingCart, Eye } from "lucide-react"

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
  const { cheapestPrice } = getProductPrice({ product })
  const isRTL = locale === "ar"

  // Localization logic
  const title = (isRTL ? product?.metadata?.localizations?.ar?.title : product.title) || product.title
  const description = (isRTL ? product?.metadata?.localizations?.ar?.description : product.description) || product.description

  return (
    <LocalizedClientLink
      href={`/products/${product.handle}`}
      className="group block"
      locale={locale}
    >
      <div
        dir={isRTL ? "rtl" : "ltr"}
        data-testid="product-wrapper"
        className="relative flex flex-col gap-0 h-full rounded-[2rem] overflow-hidden bg-white dark:bg-gray-900 border border-transparent transition-all duration-700 hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] hover:-translate-y-2"
      >
        {/* Image Section */}
        <div className="relative aspect-[4/5] overflow-hidden bg-gray-50 dark:bg-gray-800">
          <Thumbnail
            thumbnail={product.thumbnail}
            images={product.images}
            size="full"
            isFeatured={isFeatured}
            className="w-full h-full object-cover transition-all duration-1000 ease-in-out group-hover:scale-110 group-hover:blur-[2px] opacity-90 group-hover:opacity-100"
          />

          {/* Hover Overlay: Buttons and Description */}
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex flex-col justify-end p-6 opacity-0 group-hover:opacity-100 transition-all duration-500">
            <div className="flex gap-2 transform translate-y-8 group-hover:translate-y-0 transition-transform duration-500 delay-150">
              <div className="flex-1 bg-white text-black text-[10px] font-black uppercase tracking-widest py-3 rounded-xl flex items-center justify-center gap-2">
                <Eye className="h-3 w-3" />
                {isRTL ? "عرض" : "View"}
              </div>
              <div className="w-12 bg-[#043364] text-white py-3 rounded-xl flex items-center justify-center">
                <ShoppingCart className="h-3 w-3" />
              </div>
            </div>
          </div>

          {/* Floating Badges */}
          <div className={clx("absolute top-5 flex flex-col gap-2 z-10", isRTL ? "right-5" : "left-5")}>
            {isFeatured && (
              <span className="bg-white/90 backdrop-blur-md text-black text-[10px] font-black uppercase tracking-[0.2em] px-4 py-2 rounded-full shadow-xl flex items-center gap-2 border border-white/20">
                <Sparkles className="h-3 w-3 text-yellow-500" />
                {isRTL ? "حصري" : "Limited"}
              </span>
            )}
            {cheapestPrice?.price_type === 'sale' && (
              <span className="bg-red-500 text-white text-[10px] font-black uppercase tracking-[0.2em] px-4 py-2 rounded-full shadow-lg">
                {isRTL ? "خصم" : "Sale"}
              </span>
            )}
          </div>
        </div>

        {/* Content Section */}
        <div className="flex flex-col gap-1.5 p-6 bg-white dark:bg-gray-900 transition-colors duration-500 group-hover:bg-gray-50/50 dark:group-hover:bg-gray-800/50">
          <div className="flex justify-between items-start gap-4">
            <div className="flex flex-col gap-1 w-full">
              {/* Product Title */}
              <Text
                className="text-gray-900 dark:text-white font-bold text-lg leading-tight group-hover:text-[#043364] transition-all duration-500"
                data-testid="product-title"
              >
                {title}
              </Text>

              {/* Added: Product Description Under Title */}
              {description && (
                <Text className="text-gray-500 dark:text-gray-400 text-xs mt-1 line-clamp-2 leading-relaxed">
                  {description}
                </Text>
              )}
            </div>
          </div>

          {/* Footer Section: Price and Action Button */}
          <div className="flex items-center justify-between mt-auto pt-4">
            <div className="flex flex-col">
              {cheapestPrice ? (
                <div className="flex items-center gap-3">
                  <PreviewPrice price={cheapestPrice} />
                  {cheapestPrice?.price_type === 'sale' && (
                    <span className="text-[10px] font-black text-red-600 bg-red-50 px-2 py-1 rounded-md">
                      -{cheapestPrice.percentage_diff}%
                    </span>
                  )}
                </div>
              ) : (
                <div className="w-20 h-6 bg-gray-100 animate-pulse rounded-lg" />
              )}
            </div>

            <div className="h-8 w-8 rounded-full border border-gray-100 flex items-center justify-center group-hover:bg-[#043364] group-hover:text-white group-hover:border-transparent transition-all duration-500">
              <ChevronRight className={clx("h-4 w-4 transition-transform", isRTL && "rotate-180")} />
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%) skewX(-15deg); }
          100% { transform: translateX(250%) skewX(-15deg); }
        }
        .animate-shimmer {
          animation: shimmer 2.5s infinite linear;
        }
      `}</style>
    </LocalizedClientLink>
  )
}