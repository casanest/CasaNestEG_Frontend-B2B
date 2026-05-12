"use client";
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
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
    const parentCategories = productCategories.filter((cat) => !cat.parent_category_id);

    if (!parentCategories || parentCategories.length === 0) {
        return (
            <div className="text-center py-16 sm:py-20 bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl mx-4">
                <h3 className="text-xl sm:text-2xl font-semibold text-gray-700 mb-2">
                    {isRTL ? "لا توجد فئات متاحة حالياً" : "No categories available at the moment"}
                </h3>
                <p className="text-sm sm:text-base text-gray-500">{isRTL ? "يرجى التحقق لاحقاً" : "Please check back later"}</p>
            </div>
        );
    }

    const shouldCenter = parentCategories.length <= 4;

    return (
        <section className="relative  " dir={isRTL ? "rtl" : "ltr"}>

            <div className="mx-auto ">
                {/* Header */}
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7 }}
                    viewport={{ once: true }}
                    className="text-center mb-12 sm:mb-16"
                >
                    <motion.p
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        viewport={{ once: true }}
                        className="text-gray-600  text-sm sm:text-base max-w-2xl mx-auto"
                    >
                        {isRTL
                            ? "اكتشف مجموعة واسعة من المنتجات المصنفة خصيصاً لك"
                            : "Explore a wide range of products categorized just for you"
                        }
                    </motion.p>

                    {/* Decorative line */}
                    <motion.div
                        initial={{ scaleX: 0 }}
                        whileInView={{ scaleX: 1 }}
                        transition={{ duration: 0.8, delay: 0.5 }}
                        viewport={{ once: true }}
                        className="h-1 w-24 bg-gradient-to-r from-[#043364] to-gray-500 mx-auto mt-6 rounded-full"
                    />
                </motion.div>

                {/* Carousel */}
                <div className="relative w-full ">
                    <Swiper
                        modules={[Navigation]}
                        slidesPerView={3}
                        spaceBetween={16}
                        centeredSlides={shouldCenter}
                        navigation={{
                            nextEl: '.category-swiper-button-prev',
                            prevEl: '.category-swiper-button-next',
                        }}
                        breakpoints={{
                            480: {
                                slidesPerView: Math.min(3, parentCategories.length),
                                spaceBetween: 10
                            },
                            640: {
                                slidesPerView: Math.min(3, parentCategories.length),
                                spaceBetween: 15
                            },
                            768: {
                                slidesPerView: Math.min(4, parentCategories.length),
                                spaceBetween: 20
                            },
                            1024: {
                                slidesPerView: Math.min(5, parentCategories.length),
                                spaceBetween: 28
                            },
                            1280: {
                                slidesPerView: Math.min(6, parentCategories.length),
                                spaceBetween: 32
                            },
                        }}
                        dir={isRTL ? "rtl" : "ltr"}
                        className="!overflow-visible !pb-4"
                    >
                        {parentCategories.slice(0, 12).map((category, index) => (
                            <SwiperSlide key={category.id} className="flex justify-center">
                                <Link
                                    href={`/${locale}/categories/${isRTL ? category.handle_ar : category.handle_en}`}
                                    aria-label={isRTL ? category.name_ar : category.name_en}
                                    className="w-full"
                                >
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.5, delay: index * 0.05 }}
                                        viewport={{ once: true }}
                                        whileHover={{ y: -8 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="flex flex-col items-center text-center cursor-pointer group"
                                    >
                                        {/* Circle Container */}
                                        <div className="relative w-20 h-20 sm:w-28 sm:h-28 lg:w-36 lg:h-36 rounded-full bg-gradient-to-tr from-[#043364] via-[#065a9e] to-emerald-500 p-[3px] shadow-lg group-hover:shadow-2xl transition-all duration-300">
                                            <div className="w-full h-full rounded-full bg-white flex items-center justify-center relative">
                                                {/* Hover overlay */}
                                                {/* <div className="absolute inset-0 bg-gradient-to-br from-[#043364]/5 to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" /> */}

                                                {category.image_url ? (
                                                    <img
                                                        src={category.image_url}
                                                        alt={isRTL ? category.name_ar : category.name_en}
                                                        className="w-[130%] h-[130%] object-contain relative z-100 group-hover:scale-110 transition-transform duration-300"
                                                        loading="lazy"
                                                    />
                                                ) : (
                                                    <span className="text-3xl sm:text-4xl lg:text-5xl select-none group-hover:scale-110 transition-transform duration-300">
                                                        🏷️
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        {/* Category Name */}
                                        <h3
                                            className="text-xs sm:text-sm lg:text-base font-semibold text-[#043364] mt-2 sm:mt-3 lg:mt-4 line-clamp-2 px-1 select-none group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-br group-hover:from-[#043364] group-hover:via-[#065a9e] group-hover:to-emerald-500 transition-colors duration-300 min-h-[32px] sm:min-h-[40px] flex items-center"
                                            title={isRTL ? category.name_ar : category.name_en}
                                        >
                                            {isRTL ? category.name_ar : category.name_en}
                                        </h3>
                                    </motion.div>
                                </Link>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                        {/* Enhanced Navigation Buttons */}
                        <motion.div
                            onClick={
                                () => {
                                    const prevButton = document.querySelector('.category-swiper-button-prev') as HTMLElement;
                                    prevButton?.click();
                                }
                            }
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="category-swiper-button-prev absolute top-[35%] -translate-y-1/2 -left-3 z-50 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full shadow-lg border border-gray-200 flex items-center justify-center text-gray-700 hover:bg-white hover:shadow-xl hover:scale-110 transition-all duration-300 cursor-pointer group"
                        >
                            <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={!isRTL ? "M9 5l7 7-7 7" : "M15 19l-7-7 7-7"} />
                            </svg>
                        </motion.div>

                        <motion.div
                            onClick={
                                () => {
                                    const nextButton = document.querySelector('.category-swiper-button-next') as HTMLElement;
                                    nextButton?.click();
                                }
                            }
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="category-swiper-button-next absolute top-[35%] -translate-y-1/2 -right-3 z-50 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full shadow-lg border border-gray-200 flex items-center justify-center text-gray-700 hover:bg-white hover:shadow-xl hover:scale-110 transition-all duration-300 cursor-pointer group"
                        >
                            <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={!isRTL ? "M15 19l-7-7 7-7" : "M9 5l7 7-7 7"} />
                            </svg>
                        </motion.div>

                </div>
                    {/* Custom Navigation Buttons */}
                    <style jsx global>{`
                        .swiper-button-next,
                        .swiper-button-prev {
                            width: 36px !important;
                            height: 36px !important;
                            background: white !important;
                            border-radius: 50% !important;
                            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important;
                            transition: all 0.3s ease !important;
                        }

                        .swiper-button-next:hover,
                        .swiper-button-prev:hover {
                            background: #043364 !important;
                            box-shadow: 0 6px 16px rgba(4, 51, 100, 0.3) !important;
                            transform: scale(1.1);
                        }

                        .swiper-button-next::after,
                        .swiper-button-prev::after {
                            font-size: 14px !important;
                            font-weight: bold !important;
                            color: #043364 !important;
                        }

                        .swiper-button-next:hover::after,
                        .swiper-button-prev:hover::after {
                            color: white !important;
                        }

                        @media (min-width: 640px) {
                            .swiper-button-next,
                            .swiper-button-prev {
                                width: 44px !important;
                                height: 44px !important;
                            }

                            .swiper-button-next::after,
                            .swiper-button-prev::after {
                                font-size: 16px !important;
                            }
                        }

                        @media (max-width: 639px) {
                            .swiper-button-next,
                            .swiper-button-prev {
                                display: none !important;
                            }
                        }

                        .swiper-button-disabled {
                            opacity: 0.3 !important;
                            cursor: not-allowed !important;
                        }
                    `}</style>
            </div>
        </section>
    );
};

export default CategoryCarousel;


{/*
    
    
    "use client";
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
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
    const parentCategories = productCategories.filter((cat) => !cat.parent_category_id);

    if (!parentCategories || parentCategories.length === 0) {
        return (
            <div className="text-center py-16 sm:py-20 bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl mx-4">
                <h3 className="text-xl sm:text-2xl font-semibold text-gray-700 mb-2">
                    {isRTL ? "لا توجد فئات متاحة حالياً" : "No categories available at the moment"}
                </h3>
                <p className="text-sm sm:text-base text-gray-500">{isRTL ? "يرجى التحقق لاحقاً" : "Please check back later"}</p>
            </div>
        );
    }

    const shouldCenter = parentCategories.length <= 4;

    return (
        <section className="relative " dir={isRTL ? "rtl" : "ltr"}>
            <div className="mx-auto ">
<motion.div
    initial={{ opacity: 0, y: -20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.7 }}
    viewport={{ once: true }}
    className="text-center mb-12 sm:mb-16"
>
     <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        whileInView={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#043364]/10 to-gray-500/10 rounded-full mb-4"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 text-[#043364]"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                        </svg>
                        <span className="text-sm font-semibold text-[#043364]">
                            {isRTL ? "منتجاتنا المميزة" : "Featured Collections"}
                        </span>
                    </motion.div>

     <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        viewport={{ once: true }}
                        className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#043364] mb-4"
                    >
                        {isRTL ? (
                            <>
                                اكتشف <span className="text-transparent bg-clip-text bg-gradient-to-r  from-gray-600 to-[#043364]">الفئات</span>
                            </>
                        ) : (
                            <>
                                Discover Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#043364] to-gray-600">Amazing</span> Collections
                            </>
                        )}
                    </motion.h2> 

    <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        viewport={{ once: true }}
        className="text-gray-600  text-sm sm:text-base max-w-2xl mx-auto"
    >
        {isRTL
            ? "اكتشف مجموعة واسعة من المنتجات المصنفة خصيصاً لك"
            : "Explore a wide range of products categorized just for you"
        }
    </motion.p>

    <motion.div
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        transition={{ duration: 0.8, delay: 0.5 }}
        viewport={{ once: true }}
        className="h-1 w-24 bg-gradient-to-r from-[#043364] to-gray-500 mx-auto mt-6 rounded-full"
    />
</motion.div>

<div className="relative w-full ">
    <Swiper
        modules={[Navigation]}
        slidesPerView={3}
        spaceBetween={10}
        centeredSlides={shouldCenter}
        navigation={{
            nextEl: '.category-swiper-button-prev',
            prevEl: '.category-swiper-button-next',
        }}
        breakpoints={{
            480: {
                slidesPerView: Math.min(3, parentCategories.length),
                spaceBetween: 10
            },
            640: {
                slidesPerView: Math.min(3, parentCategories.length),
                spaceBetween: 15
            },
            768: {
                slidesPerView: Math.min(4, parentCategories.length),
                spaceBetween: 20
            },
            1024: {
                slidesPerView: Math.min(5, parentCategories.length),
                spaceBetween: 28
            },
            1280: {
                slidesPerView: Math.min(7, parentCategories.length),
                spaceBetween: 32
            },
        }}
        dir={isRTL ? "rtl" : "ltr"}
        className="!overflow-visible !pb-4"
    >
        {parentCategories.slice(0, 12).map((category, index) => (
            <SwiperSlide key={category.id} className="flex justify-center">
                <Link
                    href={`/${locale}/categories/${isRTL ? category.handle_ar : category.handle_en}`}
                    aria-label={isRTL ? category.name_ar : category.name_en}
                    className="w-full"
                >
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.05 }}
                        viewport={{ once: true }}
                        whileHover={{ y: -8 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex flex-col items-center text-center cursor-pointer group relative pt-8 sm:pt-10 lg:pt-12"
                    >
                        <div className="absolute top-0 left-1/2 -translate-x-1/2  z-20 w-25 h-25 sm:w-37 sm:h-37 lg:w-44 lg:h-44">
                            <motion.div
                                whileHover={{
                                    y: -6,
                                    rotate: [0, -5, 5, -5, 0],
                                    transition: {
                                        rotate: { duration: 0.5, repeat: Infinity },
                                        y: { duration: 0.3 }
                                    }
                                }}
                                className="w-full h-full relative"
                            >
                                <div className="absolute inset-0 bg-gradient-to-b from-[#043364]/20 to-transparent blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                                {category.image_url ? (
                                    <img
                                        src={category.image_url}
                                        alt={isRTL ? category.name_ar : category.name_en}
                                        className="w-full h-full object-contain relative z-10 drop-shadow-2xl group-hover:drop-shadow-[0_20px_30px_rgba(4,51,100,0.4)] transition-all duration-300"
                                        loading="lazy"
                                    />
                                ) : (
                                    <span className="text-4xl sm:text-5xl lg:text-6xl select-none drop-shadow-lg group-hover:drop-shadow-2xl transition-all duration-300 flex items-center justify-center w-full h-full">
                                        🏷️
                                    </span>
                                )}
                            </motion.div>
                        </div>

                        <div className="relative w-20 h-20 sm:w-28 sm:h-28 lg:w-36 lg:h-36 rounded-full bg-gradient-to-tr from-[#043364] via-[#065a9e] to-gray-500 p-[3px] shadow-lg group-hover:shadow-2xl transition-all duration-300 mb-3 sm:mb-4">
                            <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden relative">
                                <div className="absolute inset-0 bg-gradient-to-br from-[#043364]/10 via-transparent to-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                                <motion.div
                                                    className="absolute inset-0 rounded-full border-2 border-[#043364]/20"
                                                    animate={{
                                                        scale: [1, 1.1, 1],
                                                        opacity: [0.5, 0, 0.5],
                                                    }}
                                                    transition={{
                                                        duration: 2,
                                                        repeat: Infinity,
                                                        ease: "easeInOut",
                                                    }}
                                                />
                            </div>
                        </div>

                        <div className="relative w-full px-2">
                            <div className="absolute inset-0 bg-gradient-to-t from-[#043364]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg blur-sm" />

                            <h3
                                className="relative text-xs sm:text-sm lg:text-base font-semibold text-[#043364] line-clamp-2 select-none group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-br group-hover:from-[#043364] group-hover:via-[#065a9e] group-hover:to-emerald-500 transition-all duration-300 min-h-[32px] sm:min-h-[40px] flex items-center justify-center"
                                title={isRTL ? category.name_ar : category.name_en}
                            >
                                {isRTL ? category.name_ar : category.name_en}
                            </h3>
                        </div>
                    </motion.div>
                </Link>
            </SwiperSlide>
        ))}
        <motion.div
            onClick={
                () => {
                    const prevButton = document.querySelector('.category-swiper-button-prev') as HTMLElement;
                    prevButton?.click();
                }
            }
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="category-swiper-button-prev absolute top-[35%] -translate-y-1/2 -left-3 z-50 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full shadow-lg border border-gray-200 flex items-center justify-center text-gray-700 hover:bg-white hover:shadow-xl hover:scale-110 transition-all duration-300 cursor-pointer group"
        >
            <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={!isRTL ? "M9 5l7 7-7 7" : "M15 19l-7-7 7-7"} />
            </svg>
        </motion.div>

        <motion.div
            onClick={
                () => {
                    const nextButton = document.querySelector('.category-swiper-button-next') as HTMLElement;
                    nextButton?.click();
                }
            }
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="category-swiper-button-next absolute top-[35%] -translate-y-1/2 -right-3 z-50 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full shadow-lg border border-gray-200 flex items-center justify-center text-gray-700 hover:bg-white hover:shadow-xl hover:scale-110 transition-all duration-300 cursor-pointer group"
        >
            <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={!isRTL ? "M15 19l-7-7 7-7" : "M9 5l7 7-7 7"} />
            </svg>
        </motion.div>
    </Swiper>

    <style jsx global>{`
                        .swiper-button-next,
                        .swiper-button-prev {
                            width: 36px !important;
                            height: 36px !important;
                            background: white !important;
                            border-radius: 50% !important;
                            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important;
                            transition: all 0.3s ease !important;
                        }

                        .swiper-button-next:hover,
                        .swiper-button-prev:hover {
                            background: #043364 !important;
                            box-shadow: 0 6px 16px rgba(4, 51, 100, 0.3) !important;
                            transform: scale(1.1);
                        }

                        .swiper-button-next::after,
                        .swiper-button-prev::after {
                            font-size: 14px !important;
                            font-weight: bold !important;
                            color: #043364 !important;
                        }

                        .swiper-button-next:hover::after,
                        .swiper-button-prev:hover::after {
                            color: white !important;
                        }

                        @media (min-width: 640px) {
                            .swiper-button-next,
                            .swiper-button-prev {
                                width: 44px !important;
                                height: 44px !important;
                            }

                            .swiper-button-next::after,
                            .swiper-button-prev::after {
                                font-size: 16px !important;
                            }
                        }

                        @media (max-width: 639px) {
                            .swiper-button-next,
                            .swiper-button-prev {
                                display: none !important;
                            }
                        }

                        .swiper-button-disabled {
                            opacity: 0.3 !important;
                            cursor: not-allowed !important;
                        }
                    `}</style>
</div>
            </div >
        </section >
    );
};

export default CategoryCarousel;
    
    
    */}