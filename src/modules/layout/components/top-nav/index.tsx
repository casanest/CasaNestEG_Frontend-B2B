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
    phoneNumber: "9200 123 456"
  };

  return (
    <div
      className="hidden md:block w-full bg-[#c1cee8] top-0 z-[60] overflow-hidden"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="content-container mx-auto flex items-center justify-end gap-7 py-1.5">
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
        <div className="flex items-center gap-2">
          <Phone className="w-5 h-5 text-[#17284a]" />
          <a
            href={`tel:${translations.phoneNumber.replace(/\s/g, "")}`}
            className="text-[14px] font-bold text-[#17284a] hover:underline"
          >
            {translations.phoneNumber}
          </a>
        </div>
      </div>
    </div>
  )
}