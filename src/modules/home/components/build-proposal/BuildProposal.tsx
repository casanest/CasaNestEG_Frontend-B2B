import { useTranslations } from "next-intl"
import { ArrowRight } from "lucide-react"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

type BuildProposalProps = {
  dir: string
}

export default function BuildProposal({ dir }: BuildProposalProps) {
  const t = useTranslations("home.proposal")

  const steps = [
    { num: "01", title: t("step1Title"), desc: t("step1Desc") },
    { num: "02", title: t("step2Title"), desc: t("step2Desc") },
    { num: "03", title: t("step3Title"), desc: t("step3Desc") },
    { num: "04", title: t("step4Title"), desc: t("step4Desc") },
  ]

  return (
    <section
      className="bg-white relative flex flex-col gap-[24px] md:gap-[clamp(30px,4vw,60px)] items-center justify-center min-h-[100svh] px-[16px] md:px-[clamp(16px,4vw,60px)] py-[44px] md:py-[clamp(40px,5vw,80px)] w-full overflow-hidden"
      dir={dir}
    >
      {/* Header */}
      <div className="flex flex-col gap-[8px] md:gap-[clamp(10px,1vw,16px)] items-center text-center w-full">
        <div className="flex flex-col gap-[8px] md:gap-[clamp(6px,0.6vw,8px)] items-center">
          <p className="font-caveat text-[#17284a] text-[32px] md:text-[clamp(28px,2.5vw,40px)] leading-[1.2]">
            {t("eyebrow")}
          </p>
          <h2 className="text-black text-[24px] md:text-[clamp(24px,2.8vw,40px)] leading-[1.18] font-medium max-w-[900px]">
            {t("title")}
          </h2>
        </div>
        <p className="text-black/80 text-[16px] md:text-[clamp(14px,1.6vw,24px)] leading-[1.3] max-w-[734px]">
          {t("description")}
        </p>
      </div>

      {/* Steps with centered chair image */}
      <div className="relative flex flex-col md:flex-row w-full max-w-[calc(70vw+216px)] items-start justify-between gap-[24px] md:gap-0">
        {/* Chair image - centered behind steps on desktop only */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-0 pointer-events-none hidden md:block">
          <img
            src="/chair.webp"
            alt="Chair"
            className="w-[clamp(144px,25.6vw,544px)] h-[clamp(144px,25.6vw,544px)] object-contain -scale-x-100"
          />
        </div>

        {/* Left aligned steps (01, 02) */}
        <div className="relative z-10 flex flex-col gap-[24px] md:gap-[clamp(24px,3vw,50px)] w-full md:w-auto">
          {steps.slice(0, 2).map((step, idx) => (
            <div key={idx} className="flex flex-col gap-[16px] md:gap-[clamp(16px,1.5vw,24px)]">
              <div className="flex gap-[12px] md:gap-[clamp(12px,1.5vw,24px)] items-start">
                <span className="text-[#17284a] text-[28px] md:text-[clamp(28px,6vw,96px)] leading-[1.06] font-light">
                  {step.num}
                </span>
                <div className="flex flex-col gap-[6px] md:gap-[clamp(6px,0.8vw,10px)] justify-center flex-1 md:flex-none md:max-w-[clamp(220px,26vw,376px)]">
                  <h3 className="text-black text-[16px] md:text-[clamp(16px,2vw,32px)] leading-[1.2] font-medium">
                    {step.title}
                  </h3>
                  <p className="text-[#2c2e35] text-[14px] md:text-[clamp(12px,1.3vw,20px)] leading-[1.4]">
                    {step.desc}
                  </p>
                </div>
              </div>
              {idx === 0 && (
                <div className="w-full md:w-[clamp(180px,38vw,536px)] h-px bg-[#17284a]/20" />
              )}
              {idx === 1 && (
                <>
                  <div className="w-full md:w-[clamp(180px,38vw,536px)] h-px bg-[#17284a]/20" />
                  {/* Chair image after step 02 on mobile */}
                  <div className="flex justify-center w-full md:hidden">
                    <img
                      src="/chair.webp"
                      alt="Chair"
                      className="w-[320px] h-[240px] object-contain -scale-x-100"
                    />
                  </div>
                </>
              )}
            </div>
          ))}
        </div>

        {/* Right aligned steps (03, 04) - shifted down on desktop */}
        <div className="relative z-10 flex flex-col gap-[24px] md:gap-[clamp(24px,3vw,50px)] items-start md:items-end w-full md:w-auto md:mt-[clamp(40px,8vw,120px)]">
          {steps.slice(2, 4).map((step, idx) => (
            <div key={idx} className="flex flex-col gap-[16px] md:gap-[clamp(16px,1.5vw,24px)] items-start md:items-end">
              <div className="flex gap-[12px] md:gap-[clamp(12px,1.5vw,24px)] items-start md:flex-row-reverse">
                <span className="text-[#17284a] text-[28px] md:text-[clamp(28px,6vw,96px)] leading-[1.06] font-light">
                  {step.num}
                </span>
                <div className="flex flex-col gap-[6px] md:gap-[clamp(6px,0.8vw,10px)] justify-center flex-1 md:flex-none md:max-w-[clamp(220px,26vw,390px)]">
                  <h3 className="text-black text-[16px] md:text-[clamp(16px,2vw,32px)] leading-[1.2] font-medium">
                    {step.title}
                  </h3>
                  <p className="text-[#2c2e35] text-[14px] md:text-[clamp(12px,1.3vw,20px)] leading-[1.4]">
                    {step.desc}
                  </p>
                </div>
              </div>
              {idx === 0 && (
                <div className="w-full md:w-[clamp(180px,38vw,536px)] h-px bg-[#17284a]/20" />
              )}
              {idx === 1 && (
                <div className="w-full md:w-[clamp(180px,38vw,536px)] h-px bg-[#17284a]/20" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* CTA - full width on mobile */}
      <LocalizedClientLink
        href="/store"
        className="bg-[#17284a] flex gap-[8px] items-center justify-center px-[24px] md:px-[clamp(24px,2.5vw,36px)] py-[20px] md:py-[clamp(18px,1.6vw,24px)] rounded-[16px] w-full md:w-[clamp(200px,16vw,250px)] hover:bg-[#0f1a2e] transition-colors mt-[15px]"
      >
        <span className="text-white text-[16px] md:text-[clamp(12px,0.9vw,14px)] font-medium text-center">
          {t("discoverCta")}
        </span>
        <ArrowRight className={`w-[20px] h-[20px] md:w-[clamp(16px,1.3vw,20px)] md:h-[clamp(16px,1.3vw,20px)] text-white ${dir === "rtl" ? "rotate-180" : ""}`} />
      </LocalizedClientLink>
    </section>
  )
}
