import { Metadata } from "next"

import { listCollections } from "@lib/data/collections"
import { getRegion } from "@lib/data/regions"
import { getParentCategories, listCategories } from "@lib/data/categories"
import { listProducts } from "@lib/data/products"
import CallToActionBanner from "@modules/home/components/call-to-action-banner"
import HeroCarousel from "@modules/home/components/heroCarousel"
import CategoryCarousel from "@modules/home/components/categoryCarousel"
import PromotionBanner from "@modules/home/components/promotionBanner"
import FeaturedProducts from "@modules/home/components/featured-products"
import StoreFeatures from "@modules/home/components/storeFeatures"
import ProductGrid from "@modules/home/components/productGrid"
import PreviewPrice from "@modules/products/components/product-preview/price"
import { getProductPrice } from "@lib/util/get-product-price"
import FeaturedProductsSection from "@modules/home/components/featured-products-section"

export const metadata: Metadata = {
  title: "LA CASA - Premium Home & Kitchen Store",
  description: "Welcome to LA CASA, your one-stop shop for premium home appliances, kitchen essentials, and lifestyle products.",
  keywords: "home appliances, kitchen essentials, premium products, furniture, LA CASA",
  openGraph: {
    title: "LA CASA - Premium Home & Kitchen Store",
    description: "Your one-stop shop for premium home appliances and kitchen essentials",
    type: "website",
  },
}

export default async function Home({
  params,
}: {
  params: { countryCode: string; locale: string }
}) {
  // const { cheapestPrice } = getProductPrice({ product })

  const { countryCode, locale } = params

  // Fetch all necessary data
  const region = await getRegion(countryCode)
  const { collections } = await listCollections({
    fields: "id, handle, title, metadata",
  })
  const productCategories = await getParentCategories(await listCategories())

  // Fetch featured products for the product grid
  const { response: { products: featuredProducts } } = await listProducts({
    pageParam: 1,
    queryParams: { limit: 12 },
    countryCode,
  })

  if (!collections || !region) {
    return null
  }

  const collectionsWithProducts = await Promise.all(
    collections.map(async (collection) => {
      try {
        const {
          response: { products },
        } = await listProducts({
          regionId: region.id,
          queryParams: {
            collection_id: collection.id,
            fields: "*variants.calculated_price",
          },
        })

        return {
          ...collection,
          products,
        }
      } catch (error) {
        console.error(
          `Failed to load products for collection ${collection.id}:`,
          error
        )
        return {
          ...collection,
          products: [],
        }
      }
    })
  )

  const dir = locale === "ar" ? "rtl" : "ltr"

  return (
    <div className="min-h-screen " dir={dir}>
      {/* Hero Carousel */}
      <section className="md:py-8 pb-0 bt-0 ">
        <div className="md:content-container md:mx-auto">
          <HeroCarousel locale={locale} />
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-12 bg-gradient-to-b from-white to-gray-50 overflow-hidden">
        <div className="content-container overflow-hidden mx-auto">
          <CategoryCarousel locale={locale} productCategories={productCategories} />
        </div>
      </section>


      {/* Featured Products Section
      <FeaturedProductsSection
        title={locale === "ar" ? "المنتجات المميزة" : "Featured Products"}
        locale={locale}
        region={region}
        products={featuredProducts}
      /> */}


      {/* Promotion Banner */}
      <section className="">
        <PromotionBanner locale={locale} />
      </section>

      {/* Collections Section */}
      <section className=" bg-gradient-to-b from-gray-50 via-white to-gray-50">
        <div className="content-container mx-auto">
          <ul className="flex flex-col ">
            <FeaturedProducts collections={collectionsWithProducts} locale={locale} />
          </ul>
        </div>
      </section>

      {/* Call to Action */}
      {/* <section className="py-12 bg-gray-50">
        <div className="md:content-container">
          <CallToActionBanner locale={locale} />
        </div>
      </section> */}

      {/* Store Features */}
      {/* <section className="py-12 bg-white">
        <div className="content-container mx-auto">
          <StoreFeatures locale={locale} />
        </div>
      </section> */}
    </div>
  )
}
