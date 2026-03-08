import { HttpTypes } from "@medusajs/types"
import { Heading, Text } from "@medusajs/ui"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { getLocale } from "next-intl/server"

type ProductInfoProps = {
  product: HttpTypes.StoreProduct
}

const ProductInfo = async ({ product }: ProductInfoProps) => {
  const locale = await getLocale()
  const isRTL = locale === "ar"

  const title = (isRTL
    ? product?.metadata?.localizations?.ar?.title
    : product.title) || product.title

  const description = (isRTL
    ? product?.metadata?.localizations?.ar?.description
    : product.description) || product.description

  return (
    <div id="product-info" dir={isRTL ? "rtl" : "ltr"}>
      <div className="flex flex-col gap-y-4 lg:max-w-[500px] mx-auto text-[#043364]">
        {product.collection && (
          <LocalizedClientLink
            href={`/collections/${product.collection.handle}`}
            className="text-medium text-ui-fg-muted hover:text-ui-fg-subtle"
          >
            {product.collection.title}
          </LocalizedClientLink>
        )}
        <Heading
          level="h2"
          className="text-3xl leading-10"
          data-testid="product-title"
        >
          {title}
        </Heading>

        <Text
          className="text-medium whitespace-pre-line"
          data-testid="product-description"
        >
          {description}
        </Text>
      </div>
    </div>
  )
}

export default ProductInfo