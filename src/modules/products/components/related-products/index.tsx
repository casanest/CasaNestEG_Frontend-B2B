import { listProducts } from "@lib/data/products"
import { getRegion } from "@lib/data/regions"
import { HttpTypes } from "@medusajs/types"
import Product from "../product-preview"
import { getLocale } from "next-intl/server"

type RelatedProductsProps = {
  product: HttpTypes.StoreProduct
  countryCode: string
}

export default async function RelatedProducts({
  product,
  countryCode,
}: RelatedProductsProps) {
  const region = await getRegion(countryCode)
  const locale = await getLocale()

  if (!region) {
    return null
  }

  // edit this function to define your related products logic
  const queryParams: HttpTypes.StoreProductParams = {}
  if (region?.id) {
    queryParams.region_id = region.id
  }
  if (product.collection_id) {
    queryParams.collection_id = [product.collection_id]
  }
  if (product.tags) {
    queryParams.tag_id = product.tags
      .map((t) => t.id)
      .filter(Boolean) as string[]
  }
  queryParams.is_giftcard = false

  const products = await listProducts({
    queryParams,
    countryCode,
  }).then(({ response }) => {
    return response.products.filter(
      (responseProduct) => responseProduct.id !== product.id
    )
  })

  if (!products.length) {
    return null
  }

  return (
    <div dir={locale === "ar" ? "rtl" : "ltr"} className="product-page-constraint text-[#043364]">
      <div className="flex flex-col items-center text-center mb-16">
        <span className="text-base-regular  mb-6">
          {locale === "ar" ? "قد يعجبك أيضًا" : "You might also like"}
        </span>
        <p className="text-2xl-regular  max-w-lg">
          {locale === "ar"
            ? "اكتشف المزيد من المنتجات التي قد تعجبك"
            : "Discover more products you might like"}
        </p>
      </div>

      <ul className="grid grid-cols-2 small:grid-cols-3 medium:grid-cols-4 gap-x-4 gap-y-4">
        {products.map((product) => (
          <li key={product.id}>
            <Product locale={locale} region={region} product={product} />
          </li>
        ))}
      </ul>
    </div>
  )
}
