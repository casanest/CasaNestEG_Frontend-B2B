import { satoshiStyle, caveatStyle, type Props } from "./styles"

export default function ArchShowcase({ isRTL }: Props) {
  return (
    <section
      className="bg-[#141b34] flex flex-col gap-6 lg:gap-14 items-start overflow-clip py-11 lg:py-20 relative w-full"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="content-container flex flex-col gap-6 lg:gap-14 items-start w-full">
      {/* Large arch - mobile: full width with very rounded top, desktop: fixed width */}
      <div className="relative rounded-b-[12px] lg:rounded-b-[24px] rounded-t-[1000px] lg:rounded-t-[180px] overflow-hidden w-full lg:max-w-[360px] h-[280px] lg:h-[540px] shrink-0">
        <img
          alt=""
          src="/about-us/large-arch.webp"
          className="absolute inset-0 w-full h-full object-cover rounded-b-[12px] lg:rounded-b-[24px] rounded-t-[1000px] lg:rounded-t-[180px]"
        />
      </div>
      {/* Narrative */}
      <div className="flex flex-1 flex-col gap-6 lg:gap-10 items-start justify-center">
        <div className="flex flex-col gap-3 lg:gap-4 items-start w-full">
          <div className="hidden lg:flex items-center justify-center">
            <div className="-rotate-3">
              <div className="bg-[#fdb022] flex items-start px-4 py-1 rounded-full">
                <span className="text-[#141b34] text-[24px]" style={caveatStyle}>
                  {isRTL ? "من نحن" : "About Us"}
                </span>
              </div>
            </div>
          </div>
          <h3
            className="text-white text-[24px] lg:text-[40px] leading-[1.3] lg:leading-[1.18] max-w-[530px]"
            style={{ ...satoshiStyle, fontWeight: 700 }}
          >
            {isRTL
              ? "حلول تأثيث متميزة لكل مساحة"
              : "Premium Furnishing Solutions for Every Space"}
          </h3>
          <p
            className="text-[#dce3f0] text-[14px] lg:text-[16px] leading-[1.5] opacity-90"
            style={{ ...satoshiStyle, fontWeight: 300 }}
          >
            {isRTL
              ? "في كازانيست، نجمع بين الأثاث العالمي والمعدات التقنية المتطورة والأجهزة الأساسية — كل ذلك تحت سقف واحد. مجموعاتنا المنتقاة تخدم القطاعات الخاصة والحكومية والعامة والفنادق والمكاتب والمستشفيات والمشاريع السكنية في جميع أنحاء مصر."
              : "At Casanest, we bring together world-class furniture, cutting-edge IT equipment, and essential appliances — all under one roof. Our curated collections serve private sectors, government sectors, public sectors, hotels, offices, hospitals, and residential projects across Egypt."}
          </p>
        </div>
        <div className="flex flex-col lg:flex-row gap-5 lg:gap-6 items-start w-full">
          <div className="flex flex-1 flex-col gap-2 lg:gap-3 items-start">
            <div className="bg-[rgba(253,176,34,0.1)] flex items-start p-2 lg:p-[10px] rounded-lg lg:rounded-xl">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M12 2L4 6V12C4 16.5 7.5 20.7 12 22C16.5 20.7 20 16.5 20 12V6L12 2Z"
                  stroke="#fdb022"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M9 12L11 14L15 10"
                  stroke="#fdb022"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <p className="text-white text-[18px]" style={{ ...satoshiStyle, fontWeight: 700 }}>
              {isRTL ? "موثوق به من +500 شركة" : "Trusted by 500+ Businesses"}
            </p>
            <p
              className="text-[#dce3f0] text-[14px] leading-[1.5] opacity-80"
              style={{ ...satoshiStyle, fontWeight: 300 }}
            >
              {isRTL
                ? "عملاء مؤسسيون في جميع أنحاء مصر يعتمدون على منتجاتنا عالية الجودة وخدمتنا المخصصة."
                : "Enterprise clients across Egypt rely on our quality products and dedicated service."}
            </p>
          </div>
          <div className="flex flex-1 flex-col gap-2 lg:gap-3 items-start">
            <div className="bg-[rgba(253,176,34,0.1)] flex items-start p-2 lg:p-[10px] rounded-lg lg:rounded-xl">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="3" y="3" width="7" height="7" rx="1" stroke="#fdb022" strokeWidth="2" />
                <rect x="14" y="3" width="7" height="7" rx="1" stroke="#fdb022" strokeWidth="2" />
                <rect x="3" y="14" width="7" height="7" rx="1" stroke="#fdb022" strokeWidth="2" />
                <rect x="14" y="14" width="7" height="7" rx="1" stroke="#fdb022" strokeWidth="2" />
              </svg>
            </div>
            <p className="text-white text-[18px]" style={{ ...satoshiStyle, fontWeight: 700 }}>
              {isRTL ? "حلول متكاملة" : "Complete Solutions"}
            </p>
            <p
              className="text-[#dce3f0] text-[14px] leading-[1.5] opacity-80"
              style={{ ...satoshiStyle, fontWeight: 300 }}
            >
              {isRTL
                ? "من الأثاث إلى أجهزة تكنولوجيا المعلومات إلى الأجهزة المنزلية — كل ما يحتاجه مشروعك في مكان واحد."
                : "From furniture to IT hardware to appliances — everything your project needs in one place."}
            </p>
          </div>
        </div>
      </div>
      {/* Secondary arch - mobile: full width, desktop: hidden unless xl */}
      <div className="relative rounded-b-[24px] rounded-t-[1000px] overflow-hidden w-full h-[280px] shrink-0 lg:hidden">
        <img
          alt=""
          src="/about-us/secondary-arch.webp"
          className="absolute inset-0 w-full h-full object-cover rounded-b-[24px] rounded-t-[1000px]"
        />
      </div>
      <div className="relative rounded-b-[24px] rounded-t-[130px] overflow-hidden w-full max-w-[260px] h-[390px] shrink-0 hidden lg:block xl:block">
        <img
          alt=""
          src="/about-us/secondary-arch.webp"
          className="absolute inset-0 w-full h-full object-cover rounded-b-[24px] rounded-t-[130px]"
        />
      </div>
      </div>
    </section>
  )
}
