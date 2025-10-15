"use client"

import LocalizedClientLink from "@modules/common/components/localized-client-link"
import React, { useState } from "react"
import { HttpTypes } from "@medusajs/types"
import { getProductPrice } from "@lib/util/get-product-price"
import PreviewPrice from "@modules/products/components/product-preview/price"
import { addToCart } from "@lib/data/cart"
import { useParams } from "next/navigation"

type ProductCardProps = {
    product: HttpTypes.StoreProduct
    locale: string
}

const ProductCard: React.FC<ProductCardProps> = ({ product, locale }) => {
    const { cheapestPrice } = getProductPrice({ product })
    const [isAdding, setIsAdding] = useState(false)
    const countryCode = useParams().countryCode as string
    const isRTL = locale === "ar"

    const defaultVariant = product.variants?.[0]
    const defaultVariantId = defaultVariant?.id || ""

    const handleAddToCart = async (event: React.MouseEvent<HTMLButtonElement>) => {
        event.stopPropagation()
        event.preventDefault()

        if (!defaultVariantId) return
        setIsAdding(true)

        try {
            await addToCart({
                variantId: defaultVariantId,
                quantity: 1,
                countryCode,
            })
            // TODO: Add toast notification for success
        } catch (error) {
            console.error("Error adding to cart:", error)
        } finally {
            setIsAdding(false)
        }
    }

    return (
        <LocalizedClientLink
            href={`/products/${product.handle}`}
            className="group block z-0 h-full"
            locale={locale}
        >
            <div
                className="
          h-full bg-white rounded-2xl shadow-sm 
          p-3 md:p-5 relative 
          flex flex-col transition-all duration-300 
          hover:shadow-lg hover:-translate-y-1
          overflow-hidden
        "
            >
                {/* Discount badge */}
                {cheapestPrice?.price_type === "sale" && cheapestPrice.percentage_diff && (
                    <span
                        className={`absolute top-3 ${isRTL ? "right-3" : "left-3"
                            } bg-rose-600 text-white text-xs font-semibold px-2 py-0.5 rounded-full shadow-sm`}
                    >
                        -{cheapestPrice.percentage_diff}%
                    </span>
                )}

                {/* Product image */}
                <div className="relative flex-1 flex items-center justify-center p-4">
                    <img
                        src={product.thumbnail}
                        alt={product.title}
                        className="
              mx-auto h-36 sm:h-44 object-contain
              transition-transform duration-300 
              group-hover:scale-105
            "
                        loading="lazy"
                        width={180}
                        height={180}
                    />
                </div>

                {/* Info */}
                <div className="mt-3 sm:mt-4 flex flex-col justify-between">
                    <h3
                        className={`text-sm sm:text-base font-semibold text-gray-800 leading-snug line-clamp-2 mb-2 ${isRTL ? "text-right" : "text-left"
                            }`}
                    >
                        {locale === "ar"
                            ? (product.metadata?.title_ar as string) ?? product.title
                            : product.title}
                    </h3>

                    <div
                        dir={isRTL ? "rtl" : "ltr"}
                        className={`flex items-center gap-2 ${isRTL ? "justify-start" : "justify-start"
                            }`}
                    >
                        {cheapestPrice ? (
                            <PreviewPrice price={cheapestPrice} />
                        ) : (
                            <div className="h-6" />
                        )}
                    </div>
                </div>

                {/* Add to Cart Button */}
                <button
                    onClick={handleAddToCart}
                    disabled={isAdding}
                    className={`
            absolute bottom-4 ${isRTL ? "left-4" : "right-4"
                        } 
            bg-gradient-to-br from-[#043364] to-emerald-500
            text-white rounded-full w-9 h-9 flex items-center justify-center 
            text-lg hover:scale-110 
            transition-transform duration-300 shadow-md hover:shadow-lg 
            disabled:opacity-50
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
                            ></circle>
                            <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z"
                            ></path>
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
        </LocalizedClientLink>
    )
}

export default ProductCard
