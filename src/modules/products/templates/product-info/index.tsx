import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { getLocale } from "next-intl/server"
import { clx } from "@medusajs/ui"

type ProductInfoProps = {
  product: HttpTypes.StoreProduct
}

const ProductInfo = async ({ product }: ProductInfoProps) => {
  const locale = await getLocale()
  const isRTL = locale === "ar"

  const title = (isRTL
    ? (product?.metadata?.localizations as any)?.ar?.title
    : product.title) || product.title

  const categoryTitle = product.categories?.[0]?.name || product.collection?.title || ""
  const categoryHandle = product.categories?.[0]?.handle || (product.collection ? `/collections/${product.collection.handle}` : "/products")

  return (
    <div id="product-info" dir={isRTL ? "rtl" : "ltr"}>
      <div className={clx("flex flex-col gap-[12px]", isRTL ? "text-right" : "text-left")}>
        {/* Brand Pill */}
        {categoryTitle && (
          <LocalizedClientLink
            href={categoryHandle.startsWith("/") ? categoryHandle : `/categories/${categoryHandle}`}
            className="inline-flex items-center gap-[6px] self-start rounded-[100px] border border-[#cdd6e9] bg-[#dce3f0] px-[10px] py-[4px] text-[12px] font-bold text-[#17284a] hover:bg-[#cdd6e9] transition-colors"
          >
            <span className="w-4 h-4 flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="none" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 7L12 3L21 7M3 7V17L12 21M3 7L12 11M21 7V17L12 21M21 7L12 11M12 21V11" stroke="#17284a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
            {categoryTitle}
          </LocalizedClientLink>
        )}

        {/* Title */}
        <h2
          className="text-[24px] lg:text-[28px] font-bold leading-[1.3] lg:leading-[1.25] text-[#17284a] break-words"
          data-testid="product-title"
        >
          {title}
        </h2>

        {/* Rating Row */}
        <div className="flex items-center gap-[8px] text-[14px] whitespace-nowrap">
          <span className="font-bold text-[#966109]">
            ★ 4.4
          </span>
          <span className="text-[#707176]">|</span>
          <span className="font-medium text-[#17284a]">
            {isRTL ? "136 تقييم" : "136 reviews"}
          </span>
        </div>

      </div>
    </div>
  )
}

export default ProductInfo