'use client';
import LocalizedClientLink from '@modules/common/components/localized-client-link';
import React from 'react';
import { HttpTypes } from "@medusajs/types"
import { getProductPrice } from '@lib/util/get-product-price';
import PreviewPrice from '@modules/products/components/product-preview/price';

type Product = {
    id: number;
    title: string;
    thumbnail: string;
};

type ProductCardProps = {
    product: HttpTypes.StoreProduct;
    locale: string;
};


const ProductCard: React.FC<ProductCardProps> = ({ product, locale }) => {
    const { cheapestPrice } = getProductPrice({ product })
    const calcDiscount = (price: number, discount: number) => (price * (100 - discount)) / 100

    const isRTL = locale === "ar";
    return (
        <LocalizedClientLink
            href={`/products/${product.handle}`}
            className="group block"
            locale={locale}
        >
            <div className="h-full bg-white rounded-lg shadow-md p-3 md:p-4 relative hover:shadow-lg transition-all duration-300 flex flex-col group">
                {/* Discount badge */}
                {cheapestPrice?.price_type === "sale" && typeof cheapestPrice.original_price === "number" && typeof cheapestPrice.percentage_diff === "number" && (
                    <span className={`absolute top-2 ${isRTL ? 'right-2' : 'left-2'} z-10 bg-pink-600 text-white text-xs font-bold px-2 py-0.5 rounded-full`}>
                        {calcDiscount(cheapestPrice.original_price, cheapestPrice.percentage_diff).toFixed(2)}
                    </span>
                )}

                {/* Product image */}
                <div className="flex-1 flex items-center justify-center p-4">
                    <img
                        src={product.thumbnail}
                        alt={product.title}
                        className="mx-auto mb-3 md:mb-4 h-32 md:h-40 object-contain transition-transform duration-300 group-hover:scale-105"
                        loading="lazy"
                        width={160}
                        height={160}
                    />
                </div>

                {/* Product info */}
                <div className="mt-auto">
                    <h3 className={`text-sm md:text-base font-medium text-gray-800 mb-2 ${isRTL ? 'text-right' : 'text-left'} leading-tight md:leading-5 line-clamp-2 min-h-[2.5rem]`}>
                        {product.title}
                    </h3>
                    <div dir={isRTL ? 'rtl' : 'ltr'} className={`flex items-center gap-2 ${isRTL ? 'text-right ' : 'text-left'}`}>
                        <span className="text-base md:text-lg font-semibold text-gray-900">{product.price}</span>
                        {/* {product.original_price && (
                            <span className="text-xs md:text-sm text-gray-400 line-through">
                                {product.original_price}
                            </span>
                        )} */}
                        {cheapestPrice ? (
                            <PreviewPrice
                                price={cheapestPrice}
                            // className="text-lg font-bold text-gray-900 dark:text-white"
                            />
                        ) : (
                            <div className="h-6"></div>
                        )}
                    </div>

                    <button
                        className={`absolute bottom-3 md:bottom-4 ${isRTL ? 'left-4' : 'right-4'} bg-gradient-to-tl from-emerald-500 to-[#022a55] text-white rounded-full w-8 h-8 md:w-9 md:h-9 flex items-center justify-center text-lg md:text-xl hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg`}
                        aria-label={isRTL ? 'إضافة إلى السلة' : 'Add to cart'}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                    </button>
                </div>
            </div>
        </LocalizedClientLink>
    );
};

export default ProductCard;
