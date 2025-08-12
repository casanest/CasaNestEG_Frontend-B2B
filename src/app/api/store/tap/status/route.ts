import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const cartId = searchParams.get('cart_id')
    const chargeId = searchParams.get('charge_id')

    if (!cartId && !chargeId) {
      return NextResponse.json({
        success: false,
        error: "Either cart_id or charge_id is required"
      }, { status: 400 })
    }

    console.log(`[Frontend Tap Status] Checking status for cart: ${cartId}, charge: ${chargeId}`)

    // Call the backend endpoint
    const backendUrl = process.env.MEDUSA_BACKEND_URL || 'http://localhost:9000'
    const publishableKey = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY

    if (!publishableKey) {
      console.error('[Frontend Tap Status] Publishable API key not configured')
      return NextResponse.json(
        { error: "Publishable API key not configured" },
        { status: 500 }
      )
    }

    // First, try to get payment status from backend webhook cache
    const statusResponse = await fetch(`${backendUrl}/store/tap/status?cart_id=${cartId || ''}&charge_id=${chargeId || ''}`, {
      method: 'GET',
      headers: {
        'x-publishable-api-key': publishableKey,
        'Content-Type': 'application/json',
      }
    })

    if (statusResponse.ok) {
      const statusResult = await statusResponse.json()
      console.log(`[Frontend Tap Status] Backend status:`, statusResult)
      
      return NextResponse.json(statusResult)
    }

    // If backend doesn't have status, try to verify with Tap directly
    if (chargeId) {
      console.log(`[Frontend Tap Status] Backend has no status, trying to verify with Tap directly`)
      
      try {
        // Call the backend Tap verification endpoint
        const tapVerifyResponse = await fetch(`${backendUrl}/store/tap/verify?charge_id=${chargeId}`, {
          method: 'GET',
          headers: {
            'x-publishable-api-key': publishableKey,
            'Content-Type': 'application/json',
          }
        })

        if (tapVerifyResponse.ok) {
          const tapResult = await tapVerifyResponse.json()
          console.log(`[Frontend Tap Status] Tap verification result:`, tapResult)
          
          // If Tap verification successful, return the result
          if (tapResult.success) {
            return NextResponse.json({
              success: true,
              payment_status: tapResult.status,
              cart_id: cartId,
              charge_id: chargeId,
              amount: tapResult.amount,
              currency: tapResult.currency,
              order_id: undefined,
              timestamp: tapResult.verified_at,
              is_successful: tapResult.is_successful,
              is_pending: tapResult.is_pending,
              is_failed: tapResult.is_failed,
              status_summary: {
                success: tapResult.is_successful,
                pending: tapResult.is_pending,
                failed: tapResult.is_failed,
                message: `Payment verified with Tap: ${tapResult.status}`,
              },
              verified_with_tap: true,
              tap_data: tapResult
            })
          }
        }

        // If Tap verification failed, return pending status
        console.log(`[Frontend Tap Status] Tap verification failed, returning pending status`)
        return NextResponse.json({
          success: true,
          payment_status: "PENDING",
          cart_id: cartId,
          charge_id: chargeId,
          amount: 0,
          currency: "USD",
          order_id: undefined,
          timestamp: new Date().toISOString(),
          is_successful: false,
          is_pending: true,
          is_failed: false,
          status_summary: {
            success: false,
            pending: true,
            failed: false,
            message: "Payment verification pending - webhook processing",
          },
          note: "Payment status not yet available. Please wait for webhook processing or check again in a few moments."
        })
      } catch (tapError: any) {
        console.error(`[Frontend Tap Status] Tap verification error:`, tapError)
        
        return NextResponse.json({
          success: false,
          error: "Could not verify payment status",
          message: "Payment verification failed. Please try again or contact support.",
          debug_info: {
            cart_id: cartId,
            charge_id: chargeId,
            error: tapError.message
          }
        }, { status: 500 })
      }
    }

    // Fallback response
    return NextResponse.json({
      success: false,
      error: "Payment status not found",
      message: "No payment information available for this cart/charge ID.",
      debug_info: {
        cart_id: cartId,
        charge_id: chargeId,
        searched_at: new Date().toISOString()
      }
    }, { status: 404 })

  } catch (error: any) {
    console.error(`[Frontend Tap Status] Unexpected error:`, error)
    return NextResponse.json(
      { error: `Payment status check failed: ${error.message}` },
      { status: 500 }
    )
  }
} 