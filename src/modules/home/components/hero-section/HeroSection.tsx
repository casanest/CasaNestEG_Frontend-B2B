"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { useTranslations, useLocale } from "next-intl"
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react"
import { Banner } from "@lib/data/banners"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

type HeroSectionProps = {
  banners: Banner[]
  locale: string
  dir: string
}

export default function HeroSection({ banners, locale, dir }: HeroSectionProps) {
  const t = useTranslations("home.hero")
  const isRTL = locale === "ar"
  const [currentIndex, setCurrentIndex] = useState(0)
  const [emblaRef, setEmblaRef] = useState<HTMLDivElement | null>(null)

  const slideCount = banners.length || 1

  const scrollPrev = useCallback(() => {
    setCurrentIndex((prev) => {
      const newIdx = prev === 0 ? slideCount - 1 : prev - 1
      if (emblaRef) {
        emblaRef.scrollTo({ left: (isRTL ? -newIdx : newIdx) * emblaRef.clientWidth, behavior: "smooth" })
      }
      return newIdx
    })
  }, [slideCount, emblaRef, isRTL])

  const scrollNext = useCallback(() => {
    setCurrentIndex((prev) => {
      const newIdx = prev === slideCount - 1 ? 0 : prev + 1
      if (emblaRef) {
        emblaRef.scrollTo({ left: (isRTL ? -newIdx : newIdx) * emblaRef.clientWidth, behavior: "smooth" })
      }
      return newIdx
    })
  }, [slideCount, emblaRef, isRTL])

  useEffect(() => {
    if (!emblaRef) return
    const el = emblaRef
    const handleScroll = () => {
      const idx = Math.round(Math.abs(el.scrollLeft) / el.clientWidth)
      setCurrentIndex(idx)
    }
    el.addEventListener("scroll", handleScroll, { passive: true })
    return () => el.removeEventListener("scroll", handleScroll)
  }, [emblaRef])

  const scrollTo = (idx: number) => {
    if (emblaRef) {
      emblaRef.scrollTo({ left: (isRTL ? -idx : idx) * emblaRef.clientWidth, behavior: "smooth" })
    }
    setCurrentIndex(idx)
  }

  const autoplayRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (!emblaRef || slideCount <= 1) return

    autoplayRef.current = setInterval(() => {
      setCurrentIndex((prev) => {
        const newIdx = prev === slideCount - 1 ? 0 : prev + 1
        emblaRef.scrollTo({ left: (isRTL ? -newIdx : newIdx) * emblaRef.clientWidth, behavior: "smooth" })
        return newIdx
      })
    }, 5000)

    return () => {
      if (autoplayRef.current) {
        clearInterval(autoplayRef.current)
      }
    }
  }, [emblaRef, slideCount, isRTL])

  return (
    <section className="relative w-full h-[70svh] min-h-[420px] max-h-[650px] md:h-[clamp(420px,65vw,900px)] overflow-hidden" dir={dir}>
      {/* Background slides */}
      <div
        ref={setEmblaRef}
        className="flex w-full h-full overflow-x-auto scrollbar-hide snap-x snap-mandatory"
        style={{ scrollBehavior: "smooth" }}
      >
        {banners.length > 0 ? (
          banners.map((banner, idx) => (
            <div
              key={banner.id || idx}
              className="relative flex-shrink-0 w-full h-full snap-center"
            >
              <img
                src={banner.image_url}
                alt=""
                className="absolute inset-0 w-full h-full object-cover"
                style={{ transform: isRTL ? "scaleX(-1)" : undefined }}
              />
              <div className="absolute inset-0 bg-black/40 md:bg-black/30" />
            </div>
          ))
        ) : (
          <div className="relative flex-shrink-0 w-full h-full snap-center bg-[#17284a]" />
        )}
      </div>

      {/* Content overlay */}
      <div className="absolute inset-0 flex flex-col justify-end p-[16px] md:p-[clamp(20px,4vw,60px)] pb-[16px] md:pb-[clamp(20px,3vw,40px)]">
        <div className="flex flex-col gap-[16px] md:gap-[clamp(16px,2vw,24px)] max-w-[1392px]">
          {/* Heading */}
          <div className="flex flex-col gap-[8px] md:gap-[clamp(10px,1.2vw,16px)]">
            <h1 className="text-white text-[28px] md:text-[clamp(28px,4.5vw,56px)] leading-[1.1] font-normal">
              {t("titleLine1")}
              <br />
              {t("titleLine2")}
            </h1>
            <p className="text-white/80 text-[16px] md:text-[clamp(14px,1.6vw,20px)] leading-[1.4] max-w-[629px]">
              {t("description")}
            </p>
          </div>

          {/* CTAs - stacked on mobile, side-by-side on desktop */}
          <div className="flex flex-col gap-[12px] md:flex-row md:gap-[clamp(12px,1.5vw,20px)]">
            <LocalizedClientLink
              href="/store"
              className="bg-[#17284a] flex gap-[8px] items-center justify-center px-[20px] md:px-[clamp(20px,2.5vw,36px)] py-[20px] md:py-[clamp(16px,1.6vw,24px)] rounded-[16px] w-full md:w-[clamp(160px,16vw,250px)] hover:bg-[#0f1a2e] transition-colors"
            >
              <span className="text-white text-[16px] md:text-[clamp(13px,1.1vw,16px)] font-medium text-center">
                {t("primaryCta")}
              </span>
              <ArrowRight className="w-[20px] h-[20px] md:w-[clamp(16px,1.3vw,20px)] md:h-[clamp(16px,1.3vw,20px)] text-white" />
            </LocalizedClientLink>
            <LocalizedClientLink
              href="/contact"
              className="bg-[#cdd6e9] flex gap-[8px] items-center justify-center px-[20px] md:px-[clamp(20px,2.5vw,36px)] py-[20px] md:py-[clamp(16px,1.6vw,24px)] rounded-[16px] w-full md:w-[clamp(160px,16vw,250px)] hover:bg-[#cdd6e9]/80 transition-colors"
            >
              <span className="text-[#17284a] text-[16px] md:text-[clamp(13px,1.1vw,16px)] font-medium text-center">
                {t("secondaryCta")}
              </span>
              <ArrowRight className="w-[20px] h-[20px] md:w-[clamp(16px,1.3vw,20px)] md:h-[clamp(16px,1.3vw,20px)] text-[#17284a]" />
            </LocalizedClientLink>
          </div>

          {/* Mobile: arrow controls below CTAs */}
          <div className="flex md:hidden items-center justify-center gap-[12px]">
            <button
              onClick={scrollPrev}
              className="bg-[#17284a] flex items-center justify-center w-[40px] h-[40px] rounded-[100px]"
              aria-label="Previous slide"
            >
              {isRTL ? <ChevronRight className="w-[24px] h-[24px] text-white" /> : <ChevronLeft className="w-[24px] h-[24px] text-white" />}
            </button>
            <button
              onClick={scrollNext}
              className="bg-[#17284a] flex items-center justify-center w-[40px] h-[40px] rounded-[100px]"
              aria-label="Next slide"
            >
              {isRTL ? <ChevronLeft className="w-[24px] h-[24px] text-white" /> : <ChevronRight className="w-[24px] h-[24px] text-white" />}
            </button>
          </div>
        </div>

        {/* Bottom carousel meta - desktop only */}
        <div className="hidden md:flex items-center justify-between w-full mt-[clamp(24px,3vw,40px)]">
          {/* Slide dots */}
          <div className="flex gap-[8px]">
            {Array.from({ length: slideCount }).map((_, idx) => (
              <button
                key={idx}
                onClick={() => scrollTo(idx)}
                className={`h-[clamp(8px,0.8vw,10px)] rounded-full transition-all ${
                  idx === currentIndex
                    ? "w-[clamp(16px,1.8vw,24px)] bg-white"
                    : "w-[clamp(8px,0.8vw,10px)] bg-white/40"
                }`}
                aria-label={`Slide ${idx + 1}`}
              />
            ))}
          </div>

          {/* Slide count */}
          <div className="bg-black/50 border border-white/20 rounded-[100px] px-[clamp(12px,1.2vw,16px)] py-[clamp(4px,0.5vw,6px)]">
            <span className="text-white text-[clamp(11px,1vw,14px)] font-bold">
              {currentIndex + 1} {t("slideOf")} {slideCount}
            </span>
          </div>
        </div>
      </div>

      {/* Desktop: side arrow triggers */}
      <button
        onClick={isRTL ? scrollNext : scrollPrev}
        className="hidden md:absolute md:flex left-[clamp(12px,2.5vw,32px)] top-1/2 -translate-y-1/2 backdrop-blur-[6px] bg-white/15 border border-white/20 rounded-[100px] p-[clamp(10px,1.2vw,16px)] hover:bg-white/25 transition-colors z-10"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-[clamp(18px,1.5vw,24px)] h-[clamp(18px,1.5vw,24px)] text-white" />
      </button>
      <button
        onClick={isRTL ? scrollPrev : scrollNext}
        className="hidden md:absolute md:flex right-[clamp(12px,2.5vw,32px)] top-1/2 -translate-y-1/2 backdrop-blur-[6px] bg-white/15 border border-white/20 rounded-[100px] p-[clamp(10px,1.2vw,16px)] hover:bg-white/25 transition-colors z-10"
        aria-label="Next slide"
      >
        <ChevronRight className="w-[clamp(18px,1.5vw,24px)] h-[clamp(18px,1.5vw,24px)] text-white" />
      </button>
    </section>
  )
}
