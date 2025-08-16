import { NextRequest, NextResponse } from "next/server"
import { sdk } from "@lib/config"
import { ensureShippingMethod } from "@lib/util/shipping"

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

    console.log(`[Complete Order] Processing order completion for cart: ${cart_id}, tap_id: ${tap_id}`)

    // Step 1: Check if order already exists for this cart
    console.log(`[Complete Order] Step 1: Checking for existing orders...`)
    try {
      const existingOrders = await sdk.store.order.list()
      
      if (existingOrders.orders && existingOrders.orders.length > 0) {
        // Filter by cart_id manually since the SDK doesn't support it directly
        const existingOrder = existingOrders.orders.find(order => order.cart_id === cart_id)
        
        if (existingOrder) {
          console.log(`[Complete Order] Order already exists:`, {
            order_id: existingOrder.id,
            display_id: existingOrder.display_id,
            status: existingOrder.status
          })

          // Update the existing order with payment information
          await updateOrderPaymentStatus(existingOrder.id, tap_id, payment_status)

          return NextResponse.json({
            success: true,
            message: "Order already exists, payment status updated",
            order: {
              id: existingOrder.id,
              display_id: existingOrder.display_id,
              status: existingOrder.status,
              total: existingOrder.total,
              currency_code: existingOrder.currency_code,
              email: existingOrder.email,
              created_at: existingOrder.created_at,
              payment_status: "PAID",
              metadata: {
                tap_charge_id: tap_id,
                payment_completed_at: new Date().toISOString(),
                payment_method: "tap"
              }
            },
            order_already_existed: true
          })
        }
      }
    } catch (orderCheckError) {
      console.warn(`[Complete Order] Could not check existing orders:`, orderCheckError)
      // Continue with order creation
    }

    // Step 2: Get cart details to verify it's ready for completion
    console.log(`[Complete Order] Step 2: Getting cart details...`)
    let cart
    try {
      cart = await sdk.store.cart.retrieve(cart_id)
      
      console.log(`[Complete Order] Cart retrieved successfully:`, {
        id: cart.cart?.id || cart.id,
        status: cart.cart?.status || cart.status,
        items_count: cart.cart?.items?.length || cart.items?.length || 0,
        total: cart.cart?.total || cart.total,
        payment_status: cart.cart?.payment_status || cart.payment_status,
        completed_at: cart.cart?.completed_at || cart.completed_at
      })
    } catch (cartError: any) {
      console.error(`[Complete Order] Failed to get cart: ${cartError.message}`)
      
      // If cart not found, try to find order by other means
      if (cartError.message?.includes('not found')) {
        console.log(`[Complete Order] Cart not found, trying to find order by payment metadata...`)
        const orderByPayment = await findOrderByPaymentMetadata(tap_id)
        if (orderByPayment) {
          return NextResponse.json({
            success: true,
            message: "Order found by payment metadata",
            order: orderByPayment,
            order_found_by_payment: true
          })
        }
      }
      
      return NextResponse.json({
        success: false,
        error: "Failed to get cart details",
        details: `Cart fetch failed: ${cartError.message}`
      }, { status: 500 })
    }

    // Extract cart data (handle both direct cart and wrapped cart responses)
    const cartData = cart.cart || cart
    const items = cartData.items || []
    const itemsCount = items.length

    console.log(`[Complete Order] Cart items:`, items.map((item: any) => ({
      id: item.id,
      title: item.title,
      quantity: item.quantity,
      unit_price: item.unit_price
    })))

    // Step 3: Check if cart is already completed
    if (cartData.completed_at) {
      console.log(`[Complete Order] Cart already completed, looking for associated order...`)
      
      // Try to find the order that was created from this cart
      const orderByCart = await findOrderByCartId(cart_id)
      if (orderByCart) {
        // Update payment status
        await updateOrderPaymentStatus(orderByCart.id, tap_id, payment_status)
        
        return NextResponse.json({
          success: true,
          message: "Order found from completed cart, payment status updated",
          order: {
            ...orderByCart,
            payment_status: "PAID",
            metadata: {
              ...orderByCart.metadata,
              tap_charge_id: tap_id,
              payment_completed_at: new Date().toISOString(),
              payment_method: "tap"
            }
          },
          order_from_completed_cart: true
        })
      }
    }

    // Step 4: Check if cart has required data for order completion
    if (itemsCount === 0) {
      console.log(`[Complete Order] Cart has no items (itemsCount: ${itemsCount}), trying to restore from backup or find existing order...`)
      
      // Try to find order by payment metadata as fallback
      const orderByPayment = await findOrderByPaymentMetadata(tap_id)
      if (orderByPayment) {
        return NextResponse.json({
          success: true,
          message: "Order found by payment metadata (cart was empty)",
          order: orderByPayment,
          order_found_by_payment_fallback: true
        })
      }
      
      return NextResponse.json({
        success: false,
        error: "Cart has no items and no existing order found",
        details: `Cannot create order from empty cart (itemsCount: ${itemsCount}) and no existing order found`,
        cart_debug: {
          cart_id,
          items_count: itemsCount,
          cart_response: cartData
        },
        suggestions: [
          "Check if order was already created by another process",
          "Verify cart state in Medusa admin",
          "Check payment webhook processing",
          "Verify cart items in backend"
        ]
      }, { status: 400 })
    }

    // Check for shipping address (handle both singular and plural forms)
    const hasShippingAddress = cartData.shipping_address || 
                              (cartData.shipping_addresses && cartData.shipping_addresses.length > 0)
    
    if (!hasShippingAddress) {
      return NextResponse.json({
        success: false,
        error: "Cart has no shipping address",
        details: "Cannot create order without shipping address",
        cart_debug: {
          cart_id,
          shipping_address: cartData.shipping_address,
          shipping_addresses: cartData.shipping_addresses,
          cart_structure: Object.keys(cartData)
        }
      }, { status: 400 })
    }

    // Step 4.5: Force set default shipping method (no user interaction required)
    console.log(`[Complete Order] Step 4.5: Force setting default shipping method...`)
    try {
      const { forceSetDefaultShippingMethod } = await import("@lib/util/shipping")
      const shippingMethodSet = await forceSetDefaultShippingMethod(cart_id)
      if (shippingMethodSet) {
        console.log(`[Complete Order] Successfully set default shipping method for cart: ${cart_id}`)
      } else {
        console.warn(`[Complete Order] Could not set default shipping method for cart: ${cart_id}`)
        // Continue anyway, as the cart completion might still work
      }
    } catch (shippingError: any) {
      console.warn(`[Complete Order] Shipping method setup failed: ${shippingError.message}`)
      // Continue anyway, as the cart completion might still work
    }

    // Step 5: Get or create payment collection and session
    console.log(`[Complete Order] Step 5: Getting or creating payment collection and session...`)
    
    let paymentCollection
    let paymentSession
    
    try {
      // Check if cart already has a payment collection
      if (cartData.payment_collection && cartData.payment_collection.id) {
        paymentCollection = cartData.payment_collection
        console.log(`[Complete Order] Using existing payment collection: ${paymentCollection.id}`)
      } else {
        // Create new payment collection
        console.log(`[Complete Order] Creating new payment collection...`)
        const pcResponse = await sdk.client.fetch(`/store/payment-collections`, {
          method: "POST",
          body: JSON.stringify({
            cart_id: cart_id,
            metadata: {
              tap_charge_id: tap_id,
              payment_status: payment_status || "CAPTURED"
            }
          })
        })

        if (pcResponse.ok) {
          const pcData = await pcResponse.json()
          paymentCollection = pcData.payment_collection
          console.log(`[Complete Order] New payment collection created: ${paymentCollection.id}`)
        } else {
          console.error(`[Complete Order] Failed to create payment collection: ${pcResponse.status}`)
          return NextResponse.json({
            success: false,
            error: "Failed to create payment collection",
            details: "Payment collection creation failed"
          }, { status: 500 })
        }
      }

      // Payment session creation not available in this Medusa version
      console.log(`[Complete Order] Payment session creation not available, proceeding with cart completion...`)

    } catch (paymentError: any) {
      console.error(`[Complete Order] Payment setup error: ${paymentError.message}`)
      return NextResponse.json({
        success: false,
        error: "Payment setup failed",
        details: `Payment setup error: ${paymentError.message}`
      }, { status: 500 })
    }

    // Step 6: Complete the cart using Medusa SDK cart.complete method with payment session
    console.log(`[Complete Order] Step 6: Completing cart using Medusa SDK cart.complete...`)
    
    try {
      // Step 6.1: Force set default shipping method before cart completion (no user interaction required)
      console.log(`[Complete Order] Step 6.1: Force setting default shipping method...`)
      try {
        const { forceSetDefaultShippingMethod } = await import("@lib/util/shipping")
        const shippingMethodSet = await forceSetDefaultShippingMethod(cart_id)
        if (shippingMethodSet) {
          console.log(`[Complete Order] Successfully set default shipping method for cart: ${cart_id}`)
        } else {
          console.warn(`[Complete Order] Could not set default shipping method for cart: ${cart_id}`)
          // Continue anyway, as the cart completion might still work
        }
      } catch (shippingError: any) {
        console.warn(`[Complete Order] Shipping method setup failed: ${shippingError.message}`)
        // Continue anyway, as the cart completion might still work
      }

      // Step 6.2: Complete the cart
      console.log(`[Complete Order] Step 6.2: Completing cart...`)
      const completionResult = await sdk.store.cart.complete(cart_id)

      console.log(`[Complete Order] Cart completion result:`, completionResult)

      // Check the result type to determine success
      if (completionResult.type === "cart" && completionResult.cart) {
        // An error occurred
        console.error(`[Complete Order] Cart completion failed:`, completionResult.error)
        
        return NextResponse.json({
          success: false,
          error: "Cart completion failed",
          details: completionResult.error || "Unknown completion error",
          completion_result: completionResult
        }, { status: 500 })
      } else if (completionResult.type === "order" && completionResult.order) {
        // Order created successfully
        const order = completionResult.order
        
        console.log(`[Complete Order] Order created successfully:`, {
          order_id: order.id,
          display_id: order.display_id,
          status: order.status
        })

        // Update payment status
        if (order.id) {
          await updateOrderPaymentStatus(order.id, tap_id, payment_status)
        }

        return NextResponse.json({
          success: true,
          message: "Order created successfully using Medusa SDK cart.complete with payment collection",
          order: {
            id: order.id,
            display_id: order.display_id,
            status: order.status,
            total: order.total,
            currency_code: order.currency_code,
            email: order.email,
            created_at: order.created_at,
            payment_status: "PAID",
            metadata: {
              tap_charge_id: tap_id,
              payment_completed_at: new Date().toISOString(),
              payment_method: "tap"
            }
          },
          payment_details: {
            payment_collection_id: paymentCollection.id,
            provider_id: "tap"
          },
          method: "medusa_sdk_cart_complete_with_payment_collection",
          completion_result: completionResult
        })
      } else {
        // Unexpected result type
        console.error(`[Complete Order] Unexpected completion result type:`, completionResult)
        
        return NextResponse.json({
          success: false,
          error: "Unexpected completion result",
          details: "Cart completion returned unexpected result type",
          completion_result: completionResult
        }, { status: 500 })
      }

    } catch (completionError: any) {
      console.error(`[Complete Order] Cart completion error: ${completionError.message}`)
      
      return NextResponse.json({
        success: false,
        error: "Cart completion failed",
        details: `Cart completion error: ${completionError.message}`,
        cart_debug: {
          cart_id,
          items_count: itemsCount,
          cart_response: cartData
        }
      }, { status: 500 })
    }

  } catch (error: any) {
    console.error(`[Complete Order] Unexpected error:`, error)
    return NextResponse.json(
      { 
        success: false, 
        error: `Order completion failed: ${error.message}`,
        details: error.stack
      },
      { status: 500 }
    )
  }
}

// Helper function to find order by cart ID
async function findOrderByCartId(cartId: string) {
  try {
    const result = await sdk.store.order.list()
    
    if (result.orders && result.orders.length > 0) {
      // Filter by cart_id manually since the SDK doesn't support it directly
      const orderWithCart = result.orders.find((order: any) => order.cart_id === cartId)
      return orderWithCart || null
    }
  } catch (error) {
    console.warn(`[Complete Order] Error finding order by cart ID:`, error)
  }
  return null
}

// Helper function to find order by payment metadata
async function findOrderByPaymentMetadata(tapId: string) {
  try {
    // Try to find order with Tap payment metadata
    const result = await sdk.store.order.list()
    
    if (result.orders) {
      // Look for order with Tap payment metadata
      const orderWithTap = result.orders.find((order: any) => 
        order.metadata?.tap_charge_id === tapId ||
        order.payment_status === "PAID"
      )
      return orderWithTap || null
    }
  } catch (error) {
    console.warn(`[Complete Order] Error finding order by payment metadata:`, error)
  }
  return null
}

// Helper function to update order payment status
async function updateOrderPaymentStatus(orderId: string, tapId: string, paymentStatus: string) {
  try {
    await sdk.store.order.update(orderId, {
      payment_status: "PAID",
      metadata: {
        tap_charge_id: tapId,
        payment_completed_at: new Date().toISOString(),
        payment_method: "tap",
        original_payment_status: paymentStatus
      }
    })

    console.log(`[Complete Order] Payment status updated successfully for order: ${orderId}`)
    return true
  } catch (updateError) {
    console.warn(`[Complete Order] Payment status update error for order ${orderId}:`, updateError)
    return false
  }
} 