import { satoshiStyle, caveatStyle, type Props } from "./styles"

export default function ValuesV1({ isRTL }: Props) {
  const values = [
    {
      title: "Zero Middleman Markup",
      titleAr: "بدون وسطاء",
      desc: "We partner directly with manufacturers and authorized distributors across Egypt and the region, passing factory-direct pricing to your business without hidden fees or inflated margins.",
      descAr:
        "نتعاون مباشرة مع المصنعين والموزعين المعتمدين في مصر والمنطقة، ونمرر أسعار المصنع إلى عملك دون رسوم خفية أو هوامش متضخمة.",
    },
    {
      title: "Project-Ready Customization",
      titleAr: "تخصيص جاهز للمشاريع",
      desc: "Every hospital wing, hotel floor, or corporate campus has unique specifications. Our procurement team tailors materials, configurations, and logistics to match your exact project blueprint.",
      descAr:
        "كل جناح مستشفى أو طابق فندق أو حرم مؤسسي له مواصفات فريدة. فريق الشراء لدينا يخصص المواد والتكوينات والخدمات اللوجستية لتتناسب مع مخطط مشروعك الدقيق.",
    },
    {
      title: "End-to-End Delivery",
      titleAr: "توصيل متكامل",
      desc: "From the moment your inquiry is confirmed, we handle inland freight, customs clearance, unboxing, assembly, and on-site installation — so your team can focus on what matters.",
      descAr:
        "من لحظة تأكيد استفسارك، نتولى النقل الداخلي وتخليص الجمارك والفتح والتجميع والتركيب في الموقع — حتى يتمكن فريقك من التركيز على ما يهم.",
    },
  ]

  return (
    <section
      className="bg-[#faf8f5] flex flex-col gap-6 lg:gap-10 items-center py-11 lg:py-20 relative w-full"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="content-container flex flex-col gap-6 lg:gap-10 items-center w-full">
      <div className="flex flex-col gap-1.5 lg:gap-3 items-center text-[#17284a]">
        <p className="text-[24px] text-center" style={caveatStyle}>
          {isRTL ? "أسس الرعاية" : "Foundations of Care"}
        </p>
        <p className="text-[24px] lg:text-[40px] text-center" style={{ ...satoshiStyle, fontWeight: 700 }}>
          {isRTL ? "قيمنا الأساسية للشراء" : "Our Core Procurement Values"}
        </p>
      </div>
      <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 items-stretch w-full">
        {values.map((val, i) => (
          <div
            key={i}
            className="bg-white border border-[#e5e7eb] border-solid lg:border-none lg:drop-shadow-[0px_4px_8px_rgba(0,0,0,0.08)] flex flex-1 flex-col gap-2.5 lg:gap-4 items-start p-4 lg:p-8 rounded-xl w-full"
          >
            <h4 className="text-[#17284a] text-[18px] lg:text-[24px]" style={{ ...satoshiStyle, fontWeight: 700 }}>
              {isRTL ? val.titleAr : val.title}
            </h4>
            <p className="text-[#5d5d61] lg:text-[#707176] text-[14px] lg:text-[16px] leading-[1.5]" style={satoshiStyle}>
              {isRTL ? val.descAr : val.desc}
            </p>
          </div>
        ))}
      </div>
      </div>
    </section>
  )
}
