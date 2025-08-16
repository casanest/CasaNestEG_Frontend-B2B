import { notFound } from "next/navigation"
import { Suspense } from "react"
import InteractiveLink from "@modules/common/components/interactive-link"
import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid"
import RefinementList from "@modules/store/components/refinement-list"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import PaginatedProducts from "@modules/store/templates/paginated-products"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { HttpTypes } from "@medusajs/types"
import { getLocale } from "next-intl/server"
import { ChevronRight } from "lucide-react"

export default async function CategoryTemplate({
  category,
  sortBy,
  page,
  countryCode,
}: {
  category: HttpTypes.StoreProductCategory
  sortBy?: SortOptions
  page?: string
  countryCode: string
}) {
  const pageNumber = page ? parseInt(page) : 1
  const sort = sortBy || "created_at"

  if (!category || !countryCode) notFound()

  const parents = [] as HttpTypes.StoreProductCategory[]
  const getParents = (category: HttpTypes.StoreProductCategory) => {
    if (category.parent_category) {
      parents.push(category.parent_category)
      getParents(category.parent_category)
    }
  }

  getParents(category)
  const locale = await getLocale()
  const isRTL = locale === "ar"
  const hasSubcategories = category.category_children && category.category_children.length > 0
  const productCount = category.products?.length || 0

  return (
    <div
      dir={isRTL ? "rtl" : "ltr"}
      className="flex flex-col small:flex-row small:items-start py-5 content-container gap-x-6"
      data-testid="category-container"
    >
      <div >
        {/* Mobile Breadcrumb Navigation */}
        <div className="  flex justify-between items-center">
          {/* Breadcrumb Navigation */}
          <div className="flex items-center mb-4 md:mb-6 text-sm text-gray-600 dark:text-gray-400 flex-wrap gap-y-1">
            <LocalizedClientLink
              href="/"
              className="hover:text-gray-900 dark:hover:text-white transition-colors duration-200"
            >
              {isRTL ? "الرئيسية" : "Home"}
            </LocalizedClientLink>

            {parents && parents.reverse().map((parent) => (
              <div key={parent.id} className="flex items-center">
                <ChevronRight className={`mx-2 h-4 w-4 flex-shrink-0 ${isRTL ? 'rotate-180' : ''}`} />
                <LocalizedClientLink
                  className="hover:text-gray-900 dark:hover:text-white transition-colors duration-200 line-clamp-1"
                  href={`/categories/${parent.handle}`}
                  data-testid="sort-by-link"
                >
                  {parent.name}
                </LocalizedClientLink>
              </div>
            ))}

            <ChevronRight className={`mx-2 h-4 w-4 flex-shrink-0 ${isRTL ? 'rotate-180' : ''}`} />
            <span className="text-gray-900 dark:text-white font-medium line-clamp-1">
              {category.name}
            </span>
          </div>
        </div>
        {/* Sidebar Filters */}
        <div className={`hidden small:block w-full small:w-72 `}>
          <RefinementList locale={locale} sortBy={sort} countryCode={countryCode} />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 w-full">
        {/* Category Header - Desktop */}
        <div className="hidden small:block mb-8">
          <h1
            className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4"
            data-testid="category-page-title"
          >
            {category.name}
          </h1>

          {category.description && (
            <div className="prose dark:prose-invert max-w-3xl text-gray-600 dark:text-gray-300 mb-6 text-base lg:text-lg">
              <p>{category.description}</p>
            </div>
          )}

          {/* Category Image if available */}
          {category.metadata?.image_url && (
            <div className="mb-6">
              <img 
                src={category.metadata.image_url} 
                alt={category.metadata.image_alt || `${category.name} category`}
                className="w-full max-w-2xl h-48 object-cover rounded-lg shadow-md"
              />
            </div>
          )}
        </div>

        {/* Mobile Breadcrumb Navigation */}
      

        {/* Subcategories Section - Circular */}
        {hasSubcategories && (
          <div className={`mb-3 mt-1 bg-gray-50 dark:bg-gray-800 p-4 sm:p-6 rounded-xl border border-gray-100 dark:border-gray-700 ${isRTL ? 'mr-0' : 'ml-0'} overflow-hidden`}>
            {/* <h3 className={`text-lg font-medium text-gray-800 dark:text-gray-200 mb-4 ${isRTL ? 'text-right' : 'text-left'}`}>
              {isRTL ? 'الفئات الفرعية' : 'Subcategories'}
            </h3> */}
            <div className="grid grid-cols-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7   ">
              {category.category_children.map((c) => (
                <InteractiveLink
                  key={c.id}
                  href={`/categories/${c.handle}`}
                  className={`
                    flex flex-col items-center justify-center
                    w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-32 lg:h-32
                    rounded-full
                    border-2 border-gray-200 dark:border-gray-600
                    bg-white dark:bg-gray-900
                    hover:bg-gray-50 dark:hover:bg-gray-800
                    transition-all duration-200
                    hover:shadow-md
                    group
                    overflow-hidden
                    ${isRTL ? 'text-right' : 'text-left'}
                    mx-auto
                  `}
                >
                  <span className="text-xs sm:text-sm md:text-base font-medium text-gray-800 dark:text-gray-200 line-clamp-2 text-center py-2 px-2 group-hover:text-primary-600 dark:group-hover:text-primary-400">
                    {c.name}
                  </span>
                </InteractiveLink>
              ))}
            </div>
          </div>
        )}
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
              {productCount}
            </span>
            <span className={`${isRTL ? 'mr-1' : 'ml-1'}`}>
              {isRTL ?
                (productCount === 1 ? 'نتيجة' : 'نتائج') :
                (productCount === 1 ? 'result' : 'results')
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
              countryCode={countryCode}
              data-testid="sort-by-container"
            />
          </div>
        </div>


        {/* Products Grid */}
        <Suspense
          fallback={
            <SkeletonProductGrid
              numberOfProducts={category.products?.length ?? 12}
            />
          }
        >
          <PaginatedProducts
            products={category.products}
            sortBy={sort}
            page={pageNumber}
            categoryId={category.id}
            countryCode={countryCode}
          />
        </Suspense>
      </div>
    </div>
  )
}