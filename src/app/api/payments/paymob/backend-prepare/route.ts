import { type NextRequest, NextResponse } from "next/server"
import { v4 as uuidv4 } from "uuid"

// In-memory session store (use Redis or database in production)
const paymentSessions = new Map()

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { cart_id, payment_method, phone_number, amount, currency, customer_data } = body

    console.log("Backend Payment Flow - Preparing payment session:", {
      cart_id,
      payment_method,
      amount,
      currency,
    })

    // Generate unique session ID
    const sessionId = uuidv4()

    // Store payment session data
    const sessionData = {
      session_id: sessionId,
      cart_id,
      payment_method,
      phone_number,
      amount,
      currency,
      customer_data,
      status: "prepared",
      created_at: new Date().toISOString(),
      expires_at: new Date(Date.now() + 3600 * 1000).toISOString(), // 1 hour
    }

    paymentSessions.set(sessionId, sessionData)

    console.log("Backend Payment Flow - Session prepared:", {
      session_id: sessionId,
      cart_id,
    })

    return NextResponse.json({
      success: true,
      session_id: sessionId,
      flow_type: "backend",
      message: "Payment session prepared successfully",
      expires_at: sessionData.expires_at,
    })
  } catch (error: any) {
    console.error("Backend Payment Flow - Preparation error:", error)
    return NextResponse.json(
      {
        error: error.message || "Backend payment preparation failed",
        success: false,
        flow_type: "backend",
      },
      { status: 500 },
    )
  }
}
