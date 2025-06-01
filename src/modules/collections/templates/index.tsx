import { Suspense } from "react"

import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid"
import RefinementList from "@modules/store/components/refinement-list"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import PaginatedProducts from "@modules/store/templates/paginated-products"
import { HttpTypes } from "@medusajs/types"
import { getLocale } from "next-intl/server"
export default async function CollectionTemplate({
  sortBy,
  collection,
  page,
  countryCode,
}: {
  sortBy?: SortOptions
  collection: HttpTypes.StoreCollection
  page?: string
  countryCode: string
}) {
  const pageNumber = page ? parseInt(page) : 1
  const sort = sortBy || "created_at"
  const locale = await getLocale()
  const isRTL = locale === "ar"
  const count = collection.products?.length

  return (
    <div
      dir={locale === "ar" ? "rtl" : "ltr"}
      className="flex flex-col small:flex-row small:items-start py-6 content-container gap-x-6"
    >
      <div className={`hidden small:block w-full small:w-72  `}>
        <RefinementList locale={locale} sortBy={sort} />
      </div>
      <div className="w-full">
        <div className="mb-8 text-2xl-semi text-[#043364]">
          <h1>{collection.title}</h1>
        </div>
        <div className={`flex items-center justify-between mb-6 bg-gray-50 rounded-xl p-4 mt-2`}>
          <div className={`
                    inline-flex items-center px-3 py-1.5 rounded-full
                    text-xs font-medium
                    bg-white dark:bg-gray-700 
                    text-gray-800 dark:text-gray-200
                    border border-gray-200 dark:border-gray-600
                    ${isRTL ? 'ml-2' : 'mr-2'}
                  `}>
            <span className="font-semibold text-gray-900 dark:text-gray-100">
              {collection.products?.length}
            </span>
            <span className={`${isRTL ? 'mr-1' : 'ml-1'}`}>
              {isRTL ?
                (count === 1 ? 'نتيجة' : 'نتائج') :
                (count === 1 ? 'result' : 'results')
              }
            </span>

          </div>

          {/* {category.description && !hasSubcategories && (
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                      {category.description}
                    </p>
                  )} */}
          <div className={` md:hidden `}>
            <RefinementList
              locale={locale}
              sortBy={sort}
              data-testid="sort-by-container"
            />
          </div>
        </div>
        <Suspense
          fallback={
            <SkeletonProductGrid
              numberOfProducts={collection.products?.length}
            />
          }
        >
          <PaginatedProducts
            products={collection?.products}
            sortBy={sort}
            page={pageNumber}
            collectionId={collection.id}
            countryCode={countryCode}
          />
        </Suspense>
      </div>
    </div>
  )
}
