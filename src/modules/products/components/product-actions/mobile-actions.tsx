import { Dialog, Transition } from "@headlessui/react"
import { clx } from "@medusajs/ui"
import React, { Fragment, useMemo } from "react"
import { useLocale } from "next-intl"
import { Minus, Plus } from "lucide-react"

import useToggleState from "@lib/hooks/use-toggle-state"
import X from "@modules/common/icons/x"

import { getProductPrice } from "@lib/util/get-product-price"
import OptionSelect from "./option-select"
import { HttpTypes } from "@medusajs/types"

type MobileActionsProps = {
  product: HttpTypes.StoreProduct
  variant?: HttpTypes.StoreProductVariant
  options: Record<string, string | undefined>
  updateOptions: (title: string, value: string) => void
  inStock?: boolean
  handleAddToCart: () => void
  isAdding?: boolean
  optionsDisabled: boolean
  quantity: number
  onQuantityChange: (q: number) => void
  minOrderQty: number
}

const MobileActions: React.FC<MobileActionsProps> = ({
  product,
  variant,
  options,
  updateOptions,
  inStock,
  handleAddToCart,
  isAdding,
  optionsDisabled,
  quantity,
  onQuantityChange,
  minOrderQty,
}) => {
  const locale = useLocale()
  const isRTL = locale === "ar"
  const { state, open, close } = useToggleState()

  const price = getProductPrice({
    product: product,
    variantId: variant?.id,
  })

  const selectedPrice = useMemo(() => {
    if (!price) {
      return null
    }
    const { variantPrice, cheapestPrice } = price
    if (variant) {
      return variantPrice || null
    }
    return cheapestPrice || null
  }, [price, variant])

  const hasPrice = !!selectedPrice
  const mainNumber = selectedPrice?.calculated_price_number ?? 0
  const formattedNumber = mainNumber.toLocaleString(isRTL ? "ar-EG" : "en-US")
  const decimalPart = mainNumber % 1 === 0 ? ".00" : ""
  const isSale = selectedPrice?.price_type === "sale"

  return (
    <>
      {/* Fixed bottom bar — single row matching Figma mobile design */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-[#e5e7eb] shadow-[0_-4px_6px_rgba(0,0,0,0.05)] px-[16px] py-[12px] flex items-center gap-[16px]">
        {/* Price Column */}
        <div className="flex flex-col gap-[2px] shrink-0">
          {hasPrice ? (
            <>
              <div className="flex items-baseline gap-[2px] text-[#17284a]">
                <span className="text-[12px] font-medium">
                  {isRTL ? "ج.م" : "EGP"}
                </span>
                <span className="text-[20px] font-bold leading-[1.4]">
                  {formattedNumber}
                </span>
                <span className="text-[12px] font-medium">{decimalPart}</span>
              </div>
              {isSale && selectedPrice?.original_price && (
                <span className="text-[12px] text-[#707176] line-through">
                  {selectedPrice.original_price}
                </span>
              )}
            </>
          ) : (
            <span className="text-[14px] font-bold text-[#17284a] whitespace-nowrap">
              {isRTL ? "اطلب عرض سعر" : "Request a Quote"}
            </span>
          )}
        </div>

        {/* Quantity Box */}
        <div className="flex items-center gap-[12px] rounded-[8px] border border-[#e5e7eb] bg-white p-[8px] shrink-0">
          <button
            type="button"
            onClick={() => onQuantityChange(Math.max(minOrderQty, quantity - 1))}
            className="text-[#707176] hover:text-[#17284a] transition-colors"
          >
            <Minus className="w-5 h-5" />
          </button>
          <span className="min-w-[1.5rem] text-center text-[14px] font-bold text-[#1c1b1c]">
            {quantity}
          </span>
          <button
            type="button"
            onClick={() => onQuantityChange(Math.min(99, quantity + 1))}
            className="text-[#707176] hover:text-[#17284a] transition-colors"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>

        {/* Request a Quote Button */}
        <button
          onClick={handleAddToCart}
          disabled={!inStock || !variant || isAdding}
          className={clx(
            "flex-1 rounded-[10px] bg-[#17284a] text-white text-[13px] font-medium flex items-center justify-center transition-colors hover:bg-[#0f1d35] py-[16px] px-[36px]",
            isRTL && "tracking-[0.05em]"
          )}
          data-testid="mobile-cart-button"
        >
          {!variant
            ? isRTL ? "اختر النوع" : "Select variant"
            : !inStock
              ? isRTL ? "غير متوفر" : "Out of stock"
              : isAdding
                ? isRTL ? "جارٍ..." : "Sending..."
                : isRTL ? "اطلب عرض سعر" : "Request a Quote"}
        </button>
      </div>

      {/* Options Modal */}
      <Transition appear show={state} as={Fragment}>
        <Dialog as="div" className="relative z-[75]" onClose={close}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-700 bg-opacity-75 backdrop-blur-sm" />
          </Transition.Child>

          <div className="fixed bottom-0 inset-x-0">
            <div className="flex min-h-full h-full items-center justify-center text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <Dialog.Panel
                  className="w-full h-full transform overflow-hidden text-left flex flex-col gap-y-3"
                  data-testid="mobile-actions-modal"
                >
                  <div className="w-full flex justify-end pr-6">
                    <button
                      onClick={close}
                      className="bg-white w-12 h-12 rounded-full text-ui-fg-base flex justify-center items-center"
                      data-testid="close-modal-button"
                    >
                      <X />
                    </button>
                  </div>
                  <div className="bg-white px-6 py-12">
                    {(product.variants?.length ?? 0) > 1 && (
                      <div className="flex flex-col gap-y-6">
                        {(product.options || []).map((option) => {
                          return (
                            <div key={option.id}>
                              <OptionSelect
                                option={option}
                                current={options[option.id]}
                                updateOption={updateOptions}
                                title={option.title ?? ""}
                                disabled={optionsDisabled}
                              />
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  )
}

export default MobileActions
