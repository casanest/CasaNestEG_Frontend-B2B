import { Metadata } from "next"
import { notFound } from "next/navigation"

import { getCategoryByHandle, listCategories } from "@lib/data/categories"
import { listRegions } from "@lib/data/regions"
import { StoreRegion } from "@medusajs/types"
import CategoryTemplate from "@modules/categories/templates"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import { getLocale } from "next-intl/server"


type Props = {
  params: Promise<{ category: string[]; countryCode: string }>
  searchParams: Promise<{
    sortBy?: SortOptions
    page?: string
    [key: string]: string | string[] | undefined
  }>
}



export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params
  const locale = await getLocale()
  const isRTL = locale === "ar"
  try {
    // Handle URL encoding - decode the category handle
    const decodedCategory = params.category.map(segment => decodeURIComponent(segment))
    const productCategory = await getCategoryByHandle(decodedCategory)

    if (!productCategory) {
      notFound()
    }

    const title = isRTL
      ? (productCategory.name_ar || productCategory.name_en) + " - متجر كازانيست"
      : productCategory.name_en || productCategory.name_ar + " - CasaNest Store"
    const description = productCategory.description_en ?? `${title} category.`

    return {
      title: `${title} `,
      description,
      alternates: {
        canonical: `${decodedCategory.join("/")}`,
      },
    }
  } catch (error) {
    notFound()
  }
}

export default async function CategoryPage(props: Props) {
  const searchParams = await props.searchParams
  const params = await props.params
  const { sortBy, page, ...filterParams } = searchParams

  // Handle URL encoding - decode the category handle
  const decodedCategory = params.category.map(segment => decodeURIComponent(segment))

  // Get category by handle (with fallback to name search)
  const productCategory = await getCategoryByHandle(decodedCategory)

  if (!productCategory) {
    notFound()
  }

  return (
    <CategoryTemplate
      category={productCategory}
      sortBy={sortBy}
      page={page}
      countryCode={params.countryCode}
      searchParams={filterParams}
    />
  )
}
