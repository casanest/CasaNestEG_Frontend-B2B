import { HttpTypes } from "@medusajs/types"
import { useLocale } from "next-intl"
import { cn } from "@lib/utils"

type OrderDetailsProps = {
  order: HttpTypes.StoreOrder
  showStatus?: boolean
}

const OrderDetails = ({ order, showStatus }: OrderDetailsProps) => {
  const locale = useLocale()

  const formatStatus = (str: string) => {
    const formatted = str.split("_").join(" ")
    return formatted.charAt(0).toUpperCase() + formatted.slice(1)
  }

  return (
    <div
      dir={locale === "ar" ? "rtl" : "ltr"}
      className=" border border-gray-200 rounded-2xl p-6 shadow-sm space-y-4"
    >
      <h3 className="text-xl font-bold text-[#043364]">
        {locale === "ar" ? "تفاصيل الطلب" : "Order Information"}
      </h3>

      <div className="space-y-2 text-gray-700 text-sm">
        <p>
          {locale === "ar"
            ? "تم إرسال تأكيد الطلب إلى"
            : "Confirmation sent to"}:{" "}
          <span
            className="font-medium text-[#043364]"
            data-testid="order-email"
          >
            {order.email}
          </span>
        </p>

        <p>
          {locale === "ar" ? "تاريخ الطلب" : "Order Date"}:{" "}
          <span className="font-medium" data-testid="order-date">
            {new Date(order.created_at).toLocaleDateString(locale)}
          </span>
        </p>

        <p>
          {locale === "ar" ? "رقم الطلب" : "Order Number"}:{" "}
          <span className="font-medium text-[#043364]" data-testid="order-id">
            {order.display_id}
          </span>
        </p>
      </div>

      {showStatus && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-700 mt-4">
          <div>
            <p className="font-semibold">
              {locale === "ar" ? "حالة الطلب" : "Order Status"}
            </p>
            <p
              className="text-[#043364] font-medium"
              data-testid="order-status"
            >
              {formatStatus(order.fulfillment_status)}
            </p>
          </div>

          <div>
            <p className="font-semibold">
              {locale === "ar" ? "حالة الدفع" : "Payment Status"}
            </p>
            <p
              className="text-[#043364] font-medium"
              data-testid="order-payment-status"
            >
              {formatStatus(order.payment_status)}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

export default OrderDetails
