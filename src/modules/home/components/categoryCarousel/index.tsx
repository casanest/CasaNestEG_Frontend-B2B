"use client";
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import Link from "next/link";
import { motion } from "framer-motion";

interface Category {
    id: string;
    name: string;
    handle: string;
    metadata?: {
        thumbnail?: string;
        product_count?: number;
    };
}

interface CategoryCarouselProps {
    locale: string;
    productCategories: Category[];
}

const CategoryCarousel = ({ locale, productCategories }: CategoryCarouselProps) => {
    const isRTL = locale === "ar";

    // If no categories provided, show a message
    if (!productCategories || productCategories.length === 0) {
        return (
            <div className="text-center py-12">
                <h3 className="text-xl font-semibold text-gray-600 mb-4">
                    {isRTL ? "لا توجد فئات متاحة حالياً" : "No categories available at the moment"}
                </h3>
                <p className="text-gray-500">
                    {isRTL ? "يرجى التحقق لاحقاً" : "Please check back later"}
                </p>
            </div>
        );
    }

    return (
        <section className="relative bg-white pt-10 overflow-hidden" dir={isRTL ? "rtl" : "ltr"}>
            <div className="content-container mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    viewport={{ once: true }}
                    className="mb-8"
                >
                    <div className="flex items-center gap-3">
                        <h2 className="text-2xl md:text-4xl font-bold text-[#043364] tracking-tight">
                            {isRTL ? "✨ استكشف الفئات" : "✨ Explore Categories"}
                        </h2>
                        <div className="hidden md:block flex-1 h-[2px] bg-gradient-to-r from-transparent via-[#043364] to-transparent"></div>
                    </div>

                    <p className="text-gray-600 mt-2 text-sm md:text-base">
                        {isRTL
                            ? "تصفح قائمة الفئات للحصول على المزيد من المنتجات المميزة."
                            : "Browse our category list to find the best products."}
                    </p>
                </motion.div>

                <div className="relative text-center">
                    <Swiper
                        modules={[Navigation, Autoplay]}
                        loop
                        spaceBetween={20}
                        slidesPerView={1}
                        breakpoints={{
                            480: { slidesPerView: 2 },
                            640: { slidesPerView: 3 },
                            768: { slidesPerView: 4 },
                            1024: { slidesPerView: 5 },
                            1280: { slidesPerView: 6 },
                            1536: { slidesPerView: 7 }
                        }}
                        autoplay={{
                            delay: 3000,
                            disableOnInteraction: false,
                        }}
                        navigation={{
                            nextEl: '.swiper-button-next',
                            prevEl: '.swiper-button-prev',
                        }}
                        dir={isRTL ? 'rtl' : 'ltr'}
                        className="!overflow-visible !w-full overflow-hidden"
                    >
                        {productCategories.slice(0, 8).map((category) => (
                            <SwiperSlide key={category.id} className="!h-auto pb-14">
                                <Link href={`/categories/${category.handle}`} className="block">
                                    <motion.div
                                        whileHover={{ y: -5 }}
                                        transition={{ duration: 0.3 }}
                                        className="bg-gradient-to-tr from-teal-500 to-[#043364] rounded-2xl p-6 text-white text-center h-full flex flex-col justify-center"
                                    >
                                        <div className="w-16 h-16 mx-auto bg-white/20 rounded-full flex items-center justify-center mb-4">
                                            <span className="text-2xl">🏠</span>
                                        </div>
                                        <h3 className="text-lg font-semibold mb-2 line-clamp-2">
                                            {category.name}
                                        </h3>
                                        <p className="text-sm opacity-90">
                                            {category.metadata?.product_count || 0} {isRTL ? "منتج" : "products"}
                                        </p>
                                    </motion.div>
                                </Link>
                            </SwiperSlide>
                        ))}
                    </Swiper>

                    {/* Navigation Buttons */}
                    <div className="swiper-button-prev !text-[#043364] !bg-white !rounded-full !w-10 !h-10 !shadow-lg"></div>
                    <div className="swiper-button-next !text-[#043364] !bg-white !rounded-full !w-10 !h-10 !shadow-lg"></div>
                </div>
            </div>
        </section>
    );
};

export default CategoryCarousel;



