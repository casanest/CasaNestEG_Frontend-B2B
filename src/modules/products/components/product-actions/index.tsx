"use client"

import { addToCart } from "@lib/data/cart"
import { useIntersection } from "@lib/hooks/use-in-view"
import { HttpTypes } from "@medusajs/types"
import { Button, clx } from "@medusajs/ui"
import Divider from "@modules/common/components/divider"
import OptionSelect from "@modules/products/components/product-actions/option-select"
import { isEqual } from "lodash"
import { useParams } from "next/navigation"
import { useEffect, useMemo, useRef, useState } from "react"
import ProductPrice from "../product-price"
import MobileActions from "./mobile-actions"
import { useLocale } from "next-intl"

type ProductActionsProps = {
  product: HttpTypes.StoreProduct
  region: HttpTypes.StoreRegion
  disabled?: boolean
}

const optionsAsKeymap = (
  variantOptions: HttpTypes.StoreProductVariant["options"]
) => {
  return variantOptions?.reduce((acc: Record<string, string>, varopt: any) => {
    acc[varopt.option_id] = varopt.value
    return acc
  }, {})
}

export default function ProductActions({
  product,
  disabled,
}: ProductActionsProps) {
  const [options, setOptions] = useState<Record<string, string | undefined>>({})
  const [isAdding, setIsAdding] = useState(false)
  const [quantity, setQuantity] = useState(1)
  const countryCode = useParams().countryCode as string
  const locale = useLocale()
  const isRTL = locale === "ar"
  // If there is only 1 variant, preselect the options
  useEffect(() => {
    if (product.variants?.length === 1) {
      const variantOptions = optionsAsKeymap(product.variants[0].options)
      setOptions(variantOptions ?? {})
    }
  }, [product.variants])

  const selectedVariant = useMemo(() => {
    if (!product.variants || product.variants.length === 0) {
      return
    }

    return product.variants.find((v) => {
      const variantOptions = optionsAsKeymap(v.options)
      return isEqual(variantOptions, options)
    })
  }, [product.variants, options])

  // update the options when a variant is selected
  const setOptionValue = (optionId: string, value: string) => {
    setOptions((prev) => ({
      ...prev,
      [optionId]: value,
    }))
  }

  //check if the selected options produce a valid variant
  const isValidVariant = useMemo(() => {
    return product.variants?.some((v) => {
      const variantOptions = optionsAsKeymap(v.options)
      return isEqual(variantOptions, options)
    })
  }, [product.variants, options])

  // check if the selected variant is in stock
  const inStock = useMemo(() => {
    // If we don't manage inventory, we can always add to cart
    if (selectedVariant && !selectedVariant.manage_inventory) {
      return true
    }

    // If we allow back orders on the variant, we can add to cart
    if (selectedVariant?.allow_backorder) {
      return true
    }

    // If there is inventory available, we can add to cart
    if (
      selectedVariant?.manage_inventory &&
      (selectedVariant?.inventory_quantity || 0) > 0
    ) {
      return true
    }

    // Otherwise, we can't add to cart
    return false
  }, [selectedVariant])

  const actionsRef = useRef<HTMLDivElement>(null)

  const inView = useIntersection(actionsRef, "0px")

  // add the selected variant to the cart
  const handleAddToCart = async () => {
    if (!selectedVariant?.id) return null

    setIsAdding(true)

    await addToCart({
      variantId: selectedVariant.id,
      quantity,
      countryCode,
    })

    setIsAdding(false)
  }

  return (
    <>
      <div className="flex flex-col gap-6" ref={actionsRef}>
        <ProductPrice product={product} variant={selectedVariant} />

        {/* <div className="rounded-xl border border-[#043364]/10 bg-white px-4 py-3 shadow-[0_16px_40px_-28px_rgba(2,8,23,0.5)]">
          <div className="flex items-center justify-between gap-3 text-sm text-slate-600">
            <span className="font-medium text-[#043364]">
              {isRTL ? "خطط تقسيط مرنة" : "Flexible installment plans"}
            </span>
            <span className="text-xs text-slate-400">
              {isRTL ? "حتى 12 شهر" : "Up to 12 months"}
            </span>
          </div>
        </div> */}

        {(product.variants?.length ?? 0) > 1 && (
          <div className="flex flex-col gap-4">
            {(product.options || []).map((option) => {
              return (
                <div key={option.id}>
                  <OptionSelect
                    option={option}
                    current={options[option.id]}
                    updateOption={setOptionValue}
                    title={option.title ?? ""}
                    data-testid="product-options"
                    disabled={!!disabled || isAdding}
                  />
                </div>
              )
            })}
            <Divider />
          </div>
        )}

        <div className="flex items-center justify-between gap-4">
          <span className="text-sm font-semibold text-slate-700">
            {isRTL ? "الكمية" : "Quantity"}
          </span>
          <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-2 py-1 shadow-sm">
            <button
              type="button"
              onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
              className="h-8 w-8 rounded-full text-lg font-semibold text-slate-600 transition hover:bg-slate-100"
            >
              -
            </button>
            <span className="min-w-[2rem] text-center text-sm font-semibold text-slate-800">
              {quantity}
            </span>
            <button
              type="button"
              onClick={() => setQuantity((prev) => Math.min(99, prev + 1))}
              className="h-8 w-8 rounded-full text-lg font-semibold text-slate-600 transition hover:bg-slate-100"
            >
              +
            </button>
          </div>
        </div>

        <Button
          onClick={handleAddToCart}
          disabled={
            !inStock ||
            !selectedVariant ||
            !!disabled ||
            isAdding ||
            !isValidVariant
          }
          className={clx(
            "w-full h-12 rounded-xl bg-[#043364] text-white text-base font-semibold transition-all hover:bg-[#0a3a73] hover:shadow-[0_18px_45px_-20px_rgba(4,51,100,0.7)]",
            isRTL && "tracking-[0.05em]"
          )}
          isLoading={isAdding}
          data-testid="add-product-button"
        >
          {!selectedVariant && !options
            ? locale === "ar"
              ? "اختر خيارًا"
              : "Select an option"
            : !inStock || !isValidVariant
              ? locale === "ar"
                ? "غير متوفر"
                : "Out of stock"
              : locale === "ar"
                ? "أضف إلى السلة"
                : "Add to cart"}
        </Button>
        <MobileActions
          product={product}
          variant={selectedVariant}
          options={options}
          updateOptions={setOptionValue}
          inStock={inStock}
          handleAddToCart={handleAddToCart}
          isAdding={isAdding}
          show={!inView}
          optionsDisabled={!!disabled || isAdding}
        />
      </div>
    </>
  )
}
