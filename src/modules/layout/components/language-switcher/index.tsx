"use client"

import { useLocale } from "next-intl"
import { usePathname } from "next/navigation"

export default function LanguageSwitcher({
  className = "",
}: {
  className?: string
}) {
  const locale = useLocale()
  const pathname = usePathname()

  const switchTo = (newLocale: string) => {
    const pathWithoutLocale = pathname.replace(`/${locale}`, "")
    const newPath = `/${newLocale}${pathWithoutLocale}`
    window.location.href = newPath
  }

  const isRTL = locale === "ar"
  const label = isRTL ? "English" : "العربية"

  return (
    <button
      onClick={() => switchTo(locale === "en" ? "ar" : "en")}
      className={`text-[16px] font-medium text-[#17284a] underline hover:text-black transition-colors ${className}`}
      dir="auto"
    >
      {label}
    </button>
  )
}
