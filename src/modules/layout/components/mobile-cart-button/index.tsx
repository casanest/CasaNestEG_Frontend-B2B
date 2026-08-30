"use client"

import { useCartStore } from "@lib/store/useCartStore"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { FileAddIcon } from "@modules/common/icons/file-add"

export default function MobileCartButton() {
  const items = useCartStore((state) => state.items)
  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0)

  return (
    <LocalizedClientLink
      href="/cart"
      data-testid="nav-cart-link"
      className="flex items-center bg-[#cdd6e9] p-2 rounded-[12px] md:hidden"
    >
      <div className="relative">
        <FileAddIcon className="text-black" />
        {totalItems > 0 && (
          <span className="absolute -top-1.5 -right-1.5 min-w-[14px] h-[14px] px-1 flex items-center justify-center rounded-full bg-[#17284a] text-white text-[12px] font-medium leading-none font-satoshi">
            {totalItems}
          </span>
        )}
      </div>
    </LocalizedClientLink>
  )
}
