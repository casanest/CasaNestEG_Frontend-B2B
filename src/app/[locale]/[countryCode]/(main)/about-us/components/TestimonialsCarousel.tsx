"use client"

import { useRef } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import type { Testimonial } from "@lib/data/testimonials"

type Props = {
  testimonials: Testimonial[]
  isRTL: boolean
}

export default function TestimonialsCarousel({ testimonials, isRTL }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null)

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return
    const amount = 286
    scrollRef.current.scrollBy({
      left: direction === "left" ? -amount : amount,
      behavior: "smooth",
    })
  }

  if (!testimonials || testimonials.length === 0) return null

  return (
    <div className="w-full">
      <div
        ref={scrollRef}
        className="flex gap-4 items-start overflow-x-auto no-scrollbar snap-x snap-mandatory pb-2"
        dir={isRTL ? "rtl" : "ltr"}
      >
        {testimonials.map((t) => (
          <div
            key={t.id}
            className="bg-[#f3f4f6] border border-[#e5e7eb] border-solid flex flex-col gap-4 min-w-[270px] max-w-[270px] lg:min-w-[clamp(300px,30vw,410px)] lg:max-w-[clamp(300px,30vw,410px)] items-start justify-between overflow-clip p-5 lg:px-[clamp(18px,1.3vw,20px)] lg:py-[clamp(20px,1.8vw,28px)] relative rounded-xl shrink-0 snap-center"
            style={{ minHeight: "218px" }}
          >
            <div className="flex gap-3 items-center relative w-full">
              <div className="relative rounded-full shrink-0 w-[44px] h-[44px] lg:w-[clamp(60px,6vw,86px)] lg:h-[clamp(60px,6vw,86px)] overflow-hidden">
                {t.image_url ? (
                  <img
                    alt={isRTL ? t.name_ar : t.name_en}
                    src={t.image_url}
                    className="absolute inset-0 w-full h-full object-cover rounded-full"
                  />
                ) : null}
              </div>
              <div className="flex flex-col items-start leading-[1.5]">
                <p
                  className="font-bold text-[#17284a] text-[14px] lg:text-xl w-full"
                  style={{ fontFamily: "Satoshi, sans-serif" }}
                >
                  {isRTL ? t.name_ar : t.name_en}
                </p>
                <p
                  className="text-[#5d5d61] text-[12px] lg:text-base w-full"
                  style={{ fontFamily: "Satoshi, sans-serif" }}
                >
                  {isRTL ? t.position_ar : t.position_en}
                </p>
              </div>
            </div>
            <p
              className="text-[#17284a] text-[14px] lg:text-xl leading-[1.5] w-full"
              style={{ fontFamily: "Satoshi, sans-serif" }}
            >
              &ldquo;{isRTL ? t.quote_ar : t.quote_en}&rdquo;
            </p>
          </div>
        ))}
      </div>
      <div className="hidden lg:flex gap-3 lg:gap-0 items-center justify-center w-full mt-3 lg:mt-6 lg:justify-between">
        <button
          onClick={() => scroll("left")}
          className="bg-[#17284a] flex items-center justify-center p-2 rounded-full hover:opacity-80 transition-opacity"
          aria-label="Previous"
        >
          <ChevronLeft size={24} color="white" />
        </button>
        <button
          onClick={() => scroll("right")}
          className="bg-[#17284a] flex items-center justify-center p-2 rounded-full hover:opacity-80 transition-opacity"
          aria-label="Next"
        >
          <ChevronRight size={24} color="white" />
        </button>
      </div>
    </div>
  )
}
