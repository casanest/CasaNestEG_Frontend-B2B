"use client"

import type React from "react"
import { RadioGroup } from "@headlessui/react"
import { Text, clx } from "@medusajs/ui"
import { useState, useEffect, useRef, useCallback } from "react"
import { Smartphone, CreditCard, Building2, Shield, Lock, CheckCircle, AlertCircle, RefreshCw } from "lucide-react"

interface PayMobContainerProps {
  paymentProviderId: string
  selectedPaymentOptionId: string
  paymentInfoMap: any
  setError: (error: string | null) => void
  setPaymentComplete: (complete: boolean) => void
  cart: any
  locale: string
}

interface PayMobIframeData {
  success: boolean
  pending: boolean
  transaction_id: string
  order_id: string
  amount_cents: number
  currency: string
  source_data_type?: string
  source_data_sub_type?: string
  error_occured?: boolean
  has_parent_transaction?: boolean
  is_3d_secure?: boolean
  is_auth?: boolean
  is_capture?: boolean
  is_refunded?: boolean
  is_standalone_payment?: boolean
  is_voided?: boolean
  owner?: number
  created_at?: string
  integration_id?: number
  profile_id?: number
}

type PaymentStatus =
  | "idle"
  | "initializing"
  | "iframe_loading"
  | "processing_payment"
  | "verifying"
  | "success"
  | "failed"

export const PayMobContainer = ({
  paymentProviderId,
  selectedPaymentOptionId,
  paymentInfoMap,
  setError,
  setPaymentComplete,
  cart,
  locale,
}: PayMobContainerProps) => {
  // State Management
  const [selectedMethod, setSelectedMethod] = useState<string>("")
  const [phoneNumber, setPhoneNumber] = useState<string>("")
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>("idle")
  const [paymentToken, setPaymentToken] = useState<string>("")
  const [iframeUrl, setIframeUrl] = useState<string>("")
  const [showIframe, setShowIframe] = useState(false)
  const [transactionData, setTransactionData] = useState<PayMobIframeData | null>(null)
  const [debugMessages, setDebugMessages] = useState<string[]>([])
  const [merchantOrderId, setMerchantOrderId] = useState<string>("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [retryCount, setRetryCount] = useState(0)

  // Refs for cleanup and management
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const messageListenerRef = useRef<((event: MessageEvent) => void) | null>(null)
  const timeoutRefs = useRef<Set<NodeJS.Timeout>>(new Set())
  const isComponentMounted = useRef(true)

  // Computed values
  const isSelected = selectedPaymentOptionId === paymentProviderId
  const isRTL = locale === "ar"
  const maxRetries = 3

  // Enhanced debug function with error handling
  const addDebugMessage = useCallback((message: string, level: "info" | "warn" | "error" = "info") => {
    if (!isComponentMounted.current) return

    try {
      const timestamp = new Date().toLocaleTimeString()
      const debugMsg = `${timestamp} [${level.toUpperCase()}]: ${message}`
      console.log(`[PayMob Debug] ${debugMsg}`)

      setDebugMessages((prev) => {
        const newMessages = [...prev.slice(-9), debugMsg]
        return newMessages
      })
    } catch (error) {
      console.error("Debug message error:", error)
    }
  }, [])

  // Enhanced timeout management
  const createTimeout = useCallback((callback: () => void, delay: number): NodeJS.Timeout => {
    const timeoutId = setTimeout(() => {
      if (isComponentMounted.current) {
        callback()
      }
      timeoutRefs.current.delete(timeoutId)
    }, delay)

    timeoutRefs.current.add(timeoutId)
    return timeoutId
  }, [])

  const clearAllTimeouts = useCallback(() => {
    timeoutRefs.current.forEach((timeoutId) => {
      clearTimeout(timeoutId)
    })
    timeoutRefs.current.clear()
  }, [])

  // Enhanced payment result handler with comprehensive error handling
  const handlePaymentResult = useCallback(
    async (data: PayMobIframeData) => {
      if (!isComponentMounted.current || isProcessing) return

      try {
        setIsProcessing(true)
        addDebugMessage(
          `Payment result received: success=${data.success}, pending=${data.pending}, txn_id=${data.transaction_id}`,
        )

        // Validate required data
        if (!data.transaction_id && data.success) {
          addDebugMessage("Missing transaction ID, generating fallback", "warn")
          data.transaction_id = `fallback_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        }

        if (!data.amount_cents && cart?.total) {
          data.amount_cents = Math.round(cart.total * 100)
        }

        if (!data.currency) {
          data.currency = cart?.region?.currency_code?.toUpperCase() || "EGP"
        }

        setTransactionData(data)
        clearAllTimeouts()

        if (data.success && !data.pending) {
          addDebugMessage("Payment successful, starting backend verification")
          setPaymentStatus("verifying")

          try {
            const verificationPayload = {
              cart_id: cart?.id,
              transaction_data: data,
              payment_token: paymentToken,
              merchant_order_id: merchantOrderId,
            }

            // Validate payload before sending
            if (!verificationPayload.cart_id) {
              throw new Error("Missing cart ID for verification")
            }

            if (!verificationPayload.payment_token) {
              throw new Error("Missing payment token for verification")
            }

            addDebugMessage("Sending verification request to backend")
            const verifyResponse = await fetch("/api/payments/paymob/direct-verify", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(verificationPayload),
            })

            if (!verifyResponse.ok) {
              const errorText = await verifyResponse.text()
              let errorData
              try {
                errorData = JSON.parse(errorText)
              } catch {
                errorData = { error: errorText }
              }
              throw new Error(errorData.error || `Verification failed with status ${verifyResponse.status}`)
            }

            const verifyData = await verifyResponse.json()
            addDebugMessage(`Verification response: success=${verifyData.success}`)

            if (verifyData.success) {
              addDebugMessage("Payment verified successfully - transitioning to success state")

              // Ensure clean state transition with proper sequencing
              if (isComponentMounted.current) {
                setPaymentStatus("success")
                setPaymentComplete(true)
                setError(null)
                setRetryCount(0)
                addDebugMessage("Payment completion confirmed")
              }
            } else {
              throw new Error(verifyData.error || "Payment verification failed by backend")
            }
          } catch (verificationError: any) {
            addDebugMessage(`Verification error: ${verificationError.message}`, "error")
            setPaymentStatus("failed")
            setError(
              verificationError.message || (locale === "ar" ? "فشل في التحقق من الدفع" : "Payment verification failed"),
            )
          }
        } else if (!data.success && !data.pending) {
          addDebugMessage("Payment failed by PayMob", "error")
          setPaymentStatus("failed")
          const errorMessage = data.error_occured
            ? locale === "ar"
              ? "فشل الدفع من PayMob"
              : "Payment failed by PayMob"
            : locale === "ar"
              ? "فشل في عملية الدفع"
              : "Payment failed"
          setError(errorMessage)
        } else if (data.pending) {
          addDebugMessage("Payment is pending")
          setPaymentStatus("processing_payment")

          // Set timeout for pending payments
          createTimeout(() => {
            if (paymentStatus === "processing_payment") {
              addDebugMessage("Pending payment timeout", "warn")
              setPaymentStatus("failed")
              setError(locale === "ar" ? "انتهت مهلة معالجة الدفع" : "Payment processing timeout")
            }
          }, 300000) // 5 minutes for pending payments
        }
      } catch (error: any) {
        addDebugMessage(`Error in handlePaymentResult: ${error.message}`, "error")
        setPaymentStatus("failed")
        setError(error.message || (locale === "ar" ? "حدث خطأ في معالجة النتيجة" : "Error processing payment result"))
      } finally {
        setIsProcessing(false)
      }
    },
    [
      cart,
      paymentToken,
      merchantOrderId,
      setPaymentComplete,
      setError,
      locale,
      addDebugMessage,
      clearAllTimeouts,
      createTimeout,
      paymentStatus,
      isProcessing,
    ],
  )

  const handlePaymentError = useCallback(
    (errorData: any) => {
      if (!isComponentMounted.current) return

      try {
        addDebugMessage(`Payment error: ${JSON.stringify(errorData)}`, "error")
        clearAllTimeouts()
        setPaymentStatus("failed")

        const errorMessage =
          errorData?.message ||
          errorData?.error ||
          errorData?.detail ||
          (locale === "ar" ? "حدث خطأ أثناء عملية الدفع" : "An error occurred during payment")

        setError(errorMessage)
      } catch (error) {
        addDebugMessage(`Error in handlePaymentError: ${error}`, "error")
        setError(locale === "ar" ? "حدث خطأ غير متوقع" : "An unexpected error occurred")
      }
    },
    [setError, locale, addDebugMessage, clearAllTimeouts],
  )

  // Enhanced iframe message handler with comprehensive error handling
  const handleIframeMessage = useCallback(
    (event: MessageEvent) => {
      if (!isComponentMounted.current) return

      try {
        // Log all messages for debugging
        const messagePreview =
          typeof event.data === "string" ? event.data.substring(0, 200) : JSON.stringify(event.data).substring(0, 200)

        addDebugMessage(`Message from ${event.origin}: ${messagePreview}`)

        // PayMob domains validation
        const allowedOrigins = [
          "https://accept.paymob.com",
          "https://accept.paymobsolutions.com",
          "https://paymob.com",
          "https://www.paymob.com",
          "https://iframe.paymob.com",
          "https://payment.paymob.com",
        ]

        const isValidOrigin = allowedOrigins.some(
          (origin) =>
            event.origin === origin || event.origin.includes("paymob.com") || event.origin.includes("accept.paymob"),
        )

        if (!isValidOrigin) {
          addDebugMessage(`Invalid origin: ${event.origin}`, "warn")
          return
        }

        let data = event.data

        // Handle string data with proper error handling
        if (typeof data === "string") {
          try {
            data = JSON.parse(data)
          } catch (parseError) {
            // Handle non-JSON string messages
            if (data.includes("success") || data.includes("completed")) {
              addDebugMessage("String success message detected")
              handlePaymentResult({
                success: true,
                pending: false,
                transaction_id: `string_success_${Date.now()}`,
                order_id: merchantOrderId || cart?.id || "",
                amount_cents: Math.round((cart?.total || 0) * 100),
                currency: cart?.region?.currency_code?.toUpperCase() || "EGP",
              })
              return
            }
            addDebugMessage(`Non-JSON string message: ${data}`)
            return
          }
        }

        // Handle different PayMob message formats
        if (data && typeof data === "object") {
          // Direct transaction data (most common format)
          if (data.success !== undefined || data.transaction_id) {
            addDebugMessage("Direct transaction data received")
            handlePaymentResult(data)
            return
          }

          // Wrapped message format
          if (data.type) {
            switch (data.type.toLowerCase()) {
              case "iframe_loaded":
              case "loaded":
              case "ready":
                addDebugMessage("Iframe loaded and ready")
                if (paymentStatus === "iframe_loading") {
                  setPaymentStatus("processing_payment")
                }
                break

              case "payment_processing":
              case "processing":
                addDebugMessage("Payment processing started")
                setPaymentStatus("processing_payment")
                break

              case "payment_result":
              case "result":
              case "transaction_result":
                addDebugMessage("Payment result received")
                const resultData = data.payload || data.data || data.result || data
                handlePaymentResult(resultData)
                break

              case "payment_success":
              case "success":
              case "completed":
                addDebugMessage("Payment success message")
                const successData = data.payload || data.data || { success: true, ...data }

                // Ensure minimum required data
                if (!successData.transaction_id) {
                  successData.transaction_id = `success_${Date.now()}`
                }
                if (!successData.amount_cents) {
                  successData.amount_cents = Math.round((cart?.total || 0) * 100)
                }
                if (!successData.currency) {
                  successData.currency = cart?.region?.currency_code?.toUpperCase() || "EGP"
                }
                if (!successData.order_id) {
                  successData.order_id = merchantOrderId || cart?.id || ""
                }

                handlePaymentResult(successData)
                break

              case "payment_error":
              case "error":
              case "failed":
                addDebugMessage("Payment error message")
                const errorData = data.payload || data.data || data
                handlePaymentError(errorData)
                break

              case "payment_cancelled":
              case "cancelled":
              case "canceled":
                addDebugMessage("Payment cancelled")
                setPaymentStatus("failed")
                setError(locale === "ar" ? "تم إلغاء الدفع" : "Payment cancelled")
                break

              default:
                addDebugMessage(`Unknown message type: ${data.type}`)
            }
          }
          // Handle nested data structures
          else if (data.payload || data.data || data.result) {
            const nestedData = data.payload || data.data || data.result
            addDebugMessage("Nested data structure detected")
            if (nestedData.success !== undefined || nestedData.transaction_id) {
              handlePaymentResult(nestedData)
            }
          }
          // Handle error objects
          else if (data.error || data.error_occured) {
            addDebugMessage("Error object received")
            handlePaymentError(data)
          }
          // Handle URL-based messages (redirects)
          else if (data.url) {
            addDebugMessage(`URL message: ${data.url}`)
            if (data.url.includes("success")) {
              const urlParams = new URLSearchParams(data.url.split("?")[1] || "")
              const transactionId =
                urlParams.get("transaction_id") || urlParams.get("txn_id") || `url_success_${Date.now()}`
              handlePaymentResult({
                success: true,
                pending: false,
                transaction_id: transactionId,
                order_id: merchantOrderId || cart?.id || "",
                amount_cents: Math.round((cart?.total || 0) * 100),
                currency: cart?.region?.currency_code?.toUpperCase() || "EGP",
              })
            } else if (data.url.includes("failure") || data.url.includes("error")) {
              handlePaymentError({ message: "Payment failed" })
            }
          } else {
            addDebugMessage(`Unhandled message format: ${JSON.stringify(data).substring(0, 100)}`)
          }
        }
      } catch (error: any) {
        addDebugMessage(`Error parsing message: ${error.message}`, "error")
        console.error("Error parsing iframe message:", error)
      }
    },
    [handlePaymentResult, handlePaymentError, addDebugMessage, locale, setError, paymentStatus, merchantOrderId, cart],
  )

  // Payment methods configuration
  const payMobMethods = [
    {
      id: "card",
      title: locale === "ar" ? "بطاقة ائتمان/خصم" : "Credit/Debit Card",
      description: locale === "ar" ? "ادفع باستخدام بطاقتك البنكية بأمان" : "Pay securely with your bank card",
      icon: <CreditCard className="w-5 h-5" />,
      features: [
        locale === "ar" ? "حماية ثلاثية الأبعاد" : "3D Secure protection",
        locale === "ar" ? "تشفير SSL" : "SSL encryption",
        locale === "ar" ? "جميع البطاقات مقبولة" : "All major cards accepted",
        locale === "ar" ? "معالجة فورية" : "Instant processing",
      ],
      securityNote:
        locale === "ar"
          ? "بياناتك محمية بأعلى معايير الأمان"
          : "Your data is protected with highest security standards",
    },
    {
      id: "wallet",
      title: locale === "ar" ? "محفظة موبايل" : "Mobile Wallet",
      description:
        locale === "ar" ? "فودافون كاش، اتصالات كاش، أورانج كاش" : "Vodafone Cash, Etisalat Cash, Orange Cash",
      icon: <Smartphone className="w-5 h-5" />,
      features: [
        locale === "ar" ? "دفع سريع وآمن" : "Quick & secure payment",
        locale === "ar" ? "بدون رسوم إضافية" : "No additional fees",
        locale === "ar" ? "تأكيد فوري" : "Instant confirmation",
        locale === "ar" ? "متاح 24/7" : "Available 24/7",
      ],
      securityNote: locale === "ar" ? "محمي بكلمة مرور المحفظة" : "Protected by wallet PIN",
    },
    {
      id: "installments",
      title: locale === "ar" ? "أقساط" : "Installments",
      description: locale === "ar" ? "اقسط مشترياتك على عدة شهور" : "Split your purchase into monthly payments",
      icon: <Building2 className="w-5 h-5" />,
      features: [
        locale === "ar" ? "3، 6، 9، 12 شهر" : "3, 6, 9, 12 months",
        locale === "ar" ? "بدون فوائد إضافية" : "No additional interest",
        locale === "ar" ? "موافقة فورية" : "Instant approval",
        locale === "ar" ? "شروط مرنة" : "Flexible terms",
      ],
      securityNote: locale === "ar" ? "تقييم ائتماني آمن" : "Secure credit assessment",
    },
  ]

  // Phone number validation
  const validatePhoneNumber = useCallback((phone: string) => {
    const egyptianPhoneRegex = /^(\+20|0)?1[0125]\d{8}$/
    return egyptianPhoneRegex.test(phone.replace(/\s/g, ""))
  }, [])

  // Enhanced payment initialization with comprehensive error handling
  const initializePayment = useCallback(
    async (method: string, phone?: string) => {
      if (!isComponentMounted.current || isProcessing) return

      try {
        setIsProcessing(true)
        addDebugMessage(`Initializing payment for method: ${method}`)
        setPaymentStatus("initializing")
        setError(null)
        clearAllTimeouts()

        // Validate cart data
        if (!cart?.id) {
          throw new Error("Cart ID is missing")
        }

        if (!cart?.total || cart.total <= 0) {
          throw new Error("Invalid cart total")
        }

        const paymentData = {
          amount_cents: Math.round(cart.total * 100),
          currency: cart.region?.currency_code?.toUpperCase() || "EGP",
          merchant_order_id: cart.id,
          billing_data: {
            apartment: cart.billing_address?.address_2 || "NA",
            email: cart.email || "customer@example.com",
            floor: cart.billing_address?.address_1?.includes("floor")
              ? cart.billing_address.address_1.split("floor")[1]?.trim()?.split(" ")[0] || "NA"
              : "NA",
            first_name: cart.billing_address?.first_name || "Customer",
            street: cart.billing_address?.address_1 || "NA",
            building: cart.billing_address?.address_1?.includes("building")
              ? cart.billing_address.address_1.split("building")[1]?.trim()?.split(" ")[0] || "NA"
              : "NA",
            phone_number: phone || cart.billing_address?.phone || "+201000000000",
            shipping_method: "NA",
            postal_code: cart.billing_address?.postal_code || "NA",
            city: cart.billing_address?.city || "Cairo",
            country: cart.billing_address?.country_code?.toUpperCase() || "EG",
            last_name: cart.billing_address?.last_name || "Name",
            state: cart.billing_address?.province || "Cairo",
          },
          payment_method: method,
        }

        addDebugMessage("Sending payment initialization request")

        const controller = new AbortController()
        const timeoutId = createTimeout(() => {
          controller.abort()
        }, 30000) // 30 second timeout

        try {
          const response = await fetch("/api/payments/paymob/direct-initiate", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(paymentData),
            signal: controller.signal,
          })

          clearTimeout(timeoutId)
          timeoutRefs.current.delete(timeoutId)

          if (!response.ok) {
            const errorText = await response.text()
            let errorData
            try {
              errorData = JSON.parse(errorText)
            } catch {
              errorData = { error: errorText }
            }
            throw new Error(errorData.error || `Request failed with status ${response.status}`)
          }

          const data = await response.json()
          addDebugMessage(`Initialization response: success=${data.success}`)

          if (data.success && data.payment_token && data.iframe_url) {
            addDebugMessage("Payment initialized successfully, loading iframe")
            setPaymentToken(data.payment_token)
            setIframeUrl(data.iframe_url)
            setMerchantOrderId(data.merchant_order_id || cart.id)
            setShowIframe(true)
            setPaymentStatus("iframe_loading")
          } else {
            throw new Error(data.error || "Failed to initialize payment")
          }
        } catch (fetchError: any) {
          if (fetchError.name === "AbortError") {
            throw new Error(locale === "ar" ? "انتهت مهلة الطلب" : "Request timeout")
          }
          throw fetchError
        }
      } catch (error: any) {
        addDebugMessage(`Initialization error: ${error.message}`, "error")
        setError(error.message || (locale === "ar" ? "فشل في بدء الدفع" : "Payment initialization failed"))
        setPaymentStatus("failed")
      } finally {
        setIsProcessing(false)
      }
    },
    [cart, locale, addDebugMessage, clearAllTimeouts, createTimeout, isProcessing],
  )

  // Enhanced method selection handler
  const handleMethodSelect = useCallback(
    async (method: string) => {
      if (!isComponentMounted.current || isProcessing) return

      try {
        addDebugMessage(`Method selected: ${method}`)
        setSelectedMethod(method)
        setError(null)
        setShowIframe(false)
        setPaymentStatus("idle")
        setTransactionData(null)
        setDebugMessages([])
        setRetryCount(0)
        clearAllTimeouts()

        if (method === "wallet") {
          setPaymentComplete(false)
        } else {
          await initializePayment(method)
        }
      } catch (error: any) {
        addDebugMessage(`Error in method selection: ${error.message}`, "error")
        setError(error.message)
      }
    },
    [addDebugMessage, clearAllTimeouts, initializePayment, setError, setPaymentComplete, isProcessing],
  )

  // Phone number change handler
  const handlePhoneChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const phone = e.target.value
      setPhoneNumber(phone)

      if (selectedMethod === "wallet") {
        if (validatePhoneNumber(phone)) {
          setError(null)
        } else if (phone.length > 0) {
          setError(locale === "ar" ? "رقم الهاتف غير صحيح" : "Invalid phone number")
        }
      }
    },
    [selectedMethod, validatePhoneNumber, setError, locale],
  )

  // Wallet submission handler
  const handleWalletSubmit = useCallback(async () => {
    if (!validatePhoneNumber(phoneNumber)) {
      setError(locale === "ar" ? "رقم الهاتف غير صحيح" : "Invalid phone number")
      return
    }
    await initializePayment("wallet", phoneNumber)
  }, [phoneNumber, validatePhoneNumber, setError, locale, initializePayment])

  // Enhanced retry handler with exponential backoff
  const handleRetryPayment = useCallback(() => {
    if (retryCount >= maxRetries) {
      setError(locale === "ar" ? "تم تجاوز الحد الأقصى للمحاولات" : "Maximum retry attempts exceeded")
      return
    }

    addDebugMessage(`Retrying payment (attempt ${retryCount + 1}/${maxRetries})`)
    setRetryCount((prev) => prev + 1)

    // Exponential backoff delay
    const delay = Math.pow(2, retryCount) * 1000

    createTimeout(() => {
      if (selectedMethod === "wallet" && phoneNumber) {
        initializePayment("wallet", phoneNumber)
      } else if (selectedMethod) {
        initializePayment(selectedMethod)
      }
    }, delay)
  }, [
    retryCount,
    maxRetries,
    locale,
    setError,
    addDebugMessage,
    createTimeout,
    selectedMethod,
    phoneNumber,
    initializePayment,
  ])

  // Enhanced iframe load handler
  const handleIframeLoad = useCallback(() => {
    if (!isComponentMounted.current) return

    addDebugMessage("Iframe onLoad event fired")
    if (paymentStatus === "iframe_loading") {
      // Set a fallback timeout in case PayMob doesn't send ready message
      createTimeout(() => {
        if (paymentStatus === "iframe_loading" && isComponentMounted.current) {
          addDebugMessage("Fallback: Setting status to processing_payment")
          setPaymentStatus("processing_payment")
        }
      }, 5000) // 5 second fallback
    }
  }, [paymentStatus, addDebugMessage, createTimeout])

  // Set up message listener with proper cleanup
  useEffect(() => {
    if (showIframe && isComponentMounted.current) {
      addDebugMessage("Setting up iframe message listener")

      // Remove any existing listener
      if (messageListenerRef.current) {
        window.removeEventListener("message", messageListenerRef.current)
      }

      // Store the listener reference for cleanup
      messageListenerRef.current = handleIframeMessage
      window.addEventListener("message", handleIframeMessage)

      return () => {
        addDebugMessage("Cleaning up iframe message listener")
        if (messageListenerRef.current) {
          window.removeEventListener("message", messageListenerRef.current)
          messageListenerRef.current = null
        }
      }
    }
  }, [showIframe, handleIframeMessage, addDebugMessage])

  // Cleanup on unmount or when not selected
  useEffect(() => {
    if (!isSelected && isComponentMounted.current) {
      addDebugMessage("Payment method deselected, cleaning up")
      setSelectedMethod("")
      setShowIframe(false)
      setPaymentStatus("idle")
      setTransactionData(null)
      setPaymentToken("")
      setIframeUrl("")
      setPhoneNumber("")
      setDebugMessages([])
      setMerchantOrderId("")
      setRetryCount(0)
      setError(null)
      clearAllTimeouts()

      // Clean up message listener
      if (messageListenerRef.current) {
        window.removeEventListener("message", messageListenerRef.current)
        messageListenerRef.current = null
      }
    }
  }, [isSelected, setError, addDebugMessage, clearAllTimeouts])

  // Component unmount cleanup
  useEffect(() => {
    return () => {
      isComponentMounted.current = false
      clearAllTimeouts()
      if (messageListenerRef.current) {
        window.removeEventListener("message", messageListenerRef.current)
      }
    }
  }, [clearAllTimeouts])

  // Status and UI helpers
  const getStatusIcon = () => {
    switch (paymentStatus) {
      case "success":
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case "failed":
        return <AlertCircle className="w-5 h-5 text-red-500" />
      case "initializing":
      case "iframe_loading":
      case "processing_payment":
      case "verifying":
        return <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      default:
        return <Shield className="w-5 h-5 text-blue-500" />
    }
  }

  const getStatusMessage = () => {
    switch (paymentStatus) {
      case "initializing":
        return locale === "ar" ? "جاري التهيئة..." : "Initializing..."
      case "iframe_loading":
        return locale === "ar" ? "جاري تحميل نموذج الدفع..." : "Loading payment form..."
      case "processing_payment":
        return locale === "ar" ? "جاري معالجة الدفع..." : "Processing payment..."
      case "verifying":
        return locale === "ar" ? "جاري التحقق من المعاملة..." : "Verifying transaction..."
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
              <Text className="text-base-regular">{paymentInfoMap[paymentProviderId]?.title || "PayMob"}</Text>
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
          {!showIframe ? (
            <div className="space-y-6">
              <div className="flex items-center gap-2 mb-4">
                <Lock className="w-4 h-4 text-green-600" />
                <Text className="text-sm text-green-700">
                  {locale === "ar" ? "محمي بتشفير SSL وPCI DSS" : "Protected by SSL encryption & PCI DSS"}
                </Text>
              </div>

              <Text className="text-sm text-gray-600 mb-4">
                {locale === "ar" ? "اختر طريقة الدفع المفضلة لديك:" : "Choose your preferred payment method:"}
              </Text>

              <div className="grid gap-3">
                {payMobMethods.map((method) => (
                  <div
                    key={method.id}
                    className={clx("border rounded-lg p-4 cursor-pointer transition-all", {
                      "border-[#043364] bg-blue-50": selectedMethod === method.id,
                      "border-gray-200 hover:border-gray-300": selectedMethod !== method.id,
                      "opacity-50 cursor-not-allowed": isProcessing,
                    })}
                    onClick={() => !isProcessing && handleMethodSelect(method.id)}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={clx("w-4 h-4 rounded-full border-2 flex items-center justify-center mt-1", {
                          "border-[#043364]": selectedMethod === method.id,
                          "border-gray-300": selectedMethod !== method.id,
                        })}
                      >
                        {selectedMethod === method.id && <div className="w-2 h-2 rounded-full bg-[#043364]" />}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          {method.icon}
                          <Text className="font-medium">{method.title}</Text>
                        </div>
                        <Text className="text-sm text-gray-600 mb-2">{method.description}</Text>
                        <div className="space-y-1 mb-2">
                          {method.features.map((feature, index) => (
                            <Text key={index} className="text-xs text-gray-500 flex items-center gap-1">
                              <span className="w-1 h-1 bg-green-500 rounded-full"></span>
                              {feature}
                            </Text>
                          ))}
                        </div>
                        <div className="flex items-center gap-1 text-xs text-green-600">
                          <Shield className="w-3 h-3" />
                          {method.securityNote}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {selectedMethod === "wallet" && (
                <div className="mt-4 space-y-3">
                  <label className="block text-sm font-medium text-gray-700">
                    {locale === "ar" ? "رقم الهاتف" : "Phone Number"}
                  </label>
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={handlePhoneChange}
                    placeholder={locale === "ar" ? "01xxxxxxxxx" : "01xxxxxxxxx"}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#043364] focus:border-transparent disabled:opacity-50"
                    dir={isRTL ? "rtl" : "ltr"}
                    disabled={isProcessing}
                  />
                  <Text className="text-xs text-gray-500">
                    {locale === "ar"
                      ? "أدخل رقم هاتفك المسجل في المحفظة الإلكترونية"
                      : "Enter your mobile wallet registered phone number"}
                  </Text>
                  {phoneNumber && validatePhoneNumber(phoneNumber) && (
                    <button
                      onClick={handleWalletSubmit}
                      disabled={paymentStatus === "initializing" || isProcessing}
                      className="w-full bg-[#043364] text-white py-2 px-4 rounded-md hover:bg-blue-900 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {(paymentStatus === "initializing" || isProcessing) && (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      )}
                      {paymentStatus === "initializing" || isProcessing
                        ? locale === "ar"
                          ? "جاري التحضير..."
                          : "Preparing..."
                        : locale === "ar"
                          ? "متابعة الدفع"
                          : "Continue Payment"}
                    </button>
                  )}
                </div>
              )}

              {paymentStatus === "initializing" && (
                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                    <Text className="text-sm text-blue-800">
                      {locale === "ar" ? "جاري تحضير عملية الدفع الآمنة..." : "Preparing secure payment..."}
                    </Text>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2">
                  {getStatusIcon()}
                  <Text className="font-medium">{getStatusMessage()}</Text>
                </div>
                <Text className="text-sm text-gray-600">
                  {cart?.total && cart?.region?.currency_code
                    ? `${cart.total} ${cart.region.currency_code.toUpperCase()}`
                    : ""}
                </Text>
              </div>

              <div className="relative">
                <div className="border rounded-lg overflow-hidden bg-white shadow-sm">
                  {/* {(paymentStatus === "iframe_loading" ||
                    paymentStatus === "processing_payment" ||
                    paymentStatus === "verifying") && (
                    <div className="absolute inset-0 bg-white bg-opacity-90 flex items-center justify-center z-10">
                      <div className="text-center">
                        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                        <Text className="text-sm text-gray-600 mb-2">{getStatusMessage()}</Text>
                        {paymentStatus === "processing_payment" && (
                          <Text className="text-xs text-gray-500">
                            {locale === "ar" ? "يرجى عدم إغلاق هذه النافذة" : "Please don't close this window"}
                          </Text>
                        )}
                      </div>
                    </div>
                  )} */}
                  {iframeUrl && (
                    <iframe
                      ref={iframeRef}
                      src={iframeUrl}
                      
                      width="100%"
                      height="600"
                      frameBorder="0"
                      title="PayMob Payment"
                      className="w-full"
                      sandbox="allow-scripts allow-same-origin allow-forms allow-top-navigation allow-popups allow-popups-to-escape-sandbox"
                      onLoad={handleIframeLoad}
                      allow="payment"
                    />
                  )}
                </div>
              </div>

              {/* Retry button for failed payments */}
              {paymentStatus === "failed" && retryCount < maxRetries && (
                <div className="flex justify-center">
                  <button
                    onClick={handleRetryPayment}
                    disabled={isProcessing}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
                  >
                    <RefreshCw className="w-4 h-4" />
                    {locale === "ar"
                      ? `إعادة المحاولة (${retryCount}/${maxRetries})`
                      : `Retry Payment (${retryCount}/${maxRetries})`}
                  </button>
                </div>
              )}

              {/* Max retries reached */}
              {paymentStatus === "failed" && retryCount >= maxRetries && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <Text className="text-sm text-red-800">
                    {locale === "ar"
                      ? "تم تجاوز الحد الأقصى للمحاولات. يرجى المحاولة مرة أخرى لاحقاً أو استخدام طريقة دفع أخرى."
                      : "Maximum retry attempts reached. Please try again later or use a different payment method."}
                  </Text>
                </div>
              )}

              {/* Debug information in development */}
              {process.env.NODE_ENV === "development" && debugMessages.length > 0 && (
                <div className="mt-4 p-3 bg-gray-100 rounded-lg">
                  <Text className="text-xs font-medium text-gray-700 mb-2">Debug Messages:</Text>
                  <div className="space-y-1 max-h-32 overflow-y-auto">
                    {debugMessages.map((msg, index) => (
                      <Text key={index} className="text-xs text-gray-600 font-mono">
                        {msg}
                      </Text>
                    ))}
                  </div>
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

              {paymentStatus === "success" && transactionData && (
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                  <Text className="text-sm text-green-800 font-medium mb-2">
                    {locale === "ar" ? "تفاصيل المعاملة" : "Transaction Details"}
                  </Text>
                  <div className="space-y-1 text-xs text-green-700">
                    <div>
                      {locale === "ar" ? "رقم المعاملة:" : "Transaction ID:"} {transactionData.transaction_id}
                    </div>
                    <div>
                      {locale === "ar" ? "المبلغ:" : "Amount:"} {(transactionData.amount_cents / 100).toFixed(2)}{" "}
                      {transactionData.currency}
                    </div>
                    {transactionData.source_data_type && (
                      <div>
                        {locale === "ar" ? "طريقة الدفع:" : "Payment Method:"} {transactionData.source_data_type}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
