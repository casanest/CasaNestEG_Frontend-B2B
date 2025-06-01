import { Container, Heading, Text } from "@medusajs/ui"

import { isStripe, paymentInfoMap } from "@lib/constants"
import Divider from "@modules/common/components/divider"
import { convertToLocale } from "@lib/util/money"
import { HttpTypes } from "@medusajs/types"
import { useLocale } from "next-intl"

type PaymentDetailsProps = {
  order: HttpTypes.StoreOrder
}

/**
 * @component
 * @description
 * Displays payment method, amount, and payment date for an order.
 */
const PaymentDetails = ({ order }: PaymentDetailsProps) => {
  const locale = useLocale()
  const isRTL = locale === "ar"
  const payment = order.payment_collections?.[0]?.payments?.[0]

  // Format date localized to user's locale and options for clarity
  const formattedDate = payment?.created_at
    ? new Date(payment.created_at).toLocaleString(locale, {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
    : ""

  return (
    <div dir={isRTL ? "rtl" : "ltr"} className="border border-ui-border-base rounded-lg p-6">
      <Heading level="h2" className="text-3xl font-semibold my-6" aria-label={isRTL ? "الدفع" : "Payment"}>
        {isRTL ? "الدفع" : "Payment"}
      </Heading>

      {payment ? (
        <div className="flex flex-col md:flex-row gap-8">
          {/* Payment Method */}
          <div className="flex flex-col md:w-1/3">
            <Text className="txt-medium-plus text-ui-fg-base mb-2" as="label" htmlFor="payment-method">
              {isRTL ? "طريقة الدفع" : "Payment method"}
            </Text>
            <Text
              id="payment-method"
              className="txt-medium text-ui-fg-subtle"
              data-testid="payment-method"
            >
              {paymentInfoMap[payment.provider_id]?.title || payment.provider_id}
            </Text>
          </div>

          {/* Payment Details */}
          <div className="flex flex-col md:w-2/3">
            <Text className="txt-medium-plus text-ui-fg-base mb-2" as="label" htmlFor="payment-details">
              {isRTL ? "تفاصيل الدفع" : "Payment details"}
            </Text>
            <div className="flex items-center gap-4 text-ui-fg-subtle txt-medium" id="payment-details" aria-live="polite">
              <Container
                className="flex items-center justify-center h-10 w-10 p-2 bg-ui-button-neutral-hover rounded-md"
                aria-hidden="true"
              >
                {paymentInfoMap[payment.provider_id]?.icon}
              </Container>

              {isStripe(payment.provider_id) && payment.data?.card_last4 ? (
                <Text data-testid="payment-amount" className="whitespace-nowrap font-semibold tracking-widest">
                  **** **** **** {payment.data.card_last4}
                </Text>
              ) : (
                <Text data-testid="payment-amount" className="whitespace-pre-wrap">
                  {isRTL ? "قيمة الدفع" : "Payment amount"}{" "}
                  <span className="font-semibold">
                    {convertToLocale({
                      amount: payment.amount,
                      currency_code: order.currency_code,
                    })}
                  </span>{" "}
                  {isRTL ? "بتاريخ" : "on"} <time dateTime={payment.created_at ?? ""}>{formattedDate}</time>
                </Text>
              )}
            </div>
          </div>
        </div>
      ) : (
        <Text className="text-ui-fg-subtle mt-4" role="alert" aria-live="assertive">
          {isRTL ? "لا توجد معلومات دفع متاحة." : "No payment information available."}
        </Text>
      )}

      {/* <Divider className="mt-8" /> */}
    </div>
  )
}

export default PaymentDetails
