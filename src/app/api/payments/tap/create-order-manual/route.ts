import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { cart_id, tap_id, payment_status } = body

    if (!cart_id || !tap_id) {
      return NextResponse.json({
        success: false,
        error: "cart_id and tap_id are required"
      }, { status: 400 })
    }

    console.log(`[Manual Order Creation] Creating order for cart: ${cart_id}, tap_id: ${tap_id}`)

    const backendUrl = process.env.MEDUSA_BACKEND_URL || 'https://dashboard.casanesteg.com'
    const publishableKey = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY||"pk_6e141f5255b954ef17e5fa2f4ad90fc8c0c274ad4b4f4c51dbfcdbc2d652fc80"

    if (!publishableKey) {
      console.error('[Manual Order Creation] Publishable API key not configured')
      return NextResponse.json(
        { error: "Publishable API key not configured" },
        { status: 500 }
      )
    }

    // Step 1: Get cart details
    console.log(`[Manual Order Creation] Step 1: Getting cart details...`)
    const cartResponse = await fetch(`${backendUrl}/store/carts/${cart_id}`, {
      method: 'GET',
      headers: {
        'x-publishable-api-key': publishableKey,
        'Content-Type': 'application/json',
      }
    })

    if (!cartResponse.ok) {
      const errorText = await cartResponse.text()
      console.error(`[Manual Order Creation] Failed to get cart: ${cartResponse.status} - ${errorText}`)
      return NextResponse.json({
        success: false,
        error: "Failed to get cart details",
        details: `Cart fetch failed: ${cartResponse.status}`,
        backend_error: errorText
      }, { status: cartResponse.status })
    }

    const cart = await cartResponse.json()
    const cartData = cart.cart || cart

    console.log(`[Manual Order Creation] Cart retrieved:`, {
      id: cartData.id,
      items_count: cartData.items?.length || 0,
      total: cartData.total,
      email: cartData.email
    })

    // Step 2: Check if cart has required data
    if (!cartData.items || cartData.items.length === 0) {
      return NextResponse.json({
        success: false,
        error: "Cart has no items",
        details: "Cannot create order from empty cart"
      }, { status: 400 })
    }

    if (!cartData.shipping_address && !cartData.shipping_addresses) {
      return NextResponse.json({
        success: false,
        error: "Cart has no shipping address",
        details: "Cannot create order without shipping address"
      }, { status: 400 })
    }

    // Step 3: Create order data structure
    const orderData = {
      cart_id: cartData.id,
      email: cartData.email,
      currency_code: cartData.currency_code,
      region_id: cartData.region_id,
      customer_id: cartData.customer_id,
      billing_address: cartData.billing_address,
      shipping_address: cartData.shipping_address || cartData.shipping_addresses?.[0],
      items: cartData.items.map((item: any) => ({
        variant_id: item.variant_id,
        quantity: item.quantity,
        unit_price: item.unit_price
      })),
      shipping_methods: cartData.shipping_methods || [],
      metadata: {
        tap_charge_id: tap_id,
        payment_status: payment_status || "CAPTURED",
        payment_method: "tap",
        payment_completed_at: new Date().toISOString(),
        original_cart_id: cart_id
      }
    }

    console.log(`[Manual Order Creation] Step 2: Creating order with data:`, orderData)

    // Step 4: Try to create order using Medusa's order creation endpoint
    // Note: This might not work with the store API, but worth trying
    try {
      const orderResponse = await fetch(`${backendUrl}/store/orders`, {
        method: 'POST',
        headers: {
          'x-publishable-api-key': publishableKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData)
      })

      if (orderResponse.ok) {
        const orderResult = await orderResponse.json()
        console.log(`[Manual Order Creation] Order created successfully via store API:`, orderResult)

        return NextResponse.json({
          success: true,
          message: "Order created successfully via store API",
          order: {
            id: orderResult.id,
            display_id: orderResult.display_id,
            status: orderResult.status,
            total: orderResult.total,
            currency_code: orderResult.currency_code,
            email: orderResult.email,
            created_at: orderResult.created_at,
            payment_status: "PAID",
            metadata: orderData.metadata
          },
          method: "store_api"
        })
      } else {
        console.log(`[Manual Order Creation] Store API order creation failed: ${orderResponse.status}`)
        // Continue to manual approach
      }
    } catch (storeApiError) {
      console.log(`[Manual Order Creation] Store API error:`, storeApiError)
      // Continue to manual approach
    }

    // Step 5: Manual order creation approach
    console.log(`[Manual Order Creation] Step 3: Using manual order creation approach...`)
    
    // Since we can't create orders directly, let's try to complete the cart with a dummy payment session
    // or use the payment collection to mark it as paid
    
    // Try to update the payment collection status
    try {
      const updatePaymentResponse = await fetch(`${backendUrl}/store/payment-collections/${cartData.payment_collection?.id}/authorize`, {
        method: 'POST',
        headers: {
          'x-publishable-api-key': publishableKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: cartData.total,
          currency_code: cartData.currency_code
        })
      })

      if (updatePaymentResponse.ok) {
        console.log(`[Manual Order Creation] Payment collection authorized successfully`)
        
        // Now try to complete the cart
        const completeResponse = await fetch(`${backendUrl}/store/carts/${cart_id}/complete`, {
          method: 'POST',
          headers: {
            'x-publishable-api-key': publishableKey,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            payment_method: {
              provider_id: "tap",
              data: {
                tap_charge_id: tap_id,
                payment_status: payment_status || "CAPTURED",
                payment_completed: true
              }
            }
          })
        })

        if (completeResponse.ok) {
          const orderResult = await completeResponse.json()
          console.log(`[Manual Order Creation] Order created successfully via cart completion:`, orderResult)

          return NextResponse.json({
            success: true,
            message: "Order created successfully via cart completion",
            order: {
              id: orderResult.data?.id,
              display_id: orderResult.data?.display_id,
              status: orderResult.data?.status,
              total: orderResult.data?.total,
              currency_code: orderResult.data?.currency_code,
              email: orderResult.data?.email,
              created_at: orderResult.data?.created_at,
              payment_status: "PAID",
              metadata: orderData.metadata
            },
            method: "cart_completion"
          })
        } else {
          const errorText = await completeResponse.text()
          console.error(`[Manual Order Creation] Cart completion failed: ${completeResponse.status} - ${errorText}`)
          
          return NextResponse.json({
            success: false,
            error: "Cart completion failed",
            details: `Cart completion failed: ${completeResponse.status}`,
            backend_error: errorText,
            cart_debug: {
              cart_id,
              payment_collection: cartData.payment_collection,
              total: cartData.total
            }
          }, { status: completeResponse.status })
        }
      } else {
        console.log(`[Manual Order Creation] Payment collection authorization failed: ${updatePaymentResponse.status}`)
      }
    } catch (paymentError) {
      console.log(`[Manual Order Creation] Payment collection error:`, paymentError)
    }

    // Step 6: Final fallback - return cart data for manual order creation
    console.log(`[Manual Order Creation] All automated methods failed, returning cart data for manual processing`)
    
    return NextResponse.json({
      success: false,
      error: "Automated order creation failed",
      details: "All methods to create order automatically failed",
      cart_data: {
        id: cartData.id,
        email: cartData.email,
        total: cartData.total,
        currency_code: cartData.currency_code,
        items: cartData.items,
        shipping_address: cartData.shipping_address,
        billing_address: cartData.billing_address
      },
      suggestions: [
        "Create order manually in Medusa admin",
        "Check if webhook processed the payment",
        "Verify cart state and payment collection",
        "Consider recreating the cart with payment session"
      ],
      manual_order_data: orderData
    }, { status: 400 })

  } catch (error: any) {
    console.error(`[Manual Order Creation] Unexpected error:`, error)
    return NextResponse.json(
      { 
        success: false, 
        error: `Manual order creation failed: ${error.message}`,
        details: error.stack
      },
      { status: 500 }
    )
  }
} 