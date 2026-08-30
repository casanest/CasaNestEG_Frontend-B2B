"use client"

import CartDropdown from "../cart-dropdown"

export default function CartButton({ locale }: { locale: string }) {
  return <CartDropdown locale={locale} />
}
