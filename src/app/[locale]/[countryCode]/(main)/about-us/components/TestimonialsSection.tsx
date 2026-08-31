import { satoshiStyle, caveatStyle, type Props } from "./styles"
import TestimonialsCarousel from "./TestimonialsCarousel"
import type { Testimonial } from "@lib/data/testimonials"

type OwnProps = Props & {
  testimonials: Testimonial[]
}

export default function TestimonialsSection({ isRTL, testimonials }: OwnProps) {
  if (!testimonials || testimonials.length === 0) return null

  return (
    <section
      className="bg-white flex flex-col gap-6 lg:gap-10 items-center py-11 lg:py-20 relative w-full"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="content-container flex flex-col gap-6 lg:gap-10 items-center w-full">
      <div className="flex flex-col gap-2 lg:gap-3 items-center text-center w-full">
        <p className="text-black text-[24px]" style={caveatStyle}>
          {isRTL ? "آراء العملاء" : "Testimonials"}
        </p>
        <h2 className="text-[#17284a] text-[24px] lg:text-[40px] lg:text-[48px]" style={{ ...satoshiStyle, fontWeight: 700 }}>
          {isRTL ? "ماذا يقول عملاؤنا" : "What Our Clients Say"}
        </h2>
        <p className="text-[#17284a] text-[16px] lg:text-[20px] max-w-[672px] opacity-80" style={satoshiStyle}>
          {isRTL
            ? "موثوق به من قبل الشركات الرائدة في جميع أنحاء مصر."
            : "Trusted by leading businesses across Egypt."}
        </p>
      </div>
      <TestimonialsCarousel testimonials={testimonials} isRTL={isRTL} />
      </div>
    </section>
  )
}
