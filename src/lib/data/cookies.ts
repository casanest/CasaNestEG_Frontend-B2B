import "server-only"
import { cookies as nextCookies } from "next/headers"

export const getAuthHeaders = async (): Promise<
  { authorization: string } | {}
> => {
  try {
    const cookies = await nextCookies()
    const token = cookies.get("_medusa_jwt")?.value

    if (!token) {
      return {}
    }

    return { authorization: `Bearer ${token}` }
  } catch (error: any) {
    // Only handle build-time errors, not runtime errors
    if (error?.message?.includes('cookies') && error?.message?.includes('request scope')) {
      // During build time (generateStaticParams), cookies are not available
      return {}
    }
    // Re-throw other errors as they might be legitimate runtime issues
    throw error
  }
}

export const getCacheTag = async (tag: string): Promise<string> => {
  try {
    const cookies = await nextCookies()
    const cacheId = cookies.get("_medusa_cache_id")?.value

    if (!cacheId) {
      return ""
    }

    return `${tag}-${cacheId}`
  } catch (error) {
    return ""
  }
}

export const getCacheOptions = async (
  tag: string
): Promise<{ tags: string[] } | {}> => {
  if (typeof window !== "undefined") {
    return {}
  }

  try {
    const cacheTag = await getCacheTag(tag)

    if (!cacheTag) {
      return {}
    }

    return { tags: [`${cacheTag}`] }
  } catch (error: any) {
    // Only handle build-time errors, not runtime errors
    if (error?.message?.includes('cookies') && error?.message?.includes('request scope')) {
      // During build time (generateStaticParams), cookies are not available
      return {}
    }
    // Re-throw other errors as they might be legitimate runtime issues
    throw error
  }
}

export const setAuthToken = async (token: string) => {
  const cookies = await nextCookies()
  cookies.set("_medusa_jwt", token, {
    maxAge: 60 * 60 * 24 * 7,
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
  })
}

export const removeAuthToken = async () => {
  const cookies = await nextCookies()
  cookies.set("_medusa_jwt", "", {
    maxAge: -1,
  })
}

export const getCartId = async () => {
  try {
    const cookies = await nextCookies()
    return cookies.get("_medusa_cart_id")?.value
  } catch (error: any) {
    // Only handle build-time errors, not runtime errors
    if (error?.message?.includes('cookies') && error?.message?.includes('request scope')) {
      // During build time (generateStaticParams), cookies are not available
      return undefined
    }
    // Re-throw other errors as they might be legitimate runtime issues
    throw error
  }
}

export const setCartId = async (cartId: string) => {
  const cookies = await nextCookies()
  cookies.set("_medusa_cart_id", cartId, {
    maxAge: 60 * 60 * 24 * 7,
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
  })
}

export const removeCartId = async () => {
  const cookies = await nextCookies()
  cookies.set("_medusa_cart_id", "", {
    maxAge: -1,
  })
}
