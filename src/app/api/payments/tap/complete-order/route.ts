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

    console.log(`[Complete Order] Processing order completion for cart: ${cart_id}, tap_id: ${tap_id}`)

    const backendUrl = process.env.MEDUSA_BACKEND_URL || 'http://localhost:9000'
    const publishableKey = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY

    if (!publishableKey) {
      console.error('[Complete Order] Publishable API key not configured')
      return NextResponse.json(
        { error: "Publishable API key not configured" },
        { status: 500 }
      )
    }

    console.log(`[Complete Order] Backend URL: ${backendUrl}`)
    console.log(`[Complete Order] Publishable Key: ${publishableKey.substring(0, 20)}...`)

    // Step 1: Check if order already exists for this cart
    console.log(`[Complete Order] Step 1: Checking for existing orders...`)
    try {
      const existingOrdersResponse = await fetch(`${backendUrl}/store/orders?cart_id=${cart_id}`, {
        method: 'GET',
        headers: {
          'x-publishable-api-key': publishableKey,
          'Content-Type': 'application/json',
        }
      })

      console.log(`[Complete Order] Existing orders response status: ${existingOrdersResponse.status}`)

      if (existingOrdersResponse.ok) {
        const existingOrders = await existingOrdersResponse.json()
        console.log(`[Complete Order] Existing orders result:`, existingOrders)
        
        if (existingOrders.orders && existingOrders.orders.length > 0) {
          const existingOrder = existingOrders.orders[0]
          console.log(`[Complete Order] Order already exists:`, {
            order_id: existingOrder.id,
            display_id: existingOrder.display_id,
            status: existingOrder.status
          })

          // Update the existing order with payment information
          await updateOrderPaymentStatus(existingOrder.id, tap_id, payment_status, publishableKey, backendUrl)

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
      } else {
        console.log(`[Complete Order] Existing orders check failed: ${existingOrdersResponse.status}`)
        const errorText = await existingOrdersResponse.text()
        console.log(`[Complete Order] Error details: ${errorText}`)
      }
    } catch (orderCheckError) {
      console.warn(`[Complete Order] Could not check existing orders:`, orderCheckError)
      // Continue with order creation
    }

    // Step 2: Get cart details to verify it's ready for completion
    console.log(`[Complete Order] Step 2: Getting cart details...`)
    const cartResponse = await fetch(`${backendUrl}/store/carts/${cart_id}`, {
      method: 'GET',
      headers: {
        'x-publishable-api-key': publishableKey,
        'Content-Type': 'application/json',
      }
    })

    console.log(`[Complete Order] Cart response status: ${cartResponse.status}`)

    if (!cartResponse.ok) {
      console.error(`[Complete Order] Failed to get cart: ${cartResponse.status}`)
      const errorText = await cartResponse.text()
      console.error(`[Complete Order] Cart error details: ${errorText}`)
      
      // If cart not found, try to find order by other means
      if (cartResponse.status === 404) {
        console.log(`[Complete Order] Cart not found, trying to find order by payment metadata...`)
        const orderByPayment = await findOrderByPaymentMetadata(tap_id, publishableKey, backendUrl)
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
        details: `Cart fetch failed: ${cartResponse.status}`,
        backend_error: errorText
      }, { status: cartResponse.status })
    }

    const cart = await cartResponse.json()
    console.log(`[Complete Order] Cart retrieved successfully:`, {
      id: cart.cart?.id || cart.id,
      status: cart.cart?.status || cart.status,
      items_count: cart.cart?.items?.length || cart.items?.length || 0,
      total: cart.cart?.total || cart.total,
      payment_status: cart.cart?.payment_status || cart.payment_status,
      completed_at: cart.cart?.completed_at || cart.completed_at
    })

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
      const orderByCart = await findOrderByCartId(cart_id, publishableKey, backendUrl)
      if (orderByCart) {
        // Update payment status
        await updateOrderPaymentStatus(orderByCart.id, tap_id, payment_status, publishableKey, backendUrl)
        
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
      const orderByPayment = await findOrderByPaymentMetadata(tap_id, publishableKey, backendUrl)
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
          cart_response: cartData,
          raw_cart: cart
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

    // Check for payment sessions (handle both direct and nested in payment_collection)
    const paymentSessions = cartData.payment_sessions || 
                           cartData.payment_collection?.payment_sessions || []
    
    if (paymentSessions.length === 0) {
      console.log(`[Complete Order] No active payment sessions found, checking if payment is already completed...`)
      
      // Check if this is a completed payment (Tap webhook might have already processed it)
      if (payment_status === "CAPTURED" || payment_status === "AUTHORIZED") {
        console.log(`[Complete Order] Payment already completed (${payment_status}), trying to find existing order...`)
        
        // Try to find existing order by payment metadata
        const orderByPayment = await findOrderByPaymentMetadata(tap_id, publishableKey, backendUrl)
        if (orderByPayment) {
          console.log(`[Complete Order] Found existing order for completed payment`)
          return NextResponse.json({
            success: true,
            message: "Order found for completed payment",
            order: orderByPayment,
            order_found_for_completed_payment: true
          })
        }
        
        // If no order found, we need to create one using the payment collection
        console.log(`[Complete Order] No existing order found, using payment collection approach...`)
        
        try {
          // First, try to update the payment collection status to mark it as paid
          if (cartData.payment_collection?.id) {
            console.log(`[Complete Order] Updating payment collection ${cartData.payment_collection.id} status to paid`)
            
            // Try to authorize the payment collection
            const authorizeResponse = await fetch(`${backendUrl}/store/payment-collections/${cartData.payment_collection.id}/authorize`, {
              method: "POST",
              headers: {
                "x-publishable-api-key": publishableKey,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                amount: cartData.total,
                currency_code: cartData.currency_code
              })
            })

            if (authorizeResponse.ok) {
              console.log(`[Complete Order] Payment collection authorized successfully`)
            } else {
              console.log(`[Complete Order] Payment collection authorization failed: ${authorizeResponse.status}`)
            }
          }
          
          // Now try to complete the cart using the payment collection
          console.log(`[Complete Order] Attempting cart completion with payment collection`)
          const completeResponse = await fetch(`${backendUrl}/store/carts/${cart_id}/complete`, {
            method: 'POST',
            headers: {
              'x-publishable-api-key': publishableKey,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              // Try to use the payment collection ID as payment session ID
              payment_session_id: cartData.payment_collection?.id,
              payment_method: {
                provider_id: "tap",
                data: {
                  tap_charge_id: tap_id,
                  payment_status: payment_status || "CAPTURED",
                  payment_completed: true,
                  payment_collection_id: cartData.payment_collection?.id
                }
              }
            })
          })

          if (completeResponse.ok) {
            const orderResult = await completeResponse.json()
            console.log(`[Complete Order] Order created successfully with payment collection:`, {
              order_id: orderResult.data?.id,
              display_id: orderResult.data?.display_id,
              status: orderResult.data?.status
            })
            
            // Update payment status
            if (orderResult.data?.id) {
              await updateOrderPaymentStatus(orderResult.data.id, tap_id, payment_status, publishableKey, backendUrl)
            }
            
            return NextResponse.json({
              success: true,
              message: "Order created successfully with payment collection",
              order: {
                id: orderResult.data?.id,
                display_id: orderResult.data?.display_id,
                status: orderResult.data?.status,
                total: orderResult.data?.total,
                currency_code: orderResult.data?.currency_code,
                email: orderResult.data?.email,
                created_at: orderResult.data?.created_at,
                payment_status: "PAID",
                metadata: {
                  tap_charge_id: tap_id,
                  payment_completed_at: new Date().toISOString(),
                  payment_method: "tap"
                }
              },
              order_created_with_payment_collection: true
            })
          } else {
            const errorText = await completeResponse.text()
            console.error(`[Complete Order] Cart completion with payment collection failed: ${completeResponse.status} - ${errorText}`)
            
            // If that fails, try without payment session (this will likely fail but worth trying)
            console.log(`[Complete Order] Trying cart completion without payment session as final fallback...`)
            const fallbackResponse = await fetch(`${backendUrl}/store/carts/${cart_id}/complete`, {
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

            if (fallbackResponse.ok) {
              const orderResult = await fallbackResponse.json()
              console.log(`[Complete Order] Order created successfully (fallback):`, {
                order_id: orderResult.data?.id,
                display_id: orderResult.data?.display_id,
                status: orderResult.data?.status
              })
              
              // Update payment status
              if (orderResult.data?.id) {
                await updateOrderPaymentStatus(orderResult.data.id, tap_id, payment_status, publishableKey, backendUrl)
              }
              
              return NextResponse.json({
                success: true,
                message: "Order created successfully (fallback)",
                order: {
                  id: orderResult.data?.id,
                  display_id: orderResult.data?.display_id,
                  status: orderResult.data?.status,
                  total: orderResult.data?.total,
                  currency_code: orderResult.data?.currency_code,
                  email: orderResult.data?.email,
                  created_at: orderResult.data?.created_at,
                  payment_status: "PAID",
                  metadata: {
                    tap_charge_id: tap_id,
                    payment_completed_at: new Date().toISOString(),
                    payment_method: "tap"
                  }
                },
                order_created_fallback: true
              })
            } else {
              const fallbackErrorText = await fallbackResponse.text()
              console.error(`[Complete Order] Cart completion (fallback) failed: ${fallbackResponse.status} - ${fallbackErrorText}`)
              
              return NextResponse.json({
                success: false,
                error: "Cannot create order without payment session",
                details: "Payment is completed but no payment session exists and cart completion failed",
                cart_debug: {
                  cart_id,
                  payment_sessions: paymentSessions,
                  payment_collection: cartData.payment_collection,
                  payment_status: payment_status,
                  cart_structure: Object.keys(cartData)
                },
                suggestions: [
                  "Check if order was already created by webhook",
                  "Verify payment status in Tap dashboard",
                  "Check Medusa admin for existing orders",
                  "Consider using the manual order creation endpoint"
                ]
              }, { status: 400 })
            }
          }
        } catch (completionError: any) {
          console.error(`[Complete Order] Error completing cart: ${completionError.message}`)
          
          return NextResponse.json({
            success: false,
            error: "Error completing cart",
            details: `Cart completion error: ${completionError.message}`,
            cart_debug: {
              cart_id,
              payment_sessions: paymentSessions,
              payment_collection: cartData.payment_collection,
              payment_status: payment_status,
              cart_structure: Object.keys(cartData)
            }
          }, { status: 500 })
        }
      }
      
      return NextResponse.json({
        success: false,
        error: "Cart has no payment session",
        details: "Cannot create order without payment session",
        cart_debug: {
          cart_id,
          payment_sessions: paymentSessions,
          payment_collection: cartData.payment_collection,
          cart_structure: Object.keys(cartData)
        }
      }, { status: 400 })
    }

    // Step 5: Complete the cart to create an order
    console.log(`[Complete Order] Step 3: Completing cart to create order...`)
    console.log(`[Complete Order] Cart has ${itemsCount} items, proceeding with completion...`)
    
    const completeResponse = await fetch(`${backendUrl}/store/carts/${cart_id}/complete`, {
      method: 'POST',
      headers: {
        'x-publishable-api-key': publishableKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        payment_session_id: paymentSessions[0].id,
        payment_method: {
          provider_id: "tap",
          data: {
            tap_charge_id: tap_id,
            payment_status: payment_status || "CAPTURED"
          }
        }
      })
    })

    console.log(`[Complete Order] Cart completion response status: ${completeResponse.status}`)

    if (!completeResponse.ok) {
      const errorText = await completeResponse.text()
      console.error(`[Complete Order] Cart completion failed: ${completeResponse.status} - ${errorText}`)
      
      // Try to find if order was created despite the error
      const orderByCart = await findOrderByCartId(cart_id, publishableKey, backendUrl)
      if (orderByCart) {
        console.log(`[Complete Order] Order found despite completion error, updating payment status...`)
        await updateOrderPaymentStatus(orderByCart.id, tap_id, payment_status, publishableKey, backendUrl)
        
        return NextResponse.json({
          success: true,
          message: "Order found despite completion error, payment status updated",
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
          order_created_despite_error: true
        })
      }
      
      return NextResponse.json({
        success: false,
        error: "Failed to complete cart and create order",
        details: `Cart completion failed: ${completeResponse.status}`,
        backend_error: errorText,
        cart_debug: {
          cart_id,
          items_count: itemsCount,
          cart_response: cartData
        }
      }, { status: completeResponse.status })
    }

    const orderResult = await completeResponse.json()
    console.log(`[Complete Order] Order created successfully:`, {
      order_id: orderResult.data?.id,
      display_id: orderResult.data?.display_id,
      status: orderResult.data?.status,
      total: orderResult.data?.total
    })

    // Step 6: Update payment status if needed
    if (orderResult.data?.id) {
      console.log(`[Complete Order] Step 4: Updating payment status...`)
      await updateOrderPaymentStatus(orderResult.data.id, tap_id, payment_status, publishableKey, backendUrl)
    }

    // Step 7: Clean up cart (optional - Medusa usually handles this)
    console.log(`[Complete Order] Step 5: Cleaning up cart...`)
    try {
      const cleanupResponse = await fetch(`${backendUrl}/store/carts/${cart_id}`, {
        method: 'DELETE',
        headers: {
          'x-publishable-api-key': publishableKey,
          'Content-Type': 'application/json',
        }
      })

      if (cleanupResponse.ok) {
        console.log(`[Complete Order] Cart cleaned up successfully`)
      } else {
        console.warn(`[Complete Order] Cart cleanup failed: ${cleanupResponse.status}`)
      }
    } catch (cleanupError) {
      console.warn(`[Complete Order] Cart cleanup error:`, cleanupError)
      // Non-critical error, continue
    }

    // Return success with order details
    return NextResponse.json({
      success: true,
      message: "Order created successfully",
      order: {
        id: orderResult.data?.id,
        display_id: orderResult.data?.display_id,
        status: orderResult.data?.status,
        total: orderResult.data?.total,
        currency_code: orderResult.data?.currency_code,
        email: orderResult.data?.email,
        created_at: orderResult.data?.created_at,
        payment_status: "PAID",
        metadata: {
          tap_charge_id: tap_id,
          payment_completed_at: new Date().toISOString(),
          payment_method: "tap"
        }
      },
      cart_cleaned: true
    })

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
async function findOrderByCartId(cartId: string, publishableKey: string, backendUrl: string) {
  try {
    const response = await fetch(`${backendUrl}/store/orders?cart_id=${cartId}`, {
      method: 'GET',
      headers: {
        'x-publishable-api-key': publishableKey,
        'Content-Type': 'application/json',
      }
    })

    if (response.ok) {
      const result = await response.json()
      if (result.orders && result.orders.length > 0) {
        return result.orders[0]
      }
    }
  } catch (error) {
    console.warn(`[Complete Order] Error finding order by cart ID:`, error)
  }
  return null
}

// Helper function to find order by payment metadata
async function findOrderByPaymentMetadata(tapId: string, publishableKey: string, backendUrl: string) {
  try {
    // Try to find order with Tap payment metadata
    const response = await fetch(`${backendUrl}/store/orders`, {
      method: 'GET',
      headers: {
        'x-publishable-api-key': publishableKey,
        'Content-Type': 'application/json',
      }
    })

    if (response.ok) {
      const result = await response.json()
      if (result.orders) {
        // Look for order with Tap payment metadata
        const orderWithTap = result.orders.find((order: any) => 
          order.metadata?.tap_charge_id === tapId ||
          order.payment_status === "PAID"
        )
        return orderWithTap || null
      }
    }
  } catch (error) {
    console.warn(`[Complete Order] Error finding order by payment metadata:`, error)
  }
  return null
}

// Helper function to update order payment status
async function updateOrderPaymentStatus(orderId: string, tapId: string, paymentStatus: string, publishableKey: string, backendUrl: string) {
  try {
    const updateResponse = await fetch(`${backendUrl}/store/orders/${orderId}`, {
      method: 'POST',
      headers: {
        'x-publishable-api-key': publishableKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        payment_status: "PAID",
        metadata: {
          tap_charge_id: tapId,
          payment_completed_at: new Date().toISOString(),
          payment_method: "tap",
          original_payment_status: paymentStatus
        }
      })
    })

    if (updateResponse.ok) {
      console.log(`[Complete Order] Payment status updated successfully for order: ${orderId}`)
      return true
    } else {
      console.warn(`[Complete Order] Payment status update failed for order ${orderId}: ${updateResponse.status}`)
      return false
    }
  } catch (updateError) {
    console.warn(`[Complete Order] Payment status update error for order ${orderId}:`, updateError)
    return false
  }
} 