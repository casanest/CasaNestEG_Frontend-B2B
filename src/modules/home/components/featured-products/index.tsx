"use client"
import { HttpTypes } from "@medusajs/types"
import ProductRail from "@modules/home/components/featured-products/product-rail"
import { motion } from "framer-motion"

export default async function FeaturedProducts({
  collections,
  region,
  locale,
}: {
  collections: HttpTypes.StoreCollection[]
  region: HttpTypes.StoreRegion
  locale: string
}) {
  const isRTL = locale === "ar"

  if (!collections || collections.length === 0) {
    return null
  }

  return (
    <section className="w-full  py-12 sm:py-20">
      <div className="max-w-screen-2xl mx-auto  sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="text-center mb-12 sm:mb-16"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#043364]/10 to-gray-500/10 rounded-full mb-4"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-[#043364]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
            </svg>
            <span className="text-sm font-semibold text-[#043364]">
              {isRTL ? "منتجاتنا المميزة" : "Featured Collections"}
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4"
          >
            {isRTL ? (
              <>
                اكتشف <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#043364] to-gray-600">مجموعاتنا</span> الرائعة
              </>
            ) : (
              <>
                Discover Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#043364] to-gray-600">Amazing</span> Collections
              </>
            )}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className="text-gray-600 text-base sm:text-lg max-w-2xl mx-auto"
          >
            {isRTL
              ? "استكشف مجموعتنا المختارة بعناية من المنتجات عالية الجودة"
              : "Explore our carefully curated selection of high-quality products"
            }
          </motion.p>

          {/* Decorative line */}
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            viewport={{ once: true }}
            className="h-1 w-24 bg-gradient-to-r from-[#043364] to-gray-500 mx-auto mt-6 rounded-full"
          />
        </motion.div>

        {/* Collections List */}
        <motion.ul
          initial="hidden"
          whileInView="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                duration: 0.4,
                staggerChildren: 0.2,
                delayChildren: 0.3
              },
            },
          }}
          // viewport={{ once: true, margin: "-100px" }}
          className="flex flex-col  "
        >
          {collections.map((collection, index) => (
            <motion.li
              key={collection.id}
              variants={{
                hidden: { opacity: 0, y: 40 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: {
                    duration: 0.6,
                    ease: "easeOut"
                  }
                }
              }}
              className="relative"
            >
              {/* Background decoration for odd items */}
              {/* {index % 2 === 0 && (
                <div className="absolute inset-0 bg-gradient-to-r from-blue-50/30 to-transparent rounded-3xl -z-10 transform -translate-x-4 translate-y-4" />
              )} */}

              <ProductRail
                collection={collection}
                region={region}
                locale={locale}
              />

              {/* Divider (except for last item)
              {index < collections.length - 1 && (
                <motion.div
                  initial={{ scaleX: 0, opacity: 0 }}
                  whileInView={{ scaleX: 1, opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                  viewport={{ once: true }}
                  className="h-px w-full bg-gradient-to-r from-transparent via-gray-200 to-transparent mt-16 sm:mt-20"
                />
              )} */}
            </motion.li>
          ))}
        </motion.ul>

        {/* Bottom CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="mt-16 sm:mt-20 text-center"
        >
          <div className="bg-gradient-to-tl from-gray-500 to-[#022a55] rounded-3xl p-8 sm:p-12 shadow-xl">
            <h3 className="text-2xl sm:text-3xl font-bold text-white mb-4">
              {isRTL ? "لم تجد ما تبحث عنه؟" : "Can't find what you're looking for?"}
            </h3>
            <p className="text-white/90 mb-6 max-w-xl mx-auto">
              {isRTL
                ? "تصفح جميع منتجاتنا أو اتصل بفريق الدعم للحصول على المساعدة"
                : "Browse all our products or contact our support team for assistance"
              }
            </p>
            <motion.button
              onClick={() => {
                window.location.href = `/${locale}/store`
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3 bg-white text-[#043364] font-semibold rounded-full hover:shadow-lg transition-all duration-300"
            >
              {isRTL ? "تصفح جميع المنتجات" : "Browse All Products"}
            </motion.button>
          </div>
        </motion.div>

        {/* Floating stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          viewport={{ once: true }}
          className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6"
        >
          {[
            { icon: "🏆", label: isRTL ? "منتجات مميزة" : "Premium Quality", value: "100+" },
            { icon: "⚡", label: isRTL ? "شحن سريع" : "Fast Shipping", value: "24h" },
            { icon: "💎", label: isRTL ? "علامات موثوقة" : "Trusted Brands", value: "50+" },
            { icon: "🛡️", label: isRTL ? "ضمان الجودة" : "Quality Guarantee", value: "100%" },
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
              className="bg-white rounded-xl p-4 sm:p-6 shadow-sm hover:shadow-md transition-all text-center"
            >
              <div className="text-3xl mb-2">{stat.icon}</div>
              <div className="text-xl sm:text-2xl font-bold text-[#043364] mb-1">{stat.value}</div>
              <div className="text-xs sm:text-sm text-gray-600">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}