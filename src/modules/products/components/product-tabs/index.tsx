"use client"

import { useState } from "react"
import { useLocale } from "next-intl"
import { FileText } from "lucide-react"

type SpecItem = {
  label: string
  value: string
}

type ProductTabsProps = {
  specs: SpecItem[]
  description: string
  documentUrl?: string | null
}

const ProductTabs = ({ specs, description, documentUrl }: ProductTabsProps) => {
  const locale = useLocale()
  const isRTL = locale === "ar"
  const [activeTab, setActiveTab] = useState<"specs" | "description" | "documents">("specs")

  const tabs = [
    { id: "specs" as const, label: isRTL ? "المواصفات" : "Specs" },
    { id: "description" as const, label: isRTL ? "الوصف" : "Description" },
    { id: "documents" as const, label: isRTL ? "المستندات" : "Documents" },
  ]

  const visibleSpecs = specs.filter(
    (spec) => typeof spec.value === "string" && spec.value.trim() !== "-"
  )

  return (
    <div className="w-full">
      {/* Tab Header */}
      <div className="flex items-start border-b border-[#e5e7eb] w-full">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-5 pt-2.5 pb-3 text-[14px] font-bold leading-[1.5] transition-colors ${
              activeTab === tab.id
                ? "text-[#17284a] border-b-[3px] border-[#17284a]"
                : "text-[#707176] hover:text-[#17284a]"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="pt-[24px]">
        {activeTab === "specs" && (
          <div className="flex flex-col">
            {visibleSpecs.length > 0 ? (
              visibleSpecs.map((spec, i) => (
                <div
                  key={spec.label}
                  className={`flex items-center justify-between gap-4 px-4 py-3.5 min-h-[49px] ${
                    i % 2 === 0 ? "bg-[#f8f9fa]" : "bg-white"
                  }`}
                >
                  <span className="text-[14px] font-medium text-[#5d5d61]">
                    {spec.label}
                  </span>
                  <span className="text-[14px] font-medium text-[#1c1b1c] text-right">
                    {spec.value}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-[14px] text-[#707176] py-4">
                {isRTL ? "لا توجد مواصفات متاحة" : "No specifications available"}
              </p>
            )}
          </div>
        )}

        {activeTab === "description" && (
          <div className="py-2">
            {description ? (
              <p className="text-[14px] leading-[1.5] text-[#5d5d61] whitespace-pre-line">
                {description}
              </p>
            ) : (
              <p className="text-[14px] text-[#707176]">
                {isRTL ? "لا يوجد وصف متاح" : "No description available"}
              </p>
            )}
          </div>
        )}

        {activeTab === "documents" && (
          <div className="py-2">
            {documentUrl ? (
              <a
                href={documentUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-[14px] font-medium text-[#17284a] hover:underline"
              >
                <FileText className="w-4 h-4 text-[#17284a]" />
                {isRTL ? "تحميل المستند" : "Download Document"}
              </a>
            ) : (
              <p className="text-[14px] text-[#707176]">
                {isRTL ? "لا توجد مستندات متاحة" : "No documents available"}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default ProductTabs
