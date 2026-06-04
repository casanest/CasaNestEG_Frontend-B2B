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
import SubcategoryCarousel from "../components/subcategory-carousel"

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

  // === Breadcrumbs Logic ===
  // const parents: Category[] = []
  // const collectParents = (cat: Category) => {
  //   if (cat.parent_category) {
  //     parents.push(cat.parent_category)
  //     collectParents(cat.parent_category)
  //   }
  // }
  // collectParents(category)


  // === Breadcrumbs Logic — ابني من الـ flat map ===
  // اعمل flat list من كل الـ categories
  const flatList: Category[] = []
  const flatten = (cats: Category[]) => {
    for (const c of cats) {
      flatList.push(c)
      if (c.category_children?.length) flatten(c.category_children)
    }
  }
  flatten(categoryTree)

  // ابني الـ breadcrumb path باستخدام parent_category_id
  const parents: Category[] = []
  let current: Category | undefined = flatList.find(c => c.id === category.id)
  while (current?.parent_category_id) {
    const parent = flatList.find(c => c.id === current!.parent_category_id)
    if (!parent) break
    parents.unshift(parent) // ضيف في الأول عشان الترتيب صح
    current = parent
  }


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

          {parents.map((parent) => (
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
        <h1 className="text-xl sm:text-3xl font-black tracking-tight text-gray-950 mt-2">
          {categoryName}
        </h1>
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
              categories={allCategories || []}
              currentCategoryId={category.id}
              inline // This will render it as a tree menu
            />
          </div>
        </aside>

        {/* Main Content Area - Left Side */}
        <main className="flex-1 min-w-0 space-y-2">

          {/* Subcategories Carousel Section - Matching the Image */}
          {category.category_children?.length > 0 && (
            <SubcategoryCarousel items={category.category_children} isRTL={isRTL} />
          )}

          {/* Toolbar & Grid Area */}
          <div dir={isRTL? "rtl": "ltr"} className="space-y-1">
            <ProductsToolbar
              productCount={productCount}
              sort={sort}
              isRTL={isRTL}
              locale={locale}
              countryCode={countryCode}
              categories={allCategories || []}
              currentCategoryId={category.id}
              // categoryId={category.id}
            // This component needs to be updated to match the gray bar style in the image
            />

            <Suspense fallback={<SkeletonProductGrid numberOfProducts={4} />}>
              <PaginatedProducts
                // products={category.products}
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