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
      className="w-full lg:max-w-[74.66vw] mx-auto px-4 py-[clamp(2.5rem,2rem+2vw,4rem)] lg:py-[5vw] overflow-visible lg:translate-x-[5vw]"
      dir={isRTL ? "rtl" : "ltr"}
    >
      {/* Main Card Container — mobile matches the original code; desktop keeps the enlarged sizing via lg: overrides, no scale/zoom transform */}
      <div className="w-full bg-[#181A20] text-white rounded-[clamp(1.5rem,1.2rem+1.5vw,2.5rem)] lg:rounded-[3.125vw] relative overflow-visible shadow-2xl lg:translate-y-[-10%]">

        {/* Desktop Image (desktop-only — untouched by the mobile revert) */}
        <div
          className="hidden lg:block absolute top-[-3.75%] bottom-[-12.5%] left-[-6.25%] w-[50vw] pointer-events-none z-10"
        >
          <Image
            src="/desktop.webp"
            alt="Interior Chair Arrangement"
            fill
            className="object-contain scale-[1.25] origin-bottom translate-x-[-6%] translate-y-[-6%] object-left-bottom"
            priority
            sizes="75vw"
          />
        </div>

        {/* Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-[clamp(1.25rem,1rem+1.5vw,2rem)] lg:gap-[2.5vw] items-center p-[clamp(1.5rem,1rem+3vw,3.5rem)] lg:px-[4.375vw] lg:py-[5.6875vw] lg:[direction:ltr]">

          {/* Column Spacer for Desktop Image */}
          <div className="hidden lg:block lg:col-span-7" />

          {/* Text & Action Area */}
          <div className={`lg:col-span-5 flex flex-col items-start z-20 ${
            isRTL ? "lg:items-end text-right" : "text-left"
          }`}>

            {/* Accent Kicker */}
            <span className="text-slate-200 font-caveat text-[clamp(0.96rem,0.864rem+0.48vw,1.2rem)] lg:text-[1.8vw] tracking-wide mb-3 lg:mb-[0.9vw]">
              {isRTL ? "جاهز للبدء؟" : "Ready to Get Started?"}
            </span>

            {/* Main Title */}
            <h2 className="text-[clamp(1.4rem,1.12rem+1.76vw,2.3rem)] lg:text-[2.76vw] lg:whitespace-nowrap font-bold leading-[1.15] text-white tracking-tight mb-4 lg:mb-[1.2vw]">
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
            <p className="text-slate-300/80 text-[clamp(0.875rem,0.8rem+0.35vw,1rem)] lg:text-[1.2vw] leading-relaxed max-w-xs sm:max-w-md lg:max-w-[30vw] mb-6 lg:mb-[1.8vw]">
              {isRTL
                ? "كازانيست جاهزة لمساعدتك في تحويل متطلباتك إلى حل عملي."
                : "Casanest is ready to help turn your requirements into a practical solution."}
            </p>

            {/* Feature Checkmarks */}
            <div className={`flex flex-wrap items-center gap-[clamp(1rem,0.8rem+0.8vw,1.5rem)] text-slate-100 text-[clamp(0.8rem,0.75rem+0.25vw,0.95rem)] lg:text-[1.14vw] font-medium mb-8 lg:mb-[2.4vw] ${
              isRTL ? "justify-start lg:justify-end" : "justify-end lg:justify-start"
            }`}>
              {features.map((label) => (
                <div key={label} className="flex items-center gap-2">
                  <span className="text-white text-base lg:text-[1.2vw] font-bold">✓</span>
                  <span>{label}</span>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className={`w-full sm:w-auto flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 lg:gap-[1.1vw] ${
              isRTL ? "sm:justify-start lg:justify-end" : "sm:justify-start lg:justify-start"
            }`}>
              <LocalizedClientLink
                href="/store"
                className="px-[clamp(1.25rem,1rem+1.2vw,1.75rem)] lg:px-[2.1875vw] py-[clamp(0.65rem,0.5rem+0.6vw,0.875rem)] lg:py-[1.09375vw] bg-[#D2DAE8] hover:bg-[#c3cddf] text-[#181A20] font-semibold text-center text-[clamp(0.76rem,0.72rem+0.2vw,0.84rem)] lg:text-[1.134vw] rounded-2xl lg:rounded-[1.25vw] transition-colors duration-200 shadow-sm whitespace-nowrap flex items-center justify-center gap-2 lg:gap-[0.625vw]"
              >
                <span>{isRTL ? "اكتشف منتجاتنا" : "Discover Our Products"}</span>
              </LocalizedClientLink>

              <LocalizedClientLink
                href="/contact"
                className="px-[clamp(1.25rem,1rem+1.2vw,1.75rem)] lg:px-[2.1875vw] py-[clamp(0.65rem,0.5rem+0.6vw,0.875rem)] lg:py-[1.09375vw] bg-transparent border border-slate-500/70 hover:border-slate-300 hover:bg-white/5 text-white font-medium text-center text-[clamp(0.76rem,0.72rem+0.2vw,0.84rem)] lg:text-[1.134vw] rounded-2xl lg:rounded-[1.25vw] transition-colors duration-200 flex items-center justify-center gap-2.5 lg:gap-[0.78125vw] whitespace-nowrap"
              >
                <span>{isRTL ? "تواصل مع احد ممثلينا" : "Schedule a Call"}</span>
              </LocalizedClientLink>
            </div>

          </div>
        </div>

        {/* Mobile Image (Positioned at bottom, overflowing lower edge) — reverted to original */}
        <div className="block lg:hidden w-full relative h-[clamp(280px,55vw,420px)] overflow-visible [clip-path:inset(-50%_0_0_0_round_0_0_20px_20px)] mt-2">
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