"use client"

import { useState } from "react"
import { Minus, Plus } from "lucide-react"
import { cn } from "@lib/util/cn"

export interface FAQItem {
  id: string
  question: string
  answer: string
  category: string
}

export interface FAQCategory {
  id: string
  label: string
}

interface FAQAccordionProps {
  items: FAQItem[]
  categories: FAQCategory[]
  isRTL: boolean
}

export default function FAQAccordion({ items, categories, isRTL }: FAQAccordionProps) {
  const [activeCategory, setActiveCategory] = useState("all")
  const [openId, setOpenId] = useState<string | null>(items[0]?.id ?? null)

  const filteredItems =
    activeCategory === "all"
      ? items
      : items.filter((item) => item.category === activeCategory)

  const toggleItem = (id: string) => {
    setOpenId(openId === id ? null : id)
  }

  const allCategories: FAQCategory[] = [
    { id: "all", label: isRTL ? "كل الأسئلة" : "All FAQs" },
    ...categories,
  ]

  return (
    <div className="flex flex-col gap-6 items-center w-full">
      {/* Filter Tabs */}
      <div
        className="flex flex-wrap gap-3 items-start justify-center w-full"
        dir={isRTL ? "rtl" : "ltr"}
      >
        {allCategories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => {
              setActiveCategory(cat.id)
              setOpenId(null)
            }}
            className={cn(
              "px-6 py-3 rounded-full text-[16px] font-medium transition-colors whitespace-nowrap",
              activeCategory === cat.id
                ? "bg-[#17284a] text-white font-bold"
                : "bg-[#f3f4f6] text-[#17284a] hover:bg-[#e8e9ec]"
            )}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* FAQ Items */}
      <div className="flex flex-col gap-4 w-full max-w-[820px]">
        {filteredItems.map((item) => {
          const isOpen = openId === item.id
          return (
            <div
              key={item.id}
              className={cn(
                "bg-[#f3f4f6] rounded-[12px] p-6 transition-all",
                isOpen && "gap-4 flex flex-col"
              )}
            >
              <div
                className="flex items-center justify-between w-full cursor-pointer"
                onClick={() => toggleItem(item.id)}
              >
                <p className="flex-1 text-[20px] font-bold leading-[1.5] text-[#17284a] min-w-0">
                  {item.question}
                </p>
                <div className="bg-white flex items-center justify-center p-1 rounded-full shrink-0 w-8 h-8 ms-2">
                  {isOpen ? (
                    <Minus className="w-[18px] h-[18px] text-[#17284a]" />
                  ) : (
                    <Plus className="w-[18px] h-[18px] text-[#17284a]" />
                  )}
                </div>
              </div>
              {isOpen && (
                <p className="text-[16px] leading-[1.6] text-[#5d5d61] w-full">
                  {item.answer}
                </p>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
