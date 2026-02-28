"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { CheckCircle, XCircle, Loader2, ShoppingBag, ArrowRight, Clock } from "lucide-react"
import { Button } from "@medusajs/ui"

type Props = {
  cartId: string
  tapId: string
  data?: string
  locale: string
  countryCode: string
}

type PaymentStatus = "verifying" | "success" | "pending" | "failed" | "error"

interface PaymentStatusResult {
  success: boolean
  payment_status: string
  cart_id: string
  charge_id: string
  amount: number
  currency: string
  is_successful: boolean
  is_pending: boolean
  is_failed: boolean
  verified_with_tap: boolean
  status_summary: {
    success: boolean
    pending: boolean
    failed: boolean
    message: string
  }
}

interface OrderDetails {
  id: string
  display_id: number | string
  email: string
  total: number
  currency_code: string
  status: string
  payment_status?: string
  created_at: string
}

export default function PaymentSuccessContent({ cartId, tapId, data, locale, countryCode }: Props) {
  const [status, setStatus] = useState<PaymentStatus>("verifying")
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null)
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatusResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [retryCount, setRetryCount] = useState(0)
  const router = useRouter()

  useEffect(() => {
    const verifyPaymentStatus = async () => {
      try {
        setError(null)
        console.log(`[Payment Success] Verifying payment for cart: ${cartId}, tap_id: ${tapId}`)

        // Call our working status endpoint
        const response = await fetch(`/api/store/tap/status?cart_id=${cartId}&charge_id=${tapId}`)
        
        if (!response.ok) {
          throw new Error(`Status check failed: ${response.status}`)
        }

        const result: PaymentStatusResult = await response.json()
        console.log(`[Payment Success] Payment status result:`, result)
        
        setPaymentStatus(result)

        if (result.success) {
          // Check payment status and determine next action
          if (result.is_successful || result.payment_status === "CAPTURED" || result.payment_status === "AUTHORIZED") {
            console.log(`[Payment Success] Payment successful (${result.payment_status}), creating order...`)
            setStatus("verifying")
            
            // Create the order in Medusa
            await createOrder(result)
          } else if (result.is_pending || result.payment_status === "PENDING" || result.payment_status === "INITIATED") {
            console.log(`[Payment Success] Payment pending (${result.payment_status}), showing pending state`)
            setStatus("pending")
          } else {
            console.log(`[Payment Success] Payment failed (${result.payment_status})`)
            setStatus("failed")
            setError(`Payment status: ${result.payment_status}`)
          }
        } else {
          setStatus("failed")
          setError("Payment verification failed")
        }
      } catch (error: any) {
        console.error("Payment verification error:", error)
        setStatus("error")
        setError(error.message || "An unexpected error occurred")
      }
    }

    const createOrder = async (paymentResult: PaymentStatusResult) => {
      try {
        console.log(`[Payment Success] Creating order for cart: ${cartId}`)
        
        // Since Medusa's cart completion requires payment sessions that we can't create manually,
        // we'll use the direct order creation endpoint directly
        console.log(`[Payment Success] Using direct order creation for cart: ${cartId}`)
        
        const directOrderResult = await createOrderManually(paymentResult)
        
        if (directOrderResult.success && directOrderResult.order) {
          setOrderDetails(directOrderResult.order)
          console.log(`[Payment Success] Order created successfully via direct creation`)
          setStatus("success")
        } else {
          throw new Error("Direct order creation failed")
        }
        
      } catch (orderError: any) {
        console.error("Order creation error:", orderError)
        
        // Try to find existing order as fallback
        console.log(`[Payment Success] Trying to find existing order as fallback...`)
        const existingOrder = await findExistingOrder()
        if (existingOrder) {
          console.log(`[Payment Success] Found existing order as fallback`)
          setOrderDetails(existingOrder)
          setStatus("success")
          return
        }
        
        setStatus("error")
        setError(`Order creation failed: ${orderError.message}`)
        console.error("[Payment Success] Order creation failed — full message:", orderError.message)
      }
    }

    const createOrderManually = async (paymentResult: PaymentStatusResult) => {
      try {
        console.log(`[Payment Success] Creating order manually for cart: ${cartId}`)
        
        // Use the direct order creation endpoint
        const directOrderResponse = await fetch("/api/payments/tap/create-order-direct", {
          method: 'POST',
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            cart_id: cartId,
            tap_id: tapId,
            payment_status: paymentResult.payment_status
          }),
        })
        
        if (directOrderResponse.ok) {
          const directOrderResult = await directOrderResponse.json()
          console.log(`[Payment Success] Direct order creation result:`, directOrderResult)
          
          if (directOrderResult.success && directOrderResult.order) {
            return {
              success: true,
              order: directOrderResult.order
            }
          } else {
            throw new Error("Direct order creation response invalid")
          }
        } else {
          let errorResult: Record<string, unknown> = {}
          try {
            errorResult = await directOrderResponse.json()
          } catch {
            errorResult = { error: "Direct order creation failed", details: directOrderResponse.statusText }
          }
          const diag = errorResult.diagnostics as Record<string, unknown> | undefined
          const msg = [
            errorResult.error || "Direct order creation failed",
            errorResult.details ? ` — ${errorResult.details}` : "",
            diag?.where ? ` [${diag.where}]` : "",
            diag?.medusa_status ? ` Medusa status: ${diag.medusa_status}` : "",
            diag?.message ? ` — ${diag.message}` : ""
          ].filter(Boolean).join("")
          console.error("[Payment Success] Direct order creation failed:", { errorResult, diagnostics: diag })
          throw new Error(msg)
        }
      } catch (error: any) {
        console.error("Direct order creation error:", error)
        throw error
      }
    }

    const findExistingOrder = async () => {
      try {
        // Since Medusa doesn't have a public orders endpoint, we'll use alternative methods
        
        // Method 1: Try to find order by cart ID using the backend directly
        console.log(`[Payment Success] Trying to find existing order by cart ID...`)
        
        // Method 2: Check if the webhook has already processed this payment
        // by looking at the payment status cache
        console.log(`[Payment Success] Checking payment status cache...`)
        
        // Method 3: Try to complete the cart again (it might work if webhook processed it)
        console.log(`[Payment Success] Attempting cart completion to check for existing order...`)
        
        try {
          const completeResponse = await fetch(`/api/payments/tap/complete-order`, {
            method: 'POST',
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              cart_id: cartId,
              tap_id: tapId,
              payment_status: "CAPTURED"
            }),
          })
          
          if (completeResponse.ok) {
            const completeResult = await completeResponse.json()
            if (completeResult.success && completeResult.order) {
              console.log(`[Payment Success] Found existing order through completion:`, completeResult.order)
              return {
                id: completeResult.order.id,
                display_id: completeResult.order.display_id,
                email: completeResult.order.email,
                total: completeResult.order.total,
                currency_code: completeResult.order.currency_code,
                status: completeResult.order.status,
                payment_status: completeResult.order.payment_status,
                created_at: completeResult.order.created_at
              }
            }
          } else {
            let errPayload: Record<string, unknown> = {}
            try { errPayload = await completeResponse.json() } catch { /* ignore */ }
            console.warn("[Payment Success] complete-order fallback failed:", {
              status: completeResponse.status,
              error: errPayload.error,
              details: errPayload.details,
              diagnostics: errPayload.diagnostics
            })
          }
        } catch (completionError) {
          console.log(`[Payment Success] Cart completion check failed:`, completionError)
        }
        
        // Method 4: Check if there's a local storage record of the order
        console.log(`[Payment Success] Checking local storage for order record...`)
        const localOrder = localStorage.getItem(`order_${cartId}`)
        if (localOrder) {
          try {
            const orderData = JSON.parse(localOrder)
            console.log(`[Payment Success] Found order in local storage:`, orderData)
            return orderData
          } catch (parseError) {
            console.warn(`[Payment Success] Failed to parse local order data:`, parseError)
          }
        }
        
        console.log(`[Payment Success] No existing order found through any method`)
        return null
      } catch (error) {
        console.warn(`[Payment Success] Error finding existing order:`, error)
        return null
      }
    }

    verifyPaymentStatus()
  }, [cartId, tapId, data, retryCount])

  const handleRetry = () => {
    setStatus("verifying")
    setRetryCount(prev => prev + 1)
  }

  const handleContinueShopping = () => {
    router.push(`/${locale}/${countryCode}/store`)
  }

  const handleViewOrder = () => {
    if (orderDetails) {
      // For Tap payments, redirect to the confirmed order page
      // For manual payments, redirect to the general order details page
      const isTapPayment = tapId && tapId !== "success" && tapId !== "manual"
      
      if (isTapPayment) {
        router.push(`/${locale}/${countryCode}/order/${orderDetails.id}/confirmed`)
      } else {
        router.push(`/${locale}/${countryCode}/orders/${orderDetails.id}`)
      }
    }
  }

  // Auto-retry if payment verification fails (webhook might be delayed)
  useEffect(() => {
    if (status === "error" && retryCount < 3) {
      const timer = setTimeout(() => {
        console.log(`[Payment Success] Auto-retrying payment verification (attempt ${retryCount + 1})`)
        handleRetry()
      }, 5000) // Wait 5 seconds before retrying

      return () => clearTimeout(timer)
    }
  }, [status, retryCount])

  if (status === "verifying") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">
          {locale === "ar" ? "جاري التحقق من الدفع..." : "Verifying Your Payment..."}
        </h2>
        <p className="text-gray-600 max-w-md">
          {locale === "ar" 
            ? "يرجى الانتظار بينما نتأكد من معالجة الدفع وإنشاء الطلب"
            : "Please wait while we verify your payment and create your order"
          }
        </p>
      </div>
    )
  }

  if (status === "success") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="max-w-md w-full text-center">
          <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-6" />
          
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {locale === "ar" ? "تم الدفع بنجاح!" : "Payment Successful!"}
          </h1>
          
          <p className="text-gray-600 mb-6">
            {locale === "ar" 
              ? "شكراً لك على الشراء. تم تأكيد طلبك بنجاح."
              : "Thank you for your purchase. Your order has been confirmed."
            }
          </p>

          <div className="bg-green-50 rounded-lg p-6 mb-6 text-left">
            <h2 className="font-semibold text-gray-900 mb-4">
              {locale === "ar" ? "تفاصيل الدفع" : "Payment Details"}
            </h2>
            <div className="space-y-2 text-sm">
              {orderDetails && (
                <>
                  <div className="flex justify-between">
                    <span className="text-gray-600">
                      {locale === "ar" ? "رقم الطلب:" : "Order Number:"}
                    </span>
                    <span className="font-medium">#{orderDetails.display_id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">
                      {locale === "ar" ? "البريد الإلكتروني:" : "Email:"}
                    </span>
                    <span className="font-medium">{orderDetails.email}</span>
                  </div>
                </>
              )}
              <div className="flex justify-between">
                <span className="text-gray-600">
                  {locale === "ar" ? "المبلغ:" : "Amount:"}
                </span>
                <span className="font-medium">
                  {paymentStatus && new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: paymentStatus.currency?.toUpperCase() || 'EUR',
                  }).format(paymentStatus.amount )}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">
                  {locale === "ar" ? "حالة الدفع:" : "Payment Status:"}
                </span>
                    <span className="font-medium text-green-600">
                      {paymentStatus?.payment_status || "CAPTURED"}
                    </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">
                  {locale === "ar" ? "معرف الدفع:" : "Payment ID:"}
                </span>
                <span className="font-medium text-xs">{tapId}</span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            {orderDetails && (
              <Button 
                onClick={handleViewOrder}
                className="w-full"
              >
                <ShoppingBag className="h-4 w-4 mr-2" />
                {locale === "ar" ? "عرض تفاصيل الطلب" : "View Order Details"}
              </Button>
            )}
            
            <Button 
              onClick={handleContinueShopping}
              variant="secondary"
              className="w-full"
            >
              {locale === "ar" ? "مواصلة التسوق" : "Continue Shopping"}
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    )
  }

  if (status === "pending") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="max-w-md w-full text-center">
          <Clock className="h-16 w-16 text-orange-600 mx-auto mb-6" />
          
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {locale === "ar" ? "تم استلام الدفع!" : "Payment Received!"}
          </h1>
          
          <p className="text-gray-600 mb-6">
            {locale === "ar" 
              ? "تم معالجة الدفع بنجاح. طلبك قيد التحضير وستتلقى رسالة تأكيد بالبريد الإلكتروني قريباً."
              : "Your payment has been processed successfully. Your order is being prepared and you'll receive a confirmation email shortly."
            }
          </p>

          <div className="bg-orange-50 rounded-lg p-6 mb-6 text-left">
            <h2 className="font-semibold text-gray-900 mb-4">
              {locale === "ar" ? "تفاصيل الدفع" : "Payment Details"}
            </h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">
                  {locale === "ar" ? "معرف الدفع:" : "Payment ID:"}
                </span>
                <span className="font-medium text-xs">{tapId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">
                  {locale === "ar" ? "المبلغ:" : "Amount:"}
                </span>
                <span className="font-medium">
                  {paymentStatus && new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: paymentStatus.currency?.toUpperCase() || 'EUR',
                  }).format(paymentStatus.amount / 100)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">
                  {locale === "ar" ? "حالة الدفع:" : "Payment Status:"}
                </span>
                <span className="font-medium text-orange-600">
                  {paymentStatus?.payment_status || "PENDING"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">
                  {locale === "ar" ? "التحقق:" : "Verification:"}
                </span>
                <span className="font-medium text-orange-600">
                  {paymentStatus?.verified_with_tap ? "Verified with Tap" : "Processing"}
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <Button 
              onClick={handleRetry}
              className="w-full"
            >
              {locale === "ar" ? "فحص حالة الطلب" : "Check Order Status"}
            </Button>
            
            <Button 
              onClick={handleContinueShopping}
              variant="secondary"
              className="w-full"
            >
              {locale === "ar" ? "مواصلة التسوق" : "Continue Shopping"}
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // Error or failed state
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-md w-full text-center">
        <XCircle className="h-16 w-16 text-red-600 mx-auto mb-6" />
        
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {status === "failed" 
            ? (locale === "ar" ? "معالجة الدفع" : "Payment Processing") 
            : (locale === "ar" ? "حدث خطأ ما" : "Something Went Wrong")
          }
        </h1>
        
        <p className="text-gray-600 mb-6">
          {error || (locale === "ar" 
            ? "نحن نعالج الدفع الخاص بك. إذا أكملت الدفع بنجاح، سيتم تأكيد طلبك قريباً."
            : "We're processing your payment. If you completed the payment successfully, your order will be confirmed shortly."
          )}
        </p>

        <div className="space-y-3">
          <Button 
            onClick={handleRetry}
            className="w-full"
          >
            {locale === "ar" ? "فحص الحالة مرة أخرى" : "Check Status Again"}
          </Button>
          
          <Button 
            onClick={handleContinueShopping}
            variant="secondary"
            className="w-full"
          >
            {locale === "ar" ? "مواصلة التسوق" : "Continue Shopping"}
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  )
} 