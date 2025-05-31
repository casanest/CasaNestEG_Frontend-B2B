"use client"

import { clx } from "@medusajs/ui"
import { useLocale } from "next-intl"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react"

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

  const arrayRange = (start: number, stop: number) =>
    Array.from({ length: stop - start + 1 }, (_, index) => start + index)

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams)
    params.set("page", newPage.toString())
    router.push(`${pathname}?${params.toString()}`)
  }

  const renderPageButton = (p: number, label: string | number, isCurrent: boolean) => (
    <button
      key={p}
      className={clx(
        "flex items-center justify-center w-10 h-10 rounded-full transition-all duration-200",
        {
          "bg-[#043364] text-white dark:bg-gray-100 dark:text-gray-900": isCurrent,
          "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800": !isCurrent,
          "font-medium": isCurrent
        }
      )}
      disabled={isCurrent}
      onClick={() => handlePageChange(p)}
      aria-current={isCurrent ? "page" : undefined}
    >
      {label}
    </button>
  )

  const renderEllipsis = (key: string) => (
    <div key={key} className="flex items-center justify-center w-10 h-10">
      <MoreHorizontal className="w-4 h-4 text-gray-400" />
    </div>
  )

  const renderPageButtons = () => {
    const buttons = []

    // Previous button
    buttons.push(
      <button
        key="prev"
        className={clx(
          "flex items-center justify-center w-10 h-10 rounded-full",
          "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800",
          "transition-all duration-200",
          { "opacity-50 cursor-not-allowed": page === 1 }
        )}
        disabled={page === 1}
        onClick={() => handlePageChange(page - 1)}
        aria-label="Previous page"
      >
        {locale === "ar" ? (
          <ChevronRight className="w-4 h-4" />
        ) : (
          <ChevronLeft className="w-4 h-4" />
        )}
      </button>
    )

    if (totalPages <= 7) {
      buttons.push(
        ...arrayRange(1, totalPages).map((p) =>
          renderPageButton(p, p, p === page)
        )
      )
    } else {
      if (page <= 4) {
        buttons.push(
          ...arrayRange(1, 5).map((p) => renderPageButton(p, p, p === page))
        )
        buttons.push(renderEllipsis("ellipsis1"))
        buttons.push(
          renderPageButton(totalPages, totalPages, totalPages === page)
        )
      } else if (page >= totalPages - 3) {
        buttons.push(renderPageButton(1, 1, 1 === page))
        buttons.push(renderEllipsis("ellipsis2"))
        buttons.push(
          ...arrayRange(totalPages - 4, totalPages).map((p) =>
            renderPageButton(p, p, p === page)
          )
        )
      } else {
        buttons.push(renderPageButton(1, 1, 1 === page))
        buttons.push(renderEllipsis("ellipsis3"))
        buttons.push(
          ...arrayRange(page - 1, page + 1).map((p) =>
            renderPageButton(p, p, p === page)
          )
        )
        buttons.push(renderEllipsis("ellipsis4"))
        buttons.push(
          renderPageButton(totalPages, totalPages, totalPages === page)
        )
      }
    }

    // Next button
    buttons.push(
      <button
        key="next"
        className={clx(
          "flex items-center justify-center w-10 h-10 rounded-full",
          "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800",
          "transition-all duration-200",
          { "opacity-50 cursor-not-allowed": page === totalPages }
        )}
        disabled={page === totalPages}
        onClick={() => handlePageChange(page + 1)}
        aria-label="Next page"
      >
        {locale === "ar" ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
      </button>
    )

    return buttons
  }

  return (
    <div className="flex justify-center w-full mt-12">
      <nav
        className="flex gap-1 items-center"
        data-testid={dataTestid}
        aria-label="Pagination"
      >
        {renderPageButtons()}
      </nav>
    </div>
  )
}



// "use client"

// import { clx } from "@medusajs/ui"
// import { usePathname, useRouter, useSearchParams } from "next/navigation"

// export function Pagination({
//   page,
//   totalPages,
//   'data-testid': dataTestid
// }: {
//   page: number
//   totalPages: number
//   'data-testid'?: string
// }) {
//   const router = useRouter()
//   const pathname = usePathname()
//   const searchParams = useSearchParams()

//   // Helper function to generate an array of numbers within a range
//   const arrayRange = (start: number, stop: number) =>
//     Array.from({ length: stop - start + 1 }, (_, index) => start + index)

//   // Function to handle page changes
//   const handlePageChange = (newPage: number) => {
//     const params = new URLSearchParams(searchParams)
//     params.set("page", newPage.toString())
//     router.push(`${pathname}?${params.toString()}`)
//   }

//   // Function to render a page button
//   const renderPageButton = (
//     p: number,
//     label: string | number,
//     isCurrent: boolean
//   ) => (
//     <button
//       key={p}
//       className={clx("txt-xlarge-plus text-ui-fg-muted", {
//         "text-ui-fg-base hover:text-ui-fg-subtle": isCurrent,
//       })}
//       disabled={isCurrent}
//       onClick={() => handlePageChange(p)}
//     >
//       {label}
//     </button>
//   )

//   // Function to render ellipsis
//   const renderEllipsis = (key: string) => (
//     <span
//       key={key}
//       className="txt-xlarge-plus text-ui-fg-muted items-center cursor-default"
//     >
//       ...
//     </span>
//   )

//   // Function to render page buttons based on the current page and total pages
//   const renderPageButtons = () => {
//     const buttons = []

//     if (totalPages <= 7) {
//       // Show all pages
//       buttons.push(
//         ...arrayRange(1, totalPages).map((p) =>
//           renderPageButton(p, p, p === page)
//         )
//       )
//     } else {
//       // Handle different cases for displaying pages and ellipses
//       if (page <= 4) {
//         // Show 1, 2, 3, 4, 5, ..., lastpage
//         buttons.push(
//           ...arrayRange(1, 5).map((p) => renderPageButton(p, p, p === page))
//         )
//         buttons.push(renderEllipsis("ellipsis1"))
//         buttons.push(
//           renderPageButton(totalPages, totalPages, totalPages === page)
//         )
//       } else if (page >= totalPages - 3) {
//         // Show 1, ..., lastpage - 4, lastpage - 3, lastpage - 2, lastpage - 1, lastpage
//         buttons.push(renderPageButton(1, 1, 1 === page))
//         buttons.push(renderEllipsis("ellipsis2"))
//         buttons.push(
//           ...arrayRange(totalPages - 4, totalPages).map((p) =>
//             renderPageButton(p, p, p === page)
//           )
//         )
//       } else {
//         // Show 1, ..., page - 1, page, page + 1, ..., lastpage
//         buttons.push(renderPageButton(1, 1, 1 === page))
//         buttons.push(renderEllipsis("ellipsis3"))
//         buttons.push(
//           ...arrayRange(page - 1, page + 1).map((p) =>
//             renderPageButton(p, p, p === page)
//           )
//         )
//         buttons.push(renderEllipsis("ellipsis4"))
//         buttons.push(
//           renderPageButton(totalPages, totalPages, totalPages === page)
//         )
//       }
//     }

//     return buttons
//   }

//   // Render the component
//   return (
//     <div className="flex justify-center w-full mt-12">
//       <div className="flex gap-3 items-end" data-testid={dataTestid}>{renderPageButtons()}</div>
//     </div>
//   )
// }
