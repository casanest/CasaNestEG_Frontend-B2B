import { listProductsWithSort } from "@lib/data/products"
import { getRegion } from "@lib/data/regions"
import ProductPreview from "@modules/products/components/product-preview"
import { Pagination } from "@modules/store/components/pagination"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import { getLocale } from "next-intl/server"
import { notFound } from "next/navigation"

const PRODUCT_LIMIT = 12

type PaginatedProductsParams = {
  limit: number
  collection_id?: string[] | string
  category_id?: string[]
  id?: string[]
  order?: string
  // Custom filter parameters
  inStock?: string
  onSale?: string
  price?: string
  q?: string
  // Variant-based filters
  colors?: string[]
  materials?: string[]
  sizes?: string[]
  type_id?: string[]
}

export default async function PaginatedProducts({
  sortBy,
  page,
  collectionId,
  categoryId,
  productsIds,
  countryCode,
  searchParams,
}: {
  sortBy?: SortOptions
  page: number
  collectionId?: string
  categoryId?: string
  productsIds?: string[]
  countryCode: string
  searchParams?: { [key: string]: string | string[] | undefined }
}) {
  const queryParams: PaginatedProductsParams = {
    limit: PRODUCT_LIMIT,
  }

  if (collectionId) {
    queryParams["collection_id"] = collectionId
  }

  if (categoryId) {
    queryParams["category_id"] = [categoryId]
  }

  if (productsIds) {
    queryParams["id"] = productsIds
  }

  // Handle search parameters from URL
  if (searchParams) {
    // Basic filters
    if (searchParams.inStock === 'true') {
      queryParams.inStock = 'true'
    }
    
    if (searchParams.onSale === 'true') {
      queryParams.onSale = 'true'
    }
    
    if (searchParams.price && typeof searchParams.price === 'string') {
      queryParams.price = searchParams.price
    }
    
    if (searchParams.q && typeof searchParams.q === 'string') {
      queryParams.q = searchParams.q
    }

    // API-supported filters
    if (searchParams.collection_id && typeof searchParams.collection_id === 'string') {
      queryParams.collection_id = searchParams.collection_id
    }

    if (searchParams.type_id && typeof searchParams.type_id === 'string') {
      queryParams.type_id = searchParams.type_id.split(',')
    }

    // Variant-based filters (client-side)
    if (searchParams.colors && typeof searchParams.colors === 'string') {
      queryParams.colors = searchParams.colors.split(',')
    }

    if (searchParams.materials && typeof searchParams.materials === 'string') {
      queryParams.materials = searchParams.materials.split(',')
    }

    if (searchParams.sizes && typeof searchParams.sizes === 'string') {
      queryParams.sizes = searchParams.sizes.split(',')
    }
  }

  if (sortBy === "created_at") {
    queryParams["order"] = "created_at"
  }

  const region = await getRegion(countryCode)

  if (!region) {
    return null
  }

  let {
    response: { products, count },
  } = await listProductsWithSort({
    page,
    queryParams,
    sortBy,
    countryCode,
  })

  const totalPages = Math.ceil(count / PRODUCT_LIMIT)
  const locale = await getLocale()
  return (
    <>
      <ul
        className="grid grid-cols-2 w-full xs:grid-cols-1 small:grid-cols-3 medium:grid-cols-5 gap-x-6 gap-y-8"
        data-testid="products-list"
      >
        {products.map((p) => {
          return (
            <li key={p.id}>
              <ProductPreview product={p} region={region} locale={locale} />
            </li>
          )
        })}
      </ul>
      {totalPages > 1 && (
        <Pagination
          data-testid="product-pagination"
          page={page}
          totalPages={totalPages}
        />
      )}
    </>
  )
}
