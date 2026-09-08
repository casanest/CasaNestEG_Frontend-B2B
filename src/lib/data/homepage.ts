import { sdk } from "@lib/config"
import { cache } from "react"
import type { HttpTypes } from "@medusajs/types"

export type HomepageBanner = {
  id: string
  image_url: string
  type: string
  display_order: number
}

export type HomepagePackage = {
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

export type HomepagePortfolioCategory = {
  id: string
  slug: string
  name_en: string
  name_ar: string
  created_at: string
  updated_at: string
}

export type HomepagePortfolioProject = {
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

export type HomepageTestimonial = {
  id: string
  name_en: string
  name_ar: string
  image_url: string
  quote_en: string
  quote_ar: string
  position_en: string
  position_ar: string
  display_order: number
  is_in_homepage: boolean
}

export type HomepageData = {
  banners: {
    hero: HomepageBanner[]
    past_customer: HomepageBanner[]
    partners: HomepageBanner[]
  }
  packages: HomepagePackage[]
  portfolio: {
    categories: HomepagePortfolioCategory[]
    projects: HomepagePortfolioProject[]
  }
  testimonials: HomepageTestimonial[]
}

export const getHomepageData = cache(async (): Promise<HomepageData> => {
  const response = await sdk.client.fetch<HomepageData>(
    "/store/homepage",
    {
      method: "GET",
      next: { revalidate: 0, tags: ["banners", "packages", "portfolio", "testimonials", "products"] },
    }
  )

  return response
})
