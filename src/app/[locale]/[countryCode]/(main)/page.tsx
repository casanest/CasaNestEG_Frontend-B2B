import { Metadata } from "next"

import FeaturedProducts from "@modules/home/components/featured-products"
import HeroCarousel from "@modules/home/components/heroCarousel"
import CategoryCarousel from "@modules/home/components/categoryCarousel"

import { listCollections } from "@lib/data/collections"
import { getRegion } from "@lib/data/regions"
import StoreFeatures from "@modules/home/components/storeFeatures"
import PromotionBanner from "@modules/home/components/promotionBanner"

export const metadata: Metadata = {
  title: "LA CASA",
  description: "Welcome to LA CASA, your one-stop shop for all your life needs!",
}

export default async function Home({
  params,
}: {
  params: { countryCode: string; locale: string }
}) {
  const { countryCode, locale } = params

  const region = await getRegion(countryCode)

  const { collections } = await listCollections({
    fields: "id, handle, title",
  })

  if (!collections || !region) {
    return null
  }

  const dir = locale === "ar" ? "rtl" : "ltr"

  return (
    <>
      <div className="" dir={dir}>
        <div className="md:content-container md:mx-auto" dir={dir}>
          <HeroCarousel locale={locale} />
        </div>
        <div className="" dir={dir}>
          <CategoryCarousel locale={locale} />
        </div>
        <PromotionBanner locale={locale} />
        <ul className="flex flex-col gap-y-12 py-5">
          <FeaturedProducts collections={collections} region={region} locale={locale} />
        </ul>
      </div>
      <div className="" dir={dir}>
        <StoreFeatures locale={locale} />
      </div>
    </>
  )
}
