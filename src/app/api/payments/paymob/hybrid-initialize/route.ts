import { type NextRequest, NextResponse } from "next/server"

const PAYMOB_INTEGRATION_ID = process.env.PAYMOB_INTEGRATION_ID
const PAYMOB_IFRAME_ID = process.env.PAYMOB_IFRAME_ID
const PAYMOB_INSTALLMENTS_IFRAME_ID = process.env.PAYMOB_INSTALLMENTS_IFRAME_ID
const PAYMOB_BASE_URL = process.env.PAYMOB_BASE_URL || "https://accept.paymob.com/api"

// In-memory session store (use Redis or database in production)
const paymentSessions = new Map()

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { session_id, payment_config, customer_data } = body

    console.log("Hybrid Payment Flow - Initializing iframe:", {
      session_id,
      order_id: payment_config.order_id,
    })

    // Retrieve session data
    const sessionData = paymentSessions.get(session_id)
    if (!sessionData) {
      throw new Error("Invalid or expired session")
    }

    // Check session expiry
    if (new Date() > new Date(sessionData.expires_at)) {
      paymentSessions.delete(session_id)
      throw new Error("Session expired")
    }

    // Prepare billing data
    const billingData = {
      apartment: customer_data?.billing_address?.address_2 || "NA",
      email: customer_data?.email || "customer@example.com",
      floor: "NA",
      first_name: customer_data?.billing_address?.first_name || "Customer",
      street: customer_data?.billing_address?.address_1 || "NA",
      building: "NA",
      phone_number: sessionData.phone_number || customer_data?.billing_address?.phone || "+20100000000",
      shipping_method: "NA",
      postal_code: customer_data?.billing_address?.postal_code || "NA",
      city: customer_data?.billing_address?.city || "Cairo",
      country: customer_data?.billing_address?.country_code || "EG",
      last_name: customer_data?.billing_address?.last_name || "Name",
      state: customer_data?.billing_address?.province || "Cairo",
    }

    // Generate payment key using pre-configured data
    const paymentKeyResponse = await fetch(`${PAYMOB_BASE_URL}/acceptance/payment_keys`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        auth_token: sessionData.auth_token,
        amount_cents: payment_config.amount_cents,
        expiration: 3600,
        order_id: payment_config.order_id,
        billing_data: billingData,
        currency: payment_config.currency,
        integration_id: PAYMOB_INTEGRATION_ID,
        lock_order_when_paid: true,
      }),
    })

    if (!paymentKeyResponse.ok) {
      throw new Error("Failed to generate PayMob payment key")
    }

    const paymentKeyData = await paymentKeyResponse.json()
    const paymentToken = paymentKeyData.token

    // Generate iframe URL based on payment method
    let iframeUrl = ""
    switch (payment_config.payment_method) {
      case "card":
        iframeUrl = `https://accept.paymob.com/api/acceptance/iframes/${PAYMOB_IFRAME_ID}?payment_token=${paymentToken}`
        break
      case "installments":
        iframeUrl = `https://accept.paymob.com/api/acceptance/iframes/${PAYMOB_INSTALLMENTS_IFRAME_ID}?payment_token=${paymentToken}`
        break
      case "wallet":
        iframeUrl = `https://accept.paymob.com/api/acceptance/iframes/${PAYMOB_IFRAME_ID}?payment_token=${paymentToken}&source_data_type=wallet`
        break
      default:
        throw new Error("Invalid payment method")
    }

    // Update session with iframe data
    sessionData.payment_token = paymentToken
    sessionData.iframe_url = iframeUrl
    sessionData.billing_data = billingData
    sessionData.status = "iframe_ready"
    sessionData.updated_at = new Date().toISOString()
    paymentSessions.set(session_id, sessionData)

    console.log("Hybrid Payment Flow - Iframe initialized:", {
      session_id,
      order_id: payment_config.order_id,
      payment_token: paymentToken.substring(0, 10) + "...",
    })

    return NextResponse.json({
      success: true,
      payment_token: paymentToken,
      iframe_url: iframeUrl,
      order_id: payment_config.order_id,
      flow_type: "hybrid",
      session_id: session_id,
    })
  } catch (error: any) {
    console.error("Hybrid Payment Flow - Initialization error:", error)
    return NextResponse.json(
      {
        error: error.message || "Hybrid payment initialization failed",
        success: false,
        flow_type: "hybrid",
      },
      { status: 500 },
    )
  }
}
