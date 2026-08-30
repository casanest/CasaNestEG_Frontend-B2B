import { ShoppingCart, ArrowRight } from "lucide-react"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

const EmptyCartMessage = ({ locale }: { locale: string }) => {
  const isRTL = locale === "ar"

  const translations = {
    ar: {
      title: "قائمة الأسعار فارغة",
      description: "لم تقم بإضافة أي منتجات بعد. تصفح المتجر وابدأ في بناء قائمة الأسعار الخاصة بك.",
      browse: "تصفح المتجر",
    },
    en: {
      title: "Your Quote List is Empty",
      description: "You haven't added any products yet. Browse the store and start building your quote list.",
      browse: "Browse Store",
    },
  }

  const t = translations[locale as keyof typeof translations] || translations.en

  return (
    <div
      dir={isRTL ? "rtl" : "ltr"}
      className="bg-white border border-[#e5e7eb] rounded-[16px] py-20 px-4 flex flex-col justify-center items-center text-center"
      data-testid="empty-cart-message"
    >
      <div className="size-16 rounded-full bg-[#f3f4f6] flex items-center justify-center mb-6">
        <ShoppingCart className="size-8 text-[#707176]" />
      </div>

      <h1 className="font-bold text-[24px] lg:text-[28px] leading-[1.3] text-[#17284a] mb-3">
        {t.title}
      </h1>

      <p className="font-medium text-[14px] lg:text-[16px] leading-[1.5] text-[#707176] max-w-md mb-8">
        {t.description}
      </p>

      <LocalizedClientLink
        href="/store"
        className="bg-[#17284a] flex items-center gap-2 px-9 py-4 rounded-[16px] transition-colors hover:bg-[#0f1d38]"
      >
        <span className="font-medium text-white text-[16px] leading-[1.5] whitespace-nowrap">
          {t.browse}
        </span>
        <ArrowRight className={isRTL ? "size-5 rotate-180" : "size-5"} />
      </LocalizedClientLink>
    </div>
  )
}

export default EmptyCartMessage
