import { satoshiStyle, caveatStyle, type Props } from "./styles"
import TimelineCarousel from "./TimelineCarousel"

const milestones = [
  {
    year: "2001",
    title: "Founded",
    titleAr: "التأسيس",
    description:
      "Casanest opens its first furniture showroom in New Cairo, marking the beginning of a journey to equip professional spaces.",
    descriptionAr:
      "كازانيست تفتتح أول صالة عرض للأثاث في القاهرة الجديدة، مما يمثل بداية رحلة تجهيز المساحات المهنية.",
    image: "/about-us/timeline-2001.webp",
  },
  {
    year: "2005",
    title: "Expansion",
    titleAr: "التوسع",
    description:
      "Added IT hardware & networking equipment to the catalog, expanding the offering to support modern workplaces.",
    descriptionAr:
      "تمت إضافة أجهزة تكنولوجيا المعلومات ومعدات الشبكات إلى الكتالوج، لتوسيع العرض لدعم أماكن العمل الحديثة.",
    image: "/about-us/timeline-2005.webp",
  },
  {
    year: "2010",
    title: "B2B Focus",
    titleAr: "تركيز B2B",
    description:
      "Shifted to enterprise clients: hotels, offices, hospitals—delivering large-scale furniture and technology solutions.",
    descriptionAr:
      "التحول إلى عملاء المؤسسات: الفنادق والمكاتب والمستشفيات - تقديم حلول الأثاث والتكنولوجيا واسعة النطاق.",
    image: "/about-us/timeline-2010.webp",
  },
  {
    year: "2015",
    title: "National Reach",
    titleAr: "التغطية الوطنية",
    description:
      "Opened regional offices in Alexandria & Hurghada, expanding delivery capabilities across Egypt.",
    descriptionAr:
      "افتتاح مكاتب إقليمية في الإسكندرية والغردقة، وتوسيع قدرات التوصيل في جميع أنحاء مصر.",
    image: "/about-us/timeline-2015.webp",
  },
  {
    year: "2020",
    title: "Digital Platform",
    titleAr: "المنصة الرقمية",
    description:
      "Launched online inquiry & quote management system to streamline client workflows and speed up delivery.",
    descriptionAr:
      "إطلاق نظام الاستفسار وإدارة عروض الأسعار عبر الإنترنت لتبسيط سير عمل العملاء وتسريع التسليم.",
    image: "/about-us/timeline-2020.webp",
    highlight: true,
  },
  {
    year: "2025",
    title: "500+ Clients",
    titleAr: "+500 عميل",
    description:
      "Serving over 500 enterprise clients across Egypt with complete space solutions.",
    descriptionAr:
      "نخدم أكثر من 500 عميل مؤسسي في جميع أنحاء مصر بحلول مساحات كاملة.",
    image: "/about-us/timeline-2025.webp",
    faded: true,
  },
]

export default function TimelineHorizontal({ isRTL }: Props) {
  return (
    <section
      className="bg-[#faf8f5] flex flex-col gap-5 lg:gap-[clamp(16px,2vw,32px)] items-start overflow-clip py-11 lg:py-[clamp(16px,3vw,48px)] relative w-full lg:min-h-screen lg:justify-center"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="content-container flex flex-col gap-5 lg:gap-[clamp(16px,2vw,32px)] items-start w-full">
      <div className="flex flex-col gap-1.5 lg:gap-[clamp(8px,0.8vw,12px)] items-start w-full">
        <p className="text-[#17284a] text-[32px] lg:text-[clamp(28px,2.5vw,40px)]" style={caveatStyle}>
          {isRTL ? "رحلتنا" : "Our Journey"}
        </p>
        <h2 className="text-[#051026] text-[24px] lg:text-[clamp(24px,2.8vw,40px)]" style={{ ...satoshiStyle, fontWeight: 700 }}>
          {isRTL ? "قصة كازانيست" : "The Casanest Story"}
        </h2>
      </div>

      {/* Timeline track - desktop only */}
      <div className="relative w-full h-[clamp(40px,3.5vw,50px)] hidden lg:block">
        <div className="absolute left-0 right-0 top-[12px] h-[2px] bg-[#fdb022] opacity-30" />
        {milestones.map((m, i) => {
          const pct = (i / (milestones.length - 1)) * 100
          return (
            <div key={i} className="absolute -translate-x-1/2" style={{ left: `${pct}%`, top: 0 }}>
              <div
                className={[
                  "rounded-full",
                  m.highlight
                    ? "w-[clamp(12px,1.1vw,16px)] h-[clamp(12px,1.1vw,16px)] bg-[#fdb022] ring-4 ring-[#fdb022]/30"
                    : "w-[clamp(10px,0.8vw,12px)] h-[clamp(10px,0.8vw,12px)] bg-[#17284a]",
                ].join(" ")}
                style={{ marginTop: m.highlight ? "4px" : "6px" }}
              />
              <p
                className="text-[14px] text-center mt-[14px] whitespace-nowrap"
                style={{
                  ...satoshiStyle,
                  fontWeight: 700,
                  color: m.faded ? "#707176" : "#17284a",
                }}
              >
                {m.year}
              </p>
            </div>
          )
        })}
      </div>

      {/* Timeline cards carousel */}
      <TimelineCarousel milestones={milestones} isRTL={isRTL} />
      </div>
    </section>
  )
}
