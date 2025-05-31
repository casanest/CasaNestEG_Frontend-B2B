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

  return (
    <div className="content-container py-6  ">
      <div
        dir={isRTL ? "rtl" : "ltr"}
        className="flex flex-col small:flex-row small:items-start gap-x-6 "
      >
        {/* Sidebar Filters */}
        <div className={`hidden small:block w-full small:w-72  `}>
          <RefinementList
            locale={locale}
            sortBy={sort}
            data-testid="sort-by-container"
          />
        </div>

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
                    {count}
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
      <div className="small:hidden fixed bottom-6 left-1/2 transform -translate-x-1/2">
        <button className="bg-gray-900 text-white px-6 py-3 rounded-full shadow-lg text-sm font-medium">
          {isRTL ? 'تصفية' : 'Filters'}
        </button>
      </div>
    </div>
  )
}