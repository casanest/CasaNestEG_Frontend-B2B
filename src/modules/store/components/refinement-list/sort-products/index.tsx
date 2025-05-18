"use client"

import FilterRadioGroup from "@modules/common/components/filter-radio-group"

export type SortOptions = "price_asc" | "price_desc" | "created_at"

type SortProductsProps = {
  sortBy: SortOptions
  setQueryParams: (name: string, value: SortOptions) => void
  "data-testid"?: string
  locale: string
}

const SortProducts = ({
  "data-testid": dataTestId,
  sortBy,
  setQueryParams,
  locale,
}: SortProductsProps) => {
  const sortOptions = [
    {
      value: "created_at",
      label: locale === "ar" ? "الأحدث" : "Newest",
    },
    {
      value: "price_asc",
      label: locale === "ar" ? "السعر: الأقل -> الأعلى" : "Price: Low -> High",
    },
    {
      value: "price_desc",
      label: locale === "ar" ? "السعر: الأعلى -> الأقل" : "Price: High -> Low",
    },
  ]

  const handleChange = (value: SortOptions) => {
    setQueryParams("sortBy", value)
  }

  return (
    <FilterRadioGroup
      title={locale === "ar" ? "ترتيب حسب" : "Sort by"}
      items={sortOptions}
      value={sortBy}
      handleChange={handleChange}
      data-testid={dataTestId}
      locale={locale}
    />
  )
}

export default SortProducts
