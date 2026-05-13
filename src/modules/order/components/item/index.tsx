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

  const localizedTitle =
    isRTL
      ? (item.product?.metadata?.localizations?.ar?.title as string) ||
      item.product_title
      : item.product_title

  return (
    <Table.Row
      dir={isRTL ? "rtl" : "ltr"}
      className="w-full border-b border-gray-100"
      data-testid="product-row"
    >
      {/* Product Thumbnail */}
      <Table.Cell className="py-5 px-4 align-middle w-[110px]">
        <div
          className={clx(
            "w-20 h-20 rounded-xl overflow-hidden border border-gray-200 bg-white shadow-sm",
            {
              "ml-auto": isRTL,
              "mr-auto": !isRTL,
            }
          )}
        >
          <Thumbnail
            thumbnail={item.thumbnail}
            images={item.variant?.product?.images}
            size="square"
            className="w-full h-full object-cover"
            data-testid="product-thumbnail"
          />
        </div>
      </Table.Cell>

      {/* Product Info */}
      <Table.Cell
        className={clx("py-5 px-2 align-middle", {
          "text-right": isRTL,
          "text-left": !isRTL,
        })}
      >
        <Text
          className="text-[15px] font-semibold text-[#043364] leading-snug"
          data-testid="product-name"
        >
          {localizedTitle}
        </Text>

        {item.variant?.title &&
          item.variant.title.trim().toLowerCase() !== "default variant" && (
            <div className="mt-2">
              <LineItemOptions
                variant={item.variant}
                data-testid="product-variant"
              />
            </div>
          )}
      </Table.Cell>

      {/* Quantity + Pricing */}
      <Table.Cell className="py-5 px-4 align-middle min-w-[170px]">
        <div
          className={clx("flex flex-col gap-2", {
            "items-start text-right": isRTL,
            "items-end text-left": !isRTL,
          })}
        >
          {/* Quantity + Unit Price */}
          <div
            className={clx(
              "flex items-center text-sm text-gray-500 font-medium gap-1.5",
              {
                "flex-row-reverse": isRTL,
              }
            )}
          >
            <span
              className="text-gray-600"
              data-testid="product-quantity"
            >
              {item.quantity} ×
            </span>

            <LineItemUnitPrice
              item={item}
              style="tight"
              currencyCode={currencyCode}
            />
          </div>

          {/* Total Price */}
          <div className="text-base font-semibold text-[#022a55]">
            <LineItemPrice
              item={item}
              style="tight"
              currencyCode={currencyCode}
            />
          </div>
        </div>
      </Table.Cell>
    </Table.Row>
  )
}

export default Item