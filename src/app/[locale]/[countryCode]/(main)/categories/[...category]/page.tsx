import { Metadata } from "next"
import { notFound } from "next/navigation"

import {
  getCategoryByHandle,
  listCategories,
} from "@lib/data/categories"

import CategoryTemplate from "@modules/categories/templates"

import { SortOptions } from "@modules/store/components/refinement-list/sort-products"

import { getLocale } from "next-intl/server"



export const revalidate = 3600



type Props = {
  params: Promise<{
    category: string[]
    countryCode: string
  }>

  searchParams: Promise<{
    sortBy?: SortOptions
    page?: string
    [key: string]: string | string[] | undefined
  }>
}




export async function generateStaticParams() {


  try {


    const categories = await listCategories()



    return categories
      .filter((cat: any) => cat.handle)
      .map((cat: any) => ({
        category: [
          cat.handle
        ],
        countryCode: "eg"
      }))



  } catch (error) {


    console.error(
      "Static params error",
      error
    )


    return []

  }

}




export async function generateMetadata(
  props: Props
): Promise<Metadata> {


  const params = await props.params

  const locale = await getLocale()

  const isRTL = locale === "ar"



  const handle =
    params.category.map(
      x => decodeURIComponent(x)
    )



  const category =
    await getCategoryByHandle(handle)



  if (!category)
    return {}




  const title = isRTL

    ? `${category.name_ar || category.name_en} - متجر كازانيست`

    : `${category.name_en || category.name_ar} - CasaNest Store`




  return {

    title,

    description:
      category.description_en ??
      title,


    alternates: {
      canonical:
        `/${handle.join("/")}`
    }


  }


}






export default async function CategoryPage(
  props: Props
) {


  const params = await props.params

  const searchParams =
    await props.searchParams



  const {
    sortBy,
    page,
    ...filterParams
  } = searchParams





  const handle =
    params.category.map(
      x => decodeURIComponent(x)
    )





  const category =
    await getCategoryByHandle(handle)



  if (!category)
    notFound()





  return (

    <CategoryTemplate

      category={category}

      sortBy={sortBy}

      page={page}

      countryCode={
        params.countryCode
      }

      searchParams={
        filterParams
      }

    />


  )


}