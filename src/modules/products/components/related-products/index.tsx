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
    ).slice(0, 8)
  })

  if (!products.length) {
    return null
  }

  return (
    <div dir={locale === "ar" ? "rtl" : "ltr"} className="w-full">
      <div className="flex flex-col items-start mb-6">
        <span className="text-[24px] font-medium text-[#707176] mb-1" style={{ fontFamily: "Caveat, cursive" }}>
          {locale === "ar" ? "قد يعجبك أيضًا" : "You May Also Like"}
        </span>
        <p className="text-[28px] font-bold text-[#17284a]">
          {locale === "ar" ? "منتجات ذات صلة" : "Related Products"}
        </p>
      </div>

      <div
        className="flex gap-4 overflow-x-auto scrollbar-hide pb-2 -mx-1 px-1"
        style={{
          maskImage: "linear-gradient(to right, transparent 0, black 16px, black calc(100% - 40px), transparent 100%)",
          WebkitMaskImage: "linear-gradient(to right, transparent 0, black 16px, black calc(100% - 40px), transparent 100%)",
        }}
      >
        {products.map((product) => (
          <div key={product.id} className="flex-shrink-0 w-[280px] sm:w-[300px]">
            <Product locale={locale} region={region} product={product} />
          </div>
        ))}
      </div>
    </div>
  )
}
