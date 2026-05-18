import LocalizedClientLink from "@modules/common/components/localized-client-link"
import ChevronDown from "@modules/common/icons/chevron-down"
import MedusaCTA from "@modules/layout/components/medusa-cta"
import SideMenu from "@modules/layout/components/side-menu"
import Image from "next/image"
import { getLocale } from "next-intl/server"
import { ChevronRightIcon } from "@modules/common/icons/chevron-right"

export default async function CheckoutLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const locale = await getLocale()
  const isRTL = locale === "ar"
  return (
    <div dir={isRTL ? "rtl" : "ltr"} className="w-full bg-white relative small:min-h-screen">
      <div className="h-16 bg-white border-b ">
        <nav className="flex h-full items-center content-container justify-between">
          {/* <div className=" flex-1 basis-0 h-full flex items-center bg-blue-500">

            <LocalizedClientLink
              href="/cart"
              className="text-small-semi text-ui-fg-base flex items-center gap-x-2 uppercase flex-1 basis-0"
              data-testid="back-to-cart-link"
            >
              <ChevronDown className="rotate-90" size={16} />
              <span className="mt-px hidden small:block txt-compact-plus text-ui-fg-subtle hover:text-ui-fg-base ">
                Back to shopping cart
              </span>
              <span className="mt-px block small:hidden txt-compact-plus text-ui-fg-subtle hover:text-ui-fg-base">
                Back 
              </span>
            </LocalizedClientLink>
          </div> */}
          {/* <LocalizedClientLink
            href="/"
            className="txt-compact-xlarge-plus text-ui-fg-subtle hover:text-ui-fg-base uppercase"
            data-testid="store-link"
          >
            Medusa Store
          </LocalizedClientLink> */}
          <div className=" h-full flex items-center ">
            <div className="">
              <LocalizedClientLink
                href="/cart"
                className="text-small-semi text-ui-fg-base flex items-center gap-x-2 uppercase flex-1 basis-0"
                data-testid="back-to-cart-link"
              >
                <ChevronRightIcon className={isRTL ? "" : "rotate-180"} size={16} />
                <span className="mt-px hidden small:block txt-compact-plus text-ui-fg-subtle hover:text-ui-fg-base ">
                  {isRTL ? "العودة إلى عربة التسوق" : "Back to shopping cart"}
                </span>
                <span className="mt-px block small:hidden txt-compact-plus text-ui-fg-subtle hover:text-ui-fg-base">
                  {isRTL ? "العودة" : "Back"}
                </span>
              </LocalizedClientLink>
            </div>
          </div>
          <div className="flex items-center h-full md:hidden">
            <LocalizedClientLink
              href="/"
              className="text-3xl font-extrabold tracking-widest uppercase text-transparent bg-clip-text hover:from-blue-600 hover:to-blue-800 transition-all duration-300 ease-in-out leading-none"
              data-testid="nav-store-link"
            >
              <Image
                src="/casanest.png"
                alt="Logo"
                width={100}
                height={100}
                style={{ width: "auto", height: "auto" }}
              />
            </LocalizedClientLink>

          </div>

          <div className="hidden md:flex  h-full flex items-center">
            <LocalizedClientLink
              href="/"
              className="text-3xl font-extrabold tracking-widest uppercase text-transparent bg-clip-text hover:from-blue-600 hover:to-blue-800 transition-all duration-300 ease-in-out leading-none"
              data-testid="nav-store-link"
            >
              <Image
                src="/casanest.png"
                alt="Logo"
                width={150}
                height={150}
                style={{ width: "auto", height: "auto" }}
              />
            </LocalizedClientLink>

          </div>
          {/* <div className="flex-1 basis-0" /> */}
        </nav>
      </div>
      <div className="relative" data-testid="checkout-container">{children}</div>
      {/* <div className="py-4 w-full flex items-center justify-center">
        <MedusaCTA />
      </div> */}
    </div>
  )
}
