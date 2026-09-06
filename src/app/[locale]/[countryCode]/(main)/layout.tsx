import { Metadata } from "next"
import { setRequestLocale } from "next-intl/server"

import { getBaseURL } from "@lib/util/env"
import Nav from "@modules/layout/templates/nav"
import FooterServer from "@modules/layout/templates/footer/FooterServer"
import CtaSection from "@modules/layout/components/cta-section"
import ScrollToTop from "@modules/common/components/scroll-to-top"

export const metadata: Metadata = {
  metadataBase: new URL(getBaseURL()),
}

export default async function PageLayout(
  props: {
    children: React.ReactNode
    params: Promise<{ locale: string; countryCode: string }>
  }
) {
  const { locale } = await props.params
  setRequestLocale(locale)

  return (
    <>
      <ScrollToTop />
      <Nav />
      {props.children}
      <CtaSection locale={locale} />
      <FooterServer locale={locale} />
    </>
  )
}
