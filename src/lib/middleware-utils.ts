import { type NextRequest, NextResponse } from "next/server"
import { rateLimit } from "./rate-limit"

// API route patterns
const API_PATTERNS = [
  /^\/api\//,
  /^\/[a-z]{2}\/api\//, // Localized API routes
  /^\/webhooks\//,
  /^\/[a-z]{2}\/webhooks\//, // Localized webhook routes
]

// Static asset patterns
const STATIC_PATTERNS = [
  /\.(ico|png|jpg|jpeg|gif|webp|svg|css|js|woff|woff2|ttf|eot)$/,
  /^\/favicon\./,
  /^\/images\//,
  /^\/assets\//,
  /^\/public\//,
  /^\/_next\//,
]

// Protected API routes that require authentication
const PROTECTED_API_PATTERNS = [
  /^\/api\/admin\//,
  /^\/api\/payments\/.*\/(initiate|verify|confirm)/,
  /^\/api\/orders\//,
  /^\/api\/customers\/me/,
]

// Public API routes that don't require authentication
const PUBLIC_API_PATTERNS = [
  /^\/api\/health/,
  /^\/api\/regions/,
  /^\/api\/products/,
  /^\/api\/collections/,
  /^\/webhooks\//,
]

/**
 * Check if the request is for an API route
 */
export function isApiRoute(request: NextRequest): boolean {
  const pathname = request.nextUrl.pathname
  return API_PATTERNS.some((pattern) => pattern.test(pathname))
}

/**
 * Check if the request is for a static asset
 */
export function isStaticAsset(request: NextRequest): boolean {
  const pathname = request.nextUrl.pathname
  return STATIC_PATTERNS.some((pattern) => pattern.test(pathname))
}

/**
 * Check if API route requires authentication
 */
export function isProtectedApiRoute(request: NextRequest): boolean {
  const pathname = request.nextUrl.pathname
  return PROTECTED_API_PATTERNS.some((pattern) => pattern.test(pathname))
}

/**
 * Check if API route is public
 */
export function isPublicApiRoute(request: NextRequest): boolean {
  const pathname = request.nextUrl.pathname
  return PUBLIC_API_PATTERNS.some((pattern) => pattern.test(pathname))
}

/**
 * Handle API requests with enhanced processing
 */
export async function handleApiRequest(request: NextRequest): Promise<NextResponse> {
  try {
    // Apply rate limiting
    const rateLimitResult = await rateLimit(request)
    if (!rateLimitResult.success) {
      return NextResponse.json(
        {
          error: "Rate limit exceeded",
          message: "Too many requests. Please try again later.",
          retryAfter: rateLimitResult.retryAfter,
        },
        {
          status: 429,
          headers: {
            ...createSecurityHeaders(),
            "Retry-After": rateLimitResult.retryAfter?.toString() || "60",
          },
        },
      )
    }

    // Validate API request
    const validationResult = await validateApiRequest(request)
    if (!validationResult.valid) {
      return NextResponse.json(
        {
          error: "Invalid request",
          message: validationResult.message,
          details: process.env.NODE_ENV === "development" ? validationResult.details : undefined,
        },
        {
          status: validationResult.status || 400,
          headers: createSecurityHeaders(),
        },
      )
    }

    // Handle authentication for protected routes
    if (isProtectedApiRoute(request) && !isPublicApiRoute(request)) {
      const authResult = await validateAuthentication(request)
      if (!authResult.valid) {
        return NextResponse.json(
          {
            error: "Authentication required",
            message: authResult.message,
          },
          {
            status: 401,
            headers: createSecurityHeaders(),
          },
        )
      }
    }

    // Handle CORS for API routes
    if (request.method === "OPTIONS") {
      return handleCorsPreflightRequest(request)
    }

    // Continue to API handler with enhanced headers
    const response = NextResponse.next()

    // Add security headers
    const securityHeaders = createSecurityHeaders()
    Object.entries(securityHeaders).forEach(([key, value]) => {
      response.headers.set(key, value)
    })

    // Add CORS headers for API routes
    const corsHeaders = createCorsHeaders(request)
    Object.entries(corsHeaders).forEach(([key, value]) => {
      response.headers.set(key, value)
    })

    return response
  } catch (error) {
    console.error("API request handling error:", error)
    return NextResponse.json(
      {
        error: "Internal server error",
        message: process.env.NODE_ENV === "development" ? (error instanceof Error ? error.message : String(error)) : "Something went wrong",
      },
      {
        status: 500,
        headers: createSecurityHeaders(),
      },
    )
  }
}

/**
 * Validate API request structure and content
 */
export async function validateApiRequest(request: NextRequest): Promise<{
  valid: boolean
  message?: string
  status?: number
  details?: any
}> {
  try {
    const pathname = request.nextUrl.pathname
    const method = request.method

    // Validate HTTP method
    const allowedMethods = ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"]
    if (!allowedMethods.includes(method)) {
      return {
        valid: false,
        message: `Method ${method} not allowed`,
        status: 405,
      }
    }

    // Validate content type for POST/PUT/PATCH requests
    if (["POST", "PUT", "PATCH"].includes(method)) {
      const contentType = request.headers.get("content-type")
      if (contentType && !contentType.includes("application/json") && !contentType.includes("multipart/form-data")) {
        return {
          valid: false,
          message: "Invalid content type. Expected application/json or multipart/form-data",
          status: 415,
        }
      }
    }

    // Validate request size
    const contentLength = request.headers.get("content-length")
    if (contentLength && Number.parseInt(contentLength) > 10 * 1024 * 1024) {
      // 10MB limit
      return {
        valid: false,
        message: "Request payload too large",
        status: 413,
      }
    }

    // Validate specific API routes
    if (pathname.includes("/payments/")) {
      return await validatePaymentApiRequest(request)
    }

    return { valid: true }
  } catch (error) {
    return {
      valid: false,
      message: "Request validation failed",
      status: 400,
      details: error instanceof Error ? error.message : String(error),
    }
  }
}

/**
 * Validate payment API requests
 */
async function validatePaymentApiRequest(request: NextRequest): Promise<{
  valid: boolean
  message?: string
  status?: number
}> {
  const pathname = request.nextUrl.pathname
  const method = request.method

  // Validate payment initiation requests
  if (pathname.includes("/initiate") && method === "POST") {
    try {
      const body = await request.clone().json()

      if (!body.amount || typeof body.amount !== "number" || body.amount <= 0) {
        return {
          valid: false,
          message: "Invalid amount. Must be a positive number",
          status: 400,
        }
      }

      if (!body.currency || typeof body.currency !== "string") {
        return {
          valid: false,
          message: "Currency is required",
          status: 400,
        }
      }

      if (!body.orderId || typeof body.orderId !== "string") {
        return {
          valid: false,
          message: "Order ID is required",
          status: 400,
        }
      }
    } catch (error) {
      return {
        valid: false,
        message: "Invalid JSON payload",
        status: 400,
      }
    }
  }

  return { valid: true }
}

/**
 * Validate authentication for protected routes
 */
async function validateAuthentication(request: NextRequest): Promise<{
  valid: boolean
  message?: string
}> {
  try {
    // Check for authorization header
    const authHeader = request.headers.get("authorization")
    if (!authHeader) {
      return {
        valid: false,
        message: "Authorization header is required",
      }
    }

    // Check for session cookie
    const sessionCookie = request.cookies.get("medusa-session")
    if (!sessionCookie) {
      return {
        valid: false,
        message: "Valid session is required",
      }
    }

    // Additional validation logic can be added here
    // For example, validating JWT tokens, checking user permissions, etc.

    return { valid: true }
  } catch (error) {
    return {
      valid: false,
      message: "Authentication validation failed",
    }
  }
}

/**
 * Handle CORS preflight requests
 */
function handleCorsPreflightRequest(request: NextRequest): NextResponse {
  const response = new NextResponse(null, { status: 200 })

  const corsHeaders = createCorsHeaders(request)
  Object.entries(corsHeaders).forEach(([key, value]) => {
    response.headers.set(key, value)
  })

  response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS")
  response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With")
  response.headers.set("Access-Control-Max-Age", "86400")

  return response
}

/**
 * Create CORS headers based on request origin
 */
function createCorsHeaders(request: NextRequest): Record<string, string> {
  const origin = request.headers.get("origin")
  const allowedOrigins = [
    process.env.NEXT_PUBLIC_STORE_URL,
    process.env.NEXT_PUBLIC_ADMIN_URL,
    "http://localhost:3000",
    "http://localhost:3001",
  ].filter(Boolean)

  const corsHeaders: Record<string, string> = {
    "Access-Control-Allow-Credentials": "true",
  }

  if (origin && allowedOrigins.includes(origin)) {
    corsHeaders["Access-Control-Allow-Origin"] = origin
  } else if (process.env.NODE_ENV === "development") {
    corsHeaders["Access-Control-Allow-Origin"] = "*"
  }

  return corsHeaders
}

const MEILISEARCH_FALLBACK_ORIGIN = "https://search.casanesteg.com"

/** Origins allowed for browser fetch/XHR to Meilisearch (connect-src). */
function collectMeilisearchConnectOrigins(): string[] {
  const origins = new Set<string>()
  const candidates = [
    process.env.NEXT_PUBLIC_MEILISEARCH_URL,
    process.env.MEILISEARCH_URL,
    MEILISEARCH_FALLBACK_ORIGIN,
  ].filter(Boolean) as string[]

  for (const raw of candidates) {
    try {
      origins.add(new URL(raw).origin)
    } catch {
      // skip invalid URLs
    }
  }

  if (process.env.NODE_ENV !== "production") {
    origins.add("http://127.0.0.1:7700")
    origins.add("http://localhost:7700")
  }

  return Array.from(origins).sort()
}

/**
 * Create security headers for all responses
 */
export function createSecurityHeaders(): Record<string, string> {
  const meilisearchOrigins = collectMeilisearchConnectOrigins().join(" ")
  const connectSrcProduction = `'self' https://api.paymob.com https://accept.paymob.com ${meilisearchOrigins}`
  const connectSrcDevelopment = `'self' https://api.paymob.com https://accept.paymob.com ws: wss: ${meilisearchOrigins}`

  return {
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY",
    "X-XSS-Protection": "1; mode=block",
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
    "Strict-Transport-Security": "max-age=31536000; includeSubDomains",
    "Content-Security-Policy":
      process.env.NODE_ENV === "production"
        ? `default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src ${connectSrcProduction};`
        : `default-src 'self' 'unsafe-inline' 'unsafe-eval'; connect-src ${connectSrcDevelopment};`,
  }
}

/**
 * Log requests for monitoring and debugging
 */
export function logRequest(request: NextRequest): void {
  if (process.env.NODE_ENV === "development") {
    console.log(`${request.method} ${request.nextUrl.pathname}`, {
      userAgent: request.headers.get("user-agent"),
      ip: request.headers.get("x-forwarded-for"),
      timestamp: new Date().toISOString(),
    })
  }
}
