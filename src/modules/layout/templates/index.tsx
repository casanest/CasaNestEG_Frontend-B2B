import React from "react"

import Nav from "@modules/layout/templates/nav"
import FooterServer from "./footer/FooterServer"

const Layout: React.FC<{
  children: React.ReactNode
}> = ({ children }) => {
  const locale = "ar" // useLocale() // Assuming you have a way to get the current locale
  // const isRTL = locale === "ar" // Assuming you have a way to determine if the locale is RTL
  return (
    <div>
      <Nav />
      <main>{children}</main>
      <FooterServer />
    </div>
  )
}

export default Layout
