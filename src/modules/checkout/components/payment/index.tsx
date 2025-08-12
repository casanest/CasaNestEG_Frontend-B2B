"use client"

import { useState, useCallback, useEffect } from "react"
import { useSearchParams, useRouter, usePathname } from "next/navigation"
import { useLocale } from "next-intl"
import { Button, Heading, Text } from "@medusajs/ui"
import { CheckCircleSolid, CreditCard } from "@medusajs/icons"
import { TapContainer } from "../tap-container"

const Payment = ({
  cart,
  availablePaymentMethods,
}: {
  cart: any
  availablePaymentMethods: any[]
}) => {
  const locale = useLocale()
  const isRTL = locale === "ar"
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [paymentComplete, setPaymentComplete] = useState(false)

  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const isOpen = searchParams.get("step") === "payment"

  // Only show Tap payment method
  const tapPaymentMethod = availablePaymentMethods.find(method => method.id === "tap")

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
    const countryCode = cart?.shipping_address?.country_code || "us"
    router.push(`/${countryCode}/checkout/payment-success?cart_id=${cart.id}&tap_id=success`)
        }

  const handlePaymentFailure = (errorMessage: string) => {
    setError(errorMessage)
    // Redirect to failure page after failed payment
    const countryCode = cart?.shipping_address?.country_code || "us"
    router.push(`/${countryCode}/checkout/payment-failure?cart_id=${cart.id}&tap_id=failed&reason=${encodeURIComponent(errorMessage)}`)
  }

  useEffect(() => {
    setError(null)
  }, [isOpen])

  if (isOpen) {
  return (
      <div className="w-full">
        <div className="mb-8">
          <Heading level="h2" className="txt-compact-large text-ui-fg-base">
            {locale === "ar" ? "طريقة الدفع" : "Payment Method"}
        </Heading>
          <Text className="txt-compact-medium text-ui-fg-subtle">
            {locale === "ar" ? "اختر طريقة الدفع الآمنة" : "Choose your secure payment method"}
          </Text>
        </div>

        {tapPaymentMethod && (
          <div className="bg-ui-bg-base p-6 rounded-lg border mb-6">
            <div className="flex items-center gap-3 mb-4">
              <CreditCard className="w-6 h-6 text-blue-600" />
              <div>
                <Text className="txt-compact-medium text-ui-fg-base font-medium">
                  {tapPaymentMethod.title}
                </Text>
                <Text className="txt-compact-small text-ui-fg-subtle">
                  {tapPaymentMethod.description}
                </Text>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              {tapPaymentMethod.features?.slice(0, 4).map((feature: string, index: number) => (
                <div key={index} className="flex items-center gap-2">
                  <CheckCircleSolid className="w-4 h-4 text-green-600" />
                  <Text className="txt-compact-small text-ui-fg-subtle">
                    {feature}
                  </Text>
                </div>
              ))}
            </div>

            <div className="bg-blue-50 p-3 rounded-lg">
              <Text className="txt-compact-small text-blue-700">
                <strong>{locale === "ar" ? "معلومات مهمة:" : "Important:"}</strong>{" "}
                {locale === "ar" 
                  ? "سيتم توجيهك إلى صفحة دفع آمنة من Tap لاستكمال عملية الدفع"
                  : "You will be redirected to a secure Tap payment page to complete your payment"
                }
              </Text>
            </div>
          </div>
        )}

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <Text className="txt-compact-small text-red-600">
              {error}
            </Text>
          </div>
        )}

        <div className="bg-ui-bg-base p-6 rounded-lg border">
          <TapContainer 
            cart={cart} 
            onPaymentComplete={handlePaymentComplete}
            onPaymentFailure={handlePaymentFailure}
            onError={setError}
          />
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
            {tapPaymentMethod?.title || "Tap Payments"}
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
