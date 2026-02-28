"use client"

import PaymentReturnContent from "@app/[locale]/[countryCode]/(checkout)/checkout/payment-return/payment-return-content"

type Props = {
  params: Promise<{ locale: string; countryCode: string; market: string }>
}

/**
 * Payment return page for 3-segment URLs (e.g. /en/dk/eg/checkout/payment-return).
 * TAP or the backend may redirect with an extra segment; this route ensures the page loads instead of 404.
 * Uses first two segments (locale, countryCode) for redirects.
 */
export default function PaymentReturnPageThreeSegment(props: Props) {
  const paramsPromise = Promise.resolve(props.params).then((p) => ({
    locale: p.locale,
    countryCode: p.countryCode,
  }))
  return <PaymentReturnContent params={paramsPromise} />
}
