'use client'

import { useState, useEffect } from 'react'
import { BarsIcon } from '@modules/common/icons/bars'
import X from '@modules/common/icons/x'
import { ChevronDown, ChevronRight, ChevronLeft } from 'lucide-react'
import LocalizedClientLink from '@modules/common/components/localized-client-link'
import { usePathname } from 'next/navigation'
import { useLocale } from 'next-intl'

const SideMenu = ({
  productCategories,
  collections,
}: {
  productCategories: any[]
  collections: any[]
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [productsExpanded, setProductsExpanded] = useState(false)
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null)
  const pathname = usePathname()
  const locale = useLocale()
  const isRTL = locale === 'ar'

  const switchTo = (newLocale: string) => {
    const pathWithoutLocale = pathname.replace(`/${locale}`, '')
    const newPath = `/${newLocale}${pathWithoutLocale}`
    window.location.href = newPath
  }

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  const handleClose = () => {
    setIsOpen(false)
    setProductsExpanded(false)
    setExpandedCategory(null)
  }

  const navLinks = [
    { href: '/', labelEn: 'Homepage', labelAr: 'الرئيسية' },
    { href: '/categories/integrated-solutions', labelEn: 'Curated Solutions', labelAr: 'الحلول المتكاملة' },
    { href: '/our-services', labelEn: 'Projects', labelAr: 'المشاريع' },
    { href: '/about-us', labelEn: 'About Us', labelAr: 'من نحن' },
  ]

  const getCatName = (cat: any) =>
    isRTL ? cat.name_ar || cat.name_en : cat.name_en || cat.name_ar

  const getCatHandle = (cat: any) =>
    isRTL ? cat.handle_ar || cat.handle_en : cat.handle_en || cat.handle_ar

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center justify-center p-2 md:hidden"
        aria-label="Open menu"
      >
        <BarsIcon />
      </button>

      {/* Overlay */}
      <div
        className={`fixed inset-0 z-[100] transition-all duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        style={{ visibility: isOpen ? 'visible' : 'hidden' }}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/50 transition-opacity duration-300"
          onClick={handleClose}
        />

        {/* Panel */}
        <div
          className={`absolute top-0 ${isRTL ? 'right-0' : 'left-0'} h-full w-[90%] bg-white shadow-2xl transition-transform duration-300 ease-out flex flex-col ${
            isOpen
              ? 'translate-x-0'
              : isRTL
                ? 'translate-x-full'
                : '-translate-x-full'
          }`}
          dir={isRTL ? 'rtl' : 'ltr'}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
            <span className="text-xl font-bold text-[#17284a]">
              {isRTL ? 'القائمة' : 'Menu'}
            </span>
            <button
              onClick={handleClose}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Close menu"
            >
              <X />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto px-5 py-4">
            {/* Main Nav Links */}
            <nav className="flex flex-col">
              {navLinks.map((link, idx) => (
                <LocalizedClientLink
                  key={idx}
                  href={link.href}
                  onClick={handleClose}
                  className="py-3 text-[18px] font-medium text-black hover:text-[#17284a] transition-colors border-b border-gray-100"
                >
                  {isRTL ? link.labelAr : link.labelEn}
                </LocalizedClientLink>
              ))}

              {/* Products with expandable categories */}
              <div className="border-b border-gray-100">
                <button
                  onClick={() => setProductsExpanded(!productsExpanded)}
                  className="w-full flex items-center justify-between py-3 text-[18px] font-medium text-black hover:text-[#17284a] transition-colors"
                >
                  {isRTL ? 'المنتجات' : 'Products'}
                  <ChevronDown
                    className={`w-5 h-5 transition-transform duration-200 ${
                      productsExpanded ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {/* Expandable categories list */}
                <div
                  className={`overflow-hidden transition-all duration-300 ease-out ${
                    productsExpanded ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  <div className="py-2 pl-4 flex flex-col gap-1">
                    {/* Shop all link */}
                    <LocalizedClientLink
                      href="/store"
                      onClick={handleClose}
                      className="py-2 text-[16px] font-bold text-[#17284a] hover:underline"
                    >
                      {isRTL ? 'تسوق الكل' : 'Shop All'}
                    </LocalizedClientLink>

                    {/* Category list */}
                    {productCategories.map((cat: any) => {
                      const catName = getCatName(cat)
                      const catHandle = getCatHandle(cat)
                      const children = cat.category_children || []
                      const hasChildren = children.length > 0
                      const isExpanded = expandedCategory === cat.id

                      return (
                        <div key={cat.id}>
                          {hasChildren ? (
                            <>
                              <button
                                onClick={() =>
                                  setExpandedCategory(isExpanded ? null : cat.id)
                                }
                                className="w-full flex items-center justify-between py-2 text-[16px] font-medium text-gray-800 hover:text-[#17284a] transition-colors"
                              >
                                <span>{catName}</span>
                                {isRTL ? (
                                  <ChevronLeft className="w-4 h-4" />
                                ) : (
                                  <ChevronRight className="w-4 h-4" />
                                )}
                              </button>
                              <div
                                className={`overflow-hidden transition-all duration-300 ease-out ${
                                  isExpanded ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'
                                }`}
                              >
                                <div className={`flex flex-col gap-1 ${isRTL ? 'pr-4' : 'pl-4'}`}>
                                  <LocalizedClientLink
                                    href={`/categories/${catHandle}`}
                                    onClick={handleClose}
                                    className="py-1.5 text-[15px] text-gray-600 hover:text-[#17284a] transition-colors"
                                  >
                                    {isRTL ? 'عرض الكل' : 'View All'}
                                  </LocalizedClientLink>
                                  {children.map((child: any) => (
                                    <LocalizedClientLink
                                      key={child.id}
                                      href={`/categories/${getCatHandle(child)}`}
                                      onClick={handleClose}
                                      className="py-1.5 text-[15px] text-gray-600 hover:text-[#17284a] transition-colors"
                                    >
                                      {getCatName(child)}
                                    </LocalizedClientLink>
                                  ))}
                                </div>
                              </div>
                            </>
                          ) : (
                            <LocalizedClientLink
                              href={`/categories/${catHandle}`}
                              onClick={handleClose}
                              className="block py-2 text-[16px] font-medium text-gray-800 hover:text-[#17284a] transition-colors"
                            >
                              {catName}
                            </LocalizedClientLink>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            </nav>

            {/* Language Switch */}
            <button
              onClick={() => switchTo(isRTL ? 'en' : 'ar')}
              className="mt-6 w-full rounded-lg border border-gray-200 px-4 py-3 text-[15px] font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
            >
              {isRTL ? 'Change to English' : 'تغيير إلى العربية'}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default SideMenu
