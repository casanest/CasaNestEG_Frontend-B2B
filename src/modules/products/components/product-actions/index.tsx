"use client"

import { useCartStore } from "@lib/store/useCartStore"
import { HttpTypes } from "@medusajs/types"
import { clx } from "@medusajs/ui"
import OptionSelect from "@modules/products/components/product-actions/option-select"
import { isEqual } from "lodash"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useMemo, useState } from "react"
import ProductPrice from "../product-price"
import MobileActions from "./mobile-actions"
import { useLocale } from "next-intl"
import { Minus, Plus, Truck, ShieldCheck } from "lucide-react"
import { getPricesForVariant } from "@lib/util/get-product-price"
import { normalizeProductImageUrl } from "@lib/util/product-image-url"

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

  // Read Minimum Order Quantity from the top-level `moq` field first,
  // then fall back to product metadata ("min_order_qty" or "MOQ" keys).
  // Defaults to 1 when not set.
  const rawMoq =
    (product as any).moq ||
    (product.metadata?.min_order_qty as string | number) ||
    (product.metadata?.MOQ as string | number)
  const minOrderQty = (() => {
    if (!rawMoq) return 1
    const parsed = parseInt(String(rawMoq), 10)
    return isNaN(parsed) || parsed < 1 ? 1 : parsed
  })()

  const rawWarranty = product.metadata?.Warranty != null ? String(product.metadata.Warranty) : null
  const warrantyNum = rawWarranty ? (rawWarranty.match(/\d+/)?.[0] ?? null) : null

  const [quantity, setQuantity] = useState(minOrderQty)
  const countryCode = useParams().countryCode as string
  const locale = useLocale() as string
  const isRTL = locale === "ar"
  const router = useRouter()

  const handleRequestQuote = () => {
    router.push(`/${locale}/${countryCode}/products/${product.handle}/request-quote`)
  }

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

  const setOptionValue = (optionId: string, value: string) => {
    setOptions((prev) => ({
      ...prev,
      [optionId]: value,
    }))
  }

  const isValidVariant = useMemo(() => {
    return product.variants?.some((v) => {
      const variantOptions = optionsAsKeymap(v.options)
      return isEqual(variantOptions, options)
    })
  }, [product.variants, options])

  const inStock = useMemo(() => {
    if (selectedVariant && !selectedVariant.manage_inventory) {
      return true
    }
    if (selectedVariant?.allow_backorder) {
      return true
    }
    if (
      selectedVariant?.manage_inventory &&
      (selectedVariant?.inventory_quantity || 0) > 0
    ) {
      return true
    }
    return false
  }, [selectedVariant])

  const addItem = useCartStore((state) => state.addItem)
  const openCartDropdown = useCartStore((state) => state.openCartDropdown)
  const [isAddingToList, setIsAddingToList] = useState(false)

  const handleAddToCart = async () => {
    if (!selectedVariant?.id) return null

    setIsAdding(true)

    const variant = selectedVariant as any
    const priceInfo = getPricesForVariant(variant)
    const category = product.categories?.[0] as any

    addItem({
      productId: product.id,
      variantId: selectedVariant.id,
      productHandle: product.handle || "",
      productTitle: product.title,
      productTitleAr: (product.metadata as any)?.localizations?.ar?.title as string | undefined,
      productDescription: product.description || undefined,
      productDescriptionAr: (product.metadata as any)?.localizations?.ar?.description as string | undefined,
      thumbnail: product.thumbnail || null,
      images: (product.images || []).filter((img) => Boolean(img?.url)).map((img) => ({ url: normalizeProductImageUrl(img.url!) })),
      quantity,
      variantTitle: variant?.title,
      variantTitleAr: (variant?.metadata as any)?.localizations?.ar?.title as string | undefined,
      variantOptions: variant?.options?.map((opt: any) => ({ option_id: opt.option_id, value: opt.value, metadata: opt.metadata })),
      variantMetadata: variant?.metadata,
      productMetadata: product.metadata as any,
      unitPrice: priceInfo?.calculated_price_number ?? null,
      originalPrice: priceInfo?.original_price_number ?? null,
      currencyCode: priceInfo?.currency_code || "usd",
      categoryName: category?.name,
      categoryNameAr: category?.metadata?.localizations?.ar?.name as string | undefined,
      categoryMetadata: category?.metadata,
      manageInventory: variant?.manage_inventory,
      allowBackorder: variant?.allow_backorder,
      inventoryQuantity: variant?.inventory_quantity,
      minOrderQty: minOrderQty > 1 ? minOrderQty : undefined,
    })

    setIsAdding(false)
  }

  const handleAddToQuoteList = async () => {
    if (!selectedVariant?.id) return
    await handleAddToCart()
    openCartDropdown()
    setIsAddingToList(true)
    setTimeout(() => setIsAddingToList(false), 2000)
  }

  return (
    <>
      <div className="flex flex-col gap-6">
        {/* Boxed section: Options + Quantity + Price + Buttons + Trust Points — desktop only */}
        <div className="hidden lg:flex flex-col gap-5 rounded-[16px] border border-[#e5e7eb] bg-[#f8f9fa] p-5">
          {/* Options */}
          {(product.variants?.length ?? 0) > 1 && (
            <div className="flex flex-col gap-5">
              {(product.options || []).map((option) => {
                return (
                  <div key={option.id} className="flex flex-col gap-2">
                    <span className="text-[14px] font-bold text-[#1c1b1c]">
                      {option.title}
                    </span>
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
            </div>
          )}

          {/* Quantity Selector */}
          <div className="flex flex-col gap-2">
            <span className="text-[14px] font-bold text-[#1c1b1c]">
              {isRTL ? "الكمية" : "Quantity"}
            </span>
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center gap-3 rounded-[8px] border border-[#e5e7eb] bg-white px-2 py-2 w-[100px]">
                <button
                  type="button"
                  onClick={() => setQuantity((prev) => Math.max(minOrderQty, prev - 1))}
                  className="text-[#707176] hover:text-[#17284a] transition-colors"
                >
                  <Minus className="w-5 h-5" />
                </button>
                <span className="min-w-[1.5rem] text-center text-[14px] font-bold text-[#1c1b1c]">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((prev) => Math.min(99, prev + 1))}
                  className="text-[#707176] hover:text-[#17284a] transition-colors"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
              <span className="text-[14px] text-[#707176]">
                {isRTL ? "الحد الأدنى: " : "Min. Order Qty: "}
                <span className="font-bold text-[#1c1b1c]">
                  {isRTL ? `${minOrderQty} قطعة` : `${minOrderQty} pcs`}
                </span>
              </span>
            </div>
          </div>

          {/* Price Display */}
          <ProductPrice product={product} variant={selectedVariant} />

          {/* Action Buttons */}
          <div className="flex flex-col gap-2">
            <button
              onClick={handleRequestQuote}
              disabled={
                !inStock ||
                !selectedVariant ||
                !!disabled ||
                !isValidVariant
              }
              className={clx(
                "w-full h-[56px] rounded-[16px] bg-[#17284a] text-white text-[12px] font-medium transition-all hover:bg-[#0f1d35] flex items-center justify-center gap-2",
                isRTL && "tracking-[0.05em]"
              )}
              data-testid="add-product-button"
            >
              {!selectedVariant && !options
                ? isRTL ? "اختر خيارًا" : "Select an option"
                : !inStock || !isValidVariant
                  ? isRTL ? "غير متوفر" : "Out of stock"
                    : isRTL ? "اطلب عرض سعر" : "Request a Quote"}
            </button>
            <button
              onClick={handleAddToQuoteList}
              disabled={!selectedVariant || !inStock || !isValidVariant || isAddingToList}
              className={`w-full h-[56px] rounded-[16px] border text-[16px] font-medium transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed ${
                isAddingToList
                  ? "border-transparent text-white bg-[rgb(253,176,34)]"
                  : "border-black text-black hover:bg-black hover:text-white"
              }`}
            >
              {isAddingToList
                ? isRTL ? "تمت الإضافة ✓" : "Added ✓"
                : isRTL ? "أضف إلى قائمة الأسعار" : "Add to Quote List"}
            </button>
          </div>

          {/* Trust Points */}
          <div className="flex flex-col gap-4 pt-2 border-t border-[#e5e7eb]">
            <div className="flex items-start gap-3">
              <Truck className="w-5 h-5 text-[#17284a] flex-shrink-0 mt-0.5" />
              <div className="flex flex-col gap-0.5">
                <span className="text-[14px] font-bold text-[#1c1b1c]">
                  {isRTL ? "توصيل سريع" : "Fast Delivery"}
                </span>
                <span className="text-[12px] text-[#707176]">
                  {isRTL ? "القاهرة والجيزة خلال 3-5 أيام عمل" : "Cairo & Giza within 3-5 business days"}
                </span>
              </div>
            </div>
            {warrantyNum && (
              <div className="flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-[#17284a] flex-shrink-0 mt-0.5" />
                <div className="flex flex-col gap-0.5">
                  <span className="text-[14px] font-bold text-[#1c1b1c]">
                    {isRTL ? `ضمان ${warrantyNum} سنوات` : `${warrantyNum}-Year Warranty`}
                  </span>
                  <span className="text-[12px] text-[#707176]">
                    {isRTL ? "تغطية ضمان هيكلية كاملة" : "Full structural warranty coverage"}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Options + Quantity + Trust Points — shown only on mobile */}
        <div className="lg:hidden flex flex-col gap-[20px]">
          {/* Variant Options */}
          {(product.variants?.length ?? 0) > 1 && (
            <div className="flex flex-col gap-[20px]">
              {(product.options || []).map((option) => {
                return (
                  <div key={option.id} className="flex flex-col gap-[8px]">
                    <span className="text-[14px] font-bold text-[#1c1b1c]">
                      {option.title}
                    </span>
                    <OptionSelect
                      option={option}
                      current={options[option.id]}
                      updateOption={setOptionValue}
                      title={option.title ?? ""}
                      data-testid="product-options-mobile"
                      disabled={!!disabled || isAdding}
                    />
                  </div>
                )
              })}
            </div>
          )}

          {/* Quantity Selector */}
          <div className="flex flex-col gap-[8px]">
            <span className="text-[14px] font-bold text-[#1c1b1c]">
              {isRTL ? "الكمية" : "Quantity"}
            </span>
            <div className="flex items-center gap-[16px]">
              <div className="flex items-center justify-center gap-[12px] rounded-[8px] border border-[#e5e7eb] bg-white p-[8px] w-[110px]">
                <button
                  type="button"
                  onClick={() => setQuantity((prev) => Math.max(minOrderQty, prev - 1))}
                  className="text-[#707176] hover:text-[#17284a] transition-colors"
                >
                  <Minus className="w-6 h-6" />
                </button>
                <span className="min-w-[1.5rem] text-center text-[14px] font-bold text-[#1c1b1c]">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((prev) => Math.min(99, prev + 1))}
                  className="text-[#707176] hover:text-[#17284a] transition-colors"
                >
                  <Plus className="w-6 h-6" />
                </button>
              </div>
              <span className="text-[12px] text-[#707176]">
                {isRTL ? "الحد الأدنى: " : "Min. Order Qty: "}
                <span className="font-bold text-[#1c1b1c]">
                  {isRTL ? `${minOrderQty} قطعة` : `${minOrderQty} pcs`}
                </span>
              </span>
            </div>
          </div>

          {/* Trust Points */}
          <div className="flex flex-col gap-[16px] pt-[8px]">
            <div className="flex items-center gap-[12px]">
              <Truck className="w-6 h-6 text-[#17284a] flex-shrink-0" />
              <div className="flex flex-col gap-[2px]">
                <span className="text-[14px] font-bold text-[#1c1b1c]">
                  {isRTL ? "توصيل سريع" : "Fast Delivery"}
                </span>
                <span className="text-[12px] text-[#707176]">
                  {isRTL ? "القاهرة والجيزة خلال 3-5 أيام عمل" : "Cairo & Giza within 3-5 business days"}
                </span>
              </div>
            </div>
            {warrantyNum && (
              <div className="flex items-center gap-[12px]">
                <ShieldCheck className="w-6 h-6 text-[#17284a] flex-shrink-0" />
                <div className="flex flex-col gap-[2px]">
                  <span className="text-[14px] font-bold text-[#1c1b1c]">
                    {isRTL ? `ضمان ${warrantyNum} سنوات` : `${warrantyNum}-Year Warranty`}
                  </span>
                  <span className="text-[12px] text-[#707176]">
                    {isRTL ? "تغطية ضمان هيكلية كاملة" : "Full structural warranty coverage"}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        <MobileActions
          product={product}
          variant={selectedVariant}
          options={options}
          updateOptions={setOptionValue}
          inStock={inStock}
          handleAddToCart={handleRequestQuote}
          isAdding={false}
          optionsDisabled={!!disabled || isAdding}
          quantity={quantity}
          onQuantityChange={setQuantity}
          minOrderQty={minOrderQty}
        />
      </div>
    </>
  )
}
