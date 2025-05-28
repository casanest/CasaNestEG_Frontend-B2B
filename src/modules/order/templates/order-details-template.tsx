"use client"

import { XMark } from "@medusajs/icons"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Help from "@modules/order/components/help"
import Items from "@modules/order/components/items"
import OrderDetails from "@modules/order/components/order-details"
import OrderSummary from "@modules/order/components/order-summary"
import ShippingDetails from "@modules/order/components/shipping-details"
import React from "react"
import { useLocale,useTranslations } from "next-intl"
import { clx } from "@medusajs/ui"

type OrderDetailsTemplateProps = {
  order: HttpTypes.StoreOrder
}

const OrderDetailsTemplate: React.FC<OrderDetailsTemplateProps> = ({
  order,
}) => {
  const locale = useLocale()
  const isRTL = locale === "ar"
  const t = useTranslations()
  return (
    <div
      dir={isRTL ? "rtl" : "ltr"}
      className="flex flex-col justify-center gap-y-4 text-[#043364] "
    >
      <div className={clx("flex gap-2 justify-between items-center", {
      })}>
        <h1 className="text-xl-semi md:text-2xl-semi">
          {isRTL ? "تفاصيل الطلب" : "Order details"}
        </h1>
        <LocalizedClientLink
          href="/account/orders"
          className={clx(
            "flex gap-2 items-center text-ui-fg-subtle hover:text-ui-fg-base transition-colors font-medium text-xs md:text-base",
            {
              "flex-row-reverse": isRTL
            }
          )}
          data-testid="back-to-overview-button"
        >
          {isRTL ? (
            <>
              العودة إلى النظرة العامة
              <XMark className={clx({
                "rotate-180": isRTL
              })} />
            </>
          ) : (
            <>
              <XMark />
              Back to overview
            </>
          )}
        </LocalizedClientLink>
      </div>
      <div
        className={clx(
          "flex flex-col gap-4 h-full bg-white w-full p-6 rounded-lg border border-ui-border-base",
          {
            "text-right": isRTL,
            "text-left": !isRTL
          }
        )}
        data-testid="order-details-container"
      >
        <OrderDetails order={order} showStatus />
        <Items order={order} />
        <ShippingDetails order={order} />
        <OrderSummary order={order} />
        <Help />
      </div>
    </div>
  )
}

export default OrderDetailsTemplate