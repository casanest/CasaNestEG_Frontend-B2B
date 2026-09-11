import { satoshiStyle, caveatStyle, type Props } from "./styles"

export default function MissionV1({ isRTL }: Props) {
  return (
    <section
      className="bg-[#faf8f5] flex flex-col gap-6 lg:flex-row lg:gap-[clamp(24px,4vw,60px)] items-start lg:items-center py-11 lg:py-[clamp(14px,2.5vw,40px)] relative w-full"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="content-container flex flex-col gap-6 lg:flex-row lg:gap-[clamp(24px,4vw,60px)] items-start lg:items-center w-full">
      <div className="flex flex-1 flex-col gap-3 lg:gap-[clamp(16px,1.2vw,24px)] items-start">
        <p className="text-[#17284a] text-[32px] lg:hidden" style={caveatStyle}>
          {isRTL ? "مهمتنا" : "Our Mission"}
        </p>
        <h2
          className="text-[#17284a] text-[24px] lg:text-[clamp(24px,2.8vw,40px)] leading-[1.3] lg:leading-[1.18] max-w-[595px]"
          style={{ ...satoshiStyle, fontWeight: 700 }}
        >
          {isRTL
            ? "مهمتنا: تجهيز معالم مصر المستقبلية"
            : "Our Mission to Equip Egypt's Future Landmarks"}
        </h2>
        <p className="text-[#5d5d61] lg:text-[#1c1b1c] text-[14px] lg:text-[clamp(13px,1.3vw,18px)] leading-[1.5] lg:opacity-80" style={satoshiStyle}>
          {isRTL
            ? "نحن موجودون لحل مشكلة عملية الشراء المجزأة في القطاع التجاري المصري. من خلال جمع الأثاث والأجهزة والأجهزة التجارية في محفظة استفسار واحدة مدارة بالكامل، نحول المخططات الهيكلية الفارغة إلى بيئات وظيفية ديناميكية."
            : "We exist to solve the fragmented procurement process in Egypt's commercial sector. By bringing furniture, hardware, and commercial-grade appliances into a single, fully-managed inquiry portfolio, we turn empty structural blueprints into dynamic functional environments."}
        </p>
      </div>
      <div className="relative rounded-xl lg:rounded-2xl overflow-hidden w-full max-w-[560px] h-[200px] lg:h-[clamp(160px,30vw,420px)]">
        <img
          alt="Mission"
          src="/about-us/mission-image.webp"
          className="absolute inset-0 w-full h-full object-cover rounded-xl lg:rounded-2xl"
        />
      </div>
      </div>
    </section>
  )
}
