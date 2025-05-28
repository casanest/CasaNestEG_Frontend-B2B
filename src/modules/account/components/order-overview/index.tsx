"use client"

import { Button } from "@medusajs/ui"
import OrderCard from "../order-card"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { HttpTypes } from "@medusajs/types"
import { useLocale } from "next-intl"
import { clx } from "@medusajs/ui"

const OrderOverview = ({ orders }: { orders: HttpTypes.StoreOrder[] }) => {
  const locale = useLocale()
  const isRTL = locale === "ar"

  if (orders?.length) {
    return (
      <div
        dir={isRTL ? "rtl" : "ltr"}
        className="flex flex-col gap-y-8 w-full"
      >
        {orders.map((o) => (
          <div
            key={o.id}
            className={clx(
              "border-b border-ui-border-base pb-6 last:pb-0 last:border-none",
              {
                "text-right": isRTL,
                "text-left": !isRTL
              }
            )}
          >
            <OrderCard order={o} />
          </div>
        ))}
      </div>
    )
  }

  return (
    <div
      dir={isRTL ? "rtl" : "ltr"}
      className={clx(
        "w-full flex flex-col items-center justify-center gap-y-6 p-8 rounded-lg bg-ui-bg-subtle border border-ui-border-base",
        {
          "text-right": isRTL,
          "text-left": !isRTL
        }
      )}
      data-testid="no-orders-container"
    >
      <div className="flex flex-col items-center gap-y-4 text-center">
        <div className="w-16 h-16 rounded-full bg-ui-bg-highlight flex items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-ui-fg-interactive"
          >
            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <path d="M16 10a4 4 0 0 1-8 0"></path>
          </svg>
        </div>

        <h2 className="text-2xl font-semibold text-ui-fg-base">
          {isRTL ? "لا توجد طلبات" : "No Orders Yet"}
        </h2>

        <p className="text-ui-fg-subtle max-w-md">
          {isRTL ? (
            "ليس لديك أي طلبات حالياً. ابدأ التسوق لاكتشاف منتجاتنا المميزة!"
          ) : (
            "You haven't placed any orders yet. Start shopping to explore our amazing products!"
          )}
        </p>
      </div>

      <LocalizedClientLink href="/store" passHref>
        <Button
          data-testid="continue-shopping-button"
          className={clx(
            "mt-2 px-8 py-3 rounded-full bg-ui-button-primary hover:bg-ui-button-primary-hover text-ui-button-primary-text transition-all duration-200",
            {
              "whitespace-nowrap": isRTL
            }
          )}
        >
          {isRTL ? "تصفح المتجر" : "Browse Store"}
        </Button>
      </LocalizedClientLink>
    </div>
  )
}

export default OrderOverview