"use server"

import { sdk } from "@lib/config"
import { sortProducts } from "@lib/util/sort-products"
import { HttpTypes } from "@medusajs/types"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import { getAuthHeaders, getCacheOptions } from "./cookies"
import { getRegion, retrieveRegion } from "./regions"

// Custom filter parameters interface
interface ProductFilters {
  inStock?: string
  onSale?: string
  madeToOrder?: string
  price?: string
  q?: string
  handle?: string
  homepage?: string
  // Collection and type filters
  collection_id?: string[] | string
  type_id?: string[]
  category_id?: string[] | string
  // Variant-based filters
  colors?: string[]
  materials?: string[]
  sizes?: string[]
}

/**
 * Parse a price filter string (e.g. "100-500", "100+", "0-500") into min/max bounds.
 * Returns null if the filter is empty or unparseable.
 */
function parsePriceFilter(price: string): { min: number | null; max: number | null } | null {
  if (!price || price.trim() === '') return null

  if (price.endsWith('+')) {
    const min = parseFloat(price.slice(0, -1))
    return { min: isNaN(min) ? null : min, max: null }
  }

  if (price.includes('-')) {
    const [minStr, maxStr] = price.split('-')
    const min = parseFloat(minStr)
    const max = parseFloat(maxStr)
    return {
      min: isNaN(min) ? null : min,
      max: isNaN(max) ? null : max,
    }
  }

  return null
}

/**
 * Collect all valid calculated prices from a product's variants.
 * The Medusa /store/products API returns calculated_amount in currency units (not cents).
 */
function getProductPrices(product: HttpTypes.StoreProduct): number[] {
  return (product.variants || [])
    .map(v => v.calculated_price?.calculated_amount)
    .filter((p): p is number => typeof p === 'number' && p > 0)
}

/**
 * Check if a product has at least one variant price within the given range.
 * - min only (max=null): product matches if any price >= min
 * - max only (min=null): product matches if any price <= max
 * - both: product matches if any price falls within [min, max]
 */
function productMatchesPriceRange(product: HttpTypes.StoreProduct, min: number | null, max: number | null): boolean {
  const prices = getProductPrices(product)
  if (prices.length === 0) return false

  if (min !== null && max !== null) {
    return prices.some(p => p >= min && p <= max)
  }
  if (min !== null) {
    return prices.some(p => p >= min)
  }
  if (max !== null) {
    return prices.some(p => p <= max)
  }
  return true
}

export const listProducts = async ({
  pageParam = 1,
  queryParams,
  countryCode,
  regionId,
}: {
  pageParam?: number
  queryParams?: (HttpTypes.FindParams & HttpTypes.StoreProductParams) & ProductFilters
  countryCode?: string
  regionId?: string
}): Promise<{
  response: { products: HttpTypes.StoreProduct[]; count: number }
  nextPage: number | null
  queryParams?: (HttpTypes.FindParams & HttpTypes.StoreProductParams) & ProductFilters
}> => {
  try {
    const region = regionId ? await retrieveRegion(regionId) : await getRegion(countryCode!)

    if (!region) {
      console.warn(`Region not found for ${regionId ? `regionId: ${regionId}` : `countryCode: ${countryCode}`}`)
      return {
        response: { products: [], count: 0 },
        nextPage: null,
        queryParams: queryParams,
      }
    }

    const headers = await getAuthHeaders()
    const next = await getCacheOptions("products")

    // Separate API-supported parameters from client-side filters
    const { inStock, onSale, madeToOrder, price, colors, materials, sizes, ...apiParams } = queryParams || {}
    
    // Build API query with only supported parameters
    const limit = Math.min(Math.max(apiParams.limit || 12, 1), 100)
    const offset = Math.max((pageParam - 1) * limit, 0)

    // const baseQuery: HttpTypes.FindParams & HttpTypes.StoreProductParams = {
    //   limit,
    //   offset,
    //   region_id: region.id,
    //   ...apiParams,
    // }
    const baseQuery: HttpTypes.FindParams & HttpTypes.StoreProductParams = {
      limit,
      offset,
      region_id: region.id,
      fields: "*variants.calculated_price,+metadata,*variants,*variants.options,*options,*options.values,*images,*tags,*categories, ", // 👈 add +metadata
      ...apiParams,
    }
    // Execute API request with only supported parameters
    const response = await sdk.client.fetch<{ products: HttpTypes.StoreProduct[]; count: number }>(`/store/products`, {
      method: "GET",
      query: baseQuery,
      headers,
      next: { revalidate: 0, tags: ["products"], ...next },
    })

    if (!response || !response.products) {
      return {
        response: { products: [], count: 0 },
        nextPage: null,
        queryParams: baseQuery,
      }
    }

    let { products, count } = response

    // Apply client-side filtering for unsupported API parameters
    if (inStock || onSale || madeToOrder || price || colors?.length || materials?.length || sizes?.length) {
      products = products.filter(product => {
        // In Stock filtering - products with a price
        if (inStock === 'true') {
          const hasPrice = product.variants?.some(variant =>
            typeof variant.calculated_price?.calculated_amount === 'number'
          )
          if (!hasPrice) return false
        }

        // Sale filtering
        if (onSale === 'true') {
          const hasDiscountedVariant = product.variants?.some((variant) => {
            const calculated = variant.calculated_price?.calculated_amount
            const original = variant.calculated_price?.original_amount
            if (typeof calculated !== "number" || typeof original !== "number") {
              return false
            }
            return original > calculated
          })

          if (!hasDiscountedVariant) {
            return false
          }
        }

        // Made to order filtering - products with no price
        if (madeToOrder === 'true') {
          const hasPrice = product.variants?.some(variant =>
            typeof variant.calculated_price?.calculated_amount === 'number'
          )
          if (hasPrice) return false
        }

        // Price filtering - check all variant prices against the range
        const priceFilter = parsePriceFilter(price || '')
        if (priceFilter) {
          if (!productMatchesPriceRange(product, priceFilter.min, priceFilter.max)) return false
        }

        // Color filtering
        if (colors && colors.length > 0) {
          const hasMatchingColor = product.variants?.some(variant =>
            variant.options?.some(option =>
              option.option?.title?.toLowerCase() === 'color' &&
              colors.includes(option.value)
            )
          )
          if (!hasMatchingColor) return false
        }

        // Material filtering
        if (materials && materials.length > 0) {
          const hasMatchingMaterial = product.variants?.some(variant =>
            variant.options?.some(option =>
              option.option?.title?.toLowerCase() === 'material' &&
              materials.includes(option.value)
            )
          )
          if (!hasMatchingMaterial) return false
        }

        // Size filtering
        if (sizes && sizes.length > 0) {
          const hasMatchingSize = product.variants?.some(variant =>
            variant.options?.some(option =>
              option.option?.title?.toLowerCase() === 'size' &&
              sizes.includes(option.value)
            )
          )
          if (!hasMatchingSize) return false
        }

        return true
      })

      // Update count to reflect filtered results
      count = products.length
    }

    const nextPage = count > offset + limit ? pageParam + 1 : null

    return {
      response: { products, count },
      nextPage,
      queryParams: queryParams,
    }
  } catch (error) {
    console.error("Error fetching products:", error)
    return {
      response: { products: [], count: 0 },
      nextPage: null,
      queryParams: queryParams,
    }
  }
}

/**
 * This will fetch 100 products to the Next.js cache and sort them based on the sortBy parameter.
 * It will then return the paginated products based on the page and limit parameters.
 */
export const listProductsWithSort = async ({
  page = 0,
  queryParams,
  sortBy = "created_at",
  countryCode,
}: {
  page?: number
  queryParams?: (HttpTypes.FindParams & HttpTypes.StoreProductParams) & ProductFilters
  sortBy?: SortOptions
  countryCode: string
}): Promise<{
  response: { products: HttpTypes.StoreProduct[]; count: number }
  nextPage: number | null
  queryParams?: (HttpTypes.FindParams & HttpTypes.StoreProductParams) & ProductFilters
}> => {
  const limit = queryParams?.limit || 12

  // Separate API-supported parameters from client-side filters
  const { inStock, onSale, madeToOrder, price, colors, materials, sizes, ...apiParams } = queryParams || {}

  const hasClientFilters = !!(inStock || onSale || madeToOrder || price || colors?.length || materials?.length || sizes?.length)

  // Fast path: when sorting by created_at (API-native) and no client-side filters,
  // fetch only the needed page directly from the API instead of 100 products
  if (sortBy === "created_at" && !hasClientFilters) {
    const {
      response: { products, count },
    } = await listProducts({
      pageParam: page,
      queryParams: {
        ...apiParams,
        limit,
        order: "created_at",
      },
      countryCode,
    })

    const nextPage = count > page * limit ? page + 1 : null

    return {
      response: { products, count },
      nextPage,
      queryParams,
    }
  }

  // Slow path: fetch 100 products for client-side sorting/filtering
  const {
    response: { products },
  } = await listProducts({
      pageParam: 1,
      queryParams: {
      ...apiParams,
      limit: 100,
      },
      countryCode,
  })

  // Apply client-side filtering
  let filteredProducts = products
  if (hasClientFilters) {
    filteredProducts = products.filter(product => {
      // In Stock filtering - products with a price
      if (inStock === 'true') {
        const hasPrice = product.variants?.some(variant =>
          typeof variant.calculated_price?.calculated_amount === 'number'
        )
        if (!hasPrice) return false
      }

      // Sale filtering
      if (onSale === 'true') {
        const hasDiscountedVariant = product.variants?.some((variant) => {
          const calculated = variant.calculated_price?.calculated_amount
          const original = variant.calculated_price?.original_amount
          if (typeof calculated !== "number" || typeof original !== "number") {
            return false
          }
          return original > calculated
        })

        if (!hasDiscountedVariant) {
          return false
        }
      }

      // Made to order filtering - products with no price
      if (madeToOrder === 'true') {
        const hasPrice = product.variants?.some(variant =>
          typeof variant.calculated_price?.calculated_amount === 'number'
        )
        if (hasPrice) return false
      }

        // Price filtering - check all variant prices against the range
        const priceFilter = parsePriceFilter(price || '')
        if (priceFilter) {
          if (!productMatchesPriceRange(product, priceFilter.min, priceFilter.max)) return false
        }

        // Color filtering
        if (colors && colors.length > 0) {
          const hasMatchingColor = product.variants?.some(variant =>
            variant.options?.some(option =>
              option.option?.title?.toLowerCase() === 'color' &&
              colors.includes(option.value)
            )
          )
          if (!hasMatchingColor) return false
        }

        // Material filtering
        if (materials && materials.length > 0) {
          const hasMatchingMaterial = product.variants?.some(variant =>
            variant.options?.some(option =>
              option.option?.title?.toLowerCase() === 'material' &&
              materials.includes(option.value)
            )
          )
          if (!hasMatchingMaterial) return false
        }

        // Size filtering
        if (sizes && sizes.length > 0) {
          const hasMatchingSize = product.variants?.some(variant =>
            variant.options?.some(option =>
              option.option?.title?.toLowerCase() === 'size' &&
              sizes.includes(option.value)
            )
          )
          if (!hasMatchingSize) return false
        }

        return true
      })
  }

  const sortedProducts = sortProducts(filteredProducts, sortBy)

  const count = sortedProducts.length
  const offset = (page - 1) * limit  // Convert 1-based page to 0-based offset
  const paginatedProducts = sortedProducts.slice(offset, offset + limit)
  const nextPage = count > offset + limit ? page + 1 : null

    return {
      response: {
        products: paginatedProducts,
        count,
      },
      nextPage,
    queryParams,
  }
}

/**
 * Extract all available filter options from products and their variants
 */
export const getProductFilterOptions = async (countryCode: string, categoryId?: string) => {
  try {
    const queryParams: { limit: number; category_id?: string[] } = { limit: 1000 }
    if (categoryId) {
      queryParams.category_id = [categoryId]
    }

    const { response } = await listProducts({
      pageParam: 1,
      queryParams,
      countryCode,
    })

    const { products } = response

    const collectionsMap = new Map<string, {id: string, title: string, handle: string}>()
    const typesMap = new Map<string, {id: string, value: string}>()
    const colors = new Set<string>()
    const materials = new Set<string>()
    const sizes = new Set<string>()
    const priceRanges = new Set<number>()
    const productCategoriesMap = new Map<string, { id: string; name: string; parent_category_id: string | null; count: number }>()

    products.forEach(product => {
      if (product.collection) {
        collectionsMap.set(product.collection.id, {
          id: product.collection.id,
          title: product.collection.title,
          handle: product.collection.handle
        })
      }

      if (product.type) {
        typesMap.set(product.type.id, {
          id: product.type.id,
          value: product.type.value
        })
      }

      if (product.categories && Array.isArray(product.categories)) {
        product.categories.forEach((cat: any) => {
          const catId = cat.id
          const existing = productCategoriesMap.get(catId)
          if (existing) {
            existing.count++
          } else {
            productCategoriesMap.set(catId, {
              id: catId,
              name: cat.name || cat.metadata?.localizations?.en?.name || catId,
              parent_category_id: cat.parent_category_id || null,
              count: 1,
            })
          }
        })
      }

      product.variants?.forEach(variant => {
        if (variant.calculated_price?.calculated_amount) {
          priceRanges.add(variant.calculated_price.calculated_amount)
        }

        variant.options?.forEach(option => {
          const optionTitle = option.option?.title?.toLowerCase()
          const optionValue = option.value

          if (optionTitle === 'color') {
            colors.add(optionValue)
          } else if (optionTitle === 'material') {
            materials.add(optionValue)
          } else if (optionTitle === 'size') {
            sizes.add(optionValue)
          }
        })
      })
    })

    const priceArray = Array.from(priceRanges).sort((a, b) => a - b)
    const minPrice = priceArray[0] || 0
    const maxPrice = priceArray.length > 0 ? priceArray[priceArray.length - 1] : 0

    return {
      collections: Array.from(collectionsMap.values()),
      types: Array.from(typesMap.values()),
      colors: Array.from(colors).sort(),
      materials: Array.from(materials).sort(),
      sizes: Array.from(sizes).sort(),
      priceRange: { min: minPrice, max: maxPrice },
      totalProducts: products.length,
      productCategories: Array.from(productCategoriesMap.values()),
    }
  } catch (error) {
    console.error("Error fetching filter options:", error)
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
