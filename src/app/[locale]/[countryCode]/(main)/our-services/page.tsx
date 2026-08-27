import { Metadata } from "next"
import PortfolioTemplate from "@modules/portfolio/templates/portfolio-template"
import { listAllPortfolioProjects } from "@lib/data/portfolio"

export const metadata: Metadata = {
  title: "Projects | CASANEST",
  description:
    "Explore projects delivered by CASANEST across hotels, offices, and more.",
}

export default async function OurServicesPage() {
  let categories: Awaited<
    ReturnType<typeof listAllPortfolioProjects>
  >["categories"] = []
  let projects: Awaited<
    ReturnType<typeof listAllPortfolioProjects>
  >["projects"] = []

  try {
    const data = await listAllPortfolioProjects()
    categories = data.categories
    projects = data.projects
  } catch (error) {
    console.error("[portfolio] Failed to fetch projects:", error)
  }

  return <PortfolioTemplate categories={categories} projects={projects} />
}
