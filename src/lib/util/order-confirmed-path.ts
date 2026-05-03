/**
 * Canonical storefront path after cart.complete — must match
 * `app/[locale]/[countryCode]/(main)/order/[id]/confirmed`.
 */
export function buildOrderConfirmedPath(
  locale: string,
  countryCode: string,
  orderId: string
): string {
  return `/${locale.toLowerCase()}/${countryCode.toLowerCase()}/order/${orderId}/confirmed`
}

export function normalizeAppLocale(
  locale: string,
  allowedLocales: readonly string[],
  fallback: string
): string {
  return allowedLocales.includes(locale) ? locale : fallback
}
