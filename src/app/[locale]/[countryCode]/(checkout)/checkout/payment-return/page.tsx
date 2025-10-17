"use client"

import { useEffect, useState, useCallback } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Loader2, AlertTriangle, CheckCircle, Clock, RefreshCw, XCircle, ArrowRight } from "lucide-react"

type PaymentStatus = "checking" | "verifying" | "success" | "pending" | "failed" | "error" | "timeout"

interface PaymentState {
  status: PaymentStatus
  message: string
  progress: number
  attempt: number
  maxAttempts: number
  error?: string
  paymentData?: any
}

type Props = {
  params: Promise<{
    locale: string
    countryCode: string
  }>
}

export default function FixedPaymentReturnPage(props: Props) {
  const [params, setParams] = useState<{ locale: string; countryCode: string } | null>(null)
  const [state, setState] = useState<PaymentState>({
    status: "checking",
    message: "Processing payment return...",
    progress: 10,
    attempt: 1,
    maxAttempts: 3,
  })

  const router = useRouter()
  const searchParams = useSearchParams()

  // Initialize params
  useEffect(() => {
    const initParams = async () => {
      const resolvedParams = await props.params
      setParams(resolvedParams)
      console.log('[Payment Return] Initialized with params:', resolvedParams)
    }
    initParams()
  }, [props.params])

  // Extract payment data from URL
  const cartId = searchParams.get('cart_id') || ''
  const tapId = searchParams.get('tap_id') || ''
  const tapData = searchParams.get('data') || ''

  console.log('[Payment Return] URL params:', { cartId, tapId, tapData: tapData ? 'present' : 'missing' })

  // Clean URL path to prevent redirection loops
  const cleanUrlPath = useCallback(() => {
    if (typeof window !== 'undefined') {
      const currentPath = window.location.pathname
      console.log('[Payment Return] Current path:', currentPath)
      
      // Check if we have multiple country codes in the path (like /en/eg/ar/)
      const pathParts = currentPath.split('/').filter(Boolean)
      console.log('[Payment Return] Path parts:', pathParts)
      
      // Expected structure: [locale, countryCode, checkout, payment-return]
      if (pathParts.length > 4 && pathParts[2] !== 'checkout') {
        console.warn('[Payment Return] Detected malformed URL, attempting to clean')
        
        // Try to reconstruct the correct path
        const locale = pathParts[0] || 'en'
        const countryCode = pathParts[1] || 'ar' // Default to ar since it's in your regions
        const correctPath = `/${locale}/${countryCode}/checkout/payment-return`
        const queryString = window.location.search
        
        console.log('[Payment Return] Redirecting to clean path:', correctPath + queryString)
        window.history.replaceState({}, '', correctPath + queryString)
        
        return { locale, countryCode }
      }
    }
    return null
  }, [])

  // Enhanced payment verification
  const verifyPayment = useCallback(async (attempt: number = 1) => {
    try {
      setState(prev => ({
        ...prev,
        status: "verifying",
        message: `Verifying payment... (Attempt ${attempt}/${prev.maxAttempts})`,
        progress: Math.min((attempt / prev.maxAttempts) * 70, 70),
        attempt
      }))

      console.log(`[Payment Return] Verification attempt ${attempt} for cart: ${cartId}, tap: ${tapId}`)

      if (!cartId) {
        throw new Error("Missing cart_id parameter")
      }

      // Try multiple verification methods
      const verificationMethods = [
        // Method 1: Enhanced status API
        () => fetch(`/api/store/tap/status-enhanced?cart_id=${cartId}${tapId ? `&charge_id=${tapId}` : ''}&include_details=true`),
        
        // Method 2: Original status API
        () => fetch(`/api/store/tap/status?cart_id=${cartId}${tapId ? `&charge_id=${tapId}` : ''}`),
        
        // Method 3: Complete payment API
        () => fetch('/api/payments/tap/complete', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ cart_id: cartId, tap_id: tapId, data: tapData })
        })
      ]

      let lastError = null
      
      for (let methodIndex = 0; methodIndex < verificationMethods.length; methodIndex++) {
        try {
          console.log(`[Payment Return] Trying verification method ${methodIndex + 1}`)
          
          const response = await verificationMethods[methodIndex]()
          
          if (response.ok) {
            const result = await response.json()
            console.log(`[Payment Return] Method ${methodIndex + 1} success:`, JSON.stringify(result, null, 2))
            
            setState(prev => ({
              ...prev,
              progress: 90,
              paymentData: result
            }))

            // Check for failed payment first (regardless of success flag)
            const isFailed = result.is_failed === true || 
                            result.payment_status === 'FAILED' || 
                            (result.tap_data && result.tap_data.status === 'FAILED') ||
                            (result.tap_data && result.tap_data.is_failed === true) ||
                            (result.success && result.payment_status === 'FAILED') // Handle case where API returns success:true but status:FAILED

            console.log('[Payment Return] Payment status check:', {
              is_failed: result.is_failed,
              payment_status: result.payment_status,
              tap_data_status: result.tap_data?.status,
              tap_data_is_failed: result.tap_data?.is_failed,
              success: result.success,
              isFailed: isFailed,
              full_result: result
            })

            if (isFailed) {
              // Handle failed payment - extract the most specific error message
              const failureReason = result.tap_data?.gateway?.response?.message || // "Amount is invalid"
                                  result.tap_data?.response?.message ||           // "Failed"  
                                  result.tap_data?.gateway?.message ||
                                  result.error ||
                                  result.payment_status || 
                                  'Payment failed'
              
              console.log('[Payment Return] Payment failed detected:', { 
                payment_status: result.payment_status,
                tap_data_status: result.tap_data?.status,
                gateway_message: result.tap_data?.gateway?.response?.message,
                failureReason 
              })
              
              setState(prev => ({
                ...prev,
                status: "failed",
                message: `Payment failed: ${failureReason}`,
                progress: 100,
                error: failureReason
              }))

              setTimeout(() => {
                if (params) {
                  const failureUrl = `/${params.locale}/${params.countryCode}/checkout/payment-failure?cart_id=${cartId}&tap_id=${tapId}&reason=${encodeURIComponent(failureReason)}`
                  console.log('[Payment Return] Redirecting to failure:', failureUrl)
                  router.push(failureUrl)
                }
              }, 3000)

              return true
            }

            // Handle successful response
            if (result.success || result.order || result.is_successful) {
              const isSuccessful = result.is_successful || result.success || (result.order && result.order.status !== 'pending')
              
              if (isSuccessful) {
                setState(prev => ({
                  ...prev,
                  status: "success",
                  progress: 100,
                  message: "Payment verified successfully! Redirecting..."
                }))

                // Clear cart and redirect
                setTimeout(() => {
                  try {
                    localStorage.removeItem(`cart_${cartId}`)
                    sessionStorage.removeItem(`cart_${cartId}`)
                    document.cookie = `cart_id=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`
                  } catch (e) {
                    console.warn("Could not clear cart:", e)
                  }

                  if (params) {
                    const successUrl = `/${params.locale}/${params.countryCode}/checkout/payment-success?cart_id=${cartId}&tap_id=${tapId}`
                    console.log('[Payment Return] Redirecting to success:', successUrl)
                    router.push(successUrl)
                  }
                }, 2000)

                return true
              } else if (result.is_pending || (result.order && result.order.status === 'pending')) {
                // Payment is still pending
                setState(prev => ({
                  ...prev,
                  status: "pending",
                  message: "Payment is being processed...",
                  progress: 60
                }))
                return false // Continue checking
              } else {
                // Payment failed
                setState(prev => ({
                  ...prev,
                  status: "failed",
                  message: `Payment failed: ${result.payment_status || 'Unknown error'}`,
                  progress: 100
                }))

                setTimeout(() => {
                  if (params) {
                    const failureUrl = `/${params.locale}/${params.countryCode}/checkout/payment-failure?cart_id=${cartId}&tap_id=${tapId}&reason=${encodeURIComponent(result.payment_status || 'Payment failed')}`
                    console.log('[Payment Return] Redirecting to failure:', failureUrl)
                    router.push(failureUrl)
                  }
                }, 3000)

                return true
              }
            }
          } else {
            console.warn(`[Payment Return] Method ${methodIndex + 1} failed:`, response.status)
            lastError = new Error(`HTTP ${response.status}`)
          }
        } catch (methodError: any) {
          console.warn(`[Payment Return] Method ${methodIndex + 1} error:`, methodError.message)
          lastError = methodError
        }
      }

      // All methods failed
      throw lastError || new Error("All verification methods failed")

    } catch (error: any) {
      console.error(`[Payment Return] Verification attempt ${attempt} failed:`, error)
      
      setState(prev => ({
        ...prev,
        error: error.message,
        message: `Verification failed: ${error.message}`
      }))

      return false
    }
  }, [cartId, tapId, tapData, params, router])

  // Main verification process with retry logic
  useEffect(() => {
    if (!cartId || !params) return

    // Clean URL first
    const cleanedParams = cleanUrlPath()
    if (cleanedParams) {
      setParams(cleanedParams)
    }

    const runVerification = async () => {
      console.log('[Payment Return] Starting verification process')
      
      // Wait a moment for webhook processing
      await new Promise(resolve => setTimeout(resolve, 2000))

      for (let attempt = 1; attempt <= state.maxAttempts; attempt++) {
        const success = await verifyPayment(attempt)
        
        if (success) {
          return // Payment resolved
        }

        // If not the last attempt, wait before retrying
        if (attempt < state.maxAttempts) {
          const delay = Math.min(2000 * Math.pow(2, attempt - 1), 10000) // Exponential backoff
          console.log(`[Payment Return] Waiting ${delay}ms before retry ${attempt + 1}`)
          
          setState(prev => ({
            ...prev,
            status: "pending",
            message: `Retrying in ${Math.ceil(delay / 1000)} seconds...`
          }))

          await new Promise(resolve => setTimeout(resolve, delay))
        }
      }

      // All attempts failed
      setState(prev => ({
        ...prev,
        status: "error",
        message: "Unable to verify payment after multiple attempts",
        progress: 100
      }))

      // Fallback redirect
      setTimeout(() => {
        if (params) {
          console.log('[Payment Return] Fallback redirect to checkout')
          router.push(`/${params.locale}/${params.countryCode}/checkout`)
        }
      }, 5000)
    }

    runVerification()
  }, [cartId, params, verifyPayment, state.maxAttempts, cleanUrlPath, router])

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

  // Get appropriate icon and styling
  const getIcon = () => {
    switch (state.status) {
      case 'success':
        return <CheckCircle className="h-16 w-16 mx-auto text-green-600 mb-4" />
      case 'failed':
        return <XCircle className="h-16 w-16 mx-auto text-red-600 mb-4" />
      case 'error':
        return <AlertTriangle className="h-16 w-16 mx-auto text-yellow-600 mb-4" />
      case 'pending':
        return <Clock className="h-16 w-16 mx-auto text-yellow-600 mb-4" />
      default:
        return <Loader2 className="h-16 w-16 animate-spin mx-auto text-blue-600 mb-4" />
    }
  }

  const getTitle = () => {
    switch (state.status) {
      case 'success':
        return 'Payment Successful!'
      case 'failed':
        return 'Payment Failed'
      case 'error':
        return 'Verification Error'
      case 'pending':
        return 'Payment Processing'
      default:
        return 'Verifying Payment'
    }
  }

  const getProgressColor = () => {
    switch (state.status) {
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full mx-4">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          {getIcon()}
          
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">
            {getTitle()}
          </h1>
          
          <p className="text-gray-600 mb-6">
            {state.message}
          </p>

          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
            <div 
              className={`h-2 rounded-full transition-all duration-500 ${getProgressColor()}`}
              style={{ width: `${state.progress}%` }}
            />
          </div>

          {/* Status Details */}
          <div className="text-sm text-gray-500 mb-4">
            <p>Attempt {state.attempt} of {state.maxAttempts}</p>
            {cartId && <p className="text-xs mt-1">Cart: {cartId.slice(-8)}</p>}
            {tapId && <p className="text-xs">Tap ID: {tapId.slice(-8)}</p>}
          </div>

          {/* Error Details */}
          {state.error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <p className="text-red-800 text-sm">
                <strong>Error:</strong> {state.error}
              </p>
            </div>
          )}

          {/* Status-specific messages */}
          {state.status === 'success' && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-green-800 text-sm">
                <strong>Success!</strong> Your payment has been processed. You will receive a confirmation email shortly.
              </p>
            </div>
          )}

          {state.status === 'failed' && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800 text-sm">
                <strong>Payment Failed</strong><br />
                {state.error === 'Amount is invalid' && (
                  <>
                    The payment amount is invalid. This could be due to currency conversion issues or minimum amount requirements.
                  </>
                )}
                {state.error !== 'Amount is invalid' && (
                  <>
                    {state.error || 'Your payment could not be processed.'}
                  </>
                )}
                <br /><br />
                You will be redirected to try again with a different payment method.
              </p>
              <button
                onClick={() => params && router.push(`/${params.locale}/${params.countryCode}/checkout`)}
                className="mt-3 bg-red-600 text-white px-4 py-2 rounded text-sm hover:bg-red-700 transition-colors flex items-center justify-center gap-2 mx-auto"
              >
                <ArrowRight className="h-4 w-4" />
                Try Different Payment Method
              </button>
            </div>
          )}

          {state.status === 'error' && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
              <p className="text-yellow-800 text-sm">
                <strong>Verification Issue</strong><br />
                We're having trouble verifying your payment. If your payment was successful, you'll receive a confirmation email.
              </p>
              <button
                onClick={() => window.location.reload()}
                className="mt-3 bg-yellow-600 text-white px-4 py-2 rounded text-sm hover:bg-yellow-700 transition-colors flex items-center justify-center gap-2 mx-auto"
              >
                <RefreshCw className="h-4 w-4" />
                Try Again
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
