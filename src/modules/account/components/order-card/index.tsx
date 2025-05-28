import { Button, clx } from "@medusajs/ui"
import { useMemo } from "react"
import Thumbnail from "@modules/products/components/thumbnail"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { convertToLocale } from "@lib/util/money"
import { HttpTypes } from "@medusajs/types"
import { useLocale } from "next-intl"

type OrderCardProps = {
  order: HttpTypes.StoreOrder
}

const OrderCard = ({ order }: OrderCardProps) => {
  const locale = useLocale()
  const isRTL = locale === "ar"

  const numberOfLines = useMemo(() => {
    return order.items?.reduce((acc, item) => acc + item.quantity, 0) ?? 0
  }, [order])

  const numberOfProducts = order.items?.length ?? 0

  return (
    <div
      dir={isRTL ? "rtl" : "ltr"}
      className={clx(
        "bg-white rounded-xl shadow-sm border border-ui-border-base hover:shadow-md transition-all duration-200 ease-in-out",
        {
          "text-right": isRTL,
          "text-left": !isRTL
        }
      )}
      data-testid="order-card"
    >
      {/* Order Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center p-6 pb-4 gap-2">
        <div>
          <div className="text-large-semi mb-1 text-ui-fg-base flex items-center gap-2">
            <span className="text-ui-fg-subtle">{isRTL ? "طلب #" : "Order #"}</span>
            <span
              data-testid="order-display-id"
              className="text-ui-fg-interactive font-mono font-medium"
            >
              {order.display_id}
            </span>
          </div>

          <div className={clx("flex flex-wrap items-center text-small-regular text-ui-fg-muted gap-x-2", {
            "divide-x-reverse divide-x-0": isRTL
          })}>
            <span
              data-testid="order-created-at"
              className="pr-2 flex items-center gap-1"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {new Date(order.created_at).toLocaleDateString(locale, {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
              })}
            </span>
            <span
              data-testid="order-amount"
              className="px-2 font-medium text-ui-fg-base flex items-center gap-1"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {convertToLocale({
                amount: order.total,
                currency_code: order.currency_code,
              })}
            </span>
            <span className="pl-2 flex items-center gap-1">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {numberOfLines} {isRTL ?
                (numberOfLines > 1 ? "عناصر" : "عنصر") :
                (numberOfLines > 1 ? "items" : "item")}
            </span>
          </div>
        </div>

        <div className="hidden md:block mt-2 md:mt-0">
          <LocalizedClientLink href={`/account/orders/details/${order.id}`}>
            <Button
              data-testid="order-details-link"
              variant="secondary"
              className="min-w-[120px] hover:bg-ui-bg-base-hover transition-colors"
            >
              {isRTL ? "عرض التفاصيل" : "See details"}
            </Button>
          </LocalizedClientLink>
        </div>
      </div>

      {/* Order Items */}
      <div className={clx(
        "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 px-6 pb-6",
        {
          "border-t border-ui-border-base pt-6": numberOfProducts > 0
        }
      )}>
        {order.items?.slice(0, 4).map((i) => (
          <div
            key={i.id}
            className="flex flex-col gap-y-2 group"
            data-testid="order-item"
          >
            <div className="overflow-hidden rounded-lg bg-ui-bg-subtle border border-ui-border-base transition-all duration-200 group-hover:shadow-sm">
              <Thumbnail
                thumbnail={i.thumbnail}
                images={[]}
                size="full"
                className="transition-transform group-hover:scale-105 aspect-square object-cover"
              />
            </div>
            <div className={clx("flex items-center text-small-regular", {
              "flex-row-reverse": isRTL
            })}>
              <span
                className="text-ui-fg-base font-semibold line-clamp-1"
                data-testid="item-title"
              >
                {i.title}
              </span>
              <span className={clx("mx-1 text-ui-fg-muted", {
                "rotate-180": isRTL
              })}>×</span>
              <span className="text-ui-fg-muted" data-testid="item-quantity">{i.quantity}</span>
            </div>
          </div>
        ))}

        {numberOfProducts > 4 && (
          <div className="w-full h-full flex flex-col items-center justify-center bg-ui-bg-subtle rounded-lg border border-ui-border-base p-4 transition-all hover:bg-ui-bg-subtle-hover">
            <span className="text-small-regular text-ui-fg-base font-semibold">
              + {numberOfProducts - 4}
            </span>
            <span className="text-small-regular text-ui-fg-subtle">
              {isRTL ? "المزيد" : "more"}
            </span>
          </div>
        )}
      </div>

      {/* Status & Actions (mobile) */}
      <div className="flex md:hidden justify-between items-center p-4 border-t border-ui-border-base bg-ui-bg-subtle rounded-b-xl">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-ui-tag-green-bg"></div>
          <span className="text-small-regular text-ui-fg-base">
            {isRTL ? "مكتمل" : "Completed"}
          </span>
        </div>
        <LocalizedClientLink href={`/account/orders/details/${order.id}`}>
          <Button
            size="small"
            variant="secondary"
            className="text-small-regular hover:bg-ui-bg-base-hover"
          >
            {isRTL ? "التفاصيل" : "Details"}
          </Button>
        </LocalizedClientLink>
      </div>
    </div>
  )
}

export default OrderCard