import { satoshiStyle, caveatStyle, type Props } from "./styles"

export default function ValuesV1({ isRTL }: Props) {
  const values = [
    {
      title: "Strategic Procurement Partnership",
      titleAr: "شراكة استراتيجية في التوريد",
      desc: "We partner directly with manufacturers and authorized distributors across Egypt and the region, passing factory-direct pricing to your business without hidden fees or inflated margins.",
      descAr:
        "نتعاون مباشرة مع المصنعين والموزعين المعتمدين في مصر والمنطقة، ونمرر أسعار المصنع إلى عملك دون رسوم خفية أو هوامش متضخمة.",
    },
    {
      title: "Engineering-Driven Customization",
      titleAr: "تخصيص هندسي للمشاريع",
      desc: "Every hospital wing, hotel floor, or corporate campus has unique specifications. Our procurement team tailors materials, configurations, and logistics to match your exact project blueprint.",
      descAr:
        "كل جناح مستشفى أو طابق فندق أو حرم مؤسسي له مواصفات فريدة. فريق الشراء لدينا يخصص المواد والتكوينات والخدمات اللوجستية لتتناسب مع مخطط مشروعك الدقيق.",
    },
    {
      title: "End-to-End Delivery & Installation",
      titleAr: "توصيل وتركيب متكامل",
      desc: "From the moment your inquiry is confirmed, we handle inland freight, customs clearance, unboxing, assembly, and on-site installation — so your team can focus on what matters.",
      descAr:
        "من لحظة تأكيد استفسارك، نتولى النقل الداخلي وتخليص الجمارك والفتح والتجميع والتركيب في الموقع — حتى يتمكن فريقك من التركيز على ما يهم.",
    },
  ]

  return (
    <section
      className="bg-[#faf8f5] flex flex-col gap-6 lg:gap-[clamp(24px,3vw,40px)] items-center py-11 lg:py-[clamp(28px,5vw,80px)] relative w-full"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="content-container flex flex-col gap-6 lg:gap-[clamp(24px,3vw,40px)] items-center w-full">
      <div className="flex flex-col gap-1.5 lg:gap-[clamp(8px,0.8vw,12px)] items-center text-[#17284a]">
        <p className="text-[24px] text-center" style={caveatStyle}>
          {isRTL ? "أسس التميز" : "Foundations of Excellence"}
        </p>
        <p className="text-[24px] lg:text-[clamp(24px,2.8vw,40px)] text-center" style={{ ...satoshiStyle, fontWeight: 700 }}>
          {isRTL ? "قيمنا الأساسية للتوريد" : "Our Core Procurement Values"}
        </p>
      </div>
      <div className="flex flex-col lg:flex-row gap-4 lg:gap-[clamp(16px,1.5vw,24px)] items-stretch w-full">
        {values.map((val, i) => (
          <div
            key={i}
            className="bg-white border border-[#e5e7eb] border-solid lg:border-none lg:drop-shadow-[0px_4px_8px_rgba(0,0,0,0.08)] flex flex-1 flex-col gap-2.5 lg:gap-[clamp(12px,1vw,16px)] items-start p-4 lg:p-[clamp(20px,2.5vw,32px)] rounded-xl w-full"
          >
            <h4 className="text-[#17284a] text-[18px] lg:text-[clamp(16px,1.6vw,24px)]" style={{ ...satoshiStyle, fontWeight: 700 }}>
              {isRTL ? val.titleAr : val.title}
            </h4>
            <p className="text-[#5d5d61] lg:text-[#707176] text-[14px] lg:text-[clamp(13px,1.1vw,16px)] leading-[1.5]" style={satoshiStyle}>
              {isRTL ? val.descAr : val.desc}
            </p>
          </div>
        ))}
      </div>
      </div>
    </section>
  )
}
