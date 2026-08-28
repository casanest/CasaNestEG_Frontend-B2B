'use client'

import { useState, useEffect, Fragment } from 'react'
import { BarsIcon } from '@modules/common/icons/bars'
import { X, ChevronRight, ChevronLeft, ChevronDown, Globe, Phone, ArrowRight, FileText } from 'lucide-react'
import LocalizedClientLink from '@modules/common/components/localized-client-link'
import { usePathname } from 'next/navigation'
import { useLocale } from 'next-intl'
import Image from 'next/image'

type Package = {
  id: string
  slug: string
  name_en: string
  name_ar: string
  image_url: string | null
}

type ProjectGroup = {
  category: {
    id: string
    slug: string
    name_en: string
    name_ar: string
  }
  projects: {
    id: string
    slug: string
    title_en: string
    title_ar: string
    hero_image_url: string
  }[]
}

type SideMenuProps = {
  productCategories: any[]
  packages?: Package[]
  projectGroups?: ProjectGroup[]
  cartCount?: number
}

export default function SideMenu({ productCategories, packages = [], projectGroups = [], cartCount = 0 }: SideMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [view, setView] = useState<'main' | 'products' | 'solutions' | 'projects'>('main')
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
    setView('main')
    setExpandedCategory(null)
  }

  const navItems = [
    { href: '/', labelEn: 'Homepage', labelAr: 'الرئيسية', showArrow: false },
    { action: 'submenu' as const, submenuView: 'solutions' as const, labelEn: 'Curated Solutions', labelAr: 'الحلول المتكاملة' },
    { action: 'submenu' as const, submenuView: 'products' as const, labelEn: 'Products', labelAr: 'المنتجات' },
    { action: 'submenu' as const, submenuView: 'projects' as const, labelEn: 'Projects', labelAr: 'المشاريع' },
    { href: '/about-us', labelEn: 'About Us', labelAr: 'من نحن', showArrow: false },
    { href: '/contact', labelEn: 'Contact Us', labelAr: 'تواصل معنا', showArrow: false },
    { href: '/faq', labelEn: 'FAQs', labelAr: 'الأسئلة الشائعة', showArrow: false },
  ]

  const getCatName = (cat: any) => isRTL ? cat.name_ar || cat.name_en : cat.name_en || cat.name_ar
  const getCatHandle = (cat: any) => isRTL ? cat.handle_ar || cat.handle_en : cat.handle_en || cat.handle_ar
  const getPkgName = (pkg: Package) => isRTL ? pkg.name_ar || pkg.name_en : pkg.name_en || pkg.name_ar
  const getProjectName = (p: { title_en: string; title_ar: string }) => isRTL ? p.title_ar || p.title_en : p.title_en || p.title_ar
  const getGroupName = (g: ProjectGroup) => isRTL ? g.category.name_ar || g.category.name_en : g.category.name_en || g.category.name_ar

  const isActiveLink = (href: string) => {
    if (href === '/') return pathname === `/${locale}` || pathname === `/${locale}/`
    return pathname.includes(href)
  }

  const isProductsActive = pathname.includes('/store') || pathname.includes('/categories')
  const isSolutionsActive = pathname.includes('/pre-curated-solutions')
  const isProjectsActive = pathname.includes('/our-services')

  const productsText = isRTL ? 'المنتجات' : 'Products'
  const solutionsText = isRTL ? 'الحلول المتكاملة' : 'Curated Solutions'
  const projectsText = isRTL ? 'المشاريع' : 'Projects'
  const viewAllProductsText = isRTL ? 'عرض كل المنتجات' : 'View All Products'
  const viewAllSolutionsText = isRTL ? 'عرض كل الحلول' : 'View All Solutions'
  const viewAllProjectsText = isRTL ? 'عرض كل المشاريع' : 'View All Projects'
  const quoteListText = isRTL ? 'قائمة الأسعار' : 'Quote List'
  const languageText = isRTL ? 'اللغة' : 'Language'
  const requestQuoteText = isRTL ? 'اطلب عرض سعر' : 'Request a Quote'
  const viewAllCatText = isRTL ? 'عرض الكل' : 'View All'

  const arrowChar = isRTL ? '›' : '›'
  const backChar = isRTL ? '‹' : '‹'

  const getSubmenuActive = (submenuView: string) => {
    if (submenuView === 'products') return isProductsActive
    if (submenuView === 'solutions') return isSolutionsActive
    if (submenuView === 'projects') return isProjectsActive
    return false
  }

  const getSubmenuText = (submenuView: string) => {
    if (submenuView === 'products') return productsText
    if (submenuView === 'solutions') return solutionsText
    if (submenuView === 'projects') return projectsText
    return ''
  }

  const renderSubmenuHeader = (submenuView: 'products' | 'solutions' | 'projects') => {
    const text = getSubmenuText(submenuView)
    return (
      <div className="flex h-[70px] items-center justify-between px-4 shrink-0 w-full">
        <button
          onClick={() => setView('main')}
          className="flex gap-3 items-center"
        >
          <span className="font-satoshi font-light text-[28px] text-white leading-[normal]">
            {backChar}
          </span>
          <span className="font-satoshi font-bold text-[20px] text-white leading-[1.4]">
            {text}
          </span>
        </button>
        <button
          onClick={handleClose}
          className="bg-white/[0.08] flex items-center justify-center p-2 rounded-full"
          aria-label="Close menu"
        >
          <X className="w-4 h-4 text-white" />
        </button>
      </div>
    )
  }

  const renderThumbnail = (imageUrl: string | null | undefined, alt: string) => {
    return (
      <div className="w-11 h-11 rounded-lg overflow-hidden bg-white/5 shrink-0">
        {imageUrl && (
          <img src={imageUrl} alt={alt} className="w-full h-full object-cover" />
        )}
      </div>
    )
  }

  const renderMainView = () => {
    return (
      <Fragment>
        {/* Top bar */}
        <div className="flex h-[76px] items-center justify-between px-4 shrink-0 w-full">
          <LocalizedClientLink href="/" onClick={handleClose}>
            <Image
              src="/casanest.png"
              alt="CASANEST Logo"
              width={110}
              height={36}
              priority
              style={{ width: 110, height: 36, objectFit: 'contain', filter: 'brightness(0) invert(1)' }}
            />
          </LocalizedClientLink>
          <button
            onClick={handleClose}
            className="bg-white/[0.08] flex items-center justify-center p-2 rounded-full"
            aria-label="Close menu"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Body */}
        <div className="flex flex-1 flex-col gap-8 overflow-y-auto px-4">
          {/* Nav list */}
          <div className="flex flex-col w-full">
            {navItems.map((item, idx) => {
              const isLast = idx === navItems.length - 1
              const isActive = item.action === 'submenu' ? getSubmenuActive(item.submenuView!) : isActiveLink(item.href || '')
              const label = isRTL ? item.labelAr : item.labelEn

              return (
                <div key={idx}>
                  {item.action === 'submenu' ? (
                    <button
                      onClick={() => setView(item.submenuView!)}
                      className="flex h-14 items-center justify-between w-full"
                    >
                      <span className={"font-satoshi " + (isActive ? 'font-bold text-[#fdb022]' : 'font-normal text-white') + " text-[24px] leading-[32px]"}>
                        {label}
                      </span>
                      <span className={"font-satoshi font-normal text-[20px] " + (isActive ? 'text-[#fdb022]' : 'text-[#c1cee8]')}>
                        {arrowChar}
                      </span>
                    </button>
                  ) : (
                    <LocalizedClientLink
                      href={item.href || '#'}
                      onClick={handleClose}
                      className="flex h-14 items-center justify-between w-full"
                    >
                      <span className={"font-satoshi " + (isActive ? 'font-bold text-[#fdb022]' : 'font-normal text-white') + " text-[24px] leading-[32px]"}>
                        {label}
                      </span>
                      {item.showArrow !== false && (
                        <span className={"font-satoshi font-normal text-[20px] " + (isActive ? 'text-[#fdb022]' : 'text-[#c1cee8]')}>
                          {arrowChar}
                        </span>
                      )}
                    </LocalizedClientLink>
                  )}
                  {!isLast && <div className="h-px w-full bg-white/10" />}
                </div>
              )
            })}
          </div>

          {/* Divider */}
          <div className="h-px w-full bg-white/10" />

          {/* Utility group */}
          <div className="flex flex-col gap-2">
            {/* Quote List */}
            <LocalizedClientLink
              href="/cart"
              onClick={handleClose}
              className="flex h-14 items-center justify-between w-full"
            >
              <div className="flex gap-3 items-center">
                <FileText className="w-5 h-5 text-white" />
                <span className="font-satoshi font-medium text-[18px] text-white">{quoteListText}</span>
              </div>
              {cartCount > 0 && (
                <div className="bg-[#17284a] flex items-center justify-center px-2 py-0.5 rounded-[10px]">
                  <span className="font-satoshi font-bold text-[14px] text-white">{cartCount}</span>
                </div>
              )}
            </LocalizedClientLink>

            {/* Language */}
            <div className="flex h-14 items-center justify-between w-full">
              <div className="flex gap-3 items-center">
                <Globe className="w-5 h-5 text-white" />
                <span className="font-satoshi font-medium text-[18px] text-white">{languageText}</span>
              </div>
              <div className="flex gap-2 items-center text-[14px]">
                <button
                  onClick={() => switchTo('en')}
                  className={"font-satoshi " + (locale === 'en' ? 'font-bold text-[#fdb022]' : 'font-normal text-[#c1cee8]')}
                >
                  EN
                </button>
                <span className="font-satoshi font-medium text-[#c1cee8]">/</span>
                <button
                  onClick={() => switchTo('ar')}
                  className={"font-satoshi " + (locale === 'ar' ? 'font-bold text-[#fdb022]' : 'font-normal text-[#c1cee8]')}
                  dir="auto"
                >
                  العربية
                </button>
              </div>
            </div>

            {/* Phone */}
            <div className="flex gap-3 h-14 items-center w-full">
              <Phone className="w-5 h-5 text-white" />
              <a href="tel:9200123456" className="font-satoshi font-medium text-[18px] text-white">
                9200 123 456
              </a>
            </div>
          </div>
        </div>

        {/* Footer CTA */}
        <div className="flex flex-col px-4 pb-4 pt-6 shrink-0 w-full">
          <LocalizedClientLink
            href="/cart"
            onClick={handleClose}
            className="bg-[#fdb022] flex gap-2 items-center justify-center px-6 py-4 rounded-full w-full"
          >
            <span className="font-satoshi font-bold text-[18px] text-[#051026] text-center">
              {requestQuoteText}
            </span>
            <ArrowRight className="w-4 h-4 text-[#051026]" />
          </LocalizedClientLink>
        </div>
      </Fragment>
    )
  }

  const renderProductsView = () => {
    return (
      <Fragment>
        {renderSubmenuHeader('products')}

        <div className="flex flex-1 flex-col overflow-y-auto py-5">
          {/* View All */}
          <LocalizedClientLink
            href="/store"
            onClick={handleClose}
            className="flex h-14 items-center justify-between px-4 w-full"
          >
            <span className="font-satoshi font-medium text-[16px] text-[#fdb022]">{viewAllProductsText}</span>
            {isRTL ? <ChevronLeft className="w-4 h-4 text-[#fdb022]" /> : <ChevronRight className="w-4 h-4 text-[#fdb022]" />}
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
                <div className="flex h-16 items-center justify-between px-4 w-full">
                  <div className="flex gap-4 items-center">
                    {renderThumbnail(cat.image_url, catName)}
                    {hasChildren ? (
                      <button
                        onClick={() => setExpandedCategory(isExpanded ? null : cat.id)}
                        className={"font-satoshi font-medium text-[18px] " + (isExpanded ? 'text-[#fdb022]' : 'text-white')}
                      >
                        {catName}
                      </button>
                    ) : (
                      <LocalizedClientLink
                        href={"/categories/" + catHandle}
                        onClick={handleClose}
                        className="font-satoshi font-medium text-[18px] text-white"
                      >
                        {catName}
                      </LocalizedClientLink>
                    )}
                  </div>
                  {hasChildren && (
                    <button onClick={() => setExpandedCategory(isExpanded ? null : cat.id)}>
                      {isExpanded ? (
                        <ChevronDown className="w-4 h-4 text-[#fdb022]" />
                      ) : isRTL ? (
                        <ChevronLeft className="w-4 h-4 text-[#c1cee8]" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-[#c1cee8]" />
                      )}
                    </button>
                  )}
                </div>

                {/* Sub-categories */}
                {hasChildren && isExpanded && (
                  <div className={"flex flex-col pb-4 " + (isRTL ? 'pr-[72px] pl-4' : 'pl-[72px] pr-4') + " w-full relative"}>
                    <div className={"absolute " + (isRTL ? 'right-[60px]' : 'left-[60px]') + " top-0 bottom-4 w-px bg-white/10"} />

                    <LocalizedClientLink
                      href={"/categories/" + catHandle}
                      onClick={handleClose}
                      className="flex h-14 items-center gap-3 w-full"
                    >
                      {renderThumbnail(cat.image_url, viewAllCatText)}
                      <span className="font-satoshi font-normal text-[16px] text-[#c1cee8]">{viewAllCatText}</span>
                    </LocalizedClientLink>

                    {children.map((child: any) => (
                      <LocalizedClientLink
                        key={child.id}
                        href={"/categories/" + getCatHandle(child)}
                        onClick={handleClose}
                        className="flex h-14 items-center gap-3 w-full"
                      >
                        {renderThumbnail(child.image_url, getCatName(child))}
                        <span className="font-satoshi font-normal text-[16px] text-[#c1cee8]">{getCatName(child)}</span>
                      </LocalizedClientLink>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </Fragment>
    )
  }

  const renderSolutionsView = () => {
    return (
      <Fragment>
        {renderSubmenuHeader('solutions')}

        <div className="flex flex-1 flex-col overflow-y-auto py-5">
          {/* View All */}
          <LocalizedClientLink
            href="/pre-curated-solutions"
            onClick={handleClose}
            className="flex h-14 items-center justify-between px-4 w-full"
          >
            <span className="font-satoshi font-medium text-[16px] text-[#fdb022]">{viewAllSolutionsText}</span>
            {isRTL ? <ChevronLeft className="w-4 h-4 text-[#fdb022]" /> : <ChevronRight className="w-4 h-4 text-[#fdb022]" />}
          </LocalizedClientLink>

          {/* Package list */}
          {packages.map((pkg) => {
            const pkgName = getPkgName(pkg)
            return (
              <LocalizedClientLink
                key={pkg.id}
                href={"/pre-curated-solutions/" + pkg.slug}
                onClick={handleClose}
                className="flex h-16 items-center gap-4 px-4 w-full"
              >
                {renderThumbnail(pkg.image_url, pkgName)}
                <span className="font-satoshi font-medium text-[18px] text-white">
                  {pkgName}
                </span>
              </LocalizedClientLink>
            )
          })}
        </div>
      </Fragment>
    )
  }

  const renderProjectsView = () => {
    return (
      <Fragment>
        {renderSubmenuHeader('projects')}

        <div className="flex flex-1 flex-col overflow-y-auto py-5">
          {/* View All */}
          <LocalizedClientLink
            href="/our-services"
            onClick={handleClose}
            className="flex h-14 items-center justify-between px-4 w-full"
          >
            <span className="font-satoshi font-medium text-[16px] text-[#fdb022]">{viewAllProjectsText}</span>
            {isRTL ? <ChevronLeft className="w-4 h-4 text-[#fdb022]" /> : <ChevronRight className="w-4 h-4 text-[#fdb022]" />}
          </LocalizedClientLink>

          {/* Category groups */}
          {projectGroups.map((group) => {
            const groupName = getGroupName(group)
            const groupId = group.category.id
            const isExpanded = expandedCategory === groupId
            const thumbnailUrl = group.projects.length > 0 ? group.projects[0].hero_image_url : null

            return (
              <div key={groupId}>
                <div className="flex h-16 items-center justify-between px-4 w-full">
                  <div className="flex gap-4 items-center">
                    {renderThumbnail(thumbnailUrl, groupName)}
                    <button
                      onClick={() => setExpandedCategory(isExpanded ? null : groupId)}
                      className={"font-satoshi font-medium text-[18px] " + (isExpanded ? 'text-[#fdb022]' : 'text-white')}
                    >
                      {groupName}
                    </button>
                  </div>
                  <button onClick={() => setExpandedCategory(isExpanded ? null : groupId)}>
                    {isExpanded ? (
                      <ChevronDown className="w-4 h-4 text-[#fdb022]" />
                    ) : isRTL ? (
                      <ChevronLeft className="w-4 h-4 text-[#c1cee8]" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-[#c1cee8]" />
                    )}
                  </button>
                </div>

                {/* Projects under category */}
                {isExpanded && (
                  <div className={"flex flex-col pb-4 " + (isRTL ? 'pr-[72px] pl-4' : 'pl-[72px] pr-4') + " w-full relative"}>
                    <div className={"absolute " + (isRTL ? 'right-[60px]' : 'left-[60px]') + " top-0 bottom-4 w-px bg-white/10"} />

                    {group.projects.map((project) => {
                      const projectImg = project.hero_image_url || null
                      return (
                        <LocalizedClientLink
                          key={project.id}
                          href={"/our-services/projects/" + project.slug}
                          onClick={handleClose}
                          className="flex h-14 items-center gap-3 w-full"
                        >
                          {renderThumbnail(projectImg, getProjectName(project))}
                          <span className="font-satoshi font-normal text-[16px] text-[#c1cee8]">{getProjectName(project)}</span>
                        </LocalizedClientLink>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </Fragment>
    )
  }

  const renderView = () => {
    if (view === 'products') return renderProductsView()
    if (view === 'solutions') return renderSolutionsView()
    if (view === 'projects') return renderProjectsView()
    return renderMainView()
  }

  return (
    <Fragment>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center justify-center p-2 md:hidden"
        aria-label="Open menu"
      >
        <BarsIcon />
      </button>

      <div
        className={"fixed inset-0 z-[100] transition-all duration-300 " + (isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none')}
        style={{ visibility: isOpen ? 'visible' : 'hidden' }}
      >
        <div
          className="absolute inset-0 bg-black/60 transition-opacity duration-300"
          onClick={handleClose}
        />

        <div
          className={"absolute top-0 " + (isRTL ? 'right-0 ' : 'left-0 ') + "h-full w-full bg-[#051026] transition-transform duration-300 ease-out flex flex-col " + (isOpen ? 'translate-x-0' : isRTL ? 'translate-x-full' : '-translate-x-full')}
          dir={isRTL ? 'rtl' : 'ltr'}
        >
          {renderView()}
        </div>
      </div>
    </Fragment>
  )
}
