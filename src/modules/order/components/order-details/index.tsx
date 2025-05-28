import { HttpTypes } from "@medusajs/types"
import { Text } from "@medusajs/ui"
import { useLocale } from "next-intl"

type OrderDetailsProps = {
  order: HttpTypes.StoreOrder
  showStatus?: boolean
}

const OrderDetails = ({ order, showStatus }: OrderDetailsProps) => {
  const locale = useLocale()
  const formatStatus = (str: string) => {
    const formatted = str.split("_").join(" ")

    return formatted.slice(0, 1).toUpperCase() + formatted.slice(1)
  }

  return (
    <div dir={locale === "ar" ? "rtl" : "ltr"}>
      <Text>
        {locale === "ar" ? "لقد تم إرسال تفاصيل التأكيد للطلب" : "We have sent the order confirmation details to"}:{" "}
        <span
          className="text-ui-fg-medium-plus font-semibold"
          data-testid="order-email"
        >
          {order.email}
        </span>
        .
      </Text>
      <Text className="mt-2">
        {locale === "ar" ? "تاريخ الطلب" : "Order date"}:{" "}
        <span data-testid="order-date">
          {new Date(order.created_at).toDateString()}
        </span>
      </Text>
      <Text className="mt-2 text-ui-fg-interactive">
        {locale === "ar" ? "رقم الطلب" : "Order number"}: <span data-testid="order-id">{order.display_id}</span>
      </Text>

      <div className="flex items-center text-compact-small gap-x-4 mt-4">
        {showStatus && (
          <>
            <Text>
              {locale === "ar" ? "حالة الطلب" : "Order status"}:{" "}
              <span className="text-ui-fg-subtle " data-testid="order-status">
                {/* TODO: Check where the statuses should come from */}
                {formatStatus(order.fulfillment_status)}
              </span>
            </Text>
            <Text>
              {locale === "ar" ? "حالة الدفع" : "Payment status"}:{" "}
              <span
                className="text-ui-fg-subtle "
                sata-testid="order-payment-status"
              >
                {formatStatus(order.payment_status)}
              </span>
            </Text>
          </>
        )}
      </div>
    </div>
  )
}

export default OrderDetails
