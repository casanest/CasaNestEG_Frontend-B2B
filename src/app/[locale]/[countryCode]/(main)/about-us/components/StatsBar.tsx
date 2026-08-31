import { satoshiStyle, type Props } from "./styles"

export default function StatsBar({ isRTL }: Props) {
  const stats = [
    { number: "500+", label: isRTL ? "عملاء من مؤسسات" : "Enterprise Clients" },
    { number: "27", label: isRTL ? "تغطية المحافظات" : "Governorate Coverage" },
    { number: "25+", label: isRTL ? "سنة في السوق المصري" : "Years in the Egyptian Market" },
  ]

  return (
    <section
      className="bg-[#141b34] flex gap-4 lg:gap-0 items-center justify-between py-5 lg:py-[60px] relative w-full"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="content-container flex gap-4 lg:gap-0 items-center justify-between w-full">
      {stats.map((s, i) => (
        <div key={i} className="flex flex-1 flex-col gap-2 items-center text-center">
          <p
            className="text-[#fdb022] text-[24px] lg:text-[48px] whitespace-nowrap"
            style={{ ...satoshiStyle, fontWeight: 700, lineHeight: 1.1 }}
          >
            {s.number}
          </p>
          <p
            className="text-white text-[12px] lg:text-[16px] opacity-80 leading-snug"
            style={{ ...satoshiStyle, fontWeight: 400, lineHeight: 1.4 }}
          >
            {s.label}
          </p>
        </div>
      ))}
      </div>
    </section>
  )
}
