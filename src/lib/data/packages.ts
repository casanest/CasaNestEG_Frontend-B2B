import { sdk } from "@lib/config"

export type Package = {
  id: string
  slug: string
  name_en: string
  name_ar: string
  description_en: string | null
  description_ar: string | null
  image_url: string | null
  item_count?: number | null
}

export type PackagesResponse = {
  packages: Package[]
}

export async function listPackages(): Promise<Package[]> {
  const response = await sdk.client.fetch<PackagesResponse>("/store/packages", {
    method: "GET",
    cache: "no-store",
  })

  if (!response || !response.packages) {
    return []
  }

  return response.packages
}

export type PackageDetail = {
  id: string
  slug: string
  name_en: string
  name_ar: string
  description_en: string | null
  description_ar: string | null
  image_url: string | null
  titles: {
    id: string
    name_en: string
    name_ar: string
    display_order: number
    products: {
      id: string
      title: string
      handle: string
      thumbnail: string | null
      status: string
      metadata: Record<string, unknown> | null
    }[]
  }[]
}

export type PackageDetailResponse = {
  package: PackageDetail
}

export async function getPackageBySlug(slug: string): Promise<PackageDetail | null> {
  try {
    const response = await sdk.client.fetch<PackageDetailResponse>(
      `/store/packages/${slug}`,
      {
        method: "GET",
        cache: "no-store",
      }
    )

    if (!response || !response.package) {
      return null
    }

    return response.package
  } catch {
    return null
  }
}
