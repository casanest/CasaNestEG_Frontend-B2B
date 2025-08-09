import { NextRequest, NextResponse } from 'next/server'

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

    const backendUrl = process.env.MEDUSA_BACKEND_URL || "http://localhost:9000"
    const publishableKey = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY

    if (!publishableKey) {
      console.error('[Tap Complete] Publishable API key not configured')
      return NextResponse.json(
        { error: "Publishable API key not configured" },
        { status: 500 }
      )
    }

    // Step 1: Check if an order already exists for this cart
    console.log(`[Tap Complete] Checking for existing order for cart: ${cart_id}`)
    
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
          const existingOrder = ordersResult.orders[0]
          console.log(`[Tap Complete] Found existing order: ${existingOrder.id}`)
          
          return NextResponse.json({
            success: true,
            order: existingOrder,
            payment_status: "COMPLETED",
            tap_id: tap_id,
            message: "Order already exists",
          })
        }
      }
    } catch (orderCheckError: any) {
      console.warn(`[Tap Complete] Could not check for existing orders: ${orderCheckError.message}`)
    }

    // Step 2: Try to complete the cart to create an order
    console.log(`[Tap Complete] Attempting to complete cart: ${cart_id}`)
    
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

        return NextResponse.json({
          success: true,
          order: orderResult.order,
          payment_status: "COMPLETED",
          tap_id: tap_id,
          message: "Order completed successfully",
        })
      } else {
        const orderError = await orderResponse.text()
        console.error(`[Tap Complete] Failed to complete order: ${orderResponse.status}`)
        console.error(`[Tap Complete] Order error details: ${orderError}`)
        
        // If we can't complete the order, try to get cart details to show something useful
        try {
          const cartResponse = await fetch(`${backendUrl}/store/carts/${cart_id}`, {
            method: "GET",
            headers: {
              "x-publishable-api-key": publishableKey,
              "Content-Type": "application/json",
            },
          })

          if (cartResponse.ok) {
            const { cart } = await cartResponse.json()
            console.log(`[Tap Complete] Cart found: total=${cart.total}, status=${cart.payment_status}`)
            
            // Return cart information as a fallback
            return NextResponse.json({
              success: true,
              order: {
                id: `temp_${cart_id}`,
                display_id: cart_id.slice(-8),
                email: cart.email || "customer@example.com",
                total: cart.total,
                currency_code: cart.region?.currency_code || "USD",
                status: "pending",
                payment_status: "awaiting",
                created_at: new Date().toISOString(),
              },
              payment_status: "PENDING",
              tap_id: tap_id,
              message: "Payment received, order processing",
            })
          }
        } catch (cartError: any) {
          console.error(`[Tap Complete] Could not retrieve cart: ${cartError.message}`)
        }
        
        return NextResponse.json(
          { error: `Failed to complete order: ${orderResponse.status}. ${orderError}` },
          { status: 400 }
        )
      }
    } catch (orderError: any) {
      console.error(`[Tap Complete] Order completion exception: ${orderError.message}`)
      return NextResponse.json(
        { error: `Order completion failed: ${orderError.message}` },
        { status: 500 }
      )
    }

  } catch (error: any) {
    console.error(`[Tap Complete] General error: ${error.message}`)
    console.error(`[Tap Complete] Error stack: ${error.stack}`)
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    )
  }
} 