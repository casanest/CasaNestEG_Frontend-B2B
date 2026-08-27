import { Metadata } from "next"
import { notFound } from "next/navigation"
import { getPortfolioProject } from "@lib/data/portfolio"
import ProjectDetailTemplate from "@modules/portfolio/templates/project-detail-template"

type Props = {
  params: Promise<{ slug: string; locale: string; countryCode: string }>
}

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const { slug, locale } = await params
  try {
    const project = await getPortfolioProject(slug)
    const title = locale === "ar" ? project.title_ar : project.title_en
    return {
      title: `${title} | CASANEST`,
      description: locale === "ar" ? project.title_ar : project.title_en,
    }
  } catch {
    return { title: "Project | CASANEST" }
  }
}

export default async function ProjectDetailPage({ params }: Props) {
  const { slug } = await params

  let project
  try {
    project = await getPortfolioProject(slug)
  } catch (error) {
    console.error("[portfolio] Failed to fetch project:", error)
    notFound()
  }

  if (!project) {
    notFound()
  }

  return <ProjectDetailTemplate project={project} />
}
