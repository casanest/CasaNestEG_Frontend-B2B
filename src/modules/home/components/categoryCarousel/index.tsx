"use client";
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import Link from "next/link";
import { motion } from "framer-motion";

const CategoryCarousel = ({ locale, productCategories }: { locale: string, productCategories: any }) => {
    const isRTL = locale === "ar";
    const slideX = `
        @keyframes slideX {
          from { transform: translateX(${isRTL ? '-100%' : '100%'}) }
          to { transform: translateX(${isRTL ? '100%' : '-100%'}) }
        }
      `;
    const categories = [
        {
            title: isRTL ? "أفران مدمجة" : "Built-in Ovens",
            image: "/cat1.png",
            link: "/categories/ovens",
            bgColor: "bg-gradient-to-tr from-teal-500 to-[#043364]",
        },
        {
            title: isRTL ? "شفاطات" : "Hoods",
            image: "/cat2.png",
            link: "/categories/hoods",
            bgColor: "bg-gradient-to-tr from-teal-500 to-[#043364]",
        },
        {
            title: isRTL ? "طباخات" : "Cookers",
            image: "/cat3.png",
            link: "/categories/cookers",
            bgColor: "bg-gradient-to-tr from-teal-500 to-[#043364]",
        },
        {
            title: isRTL ? "ثلاجات" : "Refrigerators",
            image: "/cat4.png",
            link: "/categories/refrigerators",
            bgColor: "bg-gradient-to-tr from-teal-500 to-[#043364]",
        },
        {
            title: isRTL ? "غسالات" : "Washing Machines",
            image: "/cat5.png",
            link: "/categories/washers",
            bgColor: "bg-gradient-to-tr from-teal-500 to-[#043364]",
        },
        {
            title: isRTL ? "ميكروويف" : "Microwaves",
            image: "/cat6.png",
            link: "/categories/microwaves",
            bgColor: "bg-gradient-to-tr from-teal-500 to-[#043364]",
        },
        {
            title: isRTL ? "غسالات صحون" : "Dishwashers",
            image: "/cat7.png",
            link: "/categories/dishwashers",
            bgColor: "bg-gradient-to-tr from-teal-500 to-[#043364]",
        },
        {
            title: isRTL ? "ماكينات قهوة" : "Coffee Machines",
            image: "/cat8.png",
            link: "/categories/coffee-machines",
            bgColor: "bg-gradient-to-tr from-teal-500 to-[#043364]",
        },

    ];
    return (
        <section className="relative bg-white pt-10  overflow-hidden"
            dir={isRTL ? "rtl" : "ltr"}
        >
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
                            ? "تصفح قائمة الفئات للحصول على المزيد من المنتجات المميزة."
                            : "Browse our category list to find the best products."}
                    </p>

                </motion.div>

                <div className="relative  text-center">
                    <Swiper
                        modules={[Navigation, Autoplay]}
                        loop
                        spaceBetween={20}
                        autoplay={{
                            delay: 2500,
                            disableOnInteraction: false,
                        }}
                        breakpoints={{
                            320: { slidesPerView: 2.5 },
                            480: { slidesPerView: 2.8 },
                            640: { slidesPerView: 3.5 },
                            768: { slidesPerView: 4.2 },
                            1024: { slidesPerView: 5.5 },
                            1280: { slidesPerView: 6.5 },
                        }}
                    >
                        {categories.map((cat, idx) => (
                            <SwiperSlide key={idx}>
                                <Link href={cat.link} passHref>
                                    <motion.div
                                        whileHover={{ y: -5 }}
                                        className="flex flex-col items-center cursor-pointer h-full  pt-10 "                                    >
                                        {/* Image container with half-circle text at bottom */}
                                        <div className="relative w-full h-40 sm:h-48 md:h-56 flex justify-center">
                                            {/* Product image */}
                                            <div className={`relative w-32 h-32 sm:w-36 sm:h-36 md:w-50 md:h-50 rounded-full ${cat.bgColor} flex items-center justify-center`}>
                                                <motion.img
                                                    src={cat.image}
                                                    alt={cat.title}
                                                    className="w-full h-full object-contain z-10 transition-transform duration-150 ease-in-out mb-[70px]"
                                                    whileHover={{ scale: 1.1 }}
                                                    animate={{ y: [-5, 5, -5] }}
                                                    transition={{ duration: 1, repeat: Infinity, ease: "easeOut" }}
                                                    loading="lazy"
                                                    increase width and height for better visibility
                                                    width={200}
                                                    height={200}
                                                />
                                            </div>

                                            {/* Half-circle text container - absolutely positioned at bottom */}
                                            <div className="absolute bottom-5 md:bottom-1/4 w-32 h-16 sm:w-36 sm:h-18 md:w-40 md:h-20 z-10 shadow-none bg-white rounded-t-full shadow-none ">
                                                <div className="absolute  inset-0 bg-white rounded-t-full shadow-sm flex items-center justify-center pb-3 px-4 shadow-none ">
                                                    <span className="text-xs sm:text-sm font-semibold text-gray-800 line-clamp-2">
                                                        {cat.title}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                </Link>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            </div>
            <style jsx>{slideX}</style>
            <div dir={isRTL ? "rtl" : "ltr"} className="mt-8 md:mt-12 relative overflow-hidden bg-gradient-to-tr from-emerald-500 to-[#022a55] text-white">
                {/* Black Friday background stripes */}
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiB2aWV3Qm94PSIwIDAgMTAwIDEwMCI+PHBhdGggZD0iTTAgMEgxMDBWMTAwSDBWMHoiIGZpbGw9Im5vbmUiLz48cGF0aCBkPSJNMCAwTDEwMCAxMDAiIHN0cm9rZT0iI2ZmZiIgc3Ryb2tlLXdpZHRoPSIxIiBzdHJva2Utb3BhY2l0eT0iMC4xIi8+PC9zdmc+')] opacity-20"></div>

                {/* Glowing border effect - reduced on mobile */}
                <div className="absolute inset-0 border-2 md:border-4 border-white/20 rounded-lg animate-pulse"></div>

                {/* Content container - stacked vertically on mobile */}
                <div className={`content-container relative flex flex-col ${isRTL ? 'xs:flex-col-reverse sm:flex-row' : 'xs:flex-col sm:flex-row'} items-center justify-between p-4 md:p-8 gap-3 md:gap-4 w-full mx-auto`}>
                    {/* Title section - centered on mobile */}
                    <div className="relative z-20 text-center">
                        <div className="text-xs md:text-sm uppercase tracking-widest text-yellow-300 font-bold mb-1">
                            {isRTL ? "عرض محدود" : "LIMITED OFFER"}
                        </div>
                        <h3 className="text-xl md:text-4xl font-bold uppercase tracking-tight ">
                            {isRTL ? "الجمعة السوداء" : "BLACK FRIDAY"}
                            <span className="text-yellow-300 drop-shadow-[0_0_8px_rgba(253,224,71,0.8)]"> {isRTL ? "خصم" : "SALE!"}</span>
                        </h3>
                    </div>

                    {/* Middle - Sliding text - adjusted for mobile */}
                    <div className="w-full mx-0 md:mx-8 overflow-hidden z-20 py-2">
                        <div className="relative w-full overflow-hidden">
                            <p className="whitespace-nowrap text-xs md:text-base font-medium uppercase relative animate-[slideX_12s_linear_infinite]">
                                {isRTL ? (
                                    <>
                                        ادفع فقط مقابل <span className="font-bold text-yellow-300 drop-shadow-[0_0_4px_rgba(253,224,71,0.8)]">الأجهزة التي تحبها</span>
                                        <span className="mx-4 md:mx-6 text-yellow-300">•</span>
                                        ادفع فقط مقابل <span className="font-bold text-yellow-300 drop-shadow-[0_0_4px_rgba(253,224,71,0.8)]">الأجهزة التي تحبها</span>
                                    </>
                                ) : (
                                    <>
                                        PAY ONLY FOR <span className="font-bold text-yellow-300 drop-shadow-[0_0_4px_rgba(253,224,71,0.8)]">YOUR FAVORITES</span>
                                        <span className="mx-4 md:mx-6 text-yellow-300">•</span>
                                        PAY ONLY FOR <span className="font-bold text-yellow-300 drop-shadow-[0_0_4px_rgba(253,224,71,0.8)]">YOUR FAVORITES</span>
                                    </>
                                )}
                            </p>
                        </div>
                    </div>

                    {/* Button - full width on mobile */}
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="relative z-20 w-full md:w-auto bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-black px-4 py-2 md:px-8 md:py-4 rounded-none font-bold uppercase tracking-wider shadow-lg shadow-yellow-500/30 transition-all flex items-center justify-center gap-2"
                    >
                        {isRTL ? (
                            <>
                                تسوق الآن
                                <span className="text-lg">←</span>
                            </>
                        ) : (
                            <>
                                SHOP NOW
                                <span className="text-lg">→</span>
                            </>
                        )}
                    </motion.button>
                </div>

                {/* Decorative elements - reduced on mobile */}
                <div className="absolute top-0 left-0 w-16 h-16 md:w-32 md:h-32 bg-yellow-300/20 rounded-full filter blur-xl"></div>
                <div className="absolute bottom-0 right-0 w-20 h-20 md:w-40 md:h-40 bg-white/10 rounded-full filter blur-xl"></div>
                <div className="absolute top-1/4 right-1/4 w-10 h-10 md:w-16 md:h-16 bg-red-500/30 rounded-full filter blur-lg animate-pulse"></div>
            </div>
         

        </section>
    );
};

export default CategoryCarousel;



