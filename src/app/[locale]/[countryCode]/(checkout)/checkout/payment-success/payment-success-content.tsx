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
  const [error, setError] = useState<string | null>(null)
  const [retryCount, setRetryCount] = useState(0)
  const router = useRouter()

  useEffect(() => {
    const verifyPaymentAndCompleteOrder = async () => {
      try {
        setError(null)

        // Call our API to verify payment and complete order
        const response = await fetch("/api/payments/tap/complete", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            cart_id: cartId,
            tap_id: tapId,
            data: data,
          }),
        })

        const result = await response.json()

        if (!response.ok) {
          throw new Error(result.error || "Failed to complete payment")
        }

        if (result.success && result.order) {
          setOrderDetails(result.order)
          
          // Check if this is a completed order or still processing
          if (result.message?.includes("already exists") || result.order.status === "completed") {
            setStatus("success")
          } else if (result.message?.includes("order processing") || result.payment_status === "PENDING") {
            setStatus("pending")
          } else {
            setStatus("success")
          }
        } else {
          setStatus("failed")
          setError(result.error || "Payment verification failed")
        }
      } catch (error: any) {
        console.error("Payment verification error:", error)
        setStatus("error")
        setError(error.message || "An unexpected error occurred")
      }
    }

    verifyPaymentAndCompleteOrder()
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
      router.push(`/${locale}/${countryCode}/account/orders/${orderDetails.id}`)
    }
  }

  if (status === "verifying") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-16 w-16 animate-spin mx-auto text-blue-600 mb-4" />
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">
            Verifying Your Payment
          </h1>
          <p className="text-gray-600">
            Please wait while we confirm your payment with Tap...
          </p>
        </div>
      </div>
    )
  }

  if (status === "success" && orderDetails) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="max-w-md w-full text-center">
          <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-6" />
          
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Payment Successful!
          </h1>
          
          <p className="text-gray-600 mb-6">
            Thank you for your purchase. Your order has been confirmed.
          </p>

          <div className="bg-gray-50 rounded-lg p-6 mb-6 text-left">
            <h2 className="font-semibold text-gray-900 mb-4">Order Details</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Order Number:</span>
                <span className="font-medium">#{orderDetails.display_id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Email:</span>
                <span className="font-medium">{orderDetails.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total:</span>
                <span className="font-medium">
                  {new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: orderDetails.currency_code?.toUpperCase() || 'USD',
                  }).format(orderDetails.total / 100)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Payment ID:</span>
                <span className="font-medium text-xs">{tapId}</span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <Button 
              onClick={handleViewOrder}
              className="w-full"
            >
              <ShoppingBag className="h-4 w-4 mr-2" />
              View Order Details
            </Button>
            
            <Button 
              onClick={handleContinueShopping}
              variant="secondary"
              className="w-full"
            >
              Continue Shopping
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    )
  }

  if (status === "pending" && orderDetails) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="max-w-md w-full text-center">
          <Clock className="h-16 w-16 text-orange-600 mx-auto mb-6" />
          
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Payment Received!
          </h1>
          
          <p className="text-gray-600 mb-6">
            Your payment has been processed successfully. Your order is being prepared and you'll receive a confirmation email shortly.
          </p>

          <div className="bg-orange-50 rounded-lg p-6 mb-6 text-left">
            <h2 className="font-semibold text-gray-900 mb-4">Payment Details</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Reference:</span>
                <span className="font-medium">#{orderDetails.display_id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Email:</span>
                <span className="font-medium">{orderDetails.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Amount:</span>
                <span className="font-medium">
                  {new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: orderDetails.currency_code?.toUpperCase() || 'USD',
                  }).format(orderDetails.total / 100)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Payment ID:</span>
                <span className="font-medium text-xs">{tapId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Status:</span>
                <span className="font-medium text-orange-600">Processing</span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <Button 
              onClick={handleRetry}
              className="w-full"
            >
              Check Order Status
            </Button>
            
            <Button 
              onClick={handleContinueShopping}
              variant="secondary"
              className="w-full"
            >
              Continue Shopping
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
          {status === "failed" ? "Payment Processing" : "Something Went Wrong"}
        </h1>
        
        <p className="text-gray-600 mb-6">
          {error || "We're processing your payment. If you completed the payment successfully, your order will be confirmed shortly."}
        </p>

        <div className="space-y-3">
          <Button 
            onClick={handleRetry}
            className="w-full"
          >
            Check Status Again
          </Button>
          
          <Button 
            onClick={handleContinueShopping}
            variant="secondary"
            className="w-full"
          >
            Continue Shopping
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  )
} 