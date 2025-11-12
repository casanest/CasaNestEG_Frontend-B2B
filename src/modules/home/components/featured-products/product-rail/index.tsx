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
      className="content-container   px-4 sm:px-6 lg:px-8 w-full relative overflow-hidden"
    >

      <div className="max-w-screen-2xl mx-auto relative z-10">
     

        {/* Desktop Grid with stagger animation */}
        <motion.ul
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={{
            visible: {
              transition: {
                staggerChildren: 0.08,
              },
            },
          }}
          className="
            hidden sm:grid
            grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4
            gap-4 sm:gap-5 lg:gap-6
          "
        >
          {pricedProducts.slice(0, 8).map((product, index) => (
            <motion.li
              key={product.id}
              variants={{
                hidden: { opacity: 0, y: 30, scale: 0.95 },
                visible: {
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  transition: {
                    duration: 0.5,
                    ease: "easeOut",
                  },
                },
              }}
              className="h-full"
            >
              <ProductCard product={product} locale={locale} />
            </motion.li>
          ))}
        </motion.ul>

        {/* Mobile Horizontal Scroll with enhanced indicators */}
        <div className="sm:hidden">
          <motion.div
            initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="relative"
          >
            {/* Scroll gradient overlays */}
            <div
              className={`absolute ${isRTL ? "left-0" : "right-0"
                } top-0 bottom-0 w-16 bg-gradient-to-${isRTL ? "l" : "r"
                } from-transparent to-white pointer-events-none z-10`}
            />

            <div className="overflow-x-auto scrollbar-hide -mx-4 px-4">
              <div className={`flex gap-4 pb-4 ${isRTL ? "flex-row-reverse" : ""}`}>
                {pricedProducts.slice(0, 10).map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                    viewport={{ once: true }}
                    className="min-w-[75%] max-w-[75%] flex-shrink-0"
                  >
                    <ProductCard product={product} locale={locale} />
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Enhanced scroll indicators */}
          <div className="flex justify-center mt-6 gap-2">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                transition={{ delay: i * 0.1, duration: 0.4 }}
                viewport={{ once: true }}
                className={`h-1.5 rounded-full transition-all duration-300 ${i === 0
                    ? "w-10 bg-gradient-to-r from-[#043364] to-teal-500"
                    : "w-6 bg-gray-300"
                  }`}
              />
            ))}
          </div>
        </div>

        {/* View All Products CTA (Bottom) */}
        {pricedProducts.length > 8 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
            className="mt-12 text-center"
          >
            <InteractiveLink
              href={`/collections/${collection.handle}`}
              className="inline-flex items-center gap-2 text-[#043364] hover:text-teal-600 font-semibold text-sm group transition-colors"
            >
              <span>
                {isRTL
                  ? `عرض جميع المنتجات (${pricedProducts.length})`
                  : `View all products (${pricedProducts.length})`}
              </span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`h-4 w-4 transition-transform group-hover:translate-x-1 ${isRTL ? "rotate-180" : ""
                  }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </InteractiveLink>
          </motion.div>
        )}
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