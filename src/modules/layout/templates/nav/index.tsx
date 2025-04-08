import { Suspense } from "react"

import { listRegions } from "@lib/data/regions"
import { StoreRegion } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import CartButton from "@modules/layout/components/cart-button"
import SideMenu from "@modules/layout/components/side-menu"
import TopNav from "@modules/layout/components/top-nav"
import Image from "next/image"
import { User } from "lucide-react"

export default async function Nav() {
  const regions = await listRegions().then((regions: StoreRegion[]) => regions)

  return (
    <>
      <TopNav />
      <div className=" sticky top-0 inset-x-0 z-[50] group">
        <header className="relative h-16 mx-auto border-b duration-200 bg-white border-ui-border-base">
          <nav className="content-container txt-xsmall-plus text-ui-fg-subtle flex items-center justify-between w-full h-full text-small-regular">
            <div className="flex-1 basis-0 h-full flex items-center md:hidden">
              <div className="h-full">
                <SideMenu regions={regions} />
              </div>
            </div>
            <div className="flex items-center h-full md:hidden">
              <LocalizedClientLink
                href="/"
                className="text-3xl font-extrabold tracking-widest uppercase text-transparent bg-clip-text hover:from-blue-600 hover:to-blue-800 transition-all duration-300 ease-in-out leading-none"
                data-testid="nav-store-link"
              >
                <Image
                  src="/lacasaLogo.png"
                  alt="Logo"
                  width={100}
                  height={100}
                />
              </LocalizedClientLink>

            </div>

            <div className="hidden md:flex flex-1 basis-0 h-full flex items-center">
              <LocalizedClientLink
                href="/"
                className="text-3xl font-extrabold tracking-widest uppercase text-transparent bg-clip-text hover:from-blue-600 hover:to-blue-800 transition-all duration-300 ease-in-out leading-none"
                data-testid="nav-store-link"
              >
                <Image
                  src="/lacasaLogo.png"
                  alt="Logo"
                  width={150}
                  height={150}
                />
              </LocalizedClientLink>

            </div>

            <div className="hidden md:flex items-center h-full gap-x-6">
              <div>
                <LocalizedClientLink href="/store" className="text-lg text-[#043364] hover:font-semibold ">
                  Shop
                </LocalizedClientLink>
              </div>
              <div>
                <LocalizedClientLink href="/about" className="text-lg text-[#043364] hover:font-semibold">
                  About Us
                </LocalizedClientLink>
              </div>
            </div>


            <div className="flex items-center gap-x-6 h-full flex-1 basis-0 justify-end">
              <div className="hidden small:flex items-center gap-x-6 h-full">
                <LocalizedClientLink
                  className="hover:text-ui-fg-base"
                  href="/account"
                  data-testid="nav-account-link"
                >
                  {/* user icon */}
                  <User className="w-6 h-6 text-[#043364]" />
                </LocalizedClientLink>
              </div>
              <Suspense
                fallback={
                  <LocalizedClientLink
                    className="hover:text-ui-fg-base flex gap-2"
                    href="/cart"
                    data-testid="nav-cart-link"
                  >

                    <span className="w-6 h-6">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="9" cy="21" r="1"></circle>
                      <circle cx="20" cy="21" r="1"></circle>
                      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                    </svg>
                  </span>
                    {/* Cart(0) */}
                  </LocalizedClientLink>
                }
              >
                <CartButton />
              </Suspense>
            </div>
          </nav>
        </header>
      </div>  </>
  )
}
