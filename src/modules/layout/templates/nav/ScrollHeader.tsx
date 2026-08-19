"use client"

import { useEffect, useState } from "react"

export default function ScrollHeader({
  children,
  isRTL,
}: {
  children: React.ReactNode
  isRTL: boolean
}) {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <div
      className={`sticky w-full top-0 inset-x-0 z-[40] transition-all duration-300 ${
        scrolled
          ? "bg-white shadow-md border-b border-gray-200"
          : "bg-transparent"
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
  )
}
