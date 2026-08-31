import { sdk } from "@lib/config"

export type Banner = {
  id: string
  image_url: string
  type: string
  display_order: number
}

export type BannerResponse = {
  banners: Banner[]
}

export async function listBanners(type?: string): Promise<Banner[]> {
  try {
    const response = await sdk.client.fetch<BannerResponse>(
      "/store/banners",
      {
        method: "GET",
        cache: "no-store",
      }
    )

    if (!response || !response.banners) {
      return []
    }

    if (type) {
      return response.banners.filter((b) => b.type === type)
    }

    return response.banners
  } catch {
    return []
  }
}
