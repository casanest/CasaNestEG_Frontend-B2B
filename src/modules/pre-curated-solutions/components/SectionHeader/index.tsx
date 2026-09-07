type SectionHeaderProps = {
  locale: string
}

export default function SectionHeader({ locale }: SectionHeaderProps) {
  const isRTL = locale === "ar"

  const preHeadline = isRTL ? "مصمم خصيصاً لك" : "Tailored For You"
  const heading = isRTL ? "حلول مجهزة مسبقاً" : "Pre-Curated Solutions"
  const subtitle = isRTL
    ? "حزم تأثيث كاملة مصممة لصناعات وبيئات محددة. اختر وخصص واطلب عرض سعر."
    : "Complete furnishing packages designed for specific industries and environments. Select, customize, and request a quote."

  return (
    <div className="flex flex-col items-center gap-4 px-4 py-11 text-center w-full" dir={isRTL ? "rtl" : "ltr"}>
      <p
        className="font-normal leading-[1.2] text-[#17284a] text-[36px] sm:text-[clamp(32px,2.8vw,44px)] whitespace-nowrap"
        style={{ fontFamily: "var(--font-caveat)" }}
      >
        {preHeadline}
      </p>
      <p className="font-satoshi font-medium leading-[1.18] text-[#17284a] text-[28px] sm:text-[clamp(28px,3vw,40px)] md:text-[clamp(40px,4vw,56px)] md:leading-[1.1] whitespace-normal md:whitespace-nowrap">
        {heading}
      </p>
      <p className="font-satoshi font-normal leading-[1.5] text-[#5d5d61] text-[16px] md:text-[clamp(16px,1.3vw,18px)] max-w-[680px]">
        {subtitle}
      </p>
    </div>
  )
}
