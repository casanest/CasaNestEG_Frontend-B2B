import { notFound } from "next/navigation"
import { listProducts } from "@lib/data/products"
import { getRegion, listRegions } from "@lib/data/regions"
import SingleProductQuoteForm from "@modules/products/components/single-product-quote-form"


type Props = {
  params: Promise<{ countryCode: string; handle: string }>
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
