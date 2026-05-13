import { Metadata } from "next"
import { notFound } from "next/navigation"
import { listProducts } from "@lib/data/products"
import { getRegion, listRegions } from "@lib/data/regions"
import ProductTemplate from "@modules/products/templates"

export const dynamic = "force-dynamic"
export const revalidate = 0

type Props = {
  params: Promise<{ countryCode: string; handle: string }>
}

export async function generateStaticParams() {
  try {
    const regions = await listRegions()
    
    if (!regions || regions.length === 0) {
      console.warn("No regions found during static generation")
      return []
    }

    const countryCodes = regions
      .map((r) => r.countries?.map((c) => c.iso_2))
      .flat()
      .filter(Boolean) as string[]

    if (!countryCodes || countryCodes.length === 0) {
      console.warn("No country codes found in regions")
      return []
    }

    // Use the first available country code instead of hardcoded "US"
    const firstCountryCode = countryCodes[0]
    
    const products = await listProducts({
      countryCode: firstCountryCode,
      queryParams: { fields: "handle" },
    }).then(({ response }) => response.products)

    if (!products || products.length === 0) {
      console.warn("No products found during static generation")
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
  } catch (error) {
    console.error(
      `Failed to generate static paths for product pages: ${
        error instanceof Error ? error.message : "Unknown error"
      }.`
    )
    return []
  }
}
  // const title = (isRTL ? product?.metadata?.localizations?.ar?.title : product.title) || product.title
  // const description = (isRTL ? product?.metadata?.localizations?.ar?.description : product.description) || product.description
  // const images = product.images || []

// export async function generateMetadata(props: Props): Promise<Metadata> {
//   const params = await props.params
//   const { handle } = params
//   const region = await getRegion(params.countryCode)

//   if (!region) {
//     notFound()
//   }

//   const product = await listProducts({
//     countryCode: params.countryCode,
//     queryParams: { handle },
//   }).then(({ response }) => response.products[0])

//   if (!product) {
//     notFound()
//   }

//   return {
//     title: `${product.title} | CASANEST Store`,
//     description: `${product.title}`,
//     openGraph: {
//       title: `${product.title} | CASANEST Store`,
//       description: `${product.title}`,
//       images: product.thumbnail ? [product.thumbnail] : [],
//     },
//   }
// }


export async function generateMetadata(
  props: Props
): Promise<Metadata> {
  const params = await props.params
  const { handle, countryCode } = params

  const region = await getRegion(countryCode)

  if (!region) {
    notFound()
  }

  const product = await listProducts({
    countryCode,
    queryParams: { handle },
  }).then(({ response }) => response.products[0])

  if (!product) {
    notFound()
  }

  const isRTL = ["eg", "sa", "ae"].includes(countryCode)

  const localized = product?.metadata?.localizations as any

  const title =
    (isRTL
      ? localized?.ar?.title
      : localized?.en?.title) || product.title

  const description =
    (isRTL
      ? localized?.ar?.description
      : localized?.en?.description) ||
    product.description ||
    title

  const image =
    product.thumbnail ||
    product.images?.[0]?.url ||
    "/opengraph-image.png"

  const locale = isRTL ? "ar" : "en"

  return {
    title: `${title} | CASANEST`,
    description,

    openGraph: {
      title: `${title} | CASANEST`,
      description,
      url: `https://casanesteg.com/${locale}/${countryCode}/products/${handle}`,
      siteName: "CASANEST",
      type: "website",
      locale: isRTL ? "ar_EG" : "en_US",

      images: [
        {
          url: image,
          width: 1600,
          height: 900,
          alt: title,
        },
      ],
    },

    twitter: {
      card: "summary_large_image",
      title: `${title} | CASANEST`,
      description,
      images: [image],
    },

    alternates: {
      canonical: `https://casanesteg.com/${locale}/${countryCode}/products/${handle}`,
      languages: {
        en: `https://casanesteg.com/en/${countryCode}/products/${handle}`,
        ar: `https://casanesteg.com/ar/${countryCode}/products/${handle}`,
      },
    },
  }
}
export default async function ProductPage(props: Props) {
  const params = await props.params
  const region = await getRegion(params.countryCode)

  if (!region) {
    notFound()
  }

  const pricedProduct = await listProducts({
    countryCode: params.countryCode,
    queryParams: { handle: params.handle },
  }).then(({ response }) => response.products[0])

  if (!pricedProduct) {
    notFound()
  }

  return (
    <ProductTemplate
      product={pricedProduct}
      region={region}
      countryCode={params.countryCode}
    />
  )
}
