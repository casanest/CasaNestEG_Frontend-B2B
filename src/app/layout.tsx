import { getBaseURL } from "@/lib/util/env";
import type { Metadata } from "next";
import {
  Cairo,
  Inter,
  JetBrains_Mono,
  Plus_Jakarta_Sans,
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
      {/* Provide the intl context */}
      {/* <NextIntlClientProvider locale={locale} messages={messages}> */}
        <body className={cairo.className}>
          <main className="relative">{children}</main>
        </body>
      {/* </NextIntlClientProvider> */}
      </html>
  );
}
