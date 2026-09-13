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
    const sign = direction === "left" ? -1 : 1
    scrollRef.current.scrollBy({
      left: isRTL ? -sign * amount : sign * amount,
      behavior: "smooth",
    })
  }

  return (
    <div className="w-full relative">
      {/* Left arrow - positioned on the outer left side */}
      <button
        onClick={() => scroll("left")}
        className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-[#17284a] flex items-center justify-center p-2 rounded-full hover:opacity-80 transition-opacity hidden lg:flex"
        aria-label="Previous"
      >
        {isRTL ? <ChevronRight size={24} color="white" /> : <ChevronLeft size={24} color="white" />}
      </button>
      {/* Right arrow - positioned on the outer right side */}
      <button
        onClick={() => scroll("right")}
        className="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-[#17284a] flex items-center justify-center p-2 rounded-full hover:opacity-80 transition-opacity hidden lg:flex"
        aria-label="Next"
      >
        {isRTL ? <ChevronLeft size={24} color="white" /> : <ChevronRight size={24} color="white" />}
      </button>
      <div
        ref={scrollRef}
        className="flex gap-4 lg:gap-[clamp(12px,1vw,18px)] items-stretch overflow-x-auto no-scrollbar snap-x snap-mandatory pb-2 lg:px-12"
        dir={isRTL ? "rtl" : "ltr"}
      >
        {milestones.map((m, i) => (
          <div
            key={i}
            className={[
              "bg-white border border-[#e5e7eb] border-solid flex flex-col gap-3 lg:gap-3 min-w-[260px] max-w-[260px] lg:min-w-[clamp(240px,24vw,320px)] lg:max-w-[clamp(240px,24vw,320px)] items-start p-4 lg:p-[clamp(12px,1vw,18px)] relative rounded-xl shrink-0 snap-center",
              m.highlight
                ? "lg:border-[3px] lg:border-[#fdb022] lg:shadow-[0px_4px_8px_rgba(0,0,0,0.12)]"
                : m.faded
                  ? "lg:border-[#ccc] lg:border-dashed lg:opacity-50"
                  : "lg:shadow-[0px_2px_4px_rgba(0,0,0,0.06)]",
            ].join(" ")}
            style={{ minHeight: "clamp(240px,25vw,340px)" }}
          >
            <div className="h-[140px] lg:h-[clamp(80px,16vw,220px)] relative rounded-lg lg:rounded-xl w-full overflow-hidden">
              <img
                alt={m.year}
                src={m.image}
                className="absolute inset-0 w-full h-full object-cover rounded-lg lg:rounded-xl"
              />
            </div>
            <p
              className="font-bold text-[24px] lg:text-[clamp(20px,2.3vw,32px)] text-[#17284a] w-full"
              style={{ fontFamily: "Satoshi, sans-serif", lineHeight: 1.3 }}
            >
              {m.year}
            </p>
            <p
              className="font-bold text-[18px] lg:text-[clamp(14px,1.4vw,20px)] text-[#051026] w-full"
              style={{ fontFamily: "Satoshi, sans-serif" }}
            >
              {isRTL ? m.titleAr : m.title}
            </p>
            <p
              className="text-[#5d5d61] text-[14px] w-full whitespace-pre-line"
              style={{ fontFamily: "Satoshi, sans-serif" }}
            >
              {isRTL ? m.descriptionAr : m.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
