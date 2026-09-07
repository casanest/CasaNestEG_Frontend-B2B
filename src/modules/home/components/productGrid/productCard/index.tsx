"use client"

import LocalizedClientLink from "@modules/common/components/localized-client-link"
import React, { useState } from "react"
import { HttpTypes } from "@medusajs/types"
import { getProductPrice } from "@lib/util/get-product-price"
import PreviewPrice from "@modules/products/components/product-preview/price"
import { useCartStore } from "@lib/store/useCartStore"
import { useParams } from "next/navigation"
import { getPricesForVariant } from "@lib/util/get-product-price"
import { normalizeProductImageUrl } from "@lib/util/product-image-url"
import PlaceholderImage from "@modules/common/icons/placeholder-image"

type ProductCardProps = {
    product: HttpTypes.StoreProduct
    locale: string
}

const ProductCard: React.FC<ProductCardProps> = ({ product, locale }) => {
    const { cheapestPrice } = getProductPrice({ product, locale })
    const [isAdding, setIsAdding] = useState(false)
    const [showSuccess, setShowSuccess] = useState(false)
    const [imageFailed, setImageFailed] = useState(false)
    const countryCode = useParams().countryCode as string
    const isRTL = locale === "ar"

    const defaultVariant = product.variants?.[0]
    const defaultVariantId = defaultVariant?.id || ""

    const addItem = useCartStore((state) => state.addItem)

    const rawMoq =
        (product as any).moq ||
        (product.metadata?.min_order_qty as string | number) ||
        (product.metadata?.MOQ as string | number)
    const minOrderQty = (() => {
        if (!rawMoq) return 1
        const parsed = parseInt(String(rawMoq), 10)
        return isNaN(parsed) || parsed < 1 ? 1 : parsed
    })()

    const handleAddToCart = async (event: React.MouseEvent<HTMLButtonElement>) => {
        event.stopPropagation()
        event.preventDefault()

        if (!defaultVariantId) return
        setIsAdding(true)

        try {
            const variant = defaultVariant as any
            const priceInfo = getPricesForVariant(variant)
            const category = product.categories?.[0] as any

            addItem({
                productId: product.id,
                variantId: defaultVariantId,
                productHandle: product.handle || "",
                productTitle: product.title,
                productTitleAr: (product.metadata as any)?.localizations?.ar?.title as string | undefined,
                productDescription: product.description || undefined,
                productDescriptionAr: (product.metadata as any)?.localizations?.ar?.description as string | undefined,
                thumbnail: product.thumbnail || null,
                images: (product.images || []).filter((img) => Boolean(img?.url)).map((img) => ({ url: normalizeProductImageUrl(img.url!) })),
                quantity: minOrderQty,
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
            setShowSuccess(true)
            setTimeout(() => setShowSuccess(false), 2000)
        } catch (error) {
            console.error("Error adding to cart:", error)
        } finally {
            setIsAdding(false)
        }
    }

    const imageSrc =
        product.thumbnail ??
        product.images?.find((img) => Boolean(img?.url))?.url ??
        null

    return (
        <LocalizedClientLink
            href={`/products/${product.handle}`}
            className="group block h-full bg-white mb-2 pb-5"
            locale={locale}
        >
            <div
                className="
                    h-full bg-white rounded-2xl shadow-sm border border-gray-100
                    p-4 relative flex flex-col transition-all duration-300 
                    hover:shadow-xl hover:-translate-y-2 hover:border-gray-200
                    overflow-hidden
                "
            >
                {/* Hover gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50/0 to-teal-50/0 group-hover:from-blue-50/30 group-hover:to-teal-50/20 transition-all duration-300 pointer-events-none rounded-2xl" />

                {/* Discount badge */}
                {cheapestPrice?.price_type === "sale" && cheapestPrice.percentage_diff && (
                    <div className={`absolute top-3 ${isRTL ? "left-3" : "right-3"} z-10`}>
                        <span className="bg-gradient-to-r from-rose-500 to-pink-600 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-md">
                            -{cheapestPrice.percentage_diff}%
                        </span>
                    </div>
                )}

                {/* New badge */}
                {product.metadata?.is_new && (
                    <div className={`absolute top-3 ${isRTL ? "right-3" : "left-3"} z-10`}>
                        <span className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-md">
                            {isRTL ? "جديد" : "New"}
                        </span>
                    </div>
                )}

                {/* Product image */}
                <div className="relative w-full h-48 mb-3 rounded-xl overflow-hidden bg-gray-50">
                    {imageSrc && !imageFailed ? (
                        <img
                            src={imageSrc}
                            alt={product.title}
                            className="
                                w-full h-full object-cover
                                transition-transform duration-500 
                                group-hover:scale-110
                            "
                            loading="lazy"
                            onError={() => setImageFailed(true)}
                        />
                    ) : (
                        <div className="flex items-center justify-center w-full h-full text-gray-300">
                            <PlaceholderImage size={48} />
                        </div>
                    )}
                </div>

                {/* Info section */}
                <div className="mt-3 space-y-2 relative z-10">
                    {/* Product title */}
                    <h3
                        className={`text-sm font-semibold text-gray-800 leading-tight line-clamp-2 min-h-[2.5rem] group-hover:text-[#043364] transition-colors ${isRTL ? "text-right" : "text-left"
                            }`}
                    >
                        {locale === "ar"
                            ? (product.metadata?.title_ar as string) ?? product.title
                            : product.title}
                    </h3>

                    {/* Price section */}
                    <div
                        dir={isRTL ? "rtl" : "ltr"}
                        className="flex items-center justify-between"
                    >
                        <div className="flex items-center gap-2">
                            {cheapestPrice ? (
                                <PreviewPrice price={cheapestPrice} />
                            ) : (
                                <div className="h-6" />
                            )}
                        </div>

                        {/* Add to Cart Button */}
                        <button
                            onClick={handleAddToCart}
                            disabled={isAdding}
                            className={`
                                relative bg-gradient-to-tl from-gray-500 to-[#022a55]
                                text-white rounded-full w-10 h-10 
                                flex items-center justify-center 
                                hover:scale-110 hover:shadow-lg
                                transition-all duration-300 shadow-md
                                disabled:opacity-50 disabled:cursor-not-allowed
                                ${showSuccess ? "!bg-[rgb(253,176,34)]" : ""}
                            `}
                            aria-label={isRTL ? "إضافة إلى السلة" : "Add to cart"}
                        >
                            {isAdding ? (
                                <svg
                                    className="animate-spin h-5 w-5 text-white"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                    />
                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                    />
                                </svg>
                            ) : showSuccess ? (
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2.5}
                                        d="M5 13l4 4L19 7"
                                    />
                                </svg>
                            ) : (
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                                    />
                                </svg>
                            )}
                        </button>
                    </div>

                    {/* Stock indicator (optional) */}
                    {defaultVariant?.inventory_quantity !== undefined &&
                        defaultVariant.inventory_quantity > 0 &&
                        defaultVariant.inventory_quantity < 5 && (
                            <p className="text-xs text-orange-600 font-medium">
                                {isRTL
                                    ? `متبقي ${defaultVariant.inventory_quantity} فقط`
                                    : `Only ${defaultVariant.inventory_quantity} left`
                                }
                            </p>
                        )}
                </div>
            </div>
        </LocalizedClientLink>
    )
}

export default ProductCard