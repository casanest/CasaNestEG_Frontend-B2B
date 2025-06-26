import { type NextRequest, NextResponse } from "next/server"
import { v4 as uuidv4 } from "uuid"

const PAYMOB_API_KEY = process.env.PAYMOB_API_KEY
const PAYMOB_BASE_URL = process.env.PAYMOB_BASE_URL || "https://accept.paymob.com/api"

// In-memory session store (use Redis or database in production)
const paymentSessions = new Map()

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { cart_id, payment_method, phone_number, amount, currency } = body

    console.log("Hybrid Payment Flow - Setting up payment:", {
      cart_id,
      payment_method,
      amount,
      currency,
    })

    // Generate unique session ID
    const sessionId = uuidv4()

    // Step 1: Get authentication token from PayMob
    const authResponse = await fetch(`${PAYMOB_BASE_URL}/auth/tokens`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        api_key: PAYMOB_API_KEY,
      }),
    })

    if (!authResponse.ok) {
      throw new Error("Failed to authenticate with PayMob")
    }

    const authData = await authResponse.json()
    const authToken = authData.token

    // Step 2: Pre-create order for faster processing (corrected)
    const orderResponse = await fetch(`${PAYMOB_BASE_URL}/ecommerce/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        auth_token: authToken,
        delivery_needed: false,
        amount_cents: Math.round(amount * 100),
        currency: currency.toUpperCase(),
        merchant_order_id: cart_id,
        items: [],
        // Remove integration_id and other fields that don't belong here
      }),
    })

    if (!orderResponse.ok) {
      throw new Error("Failed to create PayMob order")
    }

    const orderData = await orderResponse.json()
    const orderId = orderData.id

    // Step 3: Prepare payment configuration
    const paymentConfig = {
      auth_token: authToken,
      order_id: orderId,
      amount_cents: Math.round(amount * 100),
      currency: currency.toUpperCase(),
      payment_method: payment_method,
      phone_number: phone_number,
      expires_at: new Date(Date.now() + 3600 * 1000).toISOString(),
    }

    // Store session data
    const sessionData = {
      session_id: sessionId,
      cart_id,
      payment_method,
      phone_number,
      amount,
      currency,
      paymob_order_id: orderId,
      auth_token: authToken,
      payment_config: paymentConfig,
      status: "setup_complete",
      created_at: new Date().toISOString(),
      expires_at: paymentConfig.expires_at,
    }

    paymentSessions.set(sessionId, sessionData)

    console.log("Hybrid Payment Flow - Setup completed:", {
      session_id: sessionId,
      cart_id,
      order_id: orderId,
    })

    return NextResponse.json({
      success: true,
      session_id: sessionId,
      payment_config: {
        order_id: orderId,
        amount_cents: Math.round(amount * 100),
        currency: currency.toUpperCase(),
        payment_method: payment_method,
        expires_at: paymentConfig.expires_at,
      },
      flow_type: "hybrid",
      message: "Hybrid payment setup completed",
    })
  } catch (error: any) {
    console.error("Hybrid Payment Flow - Setup error:", error)
    return NextResponse.json(
      {
        error: error.message || "Hybrid payment setup failed",
        success: false,
        flow_type: "hybrid",
      },
      { status: 500 },
    )
  }
}
