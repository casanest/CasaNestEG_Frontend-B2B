import { Heading } from "@medusajs/ui"
import { cookies as nextCookies } from "next/headers"

import CartTotals from "@modules/common/components/cart-totals"
import Help from "@modules/order/components/help"
import Items from "@modules/order/components/items"
import OnboardingCta from "@modules/order/components/onboarding-cta"
import OrderDetails from "@modules/order/components/order-details"
import ShippingDetails from "@modules/order/components/shipping-details"
import PaymentDetails from "@modules/order/components/payment-details"
import { HttpTypes } from "@medusajs/types"
import { getLocale } from "next-intl/server"
import PrintButton from "../components/print-button"


type OrderCompletedTemplateProps = {
  order: HttpTypes.StoreOrder
}

export default async function OrderCompletedTemplate({
  order,
}: OrderCompletedTemplateProps) {
  const cookies = await nextCookies()
  const locale = await getLocale()

  const isArabic = locale === "ar"
  const isOnboarding = cookies.get("_medusa_onboarding")?.value === "true"

  const texts = {
    thankYou: isArabic ? "شكراً" : "Thank you!",
    orderReceived: isArabic ? "لقد تم استلام طلبك" : "Your order has been received",
    printReceipt: isArabic ? "طباعة الفاتورة" : "Print Receipt",
    orderDetails: isArabic ? "تفاصيل الطلب" : "Order Details",
  }

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print()
    }
  }

  return (
    <div
      dir={isArabic ? "rtl" : "ltr"}
      className="text-[#043364]"
    >
      <div className="md:content-container mx-auto max-w-4xl flex flex-col items-center gap-y-12 w-full">
        {isOnboarding && <OnboardingCta orderId={order.id} />}

        <div
          className="w-full bg-white px-8 py-10 flex flex-col gap-6"
          data-testid="order-complete-container"
        >
          {/* رأس الصفحة */}
          <div dir={isArabic ? "rtl" : "ltr"} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <Heading
              level="h1"
              className={`text-center sm:${isArabic ? "text-right" : "text-left"} text-4xl font-bold text-[#043364]`}
            >
              <span>{texts.thankYou}</span>
              <span className="block text-lg font-medium text-gray-600">
                {texts.orderReceived}
              </span>
            </Heading>

            <PrintButton label={texts.printReceipt} />

          </div>

          {/* تفاصيل الطلب */}
          <OrderDetails showStatus={true} order={order} />

          {/* <Heading
            level="h2"
            className="text-2xl font-semibold mt-6 border-t border-gray-200 pt-4"
          >
            {texts.orderDetails}
          </Heading> */}

          {/* العناصر وتفاصيل الأسعار والشحن والدفع */}
          <Items locale={locale} order={order} />
          <CartTotals totals={order} />
          <ShippingDetails order={order} />
          <PaymentDetails order={order} />

          {/* الدعم */}
          <div className="mt-6">
            <Help />
          </div>
        </div>
      </div>
    </div>
  )
}
