import { sdk } from "@lib/config"
import { cache } from "react"

export type SiteLayoutCategory = {
  id: string
  name_en: string
  name_ar: string
  description_en: string
  description_ar: string
  handle_en: string
  handle_ar: string
  image_url: string | null
  available_languages: string[]
  parent_category_id: string | null
}

export type SiteLayoutCollection = {
  id: string
  name_en: string
  name_ar: string
  handle_en: string
  handle_ar: string
}

export type SiteLayoutPackage = {
  id: string
  slug: string
  name_en: string
  name_ar: string
  description_en: string | null
  description_ar: string | null
  image_url: string | null
  is_in_homepage: boolean
  item_count: number
}

export type SiteLayoutPortfolioCategory = {
  id: string
  slug: string
  name_en: string
  name_ar: string
  created_at: string
  updated_at: string
}

export type SiteLayoutPortfolioProject = {
  id: string
  slug: string
  title_en: string
  title_ar: string
  location_en: string
  location_ar: string
  hero_image_url: string
  project_date: string
  is_in_homepage: boolean
  category_id: string
  category_slug: string
  category_name_en: string
  category_name_ar: string
}

export type SiteLayoutSocialMedia = {
  id: string
  platform: string
  url: string
  label: string | null
  description: string | null
  display_order: number
}

export type SiteLayoutData = {
  categories: SiteLayoutCategory[]
  collections: SiteLayoutCollection[]
  packages: SiteLayoutPackage[]
  portfolio: {
    categories: SiteLayoutPortfolioCategory[]
    projects: SiteLayoutPortfolioProject[]
  }
  social_media: SiteLayoutSocialMedia[]
}

export const getSiteLayout = cache(async (): Promise<SiteLayoutData> => {
  const response = await sdk.client.fetch<SiteLayoutData>(
    "/store/site-layout",
    {
      method: "GET",
      next: { revalidate: 0, tags: ["packages", "portfolio", "products"] },
    }
  )

  return response
})
