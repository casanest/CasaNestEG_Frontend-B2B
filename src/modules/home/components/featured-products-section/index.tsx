// "use client"

import React from "react"
import ProductCard from "../productGrid/productCard"
import { HttpTypes } from "@medusajs/types"

interface FeaturedProductsSectionProps {
    title?: string
    description?: string
    products: any[]
    locale: string
    region: HttpTypes.StoreRegion
    viewAllHref?: string
}

export default function FeaturedProductsSection({
    title,
    description,
    products,
    locale,
    region,
    viewAllHref = "/collections/featured",
}: FeaturedProductsSectionProps) {
    if (!products || products.length === 0) return null

    const dir = locale === "ar" ? "rtl" : "ltr"

    return (
        <section className="py-16 bg-gradient-to-b from-white to-gray-50" dir={dir}>
            <div className="content-container mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className={`text-center mb-12 ${locale === "ar" ? "rtl" : ""}`}>
                    <h2 className="text-3xl sm:text-4xl font-extrabold text-[#043364] mb-3">
                        {title ||
                            (locale === "ar" ? "المنتجات المميزة" : "Featured Products")}
                    </h2>
                    <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
                        {description ||
                            (locale === "ar"
                                ? "اكتشف مجموعتنا المختارة بعناية من المنتجات عالية الجودة المصممة لتناسب ذوقك."
                                : "Explore our handpicked collection of high-quality products crafted to suit your taste.")}
                    </p>
                </div>

                {/* Product Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-5 gap-y-10 sm:gap-x-8 sm:gap-y-14">
                    {products.slice(0, 8).map((product) => (
                        <div key={product.id}>
                            <ProductCard product={product} locale={locale} />
                        </div>
                    ))}
                </div>

                {/* View All Button */}
                {/* <div className="flex justify-center mt-12">
                    <a
                        href={viewAllHref}
                        className="px-6 py-3 bg-[#043364] text-white text-base font-medium rounded-full shadow-md hover:bg-[#032952] transition-colors duration-300"
                    >
                        {locale === "ar" ? "عرض الكل" : "View All"}
                    </a>
                </div> */}
            </div>
        </section>
    )
}
