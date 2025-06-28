import { type NextRequest, NextResponse } from "next/server"

const PAYMOB_API_KEY = process.env.PAYMOB_API_KEY
const PAYMOB_BASE_URL = process.env.PAYMOB_BASE_URL || "https://accept.paymob.com/api"

// In-memory session store (use Redis or database in production)
const paymentSessions = new Map()

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { cart_id, transaction_data, payment_token, session_id } = body

    console.log("Backend Payment Flow - Verifying payment:", {
      cart_id,
      session_id,
      transaction_id: transaction_data.transaction_id,
    })

    // Retrieve and validate session
    const sessionData = paymentSessions.get(session_id)
    if (!sessionData) {
      throw new Error("Invalid or expired session")
    }

    if (sessionData.cart_id !== cart_id) {
      throw new Error("Session cart ID mismatch")
    }

    if (sessionData.payment_token !== payment_token) {
      throw new Error("Session payment token mismatch")
    }

    // Get authentication token
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

    // Verify transaction with PayMob
    const transactionResponse = await fetch(
      `${PAYMOB_BASE_URL}/acceptance/transactions/${transaction_data.transaction_id}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
      },
    )

    if (!transactionResponse.ok) {
      throw new Error("Failed to verify transaction with PayMob")
    }

    const verifiedTransaction = await transactionResponse.json()

    // Comprehensive validation
    if (verifiedTransaction.success !== transaction_data.success) {
      throw new Error("Transaction verification failed - status mismatch")
    }

    if (verifiedTransaction.order.merchant_order_id !== cart_id) {
      throw new Error("Transaction verification failed - cart ID mismatch")
    }

    if (verifiedTransaction.id !== sessionData.paymob_order_id) {
      throw new Error("Transaction verification failed - order ID mismatch")
    }

    // Update session with verification data
    sessionData.transaction_id = verifiedTransaction.id
    sessionData.verification_status = "verified"
    sessionData.verified_at = new Date().toISOString()
    sessionData.status = "completed"
    paymentSessions.set(session_id, sessionData)

    // Update Medusa order
    const orderUpdateResult = await updateMedusaOrder(cart_id, {
      transaction_id: verifiedTransaction.id,
      payment_status: "completed",
      amount_paid: verifiedTransaction.amount_cents / 100,
      currency: verifiedTransaction.currency,
      payment_method: verifiedTransaction.source_data_type,
      flow_type: "backend",
      session_id: session_id,
    })

    console.log("Backend Payment Flow - Payment verified successfully:", {
      cart_id,
      session_id,
      transaction_id: verifiedTransaction.id,
      amount: verifiedTransaction.amount_cents / 100,
    })

    return NextResponse.json({
      success: true,
      message: "Backend payment verified successfully",
      flow_type: "backend",
      session_id: session_id,
      transaction_id: verifiedTransaction.id,
      order_status: "completed",
      verified_at: sessionData.verified_at,
    })
  } catch (error: any) {
    console.error("Backend Payment Flow - Verification error:", error)
    return NextResponse.json(
      {
        error: error.message || "Backend payment verification failed",
        success: false,
        flow_type: "backend",
      },
      { status: 500 },
    )
  }
}

// Helper function to update Medusa order
async function updateMedusaOrder(cartId: string, paymentData: any) {
  try {
    console.log("Updating Medusa order (Backend Flow):", { cartId, paymentData })
    // Implement Medusa order completion logic here
    return { success: true }
  } catch (error) {
    console.error("Failed to update Medusa order:", error)
    throw error
  }
}
