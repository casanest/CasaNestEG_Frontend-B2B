import { useTranslations } from "next-intl"
import { Banner } from "@lib/data/banners"

type OurPartnersProps = {
  banners: Banner[]
  dir: string
}

export default function OurPartners({ banners, dir }: OurPartnersProps) {
  const t = useTranslations("home.partners")

  return (
    <section
      className="bg-[#f3f1ef] flex flex-col gap-[24px] md:gap-[clamp(30px,4vw,40px)] items-center justify-center px-[16px] md:px-[clamp(16px,4vw,60px)] py-[44px] md:py-[clamp(40px,5vw,80px)] w-full"
      dir={dir}
    >
      {/* Header */}
      <div className="flex flex-col gap-[8px] md:gap-[clamp(10px,1vw,16px)] items-center text-center w-full">
        <div className="flex flex-col gap-[8px] md:gap-[clamp(6px,0.6vw,8px)] items-center">
          <p className="font-caveat text-[#17284a] text-[24px] md:text-[clamp(16px,1.5vw,24px)] leading-[1.2]">
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

      {/* Logos - single scrollable row on mobile, marquee on desktop */}
      <div className="md:hidden relative w-full overflow-hidden">
        <div className="flex gap-[16px] items-center overflow-x-auto scrollbar-hide snap-x pb-2">
          {banners.map((banner, idx) => (
            <div
              key={banner.id || idx}
              className="bg-white flex h-[72px] w-[130px] shrink-0 items-center justify-center rounded-[12px] snap-center"
            >
              <img
                src={banner.image_url}
                alt=""
                className="max-h-[44px] max-w-[100px] object-contain"
              />
            </div>
          ))}
        </div>
        {/* Fade edges */}
        <div className="absolute right-0 top-0 h-full w-[40px] bg-gradient-to-l from-[#f3f1ef] to-transparent pointer-events-none" />
        <div className="absolute left-0 top-0 h-full w-[40px] bg-gradient-to-r from-[#f3f1ef] to-transparent pointer-events-none" />
      </div>
      <div className="hidden md:block relative w-full max-w-[1298px] overflow-hidden">
        <div className="flex gap-[clamp(20px,4vw,56px)] items-center justify-center flex-wrap">
          {banners.map((banner, idx) => (
            <div
              key={banner.id || idx}
              className="h-[clamp(60px,7vw,100px)] w-[clamp(130px,16vw,220px)] shrink-0 flex items-center justify-center"
            >
              <img
                src={banner.image_url}
                alt=""
                className="max-h-[clamp(60px,7vw,100px)] max-w-[clamp(130px,16vw,220px)] object-contain"
              />
            </div>
          ))}
        </div>
        {/* Fade edges */}
        <div className="absolute right-0 top-0 h-full w-[clamp(60px,8vw,112px)] bg-gradient-to-l from-[#f3f1ef] to-transparent pointer-events-none" />
        <div className="absolute left-0 top-0 h-full w-[clamp(60px,8vw,112px)] bg-gradient-to-r from-[#f3f1ef] to-transparent pointer-events-none" />
      </div>
    </section>
  )
}
