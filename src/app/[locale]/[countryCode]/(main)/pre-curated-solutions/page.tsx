import { listPackages } from "@lib/data/packages"
import SectionHeader from "@modules/pre-curated-solutions/components/SectionHeader"
import SolutionCard from "@modules/pre-curated-solutions/components/SolutionCard"

type Props = {
  params: Promise<{
    countryCode: string
    locale: string
  }>
}

export const revalidate = 60

export default async function PreCuratedSolutionsPage({ params }: Props) {
  const { locale } = await params
  const packages = await listPackages()
  const isRTL = locale === "ar"

  return (
    <div className="w-full max-w-[1440px] mx-auto px-4 md:px-8 lg:px-[60px] py-8 bg-[#f8f9fa]" dir={isRTL ? "rtl" : "ltr"}>
      <SectionHeader locale={locale} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-x-5 md:gap-y-7 mt-6 md:mt-10">
        {packages.map((pkg) => (
          <SolutionCard key={pkg.id} package={pkg} locale={locale} />
        ))}
      </div>
    </div>
  )
}
