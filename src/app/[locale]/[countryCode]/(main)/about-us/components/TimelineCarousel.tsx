"use client"

import { useRef } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

type Milestone = {
  year: string
  title: string
  titleAr: string
  description: string
  descriptionAr: string
  image: string
  highlight?: boolean
  faded?: boolean
}

type Props = {
  milestones: Milestone[]
  isRTL: boolean
}

export default function TimelineCarousel({ milestones, isRTL }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null)

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return
    const amount = 276
    scrollRef.current.scrollBy({
      left: direction === "left" ? -amount : amount,
      behavior: "smooth",
    })
  }

  return (
    <div className="w-full">
      <div
        ref={scrollRef}
        className="flex gap-4 lg:gap-6 items-start overflow-x-auto no-scrollbar snap-x snap-mandatory pb-2"
        dir={isRTL ? "rtl" : "ltr"}
      >
        {milestones.map((m, i) => (
          <div
            key={i}
            className={[
              "bg-white border border-[#e5e7eb] border-solid flex flex-col gap-3 lg:gap-4 min-w-[260px] max-w-[260px] lg:min-w-[380px] lg:max-w-[380px] items-start p-4 lg:p-6 relative rounded-xl shrink-0 snap-center",
              m.highlight
                ? "lg:border-[3px] lg:border-[#fdb022] lg:shadow-[0px_4px_8px_rgba(0,0,0,0.12)]"
                : m.faded
                  ? "lg:border-[#ccc] lg:border-dashed lg:opacity-50"
                  : "lg:shadow-[0px_2px_4px_rgba(0,0,0,0.06)]",
            ].join(" ")}
            style={{ minHeight: "340px" }}
          >
            <div className="h-[140px] lg:h-[300px] relative rounded-lg lg:rounded-xl w-full overflow-hidden">
              <img
                alt={m.year}
                src={m.image}
                className="absolute inset-0 w-full h-full object-cover rounded-lg lg:rounded-xl"
              />
            </div>
            <p
              className="font-bold text-[24px] lg:text-[32px] text-[#17284a] w-full"
              style={{ fontFamily: "Satoshi, sans-serif", lineHeight: 1.3 }}
            >
              {m.year}
            </p>
            <p
              className="font-bold text-[18px] lg:text-[20px] text-[#051026] w-full"
              style={{ fontFamily: "Satoshi, sans-serif" }}
            >
              {isRTL ? m.titleAr : m.title}
            </p>
            <p
              className="text-[#5d5d61] text-[14px] w-full"
              style={{ fontFamily: "Satoshi, sans-serif" }}
            >
              {isRTL ? m.descriptionAr : m.description}
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
