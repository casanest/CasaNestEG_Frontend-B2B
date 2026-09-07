import { Heading, Text } from "@medusajs/ui"
import { CheckCircle, AlertCircle, Truck } from "lucide-react"

import ItemsPreviewTemplate from "@modules/cart/templates/preview"
import DiscountCode from "@modules/checkout/components/discount-code"
import CartTotals from "@modules/common/components/cart-totals"
import Divider from "@modules/common/components/divider"
import { convertToLocale } from "@lib/util/money"
import { getLocale } from "next-intl/server"

const CheckoutSummary = async ({ cart }: { cart: any }) => {
  const locale = await getLocale()
  
  // Check shipping method status
  const hasShippingMethod = cart?.shipping_methods && cart.shipping_methods.length > 0
  const currentShippingMethod = cart?.shipping_methods?.[0]
  
  return (
    <div dir={locale === "ar" ? "rtl" : "ltr"} className="sticky top-0 flex flex-col-reverse small:flex-col gap-y-8 py-8 small:py-0 ">
      <div className="w-full bg-white flex flex-col text-[#043364]">
        <Divider className="my-6 small:hidden" />
        <Heading
          level="h2"
          className="flex flex-row text-3xl-regular items-baseline"
        >
         {locale === "ar" ? "ملخص الطلب" : "Order Summary"}
        </Heading>
        <Divider className="my-6" />
        
        {/* Shipping Method Status */}
        {hasShippingMethod && currentShippingMethod ? (
          <div className="mb-6 p-4 border rounded-lg bg-green-50 border-green-200">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <Text className="font-medium text-green-800">
                {locale === "ar" ? "طريقة التوصيل" : "Shipping Method"}
              </Text>
            </div>
            
            <div className="flex items-center gap-2 text-sm text-green-700">
              <Truck className="w-4 h-4" />
              <span className="font-medium">
                {currentShippingMethod.name}
                {currentShippingMethod.amount && ` - ${convertToLocale({
                  amount: currentShippingMethod.amount / 100,
                  currency_code: cart?.currency_code || 'EUR',
                  locale
                })}`}
              </span>
            </div>
            <Text className="text-xs text-green-600 mt-1">
              {locale === "ar" ? "تم اختيار طريقة التوصيل تلقائياً" : "Shipping method automatically selected"}
            </Text>
          </div>
        ) : (
          <div className="mb-6 p-4 border rounded-lg bg-yellow-50 border-yellow-200">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="w-5 h-5 text-yellow-600" />
              <Text className="font-medium text-yellow-800">
                {locale === "ar" ? "طريقة التوصيل" : "Shipping Method"}
              </Text>
            </div>
            <Text className="text-sm text-yellow-700">
              {locale === "ar" ? "لم يتم اختيار طريقة التوصيل" : "Shipping method not selected"}
            </Text>
          </div>
        )}
        
        <CartTotals totals={cart} />
        <ItemsPreviewTemplate cart={cart} />
        <div className="my-6">
          <DiscountCode cart={cart} />
        </div>
      </div>
    </div>
  )
}

export default CheckoutSummary
