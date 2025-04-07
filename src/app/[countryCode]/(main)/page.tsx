import { Metadata } from "next"

import FeaturedProducts from "@modules/home/components/featured-products"
import Hero from "@modules/home/components/hero"
import { listCollections } from "@lib/data/collections"
import { getRegion } from "@lib/data/regions"

export const metadata: Metadata = {
  title: "Medusa Next.js Starter Template",
  description:
    "A performant frontend ecommerce starter template with Next.js 15 and Medusa.",
}

export default async function Home(props: {
  params: Promise<{ countryCode: string }>
}) {
  const params = await props.params

  const { countryCode } = params

  const region = await getRegion(countryCode)

  const { collections } = await listCollections({
    fields: "id, handle, title",
  })

  if (!collections || !region) {
    return null
  }
  const fakeData = {
    Headline: "Welcome to Our Website!",
    Text: "We are excited to have you here. Discover our products and services, tailored just for you.",
    CTA: {
      BtnLink: "/store",
      BtnText: "Shop Now"
    },
    Image: {
      // url: "https://images.pexels.com/photos/31346262/pexels-photo-31346262/free-photo-of-idyllic-view-of-amalfi-coastline-italy.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      url: "https://images.pexels.com/photos/5662862/pexels-photo-5662862.png?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      alternativeText: "Placeholder Banner Image"
    }
  }


  return (
    <>
      <Hero data={fakeData} />
      <div className="py-12">
        <ul className="flex flex-col gap-x-6">
          <FeaturedProducts collections={collections} region={region} />
        </ul>
      </div>
    </>
  )
}
