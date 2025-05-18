import { Suspense } from "react"

import { listRegions } from "@lib/data/regions"
import { StoreRegion } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import CartButton from "@modules/layout/components/cart-button"
import SideMenu from "@modules/layout/components/side-menu"
import TopNav from "@modules/layout/components/top-nav"
import Image from "next/image"
import { User } from "lucide-react"
import MegaMenu from "@modules/layout/components/mega-menu"
import NavContent from "./nav-content"
import { Container } from "@modules/common/components/container"
import { listCategories } from "@lib/data/categories"
import { listCollections } from "@lib/data/collections"
import { createNavigation } from "@lib/constants"
import { listProducts } from "@lib/data/products"
export default async function Nav() {
  const regions = await listRegions().then((regions: StoreRegion[]) => regions)
  const productCategories = await listCategories()
  const products = await listProducts({
    queryParams: {
      limit: 4,
      offset: 0,
      region_id: regions[0]?.id,
      // is_giftcard: false,
    },
    // countryCode: regions[0]?.countries[0]?.iso_2,
    regionId: regions[0]?.id,
  })
  const { products: recommendedProducts } = products.response
  console.log("recommendedProducts", recommendedProducts)
  const { collections } = await listCollections()
  console.log("collections", collections)
  const navigation = createNavigation(productCategories, collections)

  return (
    <>
      <TopNav />
      <div className=" sticky w-full top-0 inset-x-0 z-[40] group">
        <header className="relative h-16 mx-auto border-b duration-200 bg-white border-ui-border-base">
          <nav className="content-container txt-xsmall-plus text-ui-fg-subtle flex items-center justify-between w-full h-full text-small-regular">            <div className="flex-1 basis-0 h-full flex items-center md:hidden">
            <div className="flex items-center ">
              <SideMenu productCategories={productCategories} collections={collections} />
            </div>
            <div className="flex items-center  md:hidden">
              <LocalizedClientLink
                href="/"
                className="text-4xl font-extrabold tracking-widest uppercase text-transparent bg-clip-text hover:from-blue-600 hover:to-blue-800 transition-all duration-300 ease-in-out leading-none"
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
            <div className=" flex-1 basis-0 h-full flex items-center">
            </div>

            <div className="flex items-center gap-x-6 h-full flex-1 basis-0 justify-end">
              <div className="flex items-center h-full">
                <NavContent products={recommendedProducts} />
              </div>
              <div className="flex items-center gap-x-6 h-full">
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
        <div className="hidden sticky md:block w-full bg-ui-bg-subtle border-b border-ui-border-base">
          <MegaMenu navigation={navigation} />
        </div>
      </div>
    </>
  )
}
