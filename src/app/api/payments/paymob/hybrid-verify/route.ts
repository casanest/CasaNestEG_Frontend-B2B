import { type NextRequest, NextResponse } from "next/server"

const PAYMOB_API_KEY = process.env.PAYMOB_API_KEY
const PAYMOB_BASE_URL = process.env.PAYMOB_BASE_URL || "https://accept.paymob.com/api"

// In-memory session store (use Redis or database in production)
const paymentSessions = new Map()

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { cart_id, transaction_data, payment_token, session_id } = body

    console.log("Hybrid Payment Flow - Verifying payment:", {
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

    // Get fresh authentication token for verification
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

    if (verifiedTransaction.order.id !== sessionData.paymob_order_id) {
      throw new Error("Transaction verification failed - order ID mismatch")
    }

    // Additional hybrid flow validations
    if (verifiedTransaction.amount_cents !== sessionData.payment_config?.amount_cents) {
      throw new Error("Transaction verification failed - amount mismatch")
    }

    if (verifiedTransaction.currency !== sessionData.payment_config?.currency) {
      throw new Error("Transaction verification failed - currency mismatch")
    }

    // Update session with verification data
    sessionData.transaction_id = verifiedTransaction.id
    sessionData.verification_status = "verified"
    sessionData.verified_at = new Date().toISOString()
    sessionData.status = "completed"
    sessionData.final_transaction_data = verifiedTransaction
    paymentSessions.set(session_id, sessionData)

    // Update Medusa order with comprehensive data
    const orderUpdateResult = await updateMedusaOrder(cart_id, {
      transaction_id: verifiedTransaction.id,
      payment_status: "completed",
      amount_paid: verifiedTransaction.amount_cents / 100,
      currency: verifiedTransaction.currency,
      payment_method: verifiedTransaction.source_data_type,
      payment_submethod: verifiedTransaction.source_data_sub_type,
      flow_type: "hybrid",
      session_id: session_id,
      is_3d_secure: verifiedTransaction.is_3d_secure,
      verification_data: {
        verified_at: sessionData.verified_at,
        paymob_order_id: sessionData.paymob_order_id,
        session_duration: new Date(sessionData.verified_at).getTime() - new Date(sessionData.created_at).getTime(),
      },
    })

    console.log("Hybrid Payment Flow - Payment verified successfully:", {
      cart_id,
      session_id,
      transaction_id: verifiedTransaction.id,
      amount: verifiedTransaction.amount_cents / 100,
      session_duration: new Date(sessionData.verified_at).getTime() - new Date(sessionData.created_at).getTime(),
    })

    return NextResponse.json({
      success: true,
      message: "Hybrid payment verified successfully",
      flow_type: "hybrid",
      session_id: session_id,
      transaction_id: verifiedTransaction.id,
      order_status: "completed",
      verified_at: sessionData.verified_at,
      verification_details: {
        amount_verified: verifiedTransaction.amount_cents / 100,
        currency_verified: verifiedTransaction.currency,
        payment_method_verified: verifiedTransaction.source_data_type,
        is_3d_secure: verifiedTransaction.is_3d_secure,
      },
    })
  } catch (error: any) {
    const { session_id } = await request.json() // Extract session_id here
    console.error("Hybrid Payment Flow - Verification error:", error)

    // Update session with error status
    const sessionData = paymentSessions.get(session_id)
    if (sessionData) {
      sessionData.status = "verification_failed"
      sessionData.error = error.message
      sessionData.failed_at = new Date().toISOString()
      paymentSessions.set(session_id, sessionData)
    }

    return NextResponse.json(
      {
        error: error.message || "Hybrid payment verification failed",
        success: false,
        flow_type: "hybrid",
        session_id: session_id,
      },
      { status: 500 },
    )
  }
}

// Helper function to update Medusa order
async function updateMedusaOrder(cartId: string, paymentData: any) {
  try {
    console.log("Updating Medusa order (Hybrid Flow):", { cartId, paymentData })

    // Implement comprehensive Medusa order completion logic here
    // This should include:
    // 1. Update cart payment status
    // 2. Complete order creation
    // 3. Update inventory
    // 4. Send confirmation emails
    // 5. Trigger any post-payment workflows
    // 6. Log payment analytics

    return { success: true }
  } catch (error) {
    console.error("Failed to update Medusa order:", error)
    throw error
  }
}
