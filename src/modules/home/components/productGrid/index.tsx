"use client";
import React from 'react';
import { useLocale } from 'next-intl';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import ProductCard from './productCard';

const Products = ({ isRTL }: { isRTL: boolean }) => {
    const products = [
        {
            id: 1,
            title: isRTL ? "بيبي بريزا - جهاز تسخين رضاعات الأطفال الفوري - أبيض" : "Pebiby - Baby Skin Care Device - White",
            thumbnail: "/cat1.png",
        },
        {
            id: 2,
            title: isRTL ? "فريدا موم - فوط ماكسي آيس بعد الولادة 2 في 1" : "Frida Mom - Baby Maxi Air Conditioner",
            thumbnail: "/cat2.png",
        },
        {
            id: 3,
            title: isRTL ? "جيكل - مهد الأطفال الجانبي نوفا - رمادي" : "Gel - Baby Side Table - Grey",
            thumbnail: "/cat3.png",
        },
        {
            id: 4,
            title: isRTL ? "جيكل - مستلزمات الاستحمام للطفل - مجموعة كاملة" : "Gel - Baby Care Essentials - Complete Set",
            thumbnail: "/cat4.png",
        },
        {
            id: 5,
            title: isRTL ? "جيكل - كرسي سيارة للأطفال ساتورن زيب 360 أيزو فيكس - أسود" : "Gel - Baby Car Seat Satorn Zib 360 Azov Fix - Black",
            thumbnail: "/cat5.png",
        },
        {
            id: 6,
            title: isRTL ? "حقيبة الأمومة الفاخرة مع عازل حراري" : "Frida Mom - Baby Maxi Air Conditioner",
            thumbnail: "/cat6.png",
        },
        {
            id: 7,
            title: isRTL ? "مستلزمات الاستحمام للطفل - مجموعة كاملة" : "Gel - Baby Care Essentials - Complete Set",
            thumbnail: "/cat7.png",
        },
        {
            id: 8,
            title: isRTL ? "جيكل - كرسي سيارة للأطفال ساتورن زيب 360 أيزو فيكس - أسود" : "Gel - Baby Car Seat Satorn Zib 360 Azov Fix - Black",
            thumbnail: "/cat3.png",
        },
        {
            id: 9,
            title: isRTL ? "جيكل - كرسي سيارة للأطفال ساتورن زيب 360 أيزو فيكس - أسود" : "Gel - Baby Car Seat Satorn Zib 360 Azov Fix - Black",
            thumbnail: "/cat5.png",
        },
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
                       <ProductCard product={product} isRTL={isRTL} />
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