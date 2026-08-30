import { getRegion } from "@lib/data/regions"
import { HttpTypes } from "@medusajs/types"
import { getLocale } from "next-intl/server"
import { sdk } from "@lib/config"
import { getAuthHeaders, getCacheOptions } from "@lib/data/cookies"
import RelatedProductsCarousel from "./carousel"

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

  const rawRelated = (product as any).related_products ?? []

  if (!rawRelated.length) {
    return null
  }

  const relatedIds = rawRelated.map((p: any) => p.id)

  let products: HttpTypes.StoreProduct[] = rawRelated

  try {
    const headers = await getAuthHeaders()
    const next = await getCacheOptions("products")
    const response = await sdk.client.fetch<{ products: HttpTypes.StoreProduct[]; count: number }>(
      `/store/products`,
      {
        method: "GET",
        query: {
          id: relatedIds,
          limit: relatedIds.length,
          region_id: region.id,
          fields: "*variants.calculated_price,+metadata,*variants,*variants.options,*options,*options.values,*images,*tags,*categories,",
        },
        headers,
        next,
        cache: "no-store",
      }
    )
    if (response?.products?.length) {
      console.log("[RelatedProducts] Fetched with pricing:", JSON.stringify({
        count: response.products.length,
        sample: response.products[0] ? {
          id: response.products[0].id,
          title: response.products[0].title,
          hasVariants: !!response.products[0].variants?.length,
          firstVariantCalculatedPrice: response.products[0].variants?.[0]?.calculated_price,
        } : null,
      }, null, 2))
      const orderMap = new Map(rawRelated.map((p: any, i: number) => [p.id, i]))
      products = response.products.sort(
        (a, b) => (Number(orderMap.get(a.id)) || 0) - (Number(orderMap.get(b.id)) || 0)
      )
    } else {
      console.log("[RelatedProducts] API returned no products. Response:", JSON.stringify(response, null, 2))
    }
  } catch (error) {
    console.error("Failed to fetch related products with pricing:", error)
  }

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

      <RelatedProductsCarousel
        products={products}
        region={region}
        locale={locale}
      />
    </div>
  )
}
