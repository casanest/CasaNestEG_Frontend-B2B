"use client"

import { useState, useRef } from "react"
import { ChevronDown } from "lucide-react"
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
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const handleEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    setIsOpen(true)
  }

  const handleLeave = () => {
    timeoutRef.current = setTimeout(() => setIsOpen(false), 150)
  }

  const topCategories = categories.slice(0, 6)

  return (
    <div
      className="relative flex items-center"
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      <LocalizedClientLink
        href="/store"
        className="flex items-center gap-1 text-[16px] font-medium text-black hover:text-[#17284a] transition-colors whitespace-nowrap"
      >
        {isRTL ? "المنتجات" : "Products"}
        <ChevronDown className="w-4 h-4" />
      </LocalizedClientLink>

      {isOpen && (
        <div
          className={`absolute top-full ${isRTL ? "left-0" : "right-0"} mt-2 w-[600px] bg-white shadow-xl rounded-xl border border-gray-100 z-50`}
          onMouseEnter={handleEnter}
        >
          <div className="grid grid-cols-3 gap-6 p-6">
            {topCategories.map((cat) => (
              <div key={cat.id} className="flex flex-col gap-2">
                <LocalizedClientLink
                  href={`/categories/${isRTL ? cat.handle_ar ?? cat.handle_en : cat.handle_en ?? cat.handle_ar}`}
                  className="text-[15px] font-bold text-[#17284a] hover:underline"
                >
                  {isRTL ? cat.name_ar : cat.name_en}
                </LocalizedClientLink>
                {cat.category_children && cat.category_children.length > 0 && (
                  <ul className="flex flex-col gap-1.5">
                    {cat.category_children.slice(0, 5).map((child) => (
                      <li key={child.id}>
                        <LocalizedClientLink
                          href={`/categories/${isRTL ? child.handle_ar ?? child.handle_en : child.handle_en ?? child.handle_ar}`}
                          className="text-[14px] text-gray-600 hover:text-[#17284a] transition-colors"
                        >
                          {isRTL ? child.name_ar : child.name_en}
                        </LocalizedClientLink>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
          <div className="border-t border-gray-100 px-6 py-3">
            <LocalizedClientLink
              href="/store"
              className="text-[14px] font-medium text-[#17284a] hover:underline"
            >
              {isRTL ? "عرض كل المنتجات ←" : "View all products →"}
            </LocalizedClientLink>
          </div>
        </div>
      )}
    </div>
  )
}
