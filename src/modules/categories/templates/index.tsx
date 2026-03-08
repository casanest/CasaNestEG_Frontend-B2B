import { notFound } from "next/navigation"
import { Suspense } from "react"
import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import PaginatedProducts from "@modules/store/templates/paginated-products"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { getLocale } from "next-intl/server"
import { ChevronRight, ChevronLeft } from "lucide-react"
import { Category, getParentCategories, listCategories } from "@lib/data/categories"
import RefinementList from "@modules/store/components/refinement-list"
import { ProductsToolbar } from "../components/productsToolbar"
import { clx } from "@medusajs/ui"

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
  const parentCategories = getParentCategories(categoryTree).map((category) => ({
    id: category.id,
    name_en: category.name_en,
    name_ar: category.name_ar,
  }))

  // === Breadcrumbs Logic ===
  const parents: Category[] = []
  const collectParents = (cat: Category) => {
    if (cat.parent_category) {
      parents.push(cat.parent_category)
      collectParents(cat.parent_category)
    }
  }
  collectParents(category)

  const categoryName = isRTL ? category.name_ar : category.name_en
  const productCount = category.products?.length || 0

  return (
    <div
      dir={isRTL ? "rtl" : "ltr"}
      className="py-6 lg:py-8 content-container"
      data-testid="category-container"
    >
      {/* Top Section: Breadcrumbs and Title */}
      <header dir={isRTL ? "rtl" : "ltr"} className="mb-6 flex flex-col gap-2 px-4">
        {/* Breadcrumbs - Top Right */}
        <nav className="flex items-center gap-1 text-xs text-gray-500" aria-label="Breadcrumb">
          <LocalizedClientLink href="/" className="hover:text-black transition-colors">
            {isRTL ? "الرئيسية" : "Home"}
          </LocalizedClientLink>

          {parents.reverse().map((parent) => (
            <div key={parent.id} className="flex items-center gap-1">
              <ChevronRight className={clx("h-3 w-3 opacity-70", isRTL && "rotate-180")} />
              <LocalizedClientLink
                href={`/categories/${isRTL ? parent.handle_ar : parent.handle_en}`}
                className="hover:text-black transition-colors"
              >
                {isRTL ? parent.name_ar : parent.name_en}
              </LocalizedClientLink>
            </div>
          ))}

          <ChevronRight className={clx("h-3 w-3 opacity-70", isRTL && "rotate-180")} />
          <span className="text-gray-900 font-medium">
            {categoryName}
          </span>
        </nav>

        {/* Category Title - Large and Bold */}
        {/* <h1 className="text-4xl md:text-5xl font-black tracking-tight text-gray-950 mt-1">
          {categoryName}
        </h1> */}
      </header>

      {/* Main Layout: Sidebar (Right) and Content (Left) */}
      <div className="flex flex-col small:flex-row small:items-start gap-x-8">

        {/* Sidebar - Right Side (Tree Menu) */}
        <aside dir={isRTL ? "rtl" : "ltr"} className="hidden small:block w-full small:w-72 flex-shrink-0 small:sticky small:top-24 mb-8 small:mb-0">
          <div className="rounded-2xl bg-gray-50 dark:bg-gray-900/50 p-6 border border-gray-100 dark:border-gray-800">
            {/* <h2 className="text-lg font-bold text-gray-950 dark:text-white mb-5">
              {isRTL ? "الاقسام" : "Categories"}
            </h2> */}
            <RefinementList
              locale={locale}
              sortBy={sort}
              countryCode={countryCode}
              categories={parentCategories || []}
              inline // This will render it as a tree menu
            />
          </div>
        </aside>

        {/* Main Content Area - Left Side */}
        <main className="flex-1 min-w-0 space-y-4">

          {/* Subcategories Carousel Section - Matching the Image */}
          {category.category_children?.length > 0 && (
            <section className="relative rounded-2xl bg-gray-50 dark:bg-gray-900/50 p-6 border border-gray-100 dark:border-gray-800">

              {/* Carousel Arrows */}
              <button className="absolute left-2 top-1/2 -translate-y-1/2 z-10 h-8 w-8 rounded-full bg-white shadow-md border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50 hover:text-black transition-all">
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button className="absolute right-2 top-1/2 -translate-y-1/2 z-10 h-8 w-8 rounded-full bg-white shadow-md border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50 hover:text-black transition-all">
                <ChevronRight className="h-5 w-5" />
              </button>

              {/* Scrollable Container */}
              <div className="flex items-center gap-6 overflow-x-auto pb-2 px-8 scrollbar-hide">
                {category.category_children.map((c) => {
                  const subCatName = isRTL ? (c.metadata?.localizations?.ar?.name || c.name) : c.name;
                  // Placeholder for category image - assuming it exists in metadata or can be derived
                  const imageUrl = c.metadata?.image_url || "/path/to/placeholder-icon.png";

                  return (
                    <LocalizedClientLink
                      key={c.id}
                      href={`/categories/${c.handle}`}
                      className="group flex flex-col items-center gap-3 flex-shrink-0 w-28 text-center"
                    >
                      {/* Circular Image Container */}
                      <div className="h-24 w-24 rounded-full bg-[#EBF1F9] dark:bg-gray-800 border-2 border-transparent group-hover:border-[#043364] transition-all overflow-hidden flex items-center justify-center p-4">
                        <img
                          src={imageUrl}
                          alt={subCatName}
                          className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-110"
                        />
                      </div>
                      {/* Subcategory Name */}
                      <span className="text-xs font-bold text-gray-800 dark:text-gray-200 group-hover:text-[#043364] transition-colors leading-tight line-clamp-2">
                        {subCatName}
                      </span>
                    </LocalizedClientLink>
                  )
                })}
              </div>
            </section>
          )}

          {/* Toolbar & Grid Area */}
          <div dir={isRTL? "rtl": "ltr"} className="space-y-2">
            <ProductsToolbar
              productCount={productCount}
              sort={sort}
              isRTL={isRTL}
              locale={locale}
              countryCode={countryCode}
              // categoryId={category.id}
            // This component needs to be updated to match the gray bar style in the image
            />

            <Suspense fallback={<SkeletonProductGrid numberOfProducts={8} />}>
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
        </main>
      </div>
    </div>
  )
}