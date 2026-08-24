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
      <div className={clx("flex flex-col gap-2", isRTL ? "text-right" : "text-left")}>
        {/* Brand Pill */}
        {categoryTitle && (
          <LocalizedClientLink
            href={categoryHandle.startsWith("/") ? categoryHandle : `/categories/${categoryHandle}`}
            className="inline-flex items-center gap-1.5 self-start rounded-[100px] border border-[#ccc] bg-[#f3f4f6] px-2 py-1 text-[12px] font-medium text-[#17284a] hover:bg-[#e8eaf0] transition-colors"
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
          className="text-[24px] lg:text-[28px] font-bold leading-[1.25] text-[#17284a] break-words"
          data-testid="product-title"
        >
          {title}
        </h2>

      </div>
    </div>
  )
}

export default ProductInfo