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
    rotate: -15,
    cardWidth: 220,
    cardHeight: 290,
    imageHeight: 240,
    left: 0,
    top: 3.06,
    shadow: "0px 12px 32px rgba(0,0,0,0.45)",
    badgeLeft: 19.6,
    badgeTop: 43.15,
  },
  {
    image: "/about-us/gallery-2.webp",
    label: "Showroom",
    labelAr: "صالة عرض",
    color: "#ba5c12",
    textColor: "#ffffff",
    rotate: -7,
    cardWidth: 220,
    cardHeight: 300,
    imageHeight: 252,
    left: 190,
    top: -6.81,
    shadow: "0px 12px 32px rgba(0,0,0,0.4)",
    badgeLeft: 17.83,
    badgeTop: 30.87,
  },
  {
    image: "/about-us/gallery-3.webp",
    label: "IT Setup",
    labelAr: "تجهيز تكنولوجيا",
    color: "#3472d8",
    textColor: "#ffffff",
    rotate: 3,
    cardWidth: 240,
    cardHeight: 320,
    imageHeight: 272,
    left: 373.25,
    top: 0,
    shadow: "0px 16px 40px rgba(0,0,0,0.5)",
    badgeLeft: 30.53,
    badgeTop: 16.82,
  },
  {
    image: "/about-us/gallery-4.webp",
    label: "Installation",
    labelAr: "تركيب",
    color: "#12823b",
    textColor: "#ffffff",
    rotate: 8,
    cardWidth: 220,
    cardHeight: 295,
    imageHeight: 247,
    left: 566.94,
    top: 25,
    shadow: "0px 12px 32px rgba(0,0,0,0.4)",
    badgeLeft: 51.05,
    badgeTop: 18.07,
  },
  {
    image: "/about-us/gallery-5.webp",
    label: "Our Team",
    labelAr: "فريقنا",
    color: "#7c3aed",
    textColor: "#ffffff",
    rotate: 15,
    cardWidth: 220,
    cardHeight: 285,
    imageHeight: 237,
    left: 736.24,
    top: 65,
    shadow: "0px 12px 32px rgba(0,0,0,0.4)",
    badgeLeft: 78.35,
    badgeTop: 19.6,
  },
]

export default function WorkGalleryFan({ isRTL }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null)

  return (
    <section
      className="bg-[#141b34] flex flex-col gap-5 lg:gap-[clamp(16px,2vw,32px)] items-center overflow-clip py-11 lg:pt-[3vw] lg:pb-0 relative w-full"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="content-container flex flex-col gap-5 lg:gap-[clamp(16px,2vw,32px)] items-center w-full">
      <div className="flex flex-col gap-1.5 lg:gap-[clamp(8px,0.8vw,12px)] items-start lg:items-center">
        <p className="text-[#fdb022] text-[32px] lg:text-[clamp(28px,2.5vw,40px)]" style={caveatStyle}>
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
      {/* Desktop: Figma-spec angled cards in absolute positions */}
      <div className="hidden lg:block relative w-full max-w-[1020px] mx-auto" style={{ height: "405px" }}>
        {galleryItems.map((item, i) => (
          <div
            key={i}
            className="bg-white flex flex-col gap-2 p-2 rounded-xl absolute"
            style={{
              transform: `rotate(${item.rotate}deg)`,
              width: `${item.cardWidth}px`,
              height: `${item.cardHeight}px`,
              left: `${item.left}px`,
              top: `${item.top}px`,
              boxShadow: item.shadow,
              transition: "transform 0.3s ease",
            }}
          >
            <div className="relative rounded-lg overflow-hidden w-full" style={{ height: `${item.imageHeight}px` }}>
              <img
                alt={item.label}
                src={item.image}
                className="absolute inset-0 w-full h-full object-cover rounded-lg"
              />
            </div>
            <div
              className="absolute flex items-center px-[10px] py-[4px] rounded-md"
              style={{
                backgroundColor: item.color,
                left: `${item.badgeLeft}px`,
                top: `${item.badgeTop}px`,
                transform: `rotate(${item.rotate}deg)`,
              }}
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
