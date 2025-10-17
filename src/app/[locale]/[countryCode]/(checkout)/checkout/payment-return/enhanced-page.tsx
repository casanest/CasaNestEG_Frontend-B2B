"use client"

import { useEffect, useState, useCallback, useRef } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Loader2, AlertTriangle, CheckCircle, Clock, RefreshCw, XCircle } from "lucide-react"

type PaymentStatus = "checking" | "verifying" | "success" | "pending" | "failed" | "error" | "timeout"

interface PaymentState {
  status: PaymentStatus
  message: string
  progress: number
  attempt: number
  maxAttempts: number
  timeRemaining: number
  error?: string
  paymentData?: any
}

type Props = {
  params: Promise<{
    locale: string
    countryCode: string
  }>
}

export default function EnhancedPaymentReturnPage(props: Props) {
  const [state, setState] = useState<PaymentState>({
    status: "checking",
    message: "Initializing payment verification...",
    progress: 0,
    attempt: 1,
    maxAttempts: 5,
    timeRemaining: 60, // 60 seconds timeout
  })

  const router = useRouter()
  const searchParams = useSearchParams()
  const timeoutRef = useRef<NodeJS.Timeout>()
  const intervalRef = useRef<NodeJS.Timeout>()
  const paramsRef = useRef<{ locale: string; countryCode: string }>()

  // Initialize params
  useEffect(() => {
    const initParams = async () => {
      const params = await props.params
      paramsRef.current = params
    }
    initParams()
  }, [props.params])

  // Exponential backoff calculation
  const getRetryDelay = useCallback((attempt: number) => {
    return Math.min(1000 * Math.pow(2, attempt - 1), 10000) // Max 10 seconds
  }, [])

  // Enhanced status checking with retry logic
  const checkPaymentStatus = useCallback(async (attempt: number = 1): Promise<boolean> => {
    try {
      const cartId = searchParams.get('cart_id')
      const tapId = searchParams.get('tap_id')

      if (!cartId) {
        throw new Error("Missing cart_id parameter")
      }

      setState(prev => ({
        ...prev,
        status: "verifying",
        message: `Verifying payment... (Attempt ${attempt}/${prev.maxAttempts})`,
        progress: Math.min((attempt / prev.maxAttempts) * 50, 50),
        attempt
      }))

      console.log(`[Enhanced Payment Return] Attempt ${attempt}: Checking status for cart: ${cartId}, tap_id: ${tapId}`)

      // Call the status API with timeout
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 15000) // 15 second timeout

      const statusResponse = await fetch(
        `/api/store/tap/status?cart_id=${cartId}${tapId ? `&charge_id=${tapId}` : ''}`,
        { 
          signal: controller.signal,
          headers: {
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache'
          }
        }
      )

      clearTimeout(timeoutId)

      if (!statusResponse.ok) {
        throw new Error(`Status check failed: ${statusResponse.status} ${statusResponse.statusText}`)
      }

      const statusResult = await statusResponse.json()
      console.log(`[Enhanced Payment Return] Status response:`, statusResult)

      if (statusResult.success) {
        const { is_successful, payment_status, verified_with_tap } = statusResult
        
        setState(prev => ({
          ...prev,
          progress: 75,
          message: `Payment status: ${payment_status}`,
          paymentData: statusResult
        }))

        // Handle successful payments
        if (is_successful || payment_status === "CAPTURED" || payment_status === "AUTHORIZED") {
          setState(prev => ({
            ...prev,
            status: "success",
            progress: 100,
            message: "Payment successful! Redirecting to confirmation..."
          }))

          // Clear cart data
          try {
            localStorage.removeItem(`cart_${cartId}`)
            sessionStorage.removeItem(`cart_${cartId}`)
            document.cookie = `cart_id=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`
          } catch (clearError) {
            console.warn("Could not clear cart:", clearError)
          }

          // Redirect to success page after a brief delay
          setTimeout(() => {
            if (paramsRef.current) {
              const successUrl = `/${paramsRef.current.locale}/${paramsRef.current.countryCode}/checkout/payment-success?cart_id=${cartId}&tap_id=${statusResult.charge_id || tapId}`
              router.push(successUrl)
            }
          }, 2000)

          return true
        }

        // Handle pending payments
        if (payment_status === "PENDING" || payment_status === "INITIATED") {
          setState(prev => ({
            ...prev,
            status: "pending",
            message: "Payment is being processed...",
            progress: 60
          }))
          return false // Continue checking
        }

        // Handle failed payments
        setState(prev => ({
          ...prev,
          status: "failed",
          message: `Payment failed: ${payment_status}`,
          progress: 100,
          error: payment_status
        }))

        setTimeout(() => {
          if (paramsRef.current) {
            const failureUrl = `/${paramsRef.current.locale}/${paramsRef.current.countryCode}/checkout/payment-failure?cart_id=${cartId}&tap_id=${statusResult.charge_id || tapId}&reason=${encodeURIComponent(payment_status)}`
            router.push(failureUrl)
          }
        }, 3000)

        return true
      }

      // Status check failed, but we can retry
      return false

    } catch (error: any) {
      console.error(`[Enhanced Payment Return] Attempt ${attempt} failed:`, error)
      
      if (error.name === 'AbortError') {
        setState(prev => ({
          ...prev,
          message: "Request timed out, retrying...",
          error: "Request timeout"
        }))
      } else {
        setState(prev => ({
          ...prev,
          error: error.message
        }))
      }
      
      return false
    }
  }, [searchParams, router])

  // Main payment verification logic with retry
  const verifyPayment = useCallback(async () => {
    const { maxAttempts } = state

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      const success = await checkPaymentStatus(attempt)
      
      if (success) {
        return // Payment resolved (success or failure)
      }

      // If not the last attempt, wait before retrying
      if (attempt < maxAttempts) {
        const delay = getRetryDelay(attempt)
        setState(prev => ({
          ...prev,
          status: "pending",
          message: `Retrying in ${Math.ceil(delay / 1000)} seconds...`,
          progress: (attempt / maxAttempts) * 40
        }))

        await new Promise(resolve => setTimeout(resolve, delay))
      }
    }

    // All attempts failed
    setState(prev => ({
      ...prev,
      status: "error",
      message: "Unable to verify payment after multiple attempts",
      progress: 100,
      error: "Max retry attempts exceeded"
    }))

    // Fallback redirect after timeout
    setTimeout(() => {
      if (paramsRef.current) {
        router.push(`/${paramsRef.current.locale}/${paramsRef.current.countryCode}/checkout`)
      }
    }, 5000)
  }, [state.maxAttempts, checkPaymentStatus, getRetryDelay, router])

  // Countdown timer
  useEffect(() => {
    if (state.status === "checking" || state.status === "verifying" || state.status === "pending") {
      intervalRef.current = setInterval(() => {
        setState(prev => {
          const newTimeRemaining = prev.timeRemaining - 1
          
          if (newTimeRemaining <= 0) {
            return {
              ...prev,
              status: "timeout",
              message: "Payment verification timed out",
              timeRemaining: 0,
              progress: 100
            }
          }
          
          return {
            ...prev,
            timeRemaining: newTimeRemaining
          }
        })
      }, 1000)
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [state.status])

  // Handle timeout
  useEffect(() => {
    if (state.status === "timeout") {
      setTimeout(() => {
        if (paramsRef.current) {
          router.push(`/${paramsRef.current.locale}/${paramsRef.current.countryCode}/checkout`)
        }
      }, 5000)
    }
  }, [state.status, router])

  // Start verification process
  useEffect(() => {
    // Wait a moment for webhook processing
    timeoutRef.current = setTimeout(() => {
      verifyPayment()
    }, 2000)

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [verifyPayment])

  // Render different states
  const renderContent = () => {
    const { status, message, progress, attempt, maxAttempts, timeRemaining, error } = state

    const getIcon = () => {
      switch (status) {
        case "checking":
        case "verifying":
          return <Loader2 className="h-16 w-16 animate-spin mx-auto text-blue-600 mb-4" />
        case "pending":
          return <Clock className="h-16 w-16 mx-auto text-yellow-600 mb-4" />
        case "success":
          return <CheckCircle className="h-16 w-16 mx-auto text-green-600 mb-4" />
        case "failed":
          return <XCircle className="h-16 w-16 mx-auto text-red-600 mb-4" />
        case "error":
        case "timeout":
          return <AlertTriangle className="h-16 w-16 mx-auto text-yellow-600 mb-4" />
        default:
          return <RefreshCw className="h-16 w-16 animate-spin mx-auto text-gray-600 mb-4" />
      }
    }

    const getTitle = () => {
      switch (status) {
        case "checking":
          return "Initializing Payment Verification"
        case "verifying":
          return "Verifying Your Payment"
        case "pending":
          return "Payment Processing"
        case "success":
          return "Payment Successful!"
        case "failed":
          return "Payment Failed"
        case "error":
          return "Verification Error"
        case "timeout":
          return "Verification Timeout"
        default:
          return "Processing Payment"
      }
    }

    const getProgressColor = () => {
      switch (status) {
        case "success":
          return "bg-green-600"
        case "failed":
          return "bg-red-600"
        case "error":
        case "timeout":
          return "bg-yellow-600"
        default:
          return "bg-blue-600"
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
              {message}
            </p>

            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
              <div 
                className={`h-2 rounded-full transition-all duration-500 ${getProgressColor()}`}
                style={{ width: `${progress}%` }}
              />
            </div>

            {/* Progress Details */}
            <div className="text-sm text-gray-500 mb-4">
              {status === "verifying" && (
                <p>Attempt {attempt} of {maxAttempts}</p>
              )}
              {(status === "checking" || status === "verifying" || status === "pending") && (
                <p>Time remaining: {Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, '0')}</p>
              )}
            </div>

            {/* Error Details */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                <p className="text-red-800 text-sm">
                  <strong>Error:</strong> {error}
                </p>
              </div>
            )}

            {/* Status-specific messages */}
            {status === "success" && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-green-800 text-sm">
                  Your payment has been processed successfully. You will be redirected to your order confirmation shortly.
                </p>
              </div>
            )}

            {status === "failed" && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-800 text-sm">
                  Your payment could not be processed. You will be redirected to try again.
                </p>
              </div>
            )}

            {(status === "error" || status === "timeout") && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-yellow-800 text-sm">
                  <strong>Don't worry!</strong><br />
                  If your payment was successful, you'll receive a confirmation email shortly. 
                  You can also check your order status in your account.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  return renderContent()
}

