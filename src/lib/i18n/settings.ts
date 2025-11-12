export const fallbackLng = "ar"
export const languages = [
  fallbackLng,
  "en",
  "fr"
  // "de",
  // "it",
]
export const localePrefix = "always"
export const LOCALE_COOKIE = "NEXT_LOCALE"

export const intlConfig = {
  locales: languages,
  defaultLocale: fallbackLng,
  localeDetection: true,
}