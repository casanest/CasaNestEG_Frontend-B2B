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
      className="group flex flex-col gap-[12px]"
    >
      {/* Image — mobile: bg #efefef h-[422px], desktop: bg #f3f1ef h-[465px] */}
      <div className="relative h-[422px] small:h-[465px] overflow-hidden rounded-[16px] bg-[#efefef] small:bg-[#f3f1ef] border border-black/50">
        <Image
          src={project.hero_image_url}
          alt={title}
          fill
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      {/* Data bar — mobile: bg #f3f4f6, desktop: bg #e5e7eb */}
      <div
        className="flex items-center justify-between gap-4 rounded-[8px] bg-[#f3f4f6] small:bg-[#e5e7eb] p-[20px]"
        dir={isRTL ? "rtl" : "ltr"}
      >
        <h3 className="text-[20px] font-bold leading-[1.4] text-[#17284a]">
          {title}
        </h3>
        <div className="flex items-center gap-2 opacity-80 whitespace-nowrap">
          <span className="text-[18px] text-[#5d5d61] leading-[1.5]">
            {categoryName}
          </span>
          <span className="h-1 w-1 rounded-full bg-[#5d5d61]" />
          <span className="text-[18px] text-[#5d5d61] leading-[1.5]">
            {formattedDate}
          </span>
        </div>
      </div>
    </LocalizedClientLink>
  )
}
