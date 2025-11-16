import { Suspense } from "react"

import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid"
import RefinementList from '@modules/store/components/refinement-list'
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import { getLocale } from "next-intl/server"
import PaginatedProducts from "./paginated-products"
import { getParentCategories, listCategories } from "@lib/data/categories"

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
  const parentCategories = getParentCategories(categoryTree).map((category) => ({
    id: category.id,
    name_en: category.name_en,
    name_ar: category.name_ar,
  }))

  return (
    <div
      dir={locale === "ar" ? "rtl" : "ltr"}
      className="flex flex-col small:flex-row small:items-start py-6 content-container gap-x-6"
      data-testid="category-container"
    >
      {/* Desktop Sidebar - Hidden on mobile */}
      <div className="hidden small:block w-full small:w-72 small:sticky small:top-6">
        <RefinementList
          locale={locale}
          sortBy={sort}
          countryCode={countryCode}
          categories={parentCategories}
          inline
        />
      </div>

      <div className="w-full">
        {/* Page Title */}
        <div className="mb-8 text-2xl-semi text-[#043364]">
          <h1 data-testid="store-page-title">
            {locale === "ar" ? "جميع المنتجات" : "All products"}
          </h1>
        </div>

        {/* Mobile Filters - Visible only on mobile */}
        <div className="small:hidden mb-6">
          <RefinementList
            locale={locale}
            sortBy={sort}
            countryCode={countryCode}
            categories={parentCategories}
          />
        </div>

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
