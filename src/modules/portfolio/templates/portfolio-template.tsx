"use client"

import { useState } from "react"
import { useLocale } from "next-intl"
import { motion } from "framer-motion"
import { Container } from "@modules/common/components/container"
import ProjectCard from "@modules/portfolio/components/project-card"
import {
  PortfolioCategory,
  PortfolioProjectListItem,
} from "@lib/data/portfolio"

type Props = {
  categories: PortfolioCategory[]
  projects: PortfolioProjectListItem[]
}

export default function PortfolioTemplate({ categories, projects }: Props) {
  const locale = useLocale()
  const isRTL = locale === "ar"
  const [activeSlug, setActiveSlug] = useState<string>("all")

  const filteredProjects =
    activeSlug === "all"
      ? projects
      : projects.filter((p) => p.category_slug === activeSlug)

  const pills = [
    { slug: "all", labelEn: "All Projects", labelAr: "كل المشاريع" },
    ...categories.map((c) => ({
      slug: c.slug,
      labelEn: c.name_en,
      labelAr: c.name_ar,
    })),
  ]

  return (
    <main dir={isRTL ? "rtl" : "ltr"} className="bg-white min-h-screen">
      {/* Hero — mobile: Figma 337:9093, desktop: Figma 286:9991 */}
      <section className="bg-white">
        {/* Expanded width and reduced padding to minimize side whitespace */}
        <Container className="!py-[44px] small:!py-[40px] !max-w-full !px-4 small:!px-6">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center gap-[16px] text-center"
          >
            <p
              className="text-[32px] small:text-[clamp(28px,2.5vw,40px)] leading-[1.2] text-[#17284A]"
              style={{ fontFamily: "var(--font-caveat)" }}
            >
              {isRTL ? "معرض أعمالنا" : "Our Portfolio"}
            </p>
            <h1 className="text-[24px] small:text-[48px] font-bold leading-[1.25] small:leading-[1.1] text-[#17284A]">
              {isRTL ? "مشاريع قمنا بتسليمها" : "Projects We've Delivered"}
            </h1>
            <p className="text-[16px] small:text-[20px] leading-[1.5] small:leading-[1.4] text-[#5D5D61] max-w-[760px]">
              {isRTL
                ? "اكتشف كيف تشارك كازانيست كبرى الفنادق والمؤسسات والجهات الحكومية والمرافق التعليمية في مصر في تصميم وتوريد وتسليم حلول متكاملة وعملية."
                : "Explore how Casanest partners with leading hotels, multinational corporate spaces, state institutions, and educational facilities across Egypt to design, supply, and deliver complete premium solutions."}
            </p>
          </motion.div>
        </Container>
      </section>

      {/* Filters — mobile: horizontal scroll, desktop: centered wrap */}
      <div
        // Reduced side padding here as well
        className="bg-white px-4 small:px-6 py-[12px] small:py-0 small:pb-8 small:flex small:justify-center"
        dir={isRTL ? "rtl" : "ltr"}
      >
        <div className="flex gap-[8px] small:gap-3 overflow-x-auto small:overflow-visible small:flex-wrap whitespace-nowrap small:whitespace-normal [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {pills.map((pill) => {
            const isActive = activeSlug === pill.slug
            const label = isRTL ? pill.labelAr : pill.labelEn
            return (
              <button
                key={pill.slug}
                onClick={() => setActiveSlug(pill.slug)}
                className={`px-[20px] py-[10px] rounded-[100px] text-[14px] font-medium transition-all shrink-0 small:shrink ${
                  isActive
                    ? "bg-[#17284a] text-white font-bold"
                    : "text-black small:border small:border-[#E5E7EB] small:text-[#5D5D61] small:hover:border-[#17284a] small:hover:text-[#17284a]"
                }`}
              >
                {label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Projects grid */}
      {/* Expanded width and reduced padding to match hero section */}
      <Container className="!py-[44px] small:!py-[80px] !max-w-full !px-4 small:!px-6">
        {filteredProjects.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-[#5D5D61] text-lg">
              {isRTL
                ? "لا توجد مشاريع في هذه الفئة حالياً."
                : "No projects in this category yet."}
            </p>
          </div>
        ) : (
          <motion.div
            layout
            // Depending on the screen width and card max-width, this could comfortably hold 3 or more cards now
            className="flex flex-col gap-[32px] small:grid small:grid-cols-3 small:gap-6 large:gap-8"
          >
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
              >
                <ProjectCard project={project} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </Container>
    </main>
  )
}