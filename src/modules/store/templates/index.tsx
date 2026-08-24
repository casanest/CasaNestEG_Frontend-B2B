import { Suspense } from "react"

import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid"
import RefinementList from '@modules/store/components/refinement-list'
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import { getLocale } from "next-intl/server"
import PaginatedProducts from "./paginated-products"
import { Category, listCategories } from "@lib/data/categories"
import { listProductsWithSort } from "@lib/data/products"
import { getRegion } from "@lib/data/regions"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import CategoryChipsBar from "@modules/categories/components/category-chips-bar"

const StoreTemplate = async ({
  sortBy,
  page,
  countryCode,
  searchParams,
}: {
  sortBy?: SortOptions
  page?: string
  countryCode: string
  searchParams?: { [key: string]: string | string[] | undefined }
}) => {
  const pageNumber = page ? parseInt(page) : 1
  const sort = sortBy || "created_at"
  const locale = await getLocale()
  const isRTL = locale === "ar"

  const categoryTree = await listCategories()

  const flatList: Category[] = []
  const flatten = (cats: Category[]) => {
    for (const cat of cats) {
      flatList.push(cat)
      if (cat.category_children?.length) {
        flatten(cat.category_children)
      }
    }
  }
  flatten(categoryTree)

  const allCategories = flatList.map((category) => ({
    id: category.id,
    name_en: category.name_en,
    name_ar: category.name_ar,
    parent_category_id: category.parent_category_id ?? null,
  }))

  const topLevelCategories = (categoryTree || []).map((cat) => ({
    id: cat.id,
    name_en: cat.name_en,
    name_ar: cat.name_ar,
    handle_en: cat.handle_en,
    handle_ar: cat.handle_ar,
  }))

  // Fetch product count
  let productCount = 0
  try {
    const region = await getRegion(countryCode)
    if (region) {
      const { response: { count } } = await listProductsWithSort({
        page: 1,
        queryParams: {
          limit: 1,
        },
        sortBy: sort,
        countryCode,
      })
      productCount = count
    }
  } catch (e) {
    // Fallback: count stays 0
  }

  return (
    <div
      dir={isRTL ? "rtl" : "ltr"}
      className="w-full"
      data-testid="category-container"
    >
      {/* Page Title Band */}
      <section className="w-full bg-white px-4 sm:px-6 lg:px-[60px] pt-11 small:pt-10 pb-6">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-[14px] mb-4" aria-label="Breadcrumb">
          <LocalizedClientLink href="/" className="text-[#707176] hover:text-[#17284a] transition-colors">
            {isRTL ? "الرئيسية" : "Home"}
          </LocalizedClientLink>
          <span className="text-[#707176]">/</span>
          <span className="text-[#17284a] font-medium">
            {isRTL ? "كل المنتجات" : "All Products"}
          </span>
        </nav>

        {/* Title + Subtitle + Count Badge */}
        <div className="flex flex-col small:flex-row small:items-end small:justify-between gap-4">
          <div className="flex flex-col gap-2">
            <h1 className="text-[24px] small:text-[36px] font-bold tracking-tight text-[#17284a] leading-tight">
              {isRTL ? "كل المنتجات" : "All Products"}
            </h1>
            <p className="text-[14px] small:text-[16px] text-[#707176] max-w-2xl">
              {isRTL ? "تصفح مجموعتنا الكاملة من المنتجات" : "Browse our complete collection of products"}
            </p>
          </div>
          {/* Count Badge */}
          <div className="flex-shrink-0 bg-[#f8f9fa] small:bg-white border border-[#e5e7eb] rounded-[8px] px-4 py-2 self-start small:self-auto">
            <span className="text-[14px] small:text-[15px] font-bold small:font-medium text-[#17284a] whitespace-nowrap">
              {productCount} {isRTL ? "منتج" : "Products"}
            </span>
          </div>
        </div>
      </section>

      {/* Horizontal Filter Bar - Category Chips + Sort */}
      <CategoryChipsBar
        categories={topLevelCategories}
        currentCategoryId={undefined}
        isRTL={isRTL}
        locale={locale}
        sort={sort}
        productCount={productCount}
      />

      {/* Mobile Filter Bar (Filters + Sort) */}
      <RefinementList
        locale={locale}
        sortBy={sort}
        countryCode={countryCode}
        categories={allCategories || []}
      />

      {/* Main Content Layout: Sidebar + Product Grid */}
      <div className="w-full bg-[#fefefe] px-4 sm:px-6 lg:px-[60px] py-8">
        <div className="flex flex-col small:flex-row small:items-start gap-8">
          {/* Sidebar Filters */}
          <aside
            dir={isRTL ? "rtl" : "ltr"}
            className="hidden small:block w-full small:w-[280px] flex-shrink-0"
          >
            <div className="sticky top-[220px]">
              <RefinementList
                locale={locale}
                sortBy={sort}
                countryCode={countryCode}
                categories={allCategories || []}
                inline
              />
            </div>
          </aside>

          {/* Main Content Area - Product Grid */}
          <main className="flex-1 min-w-0">
            <Suspense fallback={<SkeletonProductGrid numberOfProducts={4} />}>
              <PaginatedProducts
                sortBy={sort}
                page={pageNumber}
                countryCode={countryCode}
                searchParams={searchParams}
              />
            </Suspense>
          </main>
        </div>
      </div>
    </div>
  )
}

export default StoreTemplate
