import { Suspense } from "react"

import LocalizedClientLink from "@modules/common/components/localized-client-link"
import CartButton from "@modules/layout/components/cart-button"
import SideMenu from "@modules/layout/components/side-menu"
import TopNav from "@modules/layout/components/top-nav"
import LanguageSwitcher from "@modules/layout/components/language-switcher"
import Image from "next/image"
import { FilePlus } from "lucide-react"
import ScrollHeader from "./ScrollHeader"
import ProductsDropdown from "./ProductsDropdown"
import { listCategories, Category } from "@lib/data/categories"
import { listCollections } from "@lib/data/collections"
import { getLocale } from "next-intl/server"

export default async function Nav() {
  const locale = await getLocale()
  const isRTL = locale === "ar"
  const productCategories: Category[] = await listCategories()

  const { collections } = await listCollections()

  const navLinksBefore = [
    { href: "/", labelEn: "Homepage", labelAr: "الرئيسية" },
    { href: "/categories/integrated-solutions", labelEn: "Curated Solutions", labelAr: "الحلول المتكاملة" },
  ]

  const navLinksAfter = [
    { href: "/our-services", labelEn: "Projects", labelAr: "المشاريع" },
    { href: "/about-us", labelEn: "About Us", labelAr: "من نحن" },
  ]

  return (
    <>
      <ScrollHeader isRTL={isRTL} topNav={<TopNav />}>
            {/* Mobile: SideMenu + Logo */}
            <div className="flex items-center gap-2 md:hidden">
              <SideMenu productCategories={productCategories as any} collections={collections} />
              <LocalizedClientLink
                href="/"
                className="inline-block"
                data-testid="nav-store-link"
                aria-label="Homepage"
              >
                <Image
                  src="/casanest.png"
                  alt="CASANEST Logo"
                  width={120}
                  height={40}
                  priority
                  style={{ width: 120, height: 40, objectFit: "contain" }}
                />
              </LocalizedClientLink>
            </div>

            {/* Desktop: Logo */}
            <div className="hidden md:flex items-center shrink-0">
              <LocalizedClientLink
                href="/"
                data-testid="nav-store-link"
                aria-label="Homepage"
              >
                <Image
                  src="/casanest.png"
                  alt="CASANEST Logo"
                  width={161}
                  height={56}
                  priority
                  style={{ width: 161, height: 56, objectFit: "contain" }}
                />
              </LocalizedClientLink>
            </div>

            {/* Desktop: Center Nav Links */}
            <div className="hidden md:flex items-center gap-7">
              {navLinksBefore.map((link, idx) => (
                <LocalizedClientLink
                  key={idx}
                  href={link.href}
                  className="flex items-center gap-1 text-[16px] font-medium text-black hover:text-[#17284a] transition-colors whitespace-nowrap"
                >
                  {isRTL ? link.labelAr : link.labelEn}
                </LocalizedClientLink>
              ))}
              <ProductsDropdown categories={productCategories} />
              {navLinksAfter.map((link, idx) => (
                <LocalizedClientLink
                  key={idx}
                  href={link.href}
                  className="flex items-center gap-1 text-[16px] font-medium text-black hover:text-[#17284a] transition-colors whitespace-nowrap"
                >
                  {isRTL ? link.labelAr : link.labelEn}
                </LocalizedClientLink>
              ))}
            </div>

            {/* Desktop: Right side - Language + Quote List */}
            <div className="hidden md:flex items-center gap-4 shrink-0">
              <LanguageSwitcher />
              <div className="w-px h-8 bg-gray-300" />
              <Suspense
                fallback={
                  <LocalizedClientLink
                    href="/cart"
                    data-testid="nav-cart-link"
                    className="flex items-center gap-2 bg-[#dce3f0] px-4 py-2 rounded-xl text-[16px] font-medium text-black hover:bg-[#c9d4ea] transition-colors"
                  >
                    {isRTL ? "قائمة الأسعار" : "Quote List"}
                    <FilePlus className="w-5 h-5" />
                  </LocalizedClientLink>
                }
              >
                <CartButton locale={locale} />
              </Suspense>
            </div>

            {/* Mobile: Right side - Cart */}
            <div className="flex items-center gap-3 md:hidden">
              <Suspense
                fallback={
                  <LocalizedClientLink
                    href="/cart"
                    data-testid="nav-cart-link"
                    className="flex items-center"
                  >
                    <FilePlus className="w-6 h-6 text-[#17284a]" />
                  </LocalizedClientLink>
                }
              >
                <CartButton locale={locale} />
              </Suspense>
            </div>
          </ScrollHeader>
    </>
  )
}
