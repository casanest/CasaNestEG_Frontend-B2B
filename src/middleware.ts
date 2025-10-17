import type { HttpTypes } from "@medusajs/types"
import { type NextRequest, NextResponse } from "next/server"
import createIntlMiddleware from "next-intl/middleware"
import { fallbackLng, languages } from "./lib/i18n/settings"
import { isApiRoute, isStaticAsset, handleApiRequest, createSecurityHeaders, logRequest } from "./lib/middleware-utils"

const intlMiddleware = createIntlMiddleware({
  locales: languages,
  defaultLocale: fallbackLng,
  localeDetection: true,
})

const BACKEND_URL = process.env.MEDUSA_BACKEND_URL
const PUBLISHABLE_API_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY
const DEFAULT_REGION = process.env.NEXT_PUBLIC_DEFAULT_REGION || "fr"

const regionMapCache = {
  regionMap: new Map<string, HttpTypes.StoreRegion>(),
  regionMapUpdated: Date.now(),
}

async function getRegionMap(cacheId: string) {
  const { regionMap, regionMapUpdated } = regionMapCache

  if (!BACKEND_URL) {
    throw new Error(
      "Middleware.ts: Error fetching regions. Did you set up regions in your Medusa Admin and define a MEDUSA_BACKEND_URL environment variable?",
    )
  }

  if (!PUBLISHABLE_API_KEY) {
    throw new Error(
      "Middleware.ts: NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY environment variable is required",
    )
  }

  if (!regionMap.keys().next().value || regionMapUpdated < Date.now() - 3600 * 1000) {
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 5000) // 5 second timeout
      
      const response = await fetch(`${BACKEND_URL}/store/regions`, {
        headers: {
          "x-publishable-api-key": PUBLISHABLE_API_KEY,
        },
        next: {
          revalidate: 3600,
          tags: [`regions-${cacheId}`],
        },
        cache: "force-cache",
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Failed to fetch regions: ${response.status} ${response.statusText} - ${errorText}`)
      }

      const json = await response.json()
      const { regions } = json

      if (!regions?.length) {
        throw new Error("No regions found. Please set up regions in your Medusa Admin.")
      }

      regions.forEach((region: HttpTypes.StoreRegion) => {
        region.countries?.forEach((c) => {
          regionMapCache.regionMap.set(c.iso_2 ?? "", region)
        })
      })

      regionMapCache.regionMapUpdated = Date.now()
    } catch (error) {
      console.error("Error fetching regions:", error)
      
      // If no cached data and backend is unavailable, create fallback regions
      if (!regionMap.size) {
        console.warn("Backend unavailable, using fallback regions for middleware")
        
        // Create fallback regions based on common country codes
        const fallbackRegions = [
          { id: 'fallback-1', countries: [{ iso_2: 'us' }, { iso_2: 'eg' }, { iso_2: 'ar' }] },
          { id: 'fallback-2', countries: [{ iso_2: 'fr' }, { iso_2: 'de' }, { iso_2: 'gb' }] },
        ]
        
        fallbackRegions.forEach((region: any) => {
          region.countries?.forEach((c: any) => {
            regionMapCache.regionMap.set(c.iso_2, region)
          })
        })
        
        regionMapCache.regionMapUpdated = Date.now()
        console.log("Fallback regions created:", Array.from(regionMapCache.regionMap.keys()))
      }
    }
  }

  return regionMapCache.regionMap
}

async function getCountryCode(
  request: NextRequest,
  regionMap: Map<string, HttpTypes.StoreRegion | number>,
  countryCodePathnameIndex: number,
) {
  try {
    let countryCode

    const vercelCountryCode = request.headers.get("x-vercel-ip-country")?.toLowerCase()

    const urlCountryCode = request.nextUrl.pathname.split("/")[countryCodePathnameIndex]?.toLowerCase()

    if (urlCountryCode && regionMap.has(urlCountryCode)) {
      countryCode = urlCountryCode
    } else if (vercelCountryCode && regionMap.has(vercelCountryCode)) {
      countryCode = vercelCountryCode
    } else if (regionMap.has(DEFAULT_REGION)) {
      countryCode = DEFAULT_REGION
    } else if (regionMap.keys().next().value) {
      countryCode = regionMap.keys().next().value
    }

    return countryCode
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("Middleware.ts: Error getting the country code. Did you set up regions in your Medusa Admin?")
    }
    return DEFAULT_REGION
  }
}

/**
 * Enhanced middleware to handle both API routes and page requests
 */
export async function middleware(request: NextRequest) {
  const startTime = Date.now()

  try {
    // Log request for monitoring
    logRequest(request)

    // Handle static assets early
    if (isStaticAsset(request)) {
      return NextResponse.next()
    }

    // Handle API routes with enhanced processing
    if (isApiRoute(request)) {
      return await handleApiRequest(request)
    }

    // Continue with existing page routing logic
    return await handlePageRequest(request)
  } catch (error) {
    console.error("Middleware error:", error)

    // For API routes, return JSON error
    if (isApiRoute(request)) {
      return NextResponse.json(
        {
          error: "Internal server error",
          message: process.env.NODE_ENV === "development" ? (error as Error).message : "Something went wrong",
        },
        {
          status: 500,
          headers: createSecurityHeaders(),
        },
      )
    }

    // For page routes, continue to error page
    return NextResponse.next()
  } finally {
    // Log performance metrics
    const duration = Date.now() - startTime
    if (duration > 1000) {
      console.warn(`Slow middleware execution: ${duration}ms for ${request.nextUrl.pathname}`)
    }
  }
}

/**
 * Handle page requests with existing logic
 */
async function handlePageRequest(request: NextRequest) {
  const pathnameArr = request.nextUrl.pathname.split("/")
  const urlHasKnownLocale = languages.includes(pathnameArr[1])

  const urlHasUnknownLocale =
    !urlHasKnownLocale && pathnameArr[1]?.length === 2 && (pathnameArr?.[2] ? pathnameArr[2].length === 2 : true)

  const cacheIdCookie = request.cookies.get("_medusa_cache_id")
  const cacheId = cacheIdCookie?.value || crypto.randomUUID()

  const regionMap = await getRegionMap(cacheId)
  const countryCodePathnameIndex = urlHasKnownLocale ? 2 : 1
  const countryCode = regionMap && (await getCountryCode(request, regionMap, countryCodePathnameIndex))

  const urlHasCountryCode = countryCode && request.nextUrl.pathname.split("/")[countryCodePathnameIndex] === countryCode
  const queryString = request.nextUrl.search ? request.nextUrl.search : ""

  // If we have unknown locale, redirect to fallback language
  if (urlHasUnknownLocale) {
    const remainingPath = pathnameArr.slice(1).join("/")
    const redirectUrl = `${request.nextUrl.origin}/${fallbackLng}/${remainingPath}${queryString}`
    const response = NextResponse.redirect(redirectUrl, 307)
    
    // Add security headers
    const headers = createSecurityHeaders()
    Object.entries(headers).forEach(([key, value]) => {
      response.headers.set(key, value)
    })
    
    return response
  }

  // If country code is in URL and cache ID is set, continue with intl middleware
  if (urlHasCountryCode && cacheIdCookie) {
    return intlMiddleware(request)
  }

  // Set cache ID if country code is in URL but cache ID is not set
  if (urlHasCountryCode && !cacheIdCookie) {
    const response = NextResponse.next()
    
    // Allow disabling secure cookies for testing on IP addresses
    const isSecure = process.env.NODE_ENV === "production" && process.env.DISABLE_SECURE_COOKIES !== "true"
    
    response.cookies.set("_medusa_cache_id", cacheId, {
      maxAge: 60 * 60 * 24,
      httpOnly: true,
      secure: isSecure,
      sameSite: "lax", // Already using lax which is good for testing
    })
    
    // Add security headers
    const headers = createSecurityHeaders()
    Object.entries(headers).forEach(([key, value]) => {
      response.headers.set(key, value)
    })
    
    return response
  }

  // Redirect to relevant region if no country code is set
  if (!urlHasCountryCode && countryCode) {
    const locale = urlHasKnownLocale ? pathnameArr[1] : fallbackLng
    const pathAfterLocale = urlHasKnownLocale ? pathnameArr.slice(2).join("/") : pathnameArr.slice(1).join("/")
    const redirectUrl = `${request.nextUrl.origin}/${locale}/${countryCode}/${pathAfterLocale}${queryString}`
    const response = NextResponse.redirect(redirectUrl, 307)

    // Add security headers
  const headers = createSecurityHeaders()
  Object.entries(headers).forEach(([key, value]) => {
    response.headers.set(key, value)
  })

  return response
  }

  // Default case - just continue with intl middleware
  return intlMiddleware(request)
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files (images, assets, etc.)
     */
    "/((?!_next/static|_next/image|favicon.ico|images|assets|.*\\..*).*)",
  ],
}
