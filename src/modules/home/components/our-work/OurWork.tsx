import { useTranslations, useLocale } from "next-intl"
import { ArrowRight } from "lucide-react"
import { PortfolioProjectListItem } from "@lib/data/portfolio"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

type OurWorkProps = {
  projects: PortfolioProjectListItem[]
  locale: string
  dir: string
}

export default function OurWork({ projects, locale, dir }: OurWorkProps) {
  const t = useTranslations("home.ourWork")
  const isRTL = locale === "ar"

  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr)
      return date.toLocaleDateString(locale === "ar" ? "ar-EG" : "en-US", {
        month: "long",
        year: "numeric",
      })
    } catch {
      return dateStr
    }
  }

  return (
    <section
      className="bg-white flex flex-col gap-[24px] md:gap-[clamp(30px,4vw,60px)] items-start md:items-center justify-center min-h-[80svh] px-[16px] md:px-[clamp(16px,4vw,60px)] py-[44px] md:py-[clamp(40px,5vw,80px)] w-full"
      dir={dir}
    >
      {/* Header */}
      <div className="flex flex-col gap-[8px] md:gap-[clamp(10px,1vw,16px)] items-center text-center w-full">
        <div className="flex flex-col gap-[8px] md:gap-[clamp(6px,0.6vw,8px)] items-center">
          <p className="font-caveat text-[#17284a] text-[32px] md:text-[clamp(28px,2.5vw,40px)] leading-[1.2]">
            {t("eyebrow")}
          </p>
          <h2 className="text-black text-[24px] md:text-[clamp(24px,2.8vw,40px)] leading-[1.18] font-medium max-w-[900px]">
            {t("title")}
          </h2>
        </div>
        <p className="text-black/80 text-[16px] md:text-[clamp(14px,1.6vw,24px)] leading-[1.3] max-w-[734px] md:max-w-[1200px]">
          {t("description")}
        </p>
      </div>

      {/* Project cards - horizontal scroll on mobile, 2x2 grid on desktop */}
      <div className="md:hidden flex gap-[16px] overflow-x-auto scrollbar-hide snap-x w-full pb-2">
        {projects.slice(0, 4).map((project, idx) => (
          <ProjectCard
            key={project.id || idx}
            project={project}
            locale={locale}
            formatDate={formatDate}
            mobile
          />
        ))}
      </div>
      <div className="hidden md:flex flex-col gap-[clamp(20px,2.4vw,32px)] w-full max-w-[calc(63vw+389px)]">
        {projects.slice(0, 4).length > 0 && (
          <>
            <div className="flex gap-[clamp(20px,2.4vw,32px)] w-full">
              {projects.slice(0, 2).map((project, idx) => (
                <ProjectCard
                  key={project.id || idx}
                  project={project}
                  locale={locale}
                  formatDate={formatDate}
                />
              ))}
            </div>
            {projects.length > 2 && (
              <div className="flex gap-[clamp(20px,2.4vw,32px)] w-full">
                {projects.slice(2, 4).map((project, idx) => (
                  <ProjectCard
                    key={project.id || idx}
                    project={project}
                    locale={locale}
                    formatDate={formatDate}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Explore all button - full width on mobile */}
      <LocalizedClientLink
        href="/our-services"
        className="group border border-black flex gap-[8px] items-center justify-center px-[20px] md:px-[clamp(20px,2.5vw,36px)] py-[20px] md:py-[clamp(16px,1.6vw,24px)] rounded-[16px] w-full md:w-[clamp(160px,16vw,240px)] hover:bg-[#17284a] hover:text-white hover:border-[#17284a] transition-colors"
      >
        <span className="text-black text-[16px] md:text-[clamp(13px,1vw,14px)] font-medium group-hover:text-white">
          {t("exploreAllCta")}
        </span>
        <ArrowRight className={`w-[20px] h-[20px] md:w-[clamp(16px,1.3vw,20px)] md:h-[clamp(16px,1.3vw,20px)] text-black group-hover:text-white ${isRTL ? "rotate-180" : ""}`} />
      </LocalizedClientLink>
    </section>
  )
}

function ProjectCard({
  project,
  locale,
  formatDate,
  mobile = false,
}: {
  project: PortfolioProjectListItem
  locale: string
  formatDate: (d: string) => string
  mobile?: boolean
}) {
  const title = locale === "ar" ? project.title_ar : project.title_en
  const category =
    locale === "ar"
      ? project.category_name_ar || ""
      : project.category_name_en || ""

  if (mobile) {
    return (
      <LocalizedClientLink
        href={`/our-services/projects/${project.slug}`}
        className="flex flex-col gap-[8px] w-[256px] shrink-0 snap-center"
      >
        {/* Image */}
        <div className="bg-[#f3f1ef] border border-black/50 h-[180px] rounded-[12px] overflow-hidden relative">
          <img
            src={project.hero_image_url}
            alt={title || ""}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Info bar */}
        <div className="bg-[#e5e7eb] flex items-center justify-between p-[8px] rounded-[8px]">
          <span className="text-black text-[11px] font-medium leading-[1.3] truncate">
            {title}
          </span>
          <div className="flex gap-[4px] items-center opacity-80 shrink-0">
            <span className="text-black text-[9px] truncate">{category}</span>
            <span className="w-1 h-1 rounded-full bg-black shrink-0" />
            <span className="text-black text-[9px] shrink-0">
              {formatDate(project.project_date)}
            </span>
          </div>
        </div>
      </LocalizedClientLink>
    )
  }

  return (
    <LocalizedClientLink
      href={`/our-services/projects/${project.slug}`}
      className="flex flex-col gap-[8px] flex-1 min-w-0"
    >
      {/* Image */}
      <div className="bg-[#f3f1ef] border border-black/50 h-[clamp(180px,21.6vw,306px)] rounded-[12px] overflow-hidden relative">
        <img
          src={project.hero_image_url}
          alt={title || ""}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Info bar */}
      <div className="bg-[#e5e7eb] flex items-center justify-between p-[clamp(10px,1vw,14px)] rounded-[8px]">
        <span className="text-black text-[clamp(13px,1.3vw,18px)] font-medium leading-[1.3]">
          {title}
        </span>
        <div className="flex gap-[6px] items-center opacity-80">
          <span className="text-black text-[clamp(11px,1vw,14px)]">{category}</span>
          <span className="w-1 h-1 rounded-full bg-black" />
          <span className="text-black text-[clamp(11px,1vw,14px)]">
            {formatDate(project.project_date)}
          </span>
        </div>
      </div>
    </LocalizedClientLink>
  )
}
