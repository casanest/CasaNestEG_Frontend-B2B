import { retrieveCart } from "@lib/data/cart"
import { retrieveCustomer } from "@lib/data/customer"
import { listCartShippingMethods } from "@lib/data/fulfillment"
import { ensureShippingMethod } from "@lib/util/shipping"
import PaymentWrapper from "@modules/checkout/components/payment-wrapper"
import CheckoutForm from "@modules/checkout/templates/checkout-form"
import CheckoutSummary from "@modules/checkout/templates/checkout-summary"
import { Metadata } from "next"
import { notFound } from "next/navigation"
import { getLocale } from "next-intl/server"

export const metadata: Metadata = {
  title: "Checkout",
}

export default async function Checkout() {
  const locale = await getLocale()
  const cart = await retrieveCart()

  if (!cart) {
    return notFound()
  }

  // Automatically set "Standard Shipping -€0.10" as default shipping method
  try {
    console.log(`[Checkout Page] Setting "Standard Shipping -€0.10" as default for cart: ${cart.id}`)
    
    // Get available shipping methods to find the standard shipping option
    const availableShippingMethods = await listCartShippingMethods(cart.id)
    
    if (availableShippingMethods && availableShippingMethods.length > 0) {
      // Find the "Standard Shipping" method
      const standardShipping = availableShippingMethods.find((method: any) => 
        method.name?.toLowerCase().includes('standard') || 
        method.name?.toLowerCase().includes('regular') ||
        method.name?.toLowerCase().includes('normal')
      )
      
      if (standardShipping) {
        // Set the standard shipping method automatically
        const { setDefaultShippingMethod } = await import("@lib/util/shipping")
        const shippingMethodSet = await setDefaultShippingMethod(cart.id)
        if (shippingMethodSet) {
          console.log(`[Checkout Page] Successfully set "Standard Shipping" as default for cart: ${cart.id}`)
        } else {
          console.warn(`[Checkout Page] Could not set standard shipping method for cart: ${cart.id}`)
        }
      } else {
        console.warn(`[Checkout Page] No standard shipping method found, using fallback`)
        // Use fallback shipping method setting
        const { ensureShippingMethod } = await import("@lib/util/shipping")
        await ensureShippingMethod(cart.id, cart)
      }
    } else {
      console.warn(`[Checkout Page] No shipping methods available for cart: ${cart.id}`)
    }
  } catch (shippingError: any) {
    console.warn(`[Checkout Page] Shipping method setup failed: ${shippingError.message}`)
    // Continue anyway, as the user can still proceed with checkout
  }

  const customer = await retrieveCustomer()

  return (
    <div dir={locale === "ar" ? "rtl" : "ltr"} className="grid grid-cols-1 small:grid-cols-[1fr_416px] content-container gap-x-40 py-12">
      <PaymentWrapper cart={cart}>
        <CheckoutForm cart={cart} customer={customer} />
      </PaymentWrapper>
      <CheckoutSummary cart={cart} />
    </div>
  )
}
