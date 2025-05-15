import { Metadata } from "next"

import FeaturedProducts from "@modules/home/components/featured-products"
import Hero from "@modules/home/components/hero"
import { listCollections } from "@lib/data/collections"
import { getRegion } from "@lib/data/regions"
import HeroCarousel from "@modules/home/components/heroCarousel"

export const metadata: Metadata = {
  title: "LA CASA",
  description:
    "Welcome to LA CASA, your one-stop shop for all your life needs!",
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
      url: "https://i.pinimg.com/736x/f0/27/c1/f027c19f65c5f05257a1ed0bb962c6a4.jpg",
      alternativeText: "Placeholder Banner Image"
    }
  }


  return (
    <>
      {/* <Hero data={fakeData} /> */}
      <HeroCarousel />
      <div className="py-12">
        <ul className="flex flex-col gap-x-6">
          <FeaturedProducts collections={collections} region={region} />
        </ul>
      </div>
    </>
  )
}
