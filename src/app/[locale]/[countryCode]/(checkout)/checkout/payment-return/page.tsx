"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Loader2, AlertTriangle } from "lucide-react"

type Props = {
  params: {
    locale: string
    countryCode: string
  }
}

export default function PaymentReturnPage({ params }: Props) {
  const [status, setStatus] = useState<"checking" | "redirecting" | "error">("checking")
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const checkPaymentStatus = async () => {
      try {
        const cartId = searchParams.get('cart_id')
        const tapId = searchParams.get('tap_id')

        if (!cartId) {
          throw new Error("Missing cart_id parameter")
        }

        console.log(`[Payment Return] Checking status for cart: ${cartId}, tap_id: ${tapId}`)

        // Wait a moment for webhook to process
        await new Promise(resolve => setTimeout(resolve, 2000))

        // Check payment status
        const statusResponse = await fetch(`/api/store/tap/status?cart_id=${cartId}${tapId ? `&charge_id=${tapId}` : ''}`)
        
        if (statusResponse.ok) {
          const statusResult = await statusResponse.json()
          
          if (statusResult.success) {
            const isSuccessful = statusResult.is_successful
            const paymentStatus = statusResult.payment_status
            
            console.log(`[Payment Return] Payment status: ${paymentStatus}, successful: ${isSuccessful}`)
            
            setStatus("redirecting")
            
            if (isSuccessful) {
              // Clear cart and redirect to success page
              try {
                // Clear cart from localStorage/session
                localStorage.removeItem(`cart_${cartId}`)
                sessionStorage.removeItem(`cart_${cartId}`)
                
                // Clear any cart cookies
                document.cookie = `cart_id=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`
                
                console.log(`[Payment Return] Cart cleared, redirecting to success`)
                
                router.push(`/${params.locale}/${params.countryCode}/checkout/payment-success?cart_id=${cartId}&tap_id=${statusResult.charge_id}`)
              } catch (clearError) {
                console.warn("Could not clear cart:", clearError)
                // Still redirect to success even if cart clearing fails
                router.push(`/${params.locale}/${params.countryCode}/checkout/payment-success?cart_id=${cartId}&tap_id=${statusResult.charge_id}`)
              }
            } else {
              // Redirect to failure page
              console.log(`[Payment Return] Payment failed, redirecting to failure`)
              router.push(`/${params.locale}/${params.countryCode}/checkout/payment-failure?cart_id=${cartId}&tap_id=${statusResult.charge_id}&reason=${encodeURIComponent(paymentStatus)}`)
            }
          } else {
            // Status check failed, but we still have cart_id, so redirect based on URL params
            console.warn(`[Payment Return] Status check failed, falling back to URL analysis`)
            
            // If we have tap_id in URL, assume it's a return from payment
            if (tapId) {
              // Check if URL contains success indicators
              const urlString = window.location.href
              if (urlString.includes('success') || urlString.includes('captured') || urlString.includes('authorized')) {
                router.push(`/${params.locale}/${params.countryCode}/checkout/payment-success?cart_id=${cartId}&tap_id=${tapId}`)
              } else {
                router.push(`/${params.locale}/${params.countryCode}/checkout/payment-failure?cart_id=${cartId}&tap_id=${tapId}`)
              }
            } else {
              throw new Error("Could not determine payment status")
            }
          }
        } else {
          throw new Error(`Status check failed: ${statusResponse.status}`)
        }
        
      } catch (error: any) {
        console.error("Payment status check error:", error)
        setError(error.message)
        setStatus("error")
        
        // Fallback: redirect to checkout after a delay
        setTimeout(() => {
          router.push(`/${params.locale}/${params.countryCode}/checkout`)
        }, 5000)
      }
    }

    checkPaymentStatus()
  }, [searchParams, router, params])

  if (status === "checking") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-16 w-16 animate-spin mx-auto text-blue-600 mb-4" />
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">
            Processing Your Payment
          </h1>
          <p className="text-gray-600">
            Please wait while we verify your payment status...
          </p>
        </div>
      </div>
    )
  }

  if (status === "redirecting") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-16 w-16 animate-spin mx-auto text-green-600 mb-4" />
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">
            Redirecting...
          </h1>
          <p className="text-gray-600">
            Taking you to the results page...
          </p>
        </div>
      </div>
    )
  }

  // Error state
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-md w-full text-center">
        <AlertTriangle className="h-16 w-16 text-yellow-600 mx-auto mb-6" />
        
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Unable to Verify Payment
        </h1>
        
        <p className="text-gray-600 mb-6">
          {error || "We couldn't verify your payment status. You will be redirected to checkout shortly."}
        </p>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-yellow-800 text-sm">
            <strong>Don't worry!</strong><br />
            If your payment was successful, you'll receive a confirmation email shortly. 
            You can also check your order status in your account.
          </p>
        </div>
      </div>
    </div>
  )
} 