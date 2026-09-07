import { setRequestLocale } from "next-intl/server"
import { listTestimonials } from "@lib/data/testimonials"
import { listBanners } from "@lib/data/banners"
import HeroSplit from "./components/HeroSplit"
import OurClients from "./components/OurClients"
import StatsBar from "./components/StatsBar"
import MissionV1 from "./components/MissionV1"
import ArchShowcase from "./components/ArchShowcase"
import ValuesV1 from "./components/ValuesV1"
import DarkContent from "./components/DarkContent"
import TeamShowcase from "./components/TeamShowcase"
import AboutOverviewBento from "./components/AboutOverviewBento"
import TimelineHorizontal from "./components/TimelineHorizontal"
import WorkGalleryFan from "./components/WorkGalleryFan"
import HomeTestimonialsSection from "@modules/home/components/testimonials-section/TestimonialsSection"

type Props = {
  params: Promise<{ locale: string; countryCode: string }>
}

export default async function AboutUsPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)
  const isRTL = locale === "ar"

  const [testimonials, clientBanners] = await Promise.all([
    listTestimonials(),
    listBanners("past_customer"),
  ])

  return (
    <div className="bg-white flex flex-col items-center w-full overflow-x-hidden">
      <HeroSplit isRTL={isRTL} locale={locale} />
      <OurClients isRTL={isRTL} locale={locale} banners={clientBanners} />
      <StatsBar isRTL={isRTL} locale={locale} />
      <MissionV1 isRTL={isRTL} locale={locale} />
      <ArchShowcase isRTL={isRTL} locale={locale} />
      <ValuesV1 isRTL={isRTL} locale={locale} />
      <DarkContent isRTL={isRTL} locale={locale} />
      <TeamShowcase isRTL={isRTL} locale={locale} />
      <AboutOverviewBento isRTL={isRTL} locale={locale} />
      <TimelineHorizontal isRTL={isRTL} locale={locale} />
      <WorkGalleryFan isRTL={isRTL} locale={locale} />
      <HomeTestimonialsSection testimonials={testimonials} locale={locale} dir={isRTL ? "rtl" : "ltr"} />
    </div>
  )
}
