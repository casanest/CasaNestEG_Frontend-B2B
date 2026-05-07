import { getBaseURL } from "@lib/util/env"
import { Metadata } from "next"
import { getI18NConfigCallback } from "@lib/i18n/config-callback"
import { LOCALE_COOKIE, fallbackLng, languages } from "@lib/i18n/settings"
import { NextIntlClientProvider } from "next-intl"
import { unstable_setRequestLocale } from "next-intl/server"
import { cookies } from "next/headers"
import { Suspense } from "react"
import "../styles/globals.css"

export const metadata: Metadata = {
  metadataBase: new URL(getBaseURL()),
  title: {
    default: "CASANEST | Ideas for Life",
    template: "%s | CASANEST",
  },
  description:
    "اكتشف عالم كازانست — كل ما تحتاجه لمنزلك في مكان واحد! Discover CASANEST — your one-stop shop for home essentials, appliances, and elegant designs.",
  keywords: [
    "كازانست",
    "casanest",
    "متجر كازانست",
    "تسوق",
    "منزلي",
    "أجهزة كهربائية",
    "أدوات منزلية",
    "ديكور",
    "العروض",
    "Home store",
    "CASANEST Egypt",
    "Home appliances",
    "Furniture",
    "Kitchenware",
  ],
  openGraph: {
    title: "CASANEST | Ideas for Life",
    description:
      "كل ما تحتاجه لمنزلك من كازانست — الجودة والأناقة والخدمة الممتازة في مكان واحد. Everything you need for your home in one place — style, quality, and comfort.",
    url: "https://casanesteg.com/", // غيّرها للرابط الفعلي
    siteName: "CASANEST",
    images: [
      {
        url: "https://casanesteg.com/og-image.jpg", // غيّرها لصورة فعلية داخل public/
        width: 1200,
        height: 630,
        alt: "CASANEST Store Preview",
      },
    ],
    locale: "ar_EG",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "CASANEST | Ideas for Life",
    description:
      "اكتشف منتجات كازانست — الجودة تبدأ من المنزل. Discover CASANEST — ideas for a better home.",
    images: ["https://casanesteg.com/og-image.jpg"],
  },
};

export function generateStaticParams() {
  return languages.map((locale) => ({ locale }));
}

export default async function RootLayout({
  children,
  params: { locale: localeParam },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {

  // Determine the locale to use
  const locale = languages.includes(localeParam)
    ? localeParam
    : (await cookies()).get(LOCALE_COOKIE)?.value || fallbackLng;

  // Set the request locale (for server-side context)
  unstable_setRequestLocale(locale);

  // Load translations for the determined locale
  const { messages } = await getI18NConfigCallback({
    locale,
    requestLocale: Promise.resolve(undefined)
  });

  return (
    <html lang={locale} data-mode="light">
      {/* Provide the intl context */}
      <NextIntlClientProvider locale={locale} messages={messages}>
        <body>
          <main className="relative">{children}</main>
        </body>
      </NextIntlClientProvider>
    </html>
  );
}