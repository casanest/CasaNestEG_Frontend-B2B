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

  return (
    <section
      className="bg-white flex flex-col gap-[24px] md:gap-[clamp(30px,4vw,60px)] items-start md:items-center justify-center px-[16px] md:px-[clamp(16px,4vw,60px)] py-[44px] md:py-[clamp(40px,5vw,80px)] w-full"
      dir={dir}
    >
      {/* Header */}
      <div className="flex items-end justify-between w-full max-w-[1392px]">
        <div className="flex flex-col gap-[8px] md:gap-[clamp(10px,1vw,16px)]">
          <div className="flex flex-col gap-[8px] md:gap-[clamp(6px,0.6vw,8px)]">
            <p className="font-caveat text-[#17284a] text-[24px] md:text-[clamp(16px,1.5vw,24px)] leading-[1.2]">
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
          className="hidden md:flex border border-black gap-[8px] items-center justify-center px-[clamp(20px,2.5vw,36px)] py-[clamp(16px,1.6vw,24px)] rounded-[16px] w-[clamp(160px,16vw,240px)] hover:bg-black hover:text-white transition-colors shrink-0"
        >
          <span className="text-black text-[clamp(13px,1.1vw,16px)] font-medium text-center group-hover:text-white">
            {t("aboutUsCta")}
          </span>
          <ArrowRight className="w-[clamp(16px,1.3vw,20px)] h-[clamp(16px,1.3vw,20px)] text-black group-hover:text-white" />
        </LocalizedClientLink>
      </div>

      {/* Logo grid - 2-col grid on mobile, 5-per-row on desktop */}
      <div className="grid grid-cols-2 gap-[12px] md:hidden w-full max-w-[1392px]">
        {banners.map((banner, idx) => (
          <div
            key={banner.id || idx}
            className="bg-[#f3f1ef] flex h-[72px] items-center justify-center rounded-[12px] min-w-0"
          >
            <img
              src={banner.image_url}
              alt=""
              className="max-h-[44px] max-w-[100px] object-contain"
            />
          </div>
        ))}
      </div>
      <div className="hidden md:flex flex-col gap-[clamp(20px,3vw,40px)] w-full max-w-[1392px]">
        {row1.length > 0 && (
          <div className="flex gap-[clamp(10px,1.5vw,20px)] w-full">
            {row1.map((banner, idx) => (
              <div
                key={banner.id || idx}
                className="bg-[#f3f1ef] flex flex-1 h-[clamp(80px,9vw,140px)] items-center justify-center rounded-[12px] min-w-0"
              >
                <img
                  src={banner.image_url}
                  alt=""
                  className="max-h-[clamp(50px,6.5vw,100px)] max-w-[clamp(120px,16vw,220px)] object-contain"
                />
              </div>
            ))}
          </div>
        )}
        {row2.length > 0 && (
          <div className="flex gap-[clamp(10px,1.5vw,20px)] w-full">
            {row2.map((banner, idx) => (
              <div
                key={banner.id || idx}
                className="bg-[#f3f1ef] flex flex-1 h-[clamp(80px,9vw,140px)] items-center justify-center rounded-[12px] min-w-0"
              >
                <img
                  src={banner.image_url}
                  alt=""
                  className="max-h-[clamp(50px,6.5vw,100px)] max-w-[clamp(120px,16vw,220px)] object-contain"
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Mobile: full-width About Us button at bottom */}
      <LocalizedClientLink
        href="/about-us"
        className="md:hidden border border-black flex gap-[8px] items-center justify-center px-[20px] py-[20px] rounded-[16px] w-full hover:bg-black hover:text-white transition-colors"
      >
        <span className="text-black text-[16px] font-medium text-center">
          {t("aboutUsCta")}
        </span>
        <ArrowRight className="w-[20px] h-[20px] text-black" />
      </LocalizedClientLink>
    </section>
  )
}
