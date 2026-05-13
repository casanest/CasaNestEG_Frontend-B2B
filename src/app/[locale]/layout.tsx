import { notFound } from "next/navigation"
import { setRequestLocale } from "next-intl/server"
import { NextIntlClientProvider } from "next-intl"

// import { routing } from "@/i18n/routing"
// import messagesAr from "../../../messages/ar.json"
// import messagesEn from "../../../messages/en.json"

// const allMessages = {
//   ar: messagesAr,
//   en: messagesEn,
// } as const

// export function generateStaticParams() {
//   return routing.locales.map((locale) => ({ locale }))
// }

// function getMessages(locale: string) {
//   return allMessages[locale as keyof typeof allMessages] || {}
// }

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  console.log("LocaleLayout ************************", { locale })
  
//   if (!routing.locales.includes(locale)) {
//     notFound()
//   }

  setRequestLocale(locale)
  
  // const messages = getMessages(locale)
  
  return (
    <div dir={locale === "ar" ? "rtl" : "ltr"} data-locale={locale}>
      <NextIntlClientProvider locale={locale} >
        {children}
      </NextIntlClientProvider>
    </div>
  )
}
