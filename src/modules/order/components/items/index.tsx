import repeat from "@lib/util/repeat"
import { HttpTypes } from "@medusajs/types"
import { Table } from "@medusajs/ui"

import Divider from "@modules/common/components/divider"
import Item from "@modules/order/components/item"
import SkeletonLineItem from "@modules/skeletons/components/skeleton-line-item"

type ItemsProps = {
  order: HttpTypes.StoreOrder
  locale: string
}

const Items = ({ order, locale }: ItemsProps) => {
  const items = order.items

  const isRTL = locale === "ar"

  return (
    <div className="flex flex-col border border-gray-200 rounded-2xl overflow-hidden">

      <div className="px-6 pt-6">
        <h2 className="text-lg font-bold text-[#043364] mb-2">
          🛒 {(order.items?.length ?? 0) > 1 ? isRTL ?
            "المنتجات" : "Items" : isRTL ?
            "المنتج" : "Item"
          }
        </h2>
      </div>

      <Divider className="!mb-0" />
      <Table>
        <Table.Body data-testid="products-table">
          {items?.length
            ? items
              .sort((a, b) => {
                return (a.created_at ?? "") > (b.created_at ?? "") ? -1 : 1
              })
              .map((item) => {
                return (
                  <Item 
                    key={item.id}
                    item={item}
                    currencyCode={order.currency_code}
                  />
                )
              })
            : repeat(5).map((i) => {
              return <SkeletonLineItem key={i} />
            })}
        </Table.Body>
      </Table>
    </div>
  )
}

export default Items
