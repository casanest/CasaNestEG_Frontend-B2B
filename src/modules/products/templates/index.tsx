import React, { Suspense } from "react"

import ImageGallery from "@modules/products/components/image-gallery"
import ProductActions from "@modules/products/components/product-actions"
import RelatedProducts from "@modules/products/components/related-products"
import RecentlyViewedProducts from "@modules/products/components/recently-viewed-products"
import RecentlyViewedTracker from "@modules/products/components/recently-viewed-tracker"
import ProductInfo from "@modules/products/templates/product-info"
import ProductTabs from "@modules/products/components/product-tabs"
import SkeletonRelatedProducts from "@modules/skeletons/templates/skeleton-related-products"
import { notFound } from "next/navigation"
import ProductActionsWrapper from "./product-actions-wrapper"
import { HttpTypes } from "@medusajs/types"
import { getLocale } from "next-intl/server"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

type ProductTemplateProps = {
  product: HttpTypes.StoreProduct
  region: HttpTypes.StoreRegion
  countryCode: string
}

const ProductTemplate: React.FC<ProductTemplateProps> = async ({
  product,
  region,
  countryCode,
}) => {
  if (!product || !product.id) {
    return notFound()
  }
  const locale = await getLocale()
  const isRTL = locale === "ar"

  const localized = product?.metadata?.localizations as any

  const description =
    (isRTL ? localized?.ar?.description : localized?.en?.description) ||
    product.description ||
    ""

  const title =
    (isRTL ? localized?.ar?.title : product.title) || product.title

  const specs = [
    {
      label: isRTL ? "الخامة" : "Material",
      value: product.material || "-",
    },
    {
      label: isRTL ? "العرض" : "Width",
      value: product.width ? `${product.width} cm` : "-",
    },
    {
      label: isRTL ? "الارتفاع" : "Height",
      value: product.height ? `${product.height} cm` : "-",
    },
    {
      label: isRTL ? "العمق" : "Depth",
      value: product.length ? `${product.length} cm` : "-",
    },
  ]

  // Build specs from product metadata (skip internal/structural keys)
  const metadataSkipKeys = [
    "localizations",
    "is_new",
    "title_ar",
    "title_en",
    "description_ar",
    "description_en",
    "min_order_qty",
    "MOQ",
    "localization_updated_at",
    "warranty",
    "moq",
    "document_url",
  ]
  if (product.metadata) {
    for (const [key, value] of Object.entries(product.metadata)) {
      if (metadataSkipKeys.includes(key)) continue
      if (typeof value === "object" && value !== null) continue
      if (value === null || value === undefined || value === "") continue

      const label = key
        .split(/[_\s]+/)
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
        .join(" ")

      specs.push({
        label,
        value: String(value),
      })
    }
  }

  const categoryTitle = product.categories?.[0]?.name || product.collection?.title || ""
  const categoryHandle = product.categories?.[0]?.handle || (product.collection ? `/collections/${product.collection.handle}` : "/products")

  return (
    <>
      <div
        dir={locale === "ar" ? "rtl" : "ltr"}
        data-testid="product-container"
      >
        {/* Breadcrumbs */}
        <div className="flex flex-wrap items-center gap-1.5 px-4 lg:px-[60px] py-4 text-[12px] lg:text-[14px]">
          <LocalizedClientLink href="/" className="text-[#707176] hover:text-[#17284a] transition-colors">
            {isRTL ? "الرئيسية" : "Home"}
          </LocalizedClientLink>
          <span className="text-[#707176]">/</span>
          <LocalizedClientLink href="/products" className="text-[#707176] hover:text-[#17284a] transition-colors">
            {isRTL ? "المنتجات" : "Products"}
          </LocalizedClientLink>
          {categoryTitle && (
            <>
              <span className="text-[#707176]">/</span>
              <LocalizedClientLink
                href={categoryHandle.startsWith("/") ? categoryHandle : `/categories/${categoryHandle}`}
                className="text-[#707176] hover:text-[#17284a] transition-colors"
              >
                {categoryTitle}
              </LocalizedClientLink>
            </>
          )}
          <span className="text-[#707176]">/</span>
          <span className="font-bold text-[#17284a]">{title}</span>
        </div>

        {/* Product Hero - 3 column on desktop */}
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-10 px-4 lg:px-[60px] pt-5 pb-[160px] lg:pb-[60px]">
          {/* Gallery Column - Left on desktop */}
          <div className="lg:w-[520px] shrink-0 lg:sticky lg:top-24 self-start w-full">
            <ImageGallery
              images={product?.images}
              fallbackImage={product?.thumbnail}
            />
          </div>

          {/* Info Column - Middle */}
          <div className="flex-1 flex flex-col gap-4 lg:gap-6 min-w-0">
            <ProductInfo product={product} />

            {/* Short Description */}
            {description && (
              <p className="text-[16px] leading-[1.5] text-[#707176] max-w-[424px]">
                {description.length > 120
                  ? description.slice(0, 120) + "…"
                  : description}
              </p>
            )}

            {/* Tabs: Specs / Description / Documents */}
            <ProductTabs
              specs={specs}
              description={description}
              documentUrl={(product as any).document_url ?? null}
            />
          </div>

          {/* Action Sidebar - Right on desktop, mobile sticky bar rendered inside */}
          <div className="lg:w-[340px] shrink-0 w-full">
            <Suspense
              fallback={
                <ProductActions
                  disabled={true}
                  product={product}
                  region={region}
                />
              }
            >
              <ProductActionsWrapper id={product.id} region={region} />
            </Suspense>
          </div>
        </div>
      </div>

      {/* Track recently viewed product in localStorage */}
      <RecentlyViewedTracker product={product} />

      {/* Shared grey background section for Recently Viewed + Related Products */}
      <div className="bg-[#f8f9fa] w-full" dir={locale === "ar" ? "rtl" : "ltr"}>
        <div className="px-4 lg:px-[60px] py-16 flex flex-col gap-16">
          {/* Recently Viewed (from localStorage) */}
          <RecentlyViewedProducts
            region={region}
            countryCode={countryCode}
            currentProductId={product.id}
          />

          {/* Related Products (from backend: collection/tags) */}
          <div data-testid="related-products-container">
            <Suspense fallback={<SkeletonRelatedProducts />}>
              <RelatedProducts product={product} countryCode={countryCode} />
            </Suspense>
          </div>
        </div>
      </div>
    </>
  )
}

export default ProductTemplate
