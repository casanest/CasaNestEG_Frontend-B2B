'use client';

import React from 'react';
import Link from 'next/link';

const CallToActionBanner = ({ locale }: { locale: string }) => {
    const isRTL = locale === "ar";

    return (
        <section className="bg-gradient-to-tl from-gray-500 to-[#022a55] text-white py-16 rounded-2xl mx-4 md:mx-8">
            <div className="text-center max-w-4xl mx-auto px-4">
                <h2 className="text-3xl md:text-4xl font-bold mb-6">
                    {isRTL ? "ابدأ التسوق اليوم!" : "Start Shopping Today!"}
                </h2>
                <p className="text-xl mb-8 opacity-90">
                    {isRTL 
                        ? "اكتشف مجموعتنا الواسعة من المنتجات عالية الجودة" 
                        : "Discover our wide range of high-quality products"
                    }
                </p>
                <Link 
                    href="/store" 
                    className="inline-block bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors duration-300"
                >
                    {isRTL ? "تسوق الآن" : "Shop Now"}
                </Link>
            </div>
        </section>
    );
};

export default CallToActionBanner; 