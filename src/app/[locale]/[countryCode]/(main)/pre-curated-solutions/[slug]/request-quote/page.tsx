import { getPackageBySlug } from "@lib/data/packages"
import RequestQuoteForm from "@modules/pre-curated-solutions/components/RequestQuoteForm"
import { notFound } from "next/navigation"

type Props = {
  params: Promise<{
    countryCode: string
    locale: string
    slug: string
  }>
}

export const dynamic = "force-dynamic"
export const fetchCache = "force-no-store"

export default async function RequestQuotePage({ params }: Props) {
  const { locale, slug } = await params
  const pkg = await getPackageBySlug(slug)

  if (!pkg) {
    notFound()
  }

  return <RequestQuoteForm pkg={pkg} locale={locale} />
}
