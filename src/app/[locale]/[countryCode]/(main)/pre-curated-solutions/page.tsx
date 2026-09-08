import { listPackages } from "@lib/data/packages"
import SectionHeader from "@modules/pre-curated-solutions/components/SectionHeader"
import SolutionCard from "@modules/pre-curated-solutions/components/SolutionCard"
import { Suspense } from "react"

type Props = {
  params: Promise<{
    countryCode: string
    locale: string
  }>
}

export const revalidate = 60

export default async function PreCuratedSolutionsPage({ params }: Props) {
  const { locale } = await params
  const isRTL = locale === "ar"

  return (
    <div className="w-full py-8 bg-[#f8f9fa]" dir={isRTL ? "rtl" : "ltr"}>
      <SectionHeader locale={locale} />

      <div className="mt-6 md:mt-10 px-2 md:px-4 lg:px-[clamp(16px,2vw,30px)]">
        <Suspense fallback={<div className="h-screen w-full bg-gray-50 flex items-center justify-center animate-pulse" />}>
          <PackagesList locale={locale} />
        </Suspense>
      </div>
    </div>
  )
}

async function PackagesList({ locale }: { locale: string }) {
  const packages = await listPackages()

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-x-5 md:gap-y-7">
      {packages.map((pkg) => (
        <SolutionCard key={pkg.id} package={pkg} locale={locale} />
      ))}
    </div>
  )
}
