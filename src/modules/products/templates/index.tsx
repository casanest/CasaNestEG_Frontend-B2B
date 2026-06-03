import React, { Suspense } from "react"

import ImageGallery from "@modules/products/components/image-gallery"
import ProductActions from "@modules/products/components/product-actions"
import RelatedProducts from "@modules/products/components/related-products"
import ProductInfo from "@modules/products/templates/product-info"
import SkeletonRelatedProducts from "@modules/skeletons/templates/skeleton-related-products"
import { notFound } from "next/navigation"
import ProductActionsWrapper from "./product-actions-wrapper"
import { HttpTypes } from "@medusajs/types"
import { getLocale } from "next-intl/server"
import Refresh from "@/modules/common/icons/refresh"
import Back from "@/modules/common/icons/back"
import FastDelivery from "@/modules/common/icons/fast-delivery"

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
    // {
    //   label: isRTL ? "مدة التوصيل" : "Delivery time",
    //   value: (product.metadata as any)?.delivery_time || "-",
    // },
    // {
    //   label: isRTL ? "رمز المنتج" : "SKU",
    //   value: product.variants?.[0]?.sku || "-",
    // },
  ]

  const visibleSpecs = specs.filter(
    (spec) => typeof spec.value === "string" && spec.value.trim() !== "-"
  )

  return (
    <>
      <div
        dir={locale === "ar" ? "rtl" : "ltr"}
        className="content-container  py-8 lg:py-10"
        data-testid="product-container"
      >
        <div className="grid grid-cols-1 lg:grid-cols-[1.05fr_1fr] gap-10 lg:gap-16 items-start">
          <div className="order-2 lg:order-1  lg:sticky lg:top-24 self-start">
            <div className="flex flex-col gap-8">
              <ProductInfo product={product} />
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

              {description && (
                <section className="">
                  <h3
                    className="mb-4 text-xl font-bold text-[#043364]"
                    data-testid="product-description-title"
                  >
                    {isRTL ? "الوصف" : "Description"}
                  </h3>

                  <div
                    className="whitespace-pre-line text-[18px] leading-8 "
                    data-testid="product-description"
                  >
                    {description}
                  </div>
                </section>
              )}
              {visibleSpecs.length > 0 && (
                <div className="flex flex-col gap-3">
                  <h3 
                    className="mb-4 text-xl font-bold text-[#043364]"
                    data-testid="product-specs-title"
                  >
                    {isRTL ? "المواصفات" : "Specifications"}
                  </h3>
                  <ul className="grid gap-2 text-sm text-slate-600">
                    {visibleSpecs.map((spec) => (
                      <li
                        key={spec.label}
                        className="flex items-center justify-between gap-4 rounded-xl border border-slate-100 bg-white px-4 py-3 shadow-[0_10px_30px_-20px_rgba(2,8,23,0.4)]"
                      >
                        <span className="font-medium text-slate-500">
                          {spec.label}
                        </span>
                        <span className="font-semibold text-slate-800">
                          {spec.value}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {/* terms */}
              <div className="flex flex-col gap-4">
                <h3 
                  className="mb-4 text-xl font-bold text-[#043364]"
                  data-testid="product-terms-title"
                >
                  {isRTL ? "الشروط" : "Terms"}
                </h3>
                <div className="grid grid-cols-1 gap-y-8">
                  <div className="flex items-start gap-x-2">
                    <FastDelivery />
                    <div>
                      <span className="font-semibold">
                        {locale === "ar" ? "شحن لجميع المحافظات" : "Nationwide Shipping"}
                      </span>
                      <p className="max-w-sm">
                        {locale === "ar"
                          ? "توصيل سريع إلى جميع أنحاء مصر مع متابعة مستمرة لحالة الشحنة."
                          : "Fast delivery across all Egyptian governorates with continuous shipment tracking."}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-x-2">
                    <Refresh />
                    <div>
                      <span className="font-semibold">
                        {locale === "ar" ? "استبدال سهل للمنتجات" : "Easy Product Exchange"}
                      </span>
                      <p className="max-w-sm">
                        {locale === "ar"
                          ? "في حالة وجود مشكلة بالمنتج أو عدم ملاءمته، يمكن طلب الاستبدال وفقًا لسياسة المتجر."
                          : "If there is an issue with the product or it is not suitable, you can request an exchange according to our store policy."}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-x-2">
                    <Back />
                    <div>
                      <span className="font-semibold">
                        {locale === "ar" ? "استرجاع مرن" : "Flexible Returns"}
                      </span>
                      <p className="max-w-sm">
                        {locale === "ar"
                          ? "نوفر إمكانية الاسترجاع للمنتجات المؤهلة طبقًا لشروط وسياسة الاسترجاع الخاصة بكل منتج."
                          : "Eligible products can be returned according to the return terms and policy applicable to each product."}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>

          <div className="order-1 lg:order-2">
            <ImageGallery
              images={product?.images}
              fallbackImage={product?.thumbnail}
            />
          </div>
        </div>
      </div>
      <div
        className="content-container my-16 small:my-32"
        data-testid="related-products-container"
      >
        <Suspense fallback={<SkeletonRelatedProducts />}>
          <RelatedProducts product={product} countryCode={countryCode} />
        </Suspense>
      </div>
    </>
  )
}

export default ProductTemplate
