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
    <div dir={isRTL ? "rtl" : "ltr"}>
      <Heading
        level="h2"
        className={clx("text-3xl-regular my-6", {
          "text-right": isRTL,
          "text-left": !isRTL
        })}
      >
        {isRTL ? "التوصيل" : "Delivery"}
      </Heading>

      <div className={clx("flex flex-col md:flex-row gap-y-4 md:gap-x-8", {
        "md:flex-row-reverse": isRTL
      })}>
        {/* Shipping Address */}
        <div
          className={clx("flex-1 min-w-0", {
            "md:border-l md:pl-8": !isRTL,
            "md:border-r md:pr-8": isRTL
          })}
          data-testid="shipping-address-summary"
        >
          <Text className="txt-medium-plus text-ui-fg-base mb-1">
            {isRTL ? "عنوان الشحن" : "Shipping Address"}
          </Text>
          <div className="flex flex-col gap-y-1">
            <Text className="txt-medium text-ui-fg-subtle">
              {order.shipping_address?.first_name}{" "}
              {order.shipping_address?.last_name}
            </Text>
            <Text className="txt-medium text-ui-fg-subtle">
              {order.shipping_address?.address_1}{" "}
              {order.shipping_address?.address_2}
            </Text>
            <Text className="txt-medium text-ui-fg-subtle">
              {order.shipping_address?.postal_code},{" "}
              {order.shipping_address?.city}
            </Text>
            <Text className="txt-medium text-ui-fg-subtle">
              {order.shipping_address?.country_code?.toUpperCase()}
            </Text>
          </div>
        </div>

        {/* Contact Info */}
        <div
          className={clx("flex-1 min-w-0", {
            "md:border-l md:pl-8": !isRTL,
            "md:border-r md:pr-8": isRTL
          })}
          data-testid="shipping-contact-summary"
        >
          <Text className="txt-medium-plus text-ui-fg-base mb-1">
            {isRTL ? "اتصال" : "Contact"}
          </Text>
          <div className="flex flex-col gap-y-1">
            <Text className="txt-medium text-ui-fg-subtle break-all">
              {order.shipping_address?.phone}
            </Text>
            <Text className="txt-medium text-ui-fg-subtle break-words">
              {order.email}
            </Text>
          </div>
        </div>
        {/* Shipping Method */}
        <div
          className="flex-1 min-w-0"
          data-testid="shipping-method-summary"
        >
          <Text className="txt-medium-plus text-ui-fg-base mb-1">
            {isRTL ? "طريقة التوصيل" : "Method"}
          </Text>
          <div className="flex flex-col gap-y-1">
            <Text className="txt-medium text-ui-fg-subtle">
              {(order as any).shipping_methods[0]?.name} (
              {convertToLocale({
                amount: order.shipping_methods?.[0].total ?? 0,
                currency_code: order.currency_code,
              })
                .replace(/,/g, "")
                .replace(/\./g, ",")}
              )
            </Text>
          </div>
        </div>
      </div>

      <Divider className="mt-8" />
    </div>
  )
}

export default ShippingDetails