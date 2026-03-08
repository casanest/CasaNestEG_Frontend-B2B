"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { ReactNode, useCallback, useEffect, useRef, useState } from "react"
import { RotateCcw, SlidersHorizontal, X } from "lucide-react"
import { Badge, Button, Checkbox, Text, clx } from "@medusajs/ui"
import SortProducts, { SortOptions } from "./sort-products"
import { getProductFilterOptions } from "@lib/data/products"
import FilterRadioGroup from "@modules/common/components/filter-radio-group"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@modules/common/components/ui/drawer"

type CategoryOption = {
  id: string
  name_en: string
  name_ar: string
}

type RefinementListProps = {
  sortBy: SortOptions
  countryCode: string
  locale: string
  'data-testid'?: string
  inline?: boolean
  categories?: CategoryOption[]
}

type FilterOptions = {
  collections: Array<{id: string, title: string, handle: string}>
  types: Array<{id: string, value: string}>
  colors: string[]
  materials: string[]
  sizes: string[]
  priceRange: { min: number, max: number }
  totalProducts: number
}

const PRICE_PRESETS = [
  { value: "", labelEn: "All price ranges", labelAr: "جميع الأسعار" },
  { value: "0-50", labelEn: "Under €50", labelAr: "أقل من 50€" },
  { value: "50-100", labelEn: "€50 - €100", labelAr: "50€ - 100€" },
  { value: "100-200", labelEn: "€100 - €200", labelAr: "100€ - 200€" },
  { value: "200+", labelEn: "Over €200", labelAr: "أكثر من 200€" },
] as const

const RefinementList = ({ 
  sortBy, 
  countryCode,
  locale,
  'data-testid': dataTestId,
  inline = false,
  categories,
}: RefinementListProps) => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const isRTL = locale === "ar"

  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    collections: [],
    types: [],
    colors: [],
    materials: [],
    sizes: [],
    priceRange: { min: 0, max: 1000 },
    totalProducts: 0
  })

  const initialCategoryParam = searchParams.get('category_id')

  const [filters, setFilters] = useState({
    inStock: searchParams.get('inStock') === 'true',
    onSale: searchParams.get('onSale') === 'true',
    price: searchParams.get('price') || '',
    collection_id: searchParams.get('collection_id')?.split(',') || [],
    type_id: searchParams.get('type_id')?.split(',') || [],
    colors: searchParams.get('colors')?.split(',') || [],
    materials: searchParams.get('materials')?.split(',') || [],
    sizes: searchParams.get('sizes')?.split(',') || [],
    category_id: initialCategoryParam ? initialCategoryParam.split(',') : [],
  })

  // Load filter options on component mount
  useEffect(() => {
    const loadFilterOptions = async () => {
      const options = await getProductFilterOptions(countryCode)
      setFilterOptions(options)
    }
    loadFilterOptions()
  }, [countryCode])

  const updateURL = useCallback((newFilters: typeof filters) => {
    const params = new URLSearchParams(searchParams.toString())
    
    // Reset pagination to page 1 when filters change
    params.delete('page')
    
    // Update filter parameters
    Object.entries(newFilters).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        if (value.length > 0) {
          params.set(key, value.join(','))
        } else {
          params.delete(key)
        }
      } else if (typeof value === 'boolean') {
        if (value) {
          params.set(key, 'true')
        } else {
          params.delete(key)
        }
      } else if (value && value !== '') {
        params.set(key, value.toString())
      } else {
        params.delete(key)
      }
    })

    router.push(`${pathname}?${params.toString()}`, { scroll: false })
  }, [pathname, router, searchParams])

  const handleFilterChange = useCallback((key: keyof typeof filters, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }))
  }, [])

  const handleArrayFilterChange = useCallback((key: keyof typeof filters, value: string, checked: boolean) => {
    setFilters((prev) => {
      const current = prev[key] as string[]
      const nextArray = checked
        ? [...current, value]
        : current.filter((item) => item !== value)

      return {
        ...prev,
        [key]: nextArray,
      }
    })
  }, [])

  const handleSortChange = useCallback((name: string, value: SortOptions) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('sortBy', value)
    // Reset pagination to page 1 when sort changes
    params.delete('page')
    router.push(`${pathname}?${params.toString()}`, { scroll: false })
  }, [pathname, router, searchParams])

  const clearFilters = useCallback(() => {
    setFilters({
      inStock: false,
      onSale: false,
      price: "",
      collection_id: [],
      type_id: [],
      colors: [],
      materials: [],
      sizes: [],
      category_id: [],
    })
  }, [])

  const isFirstRender = useRef(true)
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }

    updateURL(filters)
  }, [filters, updateURL])

  const hasActiveFilters =
    filters.inStock ||
    filters.onSale ||
    filters.price ||
    filters.collection_id.length > 0 ||
    filters.type_id.length > 0 ||
    filters.category_id.length > 0 ||
    filters.colors.length > 0 ||
    filters.materials.length > 0 ||
    filters.sizes.length > 0

  const SectionCard = ({
    title,
    helper,
    children,
  }: {
    title: string
    helper?: string
    children: ReactNode
  }) => (
    <div className="rounded-2xl border border-ui-border-base bg-ui-bg-base/90 p-4 shadow-sm shadow-ui-border-subtle/30">
      <div>
        <Text className="text-sm font-semibold text-ui-fg-base">{title}</Text>
        {helper && (
          <Text className="text-xs text-ui-fg-subtle mt-0.5">{helper}</Text>
        )}
      </div>
      <div className="mt-4 space-y-3">{children}</div>
    </div>
  )

  const CheckboxRow = ({
    id,
    label,
    checked,
    onCheckedChange,
  }: {
    id: string
    label: string
    checked: boolean
    onCheckedChange: (checked: boolean) => void
  }) => (
    <label
      htmlFor={id}
      className="flex items-center gap-3 rounded-xl border border-ui-border-subtle bg-ui-bg-field px-3 py-2 text-sm text-ui-fg-subtle transition hover:border-ui-border-strong"
    >
      <Checkbox
        id={id}
        checked={checked}
        onCheckedChange={(value) => onCheckedChange(Boolean(value))}
      />
      <span className="line-clamp-1">{label}</span>
    </label>
  )

  const renderFilterContent = (variant: "inline" | "drawer") => (
    <div
      className={clx("flex flex-col gap-4", {
        "max-h-[calc(100vh-220px)] overflow-y-auto pr-1": variant === "drawer",
      })}
    >
      <SectionCard
        title={isRTL ? "ترتيب النتائج" : "Sort results"}
        helper={
          isRTL
            ? "اختر كيفية ترتيب المنتجات في المتجر."
            : "Choose how store products should be ordered."
        }
      >
        <SortProducts sortBy={sortBy} setQueryParams={handleSortChange} locale={locale} />
      </SectionCard>

      {categories?.length ? (
        <SectionCard
          title={isRTL ? "الفئات" : "Categories"}
          helper={
            isRTL
              ? "اختر الفئات المناسبة لبحثك."
              : "Pick the categories you want to explore."
          }
        >
          <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto pr-1">
            {categories.map((category) => (
              <CheckboxRow
                key={category.id}
                id={`category-${category.id}`}
                label={isRTL ? category.name_ar ?? category.name_en : category.name_en}
                checked={filters.category_id.includes(category.id)}
                onCheckedChange={(checked) =>
                  handleArrayFilterChange("category_id", category.id, checked)
                }
              />
            ))}
          </div>
        </SectionCard>
      ) : null}

      <SectionCard
        title={isRTL ? "التوفر والعروض" : "Availability & Offers"}
        helper={
          isRTL
            ? "إظهار العناصر المتوفرة أو المخفضة فقط."
            : "Focus on items currently available or discounted."
        }
      >
        <div className="flex flex-col gap-3">
          <CheckboxRow
            id="inStock"
            label={isRTL ? "متوفر في المخزون" : "In stock only"}
            checked={filters.inStock}
            onCheckedChange={(value) => handleFilterChange("inStock", value)}
          />
          <CheckboxRow
            id="onSale"
            label={isRTL ? "خصومات وعروض" : "On sale"}
            checked={filters.onSale}
            onCheckedChange={(value) => handleFilterChange("onSale", value)}
          />
        </div>
      </SectionCard>

      {filterOptions.collections.length > 0 && (
        <SectionCard
          title={isRTL ? "المجموعات" : "Collections"}
          helper={
            isRTL
              ? "تصفح مجموعات محددة من المنتجات."
              : "Narrow the catalogue to specific collections."
          }
        >
          <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto pr-1">
            {filterOptions.collections.map((collection) => (
              <CheckboxRow
                key={collection.id}
                id={`collection-${collection.id}`}
                label={collection.title}
                checked={filters.collection_id.includes(collection.id)}
                onCheckedChange={(checked) =>
                  handleArrayFilterChange("collection_id", collection.id, checked)
                }
              />
            ))}
          </div>
        </SectionCard>
      )}

      {filterOptions.types.length > 0 && (
        <SectionCard
          title={isRTL ? "الأنواع" : "Product types"}
          helper={
            isRTL
              ? "اختر أنواع المنتجات المفضلة."
              : "Pick the product categories you’re interested in."
          }
        >
          <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto pr-1">
            {filterOptions.types.map((type) => (
              <CheckboxRow
                key={type.id}
                id={`type-${type.id}`}
                label={type.value}
                checked={filters.type_id.includes(type.id)}
                onCheckedChange={(checked) =>
                  handleArrayFilterChange("type_id", type.id, checked)
                }
              />
            ))}
          </div>
        </SectionCard>
      )}

      {filterOptions.colors.length > 0 && (
        <SectionCard
          title={isRTL ? "الألوان" : "Colors"}
          helper={
            isRTL
              ? "حدد لوحة الألوان الأنسب."
              : "Dial in the palette that suits your look."
          }
        >
          <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto pr-1">
            {filterOptions.colors.map((color) => (
              <CheckboxRow
                key={color}
                id={`color-${color}`}
                label={color}
                checked={filters.colors.includes(color)}
                onCheckedChange={(checked) =>
                  handleArrayFilterChange("colors", color, checked)
                }
              />
            ))}
          </div>
        </SectionCard>
      )}

      {filterOptions.materials.length > 0 && (
        <SectionCard
          title={isRTL ? "المواد" : "Materials"}
          helper={
            isRTL
              ? "اختر المواد والتشطيبات المفضلة لديك."
              : "Pick finishes and materials you prefer."
          }
        >
          <div className="grid grid-cols-1 gap-2">
            {filterOptions.materials.map((material) => (
              <CheckboxRow
                key={material}
                id={`material-${material}`}
                label={material}
                checked={filters.materials.includes(material)}
                onCheckedChange={(checked) =>
                  handleArrayFilterChange("materials", material, checked)
                }
              />
            ))}
          </div>
        </SectionCard>
      )}

      {filterOptions.sizes.length > 0 && (
        <SectionCard
          title={isRTL ? "المقاسات" : "Sizes"}
          helper={
            isRTL
              ? "تأكد من توفر المقاس المناسب."
              : "Make sure the dimensions fit your needs."
          }
        >
          <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto pr-1">
            {filterOptions.sizes.map((size) => (
              <button
                key={size}
                type="button"
                onClick={() =>
                  handleArrayFilterChange(
                    "sizes",
                    size,
                    !filters.sizes.includes(size)
                  )
                }
                className={clx(
                  "rounded-xl border px-3 py-2 text-sm transition",
                  {
                    "border-ui-border-strong bg-ui-bg-field text-ui-fg-base":
                      filters.sizes.includes(size),
                    "border-ui-border-subtle text-ui-fg-subtle":
                      !filters.sizes.includes(size),
                  }
                )}
              >
                {size}
              </button>
            ))}
          </div>
        </SectionCard>
      )}

      <SectionCard
        title={isRTL ? "نطاق السعر" : "Price range"}
        helper={
          isRTL
            ? "اضبط نطاق السعر المناسب لميزانيتك."
            : "Stay within the budget that fits you."
        }
      >
        <FilterRadioGroup
          locale={locale}
          title=""
          value={filters.price}
          handleChange={(value: string) => handleFilterChange("price", value)}
          items={PRICE_PRESETS.map((preset) => ({
            value: preset.value,
            label: isRTL ? preset.labelAr : preset.labelEn,
          }))}
        />
      </SectionCard>

      {variant === "inline" && hasActiveFilters && (
        <Button variant="secondary" onClick={clearFilters} className="w-full mb-5">
          <X className="w-4 h-4 mr-2 rtl:ml-2 rtl:mr-0" />
          {isRTL ? "مسح جميع الفلاتر" : "Clear all filters"}
        </Button>
      )}
    </div>
  )
  const activeFilterCount = [
    filters.inStock,
    filters.onSale,
    filters.price,
    ...filters.collection_id,
    ...filters.type_id,
    ...filters.category_id,
    ...filters.colors,
    ...filters.materials,
    ...filters.sizes,
  ].filter(Boolean).length

  return (
    <>
      {/* Mobile Filter Button - Only show when NOT inline (mobile mode) */}
      {!inline && (
        <div className="small:hidden mb-4 flex w-full justify-end">
          <Button
            variant="secondary"
            onClick={() => setIsDrawerOpen(true)}
            className="inline-flex items-center gap-2 rounded-full px-4 py-2 shadow-sm"
          >
            <SlidersHorizontal className="h-4 w-4" />
            <span>{isRTL ? "الفلاتر" : "Filters"}</span>
            {activeFilterCount > 0 && <Badge className="ml-1">{activeFilterCount}</Badge>}
          </Button>
        </div>
      )}

      {/* Inline content for desktop containers (controlled by parent) */}
      {inline && (
        <aside
          className="sticky top-28 hidden small:block w-full "
          data-testid={dataTestId}
        >
          <div className="group relative flex flex-col ">

            {/* Header Section */}
            <div className="mb-8 flex items-start justify-between border-b border-ui-border-base/50 pb-6">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-[#043364] animate-pulse" />
                  <Text className="text-lg font-bold tracking-tight text-ui-fg-base">
                    {isRTL ? "تصفية المنتجات" : "Store Filters"}
                  </Text>
                </div>
                <Text className="text-[11px] font-medium text-ui-fg-muted leading-relaxed max-w-[180px]">
                  {isRTL
                    ? "استعرض مجموعتنا بدقة وسهولة."
                    : "Refine your browsing experience effortlessly."}
                </Text>
              </div>

              {activeFilterCount > 0 && (
                <div className="flex flex-col items-end gap-2">
                  <Badge
                    size="small"
                    className="bg-[#043364] text-white rounded-full px-2.5 py-0.5 border-none font-bold"
                  >
                    {activeFilterCount}
                  </Badge>
                  <button
                    onClick={clearFilters}
                    className="text-[10px] font-black uppercase tracking-tighter text-ui-fg-interactive hover:opacity-70 transition-opacity"
                  >
                    {isRTL ? "مسح" : "Reset"}
                  </button>
                </div>
              )}
            </div>

            {/* Filter Options Area */}
            <div className="max-h-[calc(100vh-280px)] overflow-y-auto pr-3 custom-scrollbar-minimal scroll-smooth">
              <div className="flex flex-col gap-2">
                {renderFilterContent("inline")}
              </div>
            </div>

            {/* Decorative Bottom Shadow/Fade */}
            <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-white/80 dark:from-ui-bg-subtle/80 to-transparent pointer-events-none rounded-b-[2rem]" />
          </div>

          {/* CSS for custom scrollbar (can be moved to global CSS) */}
          <style jsx>{`
      .custom-scrollbar-minimal::-webkit-scrollbar {
        width: 4px;
      }
      .custom-scrollbar-minimal::-webkit-scrollbar-track {
        background: transparent;
      }
      .custom-scrollbar-minimal::-webkit-scrollbar-thumb {
        background: #e2e8f0;
        border-radius: 10px;
      }
      .dark .custom-scrollbar-minimal::-webkit-scrollbar-thumb {
        background: #334155;
      }
      .custom-scrollbar-minimal::-webkit-scrollbar-thumb:hover {
        background: #043364;
      }
    `}</style>
        </aside>
      )}
      {/* Mobile Drawer - Only show when NOT inline (mobile mode) */}
      {!inline && (
        <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
          <DrawerContent
            data-testid={dataTestId}
            className="max-h-[92vh] rounded-t-[2.5rem] border-none bg-ui-bg-base shadow-2xl"
          >
            {/* مقبض سحب علوي للجمالية (Indicator) */}
            <div className="mx-auto mt-3 h-1.5 w-12 rounded-full bg-ui-border-strong/20" />

            <div className="flex h-full flex-col overflow-hidden">
              {/* Header - Glass Effect */}
              <DrawerHeader className="flex flex-row items-center justify-between px-6 py-6 border-b border-ui-border-base/50 backdrop-blur-md">
                <div className="space-y-0.5 text-left">
                  <DrawerTitle className="text-xl font-bold tracking-tight text-ui-fg-base">
                    {isRTL ? "تصفية المنتجات" : "Filter Products"}
                  </DrawerTitle>
                  <Text className="text-[10px] font-medium uppercase tracking-wider text-ui-fg-muted">
                    {activeFilterCount > 0
                      ? `${activeFilterCount} ${isRTL ? 'فلاتر مختارة' : 'Filters Active'}`
                      : (isRTL ? "اكتشف خياراتك" : "Refine your search")}
                  </Text>
                </div>
                <DrawerClose asChild>
                  <Button
                    variant="transparent"
                    className="h-10 w-10 rounded-full bg-ui-bg-component p-0 hover:bg-ui-bg-component-hover transition-colors"
                  >
                    <X className="w-5 h-5 text-ui-fg-subtle" />
                  </Button>
                </DrawerClose>
              </DrawerHeader>

              {/* Content Area - Scrollable */}
              <div className="flex-1 overflow-y-auto px-6 py-4 scrollbar-hide">
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                  {renderFilterContent("drawer")}
                </div>
              </div>

              {/* Footer - Floating Action Design */}
              <DrawerFooter className="flex flex-row items-center gap-4 border-t border-ui-border-base bg-ui-bg-subtle/50 p-6 pb-10">
                <Button
                  variant="secondary"
                  className={clx(
                    "h-12 flex-1 rounded-2xl font-bold text-xs uppercase tracking-widest transition-all",
                    !hasActiveFilters ? "opacity-50" : "hover:bg-red-50 hover:text-red-600 hover:border-red-100"
                  )}
                  onClick={clearFilters}
                  disabled={!hasActiveFilters}
                >
                  <RotateCcw className="mr-2 h-3.5 w-3.5 rtl:ml-2 rtl:mr-0" />
                  {isRTL ? "إعادة تعيين" : "Reset"}
                </Button>

                <DrawerClose asChild>
                  <Button className="h-12 flex-[2] rounded-2xl bg-[#043364] text-white shadow-lg shadow-[#043364]/20 hover:bg-[#03284d] active:scale-[0.98] transition-all font-bold text-xs uppercase tracking-widest">
                    {isRTL ? "عرض النتائج" : "Show results"}
                  </Button>
                </DrawerClose>
              </DrawerFooter>
            </div>
          </DrawerContent>
        </Drawer>
      )}
    </>
  )
}

export default RefinementList
