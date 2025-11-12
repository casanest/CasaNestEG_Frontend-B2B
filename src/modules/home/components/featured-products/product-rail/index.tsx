"use client"

import { listProducts } from "@lib/data/products"
import { HttpTypes } from "@medusajs/types"
import InteractiveLink from "@modules/common/components/interactive-link"
import ProductCard from "../../productGrid/productCard"
import { Heading } from "@modules/common/components/heading"
import { motion } from "framer-motion"

export default async function ProductRail({
  collection,
  region,
  locale,
}: {
  collection: HttpTypes.StoreCollection
  region: HttpTypes.StoreRegion
  locale: string
}) {
  const dir = locale === "ar" ? "rtl" : "ltr"
  const isRTL = locale === "ar"

  const {
    response: { products: pricedProducts },
  } = await listProducts({
    regionId: region.id,
    queryParams: {
      collection_id: collection.id,
      fields: "*variants.calculated_price",
    },
  })

  if (!pricedProducts || pricedProducts.length === 0) {
    return null
  }

  return (
    <section
      dir={dir}
      className="content-container py-12 sm:py-16 px-4 sm:px-6 lg:px-8 w-full bg-white "
    >
      <div className="max-w-screen-2xl mx-auto">
        {/* Header with gradient background */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className={`w-full relative flex flex-col sm:flex-row items-center justify-between gap-4 mb-10 sm:mb-14 ${isRTL ? "sm:flex-row-reverse" : ""
            }`}
        >
          {/* Left side - Title */}
          <div className={`flex-1 ${isRTL ? "text-right" : "text-left"}`}>
            <div className="flex items-center gap-3">
              <div className={`h-12 w-1 bg-gradient-to-b from-[#043364] to-teal-500 rounded-full ${isRTL ? "order-2" : ""}`}></div>
              <div className={isRTL ? "order-1" : ""}>
                <Heading className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#043364] mb-1">
                  {collection.title}
                </Heading>
                {collection.metadata?.description && (
                  <p className="text-sm text-gray-600 mt-1">
                    {isRTL
                      ? (collection.metadata.description_ar as string) ?? collection.metadata.description
                      : collection.metadata.description as string
                    }
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Right side - View All Link */}
          <InteractiveLink
            href={`/collections/${collection.handle}`}
            className={`
              group flex items-center gap-2 px-6 py-3 
              bg-gradient-to-r from-[#043364] to-teal-600
              text-white font-semibold text-sm rounded-full
              hover:shadow-lg hover:scale-105
              transition-all duration-300
              ${isRTL ? "flex-row-reverse" : ""}
            `}
          >
            <span>{isRTL ? "عرض الكل" : "View All"}</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`h-5 w-5 transition-transform group-hover:translate-x-1 ${isRTL ? "rotate-180" : ""}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </InteractiveLink>
        </motion.div>

        {/* Desktop Grid */}
        <motion.ul
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, staggerChildren: 0.1 }}
          viewport={{ once: true }}
          className="
            hidden sm:grid
            grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4
            gap-4 sm:gap-5 lg:gap-6
          "
        >
          {pricedProducts.slice(0, 10).map((product, index) => (
            <motion.li
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              viewport={{ once: true }}
              className="h-full"
            >
              <ProductCard product={product} locale={locale} />
            </motion.li>
          ))}
        </motion.ul>

        {/* Mobile Horizontal Scroll */}
        <div className="sm:hidden">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="overflow-x-auto scrollbar-hide -mx-4"
          >
            <div className={`flex gap-4 px-4 pb-4 ${isRTL ? "flex-row-reverse" : ""}`}>
              {pricedProducts.slice(0, 10).map((product) => (
                <div
                  key={product.id}
                  className="min-w-[70%] max-w-[70%] flex-shrink-0"
                >
                  <ProductCard product={product} locale={locale} />
                </div>
              ))}
            </div>
          </motion.div>

          {/* Scroll indicator */}
          <div className="flex justify-center mt-4 gap-2">
            <div className="h-1 w-8 bg-gray-300 rounded-full"></div>
            <div className="h-1 w-8 bg-[#043364] rounded-full"></div>
            <div className="h-1 w-8 bg-gray-300 rounded-full"></div>
          </div>
        </div>

        {/* Product count badge */}
        {/* <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          viewport={{ once: true }}
          className="mt-8 text-center"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full text-sm text-gray-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            {isRTL
              ? `${pricedProducts.length} منتج متاح`
              : `${pricedProducts.length} products available`
            }
          </span>
        </motion.div> */}
      </div>

      {/* Custom scrollbar styles */}
      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </section>
  )
}