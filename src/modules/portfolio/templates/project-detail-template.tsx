"use client"

import { useState, useCallback, useEffect } from "react"
import { useLocale } from "next-intl"
import Image from "next/image"
import { motion } from "framer-motion"
import { User, TrendingDown, Shield, Clock, X, ChevronLeft, ChevronRight } from "lucide-react"
import { Container } from "@modules/common/components/container"
import { PortfolioProjectDetail } from "@lib/data/portfolio"

type Props = {
  project: PortfolioProjectDetail
}

const benefits = [
  {
    icon: User,
    titleEn: "Single Point of Contact",
    titleAr: "نقطة اتصال واحدة",
    descEn:
      "One dedicated project manager coordinating design, manufacture, and handover seamlessly",
    descAr:
      "مدير مشروع مخصص واحد ينسق التصميم والتصنيع والتسليم بسلاسة",
  },
  {
    icon: TrendingDown,
    titleEn: "Cost Efficiency",
    titleAr: "كفاءة التكلفة",
    descEn:
      "22% average savings vs. fragmented multi-vendor procurement models",
    descAr: "متوسط توفير 22% مقارنة بنماذج الشراء متعددة الموردين المجزأة",
  },
  {
    icon: Shield,
    titleEn: "Quality Assurance",
    titleAr: "ضمان الجودة",
    descEn:
      "Strict factory inspections and pre-delivery QC on every single bespoke item",
    descAr:
      "تفتيش مصنع صارم ومراقبة جودة ما قبل التسليم على كل عنصر مخصص",
  },
  {
    icon: Clock,
    titleEn: "Timeline Guarantee",
    titleAr: "ضمان الجدول الزمني",
    descEn:
      "Contractual delivery commitment backed by milestone tracking",
    descAr: "التزام تسليم تعاقدي مدعوم بتتبع المعالم",
  },
]

export default function ProjectDetailTemplate({ project }: Props) {
  const locale = useLocale()
  const isRTL = locale === "ar"
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  const galleryImages = project.gallery_images
  const isOpen = lightboxIndex !== null

  const closeLightbox = useCallback(() => setLightboxIndex(null), [])
  const goPrev = useCallback(
    () =>
      setLightboxIndex((prev) =>
        prev === null
          ? null
          : (prev - 1 + galleryImages.length) % galleryImages.length
      ),
    [galleryImages.length]
  )
  const goNext = useCallback(
    () =>
      setLightboxIndex((prev) =>
        prev === null ? null : (prev + 1) % galleryImages.length
      ),
    [galleryImages.length]
  )

  useEffect(() => {
    if (!isOpen) return
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox()
      if (e.key === "ArrowLeft") goPrev()
      if (e.key === "ArrowRight") goNext()
    }
    document.body.style.overflow = "hidden"
    window.addEventListener("keydown", handleKey)
    return () => {
      document.body.style.overflow = ""
      window.removeEventListener("keydown", handleKey)
    }
  }, [isOpen, closeLightbox, goPrev, goNext])

  const title = isRTL ? project.title_ar : project.title_en
  const location = isRTL ? project.location_ar : project.location_en
  const categoryName = project.category
    ? isRTL
      ? project.category.name_ar
      : project.category.name_en
    : ""

  const subtitle = `${categoryName} — ${location}`

  return (
    <main
      dir={isRTL ? "rtl" : "ltr"}
      className="bg-white min-h-screen"
    >
      {/* ─── 1. Hero & Header ─── */}
      <section className="bg-white">
        <Container className="!py-[44px] small:!py-[80px]">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col gap-[24px] small:gap-[40px] items-start"
          >
            <div className="flex flex-col gap-[12px] small:gap-[8px] w-full">
              <h1 className="text-[32px] small:text-[56px] font-bold small:font-medium leading-[1.2] small:leading-[1.1] text-[#17284A]">
                {title}
              </h1>
              <p className="text-[16px] small:text-[20px] leading-[1.5] small:leading-[1.4] text-[#5D5D61]">
                {subtitle}
              </p>
            </div>
            <div className="relative h-[260px] small:h-[620px] w-full overflow-hidden rounded-[16px] small:rounded-[24px] border border-[#E5E7EB]">
              <Image
                src={project.hero_image_url}
                alt={title}
                fill
                sizes="100vw"
                className="object-cover"
                priority
              />
            </div>
          </motion.div>
        </Container>
      </section>

      {/* ─── 2. Key Metrics ─── */}
      {project.metrics.length > 0 && (
        <section className="bg-[#051026]">
          <div className="px-4 small:px-14 py-[20px] small:py-[32px]">
            <div className="flex flex-wrap gap-[16px] small:gap-0 small:flex-nowrap small:items-center">
              {project.metrics.map((metric, index) => (
                <div key={metric.id} className="contents">
                  <div className="flex flex-col gap-[6px] small:gap-[10px] items-center justify-center w-[calc(50%-8px)] small:w-auto small:flex-1">
                    <p className="text-[28px] small:text-[48px] font-bold small:font-medium leading-[1.1] text-white text-center">
                      {isRTL ? metric.value_ar : metric.value_en}
                    </p>
                    <p className="text-[14px] small:text-[18px] font-medium small:font-normal leading-[1.5] text-[#9CA3AF] text-center">
                      {isRTL ? metric.label_ar : metric.label_en}
                    </p>
                  </div>
                  {index < project.metrics.length - 1 && (
                    <div className="hidden small:block w-px self-stretch bg-white/10" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── 3. Sub-paragraphs (Overview / Challenge / Solution / ...) ─── */}
      {project.sub_paragraphs.map((para, index) => {
        const heading = isRTL ? para.heading_ar : para.heading_en
        const rawText = isRTL ? para.text_ar : para.text_en
        const paragraphs = rawText.split("\n").filter((t) => t.trim())
        const isEven = index % 2 === 0
        const isOverview = index === 0

        return (
          <section
            key={para.id}
            className={isOverview ? "bg-white" : "bg-[#F8F9FA]"}
          >
            <Container className="!py-[44px] small:!py-[80px]">
              <div
                className={`flex flex-col gap-[24px] small:gap-[60px] small:items-center ${
                  isEven ? "small:flex-row" : "small:flex-row-reverse"
                }`}
              >
                {/* Text side */}
                <div className="flex flex-col gap-[20px] small:gap-[24px] flex-1">
                  <h2 className="text-[24px] small:text-[40px] font-bold small:font-medium leading-[normal] small:leading-[1.18] text-[#17284A]">
                    {heading}
                  </h2>
                  {paragraphs.map((text, i) => (
                    <p
                      key={i}
                      className="text-[16px] small:text-[18px] leading-[1.5] text-[#5D5D61]"
                    >
                      {text}
                    </p>
                  ))}
                </div>
                {/* Image side */}
                {para.image_url && (
                  <div className="flex-1 w-full">
                    <div className="relative h-[240px] small:h-[400px] w-full overflow-hidden rounded-[12px] small:rounded-[16px] border border-[#E5E7EB]">
                      <Image
                        src={para.image_url}
                        alt={heading}
                        fill
                        sizes="(max-width: 1024px) 100vw, 50vw"
                        className="object-cover"
                      />
                    </div>
                  </div>
                )}
              </div>
            </Container>
          </section>
        )
      })}

      {/* ─── 4. Client Benefits (static) ─── */}
      <section className="bg-[#F8F9FA]">
        <Container className="!py-[44px] small:!py-[80px]">
          <div className="flex flex-col gap-[32px] small:gap-[40px]">
            <div className="flex flex-col gap-[8px] small:gap-[12px] items-start small:items-center text-start small:text-center">
              <h2 className="text-[24px] small:text-[40px] font-bold small:font-medium leading-[normal] small:leading-[1.18] text-[#17284A]">
                {isRTL ? "فوائد العميل" : "Client Benefits"}
              </h2>
              <p className="text-[15px] small:text-[18px] leading-[1.4] small:leading-[1.5] text-[#5D5D61] max-w-[640px]">
                {isRTL
                  ? "كيف يترجم إطار التوريد والتصميم المتكامل لدينا إلى قيمة حقيقية للمشاريع المتميزة"
                  : "How our integrated supply and design framework translates to real value for premium projects"}
              </p>
            </div>
            <div className="flex flex-col gap-[16px] small:grid small:grid-cols-4 small:gap-[24px]">
              {benefits.map((benefit) => {
                const Icon = benefit.icon
                return (
                  <div
                    key={benefit.titleEn}
                    className="bg-white border border-[#E5E7EB] rounded-[12px] small:rounded-[16px] p-[20px] small:p-[32px] flex flex-col gap-[12px] small:gap-[16px]"
                  >
                    <div className="bg-[#DCE3F0] rounded-[10px] small:rounded-[12px] flex items-center justify-center size-[40px] small:size-[48px] shrink-0">
                      <Icon className="size-[20px] small:size-[24px] text-[#17284A]" />
                    </div>
                    <div className="flex flex-col gap-[4px] small:gap-[8px]">
                      <h3 className="text-[16px] small:text-[20px] font-bold leading-[normal] small:leading-[1.4] text-[#17284A]">
                        {isRTL ? benefit.titleAr : benefit.titleEn}
                      </h3>
                      <p className="text-[14px] small:text-[16px] leading-[1.4] small:leading-[1.5] text-[#5D5D61]">
                        {isRTL ? benefit.descAr : benefit.descEn}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </Container>
      </section>

      {/* ─── 5. Project Gallery ─── */}
      {project.gallery_images.length > 0 && (
        <section className="bg-white">
          <Container className="!py-[44px] small:!py-[80px]">
            <div className="flex flex-col gap-[32px] small:gap-[40px]">
              <div className="flex flex-col gap-[8px] small:gap-[12px] items-start small:items-center text-start small:text-center">
                <h2 className="text-[24px] small:text-[40px] font-bold small:font-medium leading-[normal] small:leading-[1.18] text-[#17284A]">
                  {isRTL ? "معرض المشروع" : "Project Gallery"}
                </h2>
                <p className="text-[15px] small:text-[18px] leading-[1.4] small:leading-[1.5] text-[#5D5D61] max-w-[640px]">
                  {isRTL
                    ? "جولة بصرية في المساحات المتميزة المتنوعة التي تم تسليمها"
                    : "A visual walk through the diverse premium spaces delivered"}
                </p>
              </div>
              <div className="flex flex-wrap gap-[16px] small:grid small:grid-cols-3 small:gap-[24px]">
                {galleryImages.map((image, idx) => (
                  <button
                    key={image.id}
                    onClick={() => setLightboxIndex(idx)}
                    className="relative h-[130px] w-[calc(50%-8px)] small:w-auto small:h-[320px] overflow-hidden rounded-[12px] small:rounded-[16px] border border-[#E5E7EB] cursor-zoom-in group"
                  >
                    <Image
                      src={image.image_url}
                      alt={`${title} gallery`}
                      fill
                      sizes="(max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </button>
                ))}
              </div>
            </div>
          </Container>
        </section>
      )}

      {/* ─── Lightbox (white popup, same style as product images) ─── */}
      {isOpen && lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-[9999] bg-black/60 flex items-center justify-center p-4"
          onClick={closeLightbox}
        >
          <div
            className="bg-white rounded-[16px] p-4 flex flex-col gap-4 max-w-[1200px] w-full max-h-[90vh] relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeLightbox}
              className="absolute -top-3 -right-3 z-20 bg-[#17284a] text-white rounded-full w-9 h-9 flex items-center justify-center hover:bg-[#0f1d35] transition-colors shadow-lg"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="relative w-full flex-1 min-h-0 flex items-center justify-center">
              {galleryImages.length > 1 && (
                <button
                  onClick={(e) => { e.stopPropagation(); goPrev() }}
                  className="absolute left-2 z-10 bg-[#17284a] text-white rounded-full w-12 h-12 flex items-center justify-center hover:bg-[#0f1d35] transition-colors"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
              )}

              <div className="relative w-full h-full max-h-[70vh] aspect-[16/10] rounded-[8px] overflow-hidden bg-gray-50">
                <Image
                  src={galleryImages[lightboxIndex].image_url}
                  alt={`${title} gallery ${lightboxIndex + 1}`}
                  fill
                  priority
                  sizes="90vw"
                  className="object-contain object-center"
                />
              </div>

              {galleryImages.length > 1 && (
                <button
                  onClick={(e) => { e.stopPropagation(); goNext() }}
                  className="absolute right-2 z-10 bg-[#17284a] text-white rounded-full w-12 h-12 flex items-center justify-center hover:bg-[#0f1d35] transition-colors"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              )}
            </div>

            {galleryImages.length > 1 && (
              <div className="flex gap-2 items-center justify-center overflow-x-auto scrollbar-hide">
                {galleryImages.map((img, i) => (
                  <button
                    key={img.id}
                    onClick={(e) => { e.stopPropagation(); setLightboxIndex(i) }}
                    className={`relative flex-shrink-0 w-[137px] h-[89px] rounded-[8px] overflow-hidden bg-gray-50 transition-all ${
                      i === lightboxIndex
                        ? "opacity-100 ring-2 ring-[#17284a]"
                        : "opacity-70 hover:opacity-100"
                    }`}
                  >
                    <div className="relative w-full h-full">
                      <Image
                        src={img.image_url}
                        alt={`Thumbnail ${i + 1}`}
                        fill
                        sizes="137px"
                        className="object-cover object-center"
                      />
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  )
}
