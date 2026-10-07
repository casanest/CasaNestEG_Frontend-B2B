"use client"
import React from "react"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { useLocale } from "next-intl"
import { Phone } from "lucide-react"

export default function TopNav() {
  const locale = useLocale();
  const isRTL = locale === "ar";

  const translations = {
    faqs: isRTL ? "الأسئلة الشائعة" : "FAQs",
    contactUs: isRTL ? "تواصل معنا" : "Contact Us",
    phoneNumber: "01277779373",
    landlineNumber: "0842202790"
  };

  return (
    <div
      className="hidden md:block w-full bg-[#c1cee8] overflow-hidden"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="content-container mx-auto flex items-center justify-start gap-4 sm:gap-6 md:gap-12 py-1.5 overflow-hidden">
        <LocalizedClientLink
          href="/faq"
          className="text-[14px] font-medium text-black hover:text-[#17284a] transition-colors"
          locale={locale}
        >
          {translations.faqs}
        </LocalizedClientLink>
        <LocalizedClientLink
          href="/contact"
          className="text-[14px] font-medium text-black hover:text-[#17284a] transition-colors"
          locale={locale}
        >
          {translations.contactUs}
        </LocalizedClientLink>
        <div className="flex items-center gap-2" dir="ltr">
          <Phone className="w-5 h-5 text-[#17284a]" />
          <div className="flex items-center gap-1">
            <a
              href={`tel:${translations.phoneNumber.replace(/\s/g, "")}`}
              className="text-[14px] font-bold text-[#17284a] hover:underline"
            >
              {translations.phoneNumber}
            </a>
            <span className="text-[#17284a] text-[14px] font-bold">-</span>
            <a
              href={`tel:${translations.landlineNumber.replace(/\s/g, "")}`}
              className="text-[14px] font-bold text-[#17284a] hover:underline"
            >
              {translations.landlineNumber}
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}