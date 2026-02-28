"use client";
import React, { useState, useCallback } from 'react';
import { useLocale } from 'next-intl';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import Link from 'next/link';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';

interface Product {
    id: string;
    title: string;
    thumbnail?: string;
    handle: string;
    variants?: Array<{
        calculated_price?: {
            calculated_amount: number;
        };
    }>;
}

interface ProductGridProps {
    products?: Product[];
    locale: string;
}

const ProductGrid = ({ products = [], locale }: ProductGridProps) => {
    const isRTL = locale === "ar";
    const [failedIds, setFailedIds] = useState<Record<string, boolean>>({});
    const handleImageError = useCallback((id: string) => {
        setFailedIds((prev) => ({ ...prev, [id]: true }));
    }, []);

    // If no products provided, show a message
    if (!products || products.length === 0) {
        return (
            <div className="text-center py-12">
                <h3 className="text-xl font-semibold text-gray-600 mb-4">
                    {isRTL ? "لا توجد منتجات متاحة حالياً" : "No products available at the moment"}
                </h3>
                <p className="text-gray-500">
                    {isRTL ? "يرجى التحقق لاحقاً" : "Please check back later"}
                </p>
            </div>
        );
    }

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(price / 100);
    };

    return (
        <div className="relative">
            <Swiper
                modules={[Navigation]}
                navigation={{
                    nextEl: '.swiper-button-next',
                    prevEl: '.swiper-button-prev',
                }}
                spaceBetween={20}
                slidesPerView={1}
                breakpoints={{
                    480: { slidesPerView: 2 },
                    640: { slidesPerView: 2.5 },
                    768: { slidesPerView: 3 },
                    1024: { slidesPerView: 4 },
                    1280: { slidesPerView: 5 },
                    1536: { slidesPerView: 6 }
                }}
                dir={isRTL ? 'rtl' : 'ltr'}
                className="!overflow-visible !w-full overflow-hidden"
            >
                {products.map((product) => (
                    <SwiperSlide key={product.id} className="!h-auto pb-14">
                        <Link href={`/products/${product.handle}`} className="block">
                            <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden">
                                <div className="aspect-square relative overflow-hidden">
                                    <img
                                        src={failedIds[product.id] ? '/cat1.jpg' : (product.thumbnail || '/cat1.jpg')}
                                        alt={product.title}
                                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                                        onError={() => handleImageError(product.id)}
                                    />
                                    {product.variants?.[0]?.calculated_price?.calculated_amount && (
                                        <div className="absolute top-2 right-2 bg-blue-600 text-white px-2 py-1 rounded-md text-sm font-semibold">
                                            {formatPrice(product.variants[0].calculated_price.calculated_amount)}
                                        </div>
                                    )}
                                </div>
                                <div className="p-4">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                                        {product.title}
                                    </h3>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-600">
                                            {isRTL ? "عرض التفاصيل" : "View Details"}
                                        </span>
                                        <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    </SwiperSlide>
                ))}
            </Swiper>

            {/* Navigation Buttons */}
            <div className="swiper-button-prev !text-blue-600 !bg-white !rounded-full !w-10 !h-10 !shadow-lg"></div>
            <div className="swiper-button-next !text-blue-600 !bg-white !rounded-full !w-10 !h-10 !shadow-lg"></div>
        </div>
    );
};

export default ProductGrid;