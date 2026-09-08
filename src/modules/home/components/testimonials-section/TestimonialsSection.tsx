"use client"

import { useState, useRef } from "react"
import { useTranslations, useLocale } from "next-intl"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Testimonial } from "@lib/data/testimonials"

type TestimonialsSectionProps = {
  testimonials: Testimonial[]
  locale: string
  dir: string
}

export default function TestimonialsSection({
  testimonials,
  locale,
  dir,
}: TestimonialsSectionProps) {
  const t = useTranslations("home.testimonials")
  const isRTL = locale === "ar"
  const scrollRef = useRef<HTMLDivElement>(null)
  const [currentIndex, setCurrentIndex] = useState(0)

  const scroll = (direction: "prev" | "next") => {
    if (!scrollRef.current) return
    const cardWidth = 608 + 24
    const amount = direction === "prev" ? -cardWidth : cardWidth
    scrollRef.current.scrollBy({
      left: isRTL ? -amount : amount,
      behavior: "smooth",
    })
    setCurrentIndex((prev) => {
      const next = direction === "prev" ? prev - 1 : prev + 1
      return Math.max(0, Math.min(testimonials.length - 1, next))
    })
  }

  return (
    <section
      className="bg-[#f3f1ef] flex flex-col gap-[24px] md:gap-[clamp(30px,4vw,40px)] items-start md:items-center px-[16px] md:px-[clamp(16px,4vw,60px)] py-[24px] md:pt-[3vw] md:pb-[3vw] w-full"
      dir={dir}
    >
      {/* Header - centered on mobile, side-by-side with arrows on desktop */}
      <div className="flex flex-col gap-[8px] md:gap-[clamp(10px,1vw,16px)] items-center text-center w-full md:hidden">
        <p className="font-caveat text-[#17284a] text-[32px] leading-[1.2]">
          {t("eyebrow")}
        </p>
        <h2 className="text-black text-[24px] leading-[1.18] font-medium max-w-[734px]">
          {t("title")}
        </h2>
        <p className="text-black/80 text-[16px] leading-[1.3] max-w-[734px]">
          {t("description")}
        </p>
      </div>

      <div className="hidden md:flex items-end justify-between w-full max-w-[calc(70vw+432px)]">
        <div className="flex flex-col gap-[clamp(10px,1vw,16px)]">
          <div className="flex flex-col gap-[clamp(6px,0.6vw,8px)]">
            <p className="font-caveat text-[#17284a] text-[clamp(28px,2.5vw,40px)] leading-[1.2]">
              {t("eyebrow")}
            </p>
            <h2 className="text-black text-[clamp(24px,2.8vw,40px)] leading-[1.18] font-medium max-w-[734px]">
              {t("title")}
            </h2>
          </div>
          <p className="text-black/80 text-[clamp(14px,1.6vw,24px)] leading-[1.3] max-w-[734px]">
            {t("description")}
          </p>
        </div>

        {/* Desktop: Arrow controls */}
        <div className="flex gap-[clamp(8px,0.8vw,12px)] shrink-0">
          <button
            onClick={() => scroll("prev")}
            className="bg-white border border-[#17284a]/20 flex items-center justify-center p-[clamp(10px,1.2vw,16px)] rounded-[100px] hover:bg-[#17284a] hover:text-white transition-colors"
            aria-label="Previous"
          >
            {isRTL ? <ChevronRight className="w-[clamp(18px,1.5vw,24px)] h-[clamp(18px,1.5vw,24px)] text-[#17284a]" /> : <ChevronLeft className="w-[clamp(18px,1.5vw,24px)] h-[clamp(18px,1.5vw,24px)] text-[#17284a]" />}
          </button>
          <button
            onClick={() => scroll("next")}
            className="bg-[#17284a] flex items-center justify-center p-[clamp(10px,1.2vw,16px)] rounded-[100px] hover:bg-[#17284a]/80 transition-colors"
            aria-label="Next"
          >
            {isRTL ? <ChevronLeft className="w-[clamp(18px,1.5vw,24px)] h-[clamp(18px,1.5vw,24px)] text-white" /> : <ChevronRight className="w-[clamp(18px,1.5vw,24px)] h-[clamp(18px,1.5vw,24px)] text-white" />}
          </button>
        </div>
      </div>

      {/* Testimonial cards */}
      <div
        ref={scrollRef}
        className="flex gap-[16px] md:gap-[clamp(16px,1.8vw,24px)] overflow-x-auto scrollbar-hide w-full max-w-[calc(70vw+432px)]"
        style={{ scrollBehavior: "smooth" }}
      >
        {testimonials.map((testimonial, idx) => {
          const name = locale === "ar" ? testimonial.name_ar : testimonial.name_en
          const quote =
            locale === "ar" ? testimonial.quote_ar : testimonial.quote_en
          const position =
            locale === "ar"
              ? testimonial.position_ar
              : testimonial.position_en

          return (
            <div
              key={testimonial.id || idx}
              className="bg-white flex flex-col gap-[16px] md:gap-[clamp(16px,1.8vw,24px)] min-h-[218px] md:h-[clamp(280px,26vw,368px)] w-[270px] md:w-[clamp(300px,42vw,608px)] shrink-0 rounded-[12px] md:rounded-[20px] md:overflow-hidden border border-[#e5e7eb] shadow-[0px_2px_8px_0px_rgba(0,0,0,0.06)] p-[20px] md:p-[clamp(20px,2.4vw,32px)]"
            >
              {/* Quote mark */}
              <span className="text-[#17284a] text-[40px] md:text-[clamp(40px,4.8vw,64px)] leading-[0.8] font-bold">
                &ldquo;
              </span>

              {/* Quote text */}
              <p className="text-[#17284a] text-[14px] md:text-[clamp(14px,1.5vw,20px)] leading-[1.5] flex-1">
                {quote}
              </p>

              {/* Author */}
              <div className="flex gap-[12px] md:gap-[clamp(10px,1.2vw,16px)] items-center">
                <div className="w-[44px] md:w-[clamp(44px,4.8vw,64px)] h-[44px] md:h-[clamp(44px,4.8vw,64px)] rounded-full overflow-hidden shrink-0">
                  {testimonial.image_url && (
                    <img
                      src={testimonial.image_url}
                      alt={name || ""}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                <div className="flex flex-col gap-[2px]">
                  <p className="text-black text-[14px] md:text-[clamp(14px,1.3vw,18px)] font-bold">{name}</p>
                  <p className="text-[#5d5d61] text-[12px] md:text-[clamp(11px,1vw,14px)]">{position}</p>
                </div>
              </div>
            </div>
          )
        })}
      </div>

    </section>
  )
}
