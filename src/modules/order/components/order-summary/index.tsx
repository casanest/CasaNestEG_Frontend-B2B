import { convertToLocale } from "@lib/util/money"
import { HttpTypes } from "@medusajs/types"
import { useLocale } from "next-intl"
import { clx } from "@medusajs/ui"

type OrderSummaryProps = {
  order: HttpTypes.StoreOrder
}

const OrderSummary = ({ order }: OrderSummaryProps) => {
  const locale = useLocale()
  const isRTL = locale === "ar"

  const getAmount = (amount?: number | null) => {
    if (!amount) return convertToLocale({ amount: 0, currency_code: order.currency_code })
    return convertToLocale({ amount, currency_code: order.currency_code })
  }

  return (
    <section
      dir={isRTL ? "rtl" : "ltr"}
      className="bg-white p-6 rounded-lg border border-ui-border-base"
    >
      <h2
        className={clx("text-2xl font-semibold mb-6", {
          "text-right": isRTL,
          "text-left": !isRTL,
        })}
      >
        {isRTL ? "ملخص الطلب" : "Order Summary"}
      </h2>

      <div className="text-ui-fg-base space-y-4 text-sm">
        <div className="flex justify-between">
          <span>{isRTL ? "المجموع الفرعي" : "Subtotal"}</span>
          <span>{getAmount(order.subtotal)}</span>
        </div>

        {(order.discount_total ?? 0) > 0 && (
          <div className="flex justify-between text-red-600">
            <span>{isRTL ? "الخصم" : "Discount"}</span>
            <span>- {getAmount(order.discount_total)}</span>
          </div>
        )}

        {(order.gift_card_total ?? 0) > 0 && (
          <div className="flex justify-between text-red-600">
            <span>{isRTL ? "كارت هدية" : "Gift Card"}</span>
            <span>- {getAmount(order.gift_card_total)}</span>
          </div>
        )}

        <div className="flex justify-between">
          <span>{isRTL ? "الشحن" : "Shipping"}</span>
          <span>{getAmount(order.shipping_total)}</span>
        </div>

        <div className="flex justify-between">
          <span>{isRTL ? "الضرائب" : "Taxes"}</span>
          <span>{getAmount(order.tax_total)}</span>
        </div>

        <hr className="border-dashed border-ui-border my-6" />

        <div
          className={clx("flex justify-between text-lg font-bold", {
            "text-right": isRTL,
            "text-left": !isRTL,
            "text-ui-fg-base": true,
          })}
        >
          <span>{isRTL ? "الإجمالي" : "Total"}</span>
          <span>{getAmount(order.total)}</span>
        </div>
      </div>
    </section>
  )
}

export default OrderSummary
