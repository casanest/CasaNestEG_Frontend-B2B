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

  return (
    <div
      dir={isRTL ? "rtl" : "ltr"}
      className="flex flex-col small:flex-row small:items-start py-8 content-container"
      data-testid="category-container"
    >
      {/* Sidebar Filters */}
      <div className={`${isRTL? "ml-10": "mr-10"}`}>
        <RefinementList
          locale={locale}
          sortBy={sort}
          data-testid="sort-by-container"
          className="sticky top-24"
        />
      </div>

      {/* Main Content */}
      <div className="flex-1">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center mb-6 text-sm text-gray-600 dark:text-gray-400">
          <LocalizedClientLink
            href="/"
            className="hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            {isRTL ? "الرئيسية" : "Home"}
          </LocalizedClientLink>
          {parents && parents.reverse().map((parent) => (
            <div key={parent.id} className="flex items-center">
              <ChevronRight className={`mx-2 h-4 w-4 ${isRTL ? 'rotate-180' : ''}`} />
              <LocalizedClientLink
                className="hover:text-gray-900 dark:hover:text-white transition-colors"
                href={`/categories/${parent.handle}`}
                data-testid="sort-by-link"
              >
                {parent.name}
              </LocalizedClientLink>
            </div>
          ))}
          <ChevronRight className={`mx-2 h-4 w-4 ${isRTL ? 'rotate-180' : ''}`} />
          <span className="text-gray-900 dark:text-white font-medium">
            {category.name}
          </span>
        </div>

        {/* Category Header */}
        <div className="mb-8">
          <h1
            className="text-3xl font-bold text-gray-900 dark:text-white mb-4"
            data-testid="category-page-title"
          >
            {category.name}
          </h1>

          {category.description && (
            <div className="prose dark:prose-invert max-w-3xl text-gray-600 dark:text-gray-300 mb-6">
              <p>{category.description}</p>
            </div>
          )}
        </div>

        {/* Subcategories */}
        {category.category_children && (
          <div className="mb-10">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              {isRTL ? "الفئات الفرعية" : "Subcategories"}
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {category.category_children?.map((c) => (
                <InteractiveLink
                  key={c.id}
                  href={`/categories/${c.handle}`}
                  className="block p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  {c.name}
                </InteractiveLink>
              ))}
            </div>
          </div>
        )}

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