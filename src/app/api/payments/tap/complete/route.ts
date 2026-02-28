import { NextRequest, NextResponse } from "next/server"

interface CompletePaymentRequest {
  cart_id: string
  tap_id: string
  data?: string
}

export async function POST(request: NextRequest) {
  try {
    const body: CompletePaymentRequest = await request.json()
    
    const { cart_id, tap_id, data } = body

    console.log(`[Tap Complete] Starting payment completion for cart: ${cart_id}, tap_id: ${tap_id}`)

    // Validate required fields
    if (!cart_id || !tap_id) {
      console.error('[Tap Complete] Missing required fields')
      return NextResponse.json(
        { error: "Missing required fields: cart_id, tap_id" },
        { status: 400 }
      )
    }

    const backendUrl = process.env.MEDUSA_BACKEND_URL || "https://dashboard.casanesteg.com"
    const publishableKey = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY||"pk_6e141f5255b954ef17e5fa2f4ad90fc8c0c274ad4b4f4c51dbfcdbc2d652fc80"

    if (!publishableKey) {
      console.error('[Tap Complete] Publishable API key not configured')
      return NextResponse.json(
        { error: "Publishable API key not configured" },
        { status: 500 }
      )
    }

    // Step 1: Check payment status from backend webhook cache
    console.log(`[Tap Complete] Checking payment status from webhook for cart: ${cart_id}`)
    
    let paymentStatus = null
    try {
      const statusResponse = await fetch(`${backendUrl}/store/tap/status?cart_id=${cart_id}`, {
        method: "GET",
        headers: {
          "x-publishable-api-key": publishableKey,
          "Content-Type": "application/json",
        },
      })

      if (statusResponse.ok) {
        const statusResult = await statusResponse.json()
        paymentStatus = statusResult
        console.log(`[Tap Complete] Payment status: ${statusResult.payment_status}, successful: ${statusResult.is_successful}`)
      } else {
        console.warn(`[Tap Complete] Could not get payment status: ${statusResponse.status}`)
      }
    } catch (statusError: any) {
      console.warn(`[Tap Complete] Could not check payment status: ${statusError.message}`)
    }

    // Step 2: Check if an order already exists for this cart
    console.log(`[Tap Complete] Checking for existing order for cart: ${cart_id}`)
    
    let existingOrder = null
    try {
      const ordersResponse = await fetch(`${backendUrl}/store/orders?cart_id=${cart_id}`, {
        method: "GET",
        headers: {
          "x-publishable-api-key": publishableKey,
          "Content-Type": "application/json",
        },
      })

      if (ordersResponse.ok) {
        const ordersResult = await ordersResponse.json()
        if (ordersResult.orders && ordersResult.orders.length > 0) {
          existingOrder = ordersResult.orders[0]
          console.log(`[Tap Complete] Found existing order: ${existingOrder.id}`)
        }
      }
    } catch (orderCheckError: any) {
      console.warn(`[Tap Complete] Could not check for existing orders: ${orderCheckError.message}`)
    }

    // Step 3: If payment is successful and no order exists, try to complete the cart
    if (paymentStatus?.is_successful && !existingOrder) {
      console.log(`[Tap Complete] Payment successful, attempting to complete cart: ${cart_id}`)
    
    try {
      const orderResponse = await fetch(`${backendUrl}/store/carts/${cart_id}/complete`, {
        method: "POST",
        headers: {
          "x-publishable-api-key": publishableKey,
          "Content-Type": "application/json",
        },
      })

      if (orderResponse.ok) {
        const orderResult = await orderResponse.json()
        console.log(`[Tap Complete] Order completed successfully: id=${orderResult.order?.id}`)
          existingOrder = orderResult.order
      } else {
        const orderError = await orderResponse.text()
        console.error(`[Tap Complete] Failed to complete order: ${orderResponse.status}`)
        console.error(`[Tap Complete] Order error details: ${orderError}`)
        }
      } catch (completeError: any) {
        console.error(`[Tap Complete] Error completing cart: ${completeError.message}`)
      }
    }

    // Step 4: Return appropriate response based on what we found
    if (existingOrder) {
      console.log(`[Tap Complete] Returning existing/completed order: ${existingOrder.id}`)
      
      return NextResponse.json({
        success: true,
        order: existingOrder,
        payment_status: paymentStatus?.payment_status || "COMPLETED",
        tap_id: tap_id,
        message: existingOrder.status === "completed" ? "Order completed successfully" : "Order already exists",
        payment_details: paymentStatus ? {
          status: paymentStatus.payment_status,
          amount: paymentStatus.amount,
          currency: paymentStatus.currency,
          charge_id: paymentStatus.charge_id,
          timestamp: paymentStatus.timestamp,
        } : undefined,
      })
    }

    // Step 5: If we have payment status but no order, return payment info
    if (paymentStatus) {
      console.log(`[Tap Complete] Payment processed but no order yet, returning payment status`)
      
      return NextResponse.json({
        success: true,
        order: {
          id: `pending_${cart_id}`,
          display_id: `PENDING-${cart_id.slice(-6)}`,
          status: "pending",
          payment_status: paymentStatus.payment_status === "CAPTURED" || paymentStatus.payment_status === "AUTHORIZED" ? "paid" : "pending",
          total: paymentStatus.amount,
          currency_code: paymentStatus.currency,
          created_at: paymentStatus.timestamp,
        },
        payment_status: paymentStatus.payment_status === "CAPTURED" || paymentStatus.payment_status === "AUTHORIZED" ? "COMPLETED" : "PENDING",
        tap_id: tap_id,
        message: "Payment received, order processing",
        payment_details: {
          status: paymentStatus.payment_status,
          amount: paymentStatus.amount,
          currency: paymentStatus.currency,
          charge_id: paymentStatus.charge_id,
          timestamp: paymentStatus.timestamp,
        },
      })
    }

    // Step 6: Fallback - try to get cart details
    console.log(`[Tap Complete] No payment status found, getting cart details`)
    
        try {
          const cartResponse = await fetch(`${backendUrl}/store/carts/${cart_id}`, {
            method: "GET",
            headers: {
              "x-publishable-api-key": publishableKey,
              "Content-Type": "application/json",
            },
          })

          if (cartResponse.ok) {
        const cartResult = await cartResponse.json()
        const cart = cartResult.cart
        
        console.log(`[Tap Complete] Cart found: ${cart.id}, status: ${cart.status}`)
        
            return NextResponse.json({
          success: false,
          error: "Payment verification pending",
          cart: cart,
          message: "Payment is being processed. Please wait a moment and try again.",
            })
          }
        } catch (cartError: any) {
          console.error(`[Tap Complete] Could not retrieve cart: ${cartError.message}`)
        }
        
        return NextResponse.json(
      { error: "Could not verify payment or retrieve order information" },
          { status: 400 }
        )
  } catch (error: any) {
    console.error(`[Tap Complete] Unexpected error: ${error.message}`)
    return NextResponse.json(
      { error: `Payment completion failed: ${error.message}` },
      { status: 500 }
    )
  }
} 