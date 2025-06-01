import React, { Fragment, useCallback, useEffect, useState } from "react"

import { cn } from "@lib/util/cn"
import { StoreProduct } from "@medusajs/types"
import { Box } from "@modules/common/components/box"
import { Container } from "@modules/common/components/container"
import { Text } from "@modules/common/components/text"

import { ControlledSearchBox } from "../search-box"
import { RecentSearches } from "./recent-searches"
import { RecommendedItem } from "./recommended-item"
import { useLocale } from 'next-intl'

type SearchDropdownProps = {
  isOpen: boolean
  setIsOpen: (value: boolean) => void
  countryCode: string
  recommendedProducts: StoreProduct[]
}

export default function SearchDropdown({
  isOpen,
  setIsOpen,
  countryCode,
  recommendedProducts,
}: SearchDropdownProps) {
  const locale = useLocale()
  const isRtl = locale === 'ar'
  const [delayClose, setDelayClose] = useState<ReturnType<typeof setTimeout> | null>(null)

  const handleMouseEnter = useCallback(() => {
    if (delayClose) clearTimeout(delayClose)
    setIsOpen(true)
  }, [delayClose, setIsOpen])

  const handleMouseLeave = useCallback(() => {
    const timeout = setTimeout(() => setIsOpen(false), 500)
    setDelayClose(timeout)
  }, [setIsOpen])

  useEffect(() => {
    return () => {
      if (delayClose) clearTimeout(delayClose)
    }
  }, [delayClose])

  return (
    <div
      dir={isRtl ? 'rtl' : 'ltr'}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={cn(
        "bg-white w-full h-full pt-2 z-1000",
        "large:absolute large:left-1/2 large:top-4 large:z-30 large:-translate-x-1/2"
      )}
    >
      <ControlledSearchBox
        countryCode={countryCode}
        open={isOpen}
        closeSearch={() => setIsOpen(false)}
      />

      <Box
        dir={isRtl ? 'rtl' : 'ltr'}
        aria-hidden={!isOpen}
        className={cn(
          "absolute left-0 top-full z-50 w-full bg-white shadow-lg transition-all duration-300",
          isOpen
            ? "opacity-100 pointer-events-auto visible translate-y-0"
            : "opacity-0 pointer-events-none invisible"
        )}
      >
        <Container className="flex gap-4 px-14 pt-5 pb-8">
          {/* Recent Searches */}
          <Box className="flex flex-col w-[326px]">
            <Box className="flex items-center h-[62px]">
              <Text as="h3" size="md" className="text-secondary text-[20px] font-medium">
                {isRtl ? "البحث الأخير" : "Recent Searches"}
              </Text>
            </Box>
            <RecentSearches handleOpenDialogChange={setIsOpen} />
          </Box>

          {/* Recommended Items */}
          <Box className="flex-1">
            <Box className="flex items-center h-[62px]">
              <Text as="h3" size="md" className="text-secondary text-[20px] font-medium">
                {isRtl ? "المنتجات المقترحة" : "Recommended products"}
              </Text>
            </Box>
            <Box className="grid gap-3 xl:grid-cols-2">
              {recommendedProducts.map((item, index) => (
                <Fragment key={item.id ?? index}>
                  <RecommendedItem item={item} handleOpenDialogChange={setIsOpen} />
                </Fragment>
              ))}
            </Box>
          </Box>
        </Container>
      </Box>
    </div>
  )
}
