"use client"

import {
  Popover,
  PopoverButton,
  PopoverPanel,
  Transition,
} from "@headlessui/react"
import { convertToLocale } from "@lib/util/money"
import { Button } from "@medusajs/ui"
import { useCartStore, QuoteItem } from "@lib/store/useCartStore"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Thumbnail from "@modules/products/components/thumbnail"
import { FilePlus } from "lucide-react"
import { Fragment, useEffect, useState } from "react"

const CartDropdown = ({
  locale,
}: {
  locale: string
}) => {
  const [cartDropdownOpen, setCartDropdownOpen] = useState(false)

  const isRTL = locale === "ar"

  const items = useCartStore((state) => state.items)
  const removeItem = useCartStore((state) => state.removeItem)

  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0)

  const subtotal = items.reduce((acc, item) => acc + (item.unitPrice ?? 0) * item.quantity, 0)
  const currencyCode = items[0]?.currencyCode || "usd"

  const open = () => setCartDropdownOpen(true)
  const close = () => setCartDropdownOpen(false)

  useEffect(() => {
    window.dispatchEvent(new CustomEvent("cart-dropdown-state", { detail: { open: cartDropdownOpen } }))
  }, [cartDropdownOpen])

  return (
    <div
      className="relative h-full z-50"
      onMouseEnter={open}
      onMouseLeave={close}
      dir={isRTL ? "rtl" : "ltr"}
    >
      <Popover className="relative h-full">
        <PopoverButton className="h-full focus:outline-none">
          <LocalizedClientLink
            href="/cart"
            data-testid="nav-cart-link"
            className="relative flex items-center gap-2 bg-[#DCE3F0] px-4 py-2 rounded-xl text-[16px] font-medium text-black hover:bg-[#c9d4ea] transition-colors"
            style={{ fontFamily: "Satoshi, sans-serif", height: "40px" }}
          >
            {isRTL ? "طلب عرض سعر" : "Request a Quote"}
            <div className="w-px h-[15px] bg-black opacity-20" />
            <div className="relative flex items-center">
              <FilePlus className="w-6 h-6 text-black" strokeWidth={1.5} />
              {totalItems > 0 && (
                <span
                  className="absolute flex items-center justify-center rounded-full bg-[#17284A] text-white text-[12px] font-medium leading-none"
                  style={{
                    fontFamily: "Satoshi, sans-serif",
                    fontWeight: 500,
                    width: "14px",
                    height: "14px",
                    left: "17px",
                    top: "-6px",
                  }}
                >
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

            {items.length ? (
              <>
                {/* Items */}
                <div className="max-h-[420px] overflow-y-auto px-6 py-5 space-y-6">
                  {[...items]
                    .sort((a, b) =>
                      (a.createdAt ?? "") > (b.createdAt ?? "") ? -1 : 1
                    )
                    .map((item: QuoteItem) => (
                      <div
                        key={item.id}
                        data-testid="cart-item"
                        className="flex gap-4 border-b border-gray-100 pb-5 last:border-none"
                      >
                        <LocalizedClientLink
                          href={`/products/${item.productHandle}`}
                          className="shrink-0"
                        >
                          <div className="w-24 rounded-xl overflow-hidden border border-gray-100">
                            <Thumbnail
                              thumbnail={item.thumbnail}
                              images={item.images}
                              size="square"
                            />
                          </div>
                        </LocalizedClientLink>

                        <div className="flex-1 flex flex-col justify-between min-w-0">
                          <div className="flex justify-between gap-4">
                            <div className="min-w-0">
                              <h4 className="text-sm font-medium text-gray-900 truncate">
                                <LocalizedClientLink
                                  href={`/products/${item.productHandle}`}
                                >
                                  {isRTL
                                    ? item.productTitleAr ?? item.productTitle
                                    : item.productTitle}
                                </LocalizedClientLink>
                              </h4>
                              {item.variantTitle &&
                                item.variantTitle.trim().toLowerCase() !== "default variant" && (
                                  <div className="mt-1 text-sm text-gray-500">
                                    {isRTL
                                      ? (item.variantTitleAr ?? item.variantTitle)
                                      : item.variantTitle}
                                  </div>
                                )}


                              <p className="text-sm text-gray-500 mt-1">
                                {isRTL ? "الكمية" : "Qty"}: {item.quantity}
                              </p>
                            </div>

                            <div className="text-right">
                              {item.unitPrice != null ? (
                                <span className="text-sm font-semibold text-gray-900">
                                  {convertToLocale({
                                    amount: item.unitPrice * item.quantity,
                                    currency_code: item.currencyCode,
                                    locale,
                                  })}
                                </span>
                              ) : (
                                <span className="text-sm text-gray-500">
                                  {isRTL ? "السعر عند الطلب" : "Price on Request"}
                                </span>
                              )}
                              <button
                                onClick={() => removeItem(item.id)}
                                className="mt-3 block text-sm text-red-500 hover:text-red-600"
                                data-testid="cart-item-remove-button"
                              >
                                {isRTL ? "إزالة" : "Remove"}
                              </button>
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
                      {subtotal > 0
                        ? convertToLocale({
                            amount: subtotal,
                            currency_code: currencyCode,
                            locale,
                          })
                        : isRTL ? "السعر عند الطلب" : "Price on Request"}
                    </span>
                  </div>

                  <LocalizedClientLink href="/cart">
                    <Button
                      size="large"
                      data-testid="go-to-cart-button"
                      className="w-full h-12 rounded-xl bg-[#043364] text-white hover:bg-[#032850] hover:text-white transition"
                    >
                      {isRTL ? "الذهاب إلى عرض السعر" : "Go to Quote"}
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