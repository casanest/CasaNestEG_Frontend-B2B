import { notFound } from "next/navigation"
import { Suspense } from "react"
import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import PaginatedProducts from "@modules/store/templates/paginated-products"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { getLocale } from "next-intl/server"
import { Category, listCategories } from "@lib/data/categories"
import RefinementList from "@modules/store/components/refinement-list"
import CategoryChipsBar from "../components/category-chips-bar"
import { getCategoryFilterOptions } from "@lib/data/category-filters"
import { getRegion } from "@lib/data/regions"

type CategoryOption = {
  id: string
  name_en: string
  name_ar: string
  parent_category_id: string | null
}

function FilterSkeleton() {
  return (
    <div className="flex flex-col gap-6 animate-pulse">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="flex flex-col gap-3">
          <div className="h-4 w-24 bg-gray-200 rounded" />
          <div className="h-3 w-full bg-gray-100 rounded" />
          <div className="h-3 w-3/4 bg-gray-100 rounded" />
          <div className="h-3 w-2/3 bg-gray-100 rounded" />
        </div>
      ))}
    </div>
  )
}

async function MobileCategoryFilters({
  countryCode,
  categoryId,
  locale,
  sortBy,
  categories,
  regionId,
}: {
  countryCode: string
  categoryId: string
  locale: string
  sortBy: SortOptions
  categories: CategoryOption[]
  regionId?: string
}) {
  const filterOptions = await getCategoryFilterOptions(categoryId, regionId)

  return (
    <RefinementList
      locale={locale}
      sortBy={sortBy}
      countryCode={countryCode}
      categories={categories}
      currentCategoryId={categoryId}
      filterOptions={filterOptions}
    />
  )
}

async function DesktopCategoryFilters({
  countryCode,
  categoryId,
  locale,
  sortBy,
  categories,
  regionId,
}: {
  countryCode: string
  categoryId: string
  locale: string
  sortBy: SortOptions
  categories: CategoryOption[]
  regionId?: string
}) {
  const filterOptions = await getCategoryFilterOptions(categoryId, regionId)

  return (
    <RefinementList
      locale={locale}
      sortBy={sortBy}
      countryCode={countryCode}
      categories={categories}
      currentCategoryId={categoryId}
      filterOptions={filterOptions}
      inline
    />
  )
}

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
  const locale = await getLocale()
  const isRTL = locale === "ar"

  const pageNumber = page ? parseInt(page) : 1
  const sort = sortBy || "created_at"

  const region = await getRegion(countryCode)
  const categoryTree = await listCategories()

  // 1) Flatten مرة واحدة فقط
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

  // 2) Normalize categories 
  const allCategories = flatList.map((category) => ({
    id: category.id,
    name_en: category.name_en,
    name_ar: category.name_ar,
    parent_category_id: category.parent_category_id ?? null,
  }))

  // 3) Create Map for O(1) lookup 
  const categoryMap = new Map(flatList.map(c => [c.id, c]))

  // 4) Breadcrumbs 
  const parents: Category[] = []

  let current = categoryMap.get(category.id)

  while (current?.parent_category_id) {
    const parent = categoryMap.get(current.parent_category_id)
    if (!parent) break

    parents.unshift(parent)
    current = parent
  }

  const categoryName = isRTL ? category.name_ar : category.name_en
  const categoryDescription = isRTL ? category.description_ar : category.description_en

  // Get top-level categories for chips bar
  const topLevelCategories = (categoryTree || []).map((cat) => ({
    id: cat.id,
    name_en: cat.name_en,
    name_ar: cat.name_ar,
    handle_en: cat.handle_en,
    handle_ar: cat.handle_ar,
  }))

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
          {parents.map((parent) => (
            <div key={parent.id} className="flex items-center gap-2">
              <LocalizedClientLink
                href={`/categories/${isRTL ? parent.handle_ar : parent.handle_en}`}
                className="text-[#707176] hover:text-[#17284a] transition-colors"
              >
                {isRTL ? parent.name_ar : parent.name_en}
              </LocalizedClientLink>
              <span className="text-[#707176]">/</span>
            </div>
          ))}
          <span className="text-[#17284a] font-medium">
            {categoryName}
          </span>
        </nav>

        {/* Title + Subtitle */}
        <div className="flex flex-col small:flex-row small:items-end small:justify-between gap-4">
          <div className="flex flex-col gap-2">
            <h1 className="text-[24px] small:text-[36px] font-bold tracking-tight text-[#17284a] leading-tight">
              {categoryName}
            </h1>
            {categoryDescription && (
              <p className="text-[14px] small:text-[16px] text-[#707176] max-w-2xl">
                {categoryDescription}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Horizontal Filter Bar - Category Chips + Sort */}
      <CategoryChipsBar
        categories={topLevelCategories}
        currentCategoryId={category.id}
        isRTL={isRTL}
        locale={locale}
        sort={sort}
        productCount={0}
      />

      {/* Mobile Filter Bar — streams independently via Suspense */}
      <Suspense fallback={<div className="small:hidden h-14 bg-gray-50 animate-pulse" />}>
        <MobileCategoryFilters
          countryCode={countryCode}
          categoryId={category.id}
          locale={locale}
          sortBy={sort}
          categories={allCategories || []}
          regionId={region?.id}
        />
      </Suspense>

      {/* Main Content Layout: Sidebar + Product Grid */}
      <div className="w-full bg-[#fefefe] px-4 sm:px-6 lg:px-[60px] py-8">
        <div className="flex flex-col small:flex-row small:items-start gap-8">
          {/* Sidebar Filters — streams independently via Suspense */}
          <aside
            dir={isRTL ? "rtl" : "ltr"}
            className="hidden small:block w-full small:w-[280px] flex-shrink-0"
          >
            <div className="sticky top-[220px]">
              <Suspense fallback={<FilterSkeleton />}>
                <DesktopCategoryFilters
                  countryCode={countryCode}
                  categoryId={category.id}
                  locale={locale}
                  sortBy={sort}
                  categories={allCategories || []}
                  regionId={region?.id}
                />
              </Suspense>
            </div>
          </aside>

          {/* Main Content Area - Product Grid */}
          <main className="flex-1 min-w-0">
            <Suspense fallback={<SkeletonProductGrid numberOfProducts={4} />}>
              <PaginatedProducts
                sortBy={sort}
                page={pageNumber}
                categoryId={category.id}
                countryCode={countryCode}
                searchParams={searchParams}
                isRTL={isRTL}
              />
            </Suspense>
          </main>
        </div>
      </div>
    </div>
  )
}