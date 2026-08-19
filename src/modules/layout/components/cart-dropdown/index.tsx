"use client"

import {
  Popover,
  PopoverButton,
  PopoverPanel,
  Transition,
} from "@headlessui/react"
import { convertToLocale } from "@lib/util/money"
import { HttpTypes } from "@medusajs/types"
import { Button } from "@medusajs/ui"
import DeleteButton from "@modules/common/components/delete-button"
import LineItemOptions from "@modules/common/components/line-item-options"
import LineItemPrice from "@modules/common/components/line-item-price"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Thumbnail from "@modules/products/components/thumbnail"
import { FilePlus } from "lucide-react"
import { usePathname } from "next/navigation"
import { Fragment, useEffect, useRef, useState } from "react"

const CartDropdown = ({
  cart: cartState,
  locale,
}: {
  cart?: HttpTypes.StoreCart | null
  locale: string
}) => {
  const [activeTimer, setActiveTimer] = useState<NodeJS.Timeout | undefined>()
  const [cartDropdownOpen, setCartDropdownOpen] = useState(false)

  const pathname = usePathname()
  const isRTL = locale === "ar"

  const totalItems =
    cartState?.items?.reduce((acc, item) => acc + item.quantity, 0) || 0

  const subtotal = cartState?.subtotal ?? 0
  const itemRef = useRef<number>(totalItems)

  const open = () => setCartDropdownOpen(true)
  const close = () => setCartDropdownOpen(false)

  const timedOpen = () => {
    open()

    const timer = setTimeout(() => {
      close()
    }, 5000)

    setActiveTimer(timer)
  }

  const openAndCancel = () => {
    if (activeTimer) {
      clearTimeout(activeTimer)
    }

    open()
  }

  useEffect(() => {
    return () => {
      if (activeTimer) {
        clearTimeout(activeTimer)
      }
    }
  }, [activeTimer])

  useEffect(() => {
    if (itemRef.current !== totalItems && !pathname.includes("/cart")) {
      timedOpen()
      itemRef.current = totalItems
    }
  }, [totalItems, pathname])

  return (
    <div
      className="relative h-full z-50"
      onMouseEnter={openAndCancel}
      onMouseLeave={close}
      dir={isRTL ? "rtl" : "ltr"}
    >
      <Popover className="relative h-full">
        <PopoverButton className="h-full focus:outline-none">
          <LocalizedClientLink
            href="/cart"
            data-testid="nav-cart-link"
            className="relative flex items-center gap-2 bg-[#dce3f0] px-4 py-2 rounded-xl text-[16px] font-medium text-black hover:bg-[#c9d4ea] transition-colors"
          >
            {isRTL ? "عروض الأسعار" : "Quote List"}
            <div className="relative flex items-center">
              <FilePlus className="w-5 h-5 text-[#17284a]" />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 min-w-[18px] h-[18px] px-1 flex items-center justify-center rounded-full bg-[#17284a] text-white text-[12px] font-medium leading-none">
                  {totalItems}
                </span>
              )}
            </div>
          </LocalizedClientLink>
        </PopoverButton>

        <Transition
          show={cartDropdownOpen}
          as={Fragment}
        // enter="transition duration-200 ease-out"
        // enterFrom="opacity-0 translate-y-2"
        // enterTo="opacity-100 translate-y-0"
        // leave="transition duration-150 ease-in"
        // leaveFrom="opacity-100 translate-y-0"
        // leaveTo="opacity-0 translate-y-2"
        >
          <PopoverPanel
            static
            data-testid="nav-cart-dropdown"
            className={`hidden small:block absolute top-[calc(100%)] ${isRTL ? "left-0" : "right-0"
              } w-[430px]  border border-gray-200 bg-white shadow-2xl overflow-hidden`}
          >
            {/* Header */}
            <div className="px-6 py-5 border-b border-gray-100 bg-gray-50">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-[#043364]">
                  {isRTL ? "سلة التسوق" : "Shopping Cart"}
                </h3>

                <span className="text-sm text-gray-500">
                  {totalItems} {isRTL ? "منتج" : "items"}
                </span>
              </div>
            </div>

            {cartState && cartState.items?.length ? (
              <>
                {/* Items */}
                <div className="max-h-[420px] overflow-y-auto px-6 py-5 space-y-6">
                  {cartState.items
                    .sort((a, b) =>
                      (a.created_at ?? "") > (b.created_at ?? "") ? -1 : 1
                    )
                    .map((item) => (
                      <div
                        key={item.id}
                        data-testid="cart-item"
                        className="flex gap-4 border-b border-gray-100 pb-5 last:border-none"
                      >
                        <LocalizedClientLink
                          href={`/products/${item.product_handle}`}
                          className="shrink-0"
                        >
                          <div className="w-24 rounded-xl overflow-hidden border border-gray-100">
                            <Thumbnail
                              thumbnail={item.thumbnail}
                              images={item.variant?.product?.images}
                              size="square"
                            />
                          </div>
                        </LocalizedClientLink>

                        <div className="flex-1 flex flex-col justify-between min-w-0">
                          <div className="flex justify-between gap-4">
                            <div className="min-w-0">
                              <h4 className="text-sm font-medium text-gray-900 truncate">
                                <LocalizedClientLink
                                  href={`/products/${item.product_handle}`}
                                >
                                  {isRTL
                                    ? ((item.product?.metadata as any)?.localizations?.ar
                                      ?.title as string) ??
                                    item.product_title
                                    : item.product_title}
                                </LocalizedClientLink>
                              </h4>
                              {item.variant?.title &&
                                item.variant.title.trim().toLowerCase() !== "default variant" && (
                                  // <LineItemOptions
                                  //   variant={item.variant}
                                  //   data-testid="product-variant"
                                  // />
                                  <div className="mt-1 text-sm text-gray-500">
                                    <LineItemOptions
                                      variant={item.variant}
                                      data-testid="cart-item-variant"
                                      data-value={item.variant}
                                    />
                                  </div>
                                )}


                              <p className="text-sm text-gray-500 mt-1">
                                {isRTL ? "الكمية" : "Qty"}: {item.quantity}
                              </p>
                            </div>

                            <div className="text-right">
                              <LineItemPrice
                                item={item}
                                style="tight"
                                currencyCode={cartState.currency_code}
                              />
                              <DeleteButton
                                id={item.id}
                                className="mt-3 text-sm text-red-500 hover:text-red-600"
                                data-testid="cart-item-remove-button"
                              >
                                {isRTL ? "إزالة" : "Remove"}
                              </DeleteButton>
                            </div>
                          </div>


                        </div>
                      </div>
                    ))}
                </div>

                {/* Footer */}
                <div className="border-t border-gray-100 px-6 py-5 bg-gray-50">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-sm font-medium text-gray-700">
                        {isRTL ? "المجموع الفرعي" : "Subtotal"}
                      </p>
                      <p className="text-xs text-gray-500">
                        {isRTL ? "بدون الضرائب" : "Excl. taxes"}
                      </p>
                    </div>

                    <span
                      className="text-lg font-semibold text-[#043364]"
                      data-testid="cart-subtotal"
                      data-value={subtotal}
                    >
                      {convertToLocale({
                        amount: subtotal,
                        currency_code: cartState.currency_code,
                      })}
                    </span>
                  </div>

                  <LocalizedClientLink href="/cart">
                    <Button
                      size="large"
                      data-testid="go-to-cart-button"
                      className="w-full h-12 rounded-xl bg-[#043364] text-white hover:bg-[#032850] hover:text-white transition"
                    >
                      {isRTL ? "الذهاب إلى السلة" : "Go to Cart"}
                    </Button>
                  </LocalizedClientLink>
                </div>
              </>
            ) : (
              /* Empty State */
              <div className="px-6 py-16 flex flex-col items-center text-center">
                <div className="w-14 h-14 rounded-full bg-[#043364] text-white flex items-center justify-center text-lg font-bold shadow">
                  0
                </div>

                <h3 className="mt-6 text-lg font-semibold text-gray-900">
                  {isRTL ? "سلة التسوق فارغة" : "Your cart is empty"}
                </h3>

                <p className="mt-2 text-sm text-gray-500 max-w-[280px]">
                  {isRTL
                    ? "يبدو أنك لم تضف أي منتجات إلى سلة التسوق بعد."
                    : "Looks like you haven't added anything to your cart yet."}
                </p>

                <div className="mt-6">
                  <LocalizedClientLink href="/store">
                    <Button
                      onClick={close}
                      className="rounded-xl bg-[#043364] text-white px-8 h-11 hover:bg-[#032850] hover:text-white"
                    >
                      {isRTL ? "اذهب إلى المنتجات" : "Go to Products"}
                    </Button>
                  </LocalizedClientLink>
                </div>
              </div>
            )}
          </PopoverPanel>
        </Transition>
      </Popover>
    </div>
  )
}

export default CartDropdown