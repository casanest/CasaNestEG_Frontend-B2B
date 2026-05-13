import type { NextRequest } from "next/server"

interface RateLimitResult {
  success: boolean
  retryAfter?: number
}

// In-memory rate limiting (replace with Redis in production)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>()

// Rate limit configurations
const RATE_LIMITS = {
  api: { requests: 100, window: 60 * 1000 }, // 100 requests per minute
  payment: { requests: 100, window: 60 * 1000 }, // 100 payment requests per minute
  webhook: { requests: 1000, window: 60 * 1000 }, // 1000 webhook requests per minute
  default: { requests: 60, window: 60 * 1000 }, // 60 requests per minute
}

/**
 * Apply rate limiting based on IP and route type
 */
export async function rateLimit(request: NextRequest): Promise<RateLimitResult> {
  const ip = getClientIP(request)
  const pathname = request.nextUrl.pathname

  // Determine rate limit type
  let limitConfig = RATE_LIMITS.default
  if (pathname.includes("/payments/")) {
    limitConfig = RATE_LIMITS.payment
  } else if (pathname.includes("/webhooks/")) {
    limitConfig = RATE_LIMITS.webhook
  } else if (pathname.startsWith("/api/")) {
    limitConfig = RATE_LIMITS.api
  }

  const key = `${ip}:${getLimitKey(pathname)}`
  const now = Date.now()
  const windowStart = now - limitConfig.window

  // Clean up old entries
  cleanupOldEntries(windowStart)

  // Get current count
  const current = rateLimitMap.get(key)

  if (!current || current.resetTime < windowStart) {
    // First request in window or window expired
    rateLimitMap.set(key, { count: 1, resetTime: now + limitConfig.window })
    return { success: true }
  }

  if (current.count >= limitConfig.requests) {
    // Rate limit exceeded
    const retryAfter = Math.ceil((current.resetTime - now) / 1000)
    return { success: false, retryAfter }
  }

  // Increment count
  current.count++
  return { success: true }
}

/**
 * Get client IP address
 */
function getClientIP(request: NextRequest): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0] || request.headers.get("x-real-ip") || "unknown"
  )
}

/**
 * Get rate limit key based on pathname
 */
function getLimitKey(pathname: string): string {
  if (pathname.includes("/payments/")) return "payment"
  if (pathname.includes("/webhooks/")) return "webhook"
  if (pathname.startsWith("/api/")) return "api"
  return "default"
}

/**
 * Clean up old rate limit entries
 */
function cleanupOldEntries(windowStart: number): void {
  for (const [key, value] of Array.from(rateLimitMap.entries())) {
    if (value.resetTime < windowStart) {
      rateLimitMap.delete(key)
    }
  }
}
