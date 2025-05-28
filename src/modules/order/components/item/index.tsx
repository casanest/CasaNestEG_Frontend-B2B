import { HttpTypes } from "@medusajs/types"
import { Table, Text, clx } from "@medusajs/ui"
import LineItemOptions from "@modules/common/components/line-item-options"
import LineItemPrice from "@modules/common/components/line-item-price"
import LineItemUnitPrice from "@modules/common/components/line-item-unit-price"
import Thumbnail from "@modules/products/components/thumbnail"
import { useLocale } from "next-intl"

type ItemProps = {
  item: HttpTypes.StoreCartLineItem | HttpTypes.StoreOrderLineItem
  currencyCode: string
}

const Item = ({ item, currencyCode }: ItemProps) => {
  const locale = useLocale()
  const isRTL = locale === "ar"

  return (
    <Table.Row
      dir={isRTL ? "rtl" : "ltr"}
      className="w-full"
      data-testid="product-row"
    >
      <Table.Cell className={clx("p-4 w-24", {
        "!pr-0": isRTL,
        "!pl-0": !isRTL
      })}>
        <div className={clx("flex", {
          "w-16": true,
          "ml-auto": isRTL,
          "mr-auto": !isRTL
        })}>
          <Thumbnail thumbnail={item.thumbnail} size="square" />
        </div>
      </Table.Cell>

      <Table.Cell className={clx({
        "text-right": isRTL,
        "text-left": !isRTL
      })}>
        <Text
          className="txt-medium-plus text-ui-fg-base"
          data-testid="product-name"
        >
          {item.title}
        </Text>
        <LineItemOptions variant={item.variant} data-testid="product-variant" />
      </Table.Cell>

      <Table.Cell className={clx({
        "!pl-0": isRTL,
        "!pr-0": !isRTL
      })}>
        <span className={clx("flex flex-col h-full justify-center", {
          // "items-start": isRTL,
          "items-end": !isRTL
        })}>
          <span className={clx("flex", {
            "flex-row-reverse": isRTL,
            "gap-x-1": !isRTL,
          })}>
            <Text className="text-ui-fg-muted">
              <span data-testid="product-quantity">{item.quantity}</span>x{" "}
            </Text>
            <LineItemUnitPrice
              item={item}
              style="tight"
              currencyCode={currencyCode}
            />
          </span>

          <LineItemPrice
            item={item}
            style="tight"
            currencyCode={currencyCode}
          />
        </span>
      </Table.Cell>
    </Table.Row>
  )
}

export default Item