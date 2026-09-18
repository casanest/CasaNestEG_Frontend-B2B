"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { Search, X, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useLocale } from "next-intl"
import { cn } from "@lib/util/cn"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { searchAutocomplete } from "@modules/search/autocomplete-actions"
import { SearchedProduct } from "types/global"

type SearchBarProps = {
  variant?: "desktop" | "mobile"
  onResultSelect?: () => void
}

function MorphingIcon({ expanded }: { expanded: boolean }) {
  return (
    <div className="relative w-5 h-5 flex items-center justify-center">
      <Search
        className={cn(
          "absolute w-5 h-5 transition-all duration-300 ease-in-out text-[#17284a]",
          expanded ? "opacity-0 -rotate-90 scale-50" : "opacity-100 rotate-0 scale-100"
        )}
      />
      <X
        className={cn(
          "absolute w-5 h-5 transition-all duration-300 ease-in-out text-[#cdd6e9]",
          expanded ? "opacity-100 rotate-0 scale-100" : "opacity-0 rotate-90 scale-50"
        )}
      />
    </div>
  )
}

export default function SearchBar({ variant = "desktop", onResultSelect }: SearchBarProps) {
  const locale = useLocale()
  const isRTL = locale === "ar"
  const router = useRouter()

  const [isExpanded, setIsExpanded] = useState(variant === "mobile")
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<SearchedProduct[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isFocused, setIsFocused] = useState(false)

  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const placeholder = isRTL ? "ابحث عن المنتجات..." : "Search products..."

  const performSearch = useCallback(
    async (q: string) => {
      if (q.trim().length < 2) {
        setResults([])
        setIsLoading(false)
        return
      }
      setIsLoading(true)
      const hits = await searchAutocomplete(q, 6)
      setResults(hits)
      setIsLoading(false)
    },
    []
  )

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setQuery(val)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    if (val.trim().length < 2) {
      setResults([])
      setIsLoading(false)
      return
    }
    setIsLoading(true)
    debounceRef.current = setTimeout(() => {
      performSearch(val)
    }, 300)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      if (query.trim()) {
        if (variant === "mobile" && onResultSelect) onResultSelect()
        router.push(`/results/${encodeURIComponent(query.trim())}`)
      }
    } else if (e.key === "Escape") {
      if (variant === "mobile") {
        setQuery("")
        setResults([])
        inputRef.current?.blur()
      } else {
        collapse()
      }
    }
  }

  const collapse = () => {
    setIsExpanded(false)
    setIsFocused(false)
    setQuery("")
    setResults([])
  }

  const handleExpand = () => {
    setIsExpanded(true)
    setIsFocused(true)
    setTimeout(() => inputRef.current?.focus(), 50)
  }

  const handleResultClick = () => {
    if (variant === "mobile" && onResultSelect) onResultSelect()
    if (variant === "mobile") {
      setQuery("")
      setResults([])
    } else {
      collapse()
    }
  }

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        if (variant === "desktop") {
          collapse()
        } else {
          setIsFocused(false)
        }
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [variant])

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [])

  const showDropdown = isFocused && query.trim().length >= 2

  const renderDropdown = (widthClass: string) => {
    if (!showDropdown) return null
    return (
      <div
        className={cn(
          "search-dropdown-panel absolute top-full mt-2 bg-white border border-slate-200 rounded-2xl shadow-[0px_12px_32px_0px_rgba(0,0,0,0.08)] overflow-hidden z-50",
          isRTL ? "right-0" : "left-0",
          widthClass
        )}
      >
        {isLoading ? (
          <div className="flex items-center justify-center py-6">
            <Loader2 className="w-5 h-5 text-slate-300 animate-spin" />
          </div>
        ) : results.length > 0 ? (
          <>
            {results.map((product) => {
              const localizedTitle =
                (isRTL && product.metadata?.localizations?.ar?.title) ||
                product.title
              return (
                <LocalizedClientLink
                  key={product.id}
                  href={`/products/${product.handle}`}
                  onClick={handleResultClick}
                  className="flex items-center gap-3 px-3 py-2.5 hover:bg-slate-50 transition-colors"
                >
                  <div className="w-[52px] h-[52px] rounded-lg overflow-hidden bg-slate-100 shrink-0">
                    {product.thumbnail ? (
                      <img src={product.thumbnail} alt={localizedTitle} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-[12px] text-slate-300">{localizedTitle?.charAt(0)}</span>
                      </div>
                    )}
                  </div>
                  <span className="text-[14px] text-[#17284a] truncate flex-1">{localizedTitle}</span>
                </LocalizedClientLink>
              )
            })}
            <LocalizedClientLink
              href={`/results/${encodeURIComponent(query.trim())}`}
              onClick={handleResultClick}
              className="block px-3 py-3 text-[13px] font-medium text-[#17284a] hover:bg-slate-50 transition-colors border-t border-slate-200"
            >
              {isRTL ? `عرض كل نتائج "${query.trim()}"` : `View all results for "${query.trim()}"`}
            </LocalizedClientLink>
          </>
        ) : (
          <div className="px-3 py-6 text-center text-[14px] text-slate-400">
            {isRTL ? "لا توجد نتائج" : "No results found"}
          </div>
        )}
      </div>
    )
  }

  if (variant === "mobile") {
    return (
      <div ref={containerRef} className="relative w-full px-4 pb-2">
        <div
          className="search-bar relative flex items-center h-[50px] rounded-full border-2 overflow-hidden transition-all duration-500 ease-in-out search-bar-expanded w-full border-[#cdd6e9] bg-white"
          dir={isRTL ? "rtl" : "ltr"}
        >
          <div className="flex items-center justify-center w-[50px] h-[50px] shrink-0">
            <Search className="w-5 h-5 text-[#17284a]" />
          </div>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsFocused(true)}
            placeholder={placeholder}
            dir={isRTL ? "rtl" : "ltr"}
            className={cn(
              "flex-1 min-w-0 bg-transparent border-none outline-none text-[14px] text-[#17284a] placeholder:text-slate-400",
              isRTL ? "pl-4" : "pr-4"
            )}
          />
        </div>
        {renderDropdown("left-4 right-4")}
      </div>
    )
  }

  return (
    <div ref={containerRef} className="relative flex items-center shrink-0">
      <div
        className={cn(
          "search-bar relative flex items-center h-[50px] rounded-full border-2 overflow-hidden transition-all duration-500 ease-in-out",
          isExpanded ? "search-bar-expanded border-[#cdd6e9] bg-white" : "border-transparent bg-transparent"
        )}
        style={{
          width: isExpanded ? "320px" : "50px",
        }}
        dir={isRTL ? "rtl" : "ltr"}
      >
        <button
          onClick={isExpanded ? collapse : handleExpand}
          className="flex items-center justify-center w-[50px] h-[50px] shrink-0"
          aria-label={isExpanded ? (isRTL ? "إغلاق" : "Close") : (isRTL ? "بحث" : "Search")}
        >
          <MorphingIcon expanded={isExpanded} />
        </button>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          placeholder={placeholder}
          dir={isRTL ? "rtl" : "ltr"}
          className={cn(
            "flex-1 min-w-0 bg-transparent border-none outline-none text-[14px] text-[#17284a] placeholder:text-slate-400",
            isRTL ? "pl-4" : "pr-4"
          )}
          style={{
            opacity: isExpanded ? 1 : 0,
            transition: "opacity 0.3s ease 0.15s",
          }}
        />
      </div>
      {renderDropdown("w-[320px]")}
    </div>
  )
}
