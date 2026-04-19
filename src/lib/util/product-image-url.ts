import { safeDecodeURIComponent } from "./safe-decode-uri"

/**
 * Medusa sometimes stores double-percent-encoded URLs (%2520 for spaces).
 * Normalize so paths match what the origin serves.
 */
export function normalizeProductImageUrl(url: string): string {
  let current = url
  try {
    while (current.includes("%25")) {
      const next = safeDecodeURIComponent(current)
      if (next === current) {
        break
      }
      current = next
    }
  } catch {
    return url
  }
  return current
}

/**
 * Next.js Image Optimization fetches remotes with Node (undici/openssl). Some
 * hosts trigger ERR_SSL_UNSAFE_LEGACY_RENEGOTIATION_DISABLED while browsers still
 * load the asset. Skip optimization for those hosts so the browser requests the URL directly.
 */
const IMAGE_OPTIMIZATION_SKIP_HOSTS = new Set(["dashboard.casanesteg.com"])

export function shouldUseUnoptimizedImage(url: string): boolean {
  if (!url || url.startsWith("/")) {
    return false
  }
  try {
    const { hostname } = new URL(url)
    return IMAGE_OPTIMIZATION_SKIP_HOSTS.has(hostname)
  } catch {
    return false
  }
}
