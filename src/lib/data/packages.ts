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
  is_in_homepage?: boolean
}

export type PackagesResponse = {
  packages: Package[]
}

export async function listPackages(homepage?: boolean): Promise<Package[]> {
  const query: Record<string, string> = {}
  if (homepage) {
    query.homepage = "true"
  }

  const response = await sdk.client.fetch<PackagesResponse>("/store/packages", {
    method: "GET",
    query,
    next: { revalidate: 300 },
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
      description_en: string | null
      description_ar: string | null
      moq: number | null
      price: {
        amount: number
        currency_code: string
      } | null
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
        next: { revalidate: 300 },
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
