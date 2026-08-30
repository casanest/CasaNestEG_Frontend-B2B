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
import MobileCartButton from "@modules/layout/components/mobile-cart-button"
import { listCategories, Category } from "@lib/data/categories"
import { listCollections } from "@lib/data/collections"
import { listPackages } from "@lib/data/packages"
import { listAllPortfolioProjects } from "@lib/data/portfolio"
import { getLocale } from "next-intl/server"

export default async function Nav() {
  const locale = await getLocale()
  const isRTL = locale === "ar"
  const productCategories: Category[] = await listCategories()

  const { collections } = await listCollections()

  const packages = await listPackages().catch(() => [])

  const portfolioData = await listAllPortfolioProjects().catch(() => ({ categories: [], projects: [] }))
  const projectGroups = portfolioData.categories
    .map((cat) => ({
      category: cat,
      projects: portfolioData.projects.filter((p) => p.category_slug === cat.slug),
    }))
    .filter((g) => g.projects.length > 0)

  const navLinksBefore = [
    { href: "/", labelEn: "Homepage", labelAr: "الرئيسية" },
    { href: "/pre-curated-solutions", labelEn: "Curated Solutions", labelAr: "الحلول المتكاملة" },
  ]

  const navLinksAfter = [
    { href: "/our-services", labelEn: "Projects", labelAr: "المشاريع" },
    { href: "/about-us", labelEn: "About Us", labelAr: "من نحن" },
  ]

  return (
    <>
      <ScrollHeader isRTL={isRTL} topNav={<TopNav />}>
            {/* Mobile: Hamburger (left) */}
            <SideMenu
              productCategories={productCategories as any}
              packages={packages}
              projectGroups={projectGroups}
            />

            {/* Mobile: Centered Logo */}
            <LocalizedClientLink
              href="/"
              className="inline-block md:hidden"
              data-testid="nav-store-link"
              aria-label="Homepage"
            >
              <Image
                src="/casanest.webp"
                alt="CASANEST Logo"
                width={104}
                height={34}
                priority
                style={{ width: 104, height: 34, objectFit: "contain", filter: "brightness(0) invert(1)" }}
              />
            </LocalizedClientLink>

            {/* Desktop: Logo */}
            <div className="hidden md:flex items-center shrink-0">
              <LocalizedClientLink
                href="/"
                data-testid="nav-store-link"
                aria-label="Homepage"
              >
                <Image
                  src="/casanest.webp"
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

            {/* Mobile: Right side - Quote button (icon only) */}
            <MobileCartButton />
          </ScrollHeader>
    </>
  )
}
