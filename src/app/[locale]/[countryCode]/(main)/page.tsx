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

// export const metadata: Metadata = {
//   title: {
//     default: "CASANEST | Complete Furniture, IT & Business Solutions",
//     template: "%s | CASANEST",
//   },
//   description:
//     "CASANEST provides complete solutions for offices, homes, hotels, theaters, retail stores, and educational facilities. Explore premium furniture, IT devices, security systems, networking, lighting, electrical appliances, and integrated business setups.",

//   keywords: [
//     "CASANEST",
//     "Office Furniture",
//     "Home Furniture",
//     "Hotel Furniture",
//     "Theater Furniture",
//     "IT Devices",
//     "Security Systems",
//     "Networking Solutions",
//     "Electrical Appliances",
//     "Lighting Solutions",
//     "Office Setup",
//     "Company Setup",
//     "Retail Store Setup",
//     "Hotel Setup",
//     "School Furniture",
//     "University Hall Setup",
//     "Smart Office Solutions",
//     "Furniture Egypt",
//     "Office Solutions",
//     "Integrated Business Solutions",
//     "Furniture and IT Solutions",
//     "Business Furniture",
//     "Commercial Furniture",
//     "Educational Furniture",

//     // Arabic
//     "كازانيست",
//     "أثاث مكتبي",
//     "أثاث منزلي",
//     "أثاث فنادق",
//     "أثاث مسارح",
//     "أجهزة تقنية",
//     "أنظمة أمن",
//     "شبكات",
//     "أجهزة كهربائية",
//     "حلول إضاءة",
//     "تجهيز شركات",
//     "تجهيز مكاتب",
//     "تجهيز فنادق",
//     "تجهيز محلات",
//     "تجهيز مدارس",
//     "تجهيز جامعات",
//     "حلول متكاملة",
//     "أثاث في مصر",
//     "حلول أعمال",
//     "أثاث تجاري",
//     "أثاث تعليمي",
//     "كازانست مصر",
//     "كازانست للأثاث",
//     "كازانست للأجهزة",
//     "كازانست للحلول المتكاملة",
//     "كازانست لتجهيز الشركات",
//     "كازانست لتجهيز المكاتب",
//     "كازانست لتجهيز الفنادق",
//     "كازانست لتجهيز المحلات",
//     "كازانست لتجهيز المدارس",
//     "كازانست لتجهيز الجامعات",
//     "كازانست للحلول التجارية",
//     "كازانست للحلول التعليمية",
//   ],

//   openGraph: {
//     title: "CASANEST | Complete Furniture, IT & Business Solutions",
//     description:
//       "Premium furniture, IT infrastructure, security systems, appliances, and complete business setup solutions for offices, homes, hotels, retail stores, and educational facilities.",
//     type: "website",
//     siteName: "CASANEST",
//   },

//   twitter: {
//     card: "summary_large_image",
//     title: "CASANEST | Premium Furniture & Business Solutions",
//     description:
//       "Discover integrated furniture, IT, networking, security, and appliance solutions for modern businesses and homes.",
//   },

//   alternates: {
//     languages: {
//       en: "/en",
//       ar: "/ar",
//     },
//   },
// };


// import { Metadata } from "next"

type Props = {
  params: {
    countryCode: string
    locale: string
  }
}

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const { locale, countryCode } = params

  const isArabic = locale === "ar"

  const title = isArabic
    ? "كازانيست | حلول متكاملة للأثاث والتقنية وتجهيز الأعمال"
    : "CASANEST | Complete Furniture, IT & Business Solutions"

  const description = isArabic
    ? "كازانيست تقدم حلولاً متكاملة لتجهيز المكاتب، المنازل، الفنادق، المسارح، المحلات التجارية، والمؤسسات التعليمية. اكتشف الأثاث الفاخر، الأجهزة التقنية، أنظمة الأمن، الشبكات، الإضاءة، والأجهزة الكهربائية."
    : "CASANEST provides complete solutions for offices, homes, hotels, theaters, retail stores, and educational facilities. Explore premium furniture, IT devices, security systems, networking, lighting, electrical appliances, and integrated business setups."

  const keywords = isArabic
    ? [
      "كازانيست",
      "أثاث مكتبي",
      "أثاث منزلي",
      "أثاث فنادق",
      "أثاث مسارح",
      "أجهزة تقنية",
      "أنظمة أمن",
      "شبكات",
      "أجهزة كهربائية",
      "حلول إضاءة",
      "تجهيز شركات",
      "تجهيز مكاتب",
      "تجهيز فنادق",
      "تجهيز محلات",
      "تجهيز مدارس",
      "تجهيز جامعات",
      "حلول متكاملة",
      "أثاث في مصر",
      "حلول أعمال",
      "أثاث تجاري",
      "أثاث تعليمي",
    ]
    : [
      "CASANEST",
      "Office Furniture",
      "Home Furniture",
      "Hotel Furniture",
      "Theater Furniture",
      "IT Devices",
      "Security Systems",
      "Networking Solutions",
      "Electrical Appliances",
      "Lighting Solutions",
      "Office Setup",
      "Company Setup",
      "Retail Store Setup",
      "Hotel Setup",
      "School Furniture",
      "University Hall Setup",
      "Smart Office Solutions",
      "Furniture Egypt",
      "Office Solutions",
      "Integrated Business Solutions",
    ]

  const currentUrl = `https://casanesteg.com/${locale}/${countryCode}`

  return {
    title,
    description,
    keywords,

    metadataBase: new URL("https://casanesteg.com"),

    openGraph: {
      title,
      description,
      url: currentUrl,
      siteName: "CASANEST",
      type: "website",
      locale: isArabic ? "ar_EG" : "en_US",

      images: [
        {
          url: "/opengraph-image.jpg",
          width: 1600,
          height: 900,
          alt: title,
        },
      ],
    },

    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/opengraph-image.jpg"],
    },

    alternates: {
      canonical: currentUrl,

      languages: {
        en: `https://casanesteg.com/en/${countryCode}`,
        ar: `https://casanesteg.com/ar/${countryCode}`,
      },
    },

    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
      },
    },
  }
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
