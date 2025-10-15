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

    if (!productCategories || productCategories.length === 0) {
        return (
            <div className="text-center py-20 bg-gray-50 rounded-2xl">
                <h3 className="text-2xl font-semibold text-gray-700 mb-3">
                    {isRTL ? "لا توجد فئات متاحة حالياً" : "No categories available at the moment"}
                </h3>
                <p className="text-gray-500">
                    {isRTL ? "يرجى التحقق لاحقاً" : "Please check back later"}
                </p>
            </div>
        );
    }

    return (
        <section className="relative   overflow-hidden" dir={isRTL ? "rtl" : "ltr"}>
            <div className=" mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 25 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className="text-center mb-12"
                >
                    <div className="flex items-center gap-3 sm:mx-auto ">
                        <h2 className="sm:mx-auto text-2xl md:text-4xl font-bold text-[#043364] tracking-tight">
                            {isRTL ? "✨ استكشف الفئات" : "✨ Explore Categories"}
                        </h2>
                        <div className="hidden md:block flex-1 h-[2px] bg-gradient-to-r from-transparent via-[#043364] to-transparent"></div>
                    </div>
                    {/* <h2 className="text-3xl md:text-4xl font-extrabold text-[#043364] mb-3">
                        {isRTL ? "✨ استكشف الفئات" : "✨ Explore Categories"}
                    </h2> */}
                    {/* <p className="text-gray-600 text-sm md:text-base max-w-xl mx-auto">
                        {isRTL
                            ? "تصفح قائمة الفئات للعثور على منتجات مميزة وعروض رائعة."
                            : "Browse our curated categories to discover amazing products and offers."}
                    </p>
                    <div className="mt-4 w-24 h-1 bg-[#043364]/70 mx-auto rounded-full"></div> */}
                </motion.div>

                {/* Carousel */}
                <div className="relative group pt-10">
                    <Swiper
                        modules={[Navigation, Autoplay]}
                        loop
                        spaceBetween={24}
                        slidesPerView={1}
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
                        dir={isRTL ? "rtl" : "ltr"}
                        className="!overflow-visible"
                    >
                        {productCategories.slice(0, 10).map((category) => (
                            <SwiperSlide key={category.id} className="!h-auto pb-14">
                                <Link href={`/categories/${category.handle}`} className="block">
                                    <motion.div
                                        whileHover={{ scale: 1.04, y: -4 }}
                                        transition={{ type: "spring", stiffness: 200 }}
                                        className="bg-white border border-gray-200 shadow-sm hover:shadow-xl rounded-2xl p-6 h-full flex flex-col items-center justify-center text-center relative group/card"
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-tr from-[#043364]/10 via-teal-500/5 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-300 rounded-2xl"></div>

                                        <div className="w-20 h-20 mb-4 rounded-full bg-gradient-to-tr from-[#043364] to-teal-500 flex items-center justify-center text-3xl text-white shadow-lg group-hover/card:scale-105 transition-transform duration-300">
                                            {category.metadata?.thumbnail ? (
                                                <img
                                                    src={category.metadata.thumbnail}
                                                    alt={category.name}
                                                    className="w-full h-full object-cover rounded-full"
                                                />
                                            ) : (
                                                <span>🏷️</span>
                                            )}
                                        </div>

                                        <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">
                                            {category.name}
                                        </h3>

                                        {category.metadata?.product_count && (
                                            <p className="text-xs text-gray-500">
                                                {isRTL
                                                    ? `${category.metadata.product_count} منتج`
                                                    : `${category.metadata.product_count} products`}
                                            </p>
                                        )}
                                    </motion.div>
                                </Link>
                            </SwiperSlide>
                        ))}
                    </Swiper>

                    {/* Navigation Buttons */}
                    <div className="absolute inset-y-0 right-0 flex items-center pointer-events-none">
                        <div
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
      transform hover:scale-105 
      hover:shadow-xl
      backdrop-blur-sm
    `}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2}
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                            </svg>
                        </div>


                        <style jsx global>{`
    /* Hide the default Swiper arrows */
    .swiper-button-prev::after,
    .swiper-button-next::after {
      display: none !important;
    }
  `}</style>
                    </div>
                    <div className="absolute inset-y-0 left-0 flex items-center pointer-events-none">
                        <div
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
      transform hover:scale-105 
      hover:shadow-xl
      backdrop-blur-sm
    `}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2}
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                            </svg>
                        </div>


                        <style jsx global>{`
    /* Hide the default Swiper arrows */
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
