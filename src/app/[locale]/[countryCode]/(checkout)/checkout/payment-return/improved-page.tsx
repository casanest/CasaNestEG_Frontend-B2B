"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Loader2, AlertTriangle, CheckCircle, Clock, RefreshCw, XCircle, ArrowRight } from "lucide-react"
import { usePaymentStatus } from "@lib/hooks/use-payment-status"

type Props = {
  params: Promise<{
    locale: string
    countryCode: string
  }>
}

export default function ImprovedPaymentReturnPage(props: Props) {
  const [params, setParams] = useState<{ locale: string; countryCode: string } | null>(null)
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const cartId = searchParams.get('cart_id') || ''
  const chargeId = searchParams.get('tap_id') || searchParams.get('charge_id') || ''

  // Initialize params
  useEffect(() => {
    const initParams = async () => {
      const resolvedParams = await props.params
      setParams(resolvedParams)
    }
    initParams()
  }, [props.params])

  // Use the payment status hook
  const {
    data,
    loading,
    error,
    attempt,
    maxAttempts,
    nextRetryIn,
    isRetrying,
    verifyPayment,
    retry,
    cancel,
    progress,
    elapsedTime
  } = usePaymentStatus({
    cartId,
    chargeId,
    maxAttempts: 5,
    initialDelay: 2000,
    maxDelay: 15000,
    timeout: 120000, // 2 minutes
    onSuccess: (data) => {
      console.log('[Payment Return] Payment successful:', data)
      
      // Clear cart data
      try {
        localStorage.removeItem(`cart_${cartId}`)
        sessionStorage.removeItem(`cart_${cartId}`)
        document.cookie = `cart_id=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`
      } catch (clearError) {
        console.warn("Could not clear cart:", clearError)
      }

      // Redirect to success page
      if (params) {
        setTimeout(() => {
          const successUrl = `/${params.locale}/${params.countryCode}/checkout/payment-success?cart_id=${cartId}&tap_id=${data.charge_id || chargeId}`
          router.push(successUrl)
        }, 2000)
      }
    },
    onFailure: (data) => {
      console.log('[Payment Return] Payment failed:', data)
      
      // Redirect to failure page
      if (params) {
        setTimeout(() => {
          const failureUrl = `/${params.locale}/${params.countryCode}/checkout/payment-failure?cart_id=${cartId}&tap_id=${data.charge_id || chargeId}&reason=${encodeURIComponent(data.payment_status)}`
          router.push(failureUrl)
        }, 3000)
      }
    },
    onError: (error) => {
      console.error('[Payment Return] Verification error:', error)
    },
    onTimeout: () => {
      console.warn('[Payment Return] Verification timeout')
      
      // Redirect to checkout on timeout
      if (params) {
        setTimeout(() => {
          router.push(`/${params.locale}/${params.countryCode}/checkout`)
        }, 5000)
      }
    }
  })

  // Start verification when component mounts and we have the required data
  useEffect(() => {
    if (cartId && params) {
      // Wait a moment for webhook processing
      setTimeout(() => {
        verifyPayment()
      }, 1000)
    }
  }, [cartId, params, verifyPayment])

  // Handle missing cart ID
  if (!cartId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full mx-4">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <XCircle className="h-16 w-16 mx-auto text-red-600 mb-4" />
            <h1 className="text-2xl font-semibold text-gray-900 mb-2">
              Invalid Payment Return
            </h1>
            <p className="text-gray-600 mb-6">
              Missing required payment information. Please try again.
            </p>
            <button
              onClick={() => params && router.push(`/${params.locale}/${params.countryCode}/checkout`)}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Return to Checkout
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Determine current status
  const getStatus = () => {
    if (error && !isRetrying) return 'error'
    if (data?.is_successful) return 'success'
    if (data?.is_failed) return 'failed'
    if (data?.is_pending || loading || isRetrying) return 'pending'
    return 'checking'
  }

  const status = getStatus()

  // Get appropriate icon
  const getIcon = () => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-16 w-16 mx-auto text-green-600 mb-4" />
      case 'failed':
        return <XCircle className="h-16 w-16 mx-auto text-red-600 mb-4" />
      case 'error':
        return <AlertTriangle className="h-16 w-16 mx-auto text-yellow-600 mb-4" />
      case 'pending':
        return isRetrying ? 
          <Clock className="h-16 w-16 mx-auto text-yellow-600 mb-4" /> :
          <Loader2 className="h-16 w-16 animate-spin mx-auto text-blue-600 mb-4" />
      default:
        return <RefreshCw className="h-16 w-16 animate-spin mx-auto text-blue-600 mb-4" />
    }
  }

  // Get title
  const getTitle = () => {
    switch (status) {
      case 'success':
        return 'Payment Successful!'
      case 'failed':
        return 'Payment Failed'
      case 'error':
        return 'Verification Error'
      case 'pending':
        return isRetrying ? 'Retrying Verification' : 'Verifying Payment'
      default:
        return 'Processing Payment'
    }
  }

  // Get message
  const getMessage = () => {
    if (data?.status_summary?.message) {
      return data.status_summary.message
    }
    
    switch (status) {
      case 'success':
        return 'Your payment has been processed successfully. Redirecting to confirmation...'
      case 'failed':
        return `Payment failed: ${data?.payment_status || 'Unknown error'}`
      case 'error':
        return error || 'Unable to verify payment status'
      case 'pending':
        if (isRetrying) {
          return `Retrying in ${nextRetryIn} seconds... (Attempt ${attempt}/${maxAttempts})`
        }
        return 'Please wait while we verify your payment...'
      default:
        return 'Initializing payment verification...'
    }
  }

  // Get progress bar color
  const getProgressColor = () => {
    switch (status) {
      case 'success':
        return 'bg-green-600'
      case 'failed':
        return 'bg-red-600'
      case 'error':
        return 'bg-yellow-600'
      default:
        return 'bg-blue-600'
    }
  }

  // Format elapsed time
  const formatElapsedTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000)
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    
    if (minutes > 0) {
      return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
    }
    return `${seconds}s`
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full mx-4">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          {getIcon()}
          
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">
            {getTitle()}
          </h1>
          
          <p className="text-gray-600 mb-6">
            {getMessage()}
          </p>

          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
            <div 
              className={`h-2 rounded-full transition-all duration-500 ${getProgressColor()}`}
              style={{ width: `${Math.max(progress, status === 'success' ? 100 : 10)}%` }}
            />
          </div>

          {/* Status Details */}
          <div className="text-sm text-gray-500 mb-4 space-y-1">
            {(loading || isRetrying) && (
              <>
                <p>Attempt {attempt} of {maxAttempts}</p>
                {elapsedTime > 0 && (
                  <p>Elapsed: {formatElapsedTime(elapsedTime)}</p>
                )}
              </>
            )}
            
            {data && (
              <div className="text-xs bg-gray-50 rounded p-2 mt-2">
                <p><strong>Status:</strong> {data.payment_status}</p>
                {data.charge_id && <p><strong>Charge ID:</strong> {data.charge_id}</p>}
                {data.amount && data.currency && (
                  <p><strong>Amount:</strong> {(data.amount / 100).toFixed(2)} {data.currency.toUpperCase()}</p>
                )}
                <p><strong>Verified:</strong> {data.verified_with_tap ? 'Yes (Tap API)' : 'Webhook'}</p>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          {status === 'error' && (
            <div className="space-y-3">
              <button
                onClick={retry}
                disabled={loading || isRetrying}
                className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
              >
                <RefreshCw className={`h-4 w-4 ${loading || isRetrying ? 'animate-spin' : ''}`} />
                Try Again
              </button>
              
              <button
                onClick={() => params && router.push(`/${params.locale}/${params.countryCode}/checkout`)}
                className="w-full bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors flex items-center justify-center gap-2"
              >
                Return to Checkout
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          )}

          {/* Status-specific messages */}
          {status === 'success' && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-green-800 text-sm">
                <strong>Success!</strong> Your payment has been processed. You will receive a confirmation email shortly.
              </p>
            </div>
          )}

          {status === 'failed' && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800 text-sm">
                <strong>Payment Failed</strong><br />
                Your payment could not be processed. You will be redirected to try again.
              </p>
            </div>
          )}

          {status === 'error' && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-yellow-800 text-sm">
                <strong>Verification Issue</strong><br />
                We're having trouble verifying your payment. If your payment was successful, you'll receive a confirmation email.
              </p>
            </div>
          )}

          {/* Cancel button for long-running operations */}
          {(loading || isRetrying) && (
            <button
              onClick={cancel}
              className="mt-4 text-gray-500 hover:text-gray-700 text-sm underline"
            >
              Cancel Verification
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

