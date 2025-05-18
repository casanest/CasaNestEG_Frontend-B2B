import React from "react"

import Footer from "@modules/layout/templates/footer"
import Nav from "@modules/layout/templates/nav"
import TopNav from "../components/top-nav"

const Layout: React.FC<{
  children: React.ReactNode
}> = ({ children }) => {
  const locale = "ar" // useLocale() // Assuming you have a way to get the current locale
  // const isRTL = locale === "ar" // Assuming you have a way to determine if the locale is RTL
  return (
    <div>
      <Nav />
      <main className="relative">{children}</main>
      <Footer />
    </div>
  )
}

export default Layout
