import { getBaseURL } from "@/lib/util/env";
import type { Metadata } from "next";
import Script from "next/script";
import {
  Cairo,
  Caveat,
  Inter,
  JetBrains_Mono,
  Plus_Jakarta_Sans,
  Playpen_Sans_Arabic,
} from "next/font/google";
import "@/styles/globals.css";



const heading = Plus_Jakarta_Sans({
  variable: "--font-heading",
  subsets: ["latin"],
});

const body = Inter({
  variable: "--font-body",
  subsets: ["latin"],
});

const arabic = Cairo({
  variable: "--font-arabic",
  subsets: ["arabic", "latin"],
});

const mono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});


const cairo = Cairo({
  variable: "--font-cairo",
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "500", "600", "700"],
})

const caveat = Caveat({
  variable: "--font-caveat",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
})

const playpenSansArabic = Playpen_Sans_Arabic({
  variable: "--font-playpen-arabic",
  subsets: ["arabic", "latin"],
  weight: ["300"],
})

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
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // <html
    //   lang="en"
    //   className={`h-full antialiased ${heading.variable} ${body.variable} ${arabic.variable} ${mono.variable}`}
    //   suppressHydrationWarning
    // >
    //   <body 
    //   className="min-h-full flex flex-col bg-background text-text-primary">
    //     {/* <ThemeProvider
    //       attribute="class"
    //       defaultTheme="dark"
    //       enableSystem
    //     > */}
    //       {children}
    //     {/* </ThemeProvider> */}
    //   </body>
    // </html>
     <html lang="ar" data-mode="light">
      {/* Google Tag Manager */}
      <Script
        id="gtm-script"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-NRQ89R45');`,
        }}
      />
      {/* End Google Tag Manager */}
      {/* Provide the intl context */}
      {/* <NextIntlClientProvider locale={locale} messages={messages}> */}
        <body className={`${cairo.variable} ${caveat.variable} ${playpenSansArabic.variable}`}>
          {/* Google Tag Manager (noscript) */}
          <noscript>
            <iframe
              src="https://www.googletagmanager.com/ns.html?id=GTM-NRQ89R45"
              height="0"
              width="0"
              style={{ display: "none", visibility: "hidden" }}
            />
          </noscript>
          {/* End Google Tag Manager (noscript) */}
          <main className="relative">{children}</main>
        </body>
      {/* </NextIntlClientProvider> */}
      </html>
  );
}
