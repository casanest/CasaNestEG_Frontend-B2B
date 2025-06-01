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
      className="w-full px-2"
      data-testid="product-row"
    >
      {/* صورة المنتج */}
      <Table.Cell className={clx("p-4 align-middle w-24", {
        // "!pr-0": isRTL,
        // "!pl-0": !isRTL,
      })}>
        <div className={clx("w-16 h-16 overflow-hidden rounded-lg border border-gray-200 ", {
          "ml-auto": isRTL,
          "mr-auto": !isRTL,
        })}>
          <Thumbnail thumbnail={item.thumbnail} size="square" />
        </div>
      </Table.Cell>

      {/* عنوان المنتج + الخيارات */}
      <Table.Cell className={clx("align-middle", {
        "text-right": isRTL,
        "text-left": !isRTL,
      })}>
        <Text className="font-semibold text-base text-[#043364]" data-testid="product-name">
          {item.title}
        </Text>
        <LineItemOptions variant={item.variant} data-testid="product-variant" />
      </Table.Cell>

      {/* السعر + العدد */}
      <Table.Cell className={clx("align-middle", {
        // "!pl-0": isRTL,
        // "!pr-0": !isRTL,
      })}>
        <div className={clx("flex flex-col justify-center items-end gap-y-1", {
          "items-start": isRTL,
        })}>
          <div className={clx("flex items-center text-sm text-gray-500", {
            "flex-row-reverse": isRTL,
            "gap-x-1": !isRTL,
            "gap-x-reverse": isRTL,
          })}>
            <span className="text-gray-600" data-testid="product-quantity">
              {item.quantity}x
            </span>
            <LineItemUnitPrice
              item={item}
              style="tight"
              currencyCode={currencyCode}
            />
          </div>

          <LineItemPrice
            item={item}
            style="tight"
            currencyCode={currencyCode}
          />
        </div>
      </Table.Cell>
    </Table.Row>
  )
}

export default Item
