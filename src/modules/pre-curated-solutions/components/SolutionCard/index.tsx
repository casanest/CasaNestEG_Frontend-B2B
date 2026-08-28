import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { Package } from "@lib/data/packages"
import { Package as PackageIcon } from "lucide-react"

type SolutionCardProps = {
  package: Package
  locale: string
}

export default function SolutionCard({ package: pkg, locale }: SolutionCardProps) {
  const isRTL = locale === "ar"

  const name = isRTL ? pkg.name_ar : pkg.name_en
  const description = isRTL ? pkg.description_ar : pkg.description_en
  const badgeText = isRTL ? "مجهزة مسبقاً" : "Pre-Curated"
  const buttonText = isRTL ? "عرض وتخصيص الباقة" : "View & Customize Package"
  const itemCountText = isRTL
    ? `${pkg.item_count} عناصر مشمولة في الباقة الأساسية`
    : `${pkg.item_count} items included in base bundle`

  return (
    <LocalizedClientLink
      href={`/pre-curated-solutions/${pkg.slug}`}
      dir={isRTL ? "rtl" : "ltr"}
      className="group bg-white border border-[#e5e7eb] border-solid cursor-pointer flex flex-col sm:flex-row items-stretch overflow-hidden relative rounded-xl shadow-[0px_2px_8px_0px_rgba(0,0,0,0.06)] w-full hover:shadow-[0px_4px_16px_0px_rgba(0,0,0,0.1)] transition-shadow"
    >
      {/* Photo section */}
      <div className="relative w-full sm:w-[280px] h-[220px] sm:h-auto shrink-0 overflow-hidden bg-[#f3f4f6]">
        {pkg.image_url ? (
          <img
            src={pkg.image_url}
            alt={name}
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-[#f3f4f6] flex items-center justify-center">
            <PackageIcon className="w-12 h-12 text-[#9CA3AF]" />
          </div>
        )}
        {/* Pre-Curated badge */}
        <div className="absolute top-3 left-3 bg-[#fdaf22] px-2.5 py-1.5 rounded-md z-10">
          <p className="font-satoshi font-bold text-[11px] text-black leading-4 whitespace-nowrap">
            {badgeText}
          </p>
        </div>
      </div>

      {/* Content section */}
      <div className="flex flex-col flex-1 h-full items-start justify-between p-5 sm:p-6 min-w-0">
        {/* Title and description */}
        <div className="flex flex-col gap-2 sm:gap-3 items-start w-full">
          <p className="font-satoshi font-bold leading-[1.4] text-[#17284a] text-[20px] w-full">
            {name}
          </p>
          {description && (
            <p className="font-satoshi font-normal sm:font-medium leading-[1.5] text-[#707176] sm:text-[#46464a] text-[14px] w-full line-clamp-2 overflow-hidden text-ellipsis">
              {description}
            </p>
          )}
        </div>

        {/* Metadata */}
        <div className="flex flex-col gap-3 sm:gap-4 items-center w-full mt-8 sm:mt-12">
          {/* Item count */}
          <div className="flex gap-2 items-center w-full">
            <PackageIcon className="w-6 h-6 text-[#17284a] shrink-0" />
            <p className="font-satoshi font-medium leading-[1.5] text-[#17284a] text-[14px] whitespace-normal md:whitespace-nowrap">
              {itemCountText}
            </p>
          </div>

          {/* Button */}
          <div className="bg-[#17284a] flex items-center justify-center px-9 py-4 rounded-xl w-full">
            <p className="font-satoshi font-medium leading-[1.5] text-[16px] text-center text-white whitespace-normal md:whitespace-nowrap">
              {buttonText}
            </p>
          </div>
        </div>
      </div>
    </LocalizedClientLink>
  )
}
