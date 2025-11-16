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
  price?: string
  q?: string
  handle?: string
  // Collection and type filters
  collection_id?: string[] | string
  type_id?: string[]
  category_id?: string[] | string
  // Variant-based filters
  colors?: string[]
  materials?: string[]
  sizes?: string[]
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
    const { inStock, onSale, price, colors, materials, sizes, ...apiParams } = queryParams || {}
    
    // Build API query with only supported parameters
    const limit = Math.min(Math.max(apiParams.limit || 12, 1), 100)
    const offset = Math.max((pageParam - 1) * limit, 0)

    const baseQuery: HttpTypes.FindParams & HttpTypes.StoreProductParams = {
      limit,
      offset,
      region_id: region.id,
      ...apiParams,
    }

    // Execute API request with only supported parameters
    const response = await sdk.client.fetch<{ products: HttpTypes.StoreProduct[]; count: number }>(`/store/products`, {
      method: "GET",
      query: baseQuery,
      headers,
      next,
      cache: "no-store",
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
    if (inStock || onSale || price || colors?.length || materials?.length || sizes?.length) {
      products = products.filter(product => {
        // Stock filtering
        if (inStock === 'true') {
          const hasAvailableVariants = product.variants?.some(variant => {
            if (!variant.manage_inventory) return true // Not managing inventory = always available
            if (variant.allow_backorder) return true // Backorder allowed = always available
            return (variant.inventory_quantity || 0) > 0 // Has stock
          })
          if (!hasAvailableVariants) return false
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

        // Price filtering
        if (price && price !== '') {
          const productPrice = product.variants?.[0]?.calculated_price?.calculated_amount
          if (productPrice) {
            const priceNum = productPrice / 100 // Convert from cents
            switch (price) {
              case '0-50':
                if (priceNum >= 50) return false
                break
              case '50-100':
                if (priceNum < 50 || priceNum >= 100) return false
                break
              case '100-200':
                if (priceNum < 100 || priceNum >= 200) return false
                break
              case '200+':
                if (priceNum < 200) return false
                break
            }
          }
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
  const { inStock, onSale, price, colors, materials, sizes, ...apiParams } = queryParams || {}

  // Fetch products with a larger limit for sorting, using only API-supported parameters
  const {
    response: { products },
  } = await listProducts({
      pageParam: 1,
      queryParams: {
      ...apiParams,
      limit: 100, // Fetch more for sorting
      },
      countryCode,
  })

  // Apply client-side filtering
  let filteredProducts = products
  if (inStock || onSale || price || colors?.length || materials?.length || sizes?.length) {
    filteredProducts = products.filter(product => {
      // Stock filtering
      if (inStock === 'true') {
        const hasAvailableVariants = product.variants?.some(variant => {
          if (!variant.manage_inventory) return true
          if (variant.allow_backorder) return true
          return (variant.inventory_quantity || 0) > 0
        })
        if (!hasAvailableVariants) return false
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

      // Price filtering
      if (price && price !== '') {
        const productPrice = product.variants?.[0]?.calculated_price?.calculated_amount
        if (productPrice) {
          const priceNum = productPrice / 100
          switch (price) {
            case '0-50':
              if (priceNum >= 50) return false
              break
            case '50-100':
              if (priceNum < 50 || priceNum >= 100) return false
              break
            case '100-200':
              if (priceNum < 100 || priceNum >= 200) return false
              break
            case '200+':
              if (priceNum < 200) return false
              break
          }
        }
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
    // Fetch products - either all products or category-specific
    // Use a higher limit to ensure we get all available filter options
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

    // Extract unique filter options
    const collectionsMap = new Map<string, {id: string, title: string, handle: string}>()
    const typesMap = new Map<string, {id: string, value: string}>()
    const colors = new Set<string>()
    const materials = new Set<string>()
    const sizes = new Set<string>()
    const priceRanges = new Set<number>()

    products.forEach(product => {
      // Collections
      if (product.collection) {
        collectionsMap.set(product.collection.id, {
          id: product.collection.id,
          title: product.collection.title,
          handle: product.collection.handle
          })
        }

      // Product types
      if (product.type) {
        typesMap.set(product.type.id, {
          id: product.type.id,
          value: product.type.value
        })
      }
      
      // Variant options (colors, materials, sizes, etc.)
      product.variants?.forEach(variant => {
        // Add price for price range calculation
        if (variant.calculated_price?.calculated_amount) {
          priceRanges.add(variant.calculated_price.calculated_amount / 100)
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
    
    // Calculate price ranges based on actual prices
    const priceArray = Array.from(priceRanges).sort((a, b) => a - b)
    const minPrice = priceArray[0] || 0
    const maxPrice = priceArray[priceArray.length - 1] || 1000

    return {
      collections: Array.from(collectionsMap.values()),
      types: Array.from(typesMap.values()),
      colors: Array.from(colors).sort(),
      materials: Array.from(materials).sort(),
      sizes: Array.from(sizes).sort(),
      priceRange: { min: minPrice, max: maxPrice },
      totalProducts: products.length
    }
  } catch (error) {
    console.error("Error fetching filter options:", error)
    return {
      collections: [],
      types: [],
      colors: [],
      materials: [],
      sizes: [],
      priceRange: { min: 0, max: 1000 },
      totalProducts: 0
    }
  }
}
