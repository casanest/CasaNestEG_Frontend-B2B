"use client"

import { useRef } from "react"

import { satoshiStyle, caveatStyle, type Props } from "./styles"

const galleryItems = [
  {
    image: "/about-us/gallery-1.webp",
    label: "Office Fit-Out",
    labelAr: "تجهيز مكتب",
    color: "#17284a",
    textColor: "#fdb022",
    rotate: "-15deg",
    height: "240px",
  },
  {
    image: "/about-us/gallery-2.webp",
    label: "Showroom",
    labelAr: "صالة عرض",
    color: "#ba5c12",
    textColor: "#ffffff",
    rotate: "-7deg",
    height: "252px",
  },
  {
    image: "/about-us/gallery-3.webp",
    label: "IT Setup",
    labelAr: "تجهيز تكنولوجيا",
    color: "#3472d8",
    textColor: "#ffffff",
    rotate: "3deg",
    height: "272px",
  },
  {
    image: "/about-us/gallery-4.webp",
    label: "Installation",
    labelAr: "تركيب",
    color: "#12823b",
    textColor: "#ffffff",
    rotate: "8deg",
    height: "240px",
  },
  {
    image: "/about-us/gallery-5.webp",
    label: "Our Team",
    labelAr: "فريقنا",
    color: "#7c3aed",
    textColor: "#ffffff",
    rotate: "15deg",
    height: "240px",
  },
]

export default function WorkGalleryFan({ isRTL }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null)

  return (
    <section
      className="bg-[#141b34] flex flex-col gap-5 lg:gap-[clamp(24px,4vw,64px)] items-start overflow-clip py-11 lg:py-[clamp(28px,5vw,80px)] relative w-full"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="content-container flex flex-col gap-5 lg:gap-[clamp(24px,4vw,64px)] items-start lg:items-center w-full">
      <div className="flex flex-col gap-1.5 lg:gap-[clamp(8px,0.8vw,12px)] items-start lg:items-center">
        <p className="text-[#fdb022] text-[24px]" style={caveatStyle}>
          {isRTL ? "خلف الكواليس" : "Behind the Scenes"}
        </p>
        <p className="text-white text-[24px] lg:text-[clamp(24px,2.8vw,40px)] lg:text-center" style={{ ...satoshiStyle, fontWeight: 700 }}>
          {isRTL ? "شاهد عملنا في الواقع" : "See Our Work in Action"}
        </p>
        <p className="text-white text-[18px] text-center opacity-70 max-w-[700px] hidden lg:block" style={satoshiStyle}>
          {isRTL
            ? "من صالات العرض إلى الأجنحة التنفيذية — لمحة عن المساحات التي حولناها في جميع أنحاء مصر."
            : "From showroom floors to executive suites — a glimpse into the spaces we've transformed across Egypt."}
        </p>
      </div>
      {/* Mobile: horizontal scroll, no rotation */}
      <div ref={scrollRef} className="flex gap-4 items-start overflow-x-auto no-scrollbar w-full lg:hidden">
        {galleryItems.map((item, i) => (
          <div
            key={i}
            className="bg-white flex flex-col gap-2 p-2 rounded-xl relative shrink-0"
            style={{ width: "220px" }}
          >
            <div className="relative rounded-lg overflow-hidden w-full h-[200px]">
              <img
                alt={item.label}
                src={item.image}
                className="absolute inset-0 w-full h-full object-cover rounded-lg"
              />
            </div>
            <div
              className="absolute flex items-start left-3 top-3 px-[10px] py-1 rounded-md"
              style={{ backgroundColor: item.color }}
            >
              <p className="text-[12px] whitespace-nowrap" style={{ ...satoshiStyle, fontWeight: 700, color: item.textColor }}>
                {isRTL ? item.labelAr : item.label}
              </p>
            </div>
            <p className="text-[#141b34] text-[14px] text-center" style={{ ...satoshiStyle, fontWeight: 500 }}>
              {isRTL ? item.labelAr : item.label}
            </p>
          </div>
        ))}
      </div>
      {/* Desktop: original fan layout */}
      <div className="hidden lg:flex flex-wrap justify-center gap-6 items-center relative w-full max-w-[1020px]">
        {galleryItems.map((item, i) => (
          <div
            key={i}
            className="bg-white drop-shadow-[0px_12px_16px_rgba(0,0,0,0.45)] flex flex-col gap-2 p-2 rounded-xl relative"
            style={{ transform: `rotate(${item.rotate})`, width: "220px", transition: "transform 0.3s ease" }}
          >
            <div className="relative rounded-lg overflow-hidden w-full" style={{ height: item.height }}>
              <img
                alt={item.label}
                src={item.image}
                className="absolute inset-0 w-full h-full object-cover rounded-lg"
              />
            </div>
            <div
              className="absolute flex items-start left-4 top-4 px-[10px] py-1 rounded-md"
              style={{ backgroundColor: item.color }}
            >
              <p className="text-[12px] whitespace-nowrap" style={{ ...satoshiStyle, fontWeight: 700, color: item.textColor }}>
                {isRTL ? item.labelAr : item.label}
              </p>
            </div>
          </div>
        ))}
      </div>
      </div>
    </section>
  )
}
