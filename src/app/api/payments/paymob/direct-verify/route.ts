import { type NextRequest, NextResponse } from "next/server"

const PAYMOB_API_KEY = process.env.PAYMOB_API_KEY
const PAYMOB_BASE_URL = process.env.PAYMOB_BASE_URL || "https://accept.paymob.com/api"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { cart_id, transaction_data, payment_token, merchant_order_id } = body

    console.log("Direct Payment Verification - Starting:", {
      cart_id,
      merchant_order_id,
      transaction_id: transaction_data.transaction_id,
      success: transaction_data.success,
      pending: transaction_data.pending,
      amount_cents: transaction_data.amount_cents,
    })

    // Validate required fields
    if (!cart_id || !transaction_data || !payment_token) {
      return NextResponse.json(
        {
          error: "Missing required fields: cart_id, transaction_data, or payment_token",
          success: false,
        },
        { status: 400 },
      )
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
      const authError = await authResponse.json()
      console.error("PayMob authentication failed:", authError)
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
      const transactionError = await transactionResponse.json()
      console.error("PayMob transaction verification failed:", transactionError)
      throw new Error("Failed to verify transaction with PayMob")
    }

    const verifiedTransaction = await transactionResponse.json()

    console.log("PayMob transaction verification response:", {
      id: verifiedTransaction.id,
      success: verifiedTransaction.success,
      pending: verifiedTransaction.pending,
      amount_cents: verifiedTransaction.amount_cents,
      currency: verifiedTransaction.currency,
      merchant_order_id: verifiedTransaction.order?.merchant_order_id,
      source_data_type: verifiedTransaction.source_data_type,
    })

    // Enhanced validation
    const validationErrors = []

    if (verifiedTransaction.success !== transaction_data.success) {
      validationErrors.push(
        `Transaction success status mismatch: expected ${transaction_data.success}, got ${verifiedTransaction.success}`,
      )
    }

    // Check merchant order ID (more flexible matching)
    const expectedOrderId = merchant_order_id || cart_id
    const actualOrderId = verifiedTransaction.order?.merchant_order_id
    if (actualOrderId && !actualOrderId.includes(cart_id) && actualOrderId !== expectedOrderId) {
      validationErrors.push(`Order ID mismatch: expected ${expectedOrderId}, got ${actualOrderId}`)
    }

    if (verifiedTransaction.amount_cents !== transaction_data.amount_cents) {
      validationErrors.push(
        `Amount mismatch: expected ${transaction_data.amount_cents}, got ${verifiedTransaction.amount_cents}`,
      )
    }

    if (validationErrors.length > 0) {
      console.error("Transaction validation failed:", validationErrors)
      return NextResponse.json(
        {
          error: "Transaction validation failed: " + validationErrors.join(", "),
          success: false,
          validation_errors: validationErrors,
          expected_data: {
            cart_id,
            merchant_order_id: expectedOrderId,
            success: transaction_data.success,
            amount_cents: transaction_data.amount_cents,
          },
          actual_data: {
            merchant_order_id: actualOrderId,
            success: verifiedTransaction.success,
            amount_cents: verifiedTransaction.amount_cents,
          },
        },
        { status: 400 },
      )
    }

    // Check if transaction is successful and not pending
    if (!verifiedTransaction.success) {
      return NextResponse.json(
        {
          error: "Transaction was not successful according to PayMob",
          success: false,
          transaction_status: "failed",
          paymob_response: {
            success: verifiedTransaction.success,
            pending: verifiedTransaction.pending,
            error_occured: verifiedTransaction.error_occured,
          },
        },
        { status: 400 },
      )
    }

    if (verifiedTransaction.pending) {
      return NextResponse.json(
        {
          error: "Transaction is still pending",
          success: false,
          transaction_status: "pending",
          message: "Payment is being processed, please wait",
        },
        { status: 202 }, // Accepted but not complete
      )
    }

    // Update Medusa order/cart
    const orderUpdateResult = await updateMedusaOrder(cart_id, {
      transaction_id: verifiedTransaction.id,
      payment_status: "completed",
      amount_paid: verifiedTransaction.amount_cents / 100,
      currency: verifiedTransaction.currency,
      payment_method: verifiedTransaction.source_data_type || "paymob",
      flow_type: "direct",
      merchant_order_id: actualOrderId,
      paymob_data: {
        transaction_id: verifiedTransaction.id,
        order_id: verifiedTransaction.order?.id,
        integration_id: verifiedTransaction.integration_id,
        profile_id: verifiedTransaction.profile_id,
        is_3d_secure: verifiedTransaction.is_3d_secure,
        source_data_type: verifiedTransaction.source_data_type,
        source_data_sub_type: verifiedTransaction.source_data_sub_type,
        created_at: verifiedTransaction.created_at,
      },
    })

    console.log("Direct Payment Verification - Success:", {
      cart_id,
      transaction_id: verifiedTransaction.id,
      amount: verifiedTransaction.amount_cents / 100,
      currency: verifiedTransaction.currency,
      payment_method: verifiedTransaction.source_data_type,
      order_update_result: orderUpdateResult.success,
    })

    return NextResponse.json({
      success: true,
      message: "Direct payment verified and order updated successfully",
      transaction_id: verifiedTransaction.id,
      order_status: "completed",
      amount_paid: verifiedTransaction.amount_cents / 100,
      currency: verifiedTransaction.currency,
      payment_method: verifiedTransaction.source_data_type,
      merchant_order_id: actualOrderId,
      verified_at: new Date().toISOString(),
      flow_type: "direct",
      paymob_transaction: {
        id: verifiedTransaction.id,
        success: verifiedTransaction.success,
        pending: verifiedTransaction.pending,
        is_3d_secure: verifiedTransaction.is_3d_secure,
        source_data_type: verifiedTransaction.source_data_type,
      },
    })
  } catch (error: any) {
    console.error("Direct Payment Verification - Error:", error)
    return NextResponse.json(
      {
        error: error.message || "Direct payment verification failed",
        success: false,
        flow_type: "direct",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}

// Enhanced helper function to update Medusa order
async function updateMedusaOrder(cartId: string, paymentData: any) {
  try {
    console.log("Updating Medusa order:", { cartId, paymentData })

    // Here you would integrate with your Medusa backend
    // This is a placeholder implementation that you should replace with actual Medusa integration

    // Example of what you might do:
    // 1. Get the cart from Medusa
    // 2. Complete the cart to create an order
    // 3. Update payment status
    // 4. Send confirmation emails
    // 5. Update inventory
    // 6. Create payment record

    // For now, we'll simulate a successful update
    const updateResult = {
      success: true,
      order_id: `order_${cartId}_${Date.now()}`,
      payment_id: `payment_${paymentData.transaction_id}`,
      updated_at: new Date().toISOString(),
      status: "completed",
    }

    console.log("Medusa order update result:", updateResult)
    return updateResult
  } catch (error) {
    console.error("Failed to update Medusa order:", error)
    throw new Error(`Failed to update order: ${error.message}`)
  }
}
