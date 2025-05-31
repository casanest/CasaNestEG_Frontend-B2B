import { Text } from "@medusajs/ui"
import { getProductPrice } from "@lib/util/get-product-price"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Thumbnail from "../thumbnail"
import PreviewPrice from "./price"
import { ChevronRight } from "lucide-react"

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
      className="group block"
      locale={locale}
    >
      <div
        dir={isRTL ? "rtl" : "ltr"}
        data-testid="product-wrapper"
        className="flex flex-col gap-3 h-full rounded-xl group-hover:shadow-lg group-hover:ring-2 group-hover:ring-primary-500/50"
      >
        {/* Image Container with Hover Effects */}
        <div className="relative overflow-hidden rounded-xl bg-gray-50 dark:bg-gray-900  transition-all duration-300 ">
          <Thumbnail
            thumbnail={product.thumbnail}
            images={product.images}
            size="full"
            isFeatured={isFeatured}
            className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
          />

          {/* Badges Container */}
          <div className={`absolute top-3 ${isRTL ? 'right-3' : 'left-3'} flex flex-col gap-2`}>
            {isFeatured && (
              <span className="bg-primary-600 text-[#043364] text-xs font-bold px-2 py-1 rounded-md whitespace-nowrap">
                {isRTL ? "مميز" : "Featured"}
              </span>
            )}
            {cheapestPrice?.price_type === 'sale' && (
              <span className="bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-md whitespace-nowrap">
                {isRTL ? "خصم" : "Sale"}
              </span>
            )}
          </div>

          {/* Quick View Button (appears on hover) */}
          {/* <div className="absolute inset-0 flex items-center justify-center  opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/20">
            <span className="bg-white text-[#043364] font-medium px-4 py-2 rounded-full flex items-center gap-2 shadow-md">
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
          </div> */}
        </div>

        {/* Product Info */}
        <div className="flex flex-col gap-2 p-1">
          <Text
            className="text-gray-900 dark:text-white font-medium text-base line-clamp-2 group-hover:text-primary-600 transition-colors"
            data-testid="product-title"
          >
            {isRTL ? (product.metadata?.title_ar as string ?? product.title) : product.title}
          </Text>

          {/* Category if available */}
          {typeof product.metadata?.category === "string" && (
            <Text className="text-xs text-gray-500 dark:text-gray-400">
              {isRTL
                ? (product?.metadata.category_ar as string) || (product?.metadata.category as string)
                : (product.metadata.category as string)}
            </Text>
          )}

          <div className="flex items-center justify-between mt-1">
            <div className="flex flex-col">
              {cheapestPrice ? (
                <PreviewPrice
                  price={cheapestPrice}
                  // className="text-lg font-bold text-gray-900 dark:text-white"
                />
              ) : (
                <div className="h-6"></div>
              )}

              {/* Original price if on sale */}
              {cheapestPrice?.original_price && (
                <span className="text-xs text-gray-400 dark:text-gray-500 line-through">
                  {cheapestPrice.original_price}
                </span>
              )}
            </div>

            {hasMultipleVariants && (
              <span className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 px-2 py-1 rounded-full">
                {isRTL ?
                  `${product.variants?.length} خيارات` :
                  `${product.variants?.length} options`}
              </span>
            )}
          </div>
        </div>
      </div>
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