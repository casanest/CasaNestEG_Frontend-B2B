import { useTranslations } from "next-intl"
import { ArrowRight } from "lucide-react"
import { PortfolioProjectListItem } from "@lib/data/portfolio"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import ProjectCard from "@modules/portfolio/components/project-card"

type OurWorkProps = {
  projects: PortfolioProjectListItem[]
  locale: string
  dir: string
}

export default function OurWork({ projects, locale, dir }: OurWorkProps) {
  const t = useTranslations("home.ourWork")
  const isRTL = locale === "ar"

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
      <div className="md:hidden flex gap-[16px] overflow-x-auto scrollbar-hide snap-x w-full pb-2 [zoom:0.9]">
        {projects.slice(0, 4).map((project, idx) => (
          <div
            key={project.id || idx}
            className="w-[85vw] max-w-[380px] shrink-0 snap-center"
          >
            <ProjectCard project={project} />
          </div>
        ))}
      </div>
      <div className="hidden md:grid grid-cols-2 gap-[clamp(20px,2.4vw,32px)] w-full max-w-[calc(63vw+389px)] [zoom:0.9]">
        {projects.slice(0, 4).map((project, idx) => (
          <ProjectCard key={project.id || idx} project={project} />
        ))}
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
