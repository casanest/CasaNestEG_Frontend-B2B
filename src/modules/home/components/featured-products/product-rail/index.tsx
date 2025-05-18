import { getTranslations } from "next-intl/server"
import { listProducts } from "@lib/data/products"
import { HttpTypes } from "@medusajs/types"
import { Text } from "@medusajs/ui"
import k from "@lib/i18n/translations/keys";
import InteractiveLink from "@modules/common/components/interactive-link"
import ProductPreview from "@modules/products/components/product-preview"
// import { useSafeTranslations } from "@lib/i18n/use-safe-translations"

export default async function ProductRail({
  collection,
  region,
  locale,
}: {
  collection: HttpTypes.StoreCollection
  region: HttpTypes.StoreRegion
  locale: string
}) {
  // const t =  useSafeTranslations()

  const dir = locale === "ar" ? "rtl" : "ltr"

  const {
    response: { products: pricedProducts },
  } = await listProducts({
    regionId: region.id,
    queryParams: {
      collection_id: collection.id,
      fields: "*variants.calculated_price",
    },
  })

  if (!pricedProducts) {
    return null
  }

  return (
    <div className="content-container" dir={dir}>
      <div
        className={`flex justify-between mb-8 `}
        dir={dir}
      >
        <Text className="txt-xlarge">{collection.title}</Text>
        <InteractiveLink href={`/collections/${collection.handle}`}>
         {locale === "ar" ? "عرض الكل" : "View All"}
        </InteractiveLink>
      </div>
      <ul className="grid grid-cols-2 small:grid-cols-4 medium:grid-cols-5 gap-x-6 gap-y-24 small:gap-y-36">
        {pricedProducts.map((product) => (
          <li key={product.id}>
            <ProductPreview product={product} region={region} isFeatured locale={locale} />
          </li>
        ))}
      </ul>
    </div>
  )
}
