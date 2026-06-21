"use client";

import React, { useMemo, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";

import "swiper/css";
import "swiper/css/navigation";

import Link from "next/link";
import Image from "next/image";
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


interface Props {
    locale: string;
    dir: string;
    productCategories: Category[];
}



const CategoryCarousel = ({
    locale,
    dir,
    productCategories
}: Props) => {


    const isRTL = dir === "rtl";


    const swiperRef = useRef<SwiperType | null>(null);



    const categories = useMemo(() => {

        return productCategories.filter(
            item => !item.parent_category_id
        );

    }, [productCategories]);




    if (!categories.length) {

        return (

            <div className="
                text-center
                py-20
                text-gray-500
            ">

                {isRTL
                    ? "لا توجد أقسام"
                    : "No categories"
                }

            </div>

        );

    }




    return (


        <section
            dir={dir}
            className="
            w-full
            relative
            "
        >



            {/* Header */}

            <motion.div

                initial={{
                    opacity: 0,
                    y: -20
                }}

                whileInView={{
                    opacity: 1,
                    y: 0
                }}

                viewport={{
                    once: true
                }}

                className="
                text-center
                mb-10
                "

            >


                <span
                    className="
                    inline-flex
                    items-center
                    gap-2
                    px-5
                    py-2
                    rounded-full
                    bg-[#043364]/10
                    text-[#043364]
                    font-semibold
                    text-sm
                    "
                >

                    {/* 🛒 */}

                    {
                        isRTL
                            ?
                            "تسوق حسب القسم"
                            :
                            "Shop by Category"
                    }

                </span>


            </motion.div>






            <div className="relative">



                <Swiper


                    modules={[
                        Navigation
                    ]}


                    onSwiper={(swiper) => {

                        swiperRef.current = swiper;

                    }}


                    loop={categories.length > 5}


                    grabCursor


                    spaceBetween={20}


                    slidesPerView={3}



                    navigation={{

                        nextEl:
                            ".category-next",

                        prevEl:
                            ".category-prev"

                    }}



                    breakpoints={{


                        480: {

                            slidesPerView: 3

                        },


                        640: {

                            slidesPerView: 4

                        },


                        1024: {

                            slidesPerView: 5

                        },


                        1280: {

                            slidesPerView: 6

                        }


                    }}



                    dir={dir}


                    className="
                    !pb-5
                    "

                >





                    {
                        categories
                            .slice(0, 12)
                            .map((category, index) => (



                                <SwiperSlide
                                    key={category.id}
                                >



                                    <Link

                                        href={
                                            `/${locale}/categories/${isRTL
                                                ?
                                                category.handle_ar
                                                :
                                                category.handle_en
                                            }`
                                        }


                                        className="
                                    flex
                                    justify-center
                                    "

                                    >



                                        <motion.div


                                            whileHover={{
                                                y: -8
                                            }}


                                            whileTap={{
                                                scale: .95
                                            }}



                                            className="
                                        flex
                                        flex-col
                                        items-center
                                        text-center
                                        group
                                        pt-3
                                        "


                                        >




                                            <div

                                                className="
                                        w-24
                                        h-24

                                        sm:w-32
                                        sm:h-32

                                        lg:w-36
                                        lg:h-36

                                        rounded-full

                                        p-[3px]

                                        bg-gradient-to-tr
                                        from-[#043364]
                                        via-[#065a9e]
                                        to-emerald-500

                                        shadow-lg

                                        group-hover:shadow-xl

                                        transition

                                        "

                                            >



                                                <div

                                                    className="
                                            w-full
                                            h-full
                                            rounded-full
                                            bg-white
                                            flex
                                            items-center
                                            justify-center
                                            
                                            "

                                                >


                                                    {
                                                        category.image_url

                                                            ?

                                                            <Image

                                                                src={
                                                                    category.image_url
                                                                }

                                                                width={160}
                                                                height={160}

                                                                alt={
                                                                    isRTL
                                                                        ?
                                                                        category.name_ar
                                                                        :
                                                                        category.name_en
                                                                }


                                                                loading="lazy"


                                                                className="
                                                    w-[120%]
                                                    h-[120%]
                                                    object-contain
                                                    group-hover:scale-110
                                                    transition
                                                    "

                                                            />


                                                            :

                                                            <span
                                                                className="
                                                    text-4xl
                                                    "
                                                            >
                                                                🏷️
                                                            </span>


                                                    }


                                                </div>


                                            </div>





                                            <h3

                                                className="
                                        mt-3

                                        text-sm
                                        sm:text-base

                                        font-bold

                                        text-[#043364]

                                        line-clamp-2

                                        "

                                            >

                                                {
                                                    isRTL
                                                        ?
                                                        category.name_ar
                                                        :
                                                        category.name_en
                                                }


                                            </h3>



                                        </motion.div>


                                    </Link>


                                </SwiperSlide>



                            ))
                    }



                </Swiper>







                {/* Navigation */}



                <button


                    className="
                category-prev

                hidden
                md:flex

                absolute

                left-0
                top-1/2

                -translate-y-1/2

                z-20

                w-11
                h-11

                rounded-full

                bg-white

                shadow-lg

                items-center
                justify-center

                "

                >

                    ‹


                </button>





                <button


                    className="
                category-next

                hidden
                md:flex

                absolute

                right-0
                top-1/2

                -translate-y-1/2

                z-20

                w-11
                h-11

                rounded-full

                bg-white

                shadow-lg

                items-center
                justify-center

                "

                >

                    ›


                </button>






            </div>


        </section>


    );

};


export default CategoryCarousel;