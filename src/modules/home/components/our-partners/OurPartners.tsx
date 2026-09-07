import { useTranslations } from "next-intl"
import { Banner } from "@lib/data/banners"

type OurPartnersProps = {
  banners: Banner[]
  dir: string
}

export default function OurPartners({ banners, dir }: OurPartnersProps) {
  const t = useTranslations("home.partners")

  const allDoubled = [...banners, ...banners]

  const renderMarqueeItem = (banner: Banner, idx: number) => (
    <div
      key={`${banner.id}-${idx}`}
      className="flex shrink-0 h-[clamp(80px,9vw,130px)] w-[clamp(170px,20vw,280px)] items-center justify-center mx-[clamp(6.5px,0.975vw,13px)]"
    >
      <img
        src={banner.image_url}
        alt=""
        className="max-h-[clamp(80px,9vw,130px)] max-w-[clamp(170px,20vw,280px)] object-contain"
      />
    </div>
  )

  return (
    <section
      className="bg-[#f3f1ef] flex flex-col gap-[24px] md:gap-[clamp(30px,4vw,40px)] items-center justify-center px-[16px] md:px-[clamp(16px,4vw,60px)] py-[44px] md:py-[clamp(40px,5vw,80px)] w-full"
      dir={dir}
    >
      {/* Header */}
      <div className="flex flex-col gap-[8px] md:gap-[clamp(10px,1vw,16px)] items-center text-center w-full">
        <div className="flex flex-col gap-[8px] md:gap-[clamp(6px,0.6vw,8px)] items-center">
          <p className="font-caveat text-[#17284a] text-[32px] md:text-[clamp(28px,2.5vw,40px)] leading-[1.2]">
            {t("eyebrow")}
          </p>
          <h2 className="text-black text-[24px] md:text-[clamp(24px,2.8vw,40px)] leading-[1.18] font-medium max-w-[900px]">
            {t("title")}
          </h2>
        </div>
        <p className="text-black/80 text-[16px] md:text-[clamp(14px,1.6vw,24px)] leading-[1.3] max-w-[734px]">
          {t("description")}
        </p>
      </div>

      {/* Mobile: single infinite auto-scrolling marquee bar */}
      <div className="md:hidden relative w-full overflow-hidden">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-[40px] bg-gradient-to-r from-[#f3f1ef] to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-[40px] bg-gradient-to-l from-[#f3f1ef] to-transparent" />
        <div className="flex w-max animate-scroll-left" dir="ltr">
          {allDoubled.map((banner, idx) => (
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

      {/* Desktop: single infinite auto-scrolling marquee bar */}
      <div className="hidden md:flex flex-col w-full mt-[clamp(24px,3vw,48px)]">
        <div className="relative w-full overflow-hidden">
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-[120px] bg-gradient-to-r from-[#f3f1ef] to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-[120px] bg-gradient-to-l from-[#f3f1ef] to-transparent" />
          <div className="flex w-max animate-scroll-left" dir="ltr">
            {allDoubled.map((banner, idx) => renderMarqueeItem(banner, idx))}
          </div>
        </div>
      </div>
    </section>
  )
}
