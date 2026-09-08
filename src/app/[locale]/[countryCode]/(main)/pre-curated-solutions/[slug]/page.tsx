import { getPackageBySlug } from "@lib/data/packages"
import PackageDetailClient from "@modules/pre-curated-solutions/components/PackageDetail"
import { notFound } from "next/navigation"



type Props = {
  params: Promise<{
    countryCode: string
    locale: string
    slug: string
  }>
}

export default async function SinglePackagePage({ params }: Props) {
  const { locale, slug } = await params
  const pkg = await getPackageBySlug(slug)

  if (!pkg) {
    notFound()
  }

  return <PackageDetailClient pkg={pkg} locale={locale} />
}
