"use server"

import { getMeilisearchClientConfig } from '@lib/meilisearch-config'
import { SearchedProduct } from 'types/global'

export async function searchAutocomplete(
  query: string,
  limit = 6
): Promise<SearchedProduct[]> {
  if (!query || query.trim().length < 2) return []

  const meili = await getMeilisearchClientConfig()
  if (!meili) return []

  try {
    const response = await fetch(
      `${meili.search_url}/indexes/products/search?q=${encodeURIComponent(query)}&limit=${limit}`,
      {
        headers: {
          authorization: `Bearer ${meili.search_api_key}`,
        },
        cache: 'no-store',
      }
    )

    if (!response.ok) return []

    const data = await response.json()
    return (data.hits || []) as SearchedProduct[]
  } catch {
    return []
  }
}
