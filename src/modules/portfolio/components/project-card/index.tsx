"use client"

import { useLocale } from "next-intl"
import Image from "next/image"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { PortfolioProjectListItem } from "@lib/data/portfolio"

type Props = {
  project: PortfolioProjectListItem
}

export default function ProjectCard({ project }: Props) {
  const locale = useLocale()
  const isRTL = locale === "ar"

  const title = isRTL ? project.title_ar : project.title_en
  const categoryName = isRTL
    ? project.category_name_ar
    : project.category_name_en

  const formattedDate = new Date(project.project_date).toLocaleDateString(
    isRTL ? "ar-EG" : "en-US",
    { year: "numeric", month: "long" }
  )

  return (
    <LocalizedClientLink
      href={`/our-services/projects/${project.slug}`}
      className="group flex flex-col gap-[8px]"
    >
      {/* Image */}
      <div className="relative h-[260px] small:h-[300px] overflow-hidden rounded-[12px] small:rounded-[16px] bg-[#efefef] small:bg-[#f3f1ef] border border-black/50">
        <Image
          src={project.hero_image_url}
          alt={title}
          fill
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      {/* Data bar — Figma Frame 48 */}
      <div
        className="flex flex-row justify-between items-center gap-[8px] rounded-[8px] bg-[#F3F4F6] p-[20px] h-[66px]"
        dir={isRTL ? "rtl" : "ltr"}
      >
        <h3 className="text-[14px] small:text-[16px] font-bold leading-[1.4] text-[#17284a] whitespace-nowrap">
          {title}
        </h3>
        <div className="flex items-center gap-[8px] opacity-80 whitespace-nowrap">
          <span className="text-[12px] small:text-[14px] text-[#5d5d61] leading-[1.5]">
            {categoryName}
          </span>
          <span className="h-1 w-1 rounded-full bg-[#5d5d61]" />
          <span className="text-[12px] small:text-[14px] text-[#5d5d61] leading-[1.5]">
            {formattedDate}
          </span>
        </div>
      </div>
    </LocalizedClientLink>
  )
}
