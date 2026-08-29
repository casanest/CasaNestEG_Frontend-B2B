import { sdk } from "@lib/config"

// ─── Types ───

export interface PortfolioCategory {
  id: string
  slug: string
  name_en: string
  name_ar: string
  created_at?: string
  updated_at?: string
}

export interface PortfolioProjectListItem {
  id: string
  slug: string
  title_en: string
  title_ar: string
  location_en: string
  location_ar: string
  hero_image_url: string
  project_date: string
  is_in_homepage: boolean
  category_slug?: string
  category_name_en?: string
  category_name_ar?: string
}

export interface PortfolioMetric {
  id: string
  label_en: string
  label_ar: string
  value_en: string
  value_ar: string
  display_order: number
}

export interface PortfolioSubParagraph {
  id: string
  heading_en: string
  heading_ar: string
  text_en: string
  text_ar: string
  image_url: string
  image_url_2?: string
  display_order: number
}

export interface PortfolioGalleryImage {
  id: string
  image_url: string
  display_order: number
}

export interface PortfolioProjectDetail {
  id: string
  category_id: string
  slug: string
  title_en: string
  title_ar: string
  location_en: string
  location_ar: string
  hero_image_url: string
  project_date: string
  is_in_homepage: boolean
  quote_en?: string
  quote_ar?: string
  position_en?: string
  position_ar?: string
  created_at: string
  updated_at: string
  category: PortfolioCategory | null
  metrics: PortfolioMetric[]
  sub_paragraphs: PortfolioSubParagraph[]
  gallery_images: PortfolioGalleryImage[]
}

interface CategoriesResponse {
  categories: PortfolioCategory[]
}

interface ProjectsByCategoryResponse {
  category: PortfolioCategory
  projects: PortfolioProjectListItem[]
  count: number
  page: number
  limit: number
}

// ─── Fetch functions ───

export async function listPortfolioCategories(): Promise<PortfolioCategory[]> {
  const { categories } = await sdk.client.fetch<CategoriesResponse>(
    "/store/portfolio/categories",
    {
      next: { revalidate: 3600 },
    }
  )
  return categories
}

export async function listProjectsByCategory(
  slug: string
): Promise<ProjectsByCategoryResponse> {
  return sdk.client.fetch<ProjectsByCategoryResponse>(
    `/store/portfolio/categories/${slug}/projects?limit=100`,
    {
      next: { revalidate: 3600 },
    }
  )
}

export async function listAllPortfolioProjects(): Promise<{
  categories: PortfolioCategory[]
  projects: PortfolioProjectListItem[]
}> {
  const categories = await listPortfolioCategories()

  const results = await Promise.all(
    categories.map((cat) => listProjectsByCategory(cat.slug))
  )

  const projects: PortfolioProjectListItem[] = []

  for (const result of results) {
    for (const project of result.projects) {
      projects.push({
        ...project,
        category_slug: result.category.slug,
        category_name_en: result.category.name_en,
        category_name_ar: result.category.name_ar,
      })
    }
  }

  projects.sort(
    (a, b) =>
      new Date(b.project_date).getTime() - new Date(a.project_date).getTime()
  )

  return { categories, projects }
}

interface ProjectDetailResponse {
  project: PortfolioProjectDetail
}

export async function getPortfolioProject(
  slug: string
): Promise<PortfolioProjectDetail> {
  const { project } = await sdk.client.fetch<ProjectDetailResponse>(
    `/store/portfolio/projects/${slug}`,
    {
      next: { revalidate: 3600 },
    }
  )
  return project
}
