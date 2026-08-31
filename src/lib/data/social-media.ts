import { sdk } from "@lib/config"

export type SocialMediaLink = {
  id: string
  platform: string
  url: string
  label: string | null
  display_order: number
}

export type SocialMediaResponse = {
  socialMedia: SocialMediaLink[]
}

export async function listSocialMedia(): Promise<SocialMediaLink[]> {
  try {
    const response = await sdk.client.fetch<SocialMediaResponse>("/store/social-media", {
      method: "GET",
      cache: "no-store",
    })

    if (!response || !response.socialMedia) {
      return []
    }

    return response.socialMedia
  } catch {
    return []
  }
}
