"use client"

import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { useLocale } from "next-intl"
import { convertToLocale } from "@lib/util/money"
import { QuoteItem } from "@lib/store/useCartStore"
import { ArrowRight } from "lucide-react"

type SummaryProps = {
  items: QuoteItem[]
}

const Summary = ({ items }: SummaryProps) => {
  const locale = useLocale()
  const isRTL = locale === "ar"

  const translations = {
    ar: {
      title: "ملخص عرض السعر",
      totalProducts: "إجمالي المنتجات:",
      estimatedSubtotal: "الإجمالي المقدر:",
      disclaimer:
        "التسعير النهائي وتقييم الضرائب يتم تأكيده بعد المراجعة الرسمية من مديري المشتريات لدينا.",
      requestQuote: "طلب عرض سعر رسمي",
      continueBrowsing: "متابعة التصفح",
    },
    en: {
      title: "Quote Summary",
      totalProducts: "Total Products:",
      estimatedSubtotal: "Estimated Subtotal:",
      disclaimer:
        "Final pricing and tax assessments are confirmed after official review by our procurement managers.",
      requestQuote: "Request Official Quote",
      continueBrowsing: "Continue Browsing",
    },
  }

  const t = translations[locale as keyof typeof translations] || translations.en

  const itemCount = items.length
  const totalUnits = items.reduce((acc, item) => acc + item.quantity, 0)
  const subtotal = items.reduce((acc, item) => acc + (item.showPrice !== false && item.unitPrice != null ? item.unitPrice * item.quantity : 0), 0)
  const currencyCode = items[0]?.currencyCode || "usd"
  const hasPricedItems = items.some((item) => item.unitPrice != null && item.showPrice !== false)

  return (
    <div
      dir={isRTL ? "rtl" : "ltr"}
      className="bg-white border border-[#e5e7eb] border-solid drop-shadow-[0px_4px_6px_rgba(0,0,0,0.03)] flex flex-col gap-[20px] lg:gap-6 items-start p-[24px] lg:p-[clamp(16px,2.5vw,32px)] rounded-[16px] w-full"
    >
      {/* Header */}
      <div className="flex flex-col gap-2 items-start w-full">
        <p className="font-bold leading-[1.4] text-[#17284a] text-[18px] lg:text-[20px] w-full">
          {t.title}
        </p>
        <div className="flex items-center justify-between leading-[1.5] text-[14px] w-full whitespace-nowrap">
          <span className="font-medium text-[#707176]">{t.totalProducts}</span>
          <span className="font-bold text-[#17284a]">
            {itemCount} {isRTL ? "منتج" : "Items"} ({totalUnits} {isRTL ? "وحدة" : "Units"})
          </span>
        </div>
      </div>

      {/* Divider */}
      <hr className="border-[#e5e7eb] w-full" />

      {/* Price Display */}
      <div className="flex flex-col gap-3 items-start w-full">
        <div className="flex items-baseline justify-between w-full whitespace-nowrap text-[#17284a]">
          <span className="font-bold text-[16px] leading-[1.5]">
            {t.estimatedSubtotal}
          </span>
          <span className="font-bold text-[20px] lg:text-[24px] leading-[1.3]">
            {hasPricedItems
              ? convertToLocale({ amount: subtotal, currency_code: currencyCode, locale })
              : (isRTL ? "السعر عند الطلب" : "Price on Request")}
          </span>
        </div>

        {/* Disclaimer Pill */}
        <div className="bg-[#faf8f5] border border-[#fdb022] border-solid flex items-start px-3.5 py-2.5 rounded-[8px] w-full">
          <p className="font-medium leading-[1.5] text-[#966109] text-[12px] lg:text-[14px]">
            {t.disclaimer}
          </p>
        </div>
      </div>

      {/* Divider */}
      <hr className="border-[#e5e7eb] w-full" />

      {/* Action Buttons */}
      <div className="flex flex-col gap-[12px] lg:gap-3 items-start w-full">
        <LocalizedClientLink
          href="/rfq"
          data-testid="checkout-button"
          className="w-full"
        >
          <div className="bg-[#17284a] flex items-center justify-center gap-[8px] px-[36px] py-[24px] lg:py-[clamp(16px,1.5vw,24px)] rounded-[10px] lg:rounded-[16px] w-full transition-colors hover:bg-[#0f1d38]">
            <span className="font-medium text-white text-[16px] leading-[1.5] text-center whitespace-nowrap">
              {t.requestQuote}
            </span>
            <ArrowRight className={isRTL ? "size-5 rotate-180" : "size-5"} />
          </div>
        </LocalizedClientLink>
        <LocalizedClientLink
          href="/store"
          className="w-full"
        >
          <div className="border border-[#17284a] border-solid flex items-center justify-center gap-[8px] px-[36px] py-[24px] lg:py-[clamp(16px,1.5vw,24px)] rounded-[10px] lg:rounded-[16px] w-full transition-colors hover:bg-[#17284a] hover:text-white">
            <span className="font-medium text-[#17284a] hover:text-white text-[16px] leading-[1.5] text-center whitespace-nowrap transition-colors">
              {t.continueBrowsing}
            </span>
            <ArrowRight className={isRTL ? "size-5 rotate-180" : "size-5"} />
          </div>
        </LocalizedClientLink>
      </div>
    </div>
  )
}

export default Summary
