import { HttpTypes } from "@medusajs/types"
import { Heading } from "@medusajs/ui"
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
    ? product?.metadata?.localizations?.ar?.title
    : product.title) || product.title

  return (
    <div id="product-info" dir={isRTL ? "rtl" : "ltr"}>
      <div
        className={clx(
          "flex flex-col gap-3 text-[#043364]",
          isRTL ? "text-right" : "text-left"
        )}
      >
        {product.collection && (
          <LocalizedClientLink
            href={`/collections/${product.collection.handle}`}
            className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400 hover:text-[#043364] transition-colors"
          >
            {product.collection.title}
          </LocalizedClientLink>
        )}
        <Heading
          level="h2"
          className="
    text-2xl
    sm:text-3xl
    lg:text-4xl
    font-bold
    leading-tight
    tracking-tight
    break-words
    text-slate-900
  "
          data-testid="product-title"
        >
          {title}
        </Heading>
      </div>
    </div>
  )
}

export default ProductInfo