"use client"

import { clx } from "@medusajs/ui"
import { useLocale } from "next-intl"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { ChevronLeft, ChevronRight } from "lucide-react"

export function Pagination({
  page,
  totalPages,
  'data-testid': dataTestid
}: {
  page: number
  totalPages: number
  'data-testid'?: string
}) {
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const isRTL = locale === "ar"

  if (totalPages <= 1) return null

  const createPageUrl = (pageNumber: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set("page", pageNumber.toString())
    return `${pathname}?${params.toString()}`
  }

  const navigateToPage = (pageNumber: number) => {
    if (pageNumber < 1 || pageNumber > totalPages) return
    router.push(createPageUrl(pageNumber))
  }

  const renderPageButton = (pageNumber: number, label: string | number, isCurrent: boolean = false) => (
    <button
      key={pageNumber}
      onClick={() => navigateToPage(pageNumber)}
      disabled={isCurrent}
      className={clx(
        "min-w-[40px] h-10 flex items-center justify-center px-4 py-2.5 rounded-[8px] text-[15px] transition-all",
        isCurrent
          ? "bg-[#17284a] text-white font-bold cursor-default"
          : "border border-[#e5e7eb] text-[#17284a] font-normal hover:bg-gray-50"
      )}
      aria-current={isCurrent ? "page" : undefined}
      aria-label={`${isCurrent ? 'Current page' : 'Go to page'} ${pageNumber}`}
    >
      {label}
    </button>
  )

  const renderEllipsis = (key: string) => (
    <div key={key} className="flex items-center justify-center min-w-[40px] h-10">
      <span className="text-[15px] text-[#707176]">...</span>
    </div>
  )

  const renderPaginationItems = () => {
    const items = []
    const showEllipsis = totalPages > 7

    if (!showEllipsis) {
      // Show all pages if total pages <= 7
      for (let i = 1; i <= totalPages; i++) {
        items.push(renderPageButton(i, i, i === page))
      }
    } else {
      // Complex pagination logic for many pages
      if (page <= 4) {
        // Show: 1 2 3 4 5 ... last
        for (let i = 1; i <= 5; i++) {
          items.push(renderPageButton(i, i, i === page))
        }
        items.push(renderEllipsis("ellipsis-end"))
        items.push(renderPageButton(totalPages, totalPages, totalPages === page))
      } else if (page >= totalPages - 3) {
        // Show: 1 ... last-4 last-3 last-2 last-1 last
        items.push(renderPageButton(1, 1, 1 === page))
        items.push(renderEllipsis("ellipsis-start"))
        for (let i = totalPages - 4; i <= totalPages; i++) {
          items.push(renderPageButton(i, i, i === page))
        }
      } else {
        // Show: 1 ... prev current next ... last
        items.push(renderPageButton(1, 1, 1 === page))
        items.push(renderEllipsis("ellipsis-start"))
        for (let i = page - 1; i <= page + 1; i++) {
          items.push(renderPageButton(i, i, i === page))
        }
        items.push(renderEllipsis("ellipsis-end"))
        items.push(renderPageButton(totalPages, totalPages, totalPages === page))
      }
    }

    return items
  }

  return (
    <nav
      className="flex justify-center items-center gap-2 mt-12 mb-8"
      data-testid={dataTestid}
      aria-label="Pagination"
    >
      {/* Previous Button - Figma pill style */}
      <button
        onClick={() => navigateToPage(page - 1)}
        disabled={page === 1}
        className={clx(
          "w-12 h-12 flex items-center justify-center rounded-[100px] border border-[#e5e7eb] bg-white transition-all",
          page === 1 ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-50"
        )}
        aria-label="Go to previous page"
      >
        {isRTL ? <ChevronRight className="w-6 h-6 text-[#17284a]" /> : <ChevronLeft className="w-6 h-6 text-[#17284a]" />}
      </button>

      {/* Page Numbers */}
      <div className="hidden sm:flex items-center gap-2">
        {renderPaginationItems()}
      </div>

      {/* Mobile: Simple current page indicator */}
      <div className="sm:hidden flex items-center gap-2 px-3">
        <span className="text-[15px] text-[#707176]">
          {page} {isRTL ? "من" : "of"} {totalPages}
        </span>
      </div>

      {/* Next Button - Figma pill style */}
      <button
        onClick={() => navigateToPage(page + 1)}
        disabled={page === totalPages}
        className={clx(
          "w-12 h-12 flex items-center justify-center rounded-[100px] bg-[#17284a] transition-all",
          page === totalPages ? "opacity-50 cursor-not-allowed" : "hover:bg-[#1f3158]"
        )}
        aria-label="Go to next page"
      >
        {isRTL ? <ChevronLeft className="w-6 h-6 text-white" /> : <ChevronRight className="w-6 h-6 text-white" />}
      </button>
    </nav>
  )
}
