"use client";
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import Link from "next/link";
import { motion } from "framer-motion";

type Category = {
    id: string;
    name_en: string;
    name_ar: string;
    handle_en: string;
    handle_ar: string;
    image_url: string | null;
    parent_category_id: string | null;
};

interface CategoryCarouselProps {
    locale: string;
    productCategories: Category[];
}

const CategoryCarousel = ({ locale, productCategories }: CategoryCarouselProps) => {
    const isRTL = locale === "ar";

    const parentCategories = productCategories.filter(cat => !cat.parent_category_id);

    if (!parentCategories || parentCategories.length === 0) {
        return (
            <div className="text-center py-20 bg-gray-50 rounded-2xl">
                <h3 className="text-2xl font-semibold text-gray-700 mb-3">
                    {isRTL ? "لا توجد فئات متاحة حالياً" : "No categories available at the moment"}
                </h3>
                <p className="text-gray-500">{isRTL ? "يرجى التحقق لاحقاً" : "Please check back later"}</p>
            </div>
        );
    }

    return (
        <section className="relative" dir={isRTL ? "rtl" : "ltr"}>
            <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 25 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className="text-center mb-12"
                >
                    <div className="flex items-center gap-3 sm:mx-auto justify-center">
                        <h2 className="text-2xl md:text-4xl font-extrabold text-[#043364] tracking-tight select-none">
                            {isRTL ? "✨ استكشف الفئات" : "✨ Explore Categories"}
                        </h2>
                        <div className="hidden md:block flex-1 h-[2px] bg-gradient-to-r from-transparent via-[#043364] to-transparent"></div>
                    </div>
                </motion.div>

                {/* Carousel */}
                <div className="relative group w-full">
                    <Swiper
                        modules={[Navigation, Autoplay]}
                        loop
                        spaceBetween={20}
                        slidesPerView={2}
                        breakpoints={{
                            480: { slidesPerView: 2 },
                            640: { slidesPerView: 3 },
                            768: { slidesPerView: 4 },
                            1024: { slidesPerView: 5 },
                            1280: { slidesPerView: 6 },
                        }}
                        autoplay={{
                            delay: 2500,
                            disableOnInteraction: false,
                        }}
                        navigation={{
                            nextEl: ".swiper-button-next",
                            prevEl: ".swiper-button-prev",
                        }}
                        className="!overflow-visible"
                        dir={isRTL?"rtl": "ltr"}
                    >
                        {parentCategories.slice(0, 10).map(category => (
                            <SwiperSlide key={category.id} className="!h-auto">
                                <Link
                                    href={`/categories/${isRTL ? category.handle_ar : category.handle_en}`}
                                    className="block"
                                    aria-label={isRTL ? category.name_ar : category.name_en}
                                    tabIndex={0}
                                >
                                    <motion.div
                                        whileHover={{ scale: 1.07 }}
                                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                        className="h-full flex flex-col items-center justify-center text-center relative group/card cursor-pointer"
                                    >
                                        {/* Circular background with gradient and shadow */}
                                        <div
                                            className="w-44 h-44 mb-4 rounded-full bg-gradient-to-tl from-gray-500 to-[#022a55] flex items-center justify-center shadow-xl group-hover/card:shadow-[0_0_20px_4px_rgba(0,0,0,0.2)] transition-shadow duration-300 relative overflow-hidden"
                                            aria-hidden="true"
                                        >
                                            {/* Inner circle for image/icon */}
                                            <div className="w-40 h-40 rounded-full bg-white flex items-center justify-center overflow-hidden border-2 border-transparent group-hover/card:border-[#043364] transition-colors duration-300">
                                                {category.image_url ? (
                                                    <img
                                                        src={category.image_url}
                                                        alt={isRTL ? category.name_ar : category.name_en}
                                                        className="w-full h-full object-contain"
                                                        loading="lazy"
                                                    />
                                                ) : (
                                                    <span className="text-5xl select-none">🏷️</span>
                                                )}
                                            </div>
                                        </div>

                                        {/* Category name with subtle text shadow */}
                                        <h3
                                            className="text-base font-semibold text-[#043364] mb-1 line-clamp-2 px-2 select-none"
                                            title={isRTL ? category.name_ar : category.name_en}
                                        >
                                            {isRTL ? category.name_ar : category.name_en}
                                        </h3>
                                    </motion.div>
                                </Link>
                            </SwiperSlide>
                        ))}
                    </Swiper>

                    {/* Navigation Buttons */}
                    <div className="absolute inset-y-0 right-0 flex items-center pointer-events-none">
                        <button
                            aria-label="Next Slide"
                            className={`
                swiper-button-next
                !text-[#043364]
                !bg-white/90
                !rounded-full
                !w-11 !h-11
                !shadow-lg
                !flex !items-center !justify-center
                hover:!bg-gradient-to-br hover:!from-[#043364] hover:!to-emerald-500 hover:!text-white
                transition-all duration-300
                pointer-events-auto
                opacity-0 group-hover:opacity-100
                transform hover:scale-110
                hover:shadow-2xl
                backdrop-blur-sm
                focus:outline-none focus:ring-2 focus:ring-emerald-500
              `}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2}
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                        <style jsx global>{`
              .swiper-button-prev::after,
              .swiper-button-next::after {
                display: none !important;
              }
            `}</style>
                    </div>
                    <div className="absolute inset-y-0 left-0 flex items-center pointer-events-none">
                        <button
                            aria-label="Previous Slide"
                            className={`
                swiper-button-prev
                !text-[#043364]
                !bg-white/90
                !rounded-full
                !w-11 !h-11
                !shadow-lg
                !flex !items-center !justify-center
                hover:!bg-gradient-to-br hover:!from-[#043364] hover:!to-emerald-500 hover:!text-white
                transition-all duration-300
                pointer-events-auto
                opacity-0 group-hover:opacity-100
                transform hover:scale-110
                hover:shadow-2xl
                backdrop-blur-sm
                focus:outline-none focus:ring-2 focus:ring-emerald-500
              `}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2}
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                        <style jsx global>{`
              .swiper-button-prev::after,
              .swiper-button-next::after {
                display: none !important;
              }
            `}</style>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CategoryCarousel;
