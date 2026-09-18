"use client"

import { useTranslations, useLocale } from "next-intl"
import { useRef } from "react"
import { ArrowRight, ChevronLeft, ChevronRight, Package } from "lucide-react"
import { Package as PackageType } from "@lib/data/packages"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

type PreCuratedSolutionsProps = {
  packages: PackageType[]
  locale: string
  dir: string
}

export default function PreCuratedSolutions({
  packages,
  locale,
  dir,
}: PreCuratedSolutionsProps) {
  const t = useTranslations("home.solutions")
  const isRTL = locale === "ar"
  const scrollRef = useRef<HTMLDivElement>(null)

  const scrollByCards = (direction: "left" | "right") => {
    const container = scrollRef.current
    if (!container) return
    const card = container.querySelector("[data-card]")
    const cardWidth = card ? card.getBoundingClientRect().width : 300
    const gap = parseFloat(getComputedStyle(container).gap) || 16
    const scrollAmount = (cardWidth + gap) * 1
    container.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    })
  }

  return (
    <section
      className="bg-white flex flex-col gap-[24px] md:gap-[clamp(30px,4vw,40px)] items-start md:items-center justify-center min-h-[100svh] px-[16px] md:px-[clamp(16px,4vw,60px)] py-[44px] md:py-[clamp(40px,5vw,80px)] w-full"
      dir={dir}
    >
      {/* Header */}
      <div className="flex flex-col gap-[8px] md:gap-[clamp(10px,1vw,16px)] items-center text-center w-full">
        <p className="font-caveat text-[#17284a] text-[32px] md:text-[clamp(28px,2.5vw,40px)] leading-[1.2]">
          {t("eyebrow")}
        </p>
        <h2 className="text-[#17284a] text-[24px] md:text-[clamp(24px,2.8vw,40px)] leading-[1.18] font-medium">
          {t("title")}
        </h2>
        <p className="text-black/80 text-[16px] md:text-[clamp(14px,1.6vw,24px)] leading-[1.3] max-w-[840px] md:line-clamp-2">
          {t("description")}
        </p>
      </div>

      {/* Package cards - horizontal scroll with arrow buttons */}
      <div className="relative w-full">
        {/* Left scroll button */}
        <button
          onClick={() => scrollByCards("left")}
          aria-label="Scroll left"
          className="absolute -left-[clamp(8px,1.5vw,24px)] top-1/2 -translate-y-1/2 z-10 hidden md:flex items-center justify-center w-[clamp(36px,3vw,48px)] h-[clamp(36px,3vw,48px)] rounded-full bg-white border border-[#e5e7eb] shadow-md hover:bg-[#17284a] hover:text-white transition-colors"
        >
          <ChevronLeft className="w-[clamp(18px,1.5vw,24px)] h-[clamp(18px,1.5vw,24px)]" />
        </button>

        {/* Right scroll button */}
        <button
          onClick={() => scrollByCards("right")}
          aria-label="Scroll right"
          className="absolute -right-[clamp(8px,1.5vw,24px)] top-1/2 -translate-y-1/2 z-10 hidden md:flex items-center justify-center w-[clamp(36px,3vw,48px)] h-[clamp(36px,3vw,48px)] rounded-full bg-white border border-[#e5e7eb] shadow-md hover:bg-[#17284a] hover:text-white transition-colors"
        >
          <ChevronRight className="w-[clamp(18px,1.5vw,24px)] h-[clamp(18px,1.5vw,24px)]" />
        </button>

        <div
          ref={scrollRef}
          className="flex gap-[14px] md:gap-[clamp(14px,1.6vw,25px)] overflow-x-auto scrollbar-hide snap-x w-full pb-4 md:px-[clamp(22px,2vw,30px)]"
        >
          {packages.map((pkg, idx) => (
            <PackageCard
              key={pkg.id || idx}
              pkg={pkg}
              locale={locale}
              t={t}
            />
          ))}
        </div>
      </div>

      {/* Explore all button - full width on mobile */}
      <LocalizedClientLink
        href="/pre-curated-solutions"
        className="group border border-black flex gap-[8px] items-center justify-center px-[20px] md:px-[clamp(20px,2.5vw,36px)] py-[20px] md:py-[clamp(16px,1.6vw,24px)] rounded-[16px] w-full md:w-[clamp(160px,16vw,240px)] hover:bg-[#17284a] hover:text-white hover:border-[#17284a] transition-colors"
      >
        <span className="text-black text-[16px] md:text-[clamp(13px,1vw,14px)] font-medium group-hover:text-white">
          {t("exploreAllCta")}
        </span>
        <ArrowRight className={`w-[20px] h-[20px] md:w-[clamp(16px,1.3vw,20px)] md:h-[clamp(16px,1.3vw,20px)] text-black group-hover:text-white ${isRTL ? "rotate-180" : ""}`} />
      </LocalizedClientLink>
    </section>
  )
}

function PackageCard({
  pkg,
  locale,
  t,
}: {
  pkg: PackageType
  locale: string
  t: any
}) {
  const name = locale === "ar" ? pkg.name_ar : pkg.name_en
  const description =
    locale === "ar" ? pkg.description_ar : pkg.description_en

  return (
    <LocalizedClientLink
      href={`/pre-curated-solutions/${pkg.slug}`}
      data-card
      className="bg-white border border-[#e5e7eb] flex flex-col w-[276px] md:w-[clamp(240px,21.5vw,400px)] shrink-0 snap-center overflow-hidden rounded-[11px] md:rounded-[clamp(9px,0.9vw,14px)] shadow-[0px_2px_8px_0px_rgba(0,0,0,0.06)] hover:shadow-[0px_4px_12px_0px_rgba(0,0,0,0.1)] transition-shadow"
    >
      {/* Image on top */}
      <div className="relative w-full h-[178px] md:h-[clamp(162px,13.5vw,234px)] shrink-0">
        {pkg.image_url && (
          <img
            src={pkg.image_url}
            alt={name || ""}
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}
        <div className="absolute bg-[#fdaf22] left-[11px] md:left-[clamp(7px,0.7vw,13px)] top-[11px] md:top-[clamp(7px,0.7vw,13px)] px-[9px] md:px-[clamp(7px,0.6vw,11px)] py-[5px] md:py-[clamp(4px,0.4vw,5px)] rounded-[5px] md:rounded-[clamp(4px,0.5vw,7px)]">
          <span className="text-black text-[10px] md:text-[clamp(8px,0.7vw,12px)] font-bold">
            {t("preCuratedBadge")}
          </span>
        </div>
      </div>

      {/* Content below */}
      <div className="flex flex-col gap-[11px] md:gap-[clamp(9px,0.9vw,14px)] p-[18px] md:p-[clamp(14px,1.4vw,25px)] flex-1">
        <div className="flex flex-col gap-[7px] md:gap-[clamp(5px,0.5vw,11px)]">
          <h3 className="text-[#17284a] text-[16px] md:text-[clamp(14px,1.2vw,20px)] font-medium leading-[1.5] min-h-[49px] md:min-h-[clamp(41px,3.6vw,59px)]">
            {name}
          </h3>
          {description && (
            <p className="text-[#46464a] text-[13px] md:text-[clamp(11px,0.9vw,16px)] font-medium leading-[1.5] line-clamp-2 overflow-hidden">
              {description}
            </p>
          )}
        </div>
        <div className="flex flex-col gap-[11px] md:gap-[clamp(9px,0.9vw,14px)] w-full mt-auto">
          <div className="flex gap-[7px] md:gap-[clamp(5px,0.5vw,9px)] items-center">
            <Package className="w-[16px] h-[16px] md:w-[clamp(14px,1.3vw,22px)] md:h-[clamp(14px,1.3vw,22px)] text-[#17284a]" />
            <span className="text-[#17284a] text-[11px] md:text-[clamp(9px,0.8vw,13px)] font-medium">
              {pkg.item_count || 0} {t("itemsIncluded")}
            </span>
          </div>
          <div className="bg-[#17284a] flex gap-[7px] md:gap-[clamp(5px,0.5vw,9px)] items-center justify-center px-[32px] md:px-[clamp(22px,2.5vw,43px)] py-[14px] md:py-[clamp(11px,1.1vw,18px)] rounded-[11px] md:rounded-[clamp(9px,0.9vw,14px)] w-full cursor-pointer transition-opacity hover:opacity-90">
            <span className="text-white text-[14px] md:text-[clamp(12px,1vw,16px)] font-medium text-center">
              {t("viewPackage")}
            </span>
          </div>
        </div>
      </div>
    </LocalizedClientLink>
  )
}