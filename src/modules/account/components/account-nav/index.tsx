"use client"

import { clx } from "@medusajs/ui"
import { ArrowRightOnRectangle } from "@medusajs/icons"
import { useParams, usePathname } from "next/navigation"

import ChevronDown from "@modules/common/icons/chevron-down"
import User from "@modules/common/icons/user"
import MapPin from "@modules/common/icons/map-pin"
import Package from "@modules/common/icons/package"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { HttpTypes } from "@medusajs/types"
import { signout } from "@lib/data/customer"
import { useLocale } from "next-intl";
import { ArrowLeftIcon } from "@modules/common/icons/arrow-left"
import { ArrowRightIcon } from "lucide-react"
import { ChevronLeftIcon } from '@modules/common/icons/chevron-left'
import { ChevronRightIcon } from '@modules/common/icons/chevron-right'



const AccountNav = ({
  customer,
}: {
  customer: HttpTypes.StoreCustomer | null
}) => {
  const route = usePathname()
  const { countryCode } = useParams() as { countryCode: string }
  const locale = useLocale();

  const handleLogout = async () => {
    await signout(countryCode)
  }

  return (
    <div>
      <div className="small:hidden" data-testid="mobile-account-nav">
        {route !== `/${locale}/${countryCode}/account` ? (
          <LocalizedClientLink
            href="/account"
            className="flex items-center gap-x-2 text-small-regular py-2 text-[#043364] "
            data-testid="account-main-link"
          >
            <>
              {
                locale === "ar" ? <ArrowRightIcon size={15} direction="left" />
                  : <ArrowLeftIcon size={15} direction="right" />
              }
              <span>{
                locale === "ar" ? "الحساب" : "Account"
              }</span>
            </>
          </LocalizedClientLink>
        ) : (
          <>
            <div className="text-xl-semi mb-4 px-8 text-[#043364] ">
              {locale === "ar" ? "مرحبا" : "Hello"} {customer?.first_name}
            </div>
            <div className="text-base-regular text-[#043364]">
              <ul>
                <li>
                  <LocalizedClientLink
                    href="/account/profile"
                    className="flex items-center justify-between py-4 border-b border-gray-200 px-8"
                    data-testid="profile-link"
                  >
                    <>
                      <div className="flex items-center gap-x-2">
                        <User size={20} />
                        <span>{locale === "ar" ? "الملف الشخصي" : "Profile"}</span>
                      </div>
                      {
                        locale === 'ar' ? (
                          <ChevronLeftIcon className="h-5 w-5" />
                        ) : (
                          <ChevronRightIcon className="h-5 w-5" />
                        )
                      }
                    </>
                  </LocalizedClientLink>
                </li>
                <li>
                  <LocalizedClientLink
                    href="/account/addresses"
                    className="flex items-center justify-between py-4 border-b border-gray-200 px-8"
                    data-testid="addresses-link"
                  >
                    <>
                      <div className="flex items-center gap-x-2">
                        <MapPin size={20} />
                        <span>{locale === "ar" ? "العناوين" : "Addresses"}</span>
                      </div>
                      {
                        locale === 'ar' ? (
                          <ChevronLeftIcon className="h-5 w-5" />
                        ) : (
                          <ChevronRightIcon className="h-5 w-5" />
                        )
                      }
                    </>
                  </LocalizedClientLink>
                </li>
                <li>
                  <LocalizedClientLink
                    href="/account/orders"
                    className="flex items-center justify-between py-4 border-b border-gray-200 px-8"
                    data-testid="orders-link"
                  >
                    <div className="flex items-center gap-x-2">
                      <Package size={20} />
                      <span>{locale === "ar" ? "الطلبات" : "Orders"}</span>
                    </div>
                    {
                      locale === 'ar' ? (
                        <ChevronLeftIcon className="h-5 w-5" />
                      ) : (
                        <ChevronRightIcon className="h-5 w-5" />
                      )
                    }
                  </LocalizedClientLink>
                </li>
                <li>
                  <button
                    type="button"
                    className="flex items-center justify-between py-4 border-b border-gray-200 px-8 w-full"
                    onClick={handleLogout}
                    data-testid="logout-button"
                  >
                    <div className="flex items-center gap-x-2">
                      <ArrowRightOnRectangle />
                      <span>{locale === "ar" ? "تسجيل الخروج" : "Logout"}</span>
                    </div>
                    {
                      locale === 'ar' ? (
                        <ChevronLeftIcon className="h-5 w-5" />
                      ) : (
                        <ChevronRightIcon className="h-5 w-5" />
                      )
                    }
                  </button>
                </li>
              </ul>
            </div>
          </>
        )}
      </div>
      <div className="hidden small:block text-[#043364]" data-testid="account-nav">
        <div>
          <div className="pb-4">
            <h3 className="text-base-semi">{locale === "ar" ? "الحساب" : "Account"}</h3>
          </div>
          <div className="text-base-regular text-[#043364]">
            <ul className="flex mb-0 justify-start items-start flex-col gap-y-4 text-[#043364]">
              <li>
                <AccountNavLink
                  href="/account"
                  route={route!}
                  data-testid="overview-link"
                >
                  {locale === "ar" ? "نظرة عامة" : "Overview"}
                </AccountNavLink>
              </li>
              <li>
                <AccountNavLink
                  href="/account/profile"
                  route={route!}
                  data-testid="profile-link"
                >
                  {locale === "ar" ? "الملف الشخصي" : "Profile"}
                </AccountNavLink>
              </li>
              <li>
                <AccountNavLink
                  href="/account/addresses"
                  route={route!}
                  data-testid="addresses-link"
                >
                  {locale === "ar" ? "العناوين" : "Addresses"}
                </AccountNavLink>
              </li>
              <li>
                <AccountNavLink
                  href="/account/orders"
                  route={route!}
                  data-testid="orders-link"
                >
                  {locale === "ar" ? "الطلبات" : "Orders"}
                </AccountNavLink>
              </li>
              <li className="text-grey-700">
                <button
                  type="button"
                  onClick={handleLogout}
                  data-testid="logout-button"
                >
                  {locale === "ar" ? "تسجيل الخروج" : "Logout"}
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

type AccountNavLinkProps = {
  href: string
  route: string
  children: React.ReactNode
  "data-testid"?: string
}

const AccountNavLink = ({
  href,
  route,
  children,
  "data-testid": dataTestId,
}: AccountNavLinkProps) => {
  const { countryCode }: { countryCode: string } = useParams()

  const active = route.split(countryCode)[1] === href
  return (
    <LocalizedClientLink
      href={href}
      className={clx("text-ui-fg-subtle hover:text-[#043364]", {
        "text-[#043364] font-semibold": active,
      })}
      data-testid={dataTestId}
    >
      {children}
    </LocalizedClientLink>
  )
}

export default AccountNav
