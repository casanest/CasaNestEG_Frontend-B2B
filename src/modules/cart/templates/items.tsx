"use client"

import { clx } from "@medusajs/ui"

import Item from "@modules/cart/components/item"
import { useLocale } from "next-intl"
import { QuoteItem } from "@lib/store/useCartStore"

type ItemsTemplateProps = {
  items: QuoteItem[]
}

const ItemsTemplate = ({ items }: ItemsTemplateProps) => {
  const locale = useLocale()
  const isRTL = locale === "ar"

  const translations = {
    ar: {
      productDetails: "تفاصيل المنتج",
      quantity: "الكمية",
      quoteEst: "تقدير السعر",
    },
    en: {
      productDetails: "Product Details",
      quantity: "Quantity",
      quoteEst: "Quote Est.",
    },
  }

  const t = translations[locale as keyof typeof translations] || translations.en

  const currencyCode = items[0]?.currencyCode?.toUpperCase() || ""

  return (
    <>
      {/* Mobile: Card list (no table header) */}
      <div
        dir={isRTL ? "rtl" : "ltr"}
        className="lg:hidden flex flex-col gap-[16px] w-full"
      >
        {items
          ? [...items]
              .sort((a, b) => {
                return (a.createdAt ?? "") > (b.createdAt ?? "") ? -1 : 1
              })
              .map((item) => {
                return (
                  <Item
                    key={item.id}
                    item={item}
                    currencyCode={item.currencyCode}
                  />
                )
              })
          : null}
      </div>

      {/* Desktop: Table with header */}
      <div
        dir={isRTL ? "rtl" : "ltr"}
        className="hidden lg:block bg-white border border-[#e5e7eb] rounded-[16px] overflow-hidden"
      >
        {/* Table Header */}
        <div className="bg-[#faf8f5] border-b border-[#e5e7eb] flex gap-[clamp(8px,2vw,24px)] items-start px-[clamp(12px,2vw,20px)] py-4 font-bold text-[#17284a] text-[14px] leading-[1.5]">
          <p className="flex-1 min-w-0">{t.productDetails}</p>
          <p className={clx("shrink-0 w-[clamp(80px,10vw,120px)]", isRTL ? "text-left" : "text-right")}>
            {t.quantity}
          </p>
          <p className={clx("shrink-0 w-[clamp(90px,14vw,180px)]", isRTL ? "text-left" : "text-right")}>
            {t.quoteEst} ({currencyCode})
          </p>
        </div>

        {/* Item Rows */}
        {items
          ? [...items]
              .sort((a, b) => {
                return (a.createdAt ?? "") > (b.createdAt ?? "") ? -1 : 1
              })
              .map((item) => {
                return (
                  <Item
                    key={item.id}
                    item={item}
                    currencyCode={item.currencyCode}
                  />
                )
              })
          : null}
      </div>
    </>
  )
}

export default ItemsTemplate
