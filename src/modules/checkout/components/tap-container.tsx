"use client"

import type React from "react"
import { RadioGroup } from "@headlessui/react"
import { Text, clx } from "@medusajs/ui"
import { useState, useEffect, useRef, useCallback } from "react"
import { CreditCard, Shield, Lock, CheckCircle, AlertCircle, ExternalLink } from "lucide-react"

interface TapContainerProps {
  paymentProviderId: string
  selectedPaymentOptionId: string
  paymentInfoMap: any
  setError: (error: string | null) => void
  setPaymentComplete: (complete: boolean) => void
  cart: any
  locale: string
}

type PaymentStatus =
  | "idle"
  | "initializing"
  | "redirecting"
  | "processing"
  | "success"
  | "failed"

export const TapContainer = ({
  paymentProviderId,
  selectedPaymentOptionId,
  paymentInfoMap,
  setError,
  setPaymentComplete,
  cart,
  locale,
}: TapContainerProps) => {
  // State Management
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>("idle")
  const [paymentUrl, setPaymentUrl] = useState<string>("")
  const [chargeId, setChargeId] = useState<string>("")
  const [isProcessing, setIsProcessing] = useState(false)

  // Refs for cleanup
  const isComponentMounted = useRef(true)

  // Computed values
  const isSelected = selectedPaymentOptionId === paymentProviderId
  const isRTL = locale === "ar"

  // Enhanced payment initialization
  const initializePayment = useCallback(
    async () => {
      if (!isComponentMounted.current || isProcessing) return

      try {
        setIsProcessing(true)
        setPaymentStatus("initializing")
        setError(null)

        // Validate cart data
        if (!cart?.id) {
          throw new Error("Cart ID is missing")
        }

        if (!cart?.total || cart.total <= 0) {
          throw new Error("Invalid cart total")
        }

        const paymentData = {
          cart_id: cart.id,
          amount: cart.total,
          currency: cart.region?.currency_code || "USD",
          customer_email: cart.email || "customer@example.com",
          billing_address: {
            first_name: cart.billing_address?.first_name || "Customer",
            last_name: cart.billing_address?.last_name || "Name",
            phone: cart.billing_address?.phone || "+1234567890",
            country_code: cart.billing_address?.country_code?.toUpperCase() || "US",
          },
        }

        const response = await fetch("/api/store/tap/initiate", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(paymentData),
        })

        const responseText = await response.text()
        
        // Handle empty responses
        if (!responseText) {
          throw new Error("Empty response from payment provider")
        }

        let data
        try {
          data = JSON.parse(responseText)
        } catch (parseError) {
          console.error("Failed to parse payment response:", responseText)
          throw new Error("Invalid response format from payment provider")
        }

        if (!response.ok) {
          throw new Error(data.error || data.message || `Request failed with status ${response.status}`)
        }

        if (data.success && data.payment_url && data.charge_id) {
          setPaymentUrl(data.payment_url)
          setChargeId(data.charge_id)
          setPaymentStatus("redirecting")
          
          // Redirect to Tap payment page in same window
          window.location.href = data.payment_url
        } else {
          throw new Error(data.error || "Failed to initialize payment")
        }
      } catch (error: any) {
        setError(error.message || (locale === "ar" ? "فشل في بدء الدفع" : "Payment initialization failed"))
        setPaymentStatus("failed")
      } finally {
        setIsProcessing(false)
      }
    },
    [cart, locale, setError, isProcessing],
  )

  // Poll payment status (simplified version)
  const pollPaymentStatus = useCallback(
    async (charge_id: string) => {
      let attempts = 0
      const maxAttempts = 30 // Poll for 5 minutes (30 * 10 seconds)

      const poll = async () => {
        if (!isComponentMounted.current || attempts >= maxAttempts) {
          if (attempts >= maxAttempts) {
            setError(locale === "ar" ? "انتهت مهلة معالجة الدفع" : "Payment processing timeout")
            setPaymentStatus("failed")
          }
          return
        }

        try {
          // In a real implementation, you would poll your backend for the payment status
          // For now, we'll simulate the polling
          setPaymentStatus("processing")
          
          // TODO: Replace with actual status check
          // const statusResponse = await fetch(`/api/store/tap/status/${charge_id}`)
          // const statusData = await statusResponse.json()
          
          attempts++
          setTimeout(poll, 10000) // Poll every 10 seconds
        } catch (error) {
          console.error("Error polling payment status:", error)
          setTimeout(poll, 10000)
        }
      }

      poll()
    },
    [locale, setError],
  )

  // Handle payment completion (would be called from webhook or status check)
  const handlePaymentSuccess = useCallback(() => {
    if (!isComponentMounted.current) return
    
    setPaymentStatus("success")
    setPaymentComplete(true)
    setError(null)
  }, [setPaymentComplete, setError])

  // Cleanup on unmount or when not selected
  useEffect(() => {
    if (!isSelected && isComponentMounted.current) {
      setPaymentStatus("idle")
      setPaymentUrl("")
      setChargeId("")
      setError(null)
    }
  }, [isSelected, setError])

  // Component unmount cleanup
  useEffect(() => {
    return () => {
      isComponentMounted.current = false
    }
  }, [])

  // Status and UI helpers
  const getStatusIcon = () => {
    switch (paymentStatus) {
      case "success":
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case "failed":
        return <AlertCircle className="w-5 h-5 text-red-500" />
      case "initializing":
      case "redirecting":
      case "processing":
        return <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      default:
        return <Shield className="w-5 h-5 text-blue-500" />
    }
  }

  const getStatusMessage = () => {
    switch (paymentStatus) {
      case "initializing":
        return locale === "ar" ? "جاري التهيئة..." : "Initializing..."
      case "redirecting":
        return locale === "ar" ? "جاري التوجيه إلى صفحة الدفع..." : "Redirecting to payment page..."
      case "processing":
        return locale === "ar" ? "جاري معالجة الدفع..." : "Processing payment..."
      case "success":
        return locale === "ar" ? "تم الدفع بنجاح!" : "Payment successful!"
      case "failed":
        return locale === "ar" ? "فشل في الدفع" : "Payment failed"
      default:
        return locale === "ar" ? "آمن ومحمي" : "Secure & Protected"
    }
  }

  // Render component
  return (
    <div
      className={clx("flex flex-col gap-y-4 border-b border-gray-200 last:border-b-0", {
        "pb-8": isSelected,
        "pb-4": !isSelected,
      })}
    >
      <RadioGroup.Option
        value={paymentProviderId}
        className={clx(
          "flex items-center justify-between w-full p-4 border border-gray-200 rounded-lg cursor-pointer transition-all",
          {
            "border-[#043364] bg-blue-50": isSelected,
            "hover:border-gray-300": !isSelected,
          },
        )}
      >
        <div className="flex items-center gap-x-4">
          <RadioGroup.Label className="flex items-center gap-x-3 cursor-pointer">
            <div
              className={clx("w-4 h-4 rounded-full border-2 flex items-center justify-center", {
                "border-[#043364]": isSelected,
                "border-gray-300": !isSelected,
              })}
            >
              {isSelected && <div className="w-2 h-2 rounded-full bg-[#043364]" />}
            </div>
            <div className="flex items-center gap-x-2">
              {paymentInfoMap[paymentProviderId]?.icon}
              <Text className="text-base-regular">{paymentInfoMap[paymentProviderId]?.title || "Tap Payments"}</Text>
            </div>
          </RadioGroup.Label>
        </div>
        <div className="flex items-center gap-2">
          {getStatusIcon()}
          <Text className="text-sm text-gray-600">{getStatusMessage()}</Text>
        </div>
      </RadioGroup.Option>

      {isSelected && (
        <div className="px-4 pb-4">
          <div className="space-y-6">
            <div className="flex items-center gap-2 mb-4">
              <Lock className="w-4 h-4 text-green-600" />
              <Text className="text-sm text-green-700">
                {locale === "ar" ? "محمي بتشفير SSL وPCI DSS" : "Protected by SSL encryption & PCI DSS"}
              </Text>
            </div>

            <div className="border rounded-lg p-4 bg-blue-50 border-blue-200">
              <div className="flex items-start gap-3">
                <CreditCard className="w-5 h-5 text-blue-600 mt-1" />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Text className="font-medium text-blue-900">
                      {locale === "ar" ? "دفع آمن بواسطة Tap" : "Secure Payment by Tap"}
                    </Text>
                  </div>
                  <Text className="text-sm text-blue-800 mb-3">
                    {locale === "ar" 
                      ? "ادفع بأمان باستخدام بطاقتك الائتمانية أو بطاقة الخصم" 
                      : "Pay securely with your credit or debit card"}
                  </Text>
                  <div className="space-y-1 mb-3">
                    <Text className="text-xs text-blue-700 flex items-center gap-1">
                      <span className="w-1 h-1 bg-green-500 rounded-full"></span>
                      {locale === "ar" ? "حماية ثلاثية الأبعاد" : "3D Secure protection"}
                    </Text>
                    <Text className="text-xs text-blue-700 flex items-center gap-1">
                      <span className="w-1 h-1 bg-green-500 rounded-full"></span>
                      {locale === "ar" ? "تشفير SSL" : "SSL encryption"}
                    </Text>
                    <Text className="text-xs text-blue-700 flex items-center gap-1">
                      <span className="w-1 h-1 bg-green-500 rounded-full"></span>
                      {locale === "ar" ? "جميع البطاقات مقبولة" : "All major cards accepted"}
                    </Text>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-green-600">
                    <Shield className="w-3 h-3" />
                    {locale === "ar" ? "بياناتك محمية بأعلى معايير الأمان" : "Your data is protected with highest security standards"}
                  </div>
                </div>
              </div>
            </div>

            {paymentStatus === "idle" && (
              <button
                onClick={initializePayment}
                disabled={isProcessing}
                className="w-full bg-[#043364] text-white py-3 px-4 rounded-md hover:bg-blue-900 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-colors"
              >
                {isProcessing && (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                )}
                <CreditCard className="w-4 h-4" />
                {isProcessing
                  ? locale === "ar"
                    ? "جاري التحضير..."
                    : "Preparing..."
                  : locale === "ar"
                    ? "الدفع بواسطة Tap"
                    : "Pay with Tap"}
              </button>
            )}

            {paymentStatus === "redirecting" && (
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <ExternalLink className="w-4 h-4 text-yellow-600" />
                  <Text className="text-sm text-yellow-800 font-medium">
                    {locale === "ar" ? "تم فتح صفحة الدفع" : "Payment page opened"}
                  </Text>
                </div>
                <Text className="text-xs text-yellow-700 mb-3">
                  {locale === "ar" 
                    ? "يرجى إكمال عملية الدفع في النافذة الجديدة" 
                    : "Please complete your payment in the new window"}
                </Text>
                {paymentUrl && (
                  <button
                    onClick={() => window.open(paymentUrl, "_blank")}
                    className="text-xs text-blue-600 hover:text-blue-800 underline flex items-center gap-1"
                  >
                    <ExternalLink className="w-3 h-3" />
                    {locale === "ar" ? "إعادة فتح صفحة الدفع" : "Reopen payment page"}
                  </button>
                )}
              </div>
            )}

            {paymentStatus === "processing" && (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                  <Text className="text-sm text-blue-800 font-medium">
                    {locale === "ar" ? "جاري معالجة الدفع" : "Processing Payment"}
                  </Text>
                </div>
                <Text className="text-xs text-blue-700">
                  {locale === "ar" 
                    ? "يرجى الانتظار، سنقوم بتأكيد عملية الدفع قريباً" 
                    : "Please wait, we'll confirm your payment shortly"}
                </Text>
              </div>
            )}

            {paymentStatus === "success" && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <Text className="text-sm text-green-800 font-medium">
                    {locale === "ar" ? "تم الدفع بنجاح!" : "Payment Successful!"}
                  </Text>
                </div>
                <Text className="text-xs text-green-700">
                  {locale === "ar" 
                    ? "تم تأكيد عملية الدفع بنجاح" 
                    : "Your payment has been confirmed"}
                </Text>
                {chargeId && (
                  <Text className="text-xs text-green-600 mt-1">
                    {locale === "ar" ? "رقم المعاملة:" : "Transaction ID:"} {chargeId}
                  </Text>
                )}
              </div>
            )}

            <div className="flex items-start gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
              <Shield className="w-4 h-4 text-green-600 mt-0.5" />
              <div>
                <Text className="text-sm text-green-800 font-medium">
                  {locale === "ar" ? "دفع آمن" : "Secure Payment"}
                </Text>
                <Text className="text-xs text-green-700">
                  {locale === "ar"
                    ? "بياناتك محمية بتشفير SSL ومعايير PCI DSS. لن نحتفظ ببيانات بطاقتك."
                    : "Your data is protected by SSL encryption and PCI DSS standards. We don't store your card details."}
                </Text>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 