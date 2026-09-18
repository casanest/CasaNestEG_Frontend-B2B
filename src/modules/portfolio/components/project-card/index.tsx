"use client"

import { useLocale } from "next-intl"
import Image from "next/image"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { PortfolioProjectListItem } from "@lib/data/portfolio"

type Props = {
  project: PortfolioProjectListItem & { location_ar?: string; location_en?: string }
}

export default function ProjectCard({ project }: Props) {
  const locale = useLocale()
  const isRTL = locale === "ar"

  const title = isRTL ? project.title_ar : project.title_en
  const categoryName = isRTL
    ? project.category_name_ar
    : project.category_name_en

  const locationName = isRTL
    ? project.location_ar || "القاهرة، مصر"
    : project.location_en || "Cairo, Egypt"

  const formattedDate = new Date(project.project_date).toLocaleDateString(
    isRTL ? "ar-EG" : "en-US",
    { year: "numeric", month: "long" }
  )

  return (
    <LocalizedClientLink
      href={`/our-services/projects/${project.slug}`}
      // Increased max-width by ~20% (380px -> 460px)
      className="group flex flex-col bg-white border border-gray-100 rounded-[18px] shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300 w-full"
      dir={isRTL ? "rtl" : "ltr"}
    >
      {/* Image Container - Increased height by ~20% */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-gray-100">
        <Image
          src={project.hero_image_url}
          alt={title}
          fill
          sizes="(max-width: 1024px) 100vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        
        {/* Category Badge - Scaled up padding and text */}
        <div className="absolute bottom-3 small:bottom-[clamp(12px,1vw,20px)] start-3 small:start-[clamp(12px,1vw,20px)] bg-[#0c1c38] text-white flex items-center gap-2 px-3 small:px-[clamp(12px,1vw,18px)] py-2 small:py-[clamp(8px,0.6vw,12px)] rounded-[12px] shadow-sm">
          <svg className="w-[16px] h-[16px] small:w-[clamp(16px,1.1vw,20px)] small:h-[clamp(16px,1.1vw,20px)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 21h18M3 10h18M5 6l7-3 7 3v4H5V6zm2 4v7m4-7v7m4-7v7" />
          </svg>
          <span className="text-[13px] small:text-[clamp(13px,0.9vw,16px)] font-medium leading-none mt-0.5">
            {categoryName}
          </span>
        </div>
      </div>

      {/* Content Section - Increased padding, gap, and font sizes by ~20% */}
      <div className="flex flex-col p-5 small:p-[clamp(20px,1.5vw,32px)] gap-4 small:gap-[clamp(16px,1.2vw,24px)]">
        <h3 className="text-[18px] small:text-[clamp(18px,1.3vw,24px)] font-bold text-[#0c1c38] line-clamp-1">
          {title}
        </h3>
        
        <div className="flex flex-row items-center justify-between">
          
          {/* Meta Data (Location & Date) */}
          <div className="flex items-center gap-2 small:gap-3 text-[#6B7280] text-[13px] small:text-[clamp(13px,0.9vw,16px)]">
            {/* Location */}
            <div className="flex items-center gap-1.5">
              <svg className="w-[14px] h-[14px] small:w-[clamp(14px,1vw,18px)] small:h-[clamp(14px,1vw,18px)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 10c0 4.418-7 11-7 11s-7-6.582-7-11a7 7 0 1114 0z" />
              </svg>
              <span className="truncate max-w-[80px] small:max-w-[clamp(100px,8vw,180px)]">{locationName}</span>
            </div>

            {/* Divider */}
            <div className="h-4 w-[1px] bg-gray-300"></div>

            {/* Date */}
            <div className="flex items-center gap-1.5">
              <svg className="w-[14px] h-[14px] small:w-[clamp(14px,1vw,18px)] small:h-[clamp(14px,1vw,18px)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>{formattedDate}</span>
            </div>
          </div>

          {/* Action Button - Increased size by ~20% (40px -> 48px) */}
          <div className="h-[44px] w-[44px] small:h-[clamp(44px,3vw,56px)] small:w-[clamp(44px,3vw,56px)] rounded-full bg-[#0c1c38] flex shrink-0 items-center justify-center text-white transition-transform duration-300 group-hover:scale-110">
            {isRTL ? (
              <svg className="w-[18px] h-[18px] small:w-[clamp(18px,1.3vw,24px)] small:h-[clamp(18px,1.3vw,24px)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            ) : (
              <svg className="w-[18px] h-[18px] small:w-[clamp(18px,1.3vw,24px)] small:h-[clamp(18px,1.3vw,24px)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            )}
          </div>
          
        </div>
      </div>
    </LocalizedClientLink>
  )
}