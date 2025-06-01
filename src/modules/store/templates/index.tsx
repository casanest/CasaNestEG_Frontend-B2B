import { Suspense } from "react"

import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid"
import RefinementList from '@modules/store/components/refinement-list'
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import { getLocale } from "next-intl/server"
import PaginatedProducts from "./paginated-products"

const StoreTemplate = async ({
  sortBy,
  page,
  countryCode,
}: {
  sortBy?: SortOptions
  page?: string
  countryCode: string
}) => {
  const pageNumber = page ? parseInt(page) : 1
  const sort = sortBy || "created_at"
  const locale = await getLocale()
  return (
    <div
      dir={locale === "ar" ? "rtl" : "ltr"}
      className="flex flex-col small:flex-row small:items-start py-6 content-container gap-x-6"
      data-testid="category-container"
    >
      <div className={`hidden small:block w-full small:w-72`}>
        <RefinementList locale={locale} sortBy={sort} />
      </div>
      <div className="w-full">
        <div className="mb-8 text-2xl-semi text-[#043364]">
          <h1 data-testid="store-page-title">{locale === "ar" ? "جميع المنتجات" : "All products"}</h1>
        </div>
        <Suspense fallback={<SkeletonProductGrid />}>
          <PaginatedProducts
            sortBy={sort}
            page={pageNumber}
            countryCode={countryCode}
          />
        </Suspense>
      </div>
    </div>
  )
}

export default StoreTemplate
