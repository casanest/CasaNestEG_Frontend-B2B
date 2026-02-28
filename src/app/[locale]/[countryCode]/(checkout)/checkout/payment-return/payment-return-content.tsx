"use client"

import { useEffect, useState, useCallback } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Loader2, AlertTriangle, CheckCircle, Clock, RefreshCw, XCircle } from "lucide-react"

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

export type PaymentReturnContentParams = {
  locale: string
  countryCode: string
}

type Props = {
  params: Promise<PaymentReturnContentParams> | PaymentReturnContentParams
}

export default function PaymentReturnContent(props: Props) {
  const [params, setParams] = useState<PaymentReturnContentParams | null>(null)
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
      const resolved = "then" in props.params ? await props.params : props.params
      setParams(resolved)
    }
    initParams()
  }, [props.params])

  const cartId = searchParams.get("cart_id") || ""
  const tapId = searchParams.get("tap_id") || ""
  const tapData = searchParams.get("data") || ""

  const verifyPayment = useCallback(
    async (attempt: number = 1) => {
      try {
        setState((prev) => ({
          ...prev,
          status: "verifying",
          message: `Verifying payment... (Attempt ${attempt}/${prev.maxAttempts})`,
          progress: Math.min((attempt / prev.maxAttempts) * 70, 70),
          attempt,
        }))

        if (!cartId) throw new Error("Missing cart_id parameter")

        const verificationMethods = [
          () =>
            fetch(
              `/api/store/tap/status-enhanced?cart_id=${cartId}${tapId ? `&charge_id=${tapId}` : ""}&include_details=true`
            ),
          () =>
            fetch(`/api/store/tap/status?cart_id=${cartId}${tapId ? `&charge_id=${tapId}` : ""}`),
          () =>
            fetch("/api/payments/tap/complete", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ cart_id: cartId, tap_id: tapId, data: tapData }),
            }),
        ]

        let lastError: Error | null = null

        for (let i = 0; i < verificationMethods.length; i++) {
          try {
            const response = await verificationMethods[i]()
            if (response.ok) {
              const result = await response.json()
              setState((prev) => ({ ...prev, progress: 90, paymentData: result }))

              if (result.success || result.order || result.is_successful) {
                const isSuccessful =
                  result.is_successful ||
                  result.success ||
                  (result.order && result.order.status !== "pending")

                if (isSuccessful) {
                  setState((prev) => ({
                    ...prev,
                    status: "success",
                    progress: 100,
                    message: "Payment verified successfully! Redirecting...",
                  }))
                  setTimeout(() => {
                    try {
                      localStorage.removeItem(`cart_${cartId}`)
                      localStorage.removeItem(`tap_payment_${cartId}`)
                      sessionStorage.removeItem(`cart_${cartId}`)
                      document.cookie = `cart_id=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`
                    } catch {
                      /* noop */
                    }
                    if (params) {
                      router.push(
                        `/${params.locale}/${params.countryCode}/checkout/payment-success?cart_id=${cartId}&tap_id=${tapId}`
                      )
                    }
                  }, 2000)
                  return true
                }
                if (result.is_pending || (result.order && result.order.status === "pending")) {
                  setState((prev) => ({
                    ...prev,
                    status: "pending",
                    message: "Payment is being processed...",
                    progress: 60,
                  }))
                  return false
                }
                setState((prev) => ({
                  ...prev,
                  status: "failed",
                  message: `Payment failed: ${result.payment_status || "Unknown error"}`,
                  progress: 100,
                }))
                setTimeout(() => {
                  if (params) {
                    router.push(
                      `/${params.locale}/${params.countryCode}/checkout/payment-failure?cart_id=${cartId}&tap_id=${tapId}&reason=${encodeURIComponent(result.payment_status || "Payment failed")}`
                    )
                  }
                }, 3000)
                return true
              }
            } else {
              lastError = new Error(`HTTP ${response.status}`)
            }
          } catch (e) {
            lastError = e instanceof Error ? e : new Error(String(e))
          }
        }
        throw lastError || new Error("All verification methods failed")
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error)
        setState((prev) => ({ ...prev, error: message, message: `Verification failed: ${message}` }))
        return false
      }
    },
    [cartId, tapId, tapData, params, router]
  )

  useEffect(() => {
    if (!cartId || !params) return
    const run = async () => {
      await new Promise((r) => setTimeout(r, 2000))
      for (let attempt = 1; attempt <= state.maxAttempts; attempt++) {
        const success = await verifyPayment(attempt)
        if (success) return
        if (attempt < state.maxAttempts) {
          const delay = Math.min(2000 * Math.pow(2, attempt - 1), 10000)
          setState((prev) => ({
            ...prev,
            status: "pending",
            message: `Retrying in ${Math.ceil(delay / 1000)} seconds...`,
          }))
          await new Promise((r) => setTimeout(r, delay))
        }
      }
      setState((prev) => ({
        ...prev,
        status: "error",
        message: "Unable to verify payment after multiple attempts",
        progress: 100,
      }))
      setTimeout(() => {
        if (params) {
          router.push(
            `/${params.locale}/${params.countryCode}/checkout/payment-failure?cart_id=${cartId}&tap_id=${tapId}&reason=${encodeURIComponent("Verification timeout")}`
          )
        }
      }, 5000)
    }
    run()
  }, [cartId, params, verifyPayment, state.maxAttempts, router])

  if (!cartId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full mx-4">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <XCircle className="h-16 w-16 mx-auto text-red-600 mb-4" />
            <h1 className="text-2xl font-semibold text-gray-900 mb-2">Invalid Payment Return</h1>
            <p className="text-gray-600 mb-6">Missing required payment information. Please try again.</p>
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

  const getIcon = () => {
    switch (state.status) {
      case "success":
        return <CheckCircle className="h-16 w-16 mx-auto text-green-600 mb-4" />
      case "failed":
        return <XCircle className="h-16 w-16 mx-auto text-red-600 mb-4" />
      case "error":
        return <AlertTriangle className="h-16 w-16 mx-auto text-yellow-600 mb-4" />
      case "pending":
        return <Clock className="h-16 w-16 mx-auto text-yellow-600 mb-4" />
      default:
        return <Loader2 className="h-16 w-16 animate-spin mx-auto text-blue-600 mb-4" />
    }
  }
  const getTitle = () => {
    switch (state.status) {
      case "success":
        return "Payment Successful!"
      case "failed":
        return "Payment Failed"
      case "error":
        return "Verification Error"
      case "pending":
        return "Payment Processing"
      default:
        return "Verifying Payment"
    }
  }
  const getProgressColor = () => {
    switch (state.status) {
      case "success":
        return "bg-green-600"
      case "failed":
        return "bg-red-600"
      case "error":
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
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">{getTitle()}</h1>
          <p className="text-gray-600 mb-6">{state.message}</p>
          <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
            <div
              className={`h-2 rounded-full transition-all duration-500 ${getProgressColor()}`}
              style={{ width: `${state.progress}%` }}
            />
          </div>
          <div className="text-sm text-gray-500 mb-4">
            <p>
              Attempt {state.attempt} of {state.maxAttempts}
            </p>
            {cartId && <p className="text-xs mt-1">Cart: {cartId.slice(-8)}</p>}
            {tapId && <p className="text-xs">Tap ID: {tapId.slice(-8)}</p>}
          </div>
          {state.error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <p className="text-red-800 text-sm">
                <strong>Error:</strong> {state.error}
              </p>
            </div>
          )}
          {state.status === "success" && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-green-800 text-sm">
                <strong>Success!</strong> Your payment has been processed. You will receive a confirmation email shortly.
              </p>
            </div>
          )}
          {state.status === "failed" && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800 text-sm">
                <strong>Payment Failed</strong>
                <br />
                Your payment could not be processed. You will be redirected to try again.
              </p>
            </div>
          )}
          {state.status === "error" && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
              <p className="text-yellow-800 text-sm">
                <strong>Verification Issue</strong>
                <br />
                We&apos;re having trouble verifying your payment. If your payment was successful, you&apos;ll receive a
                confirmation email.
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
