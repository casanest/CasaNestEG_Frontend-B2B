import { getMeilisearchClientConfig } from '@lib/meilisearch-config'
import { safeDecodeURIComponent } from '@lib/util/safe-decode-uri'
import { SearchedProducts } from 'types/global'

// Medusa: MEDUSA_BACKEND_URL, NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY (search key from /store/meilisearch-config)
export const BACKEND_URL = process.env.MEDUSA_BACKEND_URL

export const PUBLISHABLE_API_KEY =
  process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY


export const PRODUCT_LIMIT = 12

type SearchParams = {
  currency_code: string
  page?: number
  order?: string
  category_id?: string
  collection?: string[]
  type?: string[]
  material?: string[]
  price?: string[]
  query?: string
}

export async function search({
  currency_code,
  page,
  order = 'relevance',
  category_id,
  collection,
  type,
  material,
  price,
  query,
}: SearchParams): Promise<SearchedProducts> {
  const sortBy =
    order === 'price_asc'
      ? 'calculated_price'
      : order === 'price_desc'
        ? '-calculated_price'
        : order === 'created_at'
          ? '-created_at'
          : order

  const searchParams = new URLSearchParams({
    currency_code,
    order: sortBy,
    offset: ((page - 1) * PRODUCT_LIMIT).toString(),
    limit: PRODUCT_LIMIT.toString(),
  })

  if (category_id) {
    searchParams.append('category_id[]', category_id)
  }

  if (collection && Array.isArray(collection)) {
    collection.forEach((id) => {
      searchParams.append('collection_id[]', id)
    })
  }

  if (type && Array.isArray(type)) {
    type.forEach((id) => {
      searchParams.append('type_id[]', id)
    })
  }

  if (material && Array.isArray(material)) {
    material.forEach((id) => {
      searchParams.append('materials[]', id)
    })
  }

  if (price && Array.isArray(price)) {
    price.forEach((range) => {
      switch (range) {
        case 'under-100':
          searchParams.append('price_to', '100')
          break
        case '100-500':
          searchParams.append('price_from', '100')
          searchParams.append('price_to', '500')
          break
        case '501-1000':
          searchParams.append('price_from', '501')
          searchParams.append('price_to', '1000')
          break
        case 'more-than-1000':
          searchParams.append('price_from', '1000')
          break
      }
    })
  }

  if (query) {
    searchParams.append('q', safeDecodeURIComponent(query))
  }

  const meili = await getMeilisearchClientConfig()
  if (!meili) {
    return { results: [], count: 0 }
  }

  const response = await fetch(
    `${meili.search_url}/indexes/products/search?q=${searchParams.get('q')}`,
    {
      headers: {
        authorization: `Bearer ${meili.search_api_key}`,
      },
      cache: 'no-store',
    }
  )
// if (!response || !response.ok) {
//   throw new Error(`Response error. Status: ${response ? response.status : 'No response'}`)
// }

  const data = await response.json()

  // console.log('data:::::::::::::', data)
  // console.log('data.products:::::::::::::', data.products)

  return {
    results: data.hits,
    count: data.count,
  }
}
