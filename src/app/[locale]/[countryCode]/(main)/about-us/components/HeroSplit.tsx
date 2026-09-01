import { satoshiStyle, type Props } from "./styles"

export default function HeroSplit({ isRTL, locale }: Props) {
  return (
    <section
      className="bg-[#141b34] flex flex-col items-start overflow-clip relative w-full"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="content-container flex flex-col gap-[32px] lg:flex-row items-start justify-between lg:pb-[clamp(28px,3vw,48px)] pb-12 pt-[44px] lg:pt-[clamp(28px,4vw,60px)] relative lg:gap-[clamp(20px,2.5vw,32px)]">
        <h1
          className="text-white text-[32px] lg:text-[clamp(24px,3vw,40px)] lg:max-w-[592px] leading-[1.2] lg:leading-[1.1]"
          style={{ ...satoshiStyle, fontWeight: 700 }}
        >
          {isRTL
            ? "حلول مساحات العمل التي كنت تبحث عنها"
            : "The Workspace Solutions You've Been Searching For"}
        </h1>
        <div className="flex flex-col gap-6 lg:gap-[clamp(16px,1.2vw,32px)] items-start max-w-[689px] w-full">
          <p className="text-[#a8b8cc] text-[14px] lg:text-[clamp(13px,1.3vw,18px)] leading-[1.5]" style={{ ...satoshiStyle, fontWeight: 300 }}>
            {isRTL
              ? "نحن نبسط تجهيز المساحات التجارية من خلال تنظيم احتياجات مساحة عملك. من أجهزة المطبخ الثقيلة والأثاث التنفيذي الحديث إلى أجهزة الشبكات القوية، نساعد الشركات على الاختيار والتخصيص وطلب عروض الأسعار على نطاق واسع."
              : "We streamline commercial fit-outs by organizing your workspace essentials. From heavy kitchen appliances and modern executive furniture to powerful networking hardware, we help businesses select, customize, and quote at scale."}
          </p>
          <a
            href={`/${locale}/products`}
            className="bg-[#cdd6e9] flex gap-2 items-center justify-center px-9 py-4 lg:py-[clamp(14px,1.6vw,24px)] rounded-2xl hover:opacity-90 transition-opacity w-full lg:w-auto"
          >
            <span
              className="text-[#17284a] text-[16px] whitespace-nowrap"
              style={{ ...satoshiStyle, fontWeight: 500 }}
            >
              {isRTL ? "استكشف منتجاتنا" : "Explore Our Products"}
            </span>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M4.16669 10H15.8334M15.8334 10L10 4.16669M15.8334 10L10 15.8334"
                stroke="#17284a"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>
        </div>
      </div>
      {/* Arch Row - Mobile: 2 arches, Desktop: 4 arches */}
      <div className="content-container flex items-end relative">
        <div className="bg-[#d8d2c8] flex flex-1 flex-col h-[220px] lg:h-[clamp(160px,30vw,420px)] items-start overflow-clip relative rounded-t-[100px] lg:rounded-t-[clamp(60px,13vw,180px)] rounded-b-[8px] lg:rounded-b-none mr-[-13px] lg:mr-[-16px] min-w-0">
          <div className="flex flex-1 flex-col items-start justify-end pb-7 pt-8 px-6 relative w-full">
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 rounded-2xl top-0 w-full max-w-[664px] overflow-hidden">
              <img alt="" src="/about-us/arch-chair.webp" className="absolute inset-0 w-full h-full object-cover rounded-2xl" />
            </div>
          </div>
        </div>
        <div className="bg-[#cdd6e9] flex flex-1 flex-col h-[220px] lg:h-[clamp(160px,32vw,460px)] items-start overflow-clip relative rounded-t-[100px] lg:rounded-t-[clamp(60px,14vw,200px)] rounded-b-[8px] lg:rounded-b-none mr-[-16px] min-w-0">
          <div className="flex flex-1 flex-col items-start justify-end pb-7 pt-8 px-6 relative w-full">
            <div className="absolute bottom-0 left-0 top-0 w-full overflow-hidden">
              <img alt="" src="/about-us/arch-desk.webp" className="absolute inset-0 w-full h-full object-cover" />
            </div>
          </div>
        </div>
        <div className="bg-[#d8d2c8] flex flex-1 flex-col h-[clamp(300px,30vw,420px)] items-start overflow-clip relative rounded-t-[clamp(100px,13vw,180px)] mr-[-16px] min-w-0 hidden lg:flex">
          <div className="flex flex-1 flex-col items-start justify-end pb-7 pt-8 px-6 relative w-full">
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 rounded-2xl top-0 w-full max-w-[560px] overflow-hidden">
              <img alt="" src="/about-us/arch-appliance.webp" className="absolute inset-0 w-full h-full object-cover rounded-2xl" />
            </div>
          </div>
        </div>
        <div className="bg-[#ccc] flex flex-1 flex-col h-[clamp(320px,32vw,460px)] items-start overflow-clip relative rounded-t-[clamp(100px,14vw,200px)] min-w-0 hidden lg:flex">
          <div className="flex flex-1 flex-col items-start justify-end pb-7 pt-8 px-6 relative w-full">
            <div className="absolute bottom-0 left-0 top-0 w-full overflow-hidden">
              <img alt="" src="/about-us/arch-server.webp" className="absolute inset-0 w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
