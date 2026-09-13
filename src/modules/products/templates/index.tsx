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
import { HttpTypes } from "@medusajs/types"
import { getLocale } from "next-intl/server"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { getLeafCategory, buildCategoryParentMap } from "@lib/util/product"

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
      label: isRTL ? "الارتفاع" : "Height",
      value: product.height ? `${product.height} cm` : "-",
    },
    {
      label: isRTL ? "العرض" : "Width",
      value: product.width ? `${product.width} cm` : "-",
    },
    {
      label: isRTL ? "الطول" : "Length",
      value: product.length ? `${product.length} cm` : "-",
    },
    {
      label: isRTL ? "الوزن" : "Weight",
      value: product.weight ? `${product.weight}` : "-",
    },
    {
      label: isRTL ? "رمز MID" : "MID code",
      value: (product as any).mid_code || "-",
    },
    {
      label: isRTL ? "رمز HS" : "HS code",
      value: (product as any).hs_code || "-",
    },
    {
      label: isRTL ? "بلد المنشأ" : "Country of origin",
      value: (product as any).origin_country || "-",
    },
  ]

  const categoryParentMap = await buildCategoryParentMap(product.categories?.map((c: any) => c.id))
  const leafCategory = getLeafCategory(product.categories, categoryParentMap) as any
  const categoryTitle = (isRTL
    ? leafCategory?.metadata?.localizations?.ar?.name
    : leafCategory?.name) || leafCategory?.name || product.collection?.title || ""
  const categoryHandle = leafCategory?.handle || (product.collection ? `/collections/${product.collection.handle}` : "/products")

  return (
    <>
      <div
        dir={locale === "ar" ? "rtl" : "ltr"}
        data-testid="product-container"
      >
        {/* Breadcrumbs */}
        <div className="flex flex-wrap items-center gap-1.5 px-4 lg:px-[clamp(32px,4vw,60px)] py-4 text-[12px] lg:text-[clamp(12px,1vw,14px)]">
          <LocalizedClientLink href="/" className="text-[#707176] hover:text-[#17284a] transition-colors">
            {isRTL ? "الرئيسية" : "Home"}
          </LocalizedClientLink>
          <span className="text-[#707176]">/</span>
          <LocalizedClientLink href="/store" className="text-[#707176] hover:text-[#17284a] transition-colors">
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

        {/* Product Hero - 3 column on desktop, stacked on mobile */}
        <div className="flex flex-col lg:flex-row gap-[24px] lg:gap-[clamp(24px,2.5vw,40px)] px-[16px] lg:px-[clamp(32px,4vw,60px)] pt-[44px] pb-[72px] lg:pt-5 lg:pb-[clamp(32px,4vw,60px)]">
          {/* Gallery Column - Left on desktop */}
          <div className="lg:w-[clamp(456px,43.2vw,624px)] shrink-0 self-start w-full">
            <ImageGallery
              images={product?.images}
              fallbackImage={product?.thumbnail}
            />
          </div>

          {/* Info Column - Middle */}
          <div className="flex-1 flex flex-col gap-[24px] lg:gap-[clamp(20px,1.5vw,24px)] min-w-0">
            <ProductInfo product={product} />

            {/* Tabs: Specs / Description / Documents — desktop only, mobile renders after actions */}
            <div className="hidden lg:block">
              <ProductTabs
                specs={specs}
                description={description}
                documentUrl={(product as any).document_url ?? null}
                showDocument={(product as any).show_document ?? false}
              />
            </div>
          </div>

          {/* Action Sidebar - Right on desktop, mobile sticky bar rendered inside */}
          <div className="lg:w-[clamp(260px,24vw,340px)] shrink-0 w-full">
            <ProductActions product={product} region={region} />
          </div>

          {/* Tabs — mobile only, rendered after actions to match Figma flow */}
          <div className="lg:hidden w-full">
            <ProductTabs
              specs={specs}
              description={description}
              documentUrl={(product as any).document_url ?? null}
              showDocument={(product as any).show_document ?? false}
            />
          </div>
        </div>
      </div>

      {/* Track recently viewed product in localStorage */}
      <RecentlyViewedTracker product={product} />

      {/* Related Products — grey background */}
      <div className="bg-[#f3f4f6] w-full" dir={locale === "ar" ? "rtl" : "ltr"}>
        <div className="px-[16px] lg:px-[clamp(32px,4vw,60px)] py-[44px] lg:py-[clamp(32px,4vw,64px)]" data-testid="related-products-container">
          <Suspense fallback={<SkeletonRelatedProducts />}>
            <RelatedProducts product={product} region={region} />
          </Suspense>
        </div>
      </div>

      {/* Recently Viewed — white background */}
      <div className="bg-white w-full" dir={locale === "ar" ? "rtl" : "ltr"}>
        <div className="px-[16px] lg:px-[clamp(32px,4vw,60px)] py-[44px] lg:py-[clamp(32px,4vw,64px)]">
          <RecentlyViewedProducts
            region={region}
            countryCode={countryCode}
            currentProductId={product.id}
          />
        </div>
      </div>
    </>
  )
}

export default ProductTemplate
