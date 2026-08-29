"use client"

import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"

export default function ScrollHeader({
  children,
  isRTL,
  topNav,
}: {
  children: React.ReactNode
  isRTL: boolean
  topNav?: React.ReactNode
}) {
  const [scrolled, setScrolled] = useState(false)
  const [cartOpen, setCartOpen] = useState(false)
  const pathname = usePathname()
  const isHomePage = /^\/[a-z]{2}\/[a-z]{2}\/?$/.test(pathname)

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0
      setScrolled(scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll, { passive: true })
    document.addEventListener("scroll", handleScroll, { passive: true })
    handleScroll()
    return () => {
      window.removeEventListener("scroll", handleScroll)
      document.removeEventListener("scroll", handleScroll)
    }
  }, [])

  useEffect(() => {
    const handler = (e: Event) => {
      setCartOpen((e as CustomEvent).detail.open)
    }
    window.addEventListener("cart-dropdown-state", handler as EventListener)
    return () => window.removeEventListener("cart-dropdown-state", handler as EventListener)
  }, [])

  const showBg = scrolled || cartOpen

  return (
    <div className="sticky top-0 inset-x-0 z-[40] w-full">
      {topNav}
      <div
        className={`w-full transition-all duration-300 ${
          showBg
            ? "bg-[#141b34] md:bg-white md:shadow-md md:border-b md:border-gray-200"
            : isHomePage
              ? "bg-gradient-to-b from-black/40 to-transparent"
              : "bg-[#141b34] md:bg-transparent"
        }`}
      >
        <header className="relative mx-auto duration-200">
          <nav
            className="content-container txt-xsmall-plus text-ui-fg-subtle flex items-center justify-between w-full py-3 text-small-regular"
            dir={isRTL ? "rtl" : "ltr"}
          >
            {children}
          </nav>
        </header>
      </div>
    </div>
  )
}
