'use client'

import React, { Fragment, useMemo, useState } from 'react'
import { createNavigation } from '@lib/constants'
import { StoreCollection, StoreProductCategory } from '@medusajs/types'
import { Box } from '@modules/common/components/box'
import { Button } from '@modules/common/components/button'
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
} from '@modules/common/components/dialog'
import Divider from '@modules/common/components/divider'
import LocalizedClientLink from '@modules/common/components/localized-client-link'
import * as VisuallyHidden from '@radix-ui/react-visually-hidden'
import { ArrowLeftIcon } from '@modules/common/icons/arrow-left'
import X from '@modules/common/icons/x'
import { ChevronRightIcon } from '@modules/common/icons/chevron-right'
import { BarsIcon } from '@modules/common/icons/bars'
import { usePathname } from 'next/navigation'
import { useLocale } from 'next-intl'
import { ArrowRightIcon } from 'lucide-react'
import { ChevronLeftIcon } from '@modules/common/icons/chevron-left'

interface CategoryItem {
  name: string
  handle: string
}

const SideMenu = ({
  productCategories,
  collections,
}: {
  productCategories: StoreProductCategory[]
  collections: StoreCollection[]
}) => {
  const [categoryStack, setCategoryStack] = useState<CategoryItem[]>([])
  const currentCategory = categoryStack[categoryStack.length - 1] || null
  const [isOpen, setIsOpen] = useState(false)

  const pathname = usePathname()
  const locale = useLocale()

  const switchTo = (newLocale: string) => {
    const pathWithoutLocale = pathname.replace(`/${locale}`, '')
    const newPath = `/${newLocale}${pathWithoutLocale}`
    window.location.href = newPath
  }

  const navigation = useMemo(
    () => createNavigation(productCategories, collections),
    [productCategories, collections]
  )

  const handleCategoryClick = (category: CategoryItem) => {
    setCategoryStack([
      ...categoryStack,
      { name: category.name, handle: category.handle },
    ])
  }

  const handleBack = () => {
    setCategoryStack(categoryStack.slice(0, -1))
  }

  const handleOpenDialogChange = (open: boolean) => {
    setIsOpen(open)
    if (!open) {
      setCategoryStack([])
    }
  }

  const renderCategories = (categories: any[]) => {
    return categories.map((item, index) => {
      const children = item.category_children || []
      const hasChildren = children.length > 0

      // Localize name and handle
      const categoryName =
        locale === 'ar' ? item.name_ar || item.name_en : item.name_en || item.name_ar
      const categoryHandle =
        locale === 'ar' ? item.handle_ar || item.handle_en : item.handle_en || item.handle_ar

      const lastCategoryIndex = categories.findLastIndex(
        (cat) => cat.type === 'parent_category'
      )

      return (
        <Fragment key={index}>
          <Button
            variant="ghost"
            className="w-full justify-between"
            onClick={
              hasChildren
                ? () =>
                  handleCategoryClick({
                    name: categoryName,
                    handle: categoryHandle,
                  })
                : () => handleOpenDialogChange(false)
            }
            asChild={!hasChildren}
          >
            {hasChildren ? (
              <>
                <span className="flex items-center gap-4">
                  {item.icon && item.icon}
                  {categoryName}
                </span>
                {locale === 'ar' ? (
                  <ChevronLeftIcon className="h-5 w-5" />
                ) : (
                  <ChevronRightIcon className="h-5 w-5" />
                )}
              </>
            ) : (
              <LocalizedClientLink href={categoryHandle}>
                <span className="flex items-center gap-4">
                  {item.icon && item.icon}
                  {categoryName}
                </span>
              </LocalizedClientLink>
            )}
          </Button>
          {index === lastCategoryIndex && (
            <Divider className="my-4 -ml-4 w-[calc(100%+2rem)]" />
          )}
        </Fragment>
      )
    })
  }

  const getActiveCategories = () => {
    let currentCategories = [
      ...(navigation[0]?.category_children || []),
      ...navigation.slice(1),
    ]

    for (const category of categoryStack) {
      const found = currentCategories.find((item) => {
        const itemName =
          locale === 'ar' ? item.name_ar || item.name_en : item.name_en || item.name_ar
        return itemName === category.name
      })

      if (found?.category_children && found.category_children.length > 0) {
        currentCategories = found.category_children.map((category) => ({
          ...category,
          icon: null,
        }))
      } else {
        break
      }
    }

    // Map categories to include localized name and handle for rendering
    return currentCategories.map((item) => ({
      ...item,
      name: locale === 'ar' ? item.name_ar || item.name_en : item.name_en || item.name_ar,
      handle:
        locale === 'ar' ? item.handle_ar || item.handle_en : item.handle_en || item.handle_ar,
    }))
  }

  const shouldRenderButton =
    !currentCategory || currentCategory.name !== 'Collections'

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenDialogChange}>
      <DialogTrigger asChild>
        <Button
          variant="icon"
          withIcon
          className="flex h-auto !p-2 xsmall:!p-3.5 large:hidden"
        >
          <BarsIcon />
        </Button>
      </DialogTrigger>
      <DialogPortal>
        <DialogOverlay />
        <DialogContent
          className="!max-h-full !max-w-full !rounded-none"
          aria-describedby={undefined}
          dir={locale === 'ar' ? 'rtl' : 'ltr'}
        >
          <DialogHeader
            dir={locale === 'ar' ? 'rtl' : 'ltr'}
            className="flex items-center gap-4 !p-4 text-xl text-basic-primary small:text-2xl"
          >
            {currentCategory && (
              <Button variant="tonal" withIcon size="sm" onClick={handleBack}>
                {locale === 'ar' ? (
                  <ArrowRightIcon className="h-5 w-5" direction="left" />
                ) : (
                  <ArrowLeftIcon className="h-5 w-5" direction="right" />
                )}
              </Button>
            )}
            {currentCategory?.name || (locale === 'ar' ? 'القائمة' : 'Menu')}
            <Button
              onClick={() => handleOpenDialogChange(false)}
              variant="icon"
              withIcon
              size="sm"
              className={`${locale === 'ar' ? 'mr-auto' : 'ml-auto'} p-2 `}
            >
              <X />
            </Button>
          </DialogHeader>
          <VisuallyHidden.Root>
            <DialogTitle>{locale === 'ar' ? 'القائمة' : 'Menu'}</DialogTitle>
          </VisuallyHidden.Root>
          <DialogBody className="overflow-y-auto p-4 small:p-5">
            <Box className="flex flex-col">
              {shouldRenderButton && (
                <Button
                  variant="tonal"
                  className="mb-4 w-max"
                  size="sm"
                  onClick={() => handleOpenDialogChange(false)}
                  asChild={!!currentCategory}
                >
                  <LocalizedClientLink
                    href={
                      currentCategory ? `${currentCategory.handle}` : `/store`
                    }
                  >
                    {locale === 'ar' ? 'تسوق الكل' : 'Shop all'}{"  "}
                    {currentCategory && currentCategory.name !== 'store'
                      ? currentCategory.name
                      : ''}
                  </LocalizedClientLink>
                </Button>
              )}
              {renderCategories(getActiveCategories())}
            </Box>
            <button
              onClick={() => switchTo(locale === 'en' ? 'ar' : 'en')}
              className="mt-4 w-full rounded-md border border-ui-border-base bg-ui-bg-base px-4 py-2 text-sm font-semibold text-ui-fg-base shadow-sm transition-colors duration-200 hover:bg-ui-bg-interactive hover:text-ui-fg-interactive hover:text-white"
            >
              {locale === 'en' ? 'تغيير إلى العربية' : 'Change to English'}
            </button>
          </DialogBody>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  )
}

export default SideMenu
