import { useTranslations, useLocale } from "next-intl"
import { ArrowRight, Package } from "lucide-react"
import { Package as PackageType } from "@lib/data/packages"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

type PreCuratedSolutionsProps = {
  packages: PackageType[]
  locale: string
  dir: string
}

export default function PreCuratedSolutions({
  packages,
  locale,
  dir,
}: PreCuratedSolutionsProps) {
  const t = useTranslations("home.solutions")
  const isRTL = locale === "ar"

  return (
    <section
      className="bg-white flex flex-col gap-[24px] md:gap-[clamp(30px,4vw,40px)] items-start md:items-center justify-center min-h-[100svh] px-[16px] md:px-[clamp(16px,4vw,60px)] py-[44px] md:py-[clamp(40px,5vw,80px)] w-full"
      dir={dir}
    >
      {/* Header */}
      <div className="flex flex-col gap-[8px] md:gap-[clamp(10px,1vw,16px)] items-center text-center w-full">
        <p className="font-caveat text-[#17284a] text-[32px] md:text-[clamp(28px,2.5vw,40px)] leading-[1.2]">
          {t("eyebrow")}
        </p>
        <h2 className="text-[#17284a] text-[24px] md:text-[clamp(24px,2.8vw,40px)] leading-[1.18] font-medium">
          {t("title")}
        </h2>
        <p className="text-black/80 text-[16px] md:text-[clamp(14px,1.6vw,24px)] leading-[1.3] max-w-[840px] md:line-clamp-2">
          {t("description")}
        </p>
      </div>

      {/* Package cards - horizontal scroll on mobile, 2x2 grid on desktop */}
      <div className="md:hidden flex gap-[16px] overflow-x-auto scrollbar-hide snap-x w-full pb-2">
        {packages.map((pkg, idx) => (
          <PackageCard
            key={pkg.id || idx}
            pkg={pkg}
            locale={locale}
            t={t}
            mobile
          />
        ))}
      </div>
      <div className="hidden md:flex flex-col gap-[clamp(16px,1.5vw,20px)] w-full max-w-[calc(63vw+389px)]">
        {packages.length > 0 && (
          <>
            <div className="flex gap-[clamp(16px,1.5vw,20px)] w-full">
              {packages.slice(0, 2).map((pkg, idx) => (
                <PackageCard
                  key={pkg.id || idx}
                  pkg={pkg}
                  locale={locale}
                  t={t}
                />
              ))}
            </div>
            {packages.length > 2 && (
              <div className="flex gap-[clamp(16px,1.5vw,20px)] w-full">
                {packages.slice(2, 4).map((pkg, idx) => (
                  <PackageCard
                    key={pkg.id || idx}
                    pkg={pkg}
                    locale={locale}
                    t={t}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Explore all button - full width on mobile */}
      <LocalizedClientLink
        href="/pre-curated-solutions"
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

function PackageCard({
  pkg,
  locale,
  t,
  mobile = false,
}: {
  pkg: PackageType
  locale: string
  t: any
  mobile?: boolean
}) {
  const name = locale === "ar" ? pkg.name_ar : pkg.name_en
  const description =
    locale === "ar" ? pkg.description_ar : pkg.description_en

  if (mobile) {
    return (
      <LocalizedClientLink
        href={`/pre-curated-solutions/${pkg.slug}`}
        className="bg-white border border-[#e5e7eb] flex flex-col w-[256px] shrink-0 snap-center overflow-hidden rounded-[12px] shadow-[0px_2px_8px_0px_rgba(0,0,0,0.06)] hover:shadow-[0px_4px_12px_0px_rgba(0,0,0,0.1)] transition-shadow"
      >
        {/* Image on top */}
        <div className="relative w-full h-[198px] shrink-0">
          {pkg.image_url && (
            <img
              src={pkg.image_url}
              alt={name || ""}
              className="absolute inset-0 w-full h-full object-cover"
            />
          )}
          <div className="absolute bg-[#fdaf22] left-[12px] top-[12px] px-[10px] py-[5px] rounded-[6px]">
            <span className="text-black text-[11px] font-bold">
              {t("preCuratedBadge")}
            </span>
          </div>
        </div>

        {/* Content below */}
        <div className="flex flex-col gap-[12px] p-[20px] flex-1">
          <div className="flex flex-col gap-[8px]">
            <h3 className="text-[#17284a] text-[18px] font-medium leading-[1.5]">
              {name}
            </h3>
            {description && (
              <p className="text-[#46464a] text-[14px] font-medium leading-[1.5] line-clamp-2">
                {description}
              </p>
            )}
          </div>
          <div className="flex flex-col gap-[12px] w-full mt-auto">
            <div className="flex gap-[8px] items-center">
              <Package className="w-[18px] h-[18px] text-[#17284a]" />
              <span className="text-[#17284a] text-[12px] font-medium">
                {pkg.item_count || 0} {t("itemsIncluded")}
              </span>
            </div>
            <div className="bg-[#17284a] flex gap-[8px] items-center justify-center px-[36px] py-[16px] rounded-[12px] w-full">
              <span className="text-white text-[16px] font-medium text-center">
                {t("viewPackage")}
              </span>
            </div>
          </div>
        </div>
      </LocalizedClientLink>
    )
  }

  return (
    <LocalizedClientLink
      href={`/pre-curated-solutions/${pkg.slug}`}
      className="bg-white border border-[#e5e7eb] flex flex-1 h-[clamp(162px,16.2vw,245px)] items-start overflow-hidden rounded-[12px] shadow-[0px_2px_8px_0px_rgba(0,0,0,0.06)] hover:shadow-[0px_4px_12px_0px_rgba(0,0,0,0.1)] transition-shadow min-w-0"
    >
      {/* Image */}
      <div className="relative w-[clamp(144px,16.2vw,252px)] h-full shrink-0">
        {pkg.image_url && (
          <img
            src={pkg.image_url}
            alt={name || ""}
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}
        <div className="absolute bg-[#fdaf22] left-[clamp(8px,0.8vw,12px)] top-[clamp(8px,0.8vw,12px)] px-[clamp(8px,0.7vw,10px)] py-[clamp(4px,0.4vw,5px)] rounded-[6px]">
          <span className="text-black text-[clamp(9px,0.8vw,11px)] font-bold">
            {t("preCuratedBadge")}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col h-full justify-between p-[clamp(16px,1.6vw,24px)] flex-1 min-w-0">
        <div className="flex flex-col gap-[clamp(8px,0.8vw,12px)]">
          <h3 className="text-[#17284a] text-[clamp(15px,1.4vw,20px)] font-bold leading-[1.4]">
            {name}
          </h3>
          {description && (
            <p className="text-[#46464a] text-[clamp(11px,1vw,14px)] font-medium leading-[1.5] line-clamp-2">
              {description}
            </p>
          )}
        </div>
        <div className="flex flex-col gap-[clamp(10px,1.2vw,16px)] w-full">
          <div className="flex gap-[8px] items-center">
            <Package className="w-[clamp(18px,1.5vw,24px)] h-[clamp(18px,1.5vw,24px)] text-[#17284a]" />
            <span className="text-[#17284a] text-[clamp(11px,1vw,14px)] font-medium">
              {pkg.item_count || 0} {t("itemsIncluded")}
            </span>
          </div>
          <div className="bg-[#17284a] flex gap-[8px] items-center justify-center px-[clamp(20px,2.5vw,36px)] py-[clamp(12px,1.2vw,16px)] rounded-[12px] w-full">
            <span className="text-white text-[clamp(13px,1.1vw,16px)] font-medium text-center">
              {t("viewPackage")}
            </span>
          </div>
        </div>
      </div>
    </LocalizedClientLink>
  )
}
