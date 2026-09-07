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
  const visibleSpecs = specs.filter(
    (spec) => typeof spec.value === "string" && spec.value.trim() !== "-"
  )

  const hasSpecs = visibleSpecs.length > 0
  const hasDocuments = !!documentUrl

  const tabs = [
    { id: "description" as const, label: isRTL ? "الوصف" : "Description" },
    ...(hasSpecs ? [{ id: "specs" as const, label: isRTL ? "المواصفات" : "Specs" }] : []),
    ...(hasDocuments ? [{ id: "documents" as const, label: isRTL ? "المستندات" : "Documents" }] : []),
  ]

  const [activeTab, setActiveTab] = useState<"specs" | "description" | "documents">("description")

  return (
    <div className="w-full">
      {/* Tab Header */}
      <div className="flex items-start border-b border-[#e5e7eb] w-full">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-[16px] pt-[10px] pb-[12px] text-[14px] leading-[1.5] transition-colors ${
              activeTab === tab.id
                ? "font-bold text-[#17284a] border-b-[3px] border-[#17284a]"
                : "font-medium text-[#707176] hover:text-[#17284a]"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="pt-[16px] lg:pt-[clamp(16px,1.8vw,24px)]">
        {activeTab === "specs" && hasSpecs && (
          <div className="flex flex-col">
            <div className="border border-[#e5e7eb] rounded-[8px] overflow-hidden">
              {visibleSpecs.map((spec, i) => (
                <div
                  key={spec.label}
                  className={`flex items-center justify-between gap-4 px-[16px] py-[12px] ${
                    i < visibleSpecs.length - 1 ? "border-b border-[#e5e7eb]" : ""
                  } ${
                    i % 2 === 0 ? "bg-[#f8f9fa]" : "bg-white"
                  }`}
                >
                  <span className="text-[14px] font-medium text-[#707176]">
                    {spec.label}
                  </span>
                  <span className="text-[14px] font-bold text-[#17284a] text-right">
                    {spec.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "description" && (
          <div className="py-2">
            {description ? (
              <p className="text-[14px] leading-[1.5] text-[#5d5d61] whitespace-pre-line">
                {description.replace(/^[\s\u200e\u200f\u202a-\u202e]*[-*‣◦▪●◆■□►▶○◇∙⋅‧–—]/gm, "•")}
              </p>
            ) : (
              <p className="text-[14px] text-[#707176]">
                {isRTL ? "لا يوجد وصف متاح" : "No description available"}
              </p>
            )}
          </div>
        )}

        {activeTab === "documents" && hasDocuments && (
          <div className="py-2">
            <a
              href={documentUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-[14px] font-medium text-[#17284a] hover:underline"
            >
              <FileText className="w-4 h-4 text-[#17284a]" />
              {isRTL ? "تحميل المستند" : "Download Document"}
            </a>
          </div>
        )}
      </div>
    </div>
  )
}

export default ProductTabs
