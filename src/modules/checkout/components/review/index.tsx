"use client"

import { Heading, Text, clx } from "@medusajs/ui"

import PaymentButton from "../payment-button"
import { useSearchParams } from "next/navigation"
import { useLocale } from "next-intl"

const Review = ({ cart }: { cart: any }) => {
  const locale = useLocale()

  const searchParams = useSearchParams()

  const isOpen = searchParams.get("step") === "review"

  const paidByGiftcard =
    cart?.gift_cards && cart?.gift_cards?.length > 0 && cart?.total === 0

  const previousStepsCompleted =
    cart.shipping_address &&
    cart.shipping_methods.length > 0 &&
    (cart.payment_collection || paidByGiftcard)

  return (
    <div dir={locale === "ar" ? "rtl" : "ltr"} className="bg-white">
      <div className="text-[#043364] flex flex-row items-center justify-between mb-6">
        <Heading
          level="h2"
          className={clx(
            "flex flex-row text-3xl-regular gap-x-2 items-baseline",
            {
              "opacity-50 pointer-events-none select-none": !isOpen,
            }
          )}
        >
          {locale === "ar" ? "مراجعة الطلب" : "Review"}
        </Heading>
      </div>
      {isOpen && previousStepsCompleted && (
        <>
          <div className="flex items-start gap-x-1 w-full mb-6">
            <div className="w-full">
              <Text className="txt-medium-plus text-ui-fg-base mb-1">
                {locale === "ar" ? "بالنقر فوق زر تقديم الطلب، فإنك تؤكد أنك قرأت وفهمت وقبلت شروط الاستخدام وشروط البيع وسياسة الإرجاع الخاصة بنا، وتقر بأنك قرأت سياسة الخصوصية الخاصة بمتجر LA CASA."
                  : " By clicking the Place Order button, you confirm that you have read, understand and accept our Terms of Use, Terms of Sale and Returns Policy and acknowledge that you have read LA CASA Store's Privacy Policy."}
              </Text>
            </div>
          </div>
          <PaymentButton cart={cart} data-testid="submit-order-button" />
        </>
      )}
    </div>
  )
}

export default Review
