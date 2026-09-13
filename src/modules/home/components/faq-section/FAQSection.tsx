"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { Plus, Minus } from "lucide-react"

type FAQSectionProps = {
  dir: string
}

export default function FAQSection({ dir }: FAQSectionProps) {
  const t = useTranslations("home.faq")
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const faqs = [
    { q: t("q1"), a: t("a1") },
    { q: t("q2"), a: t("a2") },
    { q: t("q3"), a: t("a3") },
    { q: t("q4"), a: t("a4") },
  ]

  return (
    <section
      className="bg-white flex flex-col gap-[24px] md:gap-[clamp(30px,4vw,40px)] items-start md:items-center justify-center md:min-h-[100svh] px-[16px] md:px-[clamp(16px,4vw,60px)] py-[24px] md:py-[clamp(40px,5vw,80px)] w-full"
      dir={dir}
    >
      {/* Header */}
      <div className="flex flex-col gap-[8px] md:gap-[clamp(10px,1vw,16px)] items-center text-center w-full">
        <div className="flex flex-col gap-[8px] md:gap-[clamp(6px,0.6vw,8px)] items-center">
          <p className="font-caveat text-[#17284a] text-[32px] md:text-[clamp(28px,2.5vw,40px)] leading-[1.2]">
            {t("eyebrow")}
          </p>
          <h2 className="text-black text-[24px] md:text-[clamp(24px,2.8vw,40px)] leading-[1.18] font-medium">
            {t("title")}
          </h2>
        </div>
        <p className="text-black/80 text-[16px] md:text-[clamp(14px,1.6vw,24px)] leading-[1.3] max-w-[734px]">
          {t("description")}
        </p>
      </div>

      {/* FAQ items - card-style on mobile, border-style on desktop */}
      <div className="md:hidden flex flex-col gap-[12px] w-full">
        {faqs.map((faq, idx) => {
          const isOpen = openIndex === idx
          return (
            <div
              key={idx}
              className="bg-[#f3f4f6] flex flex-col gap-[12px] p-[16px] rounded-[12px]"
            >
              <button
                onClick={() => setOpenIndex(isOpen ? null : idx)}
                className="flex items-center justify-between w-full text-start"
              >
                <span className="text-[#17284a] text-[14px] font-bold leading-[1.5]">
                  {faq.q}
                </span>
                <div className="shrink-0 ms-[12px]">
                  {isOpen ? (
                    <div className="bg-[#17284a] flex items-center justify-center w-[20px] h-[20px] rounded-full">
                      <Minus className="w-[12px] h-[12px] text-white" />
                    </div>
                  ) : (
                    <div className="bg-[#17284a] flex items-center justify-center w-[20px] h-[20px] rounded-full">
                      <Plus className="w-[12px] h-[12px] text-white" />
                    </div>
                  )}
                </div>
              </button>
              {isOpen && (
                <p className="text-[#5d5d61] text-[14px] leading-[1.5] whitespace-pre-line">
                  {faq.a}
                </p>
              )}
            </div>
          )
        })}
      </div>

      {/* Desktop FAQ items */}
      <div className="hidden md:flex flex-col w-full max-w-[calc(70vw+432px)] border-t border-[#17284a]/10">
        {faqs.map((faq, idx) => {
          const isOpen = openIndex === idx
          return (
            <div
              key={idx}
              className="border-b border-[#17284a]/10"
            >
              <button
                onClick={() => setOpenIndex(isOpen ? null : idx)}
                className="flex items-center justify-between w-full py-[clamp(16px,1.8vw,24px)] text-start"
              >
                <span className="text-black text-[clamp(16px,1.8vw,24px)] font-medium leading-[1.3]">
                  {faq.q}
                </span>
                <div className="shrink-0 ms-[clamp(12px,1.5vw,20px)]">
                  {isOpen ? (
                    <div className="bg-[#17284a] flex items-center justify-center w-[clamp(32px,3vw,40px)] h-[clamp(32px,3vw,40px)] rounded-[100px]">
                      <Minus className="w-[clamp(16px,1.3vw,20px)] h-[clamp(16px,1.3vw,20px)] text-white" />
                    </div>
                  ) : (
                    <div className="border border-[#17284a]/30 flex items-center justify-center w-[clamp(32px,3vw,40px)] h-[clamp(32px,3vw,40px)] rounded-[100px]">
                      <Plus className="w-[clamp(16px,1.3vw,20px)] h-[clamp(16px,1.3vw,20px)] text-[#17284a]" />
                    </div>
                  )}
                </div>
              </button>
              {isOpen && (
                <div className="pb-[clamp(16px,1.8vw,24px)]">
                  <p className="text-[#2c2e35] text-[clamp(13px,1.3vw,18px)] leading-[1.5] max-w-[1100px] whitespace-pre-line">
                    {faq.a}
                  </p>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </section>
  )
}
