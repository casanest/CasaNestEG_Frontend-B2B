import { Metadata } from "next"

import { getRegion } from "@lib/data/regions"
import { listProducts } from "@lib/data/products"
import { getHomepageData } from "@lib/data/homepage"

import HeroSection from "@modules/home/components/hero-section/HeroSection"
import OurClients from "@modules/home/components/our-clients/OurClients"
import Amenities from "@modules/home/components/amenities/Amenities"
import PreCuratedSolutions from "@modules/home/components/pre-curated-solutions/PreCuratedSolutions"
import StatsBar from "@modules/home/components/stats-bar/StatsBar"
import OurPartners from "@modules/home/components/our-partners/OurPartners"
import OurWork from "@modules/home/components/our-work/OurWork"
import BuildProposal from "@modules/home/components/build-proposal/BuildProposal"
import TestimonialsSection from "@modules/home/components/testimonials-section/TestimonialsSection"
import FAQSection from "@modules/home/components/faq-section/FAQSection"

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
  params: Promise<{
    countryCode: string
    locale: string
  }>
}
export const revalidate = 60

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const { locale, countryCode } = await params

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
  params: Promise<{ countryCode: string; locale: string }>
}) {
  const { countryCode, locale } = await params
  const dir = locale === "ar" ? "rtl" : "ltr"

  const region = await getRegion(countryCode)
  if (!region) {
    return null
  }

  // Fetch homepage content data and products in parallel
  const [homepageData, homepageProductsData] = await Promise.all([
    getHomepageData(),
    listProducts({
      pageParam: 1,
      queryParams: {
        limit: 100,
      },
      countryCode,
    }),
  ])

  const allProducts = homepageProductsData.response.products
  const homepageProducts = allProducts.filter(
    (p) => (p as any).is_in_homepage === true
  )

  return (
    <>
      <HeroSection banners={homepageData.banners.hero} locale={locale} dir={dir} />
      <OurClients banners={homepageData.banners.past_customer} locale={locale} dir={dir} />
      <Amenities products={homepageProducts} locale={locale} dir={dir} region={region} />
      <PreCuratedSolutions packages={homepageData.packages} locale={locale} dir={dir} />
      <StatsBar dir={dir} />
      <OurPartners banners={homepageData.banners.partners} dir={dir} />
      <OurWork projects={homepageData.portfolio.projects} locale={locale} dir={dir} />
      <BuildProposal dir={dir} />
      <TestimonialsSection testimonials={homepageData.testimonials} locale={locale} dir={dir} />
      <FAQSection dir={dir} />
    </>
  )
}
