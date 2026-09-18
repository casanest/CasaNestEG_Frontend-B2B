import { sdk } from "@lib/config"

/**
 * Fetch category filter options from the backend aggregate endpoint.
 *
 * This is a regular async function (NOT a server action) — safe to call
 * from async server components inside Suspense boundaries.
 *
 * Uses fetch-level caching with dynamic tags for surgical revalidation.
 * Does NOT use cookies(), headers(), or any dynamic request data.
 */
export const getSearchFilterOptions = async (
  productIds: string[],
  regionId?: string
): Promise<{
  collections: Array<{ id: string; title: string; handle: string }>
  types: Array<{ id: string; value: string }>
  colors: string[]
  materials: string[]
  sizes: string[]
  priceRange: { min: number; max: number }
  totalProducts: number
  productCategories: Array<{
    id: string
    name: string
    parent_category_id: string | null
    count: number
  }>
}> => {
  if (productIds.length === 0) {
    return {
      collections: [],
      types: [],
      colors: [],
      materials: [],
      sizes: [],
      priceRange: { min: 0, max: 0 },
      totalProducts: 0,
      productCategories: [],
    }
  }

  try {
    const queryParams: Record<string, string> = {
      product_ids: productIds.join(","),
    }
    if (regionId) {
      queryParams.region_id = regionId
    }

    const response = await sdk.client.fetch<{
      collections: Array<{ id: string; title: string; handle: string }>
      types: Array<{ id: string; value: string }>
      colors: string[]
      materials: string[]
      sizes: string[]
      priceRange: { min: number; max: number }
      totalProducts: number
      productCategories: Array<{
        id: string
        name: string
        parent_category_id: string | null
        count: number
      }>
    }>("/store/product-filters", {
      method: "GET",
      query: queryParams,
      cache: "no-store",
    })

    return response
  } catch (error) {
    console.error("Error fetching search filter options:", error)
    return {
      collections: [],
      types: [],
      colors: [],
      materials: [],
      sizes: [],
      priceRange: { min: 0, max: 0 },
      totalProducts: 0,
      productCategories: [],
    }
  }
}

export const getStoreFilterOptions = async (
  regionId?: string
): Promise<{
  collections: Array<{ id: string; title: string; handle: string }>
  types: Array<{ id: string; value: string }>
  colors: string[]
  materials: string[]
  sizes: string[]
  priceRange: { min: number; max: number }
  totalProducts: number
  productCategories: Array<{
    id: string
    name: string
    parent_category_id: string | null
    count: number
  }>
}> => {
  try {
    const queryParams: Record<string, string> = {}
    if (regionId) {
      queryParams.region_id = regionId
    }

    const response = await sdk.client.fetch<{
      collections: Array<{ id: string; title: string; handle: string }>
      types: Array<{ id: string; value: string }>
      colors: string[]
      materials: string[]
      sizes: string[]
      priceRange: { min: number; max: number }
      totalProducts: number
      productCategories: Array<{
        id: string
        name: string
        parent_category_id: string | null
        count: number
      }>
    }>("/store/product-filters", {
      method: "GET",
      query: queryParams,
      next: {
        revalidate: 300,
        tags: ["store-filters"],
      },
    })

    return response
  } catch (error) {
    console.error("Error fetching store filter options:", error)
    return {
      collections: [],
      types: [],
      colors: [],
      materials: [],
      sizes: [],
      priceRange: { min: 0, max: 0 },
      totalProducts: 0,
      productCategories: [],
    }
  }
}

export const getCategoryFilterOptions = async (
  categoryId: string,
  regionId?: string
): Promise<{
  collections: Array<{ id: string; title: string; handle: string }>
  types: Array<{ id: string; value: string }>
  colors: string[]
  materials: string[]
  sizes: string[]
  priceRange: { min: number; max: number }
  totalProducts: number
  productCategories: Array<{
    id: string
    name: string
    parent_category_id: string | null
    count: number
  }>
}> => {
  try {
    const queryParams: Record<string, string> = { category_id: categoryId }
    if (regionId) {
      queryParams.region_id = regionId
    }

    console.log("[category-filters] fetching with params:", queryParams)

    const response = await sdk.client.fetch<{
      collections: Array<{ id: string; title: string; handle: string }>
      types: Array<{ id: string; value: string }>
      colors: string[]
      materials: string[]
      sizes: string[]
      priceRange: { min: number; max: number }
      totalProducts: number
      productCategories: Array<{
        id: string
        name: string
        parent_category_id: string | null
        count: number
      }>
    }>("/store/product-filters", {
      method: "GET",
      query: queryParams,
      next: {
        revalidate: 300,
        tags: [`category-filters-${categoryId}`],
      },
    })

    console.log("[category-filters] response received:", {
      collections: response.collections?.length,
      types: response.types?.length,
      colors: response.colors?.length,
      totalProducts: response.totalProducts,
    })

    return response
  } catch (error) {
    console.error("Error fetching category filter options:", error)
    return {
      collections: [],
      types: [],
      colors: [],
      materials: [],
      sizes: [],
      priceRange: { min: 0, max: 0 },
      totalProducts: 0,
      productCategories: [],
    }
  }
}
