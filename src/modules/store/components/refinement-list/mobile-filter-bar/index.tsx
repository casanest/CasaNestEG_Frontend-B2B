"use client"

import { useState } from "react"
import { SlidersHorizontal, ChevronDown } from "lucide-react"
import { clx } from "@medusajs/ui"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"

const sortOptions: { value: SortOptions; labelEn: string; labelAr: string }[] = [
  { value: "created_at", labelEn: "Most Popular", labelAr: "الأكثر شعبية" },
  { value: "price_asc", labelEn: "Price: Low to High", labelAr: "السعر: الأقل إلى الأعلى" },
  { value: "price_desc", labelEn: "Price: High to Low", labelAr: "السعر: الأعلى إلى الأقل" },
]

type MobileFilterBarProps = {
  isRTL: boolean
  sort: SortOptions
  activeFilterCount: number
  onOpenFilters: () => void
}

export default function MobileFilterBar({
  isRTL,
  sort,
  activeFilterCount,
  onOpenFilters,
}: MobileFilterBarProps) {
  const [sortOpen, setSortOpen] = useState(false)

  const currentSort = sortOptions.find((opt) => opt.value === sort) || sortOptions[0]
  const sortLabel = isRTL ? currentSort.labelAr : currentSort.labelEn

  const handleSortChange = (value: SortOptions) => {
    const url = new URL(window.location.href)
    url.searchParams.set("sortBy", value)
    url.searchParams.delete("page")
    window.location.href = url.toString()
  }

  return (
    <div
      dir={isRTL ? "rtl" : "ltr"}
      className="small:hidden flex items-center justify-between gap-3 px-4 py-3 bg-white border-b border-gray-100"
    >
      {/* Filters Button */}
      <button
        type="button"
        onClick={onOpenFilters}
        className="flex items-center gap-2 px-4 h-[37px] rounded-full border border-gray-200 text-sm font-medium text-[#17284a] hover:border-[#17284a] hover:bg-gray-50 transition-all whitespace-nowrap"
      >
        <SlidersHorizontal className="h-4 w-4" />
        <span>{isRTL ? "الفلاتر" : "Filters"}</span>
        {activeFilterCount > 0 && (
          <span className="bg-[#17284a] text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
            {activeFilterCount}
          </span>
        )}
      </button>

      {/* Sort Dropdown */}
      <div className="relative">
        <button
          type="button"
          onClick={() => setSortOpen(!sortOpen)}
          className="flex items-center gap-2 px-4 h-[37px] rounded-full border border-gray-200 text-sm font-medium text-[#17284a] hover:border-[#17284a] hover:bg-gray-50 transition-all whitespace-nowrap"
        >
          <span className="text-[14px]">
            {isRTL ? "ترتيب:" : "Sort by:"} {sortLabel}
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
  )
}
