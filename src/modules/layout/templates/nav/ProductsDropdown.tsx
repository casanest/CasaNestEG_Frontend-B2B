"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { ChevronDown, ChevronRight, ArrowRight } from "lucide-react"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { useLocale } from "next-intl"

interface CategoryChild {
  id: string
  name_en: string
  name_ar: string
  handle_en: string
  handle_ar: string
  category_children: CategoryChild[]
}

interface Category {
  id: string
  name_en: string
  name_ar: string
  description_en?: string
  description_ar?: string
  handle_en: string
  handle_ar: string
  image_url: string | null
  category_children: CategoryChild[]
}

export default function ProductsDropdown({
  categories,
}: {
  categories: Category[]
}) {
  const locale = useLocale()
  const isRTL = locale === "ar"
  const [isOpen, setIsOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)
  const [dropdownLeft, setDropdownLeft] = useState<number | null>(null)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const handleEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    setIsOpen(true)
  }

  const handleLeave = () => {
    timeoutRef.current = setTimeout(() => setIsOpen(false), 150)
  }

  const updatePosition = useCallback(() => {
    if (!containerRef.current) return

    const rect = containerRef.current.getBoundingClientRect()
    const viewportWidth = window.innerWidth
    const margin = 16
    const dropdownWidth = Math.min(820, viewportWidth - margin * 2)

    let dropdownLeftInViewport: number

    if (isRTL) {
      // RTL: prefer left-aligning dropdown with trigger's left edge
      dropdownLeftInViewport = rect.left
      if (dropdownLeftInViewport + dropdownWidth > viewportWidth - margin) {
        dropdownLeftInViewport = viewportWidth - margin - dropdownWidth
      }
      if (dropdownLeftInViewport < margin) {
        dropdownLeftInViewport = margin
      }
    } else {
      // LTR: prefer right-aligning dropdown with trigger's right edge
      dropdownLeftInViewport = rect.right - dropdownWidth
      if (dropdownLeftInViewport < margin) {
        dropdownLeftInViewport = margin
      }
      if (dropdownLeftInViewport + dropdownWidth > viewportWidth - margin) {
        dropdownLeftInViewport = viewportWidth - margin - dropdownWidth
      }
    }

    // Convert viewport position to offset relative to container's left edge
    setDropdownLeft(dropdownLeftInViewport - rect.left)
  }, [isRTL])

  useEffect(() => {
    if (!isOpen) return
    updatePosition()
    window.addEventListener("resize", updatePosition)
    window.addEventListener("scroll", updatePosition, true)
    return () => {
      window.removeEventListener("resize", updatePosition)
      window.removeEventListener("scroll", updatePosition, true)
    }
  }, [isOpen, updatePosition])

  const topCategories = categories.slice(0, 7)
  const activeCategory = topCategories[activeIndex]
  const activeChildren = activeCategory?.category_children ?? []
  const activeDescription = isRTL
    ? activeCategory?.description_ar || activeCategory?.description_en || ""
    : activeCategory?.description_en || activeCategory?.description_ar || ""

  const getCatHandle = (cat: Category | CategoryChild) =>
    isRTL ? cat.handle_ar ?? cat.handle_en : cat.handle_en ?? cat.handle_ar

  const getCatName = (cat: Category | CategoryChild) =>
    isRTL ? cat.name_ar ?? cat.name_en : cat.name_en ?? cat.name_ar

  return (
    <div
      ref={containerRef}
      className="relative flex items-center"
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      <LocalizedClientLink
        href="/store"
        className="flex items-center gap-1 text-[16px] font-medium text-black hover:text-[#17284a] transition-colors whitespace-nowrap"
      >
        {isRTL ? "الأنظمة والتجهيزات" : "Products & Systems"}
        <ChevronDown className="w-4 h-4" />
      </LocalizedClientLink>

      {isOpen && (
        <div
          className="absolute top-full mt-2 z-50"
          style={dropdownLeft !== null ? { left: `${dropdownLeft}px` } : undefined}
          onMouseEnter={handleEnter}
        >
          <div
            className="flex gap-[24px] bg-white border border-[#e5e7eb] rounded-[24px] p-[20px] shadow-[0px_12px_32px_0px_rgba(0,0,0,0.06)]"
            style={{ width: "min(820px, calc(100vw - 32px))", minHeight: "auto" }}
          >
            {/* Left Panel — Category List */}
            <div className="flex flex-col gap-[8px] w-[clamp(200px,35%,280px)] shrink-0">
              {topCategories.map((cat, idx) => {
                const isActive = idx === activeIndex
                return (
                  <div
                    key={cat.id}
                    className={`flex items-center justify-between px-[12px] py-[8px] rounded-[8px] cursor-pointer transition-colors min-h-[60px] ${
                      isActive
                        ? "bg-[#f8f9fa] border border-[#fdb022]"
                        : "border border-transparent hover:bg-[#f8f9fa]"
                    }`}
                    onMouseEnter={() => setActiveIndex(idx)}
                  >
                    <div className="flex items-center gap-[16px] flex-1 min-w-0">
                      <div
                        className={`size-[44px] rounded-[4px] overflow-hidden shrink-0 ${
                          isActive
                            ? "border-2 border-[#fdb022]"
                            : "border border-[#e5e7eb]"
                        }`}
                      >
                        {cat.image_url ? (
                          <img
                            src={cat.image_url}
                            alt={getCatName(cat)}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-[#f3f4f6] flex items-center justify-center">
                            <span className="text-[20px] font-bold text-[#cdd6e9]">
                              {getCatName(cat).charAt(0)}
                            </span>
                          </div>
                        )}
                      </div>
                      <span
                        className={`text-[16px] leading-[1.3] ${
                          isActive
                            ? "font-bold text-[#17284a]"
                            : "font-medium text-[#17284a]"
                        }`}
                      >
                        {getCatName(cat)}
                      </span>
                    </div>
                    <ChevronRight
                      className={`size-[20px] shrink-0 ${
                        isActive ? "text-[#fdb022]" : "text-[#cdd6e9]"
                      }`}
                    />
                  </div>
                )
              })}
            </div>

            {/* Right Panel — Subcategory Tabs + Promo Card */}
            <div className="flex flex-col gap-[24px] flex-1">
              {/* Subcategory Tabs Grid */}
              {activeChildren.length > 0 && (
                <div className="flex flex-col gap-[12px]">
                  {Array.from({
                    length: Math.ceil(activeChildren.length / 2),
                  }).map((_, rowIdx) => {
                    const leftChild = activeChildren[rowIdx * 2]
                    const rightChild = activeChildren[rowIdx * 2 + 1]
                    return (
                      <div key={rowIdx} className="flex gap-[12px]">
                        {leftChild && (
                          <LocalizedClientLink
                            href={`/categories/${getCatHandle(leftChild)}`}
                            className="flex-1 min-h-[44px] flex items-center px-[12px] py-[8px] rounded-[8px] bg-[#f3f4f6] hover:bg-[#cdd6e9] transition-colors"
                          >
                            <span className="text-[14px] font-bold text-[#17284a] leading-[1.3]">
                              {getCatName(leftChild)}
                            </span>
                          </LocalizedClientLink>
                        )}
                        {rightChild && (
                          <LocalizedClientLink
                            href={`/categories/${getCatHandle(rightChild)}`}
                            className="flex-1 min-h-[44px] flex items-center px-[12px] py-[8px] rounded-[8px] bg-[#f3f4f6] hover:bg-[#cdd6e9] transition-colors"
                          >
                            <span className="text-[14px] font-bold text-[#17284a] leading-[1.3]">
                              {getCatName(rightChild)}
                            </span>
                          </LocalizedClientLink>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}

              {/* Promo Card */}
              {activeCategory && (
                <LocalizedClientLink
                  href={`/categories/${getCatHandle(activeCategory)}`}
                  className="flex gap-[16px] min-h-[210px] items-center p-[12px] bg-[#f8f9fa] border border-[#e5e7eb] rounded-[20px] hover:border-[#fdb022] transition-colors w-full"
                >
                  <div className="h-full w-[clamp(120px,40%,178px)] rounded-[16px] overflow-hidden shrink-0">
                    {activeCategory.image_url ? (
                      <img
                        src={activeCategory.image_url}
                        alt={getCatName(activeCategory)}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-[#cdd6e9]" />
                    )}
                  </div>
                  <div className="flex flex-col gap-[12px] flex-1 min-w-0">
                    <p className="text-[20px] font-bold leading-[1.4] text-[#17284a]">
                      {getCatName(activeCategory)}
                    </p>
                    {activeDescription && (
                      <p className="text-[14px] font-medium leading-[1.5] text-[#707176] line-clamp-3">
                        {activeDescription}
                      </p>
                    )}
                    <div className="flex items-center gap-[8px]">
                      <span className="text-[16px] font-bold text-[#966109]">
                        {isRTL ? "تسوق الكل" : "Shop All"}
                      </span>
                      <ArrowRight
                        className={`size-[18px] text-[#966109] ${
                          isRTL ? "rotate-180" : ""
                        }`}
                      />
                    </div>
                  </div>
                </LocalizedClientLink>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
