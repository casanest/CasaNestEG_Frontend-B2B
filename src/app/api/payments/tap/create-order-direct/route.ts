import { NextRequest, NextResponse } from "next/server"
import { sdk } from "@lib/config"

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

    console.log(`[Create Order Direct] Creating order for cart: ${cart_id}, tap_id: ${tap_id}`)

    // Step 1: Get cart data to validate it's ready for completion
    console.log(`[Create Order Direct] Step 1: Validating cart data...`)
    
    let cart
    try {
      cart = await sdk.store.cart.retrieve(cart_id)
      
      if (!cart) {
        console.error(`[Create Order Direct] Cart not found: ${cart_id}`)
        return NextResponse.json({
          success: false,
          error: "Cart not found",
          details: `Cart with ID ${cart_id} does not exist`
        }, { status: 404 })
      }
      
      console.log(`[Create Order Direct] Cart data retrieved:`, {
        id: cart.cart?.id || cart.id,
        items_count: cart.cart?.items?.length || cart.items?.length || 0,
        total: cart.cart?.total || cart.total,
        email: cart.cart?.email || cart.email,
        currency_code: cart.cart?.currency_code || cart.currency_code
      })
      
    } catch (cartError: any) {
      console.error(`[Create Order Direct] Failed to retrieve cart: ${cartError.message}`)
      return NextResponse.json({
        success: false,
        error: "Failed to retrieve cart data",
        details: cartError.message
      }, { status: 500 })
    }

    // Extract cart data - handle both cart and wrapped cart responses
    const cartData = cart.cart || cart

    // Step 2: Validate cart has required data
    if (!cartData.items || cartData.items.length === 0) {
      console.error(`[Create Order Direct] Cart has no items: ${cart_id}`)
      return NextResponse.json({
        success: false,
        error: "Cart has no items",
        details: "Cannot create order from empty cart"
      }, { status: 400 })
    }

    if (!cartData.shipping_address) {
      console.error(`[Create Order Direct] Cart has no shipping address: ${cart_id}`)
      return NextResponse.json({
        success: false,
        error: "Cart has no shipping address",
        details: "Cannot create order without shipping address"
      }, { status: 400 })
    }

    // If cart already has payment session from backend initiate, skip collection/session creation
    const hasPaymentSessions = (cartData.payment_collection?.payment_sessions?.length ?? 0) > 0
    let paymentCollection = cartData.payment_collection
    let paymentSession = hasPaymentSessions ? cartData.payment_collection?.payment_sessions?.[0] : undefined

    if (hasPaymentSessions) {
      console.log(`[Create Order Direct] Cart already has payment session(s), skipping to cart completion`)
    } else {
    // Step 3: Get or create payment collection
    console.log(`[Create Order Direct] Step 3: Getting or creating payment collection...`)
    
    try {
      // Check if cart already has a payment collection
      if (cartData.payment_collection && cartData.payment_collection.id) {
        paymentCollection = cartData.payment_collection
        console.log(`[Create Order Direct] Using existing payment collection: ${paymentCollection.id}`)
      } else {
        // Create new payment collection
        console.log(`[Create Order Direct] Creating new payment collection...`)
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
          const pcData = await pcResponse.json() as any
          paymentCollection = pcData.payment_collection
          console.log(`[Create Order Direct] New payment collection created: ${paymentCollection.id}`)
        } else {
          const errBody = await pcResponse.text().catch(() => "")
          let errJson: Record<string, unknown> = {}
          try { errJson = errBody ? JSON.parse(errBody) : {} } catch { /* ignore */ }
          console.error(`[Create Order Direct] Failed to create payment collection:`, {
            source: "medusa_store_api",
            step: "payment_collection_creation",
            status: (pcResponse as Response).status,
            statusText: (pcResponse as Response).statusText,
            body: errBody
          })
          return NextResponse.json({
            success: false,
            error: "Failed to create payment collection",
            details: (errJson as any).message || (errJson as any).error || "Payment collection creation failed",
            error_source: "nextjs_api",
            error_step: "payment_collection_creation",
            diagnostics: {
              where: "Next.js API called Medusa store POST /store/payment-collections",
              medusa_status: (pcResponse as Response).status,
              medusa_statusText: (pcResponse as Response).statusText,
              medusa_body: errJson
            }
          }, { status: 500 })
        }
      }
    } catch (pcError: any) {
      const status = pcError?.status ?? pcError?.statusCode
      const cause = pcError?.cause != null ? String(pcError.cause) : undefined
      console.error(`[Create Order Direct] Payment collection error:`, {
        source: "nextjs_api",
        step: "payment_collection_creation",
        message: pcError.message,
        status,
        cause
      })
      return NextResponse.json({
        success: false,
        error: "Payment collection error",
        details: pcError.message,
        error_source: "nextjs_api",
        error_step: "payment_collection_creation",
        diagnostics: {
          where: "Next.js API calling Medusa store (sdk.client.fetch payment-collections)",
          message: pcError.message,
          medusa_status: status,
          cause
        }
      }, { status: 500 })
    }

    // Step 4: Create payment session using sdk.store.payment.initiatePaymentSession
    console.log(`[Create Order Direct] Step 4: Creating payment session...`)
    
    try {
      // Create payment session using the correct method signature with minimal data
      console.log(`[Create Order Direct] Creating payment session for cart: ${cart_id}`)
      
      const sessionResult = await sdk.store.payment.initiatePaymentSession(
        cartData, // First parameter: StoreCart object
        {
          provider_id: "tap"
        }
      )

      console.log(`[Create Order Direct] Payment session result:`, sessionResult)

      // Check for different response structures
      if (sessionResult) {
        console.log(`[Create Order Direct] Session result type:`, typeof sessionResult)
        console.log(`[Create Order Direct] Session result keys:`, Object.keys(sessionResult))
        console.log(`[Create Order Direct] Session result full:`, JSON.stringify(sessionResult, null, 2))
      }

      // Extract payment session from the response
      if (sessionResult && sessionResult.payment_collection && sessionResult.payment_collection.payment_sessions) {
        // The response contains a payment collection with payment sessions
        const sessions = sessionResult.payment_collection.payment_sessions
        if (sessions.length > 0) {
          paymentSession = sessions[0] // Get the first payment session
          console.log(`[Create Order Direct] Payment session extracted from collection: ${paymentSession.id}`)
        } else {
          console.error(`[Create Order Direct] No payment sessions found in collection`)
          return NextResponse.json({
            success: false,
            error: "Failed to create payment session",
            details: "No payment sessions found in collection",
            response: sessionResult
          }, { status: 500 })
        }
      } else if (sessionResult && sessionResult.id) {
        // Direct payment session response
        paymentSession = sessionResult
        console.log(`[Create Order Direct] Payment session created directly: ${paymentSession.id}`)
      } else if (sessionResult && sessionResult.payment_session) {
        // Handle case where response is wrapped in payment_session object
        paymentSession = sessionResult.payment_session
        console.log(`[Create Order Direct] Payment session created from wrapper: ${paymentSession.id}`)
      } else if (sessionResult && sessionResult.session) {
        // Handle case where response is wrapped in session object
        paymentSession = sessionResult.session
        console.log(`[Create Order Direct] Payment session created from session wrapper: ${paymentSession.id}`)
      } else {
        console.error(`[Create Order Direct] Failed to create payment session - unexpected response structure`)
        console.error(`[Create Order Direct] Response:`, sessionResult)
        return NextResponse.json({
          success: false,
          error: "Failed to create payment session",
          details: "Payment session creation returned unexpected response structure",
          response: sessionResult
        }, { status: 500 })
      }
    } catch (sessionError: any) {
      console.error(`[Create Order Direct] Payment session creation error: ${sessionError.message}`)
      return NextResponse.json({
        success: false,
        error: "Payment session creation failed",
        details: sessionError.message
      }, { status: 500 })
    }
    }

    // Step 5: Complete the cart using Medusa SDK cart.complete method with payment session
    console.log(`[Create Order Direct] Step 5: Completing cart using Medusa SDK cart.complete...`)
    
    try {
      // Step 5.1: Force set default shipping method before cart completion (no user interaction required)
      console.log(`[Create Order Direct] Step 5.1: Force setting default shipping method...`)
      try {
        const { forceSetDefaultShippingMethod } = await import("@lib/util/shipping")
        const shippingMethodSet = await forceSetDefaultShippingMethod(cart_id)
        if (shippingMethodSet) {
          console.log(`[Create Order Direct] Successfully set default shipping method for cart: ${cart_id}`)
        } else {
          console.warn(`[Create Order Direct] Could not set default shipping method for cart: ${cart_id}`)
          // Continue anyway, as the cart completion might still work
        }
      } catch (shippingError: any) {
        console.warn(`[Create Order Direct] Shipping method setup failed: ${shippingError.message}`)
        // Continue anyway, as the cart completion might still work
      }

      // Step 5.2: Complete the cart
      console.log(`[Create Order Direct] Step 5.2: Completing cart...`)
      const completionResult = await sdk.store.cart.complete(cart_id)
      if(completionResult.type === "cart"){
        
        localStorage.removeItem("medusa_cart_id");
      }

      console.log(`[Create Order Direct] Cart completion result:`, completionResult)

      // Check the result type to determine success
      if (completionResult.type === "cart" && completionResult.cart) {
        // An error occurred
        console.error(`[Create Order Direct] Cart completion failed:`, completionResult.error)
        
        return NextResponse.json({
          success: false,
          error: "Cart completion failed",
          details: completionResult.error || "Unknown completion error",
          completion_result: completionResult
        }, { status: 500 })
      } else if (completionResult.type === "order" && completionResult.order) {
        // Order created successfully
        const order = completionResult.order
        
        console.log(`[Create Order Direct] Order created successfully:`, {
          order_id: order.id,
          display_id: order.display_id,
          status: order.status
        })

        // Remove cart after successful order creation
        try {
          console.log(`[Create Order Direct] Unbinding cart ID from cookie after successful order creation...`)
          // Import the removeCartId function
          const { removeCartId } = await import("@lib/data/cookies")
          await removeCartId()
          console.log(`[Create Order Direct] Cart ID unbound from cookie successfully`)
        } catch (cartUnbindError: any) {
          console.warn(`[Create Order Direct] Cart ID unbinding warning: ${cartUnbindError.message}`)
          // Don't fail the order creation if cookie removal fails
        }

        return NextResponse.json({
          success: true,
          message: "Order created successfully using Medusa SDK cart.complete with payment session",
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
            payment_session_id: paymentSession.id,
            provider_id: "tap"
          },
          method: "medusa_sdk_cart_complete_with_payment_session",
          completion_result: completionResult,
          notes: [
            "Order created successfully using Medusa SDK cart.complete",
            "Payment collection and session created before cart completion",
            "Cart data validated and processed",
            "Real order data with actual cart information",
            "Cart ID unbound from cookie after successful order creation"
          ],
          technical_details: {
            cart_id: cart_id,
            tap_charge_id: tap_id,
            payment_status: payment_status,
            order_creation_method: "medusa_sdk_cart_complete_with_payment_session",
            sdk_integration: "medusa_store_sdk",
            payment_flow: "tap_payment_with_session",
            cart_data_validation: "passed",
            items_count: cartData.items.length,
            cart_total: cartData.total,
            cart_currency: cartData.currency_code,
            database_saved: true,
            sdk_execution: "successful",
            payment_collection_created: true,
            payment_session_created: true,
            cart_id_unbound_from_cookie: true
          }
        })

      } else {
        // Unexpected result type
        console.error(`[Create Order Direct] Unexpected completion result type:`, completionResult)
        
        return NextResponse.json({
          success: false,
          error: "Unexpected completion result",
          details: "Cart completion returned unexpected result type",
          completion_result: completionResult
        }, { status: 500 })
      }

    } catch (completionError: any) {
      console.error(`[Create Order Direct] Cart completion error: ${completionError.message}`)
      
      return NextResponse.json({
        success: false,
        error: "Cart completion failed",
        details: `Cart completion error: ${completionError.message}`,
        cart_debug: {
          cart_id,
          items_count: cartData.items?.length || 0,
          cart_response: cartData
        },
        payment_debug: {
          payment_collection_id: paymentCollection?.id,
          payment_session_id: paymentSession?.id
        }
      }, { status: 500 })
    }

  } catch (error: any) {
    console.error(`[Create Order Direct] Unexpected error:`, error)
    return NextResponse.json(
      { 
        success: false, 
        error: `Order creation failed: ${error.message}`,
        details: error.stack
      },
      { status: 500 }
    )
  }
} 