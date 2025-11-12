'use client'

import { useMemo, useState } from 'react'
import { usePathname } from 'next/navigation'

import { createNavigation } from '@lib/constants'
import { cn } from '@lib/util/cn'
import { formatNameForTestId } from '@lib/util/formatNameForTestId'
import { StoreCollection, StoreProductCategory } from '@medusajs/types'
import { Box } from '@modules/common/components/box'
import { NavigationItem } from '@modules/common/components/navigation-item'
import DropdownMenu from './dropdown-menu'

type NavigationProps = {
  countryCode: string
  productCategories: StoreProductCategory[]
  collections: StoreCollection[]
}

export default function Navigation({
  countryCode,
  productCategories,
  collections,
}: NavigationProps) {
  const pathname = usePathname()
  const [openDropdown, setOpenDropdown] = useState<{ name: string; handle: string } | null>(null)

  const navigation = useMemo(
    () => createNavigation(productCategories, collections),
    [productCategories, collections]
  )

  return (
    <Box className="hidden gap-4 self-stretch large:flex">
      {navigation.map((item: any, index: number) => {
        const handle = item.handle || item.name.toLowerCase().replace(/\s+/g, '-')
        const fullPath = `/${countryCode}${item.handle}`
        const isActive =
          pathname === fullPath ||
          pathname.startsWith(`${fullPath}/`) ||
          pathname.includes(`${countryCode}/categories`) && handle === 'shop'

        return (
          <DropdownMenu
            key={index}
            item={item}
            activeItem={openDropdown}
            isOpen={openDropdown?.name === item.name}
            onOpenChange={(open) => {
              setOpenDropdown(open ? { name: item.name, handle } : null)
            }}
          >
            <div
              className="flex h-full items-center"
              data-testid={formatNameForTestId(`${item.name}-dropdown`)}
            >
              <NavigationItem
                href={fullPath}
                className={cn('!py-2 px-2', {
                  'border-b-2 border-action-primary font-medium text-action-primary': isActive,
                })}
              >
                {item.name}
              </NavigationItem>
            </div>
          </DropdownMenu>
        )
      })}
    </Box>
  )
}
