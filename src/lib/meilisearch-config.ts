const FALLBACK_SEARCH_URL = 'https://search.casanesteg.com'

type MeilisearchClientConfig = {
  search_api_key: string
  search_url: string
}

let cached: { config: MeilisearchClientConfig; at: number } | null = null
const TTL_MS = 5 * 60 * 1000

function envFallback(): MeilisearchClientConfig | null {
  const key =
    process.env.MEILISEARCH_API_KEY ??
    process.env.NEXT_PUBLIC_MEILISEARCH_API_KEY
  const url =
    process.env.MEILISEARCH_URL ??
    process.env.NEXT_PUBLIC_MEILISEARCH_URL ??
    FALLBACK_SEARCH_URL
  if (!key) return null
  return { search_api_key: key, search_url: url }
}

/**
 * Load Meilisearch URL + search-only API key from the Medusa backend (preferred),
 * with env fallback and short in-memory cache (server-side).
 */
export async function getMeilisearchClientConfig(): Promise<MeilisearchClientConfig | null> {
  if (cached && Date.now() - cached.at < TTL_MS) {
    return cached.config
  }

  const backendUrl = process.env.MEDUSA_BACKEND_URL
  const publishableKey = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY

  if (backendUrl && publishableKey) {
    try {
      const res = await fetch(
        `${backendUrl.replace(/\/$/, '')}/store/meilisearch-config`,
        {
          headers: { 'x-publishable-api-key': publishableKey },
          cache: 'no-store',
        }
      )
      if (res.ok) {
        const data = (await res.json()) as MeilisearchClientConfig
        if (data.search_api_key && data.search_url) {
          cached = { config: data, at: Date.now() }
          return data
        }
      }
    } catch {
      // fall through to env
    }
  }

  return envFallback()
}
