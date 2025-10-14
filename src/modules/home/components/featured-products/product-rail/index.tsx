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
      className="content-container  px-4 sm:px-6 lg:px-8 overflow-hidden"
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        className={`flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 sm:mb-12 ${dir === "rtl" ? "sm:flex-row-reverse" : ""
          }`}
      >
        <div className="text-center sm:text-start">
          <Heading className="text-2xl md:text-3xl font-extrabold text-[#043364] tracking-tight">
            {collection.title}
          </Heading>
          <div className="h-[2px] w-20 bg-[#043364]/70 mx-auto sm:mx-0 mt-2 rounded-full"></div>
        </div>

        <InteractiveLink
          href={`/collections/${collection.handle}`}
          className="text-sm sm:text-base font-medium text-[#043364] hover:text-teal-600 transition-colors duration-200"
        >
          {locale === "ar" ? "عرض الكل →" : "View All →"}
        </InteractiveLink>
      </motion.div>

      {/* Product List */}
      <ul
        className="
          grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5
          gap-x-4 sm:gap-x-6 lg:gap-x-8
          gap-y-10 sm:gap-y-14
          max-w-screen-2xl
          mx-auto
          overflow-hidden
          transition-all
        "
      >
        {pricedProducts.map((product) => (
          <motion.li
            key={product.id}
            whileHover={{ scale: 1.03 }}
            transition={{ duration: 0.3 }}
            className="flex justify-center"
          >
            <ProductCard product={product} locale={locale} />
          </motion.li>
        ))}
      </ul>

      {/* Mobile horizontal scroll */}
      <div className="sm:hidden mt-6 overflow-x-auto scrollbar-hide -mx-4 px-4">
        <div className="flex gap-4">
          {pricedProducts.slice(0, 10).map((product) => (
            <div key={product.id} className="min-w-[70%] flex-shrink-0">
              <ProductCard product={product} locale={locale} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
