import { convertToLocale } from "@lib/util/money"
import { HttpTypes } from "@medusajs/types"
import { Heading, Text, clx } from "@medusajs/ui"
import { useLocale } from "next-intl"
import Divider from "@modules/common/components/divider"

type ShippingDetailsProps = {
  order: HttpTypes.StoreOrder
}

const ShippingDetails = ({ order }: ShippingDetailsProps) => {
  const locale = useLocale()
  const isRTL = locale === "ar"

  return (
    <section dir={isRTL ? "rtl" : "ltr"} className="bg-white p-6 rounded-lg border border-ui-border-base">
      <Heading
        level="h2"
        className={clx("text-3xl font-semibold mb-8", {
          "text-right": isRTL,
          "text-left": !isRTL,
        })}
      >
        {isRTL ? "التوصيل" : "Delivery"}
      </Heading>

      <div
        className={clx(
          "grid gap-8 md:grid-cols-3",
          { "text-right": isRTL, "text-left": !isRTL }
        )}
      >
        {/* Shipping Address */}
        <div
          className={clx("min-w-0", {
          })}
          data-testid="shipping-address-summary"
        >
          <Text className="txt-medium-plus text-ui-fg-base mb-3 border-b border-gray-300 pb-2">
            {isRTL ? "عنوان الشحن" : "Shipping Address"}
          </Text>
          <div className="space-y-1 text-ui-fg-subtle">
            <Text className="txt-medium">
              {order.shipping_address?.first_name} {order.shipping_address?.last_name}
            </Text>
            <Text className="txt-medium">
              {order.shipping_address?.address_1}
              {order.shipping_address?.address_2 ? `, ${order.shipping_address.address_2}` : ""}
            </Text>
            <Text className="txt-medium">
              {order.shipping_address?.postal_code}, {order.shipping_address?.city}
            </Text>
            <Text className="txt-medium">
              {order.shipping_address?.country_code?.toUpperCase()}
            </Text>
          </div>
        </div>

        {/* Contact Info */}
        <div
          className={clx("min-w-0", {
            "md:border-l md:pl-6": !isRTL,
            "md:border-r md:pr-6": isRTL,
            "border-gray-200": true,
            // "border-b md:border-b-0 pb-4 md:pb-0": true,
          })}
          data-testid="shipping-contact-summary"
        >
          <Text className="txt-medium-plus text-ui-fg-base mb-3 border-b border-gray-300 pb-2">
            {isRTL ? "اتصال" : "Contact"}
          </Text>
          <div className="space-y-1 text-ui-fg-subtle break-words">
            <Text className="txt-medium">{order.shipping_address?.phone}</Text>
            <Text className="txt-medium">{order.email}</Text>
          </div>
        </div>

        {/* Shipping Method */}
        <div
          className={clx("min-w-0", {
            "md:border-l md:pl-6": !isRTL,
            "md:border-r md:pr-6": isRTL,
            "border-gray-200": true,
            // "border-b md:border-b-0 pb-4 md:pb-0": true,
          })}
          data-testid="shipping-method-summary"
        >
          <Text className="txt-medium-plus text-ui-fg-base mb-3 border-b border-gray-300 pb-2">
            {isRTL ? "طريقة التوصيل" : "Method"}
          </Text>
          <Text className="txt-medium text-ui-fg-subtle">
            {(order as any).shipping_methods?.[0]?.name || "-"} (
            {convertToLocale({
              amount: order.shipping_methods?.[0]?.total ?? 0,
              currency_code: order.currency_code,
            })
              .replace(/,/g, "")
              .replace(/\./g, ",")}
            )
          </Text>
        </div>
      </div>

      {/* <Divider className="mt-8" /> */}
    </section>
  )
}

export default ShippingDetails
