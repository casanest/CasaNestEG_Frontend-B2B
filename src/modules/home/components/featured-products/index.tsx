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
  return (
    <section className="w-full bg-white ">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 overflow-hidden">
        <motion.ul
          initial="hidden"
          whileInView="visible"
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: {
              opacity: 1,
              y: 0,
              transition: { duration: 0.5, staggerChildren: 0.15 },
            },
          }}
          viewport={{ once: true }}
          className="flex flex-col gap-12 sm:gap-16"
        >
          {collections.map((collection) => (
            <motion.li
              key={collection.id}
              variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
            >
              <ProductRail collection={collection} region={region} locale={locale} />
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </section>
  )
}
