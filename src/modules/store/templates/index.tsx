import { Suspense } from "react"

import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid"
import RefinementList from '@modules/store/components/refinement-list'
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import { getLocale } from "next-intl/server"
import PaginatedProducts from "./paginated-products"
import { Category, getParentCategories, listCategories } from "@lib/data/categories"

const StoreTemplate = async ({
  sortBy,
  page,
  countryCode,
  searchParams,
}: {
  sortBy?: SortOptions
  page?: string
  countryCode: string
  searchParams?: { [key: string]: string | undefined }
}) => {
  const pageNumber = page ? parseInt(page) : 1
  const sort = sortBy || "created_at"
  const locale = await getLocale()
  const categoryTree = await listCategories()
  const flatCategories: Category[] = []
  const flattenCategories = (cats: Category[]) => {
    for (const cat of cats) {
      flatCategories.push(cat)
      if (cat.category_children?.length) {
        flattenCategories(cat.category_children)
      }
    }
  }
  flattenCategories(categoryTree)

  const allCategories = flatCategories.map((category) => ({
    id: category.id,
    name_en: category.name_en,
    name_ar: category.name_ar,
    parent_category_id: category.parent_category_id ?? null,
  }))

  return (
    <div
      dir={locale === "ar" ? "rtl" : "ltr"}
      className="flex flex-col small:flex-row small:items-start py-6 content-container gap-x-6"
      data-testid="category-container"
    >
      {/* Desktop Sidebar - Hidden on mobile */}
      {/* <div className="hidden small:block w-full small:w-72 small:sticky small:top-6">
        <RefinementList
          locale={locale}
          sortBy={sort}
          countryCode={countryCode}
          categories={parentCategories}
          inline
        />
      </div> */}
      <aside className="hidden small:block w-full small:w-72 flex-shrink-0 small:sticky small:top-24 mb-8 small:mb-0">
        <div className="rounded-2xl bg-gray-50 dark:bg-gray-900/50 p-6 border border-gray-100 dark:border-gray-800">
          <RefinementList
            locale={locale}
            sortBy={sort}
            countryCode={countryCode}
            categories={allCategories || []}
            inline // This will render it as a tree menu
          />
        </div>
      </aside>

      <div className="w-full">
        {/* Page Title */}
        <div className="flex flex-row justify-between items-center mb-8 text-2xl-semi text-[#043364]">
          <h1 data-testid="store-page-title" className="font-bold text-xl sm:text-3xl ">
            {locale === "ar" ? "جميع المنتجات" : "All products"}
          </h1>
          <div className="small:hidden ">
            <RefinementList
              locale={locale}
              sortBy={sort}
              countryCode={countryCode}
              categories={allCategories}
            />
          </div>
        </div>

        {/* Mobile Filters - Visible only on mobile */}

        {/* Products Grid */}
        <Suspense fallback={<SkeletonProductGrid />}>
          <PaginatedProducts
            sortBy={sort}
            page={pageNumber}
            countryCode={countryCode}
            searchParams={searchParams}
          />
        </Suspense>
      </div>
    </div>
  )
}

export default StoreTemplate
