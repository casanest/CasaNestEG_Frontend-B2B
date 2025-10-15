import { Metadata } from "next"
import { notFound } from "next/navigation"

import { getCategoryByHandle } from "@lib/data/categories"
import CategoryTemplate from "@modules/categories/templates"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"

type Props = {
  params: Promise<{ category: string[]; countryCode: string }>
  searchParams: Promise<{
    sortBy?: SortOptions
    page?: string
    [key: string]: string | string[] | undefined
  }>
}

// Removed generateStaticParams to make this a dynamic route
// This prevents conflicts with no-store cache directives in data fetching
// Categories will be rendered on-demand instead of being pre-generated

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params
  try {
    // Handle URL encoding - decode the category handle
    const decodedCategory = params.category.map(segment => decodeURIComponent(segment))
    const productCategory = await getCategoryByHandle(decodedCategory)

    if (!productCategory) {
      notFound()
    }

    const title = productCategory.name + " | Medusa Store"
    const description = productCategory.description ?? `${title} category.`

    return {
      title: `${title} | Medusa Store`,
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
