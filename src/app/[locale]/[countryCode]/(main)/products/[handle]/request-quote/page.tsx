import { notFound } from "next/navigation"
import { listProducts } from "@lib/data/products"
import { getRegion, listRegions } from "@lib/data/regions"
import SingleProductQuoteForm from "@modules/products/components/single-product-quote-form"

type Props = {
  params: Promise<{ countryCode: string; handle: string }>
}

export async function generateStaticParams() {
  try {
    const regions = await listRegions()

    if (!regions || regions.length === 0) {
      return []
    }

    const countryCodes = regions
      .map((r) => r.countries?.map((c) => c.iso_2))
      .flat()
      .filter(Boolean) as string[]

    if (!countryCodes || countryCodes.length === 0) {
      return []
    }

    const firstCountryCode = countryCodes[0]

    const products = await listProducts({
      countryCode: firstCountryCode,
      queryParams: { fields: "handle" },
    }).then(({ response }) => response.products)

    if (!products || products.length === 0) {
      return []
    }

    return countryCodes
      .map((countryCode) =>
        products.map((product) => ({
          countryCode,
          handle: product.handle,
        }))
      )
      .flat()
      .filter((param) => param.handle)
  } catch {
    return []
  }
}

export default async function SingleProductQuotePage(props: Props) {
  const params = await props.params
  const region = await getRegion(params.countryCode)

  if (!region) {
    notFound()
  }

  const product = await listProducts({
    countryCode: params.countryCode,
    queryParams: { handle: params.handle },
  }).then(({ response }) => response.products[0])

  if (!product) {
    notFound()
  }

  return <SingleProductQuoteForm product={product} region={region} />
}
