import { NextRequest, NextResponse } from 'next/server'

interface PaymentStatusResponse {
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

export async function GET(request: NextRequest) {
  const startTime = Date.now()
  
  try {
    const { searchParams } = new URL(request.url)
    const cartId = searchParams.get('cart_id')
    const chargeId = searchParams.get('charge_id')
    const includeDetails = searchParams.get('include_details') === 'true'

    console.log(`[Enhanced Tap Status] Starting status check for cart: ${cartId}, charge: ${chargeId}`)

    if (!cartId) {
      return NextResponse.json(
        { 
          success: false, 
          error: "Missing cart_id parameter",
          timestamp: new Date().toISOString()
        },
        { status: 400 }
      )
    }

    const backendUrl = process.env.MEDUSA_BACKEND_URL || "http://localhost:9000"
    const publishableKey = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY

    if (!publishableKey) {
      return NextResponse.json(
        { 
          success: false, 
          error: "Publishable API key not configured",
          timestamp: new Date().toISOString()
        },
        { status: 500 }
      )
    }

    // Step 1: Check backend webhook cache first (fastest)
    console.log(`[Enhanced Tap Status] Checking backend webhook cache`)
    
    try {
      const webhookResponse = await fetch(
        `${backendUrl}/store/tap/status?cart_id=${cartId}${chargeId ? `&charge_id=${chargeId}` : ''}`,
        {
          method: "GET",
          headers: {
            "x-publishable-api-key": publishableKey,
            "Content-Type": "application/json",
            "Cache-Control": "no-cache"
          },
          // Add timeout for backend requests
          signal: AbortSignal.timeout(10000) // 10 second timeout
        }
      )

      if (webhookResponse.ok) {
        const webhookResult = await webhookResponse.json()
        
        if (webhookResult.success) {
          console.log(`[Enhanced Tap Status] Found status in webhook cache: ${webhookResult.payment_status}`)
          
          const response: PaymentStatusResponse = {
            success: true,
            payment_status: webhookResult.payment_status,
            cart_id: cartId,
            charge_id: webhookResult.charge_id || chargeId,
            order_id: webhookResult.order_id,
            amount: webhookResult.amount,
            currency: webhookResult.currency,
            timestamp: webhookResult.timestamp,
            is_successful: webhookResult.is_successful || false,
            is_pending: webhookResult.is_pending || false,
            is_failed: webhookResult.is_failed || false,
            verified_with_tap: false,
            verification_attempts: 1,
            last_verification_at: new Date().toISOString(),
            status_summary: {
              success: webhookResult.is_successful || false,
              pending: webhookResult.is_pending || false,
              failed: webhookResult.is_failed || false,
              message: `Payment status from webhook: ${webhookResult.payment_status}`
            }
          }

          if (includeDetails && webhookResult.tap_data) {
            response.tap_data = webhookResult.tap_data
          }

          return NextResponse.json(response)
        }
      } else {
        console.log(`[Enhanced Tap Status] Webhook cache check failed: ${webhookResponse.status}`)
      }
    } catch (webhookError: any) {
      console.warn(`[Enhanced Tap Status] Webhook cache error: ${webhookError.message}`)
    }

    // Step 2: If no webhook data and we have charge_id, verify with Tap directly
    if (chargeId) {
      console.log(`[Enhanced Tap Status] No webhook data, verifying with Tap directly`)
      
      try {
        const tapVerifyResponse = await fetch(
          `${backendUrl}/store/tap/verify?charge_id=${chargeId}`,
          {
            method: 'GET',
            headers: {
              'x-publishable-api-key': publishableKey,
              'Content-Type': 'application/json',
            },
            signal: AbortSignal.timeout(15000) // 15 second timeout for Tap API
          }
        )

        if (tapVerifyResponse.ok) {
          const tapResult = await tapVerifyResponse.json()
          console.log(`[Enhanced Tap Status] Tap verification result: ${tapResult.status}`)
          
          if (tapResult.success) {
            const response: PaymentStatusResponse = {
              success: true,
              payment_status: tapResult.status,
              cart_id: cartId,
              charge_id: chargeId,
              amount: tapResult.amount,
              currency: tapResult.currency,
              timestamp: tapResult.verified_at || new Date().toISOString(),
              is_successful: tapResult.is_successful || false,
              is_pending: tapResult.is_pending || false,
              is_failed: tapResult.is_failed || false,
              verified_with_tap: true,
              verification_attempts: 2,
              last_verification_at: new Date().toISOString(),
              status_summary: {
                success: tapResult.is_successful || false,
                pending: tapResult.is_pending || false,
                failed: tapResult.is_failed || false,
                message: `Payment verified with Tap: ${tapResult.status}`
              }
            }

            if (includeDetails) {
              response.tap_data = tapResult
            }

            return NextResponse.json(response)
          }
        } else {
          console.log(`[Enhanced Tap Status] Tap verification failed: ${tapVerifyResponse.status}`)
        }
      } catch (tapError: any) {
        console.warn(`[Enhanced Tap Status] Tap verification error: ${tapError.message}`)
      }
    }

    // Step 3: Check if order exists for this cart (fallback)
    console.log(`[Enhanced Tap Status] Checking for existing order`)
    
    try {
      const orderResponse = await fetch(
        `${backendUrl}/store/orders?cart_id=${cartId}`,
        {
          method: "GET",
          headers: {
            "x-publishable-api-key": publishableKey,
            "Content-Type": "application/json",
          },
          signal: AbortSignal.timeout(10000)
        }
      )

      if (orderResponse.ok) {
        const orderResult = await orderResponse.json()
        
        if (orderResult.orders && orderResult.orders.length > 0) {
          const order = orderResult.orders[0]
          console.log(`[Enhanced Tap Status] Found existing order: ${order.id}`)
          
          return NextResponse.json({
            success: true,
            payment_status: "COMPLETED",
            cart_id: cartId,
            order_id: order.id,
            amount: order.total,
            currency: order.currency_code,
            timestamp: order.created_at,
            is_successful: true,
            is_pending: false,
            is_failed: false,
            verified_with_tap: false,
            verification_attempts: 3,
            last_verification_at: new Date().toISOString(),
            status_summary: {
              success: true,
              pending: false,
              failed: false,
              message: `Order found: ${order.display_id}`
            }
          })
        }
      }
    } catch (orderError: any) {
      console.warn(`[Enhanced Tap Status] Order check error: ${orderError.message}`)
    }

    // Step 4: No definitive status found - return pending
    console.log(`[Enhanced Tap Status] No definitive status found, returning pending`)
    
    const response: PaymentStatusResponse = {
      success: true,
      payment_status: "PENDING",
      cart_id: cartId,
      charge_id: chargeId,
      timestamp: new Date().toISOString(),
      is_successful: false,
      is_pending: true,
      is_failed: false,
      verified_with_tap: false,
      verification_attempts: chargeId ? 3 : 1,
      last_verification_at: new Date().toISOString(),
      status_summary: {
        success: false,
        pending: true,
        failed: false,
        message: "Payment status pending verification"
      }
    }

    return NextResponse.json(response)

  } catch (error: any) {
    const duration = Date.now() - startTime
    console.error(`[Enhanced Tap Status] Error after ${duration}ms:`, error)
    
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error during status check",
        message: process.env.NODE_ENV === "development" ? error.message : "Status verification failed",
        timestamp: new Date().toISOString(),
        duration_ms: duration
      },
      { status: 500 }
    )
  }
}

