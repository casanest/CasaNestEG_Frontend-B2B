"use client"

import { useState, useCallback, useEffect } from "react"
import { useSearchParams, useRouter, usePathname, useParams } from "next/navigation"
import { useLocale } from "next-intl"
import { Button, clx, Heading, Text } from "@medusajs/ui"
import { CheckCircleSolid, CreditCard } from "@medusajs/icons"
import { RadioGroup } from "@headlessui/react"
import { TapContainer } from "../tap-container"
import SystemDefaultContainer from "../payment-container/system-default-container"
import { paymentInfoMap, isSystemDefault } from "@lib/constants"

const Payment = ({
  cart,
  availablePaymentMethods,
}: {
  cart: any
  availablePaymentMethods: any[]
}) => {
  const locale = useLocale()
  const isRTL = locale === "ar"
  const params = useParams()
  const countryCode = (params?.countryCode as string) || cart?.shipping_address?.country_code || "us"
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [paymentComplete, setPaymentComplete] = useState(false)
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>("tap")

  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const isOpen = searchParams.get("step") === "payment"

  // Get available payment methods
  const tapPaymentMethod = availablePaymentMethods.find(method => method.id === "tap")
  const systemDefaultMethod = availablePaymentMethods.find(method => method.id === "pp_system_default")

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams)
      params.set(name, value)
      return params.toString()
    },
    [searchParams]
  )

  const handleEdit = () => {
    router.push(pathname + "?" + createQueryString("step", "payment"), {
      scroll: false,
    })
  }

  const handlePaymentComplete = () => {
    setPaymentComplete(true)
    // Redirect to success page after successful payment
    router.push(`/${locale}/${countryCode}/checkout/payment-success?cart_id=${cart.id}&tap_id=success`)
  }

  const handleSystemDefaultPayment = async () => {
    // Prevent multiple simultaneous payment attempts
    if (isLoading) {
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      // Validate cart data before proceeding
      if (!cart?.id) {
        throw new Error("Cart ID is missing")
      }

      if (!cart?.email) {
        throw new Error("Email is required for order completion")
      }

      if (!cart?.shipping_address) {
        throw new Error("Shipping address is required for order completion")
      }

      if (!cart?.items || cart.items.length === 0) {
        throw new Error("Cart is empty")
      }

      // First, initiate a payment session for the system default provider
      const { initiatePaymentSession } = await import("@lib/data/cart")

      // Initiate payment session with system default provider
      await initiatePaymentSession(cart, {
        provider_id: "pp_system_default"
      })

      // Then place the order using Medusa's standard flow
      const { placeOrder } = await import("@lib/data/cart")
      await placeOrder(cart.id)

      // If we reach here, the order was successful and user was redirected
      // The placeOrder function handles the redirect to the success page
    } catch (err: any) {
      console.error("Failed to place order:", err)
      setError(err.message || "Failed to complete order. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handlePaymentFailure = (errorMessage: string) => {
    setError(errorMessage)
    // Redirect to failure page after failed payment
    router.push(`/${locale}/${countryCode}/checkout/payment-failure?cart_id=${cart.id}&tap_id=failed&reason=${encodeURIComponent(errorMessage)}`)
  }

  useEffect(() => {
    setError(null)
  }, [isOpen])

  if (isOpen) {
    return (
      <div className="w-full">
        <Heading
          level="h2"
          className={clx(
            "flex flex-row text-3xl-regular gap-x-2 items-baseline mb-8",
            {
              "opacity-50 pointer-events-none select-none":
                !isOpen && (cart.payment_sessions?.length === 0 || !cart.payment_sessions),
            }
          )}
        >
          {locale === "en" ? "Payment" : "الدفع"}
          {!isOpen && (cart.payment_sessions?.length ?? 0) > 0 && (
            <CheckCircleSolid />
          )}
        </Heading>
        <div className="mb-8">
          <Heading level="h2" className="txt-compact-large text-ui-fg-base">
            {locale === "ar" ? "طريقة الدفع" : "Payment Method"}
          </Heading>
          <Text className="txt-compact-medium text-ui-fg-subtle">
            {locale === "ar" ? "اختر طريقة الدفع الآمنة" : "Choose your secure payment method"}
          </Text>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <Text className="txt-compact-small text-red-600">
              {error}
            </Text>
          </div>
        )}

        <div className="space-y-4">
          <RadioGroup value={selectedPaymentMethod} onChange={setSelectedPaymentMethod}>
            {tapPaymentMethod && (
              <SystemDefaultContainer
                paymentProviderId="tap"
                selectedPaymentOptionId={selectedPaymentMethod}
                paymentInfoMap={paymentInfoMap}
              />
            )}

            {systemDefaultMethod && (
              <SystemDefaultContainer
                paymentProviderId="pp_system_default"
                selectedPaymentOptionId={selectedPaymentMethod}
                paymentInfoMap={paymentInfoMap}
              />
            )}
          </RadioGroup>

          {/* Payment Processing Area */}
          <div className="bg-ui-bg-base p-6 rounded-lg border">
            {selectedPaymentMethod === "tap" && tapPaymentMethod && (
              <TapContainer
                cart={cart}
                onPaymentComplete={handlePaymentComplete}
                onPaymentFailure={handlePaymentFailure}
                onError={setError}
              />
            )}

            {selectedPaymentMethod === "pp_system_default" && systemDefaultMethod && (
              <div className="text-center">
                <Button
                  size="large"
                  onClick={handleSystemDefaultPayment}
                  isLoading={isLoading}
                  className="w-full"
                >
                  {locale === "ar" ? "إتمام الطلب" : "Complete Order"}
                </Button>
                <Text className="txt-compact-small text-ui-fg-subtle mt-2">
                  {locale === "ar"
                    ? "سيتم إرسال تعليمات التسليم إلى بريدك الإلكتروني"
                    : "Delivery instructions will be sent to your email"
                  }
                </Text>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  // Display mode (not editing)
  return (
    <div className="w-full">
      <div className="flex items-center justify-between">
        <div>
          <Heading level="h3" className="txt-compact-large text-ui-fg-base">
            {locale === "ar" ? "طريقة الدفع" : "Payment Method"}
          </Heading>
          <Text className="txt-compact-medium text-ui-fg-subtle">
            {selectedPaymentMethod === "tap"
              ? tapPaymentMethod?.title || "Tap Payments"
              : systemDefaultMethod?.title || "Pay on Delivery"
            }
          </Text>
        </div>
        <Button
          variant="transparent"
          size="small"
          onClick={handleEdit}
          className="text-ui-fg-interactive"
        >
          {locale === "ar" ? "تعديل" : "Edit"}
        </Button>
      </div>
    </div>
  )
}

export default Payment
