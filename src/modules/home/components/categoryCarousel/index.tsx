"use client";
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import Link from "next/link";
import { motion } from "framer-motion";

const categories = [
    {
        title: "Built-in Oven",
        image: "/logoLacasa.jpg",
        link: "/categories/ovens",
        bgColor: "bg-gradient-to-tr from-blue-600 to-[#043364]",
    },
    {
        title: "Range Hood",
        image: "/images/hood.png",
        link: "/categories/hoods",
        bgColor: "bg-gradient-to-tr from-blue-700 to-[#043364]",
    },
    {
        title: "Built-in Cooker",
        image: "/images/cooker.png",
        link: "/categories/cookers",
        bgColor: "bg-gradient-to-tr from-blue-500 to-[#043364]",
    },
    {
        title: "Refrigerators",
        image: "/images/fridge.png",
        link: "/categories/refrigerators",
        bgColor: "bg-gradient-to-tr from-cyan-500 to-[#043364]",
    },
    {
        title: "Washing Machines",
        image: "/images/washer.png",
        link: "/categories/washers",
        bgColor: "bg-gradient-to-tr from-indigo-500 to-[#043364]",
    },
    {
        title: "Microwave Ovens",
        image: "/images/microwave.png",
        link: "/categories/microwaves",
        bgColor: "bg-gradient-to-tr from-sky-500 to-[#043364]",
    },
    {
        title: "Dishwashers",
        image: "/images/dishwasher.png",
        link: "/categories/dishwashers",
        bgColor: "bg-gradient-to-tr from-teal-500 to-[#043364]",
    },
    {
        title: "Coffee Machines",
        image: "/images/coffee.png",
        link: "/categories/coffee-machines",
        bgColor: "bg-gradient-to-tr from-amber-500 to-[#043364]",
    },
    {
        title: "Wine Coolers",
        image: "/images/wine-cooler.png",
        link: "/categories/wine-coolers",
        bgColor: "bg-gradient-to-tr from-violet-500 to-[#043364]",
    },
];
const CategoryCarousel = () => {
    return (
        <section className="relative bg-white py-12 sm:py-16">
            <div className="max-w-screen-xl mx-auto px-4 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    viewport={{ once: true }}
                >
                    <h2 className="text-3xl sm:text-4xl font-bold text-[#043364] mb-4 tracking-tight">
                        ✨ Explore Categories
                    </h2>
                    <p className="text-gray-600 text-lg mb-8 sm:mb-12 max-w-xl mx-auto">
                        Curated range of appliances for a smarter home
                    </p>
                </motion.div>

                <div className="relative px-2">
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
                                        className="flex flex-col items-center cursor-pointer h-full  py-4"
                                    >
                                        {/* Image container with half-circle text at bottom */}
                                        <div className="relative w-full h-40 sm:h-48 md:h-56 flex justify-center">
                                            {/* Product image */}
                                            <div className={`relative w-32 h-32 sm:w-36 sm:h-36 md:w-40 md:h-40 rounded-full ${cat.bgColor} flex items-center justify-center`}>
                                                <motion.img
                                                    src={cat.image}
                                                    alt={cat.title}
                                                    className="w-3/4 h-full object-contain z-10 transition-transform duration-150 ease-in-out"
                                                    whileHover={{ scale: 1.1 }}
                                                    animate={{ y: [-5, 5, -5] }}
                                                    transition={{ duration: 1, repeat: Infinity, ease: "easeOut" }}
                                                />
                                            </div>

                                            {/* Half-circle text container - absolutely positioned at bottom */}
                                            <div className="absolute bottom-5 md:bottom-1/4 w-32 h-16 sm:w-36 sm:h-18 md:w-40 md:h-20 z-10">
                                                <div className="absolute inset-0 bg-white rounded-t-full shadow-sm flex items-center justify-center pb-2 px-4">
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