import { HttpTypes } from "@medusajs/types"
import ProductRail from "@modules/home/components/featured-products/product-rail"

export default async function FeaturedProducts({
  collections,
  region,
  locale,
}: {
  collections: HttpTypes.StoreCollection[]
  region: HttpTypes.StoreRegion
  locale: string // "en", "ar", ...
}) {
  return (
    <ul className="flex flex-col gap-8 ">
      {collections.map((collection) => (
        <li key={collection.id}>
          <ProductRail
            collection={collection}
            region={region}
            locale={locale}
          />
        </li>
      ))}
    </ul>
  )
}
