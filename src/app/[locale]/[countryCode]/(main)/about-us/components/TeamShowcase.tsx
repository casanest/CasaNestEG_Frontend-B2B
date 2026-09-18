"use client"

import { useRef } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { satoshiStyle, type Props } from "./styles"

const teamMembers = [
  {
    image: "/founder.webp",
    name: "Eng. Mahmoud Taha El-Gahed",
    nameAr: "م/ محمود طه الجاحد",
    role: "CEO",
    roleAr: "المدير التنفيذي",
  },
  {
    image: "/production-manager.webp",
    name: "Eng. Bassem Essam",
    nameAr: "م/ باسم عصام",
    role: "Production and Quality Manager",
    roleAr: "مدير الإنتاج والجوده",
  },
  {
    image: "/project-manager.webp",
    name: "Eng. Mohamed El-Gahed",
    nameAr: "م/ محمد الجاحد",
    role: "Project Manager",
    roleAr: "مدير المشروع",
  },
  {
    image: "/public-relations.webp",
    name: "Eng. Tarek El-Dahabi",
    nameAr: "م/ طارق الذهبي",
    role: "Managing Director",
    roleAr: "عضو منتدب",
  },
  {
    image: "/parteners-relation.webp",
    name: "Eng. Adel Qadous",
    nameAr: "م/ عادل قادوس",
    role: "Systems and Information Expert",
    roleAr: "خبير النظم والمعلومات",
  },
]

export default function TeamShowcase({ isRTL }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null)

  const scroll = (direction: "left" | "right") => {
    const el = scrollRef.current
    if (!el) return
    const amount = el.clientWidth * 0.8
    el.scrollBy({ left: direction === "right" ? amount : -amount, behavior: "smooth" })
  }

  return (
    <section
      className="bg-[#faf8f5] flex flex-col gap-6 lg:gap-[clamp(24px,3.5vw,48px)] items-start py-11 lg:pt-[3vw] lg:pb-[3vw] relative w-full"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="content-container flex flex-col gap-6 lg:gap-[clamp(32px,5vw,72px)] items-start w-full">
      <div className="flex flex-col gap-2 lg:gap-[clamp(8px,0.8vw,12px)] items-start">
        <h2 className="text-[#17284a] text-[24px] lg:text-[clamp(24px,2.8vw,40px)]" style={{ ...satoshiStyle, fontWeight: 700 }}>
          {isRTL ? "تعرّف على قيادتنا" : "Meet Our Leadership"}
        </h2>
        <p className="text-[#707176] text-[14px] lg:text-[clamp(13px,1.3vw,18px)]" style={satoshiStyle}>
          {isRTL
            ? "خبراء الشراء والمهندسون والمحترفون التقنيون الذين يقودون أقسامنا."
            : "The procurement experts, architects, and technical professionals leading our divisions."}
        </p>
      </div>
      <div className="relative w-full">
        <button
          type="button"
          onClick={() => scroll("left")}
          aria-label={isRTL ? "تمرير لليسار" : "Scroll left"}
          className="absolute left-[calc(50%_-_50vw_+_1rem)] top-1/2 -translate-y-1/4 z-10 bg-white rounded-full shadow-md p-3 lg:p-4 text-[#17284a] hover:bg-gray-50 transition-colors"
        >
          <ChevronLeft size={30} />
        </button>
        <button
          type="button"
          onClick={() => scroll("right")}
          aria-label={isRTL ? "تمرير لليمين" : "Scroll right"}
          className="absolute right-[calc(50%_-_50vw_+_1rem)] top-1/2 -translate-y-1/4 z-10 bg-white rounded-full shadow-md p-3 lg:p-4 text-[#17284a] hover:bg-gray-50 transition-colors"
        >
          <ChevronRight size={30} />
        </button>
      <div ref={scrollRef} className="flex flex-row gap-4 lg:gap-[2vw] items-start w-full overflow-x-auto snap-x snap-mandatory scrollbar-hide scroll-smooth">
        {teamMembers.map((member, i) => (
          <div
            key={i}
            className="flex flex-col gap-2 h-[560px] items-start relative shrink-0 snap-start w-[85vw] sm:w-[340px] lg:w-[clamp(300px,30vw,435px)]"
          >
            <div className="h-[560px] relative rounded-xl w-full overflow-hidden">
              <img
                alt={member.name}
                src={member.image}
                className="absolute inset-0 w-full h-full object-cover rounded-xl"
              />
            </div>
            <div className="absolute bg-white bottom-3 left-[3%] right-[3%] lg:left-1/2 lg:right-auto lg:-translate-x-1/2 flex flex-col gap-1 items-start px-4 py-3 rounded-xl lg:w-[clamp(300px,30vw,410px)] lg:max-w-[calc(100%-20px)]">
              <p className="text-[#17284a] text-[20px]" style={{ ...satoshiStyle, fontWeight: 700 }}>
                {isRTL ? member.nameAr : member.name}
              </p>
              <p className="text-[#707176] text-[16px]" style={satoshiStyle}>
                {isRTL ? member.roleAr : member.role}
              </p>
            </div>
          </div>
        ))}
      </div>
      </div>
      </div>
    </section>
  )
}
