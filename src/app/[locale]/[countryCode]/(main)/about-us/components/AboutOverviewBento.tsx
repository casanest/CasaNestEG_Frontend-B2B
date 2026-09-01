import { satoshiStyle, type Props } from "./styles"

export default function AboutOverviewBento({ isRTL }: Props) {
  return (
    <section
      className="relative flex flex-col gap-4 lg:gap-[clamp(16px,1.5vw,24px)] items-start overflow-clip py-11 lg:py-[clamp(28px,5vw,80px)] w-full"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div aria-hidden className="absolute inset-0 pointer-events-none">
        <img alt="" src="/about-us/bento-bg.webp" className="absolute w-full h-full object-cover" />
        <div className="absolute bg-[rgba(20,27,52,0.85)] lg:bg-[rgba(20,27,52,0.15)] inset-0" />
      </div>

      <div className="content-container flex flex-col gap-4 lg:gap-[clamp(16px,1.5vw,24px)] items-start w-full">
      {/* Mobile: 3 stacked cards */}
      <div className="flex flex-col gap-4 items-start w-full z-10 lg:hidden">
        {/* Card 1: Who We Are */}
        <div className="backdrop-blur-[10px] bg-[rgba(255,255,255,0.55)] border border-[rgba(255,255,255,0.3)] flex flex-col gap-4 items-start p-5 relative rounded-xl w-full">
          <h3 className="text-[#051026] text-[24px]" style={{ ...satoshiStyle, fontWeight: 700 }}>
            {isRTL ? "من نحن" : "Who We Are"}
          </h3>
          <div className="relative rounded-lg w-full h-[160px] overflow-hidden">
            <img
              alt=""
              src="/about-us/bento-photo-1.webp"
              className="absolute inset-0 w-full h-full object-cover rounded-lg"
            />
          </div>
          <p className="text-[#423f38] text-[14px] leading-[1.5]" style={satoshiStyle}>
            {isRTL
              ? "كازانيست مدفوعة برؤية متطلعة للأمام والتزام قوي بالجودة، بهدف إعادة تعريف مستقبل المساحات المهنية في مصر."
              : "Casanest is driven by a forward-thinking vision and strong commitment to quality. Redefining professional spaces in Egypt with humans at the center of productivity."}
          </p>
        </div>
        {/* Card 2: Enterprise Clients */}
        <div className="backdrop-blur-[10px] bg-[rgba(255,255,255,0.55)] border border-[rgba(255,255,255,0.3)] flex flex-col gap-2.5 items-start p-5 relative rounded-xl w-full">
          <p className="text-[#051026] text-[32px]" style={{ ...satoshiStyle, fontWeight: 700, lineHeight: 1.2 }}>
            500+
          </p>
          <p className="text-[#051026] text-[20px]" style={{ ...satoshiStyle, fontWeight: 700 }}>
            {isRTL ? "عملاء مؤسسيون" : "Enterprise Clients"}
          </p>
          <p className="text-[#2c2e35] text-[14px]" style={satoshiStyle}>
            {isRTL
              ? "موثوق به من قبل الشركات الرائدة في القاهرة والإسكندرية والغردقة."
              : "Trusted across Cairo, Alexandria, and Hurghada."}
          </p>
        </div>
        {/* Card 3: Satisfaction */}
        <div className="backdrop-blur-[10px] bg-[rgba(255,255,255,0.55)] border border-[rgba(255,255,255,0.3)] flex flex-col gap-3 items-start p-5 relative rounded-xl w-full">
          <p className="text-[#051026] text-[32px]" style={{ ...satoshiStyle, fontWeight: 700, lineHeight: 1.2 }}>
            100%
          </p>
          <p className="text-[#051026] text-[12px]" style={satoshiStyle}>
            {isRTL ? "معدل رضا العملاء" : "Client Satisfaction Rate"}
          </p>
          <div className="relative rounded-lg w-full h-[120px] overflow-hidden">
            <img
              alt=""
              src="/about-us/bento-photo-2.webp"
              className="absolute inset-0 w-full h-full object-cover rounded-lg"
            />
          </div>
        </div>
      </div>

      {/* Desktop: original layout */}
      {/* Top card */}
      <div className="hidden lg:flex backdrop-blur-[15px] bg-[rgba(255,255,255,0.55)] border border-[rgba(255,255,255,0.3)] flex-col lg:flex-row gap-[clamp(24px,3vw,40px)] lg:gap-[clamp(40px,7vw,100px)] items-center px-[clamp(24px,3.5vw,48px)] py-[clamp(24px,3vw,40px)] relative rounded-xl w-full z-10">
        <div className="flex flex-col gap-6 items-start w-full lg:w-[clamp(300px,30vw,409px)]">
          <h3 className="text-[#141b34] text-[32px] lg:text-[clamp(24px,2.8vw,40px)]" style={{ ...satoshiStyle, fontWeight: 500 }}>
            {isRTL ? "من نحن" : "Who We Are"}
          </h3>
          <div className="relative rounded-xl w-full h-[200px] lg:h-[clamp(160px,18vw,260px)] overflow-hidden">
            <img
              alt=""
              src="/about-us/bento-photo-1.webp"
              className="absolute inset-0 w-full h-full object-cover rounded-xl"
            />
          </div>
        </div>
        <p className="text-[#423f38] text-[18px] lg:text-[clamp(14px,1.4vw,20px)] leading-[1.4] flex-1" style={satoshiStyle}>
          {isRTL
            ? "كازانيست مدفوعة برؤية متطلعة للأمام والتزام قوي بالجودة، بهدف إعادة تعريف مستقبل المساحات المهنية في مصر. نؤمن بأن البيئات الرائعة تبدأ بفهم الأشخاص الذين سيعيشون فيها، وأن التأثيث هو في النهاية حوار بين المساحة وإنتاجية الإنسان."
            : "Casanest is driven by a forward-thinking vision and a strong commitment to quality, aiming to redefine the future of professional spaces in Egypt. We believe that great environments begin with understanding the people who will inhabit them, and that furnishing is ultimately a conversation between space and human productivity."}
        </p>
      </div>

      {/* Bento Row 2 - Desktop only */}
      <div className="hidden lg:flex flex-col md:flex-row gap-[clamp(10px,1.5vw,20px)] items-start w-full z-10">
        {/* 500+ card */}
        <div className="backdrop-blur-[15px] bg-[rgba(255,255,255,0.55)] border border-[rgba(255,255,255,0.3)] flex flex-col h-[clamp(360px,36vw,513px)] items-start justify-between p-[clamp(20px,2.5vw,32px)] rounded-xl w-full md:w-[clamp(260px,26vw,360px)]">
          <p className="text-[#141b34] text-[64px] lg:text-[clamp(48px,5vw,72px)]" style={{ ...satoshiStyle, fontWeight: 700, lineHeight: 1.05 }}>
            500+
          </p>
          <div className="flex flex-col gap-2 items-start w-full">
            <p className="text-[#141b34] text-[20px]" style={{ ...satoshiStyle, fontWeight: 700 }}>
              {isRTL ? "عملاء مؤسسيون" : "Enterprise Clients"}
            </p>
            <p className="text-[#2c2e35] text-[14px]" style={satoshiStyle}>
              {isRTL
                ? "موثوق به من قبل الشركات الرائدة في القاهرة والإسكندرية والغردقة."
                : "Trusted by leading businesses across Cairo, Alexandria, and Hurghada."}
            </p>
          </div>
        </div>

        {/* Dark stat card */}
        <div className="backdrop-blur-[25px] bg-[rgba(0,0,0,0.3)] flex flex-1 flex-col gap-5 h-[clamp(360px,36vw,513px)] items-start p-[clamp(20px,2.5vw,32px)] rounded-xl w-full">
          <div className="relative rounded-lg w-full flex-1 overflow-hidden">
            <img
              alt=""
              src="/about-us/bento-image.webp"
              className="absolute inset-0 w-full h-full object-cover rounded-lg"
            />
          </div>
          <div className="flex flex-col gap-6 items-start w-full">
            <div className="h-[clamp(40px,4vw,56px)] w-[clamp(120px,12vw,161px)] relative">
              <img alt="Casanest logo" src="/about-us/casanest-logo.svg" className="w-full h-full object-contain" />
            </div>
            <div className="flex flex-col gap-3 items-start text-white">
              <p className="text-[24px] lg:text-[clamp(18px,2vw,28px)]" style={{ ...satoshiStyle, lineHeight: 1.25 }}>
                {isRTL ? "نبني مساحات العمل، أنت تبني الأعمال" : "We Build Workspaces, You Build Business"}
              </p>
              <p className="text-[16px]" style={{ ...satoshiStyle, lineHeight: 1.5 }}>
                {isRTL
                  ? "متخصصون في الأثاث ومعدات تكنولوجيا المعلومات والأجهزة وحلول مساحات العمل الكاملة في جميع أنحاء مصر."
                  : "Specializing in furniture, IT equipment, appliances, and complete workspace solutions across Egypt."}
              </p>
            </div>
          </div>
        </div>

        {/* 100% card */}
        <div className="backdrop-blur-[15px] bg-[rgba(255,255,255,0.55)] border border-[rgba(255,255,255,0.3)] flex flex-col h-[clamp(360px,36vw,513px)] items-start justify-between p-[clamp(20px,2.5vw,32px)] rounded-xl w-full md:w-[clamp(260px,26vw,360px)]">
          <div className="flex flex-col gap-5 items-start justify-center w-full">
            <p className="text-[#141b34] text-[48px] lg:text-[clamp(36px,4vw,56px)]" style={{ ...satoshiStyle, fontWeight: 700, lineHeight: 1.1 }}>
              100%
            </p>
            <div className="flex flex-col gap-1 items-start w-full">
              <p className="text-[#141b34] text-[16px]" style={{ ...satoshiStyle, fontWeight: 700 }}>
                {isRTL ? "معدل رضا العملاء" : "Client Satisfaction Rate"}
              </p>
              <p className="text-[#423f38] text-[14px]" style={satoshiStyle}>
                {isRTL
                  ? "ضمان جودة شامل من التوريد إلى التسليم والتركيب."
                  : "Comprehensive quality assurance from sourcing to delivery and installation."}
              </p>
            </div>
          </div>
          <div className="relative rounded-xl w-full h-[clamp(150px,15vw,213px)] overflow-hidden">
            <img
              alt=""
              src="/about-us/bento-photo-2.webp"
              className="absolute inset-0 w-full h-full object-cover rounded-xl"
            />
          </div>
        </div>
      </div>
      </div>
    </section>
  )
}
