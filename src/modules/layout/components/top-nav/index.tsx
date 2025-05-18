"use client"
import React from "react"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { FaFacebookF, FaTwitter, FaInstagram, FaYoutube } from "react-icons/fa"
import { usePathname } from "next/navigation"
import { useLocale } from "next-intl"

export default function TopNav() {
  const pathname = usePathname();
  const locale = useLocale();
  const isRTL = locale === "ar";

  const switchTo = (newLocale: string) => {
    // Remove current locale from pathname
    const pathWithoutLocale = pathname.replace(new RegExp(`^/${locale}`), '');
    const newPath = `/${newLocale}${pathWithoutLocale}`;

    // Force full page reload
    window.location.href = newPath;
  };

  const translations = {
    helpText: isRTL ? "تحتاج مساعدة؟" : "Need help?",
    aboutUs: isRTL ? "من نحن" : "About Us",
    returnPolicy: isRTL ? "سياسة الإرجاع" : "Return Policy",
    languageSwitch: isRTL ? "English" : "العربية",
    phoneNumber: "01095305663"
  };

  return (
    <div className={`hidden md:block w-full text-xs md:text-sm text-gray-500 shadow-md bg-[#043364] top-0 z-[60] overflow-hidden`} dir={isRTL ? "rtl" : "ltr"}>
      <div className="flex flex-wrap items-center justify-between content-container mx-auto h-[36px]">
        {/* Left: Help + Social Icons */}
        <div className={`flex items-center gap-3 text-white font-medium `}>
          <span className="truncate">
            {translations.helpText}{" "}
            <a href={`tel:${translations.phoneNumber}`} className="hover:underline font-semibold">
              {translations.phoneNumber}
            </a>
          </span>
          <div className={`hidden md:flex items-center gap-2 text-base ${isRTL ? 'mr-2' : 'ml-2'}`}>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-500">
              <FaFacebookF />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-500">
              <FaTwitter />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-500">
              <FaInstagram />
            </a>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-500">
              <FaYoutube />
            </a>
          </div>
        </div>

        {/* Right: Links + Language */}
        <div className={`flex items-center gap-4 text-blue-500 font-medium `}>
          <div className={`hidden md:flex items-center gap-4 text-white `}>
            <LocalizedClientLink
              href="/about-us"
              className="hover:text-blue-500 transition-colors duration-200 text-sm"
              locale={locale}
            >
              {translations.aboutUs}
            </LocalizedClientLink>
            <LocalizedClientLink
              href="/returns"
              className="hover:text-blue-500 transition-colors duration-200 text-sm"
              locale={locale}
            >
              {translations.returnPolicy}
            </LocalizedClientLink>
          </div>
          <button
            onClick={() => switchTo(locale === "en" ? "ar" : "en")}
            className="bg-white hover:bg-[#043364] hover:text-white text-[#043364] text-xs md:text-sm font-semibold py-0.5 px-3 rounded-full border border-blue-500 transition duration-300"
          >
            {translations.languageSwitch}
          </button>
        </div>
      </div>
    </div>
  )
}