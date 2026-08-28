import { Metadata } from "next"
import { setRequestLocale } from "next-intl/server"

import { listCartOptions, retrieveCart } from "@lib/data/cart"
import { retrieveCustomer } from "@lib/data/customer"
import { getBaseURL } from "@lib/util/env"
import { StoreCartShippingOption } from "@medusajs/types"
import CartMismatchBanner from "@modules/layout/components/cart-mismatch-banner"
import Nav from "@modules/layout/templates/nav"
import FreeShippingPriceNudge from "@modules/shipping/components/free-shipping-price-nudge"
import FooterServer from "@modules/layout/templates/footer/FooterServer"
import CtaSection from "@modules/layout/components/cta-section"

export const metadata: Metadata = {
  metadataBase: new URL(getBaseURL()),
}

export default async function PageLayout(
  props: {
    children: React.ReactNode
    params: Promise<{ locale: string; countryCode: string }>
  }
) {
  const { locale } = await props.params
  setRequestLocale(locale)

  const customer = await retrieveCustomer()
  const cart = await retrieveCart()
  let shippingOptions: StoreCartShippingOption[] = []

  if (cart) {
    const { shipping_options } = await listCartOptions()

    shippingOptions = shipping_options
  }

  return (
    <>
      <Nav />
      {/* {customer && cart && (
        <CartMismatchBanner customer={customer} cart={cart} />
      )}

      {cart && (
        <FreeShippingPriceNudge
          variant="popup"
          cart={cart}
          shippingOptions={shippingOptions}
        />
      )} */}
      {props.children}
      <CtaSection locale={locale} />
      <FooterServer locale={locale} />
    </>
  )
}
