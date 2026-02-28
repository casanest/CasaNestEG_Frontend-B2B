"use client"

import type React from "react"
import { Text, Button } from "@medusajs/ui"
import { useState, useEffect, useRef, useCallback } from "react"
import { CreditCard, Shield, Lock, CheckCircle, AlertCircle, ExternalLink, Loader2 } from "lucide-react"
import { useLocale } from "next-intl"
import { useRouter, useParams } from "next/navigation"

interface TapContainerProps {
  cart: any
  onPaymentComplete: () => void
  onPaymentFailure: (errorMessage: string) => void
  onError: (error: string | null) => void
}

type PaymentStatus =
  | "idle"
  | "initializing"
  | "redirecting"
  | "processing"
  | "success"
  | "failed"

export const TapContainer = ({
  cart,
  onPaymentComplete,
  onPaymentFailure,
  onError,
}: TapContainerProps) => {
  const locale = useLocale()
  const router = useRouter()
  const params = useParams()
  const countryCode = params?.countryCode as string
  
  // State Management
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>("idle")
  const [paymentUrl, setPaymentUrl] = useState<string>("")
  const [chargeId, setChargeId] = useState<string>("")
  const [isProcessing, setIsProcessing] = useState(false)

  // Refs for cleanup
  const isComponentMounted = useRef(true)

  // Enhanced payment initialization
  const initializePayment = useCallback(
    async () => {
      if (!isComponentMounted.current || isProcessing) return

      try {
        setIsProcessing(true)
        setPaymentStatus("initializing")
        onError(null)

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
          locale: locale,
          countryCode: countryCode,
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

        if (data.success && data.payment_url) {
          setPaymentUrl(data.payment_url)
          setChargeId(data.charge_id || "")
          setPaymentStatus("redirecting")
          
          // Store payment data for return handling
          localStorage.setItem(`tap_payment_${cart.id}`, JSON.stringify({
            charge_id: data.charge_id,
            cart_id: cart.id,
            timestamp: Date.now()
          }))
          
          // Redirect to Tap payment page
          window.location.href = data.payment_url
        } else {
          throw new Error(data.error || "Failed to get payment URL")
        }
      } catch (error: any) {
        console.error("Payment initialization error:", error)
        setPaymentStatus("failed")
        onError(error.message || "Failed to initialize payment")
        onPaymentFailure(error.message || "Payment initialization failed")
      } finally {
        setIsProcessing(false)
      }
    },
    [cart, onError, onPaymentFailure, locale, countryCode]
  )

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isComponentMounted.current = false
    }
  }, [])

  const getStatusIcon = () => {
    switch (paymentStatus) {
      case "idle":
        return <CreditCard className="w-6 h-6 text-gray-400" />
      case "initializing":
        return <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
      case "redirecting":
        return <ExternalLink className="w-6 h-6 text-blue-600" />
      case "processing":
        return <Loader2 className="w-6 h-6 text-yellow-600 animate-spin" />
      case "success":
        return <CheckCircle className="w-6 h-6 text-green-600" />
      case "failed":
        return <AlertCircle className="w-6 h-6 text-red-600" />
      default:
        return <CreditCard className="w-6 h-6 text-gray-400" />
    }
  }

  const getStatusMessage = () => {
    switch (paymentStatus) {
      case "idle":
        return locale === "ar" ? "جاهز للدفع" : "Ready to pay"
      case "initializing":
        return locale === "ar" ? "جاري تهيئة الدفع..." : "Initializing payment..."
      case "redirecting":
        return locale === "ar" ? "جاري التوجيه إلى صفحة الدفع..." : "Redirecting to payment page..."
      case "processing":
        return locale === "ar" ? "جاري معالجة الدفع..." : "Processing payment..."
      case "success":
        return locale === "ar" ? "تم الدفع بنجاح!" : "Payment successful!"
      case "failed":
        return locale === "ar" ? "فشل في الدفع" : "Payment failed"
      default:
        return locale === "ar" ? "جاهز للدفع" : "Ready to pay"
    }
  }

  const getButtonText = () => {
    switch (paymentStatus) {
      case "idle":
        return locale === "ar" ? "ادفع الآن" : "Pay Now"
      case "initializing":
        return locale === "ar" ? "جاري التهيئة..." : "Initializing..."
      case "redirecting":
        return locale === "ar" ? "جاري التوجيه..." : "Redirecting..."
      case "processing":
        return locale === "ar" ? "جاري المعالجة..." : "Processing..."
      case "success":
        return locale === "ar" ? "تم الدفع" : "Paid"
      case "failed":
        return locale === "ar" ? "حاول مرة أخرى" : "Try Again"
      default:
        return locale === "ar" ? "ادفع الآن" : "Pay Now"
    }
  }

  const hasEmailAndBilling = Boolean(cart?.email && cart?.billing_address)
  const isButtonDisabled = () => {
    return (
      !hasEmailAndBilling ||
      isProcessing ||
      paymentStatus === "redirecting" ||
      paymentStatus === "processing"
    )
  }

  return (
    <div className="w-full">
      {!hasEmailAndBilling && paymentStatus === "idle" && (
        <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
          <Text className="txt-compact-small text-amber-800">
            {locale === "ar"
              ? "يرجى إكمال البريد الإلكتروني وعنوان الفواتير في خطوة التوصيل أولاً."
              : "Please complete your email and billing address in the delivery step first."}
          </Text>
        </div>
      )}
      {/* Payment Status Display */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center gap-3">
          {getStatusIcon()}
          <div>
            <Text className="txt-compact-medium text-ui-fg-base font-medium">
              {getStatusMessage()}
            </Text>
            {paymentStatus === "idle" && hasEmailAndBilling && (
              <Text className="txt-compact-small text-ui-fg-subtle">
                {locale === "ar" 
                  ? "اضغط على زر الدفع للمتابعة"
                  : "Click the pay button to continue"
                }
              </Text>
            )}
          </div>
        </div>
      </div>

      {/* Security Features */}
      <div className="mb-6 p-4 bg-green-50 rounded-lg border border-green-200">
        <div className="flex items-center gap-2 mb-3">
          <Shield className="w-5 h-5 text-green-600" />
          <Text className="txt-compact-medium text-green-800 font-medium">
            {locale === "ar" ? "دفع آمن" : "Secure Payment"}
          </Text>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-green-600" />
            <Text className="txt-compact-small text-green-700">
              {locale === "ar" ? "تشفير SSL" : "SSL Encryption"}
            </Text>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-600" />
            <Text className="txt-compact-small text-green-700">
              {locale === "ar" ? "حماية ثلاثية الأبعاد" : "3D Secure"}
            </Text>
          </div>
        </div>
      </div>

      {/* Payment Button */}
      <div className="text-center">
        <Button
          size="large"
          className="w-full bg-[#043364] hover:bg-blue-900 text-white"
          onClick={initializePayment}
          disabled={isButtonDisabled()}
          isLoading={isProcessing}
        >
          {getButtonText()}
        </Button>
        
        {paymentStatus === "idle" && (
          <Text className="txt-compact-small text-ui-fg-subtle mt-3">
            {locale === "ar" 
              ? "سيتم توجيهك إلى صفحة دفع آمنة"
              : "You will be redirected to a secure payment page"
            }
          </Text>
        )}
      </div>

      {/* Error Display */}
      {paymentStatus === "failed" && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <Text className="txt-compact-small text-red-600 text-center">
            {locale === "ar" 
              ? "حدث خطأ أثناء تهيئة الدفع. يرجى المحاولة مرة أخرى."
              : "An error occurred while initializing payment. Please try again."
            }
          </Text>
        </div>
      )}
    </div>
  )
} 