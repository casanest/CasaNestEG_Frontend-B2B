"use client";
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import Link from "next/link";
import { motion } from "framer-motion";

const CategoryCarousel = ({ locale }: { locale: string }) => {
    const isRTL = locale === "ar";
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
        <section className="md:content-container relative bg-white pt-10 "
            dir={isRTL ? "rtl" : "ltr"}
        >
            <div className=" ">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    viewport={{ once: true }}
                >
                    <h2 className="text-2xl md:text-4xl font-bold text-[#043364] mb-4 tracking-tight px-4 md:px-0">
                        {locale === "ar" ? "✨ استكشف الفئات" : "✨ Explore Categories"}
                    </h2>
                    {/* <p className="text-gray-600 text-md md:text-lg  mb-8 sm:mb-12 max-w-2xl mx-auto">
                        {locale === "ar"
                            ? "اكتشف مجموعة واسعة من الأجهزة المنزلية المصممة لتلبية احتياجاتك. من الأفران المدمجة إلى غسالات الصحون، لدينا كل ما تحتاجه لجعل منزلك أكثر راحة وكفاءة."
                            : "Discover a wide range of home appliances designed to meet your needs. From built-in ovens to dishwashers, we have everything you need to make your home more comfortable and efficient."
                        }

                    </p> */}
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
                                                    // increase width and height for better visibility
                                                    width={200}
                                                    height={200}
                                                />
                                            </div>

                                            {/* Half-circle text container - absolutely positioned at bottom */}
                                            <div className="absolute bottom-5 md:bottom-1/4 w-32 h-16 sm:w-36 sm:h-18 md:w-40 md:h-20 z-10 ">
                                                <div className="absolute inset-0 bg-white rounded-t-full shadow-sm flex items-center justify-center pb-3 px-4">
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
        </section>
    );
};

export default CategoryCarousel;