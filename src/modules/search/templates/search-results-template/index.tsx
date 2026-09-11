import { Suspense } from 'react'
import { safeDecodeURIComponent } from '@lib/util/safe-decode-uri'
import SkeletonProductGrid from '@modules/skeletons/templates/skeleton-product-grid'
import PaginatedProducts from '@modules/store/templates/paginated-products'
import { getLocale } from 'next-intl/server'
import RefinementList from '@modules/store/components/refinement-list'
import { listCategories } from '@lib/data/categories'
import CategoryChipsBar from '@modules/categories/components/category-chips-bar'
import LocalizedClientLink from '@modules/common/components/localized-client-link'
import { getMeilisearchClientConfig } from '@lib/meilisearch-config'

export const runtime = 'edge'

type SearchResultsTemplateProps = {
  query: string
  sortBy?: string
  page?: string
  currency_code: string
  countryCode: string
  searchParams?: { [key: string]: string | string[] | undefined }
}

export default async function SearchResultsTemplate({
  query,
  sortBy,
  page,
  currency_code,
  countryCode,
  searchParams,
}: SearchResultsTemplateProps) {
  const pageNumber = page ? parseInt(page) : 1
  const locale = await getLocale()
  const sort = sortBy || 'created_at'
  const isRTL = locale === 'ar'
  const decodedQuery = safeDecodeURIComponent(query)

  const categoryTree = await listCategories()

  const topLevelCategories = (categoryTree || []).map((cat) => ({
    id: cat.id,
    name_en: cat.name_en,
    name_ar: cat.name_ar,
    handle_en: cat.handle_en,
    handle_ar: cat.handle_ar,
  }))

  const flatList: typeof categoryTree = []
  const flatten = (cats: typeof categoryTree) => {
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

  let productsIds: string[] | undefined

  if (decodedQuery) {
    try {
      const meili = await getMeilisearchClientConfig()
      if (meili) {
        const meiliRes = await fetch(
          `${meili.search_url}/indexes/products/search?q=${encodeURIComponent(decodedQuery)}&limit=1000`,
          {
            headers: { authorization: `Bearer ${meili.search_api_key}` },
            cache: 'no-store',
          }
        )
        if (meiliRes.ok) {
          const meiliData = await meiliRes.json()
          const hits = (meiliData.hits || []).map((hit: { id: string }) => hit.id)
          productsIds = hits.length > 0 ? hits : ['no-match']
        }
      }
    } catch {
      // fall through to Medusa API search
    }
  }

  return (
    <div
      dir={isRTL ? 'rtl' : 'ltr'}
      className="w-full"
      data-testid="search-results-container"
    >
      {/* Page Title Band */}
      <section className="w-full bg-white px-4 sm:px-6 lg:px-[60px] pt-11 small:pt-10 pb-6">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-[14px] mb-4" aria-label="Breadcrumb">
          <LocalizedClientLink href="/" className="text-[#707176] hover:text-[#17284a] transition-colors">
            {isRTL ? 'الرئيسية' : 'Home'}
          </LocalizedClientLink>
          <span className="text-[#707176]">/</span>
          <span className="text-[#17284a] font-medium">
            {isRTL ? 'البحث' : 'Search'}
          </span>
        </nav>

        {/* Title + Subtitle */}
        <div className="flex flex-col small:flex-row small:items-end small:justify-between gap-4">
          <div className="flex flex-col gap-2">
            <h1 className="text-[24px] small:text-[36px] font-bold tracking-tight text-[#17284a] leading-tight">
              {isRTL ? `نتائج البحث: "${decodedQuery}"` : `Search results: "${decodedQuery}"`}
            </h1>
            <p className="text-[14px] small:text-[16px] text-[#707176] max-w-2xl">
              {isRTL ? 'تصفح المنتجات المطابقة لبحثك' : 'Browse products matching your search'}
            </p>
          </div>
        </div>
      </section>

      {/* Horizontal Filter Bar - Category Chips + Sort */}
      <CategoryChipsBar
        categories={topLevelCategories}
        currentCategoryId={undefined}
        isRTL={isRTL}
        locale={locale}
        sort={sort as any}
        productCount={0}
      />

      {/* Mobile Filter Bar (Filters + Sort) */}
      <RefinementList
        locale={locale}
        sortBy={sort as any}
        countryCode={countryCode}
        categories={allCategories || []}
      />

      {/* Main Content Layout: Sidebar + Product Grid */}
      <div className="w-full bg-[#fefefe] px-4 sm:px-6 lg:px-[60px] py-8">
        <div className="flex flex-col small:flex-row small:items-start gap-8">
          {/* Sidebar Filters */}
          <aside
            dir={isRTL ? 'rtl' : 'ltr'}
            className="hidden small:block w-full small:w-[280px] flex-shrink-0"
          >
            <div className="sticky top-[220px]">
              <RefinementList
                locale={locale}
                sortBy={sort as any}
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
                sortBy={sort as any}
                page={pageNumber}
                countryCode={countryCode}
                productsIds={productsIds}
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