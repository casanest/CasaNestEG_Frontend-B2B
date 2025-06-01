"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useCallback, useState, useEffect } from "react"
import { ChevronDown, ChevronUp, X, Filter, Sliders } from "lucide-react"
import { Button, Badge, Drawer } from "@medusajs/ui"
import SortProducts, { SortOptions } from "./sort-products"

type RefinementListProps = {
  sortBy: SortOptions
  'data-testid'?: string
  locale: string
}

const RefinementList = ({ sortBy, 'data-testid': dataTestId, locale }: RefinementListProps) => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const isRTL = locale === "ar"
  const [isMobile, setIsMobile] = useState(false)
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)

  // Check mobile viewport on mount and resize
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // State for filter sections
  const [openFilters, setOpenFilters] = useState({
    sort: true,
    price: false,
    color: false,
    size: false,
    availability: false,
    rating: false,
    brand: false
  })

  // Current filter values
  const priceRange = searchParams.get('price') || ''
  const colors = searchParams.get('colors')?.split(',') || []
  const sizes = searchParams.get('sizes')?.split(',') || []
  const brands = searchParams.get('brands')?.split(',') || []
  const minRating = searchParams.get('rating') || ''
  const inStock = searchParams.get('inStock') === 'true'
  const onSale = searchParams.get('onSale') === 'true'

  const activeFilterCount = [
    priceRange,
    colors.length,
    sizes.length,
    brands.length,
    minRating,
    inStock,
    onSale
  ].filter(Boolean).length

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams)
      params.set(name, value)
      return params.toString()
    },
    [searchParams]
  )

  const setQueryParams = (name: string, value: string) => {
    const query = createQueryString(name, value)
    router.push(`${pathname}?${query}`)
  }

  const toggleFilterSection = (section: keyof typeof openFilters) => {
    setOpenFilters(prev => ({ ...prev, [section]: !prev[section] }))
  }

  const handleMultiSelectToggle = (type: 'colors' | 'sizes' | 'brands', value: string) => {
    const currentValues = searchParams.get(type)?.split(',') || []
    const newValues = currentValues.includes(value)
      ? currentValues.filter(v => v !== value)
      : [...currentValues, value]
    setQueryParams(type, newValues.join(','))
  }

  const clearFilters = () => {
    const params = new URLSearchParams(searchParams)
      ;['price', 'colors', 'sizes', 'brands', 'rating', 'inStock', 'onSale'].forEach(param => params.delete(param))
    router.push(`${pathname}?${params.toString()}`)
    if (isMobile) setMobileFiltersOpen(false)
  }

  // Filter options data
  const filterOptions = {
    priceRanges: [
      { id: '0-50', label: isRTL ? 'حتى 50' : 'Under $50' },
      { id: '50-100', label: isRTL ? '50 إلى 100' : '$50 to $100' },
      { id: '100-200', label: isRTL ? '100 إلى 200' : '$100 to $200' },
      { id: '200-500', label: isRTL ? '200 إلى 500' : '$200 to $500' },
      { id: '500', label: isRTL ? 'أكثر من 500' : 'Over $500' }
    ],
    colors: [
      { id: 'black', label: isRTL ? 'أسود' : 'Black', hex: '#000000' },
      { id: 'white', label: isRTL ? 'أبيض' : 'White', hex: '#FFFFFF' },
      { id: 'blue', label: isRTL ? 'أزرق' : 'Blue', hex: '#3B82F6' },
      { id: 'green', label: isRTL ? 'أخضر' : 'Green', hex: '#10B981' },
      { id: 'red', label: isRTL ? 'أحمر' : 'Red', hex: '#EF4444' },
      { id: 'yellow', label: isRTL ? 'أصفر' : 'Yellow', hex: '#F59E0B' },
      { id: 'gray', label: isRTL ? 'رمادي' : 'Gray', hex: '#6B7280' }
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'].map(size => ({
      id: size,
      label: size
    })),
    brands: [
      { id: 'nike', label: 'Nike' },
      { id: 'adidas', label: 'Adidas' },
      { id: 'puma', label: 'Puma' },
      { id: 'reebok', label: 'Reebok' },
      { id: 'underarmour', label: 'Under Armour' }
    ].map(brand => ({
      ...brand,
      label: isRTL ? brand.label.split('').reverse().join('') : brand.label
    })),
    ratings: [4, 3, 2, 1].map(rating => ({
      id: rating.toString(),
      label: isRTL ? `${rating}+ ★` : `★ ${rating}+`
    }))
  }

  // Mobile filters toggle button
  const MobileFiltersButton = () => (
    <Button
      variant="transparent"
      onClick={() => setMobileFiltersOpen(true)}
      className="md:hidden flex items-center gap-2 border border-ui-border-base p-2 rounded-lg"
    >
      <Sliders size={16} />
      <span>{isRTL ? "الفلاتر" : "Filters"}</span>
      {activeFilterCount > 0 && (
        <Badge className="!text-xs">
          {activeFilterCount}
        </Badge>
      )}
    </Button>
  )

  // Filters content component (reused in drawer and desktop)
  const FiltersContent = () => (
    <div className="flex flex-col gap-6 h-full p-10 md:p-0">
      {/* Header with filter count */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter size={18} className="text-ui-fg-muted" />
          <h2 className="font-medium text-ui-fg-base">
            {isRTL ? "الفلاتر" : "Filters"}
          </h2>
          {activeFilterCount > 0 && (
            <Badge className="!text-xs" variant="blue">
              {activeFilterCount}
            </Badge>
          )}
        </div>
        {activeFilterCount > 0 && (
          <button
            onClick={clearFilters}
            className="text-xs text-ui-fg-subtle hover:text-ui-fg-interactive transition-colors"
          >
            {isRTL ? "مسح الكل" : "Clear all"}
          </button>
        )}
      </div>

      {/* Sort Options */}
      <div className="border-b border-ui-border-base pb-6">
        <button
          className="flex items-center justify-between w-full mb-4"
          onClick={() => toggleFilterSection('sort')}
        >
          <h3 className="font-medium text-ui-fg-base">
            {isRTL ? "ترتيب حسب" : "Sort By"}
          </h3>
          {openFilters.sort ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>

        {openFilters.sort && (
          <SortProducts
            locale={locale}
            sortBy={sortBy}
            setQueryParams={setQueryParams}
            className={isRTL ? 'text-right' : 'text-left'}
          />
        )}
      </div>

      {/* Price Range Filter */}
      <div className="border-b border-ui-border-base pb-6">
        <button
          className="flex items-center justify-between w-full mb-4"
          onClick={() => toggleFilterSection('price')}
        >
          <h3 className="font-medium text-ui-fg-base">
            {isRTL ? "نطاق السعر" : "Price Range"}
          </h3>
          {openFilters.price ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>

        {openFilters.price && (
          <div className="space-y-3">
            {filterOptions.priceRanges.map(range => (
              <div key={range.id} className="flex items-center">
                <input
                  id={`price-${range.id}`}
                  name="price-range"
                  type="radio"
                  checked={priceRange === range.id}
                  onChange={() => setQueryParams('price', range.id)}
                  className={`h-4 w-4 border-ui-border-base text-ui-fg-interactive focus:ring-ui-fg-interactive ${isRTL ? 'ml-3' : 'mr-3'
                    }`}
                />
                <label
                  htmlFor={`price-${range.id}`}
                  className="text-sm text-ui-fg-subtle"
                >
                  {range.label}
                </label>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Color Filter */}
      <div className="border-b border-ui-border-base pb-6">
        <button
          className="flex items-center justify-between w-full mb-4"
          onClick={() => toggleFilterSection('color')}
        >
          <h3 className="font-medium text-ui-fg-base">
            {isRTL ? "اللون" : "Color"}
          </h3>
          {openFilters.color ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>

        {openFilters.color && (
          <div className="grid grid-cols-4 gap-2">
            {filterOptions.colors.map(color => (
              <button
                key={color.id}
                onClick={() => handleMultiSelectToggle('colors', color.id)}
                className={`flex flex-col items-center p-2 rounded-md border ${colors.includes(color.id)
                    ? 'border-ui-fg-interactive bg-ui-bg-highlight'
                    : 'border-ui-border-base hover:bg-ui-bg-subtle-hover'
                  }`}
                aria-label={color.label}
              >
                <div
                  className="w-6 h-6 rounded-full mb-1 border border-ui-border-base"
                  style={{ backgroundColor: color.hex }}
                />
                <span className="text-xs text-ui-fg-base">{color.label}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Size Filter */}
      <div className="border-b border-ui-border-base pb-6">
        <button
          className="flex items-center justify-between w-full mb-4"
          onClick={() => toggleFilterSection('size')}
        >
          <h3 className="font-medium text-ui-fg-base">
            {isRTL ? "الحجم" : "Size"}
          </h3>
          {openFilters.size ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>

        {openFilters.size && (
          <div className="grid grid-cols-3 gap-2">
            {filterOptions.sizes.map(size => (
              <button
                key={size.id}
                onClick={() => handleMultiSelectToggle('sizes', size.id)}
                className={`py-1 px-2 text-sm rounded-md border text-center ${sizes.includes(size.id)
                    ? 'border-ui-fg-interactive bg-ui-bg-highlight text-ui-fg-interactive'
                    : 'border-ui-border-base hover:bg-ui-bg-subtle-hover'
                  }`}
              >
                {size.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Brand Filter */}
      <div className="border-b border-ui-border-base pb-6">
        <button
          className="flex items-center justify-between w-full mb-4"
          onClick={() => toggleFilterSection('brand')}
        >
          <h3 className="font-medium text-ui-fg-base">
            {isRTL ? "العلامة التجارية" : "Brand"}
          </h3>
          {openFilters.brand ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>

        {openFilters.brand && (
          <div className="space-y-3">
            {filterOptions.brands.map(brand => (
              <div key={brand.id} className="flex items-center">
                <input
                  id={`brand-${brand.id}`}
                  type="checkbox"
                  checked={brands.includes(brand.id)}
                  onChange={() => handleMultiSelectToggle('brands', brand.id)}
                  className={`h-4 w-4 rounded border-ui-border-base text-ui-fg-interactive focus:ring-ui-fg-interactive ${isRTL ? 'ml-3' : 'mr-3'
                    }`}
                />
                <label
                  htmlFor={`brand-${brand.id}`}
                  className="text-sm text-ui-fg-subtle"
                >
                  {brand.label}
                </label>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Rating Filter */}
      <div className="border-b border-ui-border-base pb-6">
        <button
          className="flex items-center justify-between w-full mb-4"
          onClick={() => toggleFilterSection('rating')}
        >
          <h3 className="font-medium text-ui-fg-base">
            {isRTL ? "التقييم" : "Rating"}
          </h3>
          {openFilters.rating ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>

        {openFilters.rating && (
          <div className="space-y-3">
            {filterOptions.ratings.map(rating => (
              <div key={rating.id} className="flex items-center">
                <input
                  id={`rating-${rating.id}`}
                  name="rating"
                  type="radio"
                  checked={minRating === rating.id}
                  onChange={() => setQueryParams('rating', rating.id)}
                  className={`h-4 w-4 border-ui-border-base text-ui-fg-interactive focus:ring-ui-fg-interactive ${isRTL ? 'ml-3' : 'mr-3'
                    }`}
                />
                <label
                  htmlFor={`rating-${rating.id}`}
                  className="text-sm text-ui-fg-subtle"
                >
                  {rating.label}
                </label>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Availability Filters */}
      <div className="space-y-4">
        <div className="flex items-center">
          <input
            id="in-stock"
            type="checkbox"
            checked={inStock}
            onChange={(e) => setQueryParams('inStock', e.target.checked.toString())}
            className={`h-4 w-4 rounded border-ui-border-base text-ui-fg-interactive focus:ring-ui-fg-interactive ${isRTL ? 'ml-3' : 'mr-3'
              }`}
          />
          <label
            htmlFor="in-stock"
            className="text-sm text-ui-fg-subtle"
          >
            {isRTL ? "متوفر بالمخزن" : "In Stock Only"}
          </label>
        </div>
        <div className="flex items-center">
          <input
            id="on-sale"
            type="checkbox"
            checked={onSale}
            onChange={(e) => setQueryParams('onSale', e.target.checked.toString())}
            className={`h-4 w-4 rounded border-ui-border-base text-ui-fg-interactive focus:ring-ui-fg-interactive ${isRTL ? 'ml-3' : 'mr-3'
              }`}
          />
          <label
            htmlFor="on-sale"
            className="text-sm text-ui-fg-subtle"
          >
            {isRTL ? "العروض الخاصة" : "On Sale"}
          </label>
        </div>
      </div>

      {/* Apply/Clear buttons for mobile */}
      {isMobile && (
        <div className="flex gap-4 mt-auto pt-4 border-t border-ui-border-base">
          <Button
            variant="primary"
            onClick={() => setMobileFiltersOpen(false)}
            className="flex-1"
          >
            {isRTL ? "تطبيق الفلاتر" : "Apply Filters"}
          </Button>
          <Button
            variant="secondary"
            onClick={clearFilters}
            className="flex-1"
          >
            {isRTL ? "مسح" : "Clear"}
          </Button>
        </div>
      )}
    </div>
  )

  return (
    <>
      {/* Mobile filters button */}
      <MobileFiltersButton />

      {/* Mobile filters drawer */}
      <Drawer
        open={mobileFiltersOpen}
        onOpenChange={setMobileFiltersOpen}
        direction={isRTL ? 'right' : 'left'}
        shouldScaleBackground={true}
        dismissible={true}
        className="z-[1000]"
      >
        <Drawer.Content className={`
    h-[100%] w-full max-w-md 
    bg-white dark:bg-gray-900
    rounded-t-[10px] shadow-2xl
    fixed bottom-0 ${isRTL ? 'right-0' : 'left-0'}
    focus:outline-none
    z-[1000]
    
  `}>

          {/* Scrollable content area */}
          <div className="h-[calc(95%)] overflow-y-auto p-6">
            <FiltersContent />
          </div>

    
        </Drawer.Content>

        {/* Backdrop */}
        {/* <Drawer.Overlay className={`
    fixed inset-0 bg-black/50 
    backdrop-blur-sm
    z-[999]
  `} /> */}
      </Drawer>

      {/* Desktop filters */}
      <div
        className="hidden md:flex flex-col gap-6 w-full small:w-70 max-w-70 p-4 bg-ui-bg-subtle rounded-lg shadow-sm "
        data-testid={dataTestId}
      >
        <FiltersContent />
      </div>
    </>
  )
}

export default RefinementList



// "use client"

// import { usePathname, useRouter, useSearchParams } from "next/navigation"
// import { useCallback } from "react"

// import SortProducts, { SortOptions } from "./sort-products"

// type RefinementListProps = {
//   sortBy: SortOptions
//   search?: boolean
//   'data-testid'?: string
//   locale: string
// }

// const RefinementList = ({ sortBy, 'data-testid': dataTestId, locale }: RefinementListProps) => {
//   const router = useRouter()
//   const pathname = usePathname()
//   const searchParams = useSearchParams()

//   const createQueryString = useCallback(
//     (name: string, value: string) => {
//       const params = new URLSearchParams(searchParams)
//       params.set(name, value)

//       return params.toString()
//     },
//     [searchParams]
//   )

//   const setQueryParams = (name: string, value: string) => {
//     const query = createQueryString(name, value)
//     router.push(`${pathname}?${query}`)
//   }

//   return (
//     <div dir={locale === "ar" ? "rtl" : "ltr"} className="flex small:flex-col gap-12 py-4 mb-8 small:px-0 pl-6 small:min-w-[250px] small:ml-[1.675rem]">
//       <SortProducts locale={locale} sortBy={sortBy} setQueryParams={setQueryParams} data-testid={dataTestId} />
//     </div>
//   )
// }

// export default RefinementList
