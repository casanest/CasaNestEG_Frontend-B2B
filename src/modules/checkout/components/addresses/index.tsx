"use client"

import { setAddresses } from "@lib/data/cart"
import compareAddresses from "@lib/util/compare-addresses"
import { CheckCircleSolid } from "@medusajs/icons"
import { HttpTypes } from "@medusajs/types"
import { clx, Heading, Text, useToggleState } from "@medusajs/ui"
import Divider from "@modules/common/components/divider"
import Spinner from "@modules/common/icons/spinner"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useActionState } from "react"
import BillingAddress from "../billing_address"
import ErrorMessage from "../error-message"
import ShippingAddress from "../shipping-address"
import { SubmitButton } from "../submit-button"
import { useLocale } from "next-intl"

const Addresses = ({
  cart,
  customer,
}: {
  cart: HttpTypes.StoreCart | null
  customer: HttpTypes.StoreCustomer | null
}) => {
  const locale = useLocale()
  const isRTL = locale === "ar"
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const isOpen = searchParams.get("step") === "address"

  const { state: sameAsBilling, toggle: toggleSameAsBilling } = useToggleState(
    cart?.shipping_address && cart?.billing_address
      ? compareAddresses(cart?.shipping_address, cart?.billing_address)
      : true
  )

  const handleEdit = () => {
    router.push(pathname + "?step=address")
  }

  const [message, formAction] = useActionState(setAddresses, null)

  return (
    <div dir={isRTL ? "rtl" : "ltr"} className="bg-white">
      <div className="text-[#043364] flex flex-row items-center justify-between mb-6">
        <Heading
          level="h2"
          className="flex flex-row text-3xl-regular gap-x-2 items-baseline"
        >
          {isRTL ? "عنوان الشحن" : "Shipping address"}
          {!isOpen && <CheckCircleSolid />}
        </Heading>
        {!isOpen && cart?.shipping_address && (
          <Text>
            <button
              onClick={handleEdit}
              className="text-ui-fg-interactive hover:text-ui-fg-interactive-hover"
              data-testid="edit-address-button"
            >
              {isRTL ? "تعديل" : "Edit"}
            </button>
          </Text>
        )}
      </div>
      {isOpen ? (
        <form action={formAction}>
          <div className="pb-8">
            <ShippingAddress
              customer={customer}
              checked={sameAsBilling}
              onChange={toggleSameAsBilling}
              cart={cart}
            />

            {!sameAsBilling && (
              <div>
                <Heading
                  level="h2"
                  className="text-3xl-regular gap-x-4 pb-6 pt-8"
                >
                  {isRTL ? "عنوان الفوترة" : "Billing address"}
                </Heading>

                <BillingAddress cart={cart} />
              </div>
            )}
            <SubmitButton className="mt-6 bg-[#043364] hover:bg-blue-900 text-white" data-testid="submit-address-button ">
              {isRTL ? "متابعة للدفع" : "Continue to Payment"}
            </SubmitButton>
            <ErrorMessage error={message} data-testid="address-error-message" />
          </div>
        </form>
      ) : (
          <div dir={isRTL ? "rtl" : "ltr"} className="text-small-regular">
            {cart && cart.shipping_address ? (
              <div className={clx("flex flex-col gap-y-4 md:gap-y-8", {
                "text-right": isRTL,
                "text-left": !isRTL
              })}>
                <div className={clx("flex flex-col md:flex-row gap-x-8 gap-y-4", {
                  // "md:flex-row-reverse": isRTL
                })}>
                  {/* Shipping Address */}
                  <div
                    className={clx("flex-1 min-w-0", {
                      // "md:border-l md:pl-8": !isRTL,
                      // "md:border-r md:pr-8": isRTL
                    })}
                    data-testid="shipping-address-summary"
                  >
                    <Text className="txt-medium-plus text-ui-fg-base mb-1">
                      {isRTL ? "عنوان الشحن" : "Shipping Address"}
                    </Text>
                    <div className="flex flex-col gap-y-1">
                      <Text className="txt-medium text-ui-fg-subtle">
                        {cart.shipping_address.first_name} {cart.shipping_address.last_name}
                      </Text>
                      <Text className="txt-medium text-ui-fg-subtle">
                        {cart.shipping_address.address_1}{" "}
                        {cart.shipping_address.address_2}
                      </Text>
                      <Text className="txt-medium text-ui-fg-subtle">
                        {cart.shipping_address.postal_code},{" "}
                        {cart.shipping_address.city}
                      </Text>
                      <Text className="txt-medium text-ui-fg-subtle">
                        {cart.shipping_address.country_code?.toUpperCase()}
                      </Text>
                    </div>
                  </div>

                  {/* Contact Info */}
                  <div
                    className={clx("flex-1 min-w-0", {
                      "md:border-l md:pl-8": !isRTL,
                      "md:border-r md:pr-8": isRTL
                    })}
                    data-testid="shipping-contact-summary"
                  >
                    <Text className="txt-medium-plus text-ui-fg-base mb-1">
                      {isRTL ? "اتصال" : "Contact"}
                    </Text>
                    <div className="flex flex-col gap-y-1">
                      <Text className="txt-medium text-ui-fg-subtle">
                        {cart.shipping_address.phone}
                      </Text>
                      <Text className="txt-medium text-ui-fg-subtle">
                        {cart.email}
                      </Text>
                    </div>
                  </div>

                  {/* Billing Address */}
                  <div
                    className={clx("flex-1 min-w-0", {
                      "md:border-l md:pl-8": !isRTL,
                      "md:border-r md:pr-8": isRTL
                    })}
                    data-testid="billing-address-summary"
                  >
                    <Text className="txt-medium-plus text-ui-fg-base mb-1">
                      {isRTL ? "عنوان الفوترة" : "Billing Address"}
                    </Text>
                    <div className="flex flex-col gap-y-1">
                      {sameAsBilling ? (
                        <Text className="txt-medium text-ui-fg-subtle">
                          {isRTL ? "عنوان الفوترة وعنوان الشحن هو نفسه" : "Billing- and delivery address are the same."}
                        </Text>
                      ) : (
                        <>
                          <Text className="txt-medium text-ui-fg-subtle">
                            {cart.billing_address?.first_name}{" "}
                            {cart.billing_address?.last_name}
                          </Text>
                          <Text className="txt-medium text-ui-fg-subtle">
                            {cart.billing_address?.address_1}{" "}
                            {cart.billing_address?.address_2}
                          </Text>
                          <Text className="txt-medium text-ui-fg-subtle">
                            {cart.billing_address?.postal_code},{" "}
                            {cart.billing_address?.city}
                          </Text>
                          <Text className="txt-medium text-ui-fg-subtle">
                            {cart.billing_address?.country_code?.toUpperCase()}
                          </Text>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex justify-center py-8">
                <Spinner />
              </div>
            )}
          </div>
      )}
      <Divider className="mt-8" />
    </div>
  )
}

export default Addresses
