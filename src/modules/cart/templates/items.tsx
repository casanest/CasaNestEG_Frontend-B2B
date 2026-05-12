import repeat from "@lib/util/repeat"
import { HttpTypes } from "@medusajs/types"
import { clx, Heading, Table } from "@medusajs/ui"

import Item from "@modules/cart/components/item"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import SkeletonLineItem from "@modules/skeletons/components/skeleton-line-item"
import { ArrowRight } from "lucide-react"
import { getLocale } from "next-intl/server"

type ItemsTemplateProps = {
  cart?: HttpTypes.StoreCart
}

const ItemsTemplate = async ({ cart }: ItemsTemplateProps) => {
  const locale = await getLocale()
  const isRTL = locale === "ar"
  const items = cart?.items 

  console.log(items, "cart items") // Debugging log to check the structure of cart items

  // Translations object
  const translations = {
    ar: {
      cartTitle: "سلة التسوق الخاصة بك",
      continueShopping: "متابعة التسوق",
      backToShopping: "العودة إلى المتجر",
      product: "المنتج",
      quantity: "الكمية",
      unitPrice: "سعر الوحدة",
      total: "الإجمالي",
      emptyCart: "سلة التسوق فارغة",
      startShopping: "ابدأ التسوق الآن"
    },
    en: {
      cartTitle: "Your Shopping Cart",
      continueShopping: "Continue Shopping",
      backToShopping: "Back to Store",
      product: "Product",
      quantity: "Quantity",
      unitPrice: "Unit Price",
      total: "Total",
      emptyCart: "Your cart is empty",
      startShopping: "Start Shopping Now"
    }
  }

  const t = translations[locale as keyof typeof translations] || translations.en

  return (
    <div dir={isRTL ? "rtl" : "ltr"} className={isRTL ? "text-right" : "text-left"}>
      <div className="pb-3 flex items-center justify-between">
        <Heading className="text-[1.5rem] md:text-[2rem] leading-[2.75rem] text-[#043364]">
          {t.cartTitle}
        </Heading>
        {items?.length ? (
          <LocalizedClientLink
            href="/store"
            className={clx(
              "flex items-center gap-x-1 text-blue-600 hover:text-blue-700 transition-colors text-xs md:text-sm",
              {
                "flex-row-reverse": isRTL
              }
            )}
          >
            {isRTL ? (
              <>
                <ArrowRight className="rotate-180" />
                <span>{t.backToShopping}</span>
              </>
            ) : (
              <>
                <span>{t.backToShopping}</span>
                <ArrowRight />
              </>
            )}
          </LocalizedClientLink>
        ) : null}
      </div>

      {items?.length ? (
        <Table className="w-full">
          <Table.Header className="border-t-0 text-[#043364]">
            <Table.Row className="text-ui-fg-subtle txt-medium-plus text-[#043364]">
              <Table.HeaderCell className={clx("!pl-5", {
                "text-right": isRTL,
                "text-left": !isRTL
              })}>{t.product}</Table.HeaderCell>
              <Table.HeaderCell></Table.HeaderCell>
              <Table.HeaderCell className={clx("!pr-5", {
                "text-right": isRTL,
                "text-left": !isRTL
              })}>{t.quantity}</Table.HeaderCell>
              <Table.HeaderCell className={clx("hidden small:table-cell", {
                "text-right": isRTL,
                "text-left": !isRTL
              })}>
                {t.unitPrice}
              </Table.HeaderCell>
              <Table.HeaderCell className={clx("!pr-5", {
                "text-right": isRTL,
                "text-left": !isRTL
              })}>
                {t.total}
              </Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body className="border-t-0 bg-white text-ui-fg-base px-5">
            {items
              ? items
                .sort((a, b) => {
                  return (a.created_at ?? "") > (b.created_at ?? "") ? -1 : 1
                })
                .map((item) => {
                  return (
                    <Item
                      key={item.id}
                      item={item}
                      currencyCode={cart?.currency_code}
                    />
                  )
                })
              : repeat(5).map((i) => {
                return <SkeletonLineItem key={i} />
              })}
          </Table.Body>
        </Table>
      ) : (
        <div className="py-8 flex flex-col items-center justify-center gap-4">
          <p className="text-lg text-ui-fg-subtle">{t.emptyCart}</p>
          <LocalizedClientLink
            href="/store"
            className={clx(
              "flex items-center gap-x-1 text-blue-600 hover:text-blue-700 transition-colors text-sm md:text-base",
              {
                "flex-row-reverse": isRTL
              }
            )}
          >
            {isRTL ? (
              <>
                <ArrowRight className="rotate-180" />
                <span>{t.startShopping}</span>
              </>
            ) : (
              <>
                <span>{t.startShopping}</span>
                <ArrowRight />
              </>
            )}
          </LocalizedClientLink>
        </div>
      )}
    </div>
  )
}

export default ItemsTemplate