"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { ReactNode, useCallback, useEffect, useMemo, useState } from "react"
import { ChevronDown, X } from "lucide-react"
import { clx } from "@medusajs/ui"
import { SortOptions } from "./sort-products"
import { getProductFilterOptions } from "@lib/data/products"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerTitle,
} from "@modules/common/components/ui/drawer"
import MobileFilterBar from "./mobile-filter-bar"

type CategoryOption = {
  id: string
  name_en: string
  name_ar: string
  parent_category_id?: string | null
  metadata?: any
  category_children?: CategoryOption[]
  products?: any[]
}

type CategoryTree = {
  byId: Map<string, CategoryOption & { children: CategoryOption[] }>
  roots: CategoryOption[]
}

type CheckboxRowProps = {
  id: string
  label: string
  checked: boolean
  onCheckedChange: (checked: boolean) => void
  count?: number
}

const CheckboxRow = ({
  id,
  label,
  checked,
  onCheckedChange,
  count,
}: CheckboxRowProps) => (
  <label
    htmlFor={id}
    className="flex items-center justify-between cursor-pointer w-full gap-3"
  >
    <span className="flex items-center gap-3 min-w-0">
      <span
        className={clx(
          "flex items-center justify-center h-[18px] w-[18px] rounded-[4px] border-[1.5px] transition-all flex-shrink-0",
          checked
            ? "bg-[#17284a] border-[#17284a]"
            : "bg-white border-[#ccc] hover:border-[#17284a]/50"
        )}
      >
        {checked && (
          <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        )}
      </span>
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={(e) => onCheckedChange(e.target.checked)}
        className="sr-only"
      />
      <span className={clx("text-[14px] line-clamp-1", checked ? "font-bold text-[#1c1b1c]" : "text-[#1c1b1c]")}>
        {label}
      </span>
    </span>
    {count !== undefined && (
      <span className="text-[14px] text-[#707176] flex-shrink-0">({count})</span>
    )}
  </label>
)

type RefinementListProps = {
  sortBy: SortOptions
  countryCode: string
  locale: string
  'data-testid'?: string
  inline?: boolean
  categories?: CategoryOption[]
  currentCategoryId?: string
}

type ProductCategoryInfo = {
  id: string
  name: string
  parent_category_id: string | null
  count: number
}

type FilterOptions = {
  collections: Array<{ id: string, title: string, handle: string }>
  types: Array<{ id: string, value: string }>
  colors: string[]
  materials: string[]
  sizes: string[]
  priceRange: { min: number, max: number }
  totalProducts: number
  productCategories: ProductCategoryInfo[]
}

type PriceRangeFilterProps = {
  isRTL: boolean
  initialPrice: string
  onApply: (price: string) => void
  minPrice: number
  maxPrice: number
  variant?: "inline" | "drawer"
}

const PriceRangeFilter = ({ isRTL, initialPrice, onApply, minPrice, maxPrice, variant = "inline" }: PriceRangeFilterProps) => {
  const [minInput, setMinInput] = useState("")
  const [maxInput, setMaxInput] = useState("")

  useEffect(() => {
    if (!initialPrice) {
      setMinInput("")
      setMaxInput("")
      return
    }
    if (initialPrice.endsWith("+")) {
      const min = parseFloat(initialPrice.slice(0, -1))
      setMinInput(isNaN(min) ? "" : String(min))
      setMaxInput("")
    } else if (initialPrice.includes("-")) {
      const [min, max] = initialPrice.split("-")
      const minNum = parseFloat(min)
      const maxNum = parseFloat(max)
      setMinInput(isNaN(minNum) ? "" : min)
      setMaxInput(isNaN(maxNum) ? "" : max)
    }
  }, [initialPrice])

  const handleApply = useCallback(() => {
    const min = minInput.trim()
    const max = maxInput.trim()
    if (min && max) {
      onApply(`${min}-${max}`)
    } else if (min) {
      onApply(`${min}+`)
    } else if (max) {
      onApply(`0-${max}`)
    } else {
      onApply("")
    }
  }, [minInput, maxInput, onApply])

  const handleInputChange = (thumb: "min" | "max", raw: string) => {
    const clean = raw.replace(/[^0-9]/g, "")
    if (thumb === "min") {
      setMinInput(clean)
    } else {
      setMaxInput(clean)
    }
  }

  const range = maxPrice - minPrice
  const leftPercent = range > 0 && minInput ? Math.max(0, Math.min(100, ((parseFloat(minInput) - minPrice) / range) * 100)) : 0
  const rightPercent = range > 0 && maxInput ? Math.max(0, Math.min(100, ((parseFloat(maxInput) - minPrice) / range) * 100)) : 100

  const inputClass = variant === "drawer"
    ? "flex flex-1 items-center gap-1 rounded-[8px] border border-[#ccc] bg-white px-[10px] py-[10px] transition-colors focus-within:border-[#17284a]"
    : "flex flex-1 items-center gap-1.5 rounded-md border border-gray-200 bg-white px-3 py-2 shadow-sm focus-within:border-[#17284a] transition-colors"

  return (
    <div className="flex flex-col w-full">
      {/* Inputs Row */}
      <div className="flex items-center gap-3 mb-3">
        {/* Min Input */}
        <div className={inputClass}>
          <span className="text-[12px] font-normal text-[#707176] select-none flex-shrink-0">{isRTL ? "ج.م" : "EGP"}</span>
          <input
            type="text"
            inputMode="numeric"
            value={minInput}
            onChange={(e) => handleInputChange("min", e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") handleApply() }}
            onBlur={handleApply}
            placeholder={isRTL ? "الأدنى" : "Min"}
            className="w-full bg-transparent text-[12px] font-bold text-[#1c1b1c] outline-none border-none min-w-0"
          />
        </div>

        <span className="text-[14px] text-[#707176] flex-shrink-0">-</span>

        {/* Max Input */}
        <div className={inputClass}>
          <span className="text-[12px] font-normal text-[#707176] select-none flex-shrink-0">{isRTL ? "ج.م" : "EGP"}</span>
          <input
            type="text"
            inputMode="numeric"
            value={maxInput}
            onChange={(e) => handleInputChange("max", e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") handleApply() }}
            onBlur={handleApply}
            placeholder={isRTL ? "الأعلى" : "Max"}
            className="w-full bg-transparent text-[12px] font-bold text-[#1c1b1c] outline-none border-none min-w-0"
          />
        </div>
      </div>

      {/* Slider Track - drawer variant only */}
      {variant === "drawer" && (
        <div className="relative flex items-center justify-center w-full h-[20px]">
          <div className="relative w-full h-[4px] rounded-[2px] bg-[#e5e7eb]">
            <div
              className="absolute h-[4px] rounded-[2px] bg-[#17284a]"
              style={{
                left: `${leftPercent}%`,
                width: `${Math.max(0, rightPercent - leftPercent)}%`,
              }}
            />
            <div
              className="absolute size-[16px] rounded-full bg-[#17284a] border-2 border-white shadow-sm -translate-x-1/2"
              style={{ left: `${leftPercent}%`, top: '-6px' }}
            />
            <div
              className="absolute size-[16px] rounded-full bg-[#17284a] border-2 border-white shadow-sm -translate-x-1/2"
              style={{ left: `${rightPercent}%`, top: '-6px' }}
            />
          </div>
        </div>
      )}

      {/* Apply button for price range */}
      <button
        type="button"
        onClick={handleApply}
        className="self-start text-[12px] font-medium text-[#17284a] underline hover:text-[#0f1d38] mt-1"
      >
        {/* {isRTL ? "تطبيق السعر" : "Apply price"} */}
      </button>

      {/* Bottom Divider - inline variant only */}
      {/* {variant === "inline" && (
        <div className="border-b border-gray-100 mt-4" />
      )} */}
    </div>
  )
}

const RefinementList = ({
  sortBy,
  countryCode,
  locale,
  'data-testid': dataTestId,
  inline = false,
  categories,
  currentCategoryId,
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
    priceRange: { min: 0, max: 0 },
    totalProducts: 0,
    productCategories: [],
  })

  // Active filters = committed to URL
  const activeFilters = useMemo(() => {
    const readList = (key: string) =>
      (searchParams.get(key) || "")
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean)

    return {
      inStock: searchParams.get("inStock") === "true",
      onSale: searchParams.get("onSale") === "true",
      madeToOrder: searchParams.get("madeToOrder") === "true",
      price: searchParams.get("price") || "",
      collection_id: readList("collection_id"),
      type_id: readList("type_id"),
      colors: readList("colors"),
      materials: readList("materials"),
      sizes: readList("sizes"),
      category_id: readList("category_id"),
    }
  }, [searchParams])

  // Pending filters = local state, not yet committed to URL
  const [pendingFilters, setPendingFilters] = useState(activeFilters)

  // Sync pending filters when URL changes (e.g. from Clear or external navigation)
  useEffect(() => {
    setPendingFilters(activeFilters)
  }, [activeFilters])

  // The filters we render = pending (what user sees in UI)
  const filters = pendingFilters

  // Load filter options on component mount
  useEffect(() => {
    const loadFilterOptions = async () => {
      const options = await getProductFilterOptions(countryCode, currentCategoryId)
      setFilterOptions(options)
    }
    loadFilterOptions()
  }, [countryCode, currentCategoryId])

  const commitFilters = useCallback((newFilters: typeof activeFilters) => {
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

  // Apply = commit pending filters to URL
  const applyFilters = useCallback(() => {
    commitFilters(pendingFilters)
  }, [commitFilters, pendingFilters])

  // Check if pending filters differ from active (committed) filters
  const hasPendingChanges = useMemo(() => {
    const a = JSON.stringify(activeFilters)
    const p = JSON.stringify(pendingFilters)
    return a !== p
  }, [activeFilters, pendingFilters])

  // Local-only handlers: update pending state without URL push
  const handleFilterChange = useCallback((key: keyof typeof pendingFilters, value: any) => {
    setPendingFilters(prev => ({
      ...prev,
      [key]: value,
    }))
  }, [])

  const handleArrayFilterChange = useCallback((key: keyof typeof pendingFilters, value: string, checked: boolean) => {
    setPendingFilters(prev => {
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
    const cleared = {
      ...activeFilters,
      inStock: false,
      onSale: false,
      madeToOrder: false,
      price: "",
      collection_id: [],
      type_id: [],
      colors: [],
      materials: [],
      sizes: [],
      category_id: [],
    }
    setPendingFilters(cleared)
    commitFilters(cleared)
  }, [activeFilters, commitFilters])

  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set()
  )

  const toggleCategory = useCallback((id: string) => {
    setExpandedCategories((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }, [])

  const categoryTree = useMemo(() => {
    if (!categories?.length) {
      return {
        roots: [] as Array<CategoryOption & { children: CategoryOption[] }>,
        byId: new Map<string, CategoryOption & { children: CategoryOption[] }>(),
      }
    }

    const byId = new Map<string, CategoryOption & { children: CategoryOption[] }>()
    categories.forEach((cat) => {
      byId.set(String(cat.id), { ...cat, children: [] })
    })

    const roots: Array<CategoryOption & { children: CategoryOption[] }> = []
    byId.forEach((cat) => {
      const parentId = cat.parent_category_id ? String(cat.parent_category_id) : null
      if (parentId && byId.has(parentId)) {
        byId.get(parentId)!.children.push(cat)
      } else {
        roots.push(cat)
      }
    })

    return { roots, byId }
  }, [categories])

  const visibleCategoryRoots = useMemo(() => {
    if (!currentCategoryId) return categoryTree.roots
    const current = categoryTree.byId.get(String(currentCategoryId))
    if (!current) return categoryTree.roots
    return current.children
  }, [categoryTree, currentCategoryId])

  const currentBranchIds = useMemo(() => {
    if (!currentCategoryId) return [] as string[]
    const current = categoryTree.byId.get(String(currentCategoryId))
    if (!current) return [] as string[]

    const ids: string[] = []
    const walk = (node: CategoryOption) => {
      ids.push(String(node.id))
      const enriched = categoryTree.byId.get(String(node.id))
      if (enriched) {
        enriched.children.forEach(walk)
      }
    }
    walk(current)
    return ids
  }, [categoryTree, currentCategoryId])

  useEffect(() => {
    if (!currentBranchIds.length) return
    setExpandedCategories(new Set(currentBranchIds))
  }, [currentBranchIds])

  const productCategoryCountMap = useMemo(() => {
    const map = new Map<string, number>()
    filterOptions.productCategories.forEach((cat) => {
      map.set(String(cat.id), cat.count)
    })
    return map
  }, [filterOptions.productCategories])

  const hasProductsInSubtree = useCallback((node: CategoryOption): boolean => {
    const nodeId = String(node.id)
    if (productCategoryCountMap.has(nodeId)) return true
    const enriched = categoryTree.byId.get(nodeId)
    if (!enriched) return false
    return enriched.children.some((child) => hasProductsInSubtree(child))
  }, [productCategoryCountMap, categoryTree])

  const renderCategoryNode = (
    node: CategoryOption,
    level = 0
  ) => {
    const nodeId = String(node.id)
    const enriched = categoryTree.byId.get(nodeId)
    const children = enriched?.children || []
    const hasChildren = children.length > 0
    const isOpen = expandedCategories.has(nodeId)
    const label = isRTL ? node.name_ar ?? node.name_en : node.name_en
    const count = productCategoryCountMap.get(nodeId)

    return (
      <div key={node.id} className="flex flex-col w-full">
        <div
          className="relative flex items-center gap-2 w-full"
          style={{ paddingInlineStart: `${level * 20}px` }}
        >
          {hasChildren ? (
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                toggleCategory(nodeId)
              }}
              className="h-5 w-5 flex items-center justify-center text-[#0F172A] hover:bg-gray-100 rounded transition-colors flex-shrink-0"
              aria-label={isOpen ? "collapse" : "expand"}
            >
              <ChevronDown className={clx("h-3.5 w-3.5 transition-transform duration-200", !isOpen && "-rotate-90")} />
            </button>
          ) : (
            <span className="inline-block h-5 w-5 flex-shrink-0" />
          )}
          <CheckboxRow
            id={`category-${nodeId}`}
            label={label}
            checked={filters.category_id.includes(nodeId)}
            onCheckedChange={(checked) =>
              handleArrayFilterChange("category_id", nodeId, checked)
            }
            count={count}
          />
        </div>
        {hasChildren && isOpen && (
          <div className="flex flex-col w-full mt-1">
            {children
              .filter((child) => hasProductsInSubtree(child))
              .map((child) => renderCategoryNode(child, level + 1))}
          </div>
        )}
      </div>
    )
  }
  const hasActiveFilters =
    activeFilters.inStock ||
    activeFilters.onSale ||
    activeFilters.madeToOrder ||
    activeFilters.price ||
    activeFilters.collection_id.length > 0 ||
    activeFilters.type_id.length > 0 ||
    activeFilters.category_id.length > 0 ||
    activeFilters.colors.length > 0 ||
    activeFilters.materials.length > 0 ||
    activeFilters.sizes.length > 0

  const SectionCard = ({
    title,
    helper,
    children,
    defaultOpen = true,
    isLast = false,
    variant = "inline",
  }: {
    title: string
    helper?: string
    children: ReactNode
    defaultOpen?: boolean
    isLast?: boolean
    variant?: "inline" | "drawer"
  }) => {
    if (variant === "drawer") {
      return (
        <div className={clx("flex flex-col gap-4", !isLast && "border-b border-[#e5e7eb] pb-[24px]")}>
          <span className="text-[16px] font-bold text-[#17284a]">{title}</span>
          <div className="flex flex-col gap-3">
            {children}
          </div>
        </div>
      )
    }
    return (
      <details
        className={clx("group flex flex-col gap-4", !isLast && "border-b border-gray-200 pb-6 mb-6")}
        open={defaultOpen}
      >
        <summary className="flex cursor-pointer items-center justify-between w-full">
          <span className="text-[16px] font-bold text-[#17284a]">{title}</span>
          <ChevronDown className="h-4 w-4 text-[#17284a] transition-transform duration-200 group-open:rotate-180" />
        </summary>
        <div className="flex flex-col gap-3 group-open:animate-in group-open:fade-in group-open:slide-in-from-top-1">
          {children}
        </div>
      </details>
    )
  }

  const [showAllCollections, setShowAllCollections] = useState(false)
  const [showAllTypes, setShowAllTypes] = useState(false)
  const [showAllColors, setShowAllColors] = useState(false)
  const [showAllMaterials, setShowAllMaterials] = useState(false)

  const ShowMoreLink = ({ show, onToggle }: { show: boolean; onToggle: () => void }) => (
    <button
      type="button"
      onClick={(e) => { e.preventDefault(); e.stopPropagation(); onToggle() }}
      className="text-xs text-[#0F172A] underline cursor-pointer self-start mt-1"
    >
      {show ? (isRTL ? "عرض أقل" : "Show less") : (isRTL ? "عرض المزيد" : "Show more")}
    </button>
  )

  const renderFilterContent = (variant: "inline" | "drawer") => {
    const visibleCollections = showAllCollections
      ? filterOptions.collections
      : filterOptions.collections.slice(0, 5)
    const visibleTypes = showAllTypes
      ? filterOptions.types
      : filterOptions.types.slice(0, 5)
    const visibleColors = showAllColors
      ? filterOptions.colors
      : filterOptions.colors.slice(0, 5)
    const visibleMaterials = showAllMaterials
      ? filterOptions.materials
      : filterOptions.materials.slice(0, 5)

    return (
    <div className="flex flex-col gap-6">

      {/* Dynamic Sections per Root Category */}
      {categories?.length ? (
        visibleCategoryRoots
          .filter((rootNode) => hasProductsInSubtree(rootNode))
          .map((rootNode) => {
            const rootId = String(rootNode.id)
            const rootLabel = isRTL ? rootNode.name_ar ?? rootNode.name_en : rootNode.name_en
            const enriched = categoryTree.byId.get(rootId)
            const children = enriched?.children || []

            return (
              <SectionCard
                key={rootNode.id}
                title={rootLabel}
                variant={variant}
              >
                <div className="flex flex-col gap-3 mt-3">
                  {children.length > 0 ? (
                    children
                      .filter((child) => hasProductsInSubtree(child))
                      .map((childNode) => {
                        const childId = String(childNode.id)
                        const childLabel = isRTL ? childNode.name_ar ?? childNode.name_en : childNode.name_en
                        const count = productCategoryCountMap.get(childId)

                        return (
                          <CheckboxRow
                            key={childId}
                            id={`${variant}-category-${childId}`}
                            label={childLabel}
                            checked={filters.category_id.includes(childId)}
                            onCheckedChange={(checked) =>
                              handleArrayFilterChange("category_id", childId, checked)
                            }
                            count={count}
                          />
                        )
                      })
                  ) : (
                    <CheckboxRow
                      id={`${variant}-category-${rootId}`}
                      label={rootLabel}
                      checked={filters.category_id.includes(rootId)}
                      onCheckedChange={(checked) =>
                        handleArrayFilterChange("category_id", rootId, checked)
                      }
                      count={productCategoryCountMap.get(rootId)}
                    />
                  )}
                </div>
              </SectionCard>
            )
          })
      ) : null}

      {/* Collections */}
      {filterOptions.collections.length > 0 && (
        <SectionCard
          title={isRTL ? "المجموعات" : "Collections"}
          variant={variant}
        >
            <div className="flex flex-col gap-3">
              {visibleCollections.map((collection) => (
                <CheckboxRow
                  key={collection.id}
                  id={`${variant}-collection-${collection.id}`}
                  label={collection.title}
                  checked={filters.collection_id.includes(collection.id)}
                  onCheckedChange={(checked) =>
                    handleArrayFilterChange("collection_id", collection.id, checked)
                  }
                />
              ))}
              {filterOptions.collections.length > 5 && (
                <ShowMoreLink show={showAllCollections} onToggle={() => setShowAllCollections(!showAllCollections)} />
              )}
            </div>
          </SectionCard>
      )}

      {/* Product Types */}
      {filterOptions.types.length > 0 && (
        <SectionCard
          title={isRTL ? "الأنواع" : "Product Types"}
          variant={variant}
        >
            <div className="flex flex-col gap-3">
              {visibleTypes.map((type) => (
                <CheckboxRow
                  key={type.id}
                  id={`${variant}-type-${type.id}`}
                  label={type.value}
                  checked={filters.type_id.includes(type.id)}
                  onCheckedChange={(checked) =>
                    handleArrayFilterChange("type_id", type.id, checked)
                  }
                />
              ))}
              {filterOptions.types.length > 5 && (
                <ShowMoreLink show={showAllTypes} onToggle={() => setShowAllTypes(!showAllTypes)} />
              )}
            </div>
          </SectionCard>
      )}

      {/* Colors */}
      {filterOptions.colors.length > 0 && (
        <SectionCard
          title={isRTL ? "الألوان" : "Colors"}
          variant={variant}
        >
            <div className="flex flex-col gap-3">
              {visibleColors.map((color) => (
                <CheckboxRow
                  key={color}
                  id={`${variant}-color-${color}`}
                  label={color}
                  checked={filters.colors.includes(color)}
                  onCheckedChange={(checked) =>
                    handleArrayFilterChange("colors", color, checked)
                  }
                />
              ))}
              {filterOptions.colors.length > 5 && (
                <ShowMoreLink show={showAllColors} onToggle={() => setShowAllColors(!showAllColors)} />
              )}
            </div>
          </SectionCard>
      )}

      {/* Materials */}
      {filterOptions.materials.length > 0 && (
        <SectionCard
          title={isRTL ? "المواد" : "Materials"}
          variant={variant}
        >
            <div className="flex flex-col gap-3">
              {visibleMaterials.map((material) => (
                <CheckboxRow
                  key={material}
                  id={`${variant}-material-${material}`}
                  label={material}
                  checked={filters.materials.includes(material)}
                  onCheckedChange={(checked) =>
                    handleArrayFilterChange("materials", material, checked)
                  }
                />
              ))}
              {filterOptions.materials.length > 5 && (
                <ShowMoreLink show={showAllMaterials} onToggle={() => setShowAllMaterials(!showAllMaterials)} />
              )}
            </div>
          </SectionCard>
      )}

      {/* Sizes */}
      {filterOptions.sizes.length > 0 && (
        <SectionCard
          title={isRTL ? "المقاسات" : "Sizes"}
          variant={variant}
        >
            <div className="grid grid-cols-2 gap-2">
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
                    "rounded-[4px] border-[1.5px] px-3 py-2 text-[15px] transition-all",
                    filters.sizes.includes(size)
                      ? "border-[#0F172A] bg-[#0F172A]/5 text-[#0F172A] font-medium"
                      : "border-gray-300 text-gray-700 hover:border-[#0F172A]/50"
                  )}
                >
                  {size}
                </button>
              ))}
            </div>
          </SectionCard>
        )}

        {/* Price Range - Dynamic slider + inputs */}
        {filterOptions.priceRange.max > 0 && (
          <SectionCard
            title={isRTL ? "نطاق السعر" : "Price Range"}
            variant={variant}
          >
            <PriceRangeFilter
              isRTL={isRTL}
              initialPrice={filters.price}
              onApply={(price) => handleFilterChange("price", price)}
              minPrice={filterOptions.priceRange.min}
              maxPrice={filterOptions.priceRange.max}
              variant={variant}
            />
          </SectionCard>
        )}

      {/* Availability - Radio buttons (single-select) */}
      <SectionCard
        title={isRTL ? "التوفر" : "Availability"}
        isLast
        variant={variant}
      >
        <div className="flex flex-col gap-3">
          {[
            { value: "all", label: isRTL ? "الكل" : "All", key: "all" },
            { value: "inStock", label: isRTL ? "بالسعر" : "With Price", key: "inStock" },
            { value: "madeToOrder", label: isRTL ? "السعر عند الطلب" : "Price on Request", key: "madeToOrder" },
          ].map((opt) => {
            const isSelected = opt.value === "all"
              ? !filters.inStock && !filters.onSale && !filters.madeToOrder
              : opt.value === "inStock"
                ? filters.inStock
                : opt.value === "madeToOrder"
                  ? filters.madeToOrder
                  : filters.onSale
            return (
              <label
                key={opt.key}
                htmlFor={`${variant}-availability-${opt.key}`}
                className="flex items-center gap-3 cursor-pointer w-full"
              >
                <span
                  className={clx(
                    "flex items-center justify-center h-[18px] w-[18px] rounded-full transition-all flex-shrink-0",
                    isSelected
                      ? "border-[2px] border-[#17284a] bg-white"
                      : "border-[1.5px] border-[#ccc] bg-white hover:border-[#17284a]/50"
                  )}
                >
                  {isSelected && (
                    <span className="h-[10px] w-[10px] rounded-full bg-[#17284a]" />
                  )}
                </span>
                <input
                  id={`${variant}-availability-${opt.key}`}
                  type="radio"
                  name={`${variant}-availability`}
                  checked={isSelected}
                  onChange={() => {
                    if (opt.value === "all") {
                      setPendingFilters(prev => ({ ...prev, inStock: false, onSale: false, madeToOrder: false }))
                    } else if (opt.value === "inStock") {
                      setPendingFilters(prev => ({ ...prev, inStock: true, onSale: false, madeToOrder: false }))
                    } else if (opt.value === "madeToOrder") {
                      setPendingFilters(prev => ({ ...prev, inStock: false, onSale: false, madeToOrder: true }))
                    }
                  }}
                  className="sr-only"
                />
                <span className={clx("text-[14px]", isSelected ? "font-bold text-[#1c1b1c]" : "text-[#1c1b1c]")}>
                  {opt.label}
                </span>
              </label>
            )
          })}
        </div>
      </SectionCard>

      {/* Apply + Clear - inline (desktop sidebar) */}
      {variant === "inline" && (
        <div className="flex flex-col gap-2 mt-2">
          <button
            type="button"
            onClick={applyFilters}
            disabled={!hasPendingChanges}
            className={clx(
              "w-full bg-[#17284a] text-white rounded-[12px] py-3 px-6 text-[15px] font-medium transition-all hover:bg-[#0f1d38] active:scale-[0.98]",
              !hasPendingChanges && "opacity-40 cursor-not-allowed hover:bg-[#17284a]"
            )}
          >
            {isRTL ? "تطبيق الفلاتر" : "Apply Filters"}
          </button>
          <button
            type="button"
            onClick={clearFilters}
            className={clx(
              "w-full bg-[#DCE3F2] text-[#17284a] rounded-[12px] py-3 px-6 text-[15px] font-medium transition-all hover:bg-[#CED5E8] active:scale-[0.98]",
              !hasActiveFilters && "opacity-50 cursor-not-allowed"
            )}
            disabled={!hasActiveFilters}
          >
            {isRTL ? "مسح جميع الفلاتر" : "Clear All Filters"}
          </button>
        </div>
      )}
    </div>
  )
  }
  const activeFilterCount = [
    filters.inStock,
    filters.onSale,
    filters.madeToOrder,
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
      {/* Mobile Filter Bar - Only show when NOT inline (mobile mode) */}
      {!inline && (
        <MobileFilterBar
          isRTL={isRTL}
          sort={sortBy}
          activeFilterCount={activeFilterCount}
          onOpenFilters={() => setIsDrawerOpen(true)}
        />
      )}

      {/* Inline content for desktop containers (controlled by parent) */}
      {inline && (
        <aside
          className="sticky top-28 hidden small:block w-full me-8 lg:me-12 pe-4 lg:pe-8"
          data-testid={dataTestId}
        >
          <div className="group relative flex flex-col ">

            {/* Header Section */}
            {/* <div className="mb-8 flex items-start justify-between border-b border-ui-border-base/50 pb-6">
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
            </div> */}

            {/* Filter Options Area */}
            <div className="w-full">
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
            className="max-h-[92vh] rounded-t-[24px] border-none bg-white shadow-2xl"
          >
            <div className="flex h-full flex-col overflow-hidden">
              {/* Header */}
              <div className="flex flex-row items-center justify-between px-4 pt-3 pb-4">
                <DrawerTitle className="text-[24px] font-bold text-[#17284a] leading-[1.25]">
                  {isRTL ? "الفلاتر" : "Filters"}
                </DrawerTitle>
                <DrawerClose asChild>
                  <button
                    className="flex items-center justify-center h-[36px] w-[36px] rounded-full bg-[#f3f4f6] hover:bg-gray-200 transition-colors"
                    aria-label={isRTL ? "إغلاق" : "Close"}
                  >
                    <X className="h-4 w-4 text-[#17284a]" />
                  </button>
                </DrawerClose>
              </div>

              {/* Content Area - Scrollable */}
              <div className="flex-1 overflow-y-auto p-4 scrollbar-hide">
                {renderFilterContent("drawer")}
              </div>

              {/* Sticky Footer */}
              <div className="sticky bottom-0 flex flex-col gap-3 border-t border-[#e5e7eb] bg-white p-4">
                <DrawerClose asChild>
                  <button
                    onClick={applyFilters}
                    disabled={!hasPendingChanges}
                    className={clx(
                      "w-full bg-[#17284a] text-white rounded-[16px] py-4 px-9 text-[14px] font-bold text-center transition-all hover:bg-[#0f1d38] active:scale-[0.98]",
                      !hasPendingChanges && "opacity-40 cursor-not-allowed hover:bg-[#17284a]"
                    )}
                  >
                    {isRTL ? "تطبيق الفلاتر" : "Apply Filters"}
                  </button>
                </DrawerClose>
                <button
                  type="button"
                  onClick={clearFilters}
                  disabled={!hasActiveFilters}
                  className={clx(
                    "w-full text-center py-2 text-[14px] font-bold text-[#707176] transition-colors",
                    hasActiveFilters ? "hover:text-[#17284a]" : "opacity-50 cursor-not-allowed"
                  )}
                >
                  {isRTL ? "مسح جميع الفلاتر" : "Clear All Filters"}
                </button>
              </div>
            </div>
          </DrawerContent>
        </Drawer>
      )}
    </>
  )
}

export default RefinementList
