import type { HttpTypes } from "@medusajs/types"
import { type NextRequest, NextResponse } from "next/server"
import createIntlMiddleware from "next-intl/middleware"

import {
  createSecurityHeaders,
  handleApiRequest,
  isApiRoute,
  isStaticAsset,
  logRequest,
} from "./lib/middleware-utils"
import { fallbackLng, languages } from "./lib/i18n/settings"

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
      "proxy.ts: Error fetching regions. Did you set up regions in your Medusa Admin and define a MEDUSA_BACKEND_URL environment variable?",
    )
  }

  if (!PUBLISHABLE_API_KEY) {
    throw new Error(
      "proxy.ts: NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY environment variable is required",
    )
  }

  if (!regionMap.keys().next().value || regionMapUpdated < Date.now() - 3600 * 1000) {
    try {
      const response = await fetch(`${BACKEND_URL}/store/regions`, {
        headers: {
          "x-publishable-api-key": PUBLISHABLE_API_KEY,
        },
        next: {
          revalidate: 0,
          tags: [`regions-${cacheId}`],
        },
        cache: "no-store",
      })

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
      if (!regionMap.size) {
        throw error
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
      console.error("proxy.ts: Error getting the country code. Did you set up regions in your Medusa Admin?")
    }
    return DEFAULT_REGION
  }
}

export async function proxy(request: NextRequest) {
  const startTime = Date.now()

  try {
    logRequest(request)

    if (isStaticAsset(request)) {
      return NextResponse.next()
    }

    if (isApiRoute(request)) {
      return await handleApiRequest(request)
    }

    return await handlePageRequest(request)
  } catch (error) {
    console.error("Proxy error:", error)

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

    return NextResponse.next()
  } finally {
    const duration = Date.now() - startTime
    if (duration > 1000) {
      console.warn(`Slow proxy execution: ${duration}ms for ${request.nextUrl.pathname}`)
    }
  }
}

async function handlePageRequest(request: NextRequest) {
  const pathnameArr = request.nextUrl.pathname.split("/")
  const urlHasKnownLocale = languages.includes(
    pathnameArr[1] as (typeof languages)[number],
  )

  const urlHasUnknownLocale =
    !urlHasKnownLocale && pathnameArr[1]?.length === 2 && (pathnameArr?.[2] ? pathnameArr[2].length === 2 : true)

  const cacheIdCookie = request.cookies.get("_medusa_cache_id")
  const cacheId = cacheIdCookie?.value || crypto.randomUUID()

  const regionMap = await getRegionMap(cacheId)
  const countryCodePathnameIndex = urlHasKnownLocale ? 2 : 1
  const countryCode = regionMap && (await getCountryCode(request, regionMap, countryCodePathnameIndex))

  const urlHasCountryCode = countryCode && request.nextUrl.pathname.split("/")[countryCodePathnameIndex] === countryCode
  const queryString = request.nextUrl.search ? request.nextUrl.search : ""

  if (urlHasUnknownLocale) {
    const remainingPath = pathnameArr.slice(1).join("/")
    const redirectUrl = `${request.nextUrl.origin}/${fallbackLng}/${remainingPath}${queryString}`
    const response = NextResponse.redirect(redirectUrl, 307)

    const headers = createSecurityHeaders()
    Object.entries(headers).forEach(([key, value]) => {
      response.headers.set(key, value)
    })

    return response
  }

  if (urlHasCountryCode && cacheIdCookie) {
    return intlMiddleware(request)
  }

  if (urlHasCountryCode && !cacheIdCookie) {
    const response = NextResponse.next()
    response.cookies.set("_medusa_cache_id", cacheId, {
      maxAge: 60 * 60 * 24,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    })

    const headers = createSecurityHeaders()
    Object.entries(headers).forEach(([key, value]) => {
      response.headers.set(key, value)
    })

    return response
  }

  if (!urlHasCountryCode && countryCode) {
    const locale = urlHasKnownLocale ? pathnameArr[1] : fallbackLng
    const pathAfterLocale = urlHasKnownLocale ? pathnameArr.slice(2).join("/") : pathnameArr.slice(1).join("/")
    const redirectUrl = `${request.nextUrl.origin}/${locale}/${countryCode}/${pathAfterLocale}${queryString}`
    const response = NextResponse.redirect(redirectUrl, 307)

    const headers = createSecurityHeaders()
    Object.entries(headers).forEach(([key, value]) => {
      response.headers.set(key, value)
    })

    return response
  }

  return intlMiddleware(request)
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|images|assets|.*\\..*).*)"],
}
