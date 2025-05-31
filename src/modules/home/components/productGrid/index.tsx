"use client";
import React from 'react';
import { useLocale } from 'next-intl';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';

const Products = ({ isRTL }: { isRTL: boolean }) => {
    const products = [
        {
            id: 1,
            title: isRTL ? "بيبي بريزا - جهاز تسخين رضاعات الأطفال الفوري - أبيض" : "Pebiby - Baby Skin Care Device - White",
            image: "/cat1.png",
            price: "$59.9",
            originalPrice: "$81.41",
            discount: "-26%",
            hasDiscount: true
        },
        {
            id: 2,
            title: isRTL ? "فريدا موم - فوط ماكسي آيس بعد الولادة 2 في 1" : "Frida Mom - Baby Maxi Air Conditioner",
            image: "/cat2.png",
            price: "$32.4",
            originalPrice: "$48.47",
            discount: "-33%",
            hasDiscount: true
        },
        {
            id: 3,
            title: isRTL ? "جيكل - مهد الأطفال الجانبي نوفا - رمادي" : "Gel - Baby Side Table - Grey",
            image: "/cat3.png",
            price: "$107.55",
            originalPrice: "$216.47",
            discount: "-50%",
            hasDiscount: true
        },
        {
            id: 4,
            title: isRTL ? "جيكل - مستلزمات الاستحمام للطفل - مجموعة كاملة" : "Gel - Baby Care Essentials - Complete Set",
            image: "/cat4.png",
            price: "$67.8",
            originalPrice: null,
            discount: null,
            hasDiscount: false
        },
        {
            id: 5,
            title: isRTL ? "جيكل - كرسي سيارة للأطفال ساتورن زيب 360 أيزو فيكس - أسود" : "Gel - Baby Car Seat Satorn Zib 360 Azov Fix - Black",
            image: "/cat5.png",
            price: "$216.47",
            originalPrice: "$352.62",
            discount: "-39%",
            hasDiscount: true
        },
        {
            id: 6,
            title: isRTL ? "حقيبة الأمومة الفاخرة مع عازل حراري" : "Frida Mom - Baby Maxi Air Conditioner",
            image: "/cat6.png",
            price: "$89.99",
            originalPrice: "$120.00",
            discount: "-25%",
            hasDiscount: true
        },
        {
            id: 7,
            title: isRTL ? "مستلزمات الاستحمام للطفل - مجموعة كاملة" : "Gel - Baby Care Essentials - Complete Set",
            image: "/cat7.png",
            price: "$45.50",
            originalPrice: "$65.00",
            discount: "-30%",
            hasDiscount: true
        }
    ];

    return (
        <div className={`relative `}>
            <Swiper
                modules={[Navigation,]}
                navigation={{
                    nextEl: '.swiper-button-next',
                    prevEl: '.swiper-button-prev',
                }}
                autoplay={{
                    delay: 5000,
                    disableOnInteraction: true,
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
                className={`!overflow-visible !w-full overflow-hidden`}
            >
                {products.map((product) => (
                    <SwiperSlide key={product.id} className="!h-auto pb-14 ">
                        <div className="h-full bg-white rounded-lg shadow-md p-3 md:p-4 relative hover:shadow-lg transition-all duration-300 flex flex-col group">
                            {/* Wishlist button */}
                            {/* <button
                                className={`absolute top-2 ${isRTL ? 'left-2' : 'right-2'} z-10 text-gray-400 hover:text-red-500 transition-colors`}
                                aria-label={isRTL ? "إضافة إلى المفضلة" : "Add to wishlist"}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                </svg>
                            </button> */}

                            {/* Discount badge */}
                            {product.hasDiscount && (
                                <span className={`absolute top-2 ${isRTL ? 'right-2' : 'left-2'} z-10 bg-pink-600 text-white text-xs font-bold px-2 py-0.5 rounded-full`}>
                                    {product.discount}
                                </span>
                            )}

                            {/* Product image */}
                            <div className="flex-1 flex items-center justify-center p-4">
                                <img
                                    src={product.image}
                                    alt={product.title}
                                    className="mx-auto mb-3 md:mb-4 h-32 md:h-40 object-contain transition-transform duration-300 group-hover:scale-105"
                                    loading="lazy"
                                    width={160}
                                    height={160}
                                />
                            </div>

                            {/* Product info */}
                            <div className="mt-auto">
                                {/* Product title */}
                                <h3 className={`text-sm md:text-base font-medium text-gray-800 mb-2 ${isRTL ? 'text-right' : 'text-left'} leading-tight md:leading-5 line-clamp-2 min-h-[2.5rem]`}>
                                    {product.title}
                                </h3>

                                {/* Price */}
                                <div dir={isRTL ? 'rtl' : 'ltr'} className={`flex items-center gap-2 ${isRTL ? 'text-right ' : 'text-left'}`}>
                                    <span className="text-base md:text-lg font-semibold text-gray-900">
                                        {product.price}
                                    </span>
                                    {product.originalPrice && (
                                        <span className="text-xs md:text-sm text-gray-400 line-through ">
                                            {product.originalPrice}
                                        </span>
                                    )}
                                </div>

                                {/* Add to cart button */}
                                <button
                                    className={`absolute bottom-3 md:bottom-4 ${isRTL ? 'left-4' : 'right-4'} bg-blue-600 text-white rounded-full w-8 h-8 md:w-9 md:h-9 flex items-center justify-center text-lg md:text-xl hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg`}
                                    aria-label={isRTL ? "إضافة إلى السلة" : "Add to cart"}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </SwiperSlide>
                ))}

                {/* Navigation Buttons */}
                <div className={`swiper-button-prev ${isRTL ? '!right-12' : '!left-12'} !-top-12 !mt-0 !h-10 !w-10 rounded-full bg-white shadow-md hover:bg-gray-100 transition-colors duration-200 after:!text-sm after:!text-gray-700 after:!font-bold flex items-center justify-center border border-gray-200 hover:border-gray-300`}>
                    <span className="sr-only">Previous</span>
                </div>
                <div className={`swiper-button-next ${isRTL ? '!left-12' : '!right-12'} !-top-12 !mt-0 !h-10 !w-10 rounded-full bg-white shadow-md hover:bg-gray-100 transition-colors duration-200 after:!text-sm after:!text-gray-700 after:!font-bold flex items-center justify-center border border-gray-200 hover:border-gray-300`}>
                    <span className="sr-only">Next</span>
                </div>
            </Swiper>
        </div>
    );
};

export default function ProductGrid() {
    const isRTL = useLocale() === "ar";
    return (
        <section className="py-8 bg-gray-50 overflow-hidden">
            <div className="content-container mx-auto px-4 overflow-hidden">
                <h2 className="text-2xl font-bold text-center mb-8 text-[#043364]">
                    {isRTL ? "منتجات مميزة" : "Featured Products"}
                </h2>
                <Products isRTL={isRTL} />
            </div>
        </section>
    )
}