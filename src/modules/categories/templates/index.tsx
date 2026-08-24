import { notFound } from "next/navigation"
import { Suspense } from "react"
import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import PaginatedProducts from "@modules/store/templates/paginated-products"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { getLocale } from "next-intl/server"
import { Category, listCategories } from "@lib/data/categories"
import { listProductsWithSort } from "@lib/data/products"
import { getRegion } from "@lib/data/regions"
import RefinementList from "@modules/store/components/refinement-list"
import CategoryChipsBar from "../components/category-chips-bar"

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

  // Fetch product count for this category
  let productCount = 0
  try {
    const region = await getRegion(countryCode)
    if (region) {
      const { response: { count } } = await listProductsWithSort({
        page: 1,
        queryParams: {
          limit: 1,
          category_id: [category.id],
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

        {/* Title + Subtitle + Count Badge */}
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
          {/* Count Badge - Figma style */}
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
        currentCategoryId={category.id}
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
        currentCategoryId={category.id}
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
                currentCategoryId={category.id}
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
                categoryId={category.id}
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