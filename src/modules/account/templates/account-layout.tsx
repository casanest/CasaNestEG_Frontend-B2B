import React from "react"

import UnderlineLink from "@modules/common/components/interactive-link"

import AccountNav from "../components/account-nav"
import { HttpTypes } from "@medusajs/types"
import { getLocale } from "next-intl/server"

interface AccountLayoutProps {
  customer: HttpTypes.StoreCustomer | null
  children: React.ReactNode
}

const AccountLayout: React.FC<AccountLayoutProps> = async ({
  customer,
  children,
}) => {
  const locale = await getLocale()
  return (
    <div dir={locale === "ar" ? "rtl" : "ltr"} className="flex-1 small:py-12" data-testid="account-page">
      <div className="flex-1 content-container h-full max-w-5xl mx-auto bg-white flex flex-col">
        <div className="grid grid-cols-1  small:grid-cols-[240px_1fr] py-12">
          <div>{customer && <AccountNav customer={customer} />}</div>
          <div className="flex-1">{children}</div>
        </div>
        <div dir={locale === "ar" ? "rtl" : "ltr"} className="flex flex-col small:flex-row items-end justify-between small:border-t border-gray-200 py-12 gap-8">
          <div dir={locale === "ar" ? "rtl" : "ltr"} >
            <h3 className="text-xl-semi mb-4 text-[#043364]">{
              locale === "ar" ? "الأسئلة الشائعة" : "Got questions?"}</h3>
            <span className="txt-medium">
              {
                locale === "ar" ? " يمكنك العثور على الأسئلة الشائعة والأجوبة على صفحة خدمة العملاء." : " You can find frequently asked questions and answers on our customer service page."
              }
            </span>
          </div>
          <div>
            <UnderlineLink href="/customer-service">
              {locale === "ar" ? "صفحة خدمة العملاء" : "Customer Service"}
            </UnderlineLink>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AccountLayout
