"use client"

import { useRef } from "react"
import { useTranslations } from "next-intl"
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import ProductPreview from "@modules/products/components/product-preview"

type AmenitiesProps = {
  products: HttpTypes.StoreProduct[]
  locale: string
  dir: string
  region: HttpTypes.StoreRegion
}

export default function Amenities({ products, locale, dir, region }: AmenitiesProps) {
  const t = useTranslations("home.amenities")
  const isRTL = locale === "ar"
  const scrollRef = useRef<HTMLDivElement>(null)

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return
    const amount = 340
    const effectiveAmount = direction === "left" ? -amount : amount
    scrollRef.current.scrollBy({
      left: isRTL ? -effectiveAmount : effectiveAmount,
      behavior: "smooth",
    })
  }

  return (
    <section
      className="bg-[#f3f1ef] flex flex-col gap-[24px] md:gap-[clamp(30px,4vw,40px)] items-start md:items-center justify-center min-h-[80svh] px-[16px] md:px-[clamp(16px,4vw,60px)] py-[44px] md:py-[clamp(40px,5vw,80px)] w-full"
      dir={dir}
    >
      {/* Header */}
      <div className="flex items-end justify-between w-full max-w-[calc(70vw+432px)]">
        <div className="flex flex-col gap-[8px] md:gap-[clamp(10px,1vw,16px)]">
          <div className="flex flex-col items-start">
            <div className="bg-[#141b34] flex items-center justify-center px-[12px] md:px-[clamp(10px,1.2vw,16px)] py-[4px] md:py-[clamp(3px,0.3vw,4px)] rounded-[100px] -rotate-2 mb-[-9px]">
              <span className="text-white text-[12px] md:text-[clamp(12px,1.1vw,16px)] font-medium whitespace-nowrap">
                {t("badge")}
              </span>
            </div>
            <h2 className="text-black text-[24px] md:text-[clamp(24px,2.8vw,40px)] leading-[1.18] font-medium mt-[8px]">
              {t("title")}
            </h2>
          </div>
          <p className="text-black/80 text-[16px] md:text-[clamp(14px,1.6vw,24px)] leading-[1.3] max-w-[734px] md:max-w-[1200px]">
            {t("description")}
          </p>
        </div>
        {/* Desktop: Explore All button in header */}
        <LocalizedClientLink
          href="/store"
          className="hidden md:flex group border border-black gap-[8px] items-center justify-center px-[clamp(20px,2.5vw,36px)] py-[clamp(16px,1.6vw,24px)] rounded-[16px] w-[clamp(160px,16vw,240px)] hover:bg-[#17284a] hover:text-white hover:border-[#17284a] transition-colors shrink-0"
        >
          <span className="text-black text-[clamp(13px,1vw,14px)] font-medium group-hover:text-white">
            {t("exploreAllCta")}
          </span>
          <ArrowRight className="w-[clamp(16px,1.3vw,20px)] h-[clamp(16px,1.3vw,20px)] text-black group-hover:text-white" />
        </LocalizedClientLink>
      </div>

      {/* Product cards with horizontal scroll */}
      <div className="relative w-full max-w-[calc(70vw+432px)]">
        <div
          ref={scrollRef}
          className="flex gap-[12px] md:gap-[clamp(12px,1.5vw,20px)] overflow-x-auto scrollbar-hide snap-x pb-4"
          style={{ scrollBehavior: "smooth" }}
        >
          {products.map((product, idx) => (
            <div
              key={product.id || idx}
              className="w-[284px] md:w-[clamp(240px,22vw,320px)] shrink-0 snap-center"
            >
              <ProductPreview product={product} region={region} locale={locale} />
            </div>
          ))}
        </div>

        {/* Desktop: Scroll arrows */}
        <button
          onClick={() => scroll(isRTL ? "right" : "left")}
          className="hidden md:flex absolute top-1/2 -translate-y-1/2 -left-[clamp(12px,1.5vw,20px)] bg-[#17284a]/40 items-center justify-center p-[clamp(8px,1vw,12px)] rounded-[100px] hover:bg-[#17284a]/60 transition-colors z-10"
          aria-label="Scroll left"
        >
          <ChevronLeft className="w-[clamp(18px,1.5vw,24px)] h-[clamp(18px,1.5vw,24px)] text-white" />
        </button>
        <button
          onClick={() => scroll(isRTL ? "left" : "right")}
          className="hidden md:flex absolute top-1/2 -translate-y-1/2 -right-[clamp(12px,1.5vw,20px)] bg-[#17284a] items-center justify-center p-[clamp(8px,1vw,12px)] rounded-[100px] hover:bg-[#17284a]/80 transition-colors z-10"
          aria-label="Scroll right"
        >
          <ChevronRight className="w-[clamp(18px,1.5vw,24px)] h-[clamp(18px,1.5vw,24px)] text-white" />
        </button>
      </div>

      {/* Mobile: full-width Explore All button at bottom */}
      <LocalizedClientLink
        href="/store"
        className="md:hidden group border border-black flex gap-[8px] items-center justify-center px-[20px] py-[20px] rounded-[16px] w-full hover:bg-[#17284a] hover:text-white hover:border-[#17284a] transition-colors"
      >
        <span className="text-black text-[16px] font-medium group-hover:text-white">
          {t("exploreAllCta")}
        </span>
        <ArrowRight className="w-[20px] h-[20px] text-black group-hover:text-white" />
      </LocalizedClientLink>
    </section>
  )
}
