"use client"

import { useState, useRef, useEffect } from "react"
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { clx } from "@medusajs/ui"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"

type CategoryChip = {
  id: string
  name_en: string
  name_ar: string
  handle_en: string
  handle_ar: string
}

type CategoryChipsBarProps = {
  categories: CategoryChip[]
  currentCategoryId?: string
  isRTL: boolean
  locale: string
  sort: SortOptions
  productCount: number
}

const sortOptions: { value: SortOptions; labelEn: string; labelAr: string }[] = [
  { value: "created_at", labelEn: "Most Popular", labelAr: "الأكثر شعبية" },
  { value: "price_asc", labelEn: "Price: Low to High", labelAr: "السعر: الأقل إلى الأعلى" },
  { value: "price_desc", labelEn: "Price: High to Low", labelAr: "السعر: الأعلى إلى الأقل" },
]

export default function CategoryChipsBar({
  categories,
  currentCategoryId,
  isRTL,
  locale,
  sort,
  productCount,
}: CategoryChipsBarProps) {
  const scrollRef = useRef<HTMLDivElement | null>(null)
  const [showLeftArrow, setShowLeftArrow] = useState(false)
  const [showRightArrow, setShowRightArrow] = useState(false)
  const [sortOpen, setSortOpen] = useState(false)

  const checkScrollArrows = () => {
    const el = scrollRef.current
    if (!el) return
    setShowLeftArrow(el.scrollLeft > 5)
    setShowRightArrow(el.scrollLeft < el.scrollWidth - el.clientWidth - 5)
  }

  useEffect(() => {
    checkScrollArrows()
    const el = scrollRef.current
    if (!el) return
    el.addEventListener("scroll", checkScrollArrows)
    window.addEventListener("resize", checkScrollArrows)
    return () => {
      el.removeEventListener("scroll", checkScrollArrows)
      window.removeEventListener("resize", checkScrollArrows)
    }
  }, [])

  const scrollByAmount = (direction: "left" | "right") => {
    const amount = direction === "left" ? -300 : 300
    const normalized = isRTL ? -amount : amount
    scrollRef.current?.scrollBy({ left: normalized, behavior: "smooth" })
  }

  const handleSortChange = (value: SortOptions) => {
    const url = new URL(window.location.href)
    url.searchParams.set("sortBy", value)
    url.searchParams.delete("page")
    window.location.href = url.toString()
  }

  const currentSortLabel = sortOptions.find((opt) => opt.value === sort) || sortOptions[0]
  const sortLabel = isRTL ? currentSortLabel.labelAr : currentSortLabel.labelEn

  return (
    <div
      dir={isRTL ? "rtl" : "ltr"}
      className="w-full bg-white border-y border-gray-100 top-[128px] z-30"
    >
      <div className="flex items-center gap-4 px-4 sm:px-6 lg:px-[60px] py-4">
        {/* Category Chips - Scrollable */}
        <div className="relative flex-1 min-w-0">
          {/* Left scroll arrow */}
          {showLeftArrow && (
            <button
              type="button"
              onClick={() => scrollByAmount("left")}
              className={clx(
                "absolute top-1/2 -translate-y-1/2 z-10 h-8 w-8 rounded-full bg-white shadow-md border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-all",
                isRTL ? "right-0" : "left-0"
              )}
              aria-label="Scroll left"
            >
              {isRTL ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            </button>
          )}

          {/* Right scroll arrow */}
          {showRightArrow && (
            <button
              type="button"
              onClick={() => scrollByAmount("right")}
              className={clx(
                "absolute top-1/2 -translate-y-1/2 z-10 h-8 w-8 rounded-full bg-white shadow-md border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-all",
                isRTL ? "left-0" : "right-0"
              )}
              aria-label="Scroll right"
            >
              {isRTL ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </button>
          )}

          <div
            ref={scrollRef}
            className="flex items-center gap-2 overflow-x-auto scrollbar-hide py-1"
          >
            {/* All Products chip */}
            <LocalizedClientLink
              href="/store"
              className={clx(
                "flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap",
                !currentCategoryId
                  ? "bg-[#17284a] text-white"
                  : "border border-gray-200 text-[#17284a] hover:border-[#17284a] hover:bg-gray-50"
              )}
            >
              {isRTL ? "كل المنتجات" : "All Products"}
            </LocalizedClientLink>

            {/* Category chips */}
            {categories.map((cat) => {
              const isActive = cat.id === currentCategoryId
              const name = isRTL ? cat.name_ar || cat.name_en : cat.name_en || cat.name_ar
              const handle = isRTL ? cat.handle_ar || cat.handle_en : cat.handle_en || cat.handle_ar

              return (
                <LocalizedClientLink
                  key={cat.id}
                  href={`/categories/${handle}`}
                  className={clx(
                    "flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap",
                    isActive
                      ? "bg-[#17284a] text-white"
                      : "border border-gray-200 text-[#17284a] hover:border-[#17284a] hover:bg-gray-50"
                  )}
                >
                  {name}
                </LocalizedClientLink>
              )
            })}
          </div>
        </div>

        {/* Sort Dropdown - Desktop only */}
        <div className="relative flex-shrink-0 hidden small:block">
          <button
            type="button"
            onClick={() => setSortOpen(!sortOpen)}
            className="flex items-center gap-2 px-4 py-2 rounded-full border border-gray-200 text-sm font-medium text-[#17284a] hover:border-[#17284a] hover:bg-gray-50 transition-all whitespace-nowrap"
          >
            <span className="hidden sm:inline">
              {isRTL ? "ترتيب:" : "Sort by:"} {sortLabel}
            </span>
            <span className="sm:hidden">
              {isRTL ? "ترتيب" : "Sort"}
            </span>
            <ChevronDown className={clx("h-4 w-4 transition-transform", sortOpen && "rotate-180")} />
          </button>

          {sortOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setSortOpen(false)}
              />
              <div
                className={clx(
                  "absolute z-50 mt-2 min-w-[200px] rounded-xl border border-gray-200 bg-white shadow-lg py-2",
                  isRTL ? "left-0" : "right-0"
                )}
              >
                {sortOptions.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => {
                      handleSortChange(opt.value)
                      setSortOpen(false)
                    }}
                    className={clx(
                      "w-full text-left px-4 py-2.5 text-sm font-medium transition-colors",
                      opt.value === sort
                        ? "text-[#17284a] bg-gray-50 font-bold"
                        : "text-gray-600 hover:bg-gray-50 hover:text-[#17284a]"
                    )}
                  >
                    {isRTL ? opt.labelAr : opt.labelEn}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
