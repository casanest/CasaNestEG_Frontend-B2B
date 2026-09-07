import { useTranslations, useLocale } from "next-intl"
import { ArrowRight } from "lucide-react"
import { Banner } from "@lib/data/banners"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

type OurClientsProps = {
  banners: Banner[]
  locale: string
  dir: string
}

export default function OurClients({ banners, locale, dir }: OurClientsProps) {
  const t = useTranslations("home.clients")
  const isRTL = locale === "ar"

  const half = Math.ceil(banners.length / 2)
  const row1 = banners.slice(0, half)
  const row2 = banners.slice(half)
  const row1Doubled = [...row1, ...row1]
  const row2Doubled = [...row2, ...row2]

  const renderMarqueeItem = (banner: Banner, idx: number) => (
    <div
      key={`${banner.id}-${idx}`}
      className="flex shrink-0 h-[clamp(100px,11vw,170px)] w-[clamp(200px,22vw,340px)] items-center justify-center mx-[clamp(5px,0.75vw,10px)]"
    >
      <img
        src={banner.image_url}
        alt=""
        className="max-h-[clamp(65px,8vw,130px)] max-w-[clamp(150px,20vw,280px)] object-contain"
      />
    </div>
  )

  return (
    <section
      className="bg-white flex flex-col gap-[40px] md:gap-[clamp(40px,5vw,80px)] items-start md:items-center justify-center min-h-[80svh] px-[16px] md:px-[clamp(16px,4vw,60px)] py-[44px] md:py-[clamp(40px,5vw,80px)] w-full"
      dir={dir}
    >
      {/* Header */}
      <div className="flex items-end justify-between w-full max-w-[calc(70vw+432px)]">
        <div className="flex flex-col gap-[8px] md:gap-[clamp(10px,1vw,16px)]">
          <div className="flex flex-col gap-[8px] md:gap-[clamp(6px,0.6vw,8px)]">
            <p className="font-caveat text-[#17284a] text-[32px] md:text-[clamp(28px,2.5vw,40px)] leading-[1.2]">
              {t("eyebrow")}
            </p>
            <h2 className="text-black text-[24px] md:text-[clamp(24px,2.8vw,40px)] leading-[1.18] font-medium">
              {t("title")}
            </h2>
          </div>
          <p className="text-black/80 text-[16px] md:text-[clamp(14px,1.6vw,24px)] leading-[1.3] max-w-[734px]">
            {t("description")}
          </p>
        </div>
        {/* Desktop: About Us button in header */}
        <LocalizedClientLink
          href="/about-us"
          className="hidden md:flex group border border-black gap-[8px] items-center justify-center px-[clamp(20px,2.5vw,36px)] py-[clamp(16px,1.6vw,24px)] rounded-[16px] w-[clamp(160px,16vw,240px)] hover:bg-[#17284a] hover:text-white hover:border-[#17284a] transition-colors shrink-0"
        >
          <span className="text-black text-[clamp(13px,1.1vw,16px)] font-medium text-center group-hover:text-white">
            {t("aboutUsCta")}
          </span>
          <ArrowRight className={`w-[clamp(16px,1.3vw,20px)] h-[clamp(16px,1.3vw,20px)] text-black group-hover:text-white ${isRTL ? "rotate-180" : ""}`} />
        </LocalizedClientLink>
      </div>

      {/* Mobile: two infinite auto-scrolling marquee bars in opposite directions */}
      <div className="md:hidden flex flex-col gap-[16px] w-full mt-[20px]">
        <div className="relative w-full overflow-hidden">
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-[40px] bg-gradient-to-r from-white to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-[40px] bg-gradient-to-l from-white to-transparent" />
          <div className="flex w-max animate-scroll-left" dir="ltr">
            {row1Doubled.map((banner, idx) => (
              <div
                key={`${banner.id}-${idx}`}
                className="flex shrink-0 h-[120px] w-[200px] items-center justify-center mx-[10px]"
              >
                <img
                  src={banner.image_url}
                  alt=""
                  className="max-h-[80px] max-w-[170px] object-contain"
                />
              </div>
            ))}
          </div>
        </div>
        <div className="relative w-full overflow-hidden">
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-[40px] bg-gradient-to-r from-white to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-[40px] bg-gradient-to-l from-white to-transparent" />
          <div className="flex w-max animate-scroll-right" dir="ltr">
            {row2Doubled.map((banner, idx) => (
              <div
                key={`${banner.id}-${idx}`}
                className="flex shrink-0 h-[120px] w-[200px] items-center justify-center mx-[10px]"
              >
                <img
                  src={banner.image_url}
                  alt=""
                  className="max-h-[80px] max-w-[170px] object-contain"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Desktop: two infinite auto-scrolling marquee bars in opposite directions */}
      <div className="hidden md:flex flex-col gap-[clamp(24px,3vw,48px)] w-full mt-[clamp(40px,5vw,80px)]">
        {/* Row 1 - scrolls left */}
        <div className="relative w-full overflow-hidden">
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-[120px] bg-gradient-to-r from-white to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-[120px] bg-gradient-to-l from-white to-transparent" />
          <div className="flex w-max animate-scroll-left" dir="ltr">
            {row1Doubled.map((banner, idx) => renderMarqueeItem(banner, idx))}
          </div>
        </div>
        {/* Row 2 - scrolls right */}
        <div className="relative w-full overflow-hidden">
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-[120px] bg-gradient-to-r from-white to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-[120px] bg-gradient-to-l from-white to-transparent" />
          <div className="flex w-max animate-scroll-right" dir="ltr">
            {row2Doubled.map((banner, idx) => renderMarqueeItem(banner, idx))}
          </div>
        </div>
      </div>

      {/* Mobile: full-width About Us button at bottom */}
      <LocalizedClientLink
        href="/about-us"
        className="md:hidden group border border-black flex gap-[8px] items-center justify-center px-[20px] py-[20px] rounded-[16px] w-full hover:bg-[#17284a] hover:text-white hover:border-[#17284a] transition-colors"
      >
        <span className="text-black text-[16px] font-medium text-center group-hover:text-white">
          {t("aboutUsCta")}
        </span>
        <ArrowRight className={`w-[20px] h-[20px] text-black group-hover:text-white ${isRTL ? "rotate-180" : ""}`} />
      </LocalizedClientLink>
    </section>
  )
}
