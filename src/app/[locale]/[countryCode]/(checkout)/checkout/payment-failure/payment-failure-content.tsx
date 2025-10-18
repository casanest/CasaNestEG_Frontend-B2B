"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { XCircle, RefreshCw, ArrowLeft, AlertTriangle } from "lucide-react"
import { Button } from "@medusajs/ui"

type Props = {
  cartId: string
  tapId: string
  reason?: string
  locale: string
  countryCode: string
}

interface PaymentDetails {
  cart_id: string
  charge_id: string
  amount: number
  currency: string
  status: string
  timestamp: string
}

export default function PaymentFailureContent({ cartId, tapId, reason, locale, countryCode }: Props) {
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const fetchPaymentStatus = async () => {
      try {
        setLoading(true)
        setError(null)

        // Check payment status from backend
        const response = await fetch(`/api/store/tap/status?cart_id=${cartId}&charge_id=${tapId}`)
        const result = await response.json()

        if (response.ok && result.success) {
          setPaymentDetails({
            cart_id: result.cart_id,
            charge_id: result.charge_id,
            amount: result.amount,
            currency: result.currency,
            status: result.payment_status,
            timestamp: result.timestamp,
          })
        } else {
          setError(result.message || "Could not retrieve payment details")
        }
      } catch (err: any) {
        console.error("Error fetching payment status:", err)
        setError(err.message || "Failed to check payment status")
      } finally {
        setLoading(false)
      }
    }

    fetchPaymentStatus()
  }, [cartId, tapId])

  const handleRetryPayment = () => {
    router.push(`/${locale}/${countryCode}/checkout`)
  }

  const handleBackToCart = () => {
    router.push(`/${locale}/${countryCode}/cart`)
  }

  const handleContinueShopping = () => {
    router.push(`/${locale}/${countryCode}/store`)
  }

  const getFailureReason = () => {
    if (reason) return reason
    if (paymentDetails?.status) {
      switch (paymentDetails.status.toLowerCase()) {
        case 'declined':
          return 'Your card was declined. Please try a different payment method.'
        case 'insufficient_funds':
          return 'Insufficient funds. Please check your account balance or try a different card.'
        case 'expired_card':
          return 'Your card has expired. Please use a different card.'
        case 'invalid_card':
          return 'Invalid card details. Please check your card information.'
        case 'cancelled':
          return 'Payment was cancelled.'
        default:
          return 'Payment could not be processed. Please try again.'
      }
    }
    return 'Payment failed. Please try again with a different payment method.'
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-12 w-12 animate-spin mx-auto text-gray-400 mb-4" />
          <h1 className="text-xl font-semibold text-gray-900 mb-2">
            Checking Payment Status
          </h1>
          <p className="text-gray-600">
            Please wait while we verify your payment...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-md w-full text-center">
        <XCircle className="h-16 w-16 text-red-600 mx-auto mb-6" />
        
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Payment Failed
        </h1>
        
        <p className="text-gray-600 mb-6">
          {getFailureReason()}
        </p>

        {paymentDetails && (
          <div className="bg-red-50 rounded-lg p-6 mb-6 text-left">
            <h2 className="font-semibold text-gray-900 mb-4 flex items-center">
              <AlertTriangle className="h-5 w-5 text-red-600 mr-2" />
              Payment Details
            </h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Payment ID:</span>
                <span className="font-medium text-xs">{paymentDetails.charge_id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Amount:</span>
                <span className="font-medium">
                  {new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: paymentDetails.currency?.toUpperCase() || 'USD',
                  }).format(paymentDetails.amount / 100)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Status:</span>
                <span className="font-medium text-red-600 capitalize">
                  {paymentDetails.status}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Time:</span>
                <span className="font-medium">
                  {new Date(paymentDetails.timestamp).toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <p className="text-yellow-800 text-sm">
              <AlertTriangle className="h-4 w-4 inline mr-1" />
              {error}
            </p>
          </div>
        )}

        <div className="space-y-3">
          <Button 
            onClick={handleRetryPayment}
            className="w-full"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Payment Again
          </Button>
          
          <Button 
            onClick={handleBackToCart}
            variant="secondary"
            className="w-full"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Cart
          </Button>

          <Button 
            onClick={handleContinueShopping}
            variant="secondary"
            className="w-full"
          >
            Continue Shopping
          </Button>
        </div>

        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600">
            <strong>Need Help?</strong><br />
            If you continue to experience issues, please contact our support team with payment ID: <code className="bg-white px-1 rounded">{tapId}</code>
          </p>
        </div>
      </div>
    </div>
  )
} 