import { notFound } from "next/navigation"
import { Suspense } from "react"
import InteractiveLink from "@modules/common/components/interactive-link"
import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid"
import CategoryFilters from "@modules/categories/components/category-filters"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import PaginatedProducts from "@modules/store/templates/paginated-products"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { getLocale } from "next-intl/server"
import { ChevronRight, Package, Grid3x3 } from "lucide-react"
import { Category } from "@lib/data/categories"
import RefinementList from "@modules/store/components/refinement-list"
import { ProductsToolbar } from "../components/productsToolbar"

export default async function CategoryTemplate({
  category,
  sortBy,
  page,
  countryCode,
  searchParams,
}: {
  category: Category
  sortBy?: SortOptions
  page?: string
  countryCode: string
  searchParams?: { [key: string]: string | string[] | undefined }
}) {
  if (!category || !countryCode) notFound()

    console.log("category", category)

  const locale = await getLocale()
  const isRTL = locale === "ar"
  const pageNumber = page ? parseInt(page) : 1
  const sort = sortBy || "created_at"

  // === Breadcrumbs ===
  const parents: Category[] = []
  const collectParents = (cat: Category) => {
    if (cat.parent_category) {
      parents.push(cat.parent_category)
      collectParents(cat.parent_category)
    }
  }
  collectParents(category)

  const categoryName = isRTL ? category.name_ar : category.name_en
  const categoryDesc = isRTL ? category.description_ar : category.description_en
  const categoryHandle = isRTL ? category.handle_ar : category.handle_en
  const productCount =  category.products?.length || 0
  // const hasSubcategories = category.category_children?.length > 0

  return (
    <div
      dir={isRTL ? "rtl" : "ltr"}
      className="flex flex-col small:flex-row small:items-start py-6 lg:py-8 content-container gap-x-8"
      data-testid="category-container"
    >
      {/* Sidebar (Desktop) */}
      <div className="small:sticky small:top-6 small:self-start">
        {/* Breadcrumb Navigation */}
        <div className="mb-6">
          <nav className="flex items-center text-sm text-gray-500 dark:text-gray-400 flex-wrap gap-y-2" aria-label="Breadcrumb">
            <LocalizedClientLink
              href="/"
              className="hover:text-gray-900 dark:hover:text-gray-200 transition-colors duration-200 font-medium"
            >
              {isRTL ? "الرئيسية" : "Home"}
            </LocalizedClientLink>

            {parents.reverse().map((parent) => (
              <div key={parent.id} className="flex items-center">
                <ChevronRight
                  className={`mx-1.5 h-3.5 w-3.5 flex-shrink-0 text-gray-400 ${isRTL ? "rotate-180" : ""}`}
                />
                <LocalizedClientLink
                  className="hover:text-gray-900 dark:hover:text-gray-200 transition-colors duration-200 line-clamp-1 font-medium"
                  href={`/categories/${isRTL ? parent.handle_ar : parent.handle_en}`}
                  data-testid="breadcrumb-link"
                >
                  {isRTL ? parent.name_ar : parent.name_en}
                </LocalizedClientLink>
              </div>
            ))}

            <ChevronRight
              className={`mx-1.5 h-3.5 w-3.5 flex-shrink-0 text-gray-400 ${isRTL ? "rotate-180" : ""}`}
            />
            <span className="text-gray-900 dark:text-gray-100 font-semibold line-clamp-1">
              {categoryName}
            </span>
          </nav>
        </div>
        {/* Sidebar Filters (Desktop) */}
          <div className="hidden small:block w-full small:w-60 small:sticky small:top-6">
            <RefinementList
              locale={locale}
              sortBy={sort}
              countryCode={countryCode}
              inline
            />
          {/* </div> */}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 w-full min-w-0">
        {/* Category Header */}
        <div className="hidden small:block mb-8">
          <div className="flex items-start gap-6">
            {/* {category.image_url && (
              <div className="flex-shrink-0">
                <img
                  src={category.image_url}
                  alt={categoryName}
                  className="w-32 h-32 lg:w-40 lg:h-40 object-cover rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700"
                />
              </div>
            )} */}

            <div className="flex-1">
              <h1
                className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-3 tracking-tight"
                data-testid="category-page-title"
              >
                {categoryName}
              </h1>

              {categoryDesc && (
                <p className="text-gray-600 dark:text-gray-300 text-base lg:text-lg leading-relaxed max-w-3xl">
                  {categoryDesc}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Category Header */}
        <div className="small:hidden mb-6">
          <h1
            className="text-2xl font-bold text-gray-900 dark:text-white mb-2"
            data-testid="category-page-title-mobile"
          >
            {categoryName}
          </h1>
          {categoryDesc && (
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              {categoryDesc}
            </p>
          )}
        </div>

        {/* Subcategories Section */}
        {category.category_children ?.length > 0 && (
          <div className="mb-8">
            {/* <div className="flex items-center gap-2 mb-4">
              <Grid3x3 className="h-5 w-5 text-gray-700 dark:text-gray-300" />
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                {isRTL ? "الفئات الفرعية" : "Subcategories"}
              </h2>
            </div> */}

            <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {category.category_children.map((c) => (
                  <InteractiveLink
                    key={c.id}
                    href={`/categories/${c.handle}`}
                    className="group relative flex flex-col items-center justify-center aspect-square rounded-2xl 
                    bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 
                    hover:border-primary-500 dark:hover:border-primary-500 
                    hover:shadow-lg hover:shadow-primary-500/10 
                    transition-all duration-300 hover:-translate-y-1 overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-primary-500/0 to-primary-500/0 group-hover:from-primary-500/5 group-hover:to-primary-500/10 transition-all duration-300" />

                    <span className="relative text-sm md:text-base font-semibold text-gray-800 dark:text-gray-200 text-center px-3 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-300">
                      {isRTL ? c.metadata.localizations.ar.name : c.name}
                    </span>
                  </InteractiveLink>
                ))}
              </div>
            </div>
          </div>
        )}

        <ProductsToolbar
          productCount={productCount}
          sort={sort}
          isRTL={isRTL}
          locale={locale}
          countryCode={countryCode}
          categoryId={category.id}
          // onSortChange={handleSortChange}
        />

        {/* Product Grid */}
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
            searchParams={searchParams}
          />
        </Suspense>
      </div>
    </div>
  )
}