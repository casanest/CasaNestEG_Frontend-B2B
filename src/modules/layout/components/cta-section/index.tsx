import LocalizedClientLink from "@modules/common/components/localized-client-link"

type CtaSectionProps = {
  locale: string
}

export default async function CtaSection({ locale }: CtaSectionProps) {
  const isRTL = locale === "ar"

  return (
    <section className="w-full bg-white px-4 sm:px-6 lg:px-[60px] py-11">
      {/* Mobile Layout */}
      <div className="small:hidden bg-[#2c2e35] rounded-[24px] p-5 flex flex-col gap-6">
        {/* Text */}
        <div className="flex flex-col gap-3 text-white">
          <p className="font-caveat text-[32px] leading-[1.2]" style={{ fontFamily: isRTL ? undefined : "var(--font-caveat), cursive" }}>
            {isRTL ? "جاهز للبدء؟" : "Ready to Get Started?"}
          </p>
          <p className="text-[24px] font-medium leading-[1.3]">
            {isRTL ? (
              <>
                لديك مساحة لبنائها؟
                <br />
                دعنا نتحدث.
              </>
            ) : (
              <>
                Have a Space to Build?
                <br />
                Let's Talk.
              </>
            )}
          </p>
          <p className="text-[14px] text-white/70 leading-[1.5]">
            {isRTL
              ? "كازانيست جاهزة لمساعدتك في تحويل متطلباتك إلى حل عملي."
              : "Casanest is ready to help turn your requirements into a practical solution."}
          </p>
        </div>

        {/* CTA Image */}
        <div className="relative w-full max-w-[400px] h-[300px] rounded-[16px] overflow-hidden bg-gray-800 mx-auto">
          <img
            src="/cta-space.webp"
            alt="Have a Space to Build"
            className="w-full h-full object-contain -scale-x-100"
          />
        </div>

        {/* Buttons */}
        <div className="flex flex-col gap-3">
          <LocalizedClientLink
            href="/store"
            className="bg-[#cdd6e9] flex items-center justify-center gap-2 px-6 py-6 rounded-[16px] text-[16px] font-medium text-[#17284a] whitespace-nowrap transition-all hover:bg-[#17284a] hover:text-white active:scale-[0.98]"
          >
            {isRTL ? "اكتشف منتجاتنا" : "Discover Our Products"}
          </LocalizedClientLink>
          <LocalizedClientLink
            href="/contact"
            className="border border-white/30 flex items-center justify-center gap-2 px-6 py-6 rounded-[16px] text-[16px] font-medium text-white whitespace-nowrap transition-all hover:bg-white/10 active:scale-[0.98]"
          >
            {isRTL ? "تواصل مع احد ممثلينا" : "Contact one of our representatives"}
          </LocalizedClientLink>
        </div>
      </div>

      {/* Desktop/Tablet Layout */}
""      <div className="hidden small:flex bg-[#2c2e35] rounded-[24px] lg:rounded-[40px] p-5 lg:p-10 flex-col lg:flex-row lg:items-center gap-6 lg:gap-[30px] lg:w-[70%] max-w-[1344px] mx-auto">
        {/* Left: Text + Buttons */}
        <div className="flex-1 flex flex-col gap-6 lg:gap-10">
          {/* Heading */}
          <div className="flex flex-col gap-4 text-white">
            <div className="flex flex-col gap-2">
              <p className="font-caveat text-[32px] lg:text-[clamp(28px,2.5vw,40px)] leading-[1.2]" style={{ fontFamily: isRTL ? undefined : "var(--font-caveat), cursive" }}>
                {isRTL ? "جاهز للبدء؟" : "Ready to Get Started?"}
              </p>
              <p className="text-[28px] lg:text-[40px] font-medium leading-[1.18]">
                {isRTL ? (
                  <>
                    لديك مساحة لبنائها؟
                    <br />
                    دعنا نتحدث.
                  </>
                ) : (
                  <>
                    Have a Space to Build?
                    <br />
                    Let's Talk.
                  </>
                )}
              </p>
            </div>
            <p className="text-[16px] lg:text-[20px] text-white/70 leading-[1.4] max-w-[450px]">
              {isRTL
                ? "كازانيست جاهزة لمساعدتك في تحويل متطلباتك إلى حل عملي."
                : "Casanest is ready to help turn your requirements into a practical solution."}
            </p>
          </div>

          {/* Feature badges */}
          <div className="hidden lg:flex items-center gap-6">
            {[
              isRTL ? "مربح" : "Profitable",
              isRTL ? "موثوق" : "Reliable",
              isRTL ? "قابل للتخصيص" : "Customizable",
            ].map((label) => (
              <div key={label} className="flex items-center gap-2">
                <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-[16px] font-medium text-white whitespace-nowrap">{label}</span>
              </div>
            ))}
          </div>

          {/* Buttons */}
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-3 lg:gap-5">
            <LocalizedClientLink
              href="/store"
              className="bg-[#cdd6e9] flex items-center justify-center gap-2 px-9 py-6 rounded-[16px] text-[16px] font-medium text-[#17284a] whitespace-nowrap transition-all hover:bg-[#17284a] hover:text-white active:scale-[0.98]"
            >
              {isRTL ? "اكتشف منتجاتنا" : "Discover Our Products"}
            </LocalizedClientLink>
            <LocalizedClientLink
              href="/contact"
              className="border border-white/30 flex items-center justify-center gap-2 px-9 py-6 rounded-[16px] text-[16px] font-medium text-white whitespace-nowrap transition-all hover:bg-white/10 active:scale-[0.98]"
            >
              {isRTL ? "تواصل مع احد ممثلينا" : "Contact Our Representatives"}
            </LocalizedClientLink>
          </div>
        </div>

        {/* Right: Image */}
<div className="relative h-[180px] lg:h-[338px] w-full lg:w-[50%] rounded-[16px] lg:rounded-[20px] overflow-hidden bg-gray-800">
          <img
            src="/cta-space-desktop.webp"
            alt="Have a Space to Build"
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>
      </div>
    </section>
  )
}
