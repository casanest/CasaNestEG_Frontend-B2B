import React, { Suspense } from 'react'
import { listProducts, listProductsWithSort } from '@lib/data/products'
import { safeDecodeURIComponent } from '@lib/util/safe-decode-uri'
import { StoreRegion } from '@medusajs/types'
import { Box } from '@modules/common/components/box'
import { Container } from '@modules/common/components/container'
import { Heading } from '@modules/common/components/heading'
import { Text } from '@modules/common/components/text'
import { search } from '@modules/search/actions'
import SkeletonProductGrid from '@modules/skeletons/templates/skeleton-product-grid'
import PaginatedProducts from '@modules/store/templates/paginated-products'
import { SearchResultsIcon } from '@modules/common/icons/search-results'
import { getLocale } from 'next-intl/server'
import RefinementList from '@modules/store/components/refinement-list'
import { getParentCategories, listCategories } from '@lib/data/categories'
import { ProductsToolbar } from '@modules/categories/components/productsToolbar'

export const runtime = 'edge'

type SearchResultsTemplateProps = {
  query: string
  sortBy?: string
  page?: string
  collection?: string[]
  type?: string[]
  material?: string[]
  price?: string[]
  currency_code: string
  countryCode: string
}

export default async function SearchResultsTemplate({
  query,
  sortBy,
  page,
  collection,
  type,
  material,
  price,
  currency_code,
  countryCode,
}: SearchResultsTemplateProps) {
  const pageNumber = page ? parseInt(page) : 1
  const locale = await getLocale()
  const sort = sortBy || 'created_at'
  const isRTL = locale === "ar"

  const { results, count } = await search({
    currency_code: currency_code,
    query,
    order: sortBy,
    page: pageNumber,
  })

  const {
    response: { products: recommendedProducts },
  } = await listProducts({
    pageParam: 0,
    queryParams: {
      limit: 9,
    },
    countryCode: countryCode,
  })
  const categoryTree = await listCategories()
  const parentCategories = getParentCategories(categoryTree).map((category) => ({
    id: category.id,
    name_en: category.name_en,
    name_ar: category.name_ar,
  }))

  return (
    <div className="content-container py-6  ">
      <div
        dir={isRTL ? "rtl" : "ltr"}
        className="flex flex-col small:flex-row small:items-start gap-x-6 "
      >
        {/* Desktop Sidebar - Hidden on mobile */}
        {results && results.length > 0 && (
          // <div className="hidden small:block w-full small:w-72 small:sticky small:top-6">
          //   <RefinementList
          //     locale={locale}
          //     sortBy={sort}
          //     countryCode={countryCode}
          //     categories={parentCategories}
          //     inline
          //   />
          // </div>
          <aside dir={isRTL ? "rtl" : "ltr"} className="hidden small:block w-full small:w-72 flex-shrink-0 small:sticky small:top-24 mb-8 small:mb-0">
            <div className="rounded-2xl bg-gray-50 dark:bg-gray-900/50 p-6 border border-gray-100 dark:border-gray-800">
              {/* <h2 className="text-lg font-bold text-gray-950 dark:text-white mb-5">
                        {isRTL ? "الاقسام" : "Categories"}
                      </h2> */}
              <RefinementList
                locale={locale}
                sortBy={sort}
                countryCode={countryCode}
                categories={parentCategories}
                inline // This will render it as a tree menu
              />
            </div>
          </aside>
        )}
        {/* Sidebar Filters */}
        {/* <div className={`hidden small:block w-full small:w-72  `}>
          <RefinementList
            locale={locale}
            sortBy={sort}
            data-testid="sort-by-container"
          />
        </div> */}

        {/* Main Content */}
        <div className="flex-1 w-full">
          {results && results.length > 0 ? (
            <>
              <Box className="flex flex-col gap-4 mb-8">
                <Heading
                  as="h1"
                  className={`text-3xl sm:text-4xl font-semibold text-gray-900 ${isRTL ? 'text-right' : 'text-left'}`}
                >
                  &quot;{safeDecodeURIComponent(query)}&quot;
                </Heading>
                {/* <Text className={`text-sm sm:text-md text-gray-500 ${isRTL ? 'text-right' : 'text-left'}`}>
                  {count === 1 ? `${count} ${isRTL ? 'منتج' : 'product'}` : `${count} ${isRTL ? 'منتجات' : 'products'}`}
                </Text> */}
              </Box>
              <ProductsToolbar
                productCount={results.length}
                sort={sort} 
                isRTL={isRTL}
                locale={locale}
                countryCode={countryCode}
              />

              <Suspense fallback={<SkeletonProductGrid />}>
                <PaginatedProducts
                  productsIds={results.map((p) => p.id)}
                  page={pageNumber}
                  countryCode={countryCode}
                />
              </Suspense>
            </>
          ) : (
            <Box className="flex flex-col items-center gap-6 py-12 sm:py-16">
              <div className="w-24 h-24 text-gray-300">
                <SearchResultsIcon />
              </div>
              <Box className={`flex flex-col items-center gap-2 ${isRTL ? 'text-right' : 'text-left'}`}>
                <Heading as="h3" className="text-xl sm:text-2xl font-medium text-gray-900">
                  {isRTL ? 'لا توجد نتائج لـ' : 'No results for'} &quot;{safeDecodeURIComponent(query)}&quot;
                </Heading>
                <p className="text-center text-sm sm:text-md text-gray-500 max-w-md">
                  {isRTL ? 'الرجاء المحاولة مرة أخرى باستخدام كلمات مختلفة أو عبارة أخرى' : 'Please try again using a different spelling or phrase'}
                </p>
              </Box>
            </Box>
          )}
        </div>
      </div>

      {/* Mobile Filters Button - You might want to implement this */}
      {/* <div className="small:hidden fixed bottom-6 left-1/2 transform -translate-x-1/2">
        <button className="bg-gray-900 text-white px-6 py-3 rounded-full shadow-lg text-sm font-medium">
          {isRTL ? 'تصفية' : 'Filters'}
        </button>
      </div> */}
    </div>
  )
}