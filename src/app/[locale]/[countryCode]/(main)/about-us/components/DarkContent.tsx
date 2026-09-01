import { satoshiStyle, type Props } from "./styles"

export default function DarkContent({ isRTL }: Props) {
  return (
    <section
      className="bg-[#141b34] flex flex-col gap-6 lg:gap-[clamp(24px,3vw,40px)] items-center overflow-clip py-11 lg:py-[clamp(28px,5vw,80px)] relative w-full"
      dir={isRTL ? "rtl" : "ltr"}
    >
      {/* bg glows */}
      <div className="absolute right-[-140px] w-[clamp(300px,30vw,420px)] h-[clamp(300px,30vw,420px)] top-[-120px] pointer-events-none hidden lg:block">
        <img alt="" src="/about-us/bg-glow-1.svg" className="w-full h-full object-contain" />
      </div>
      <div className="absolute bottom-[-180px] left-[-120px] w-[clamp(260px,26vw,360px)] h-[clamp(260px,26vw,360px)] pointer-events-none hidden lg:block">
        <img alt="" src="/about-us/bg-glow-2.svg" className="w-full h-full object-contain" />
      </div>
      {/* Mobile glow */}
      <div className="absolute left-[-50px] w-[200px] h-[200px] top-[-50px] pointer-events-none lg:hidden">
        <img alt="" src="/about-us/bg-glow-1.svg" className="w-full h-full object-contain opacity-50" />
      </div>

      <div className="content-container flex flex-col gap-6 lg:gap-[clamp(24px,3vw,40px)] items-center w-full relative z-10">
        <div className="flex flex-col gap-2 lg:gap-[clamp(12px,1vw,16px)] items-center max-w-[920px]">
        <div className="relative">
          <div className="absolute bg-[#fdb022] h-[clamp(8px,0.8vw,12px)] left-0 right-0 bottom-[-4px] opacity-30 hidden lg:block" />
          <h2
            className="text-white text-[24px] lg:text-[clamp(24px,3.5vw,48px)] lg:text-[clamp(28px,4vw,56px)] text-center leading-[1.3] lg:leading-[1.1]"
            style={{ ...satoshiStyle, fontWeight: 700 }}
          >
            {isRTL ? (
              <>
                <p>نبني مساحات العمل،</p>
                <p>أنت تبني الأعمال</p>
              </>
            ) : (
              <>
                <p>We Build Workspaces,</p>
                <p>You Build Business</p>
              </>
            )}
          </h2>
        </div>
        <p className="text-[#a8b8cc] text-[14px] lg:text-[clamp(13px,1.1vw,16px)] text-center" style={satoshiStyle}>
          {isRTL
            ? "مبنية للتوسع • موثوقة من +500 مؤسسة"
            : "Built for scale • Trusted by 500+ enterprises"}
        </p>
      </div>

      {/* Hero visual */}
      <div className="relative rounded-[28px] overflow-hidden w-full max-w-[920px] h-[360px] lg:h-[clamp(200px,38vw,520px)] shadow-[0px_18px_48px_-12px_rgba(0,0,0,0.2)] z-10">
        <img
          alt=""
          src="/about-us/hero-visual.webp"
          className="absolute inset-0 w-full h-full object-cover rounded-[28px]"
        />
        <div className="absolute bg-[rgba(0,0,0,0.18)] inset-0 rounded-[28px]" />
        {/* Stat badge - mobile: centered, desktop: centered */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 backdrop-blur-[9px] bg-[rgba(10,26,44,0.8)] border border-[rgba(255,255,255,0.2)] flex gap-3 lg:gap-3 items-center px-[16px] lg:px-[clamp(14px,1.3vw,18px)] py-[8px] lg:py-[clamp(10px,1vw,14px)] rounded-full lg:rounded-full shadow-[0px_14px_28px_0px_rgba(0,0,0,0.25)]">
          <div className="bg-white flex items-center justify-center rounded-[20px] w-[40px] h-[40px]">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M3 21H21M5 21V7L13 3V21M19 21V11L13 7"
                stroke="#141b34"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div className="flex flex-col gap-[2px] items-start">
            <p className="text-white text-[24px] lg:text-[clamp(18px,2vw,28px)]" style={{ ...satoshiStyle, fontWeight: 700, lineHeight: 1.25 }}>
              500+
            </p>
            <p className="text-[#a8b8cc] text-[16px]" style={{ ...satoshiStyle, fontWeight: 500 }}>
              {isRTL ? "مؤسسة" : "Enterprises"}
            </p>
          </div>
        </div>
        {/* Trust chip - mobile: centered bottom, desktop: bottom-left */}
        <div className="absolute backdrop-blur-[9px] bg-[rgba(10,26,44,0.8)] border border-[rgba(255,255,255,0.15)] bottom-3 left-1/2 lg:left-6 lg:translate-x-0 -translate-x-1/2 flex gap-[10px] items-center px-[14px] py-[10px] rounded-full">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M12 2L4 6V12C4 16.5 7.5 20.7 12 22C16.5 20.7 20 16.5 20 12V6L12 2Z"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path d="M9 12L11 14L15 10" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <p className="text-white text-[14px] whitespace-nowrap" style={{ ...satoshiStyle, fontWeight: 500 }}>
            {isRTL ? "شريك موثوق" : "Trusted partner"}
          </p>
        </div>
        {/* Scope chip - mobile: centered top, desktop: bottom-right */}
        <div className="absolute backdrop-blur-[9px] bg-[rgba(10,26,44,0.8)] border border-[rgba(255,255,255,0.15)] top-3 left-1/2 lg:top-auto lg:bottom-6 lg:right-6 lg:left-auto lg:translate-x-0 -translate-x-1/2 flex gap-[10px] items-center px-[14px] py-[10px] rounded-full">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M12 3L2 8L12 13L22 8L12 3Z"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M2 17L12 22L22 17M2 12.5L12 17.5L22 12.5"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <p className="text-white text-[14px] whitespace-nowrap" style={{ ...satoshiStyle, fontWeight: 500 }}>
            {isRTL ? "أثث • جهز • صيانة" : "Furnish • Equip • Maintain"}
          </p>
        </div>
      </div>

      <p className="text-[#a8b8cc] text-[14px] lg:text-[clamp(14px,1.4vw,20px)] text-center max-w-[920px] z-10" style={satoshiStyle}>
        {isRTL
          ? "أكثر من 500 مؤسسة مصرية تثق في كازانيست لتأثيث وتجهيز وصيانة مساحاتها التجارية - من مكاتب الشركات الناشئة إلى سلاسل الفنادق الخمس نجوم."
          : "Over 500 Egyptian enterprises trust Casanest to furnish, equip, and maintain their commercial spaces - from startup offices to five-star hotel chains."}
      </p>
      </div>
    </section>
  )
}
