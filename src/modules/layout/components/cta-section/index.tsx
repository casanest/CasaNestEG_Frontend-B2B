import Image from "next/image"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

type CtaSectionProps = {
  locale: string
}

export default async function CtaSection({ locale }: CtaSectionProps) {
  const isRTL = locale === "ar"

  const features = isRTL
    ? ["مربح", "موثوق", "قابل للتخصيص"]
    : ["Profitable", "Reliable", "Customizable"]

  return (
    <section
      className="w-full max-w-[1280px] mx-auto px-4 py-[clamp(2.5rem,2rem+2vw,4rem)] overflow-visible"
      dir={isRTL ? "rtl" : "ltr"}
    >
      {/* Main Card Container — fills its (already fluid) parent, no scale/translate hacks */}
      <div className="w-full bg-[#181A20] text-white rounded-[clamp(1.5rem,1.2rem+1.5vw,2.5rem)] relative overflow-visible shadow-2xl lg:translate-x-[10%] lg:[zoom:1.1] lg:origin-top-left">

        {/* Desktop Image (Overflows top, bottom, and left/right based on locale) */}
        <div
          className="hidden lg:block absolute top-[-6%] bottom-[-5%] w-[clamp(48%,calc(48%+2vw),58%)] pointer-events-none z-10 left-[-4%]"
        >
          <Image
            src="/desktop.webp"
            alt="Interior Chair Arrangement"
            fill
            className="object-contain scale-150 origin-bottom translate-x-[-10%] object-left-bottom"
            priority
            sizes="55vw"
          />
        </div>

        {/* Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-[clamp(1.25rem,1rem+1.5vw,2rem)] items-center p-[clamp(1.5rem,1rem+3vw,3.5rem)] lg:[direction:ltr]">

          {/* Column Spacer for Desktop Image */}
          <div className="hidden lg:block lg:col-span-7 xl:col-span-7" />

          {/* Text & Action Area */}
          <div className={`lg:col-span-5 xl:col-span-5 flex flex-col items-start z-20 ${
            isRTL ? "text-right" : "text-left"
          }`}>

            {/* Accent Kicker */}
            <span className="text-slate-200 font-serif italic text-[clamp(1rem,0.9rem+0.5vw,1.25rem)] tracking-wide mb-3">
              {isRTL ? "جاهز للبدء؟" : "Ready to Get Started?"}
            </span>

            {/* Main Title */}
            <h2 className="text-[clamp(1.75rem,1.4rem+2.2vw,2.875rem)] font-bold leading-[1.15] text-white tracking-tight mb-4">
              {isRTL ? (
                <>
                  لديك مساحة لبنائها؟
                  <br />
                  دعنا نتحدث.
                </>
              ) : (
                <>
                  <span className="block lg:inline">Have a Space </span>
                  <span className="block lg:inline">to Build?</span>
                  <br />
                  Let's Talk.
                </>
              )}
            </h2>

            {/* Subtitle */}
            <p className="text-slate-300/80 text-[clamp(0.875rem,0.8rem+0.35vw,1rem)] leading-relaxed max-w-xs sm:max-w-md mb-6">
              {isRTL
                ? "كازانيست جاهزة لمساعدتك في تحويل متطلباتك إلى حل عملي."
                : "Casanest is ready to help turn your requirements into a practical solution."}
            </p>

            {/* Feature Checkmarks */}
            <div className={`flex flex-wrap items-center gap-[clamp(1rem,0.8rem+0.8vw,1.5rem)] text-slate-100 text-[clamp(0.8rem,0.75rem+0.25vw,0.95rem)] font-medium mb-8 lg:justify-start ${
              isRTL ? "justify-end" : "justify-start"
            }`}>
              {features.map((label) => (
                <div key={label} className="flex items-center gap-2">
                  <span className="text-white text-base font-bold">✓</span>
                  <span>{label}</span>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className={`w-full sm:w-auto flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 lg:justify-start ${
              isRTL ? "sm:justify-end" : "sm:justify-start"
            }`}>
              <LocalizedClientLink
                href="/store"
                className="px-[clamp(1.25rem,1rem+1.2vw,1.75rem)] py-[clamp(0.65rem,0.5rem+0.6vw,0.875rem)] bg-[#D2DAE8] hover:bg-[#c3cddf] text-[#181A20] font-semibold text-center text-[clamp(0.95rem,0.9rem+0.25vw,1.05rem)] rounded-2xl transition-colors duration-200 shadow-sm whitespace-nowrap flex items-center justify-center gap-2"
              >
                <span>{isRTL ? "اكتشف منتجاتنا" : "Discover Our Products"}</span>
              </LocalizedClientLink>

              <LocalizedClientLink
                href="/contact"
                className="px-[clamp(1.25rem,1rem+1.2vw,1.75rem)] py-[clamp(0.65rem,0.5rem+0.6vw,0.875rem)] bg-transparent border border-slate-500/70 hover:border-slate-300 hover:bg-white/5 text-white font-medium text-center text-[clamp(0.95rem,0.9rem+0.25vw,1.05rem)] rounded-2xl transition-colors duration-200 flex items-center justify-center gap-2.5 whitespace-nowrap"
              >
                <span>{isRTL ? "تواصل مع احد ممثلينا" : "Schedule a Call"}</span>
              </LocalizedClientLink>
            </div>

          </div>
        </div>

        {/* Mobile Image (Positioned at bottom, overflowing lower edge) */}
        <div className="block lg:hidden w-full relative h-[clamp(280px,55vw,420px)] overflow-visible [clip-path:inset(-50%_0_0_0_round_0_0_32px_32px)] mt-2">
          <Image
            src="/mobile.webp"
            alt="Interior Chair Arrangement"
            fill
            className="object-cover object-bottom scale-[1.15] origin-bottom"
            sizes="100vw"
            priority
          />
        </div>

      </div>
    </section>
  )
}