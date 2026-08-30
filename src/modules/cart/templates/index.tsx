"use client"

import ItemsTemplate from "./items"
import Summary from "./summary"
import EmptyCartMessage from "../components/empty-cart-message"
import { useCartStore } from "@lib/store/useCartStore"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { useLocale } from "next-intl"

const CartTemplate = () => {
  const locale = useLocale()
  const isRTL = locale === "ar"
  const items = useCartStore((state) => state.items)
  const hasHydrated = useCartStore((state) => state.hasHydrated)

  const translations = {
    ar: {
      breadcrumbsHome: "الرئيسية",
      breadcrumbsCurrent: "قائمة الأسعار",
      title: "قائمة الأسعار الخاصة بك",
      badge: "بدون دفع، بدون التزام",
      description:
        "راجع المنتجات التي اخترتها. اضبط الكميات، أزل العناصر، أو أرسل قائمتك للحصول على عرض سعر مخصص من فريق المشتريات لدينا.",
    },
    en: {
      breadcrumbsHome: "Home",
      breadcrumbsCurrent: "Quote List",
      title: "Your Quote List",
      badge: "No Payment, No Obligation",
      description:
        "Review the products you've selected. Adjust quantities, remove items, or submit your list for a custom quote from our procurement team.",
    },
  }

  const t = translations[locale as keyof typeof translations] || translations.en

  if (!hasHydrated) {
    return (
      <div dir={isRTL ? "rtl" : "ltr"} className="font-satoshi bg-[#f8f9fa] min-h-screen" />
    )
  }

  return (
    <div
      dir={isRTL ? "rtl" : "ltr"}
      className="font-satoshi bg-[#f8f9fa] min-h-screen"
      data-testid="cart-container"
    >
      {/* Header Band */}
      <div className="border-b border-[#e5e7eb] flex flex-col gap-[20px] lg:gap-6 px-[16px] small:px-6 lg:px-[60px] py-[44px] lg:py-[40px]">
        {/* Breadcrumbs */}
        <div className="flex gap-[8px] items-center text-[14px] leading-[1.5] whitespace-nowrap">
          <LocalizedClientLink
            href="/"
            className="text-[#707176] hover:text-[#17284a] transition-colors"
          >
            {t.breadcrumbsHome}
          </LocalizedClientLink>
          <span className="text-[#707176]">/</span>
          <span className="font-bold text-[#17284a]">{t.breadcrumbsCurrent}</span>
        </div>

        {/* Title + Badge */}
        <div className="flex flex-col gap-[12px] lg:flex-row lg:gap-4 lg:items-center lg:flex-wrap">
          <h1 className="font-bold leading-[1.3] lg:leading-[1.18] text-[#17284a] text-[24px] lg:text-[40px]">
            {t.title}
          </h1>
          <div className="bg-[#141b34] flex items-start px-[16px] py-[6px] lg:px-4 lg:py-1.5 rounded-[100px] lg:rounded-full w-fit">
            <span className="font-bold text-white text-[14px] leading-[1.5] whitespace-nowrap">
              {t.badge}
            </span>
          </div>
        </div>

        {/* Description */}
        <p className="font-medium leading-[1.5] text-[#707176] text-[16px] lg:text-[16px] max-w-[900px]">
          {t.description}
        </p>
      </div>

      {/* Main Content */}
      <div className="px-[16px] small:px-6 lg:px-[clamp(24px,5vw,80px)] pt-[44px] lg:py-[clamp(24px,5vw,60px)] pb-[16px] lg:pb-[clamp(24px,5vw,60px)]">
        {items.length ? (
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-[clamp(16px,2vw,40px)] items-start">
            {/* Items Container */}
            <div className="flex-1 w-full lg:min-w-0">
              <ItemsTemplate items={items} />
            </div>

            {/* Summary Card */}
            <div className="w-full lg:w-[clamp(300px,32%,420px)] shrink-0 pt-[16px] lg:pt-0">
              <div className="lg:sticky lg:top-6">
                <Summary items={items} />
              </div>
            </div>
          </div>
        ) : (
          <EmptyCartMessage locale={locale} />
        )}
      </div>
    </div>
  )
}

export default CartTemplate

