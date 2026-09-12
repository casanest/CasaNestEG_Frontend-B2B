import { Metadata } from "next"
import { notFound } from "next/navigation"
import { cache } from "react"
import { listProducts } from "@lib/data/products"
import { getRegion, listRegions } from "@lib/data/regions"
import ProductTemplate from "@modules/products/templates"



type Props = {
  params: Promise<{ countryCode: string; handle: string }>
}

const getProductByHandle = cache(async (countryCode: string, handle: string) => {
  const { response } = await listProducts({
    countryCode,
    queryParams: { handle },
  })
  return response.products[0]
})


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

  const product = await getProductByHandle(countryCode, handle)

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

  const metaKeywords =
    (isRTL
      ? localized?.ar?.meta_keywords
      : localized?.en?.meta_keywords) || undefined

  const locale = isRTL ? "ar" : "en"

  return {
    title: `${title} | CASANEST`,
    description,
    ...(metaKeywords ? { keywords: metaKeywords } : {}),

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

  const pricedProduct = await getProductByHandle(params.countryCode, params.handle)

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
