"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useCallback, useState, useEffect } from "react"
import { ChevronDown, Filter, X, SlidersHorizontal } from "lucide-react"
import { Button, Badge, Drawer, Checkbox, Label, RadioGroup } from "@medusajs/ui"
import { clx } from "@medusajs/ui"
import SortProducts, { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import { getProductFilterOptions } from "@lib/data/products"

type CategoryFiltersProps = {
  sortBy: SortOptions
  countryCode: string
  locale: string
  categoryId: string
  'data-testid'?: string
  inline?: boolean
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

const CategoryFilters = ({ 
  sortBy, 
  countryCode,
  locale,
  categoryId,
  'data-testid': dataTestId,
  inline = false,
}: CategoryFiltersProps) => {
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

  const [filters, setFilters] = useState({
    inStock: searchParams.get('inStock') === 'true',
    onSale: searchParams.get('onSale') === 'true',
    price: searchParams.get('price') || '',
    collection_id: searchParams.get('collection_id')?.split(',') || [],
    type_id: searchParams.get('type_id')?.split(',') || [],
    colors: searchParams.get('colors')?.split(',') || [],
    materials: searchParams.get('materials')?.split(',') || [],
    sizes: searchParams.get('sizes')?.split(',') || [],
  })

  // Load category-specific filter options on component mount
  useEffect(() => {
    const loadFilterOptions = async () => {
      const options = await getProductFilterOptions(countryCode, categoryId)
      setFilterOptions(options)
    }
    loadFilterOptions()
  }, [countryCode, categoryId])

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

  const handleFilterChange = useCallback((filterType: keyof typeof filters, value: any) => {
    setFilters(prev => {
      let newFilters = { ...prev }
      
      if (filterType === 'inStock' || filterType === 'onSale' || filterType === 'price') {
        newFilters[filterType] = value
      } else {
        // Handle array filters (collection_id, type_id, colors, materials, sizes)
        const currentValues = prev[filterType] as string[]
        if (currentValues.includes(value)) {
          newFilters[filterType] = currentValues.filter(v => v !== value)
        } else {
          newFilters[filterType] = [...currentValues, value]
        }
      }
      
      updateURL(newFilters)
      return newFilters
    })
  }, [updateURL])

  const handleArrayFilterChange = useCallback((key: string, value: string, checked: boolean) => {
    const currentArray = filters[key as keyof typeof filters] as string[]
    let newArray: string[]
    
    if (checked) {
      newArray = [...currentArray, value]
    } else {
      newArray = currentArray.filter(item => item !== value)
    }
    
    const newFilters = { ...filters, [key]: newArray }
    setFilters(newFilters)
    updateURL(newFilters)
  }, [filters, updateURL])

  const clearFilters = useCallback(() => {
    const clearedFilters = {
      inStock: false,
      onSale: false,
      price: '',
      collection_id: [],
      type_id: [],
      colors: [],
      materials: [],
      sizes: [],
    }
    setFilters(clearedFilters)
    updateURL(clearedFilters)
  }, [updateURL])

  const hasActiveFilters = [
    filters.inStock,
    filters.onSale,
    filters.price,
    ...filters.collection_id,
    ...filters.type_id,
    ...filters.colors,
    ...filters.materials,
    ...filters.sizes
  ].filter(Boolean).length > 0

  const handleSortChange = useCallback((key: string, value: SortOptions) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set(key, value)
    // Reset pagination to page 1 when sort changes
    params.delete('page')
    const newURL = `${pathname}?${params.toString()}`
    router.push(newURL)
  }, [searchParams, pathname, router])

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Sort Section */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-ui-fg-base">
          {isRTL ? "ترتيب حسب" : "Sort by"}
        </h3>
        <SortProducts
          sortBy={sortBy} 
          setQueryParams={handleSortChange}
          locale={locale}
        />
      </div>

      {/* In Stock Filter */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-ui-fg-base">
          {isRTL ? "التوفر" : "Availability"}
        </h3>
        <div className="space-y-2">
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <Checkbox
              id="inStock"
              checked={filters.inStock}
              onCheckedChange={(checked) => handleFilterChange('inStock', Boolean(checked))}
            />
            <Label htmlFor="inStock" className="text-sm text-ui-fg-subtle">
              {isRTL ? "متوفر فقط" : "In Stock Only"}
            </Label>
          </div>
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <Checkbox
              id="onSale"
              checked={filters.onSale}
              onCheckedChange={(checked) => handleFilterChange('onSale', Boolean(checked))}
            />
            <Label htmlFor="onSale" className="text-sm text-ui-fg-subtle">
              {isRTL ? "خصم" : "On Sale"}
            </Label>
          </div>
        </div>
      </div>

      {/* Collections Filter */}
      {filterOptions.collections.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-ui-fg-base">
            {isRTL ? "المجموعات" : "Collections"}
          </h3>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {filterOptions.collections.map((collection) => (
              <div key={collection.id} className="flex items-center space-x-2 rtl:space-x-reverse">
                <Checkbox
                  id={`collection-${collection.id}`}
                  checked={filters.collection_id.includes(collection.id)}
                  onCheckedChange={(checked) => 
                    handleArrayFilterChange('collection_id', collection.id, Boolean(checked))
                  }
                />
                <Label htmlFor={`collection-${collection.id}`} className="text-sm text-ui-fg-subtle">
                  {collection.title}
                </Label>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Product Types Filter */}
      {filterOptions.types.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-ui-fg-base">
            {isRTL ? "النوع" : "Type"}
          </h3>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {filterOptions.types.map((type) => (
              <div key={type.id} className="flex items-center space-x-2 rtl:space-x-reverse">
                <Checkbox
                  id={`type-${type.id}`}
                  checked={filters.type_id.includes(type.id)}
                  onCheckedChange={(checked) => 
                    handleArrayFilterChange('type_id', type.id, Boolean(checked))
                  }
                />
                <Label htmlFor={`type-${type.id}`} className="text-sm text-ui-fg-subtle">
                  {type.value}
                </Label>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Colors Filter */}
      {filterOptions.colors.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-ui-fg-base">
            {isRTL ? "الألوان" : "Colors"}
          </h3>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {filterOptions.colors.map((color) => (
              <div key={color} className="flex items-center space-x-2 rtl:space-x-reverse">
                <Checkbox
                  id={`color-${color}`}
                  checked={filters.colors.includes(color)}
                  onCheckedChange={(checked) => 
                    handleArrayFilterChange('colors', color, Boolean(checked))
                  }
                />
                <Label htmlFor={`color-${color}`} className="text-sm text-ui-fg-subtle">
                  {color}
                </Label>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Materials Filter */}
      {filterOptions.materials.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-ui-fg-base">
            {isRTL ? "المواد" : "Materials"}
          </h3>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {filterOptions.materials.map((material) => (
              <div key={material} className="flex items-center space-x-2 rtl:space-x-reverse">
                <Checkbox
                  id={`material-${material}`}
                  checked={filters.materials.includes(material)}
                  onCheckedChange={(checked) => 
                    handleArrayFilterChange('materials', material, Boolean(checked))
                  }
                />
                <Label htmlFor={`material-${material}`} className="text-sm text-ui-fg-subtle">
                  {material}
                </Label>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sizes Filter */}
      {filterOptions.sizes.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-ui-fg-base">
            {isRTL ? "المقاسات" : "Sizes"}
          </h3>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {filterOptions.sizes.map((size) => (
              <div key={size} className="flex items-center space-x-2 rtl:space-x-reverse">
                <Checkbox
                  id={`size-${size}`}
                  checked={filters.sizes.includes(size)}
                  onCheckedChange={(checked) => 
                    handleArrayFilterChange('sizes', size, Boolean(checked))
                  }
                />
                <Label htmlFor={`size-${size}`} className="text-sm text-ui-fg-subtle">
                  {size}
                </Label>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Price Range Filter */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-ui-fg-base">
          {isRTL ? "نطاق السعر" : "Price Range"}
        </h3>
        <div className="space-y-2">
          {[
            { value: '', label: isRTL ? 'جميع الأسعار' : 'All Prices' },
            { value: '0-50', label: isRTL ? 'أقل من 50€' : 'Under €50' },
            { value: '50-100', label: isRTL ? '50€ - 100€' : '€50 - €100' },
            { value: '100-200', label: isRTL ? '100€ - 200€' : '€100 - €200' },
            { value: '200+', label: isRTL ? 'أكثر من 200€' : 'Over €200' }
          ].map((range) => (
            <div key={range.value} className="flex items-center space-x-2 rtl:space-x-reverse">
              <input
                type="radio"
                id={`price-${range.value || 'all'}`}
                name="price"
                value={range.value}
                checked={filters.price === range.value}
                onChange={() => handleFilterChange('price', range.value)}
                className="w-4 h-4"
              />
              <Label htmlFor={`price-${range.value || 'all'}`} className="text-sm text-ui-fg-subtle">
                {range.label}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Clear Filters */}
      {hasActiveFilters && (
        <div className="pt-4 border-t border-ui-border-base">
          <Button
            variant="secondary"
            onClick={clearFilters}
            className="w-full"
          >
            <X className="w-4 h-4 mr-2 rtl:ml-2 rtl:mr-0" />
            {isRTL ? "مسح الفلاتر" : "Clear Filters"}
          </Button>
        </div>
      )}
    </div>
  )

  const activeFilterCount = [
    filters.inStock,
    filters.onSale,
    filters.price,
    ...filters.collection_id,
    ...filters.type_id,
    ...filters.colors,
    ...filters.materials,
    ...filters.sizes
  ].filter(Boolean).length

  return (
    <>
      {/* Mobile Filter Button - Only show when NOT inline (mobile mode) */}
      {!inline && (
        <div className="flex items-center justify-between mb-4 small:hidden">
          <Button
            variant="secondary"
            onClick={() => setIsDrawerOpen(true)}
            className="flex items-center space-x-2 rtl:space-x-reverse"
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>{isRTL ? "الفلاتر" : "Filters"}</span>
            {activeFilterCount > 0 && (
              <Badge className="ml-2 rtl:ml-0 rtl:mr-2">
                {activeFilterCount}
              </Badge>
            )}
          </Button>
        </div>
      )}

      {/* Inline content for desktop containers (controlled by parent) */}
      {inline && (
        <div className="space-y-6 p-6 bg-ui-bg-subtle rounded-lg border border-ui-border-base">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-ui-fg-base">
              {isRTL ? "فلاتر الفئة" : "Category Filters"}
            </h2>
            {activeFilterCount > 0 && (
              <Badge>
                {activeFilterCount}
              </Badge>
            )}
          </div>
          <FilterContent />
        </div>
      )}

      {/* Mobile Drawer - Only show when NOT inline (mobile mode) */}
      {!inline && (
        <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-ui-fg-base">
                {isRTL ? "فلاتر الفئة" : "Category Filters"}
              </h2>
              <Button
                variant="transparent"
                onClick={() => setIsDrawerOpen(false)}
                className="p-2"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
            <FilterContent />
          </div>
        </Drawer>
      )}
    </>
  )
}

export default CategoryFilters
