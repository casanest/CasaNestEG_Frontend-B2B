"use client"

import { clx } from "@medusajs/ui"
import { useLocale } from "next-intl"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react"
import { Button } from "@medusajs/ui"

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
    router.push(createPageUrl(pageNumber))
  }

  const renderPageButton = (pageNumber: number, label: string | number, isCurrent: boolean = false) => (
    <Button
      key={pageNumber}
      variant={isCurrent ? "primary" : "secondary"}
      size="small"
      onClick={() => navigateToPage(pageNumber)}
      disabled={isCurrent}
      className={clx(
        "min-w-[40px] h-10 flex items-center justify-center",
        {
          "bg-ui-bg-interactive text-ui-fg-on-inverted": isCurrent,
          "hover:bg-ui-bg-subtle-hover": !isCurrent
        }
      )}
      aria-current={isCurrent ? "page" : undefined}
      aria-label={`${isCurrent ? 'Current page' : 'Go to page'} ${pageNumber}`}
    >
      {label}
    </Button>
  )

  const renderEllipsis = (key: string) => (
    <div key={key} className="flex items-center justify-center min-w-[40px] h-10">
      <MoreHorizontal className="w-4 h-4 text-ui-fg-muted" />
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
      className="flex justify-center items-center gap-2 mt-12"
      data-testid={dataTestid}
      aria-label="Pagination"
    >
      {/* Previous Button */}
      <Button
        variant="secondary"
        size="small"
        onClick={() => navigateToPage(page - 1)}
        disabled={page === 1}
        className={clx(
          "min-w-[40px] h-10 flex items-center justify-center",
          {
            "opacity-50 cursor-not-allowed": page === 1
          }
        )}
        aria-label="Go to previous page"
      >
        {isRTL ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
      </Button>

      {/* Page Numbers */}
      <div className="hidden sm:flex items-center gap-1">
        {renderPaginationItems()}
      </div>

      {/* Mobile: Simple current page indicator */}
      <div className="sm:hidden flex items-center gap-2 px-3">
        <span className="text-sm text-ui-fg-subtle">
          {page} {isRTL ? "من" : "of"} {totalPages}
        </span>
      </div>

      {/* Next Button */}
      <Button
        variant="secondary"
        size="small"
        onClick={() => navigateToPage(page + 1)}
        disabled={page === totalPages}
        className={clx(
          "min-w-[40px] h-10 flex items-center justify-center",
          {
            "opacity-50 cursor-not-allowed": page === totalPages
          }
        )}
        aria-label="Go to next page"
      >
        {isRTL ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
      </Button>
      </nav>
  )
}
