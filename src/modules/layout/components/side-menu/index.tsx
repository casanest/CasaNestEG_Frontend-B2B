'use client'

import React, { Fragment, useMemo, useState } from 'react'
import Image from 'next/image'

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
import { Heading } from '@modules/common/components/heading'
import LocalizedClientLink from '@modules/common/components/localized-client-link'
import * as VisuallyHidden from '@radix-ui/react-visually-hidden'
import { ArrowLeftIcon } from '@modules/common/icons/arrow-left'
import X from '@modules/common/icons/x'
import { ChevronRightIcon } from '@modules/common/icons/chevron-right'
import { BarsIcon } from '@modules/common/icons/bars'
import { usePathname } from 'next/navigation'
import { useLocale } from 'next-intl'

interface CategoryItem {
  name: string
  handle: string
}

const SideMenu = ({
  productCategories,
  collections,
  // locale,
}: {
  productCategories: StoreProductCategory[]
  collections: StoreCollection[]
  // locale: string
}) => {
  const [categoryStack, setCategoryStack] = useState<CategoryItem[]>([])
  const currentCategory = categoryStack[categoryStack.length - 1] || null
  const [isOpen, setIsOpen] = useState(false)

    const pathname = usePathname();
    const locale = useLocale();
  
    const switchTo = (newLocale: string) => {
      // Remove current locale from pathname
      const pathWithoutLocale = pathname.replace(`/${locale}`, '');
      const newPath = `/${newLocale}${pathWithoutLocale}`;
  
      // Force full page reload
      window.location.href = newPath;
    };

  // console.log('Categories:', productCategories)
  // console.log('Collections:', collections)

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
      const hasChildren =
        item.category_children && item.category_children.length > 0

      const lastCategoryIndex = categories.findLastIndex(
        (cat) => cat.type === 'parent_category'
      )


      return (
        <Fragment key={index} >
          <Button
            variant="ghost"
            className="w-full justify-between"
            onClick={
              hasChildren
                ? () =>
                  handleCategoryClick({
                    name: item.name,
                    handle: item.handle,
                  })
                : () => handleOpenDialogChange(false)
            }
            asChild={!hasChildren}
          >
            {hasChildren ? (
              <>
                <span className="flex items-center gap-4">
                  {item.icon && item.icon}
                  {item.name}
                </span>
                <ChevronRightIcon className="h-5 w-5" />
              </>
            ) : (
              <LocalizedClientLink href={item.handle}>
                <span className="flex items-center gap-4">
                  {item.icon && item.icon}
                  {item.name}
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
      const found = currentCategories.find(
        (item) => item.name === category.name
      )
      if (found?.category_children) {
        currentCategories = found.category_children.map((category) => ({
          ...category,
          icon: null,
        }))
      } else {
        break
      }
    }
    return currentCategories
  }

  const shouldRenderButton =
    !currentCategory || currentCategory.name !== 'Collections'

  return (
    <Dialog  open={isOpen} onOpenChange={handleOpenDialogChange}>
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
          <DialogHeader className="flex items-center gap-4 !p-4 text-xl text-basic-primary small:text-2xl">
            {currentCategory && (
              <Button variant="tonal" withIcon size="sm" onClick={handleBack}>
                <ArrowLeftIcon className="h-5 w-5" />
              </Button>
            )}
            {currentCategory?.name || 'Menu'}
            <Button
              onClick={() => handleOpenDialogChange(false)}
              variant="icon"
              withIcon
              size="sm"
              className="ml-auto p-2"
            >
              <X />
            </Button>
          </DialogHeader>
          <VisuallyHidden.Root>
            <DialogTitle>Menu modal</DialogTitle>
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
                    Shop all{' '}
                    {currentCategory && currentCategory.name !== 'store'
                      ? currentCategory.name
                      : ''}
                  </LocalizedClientLink>
                </Button>
              )}
              {renderCategories(getActiveCategories())}
              
            </Box>
            <button
              onClick={() => switchTo(locale === "en" ? "ar" : "en")}
              className="mt-4 w-full rounded-md border border-ui-border-base bg-ui-bg-base px-4 py-2 text-sm font-semibold text-ui-fg-base shadow-sm transition-colors duration-200 hover:bg-ui-bg-interactive hover:text-ui-fg-interactive hover:text-white"
            >
              {locale === "en" ? "تغيير إلى العربية" : "Change to English"}
            </button>
          </DialogBody>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  )
}

export default SideMenu
