import { sdk } from "@lib/config"
import { HttpTypes } from "@medusajs/types"
import { getCacheOptions } from "./cookies"

export const listCategories = async (query?: Record<string, any>) => {
  const next = {
    ...(await getCacheOptions("categories")),
  }

  const limit = query?.limit || 100

  return sdk.client
    .fetch<{ product_categories: HttpTypes.StoreProductCategory[] }>(
      "/store/product-categories",
      {
        query: {
          fields:
            "*category_children, *products, *parent_category, *parent_category.parent_category",
          limit,
          ...query,
        },
        next,
        cache: "no-store",
      }
    )
    .then(({ product_categories }) => product_categories)
}

export const getCategoryByHandle = async (categoryHandle: string[]) => {
  const handle = `${categoryHandle.join("/")}`

  const next = {
    ...(await getCacheOptions("categories")),
  }

  // First try to get by handle using the direct endpoint
  try {
    const response = await sdk.client
      .fetch<HttpTypes.StoreProductCategoryListResponse>(
        `/store/product-categories`,
        {
          query: {
            fields: "*category_children, *products, *parent_category, *parent_category.parent_category",
            handle,
          },
          next,
          cache: "no-store",
        }
      )
    
    if (response.product_categories && response.product_categories.length > 0) {
      return response.product_categories[0]
    }
  } catch (error) {
    console.warn(`Failed to fetch category by handle ${handle}:`, error)
  }

  // If not found by handle, try to find by name in all categories
  try {
    const allCategories = await listCategories()
    if (allCategories) {
      const foundCategory = allCategories.find(cat => 
        cat.name.toLowerCase().includes(handle.toLowerCase()) ||
        cat.handle.toLowerCase().includes(handle.toLowerCase().replace(/\s+/g, "-"))
      )
      if (foundCategory) {
        return foundCategory
      }
    }
  } catch (error) {
    console.warn(`Failed to search categories by name:`, error)
  }

  return null
}
