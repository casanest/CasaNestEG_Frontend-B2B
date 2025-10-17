"use client"

import { useState, useEffect, useCallback, useRef } from 'react'

export interface PaymentStatusData {
  success: boolean
  payment_status: string
  cart_id: string
  charge_id?: string
  order_id?: string
  amount?: number
  currency?: string
  timestamp?: string
  is_successful: boolean
  is_pending: boolean
  is_failed: boolean
  verified_with_tap: boolean
  verification_attempts: number
  last_verification_at: string
  status_summary: {
    success: boolean
    pending: boolean
    failed: boolean
    message: string
  }
  tap_data?: any
  error?: string
}

export interface PaymentStatusState {
  data: PaymentStatusData | null
  loading: boolean
  error: string | null
  attempt: number
  maxAttempts: number
  nextRetryIn: number
  isRetrying: boolean
}

export interface UsePaymentStatusOptions {
  cartId: string
  chargeId?: string
  maxAttempts?: number
  initialDelay?: number
  maxDelay?: number
  timeout?: number
  onSuccess?: (data: PaymentStatusData) => void
  onFailure?: (data: PaymentStatusData) => void
  onError?: (error: string) => void
  onTimeout?: () => void
}

export function usePaymentStatus({
  cartId,
  chargeId,
  maxAttempts = 5,
  initialDelay = 2000,
  maxDelay = 30000,
  timeout = 120000, // 2 minutes
  onSuccess,
  onFailure,
  onError,
  onTimeout
}: UsePaymentStatusOptions) {
  const [state, setState] = useState<PaymentStatusState>({
    data: null,
    loading: false,
    error: null,
    attempt: 0,
    maxAttempts,
    nextRetryIn: 0,
    isRetrying: false
  })

  const timeoutRef = useRef<NodeJS.Timeout>()
  const retryTimeoutRef = useRef<NodeJS.Timeout>()
  const countdownRef = useRef<NodeJS.Timeout>()
  const abortControllerRef = useRef<AbortController>()
  const startTimeRef = useRef<number>()

  // Calculate exponential backoff delay
  const getRetryDelay = useCallback((attempt: number) => {
    const delay = Math.min(initialDelay * Math.pow(2, attempt - 1), maxDelay)
    // Add jitter to prevent thundering herd
    const jitter = Math.random() * 0.3 * delay
    return Math.floor(delay + jitter)
  }, [initialDelay, maxDelay])

  // Check payment status
  const checkStatus = useCallback(async (attempt: number): Promise<PaymentStatusData | null> => {
    try {
      // Create new abort controller for this request
      abortControllerRef.current = new AbortController()
      
      const response = await fetch(
        `/api/store/tap/status-enhanced?cart_id=${cartId}${chargeId ? `&charge_id=${chargeId}` : ''}&include_details=true`,
        {
          method: 'GET',
          headers: {
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache'
          },
          signal: abortControllerRef.current.signal
        }
      )

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const data: PaymentStatusData = await response.json()
      
      console.log(`[usePaymentStatus] Attempt ${attempt} result:`, {
        status: data.payment_status,
        successful: data.is_successful,
        pending: data.is_pending,
        failed: data.is_failed
      })

      return data
    } catch (error: any) {
      if (error.name === 'AbortError') {
        console.log(`[usePaymentStatus] Request aborted for attempt ${attempt}`)
        return null
      }
      
      console.error(`[usePaymentStatus] Attempt ${attempt} failed:`, error)
      throw error
    }
  }, [cartId, chargeId])

  // Start countdown for next retry
  const startCountdown = useCallback((seconds: number) => {
    setState(prev => ({ ...prev, nextRetryIn: seconds, isRetrying: true }))
    
    const countdown = () => {
      setState(prev => {
        if (prev.nextRetryIn <= 1) {
          return { ...prev, nextRetryIn: 0, isRetrying: false }
        }
        return { ...prev, nextRetryIn: prev.nextRetryIn - 1 }
      })
    }

    // Update countdown every second
    countdownRef.current = setInterval(countdown, 1000)
    
    // Clear countdown when done
    setTimeout(() => {
      if (countdownRef.current) {
        clearInterval(countdownRef.current)
      }
    }, seconds * 1000)
  }, [])

  // Main verification function with retry logic
  const verifyPayment = useCallback(async () => {
    if (!cartId) {
      setState(prev => ({ ...prev, error: 'Cart ID is required', loading: false }))
      return
    }

    startTimeRef.current = Date.now()
    setState(prev => ({ 
      ...prev, 
      loading: true, 
      error: null, 
      attempt: 0,
      isRetrying: false,
      nextRetryIn: 0
    }))

    // Set overall timeout
    timeoutRef.current = setTimeout(() => {
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        error: 'Payment verification timed out',
        isRetrying: false
      }))
      
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
      
      onTimeout?.()
    }, timeout)

    // Retry loop
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        setState(prev => ({ ...prev, attempt, loading: true }))
        
        const data = await checkStatus(attempt)
        
        if (data) {
          setState(prev => ({ 
            ...prev, 
            data, 
            loading: false, 
            error: null,
            isRetrying: false,
            nextRetryIn: 0
          }))

          // Clear timeout since we got a response
          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current)
          }

          // Handle different payment states
          if (data.is_successful) {
            console.log(`[usePaymentStatus] Payment successful: ${data.payment_status}`)
            onSuccess?.(data)
            return
          }
          
          if (data.is_failed) {
            console.log(`[usePaymentStatus] Payment failed: ${data.payment_status}`)
            onFailure?.(data)
            return
          }
          
          // If pending and not the last attempt, continue retrying
          if (data.is_pending && attempt < maxAttempts) {
            const delay = getRetryDelay(attempt)
            console.log(`[usePaymentStatus] Payment pending, retrying in ${delay}ms`)
            
            startCountdown(Math.ceil(delay / 1000))
            
            await new Promise(resolve => {
              retryTimeoutRef.current = setTimeout(resolve, delay)
            })
            
            continue
          }
          
          // If we reach here, payment is still pending after all attempts
          if (data.is_pending) {
            console.log(`[usePaymentStatus] Payment still pending after ${maxAttempts} attempts`)
            setState(prev => ({ 
              ...prev, 
              loading: false,
              error: 'Payment verification incomplete - please check your account or contact support'
            }))
            return
          }
        }
        
      } catch (error: any) {
        console.error(`[usePaymentStatus] Attempt ${attempt} error:`, error)
        
        setState(prev => ({ 
          ...prev, 
          error: error.message,
          loading: attempt >= maxAttempts
        }))
        
        // If not the last attempt, wait before retrying
        if (attempt < maxAttempts) {
          const delay = getRetryDelay(attempt)
          startCountdown(Math.ceil(delay / 1000))
          
          await new Promise(resolve => {
            retryTimeoutRef.current = setTimeout(resolve, delay)
          })
        }
      }
    }

    // All attempts exhausted
    setState(prev => ({ 
      ...prev, 
      loading: false,
      error: 'Unable to verify payment status after multiple attempts',
      isRetrying: false
    }))
    
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    
    onError?.('Max retry attempts exceeded')
  }, [
    cartId, 
    chargeId, 
    maxAttempts, 
    timeout, 
    checkStatus, 
    getRetryDelay, 
    startCountdown,
    onSuccess, 
    onFailure, 
    onError, 
    onTimeout
  ])

  // Cleanup function
  const cleanup = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current)
    }
    if (countdownRef.current) {
      clearInterval(countdownRef.current)
    }
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }
  }, [])

  // Manual retry function
  const retry = useCallback(() => {
    cleanup()
    verifyPayment()
  }, [cleanup, verifyPayment])

  // Cancel function
  const cancel = useCallback(() => {
    cleanup()
    setState(prev => ({ 
      ...prev, 
      loading: false, 
      isRetrying: false,
      nextRetryIn: 0,
      error: 'Verification cancelled'
    }))
  }, [cleanup])

  // Cleanup on unmount
  useEffect(() => {
    return cleanup
  }, [cleanup])

  return {
    ...state,
    verifyPayment,
    retry,
    cancel,
    isActive: state.loading || state.isRetrying,
    progress: state.maxAttempts > 0 ? (state.attempt / state.maxAttempts) * 100 : 0,
    elapsedTime: startTimeRef.current ? Date.now() - startTimeRef.current : 0
  }
}

