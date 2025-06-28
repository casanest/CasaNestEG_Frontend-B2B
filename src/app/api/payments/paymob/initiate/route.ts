import { type NextRequest, NextResponse } from "next/server"

// PayMob API configuration
const PAYMOB_API_KEY = process.env.PAYMOB_API_KEY
const PAYMOB_INTEGRATION_ID = process.env.PAYMOB_INTEGRATION_ID
const PAYMOB_IFRAME_ID = process.env.PAYMOB_IFRAME_ID
const PAYMOB_INSTALLMENTS_IFRAME_ID = process.env.PAYMOB_INSTALLMENTS_IFRAME_ID
const PAYMOB_HMAC_SECRET = process.env.PAYMOB_HMAC_SECRET
const PAYMOB_BASE_URL = process.env.PAYMOB_BASE_URL || "https://accept.paymob.com/api"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      cart_id,
      payment_method,
      phone_number,
      amount,
      currency,
      customer_email,
      customer_name,
      billing_address,
      return_url,
    } = body

    // Validate required fields
    if (!cart_id || !payment_method || !amount) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Validate payment method
    const validMethods = ["card", "wallet", "installments"]
    if (!validMethods.includes(payment_method)) {
      return NextResponse.json({ error: "Invalid payment method" }, { status: 400 })
    }

    // Validate phone number for wallet payments
    if (payment_method === "wallet" && !phone_number) {
      return NextResponse.json({ error: "Phone number required for wallet payments" }, { status: 400 })
    }

    // Step 1: Get authentication token
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

    // Step 2: Create order
    const orderResponse = await fetch(`${PAYMOB_BASE_URL}/ecommerce/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        auth_token: authToken,
        delivery_needed: false,
        amount_cents: Math.round(amount * 100), // Convert to cents
        currency: currency.toUpperCase(),
        merchant_order_id: cart_id,
        items: [],
      }),
    })

    if (!orderResponse.ok) {
      throw new Error("Failed to create PayMob order")
    }

    const orderData = await orderResponse.json()
    const orderId = orderData.id

    // Step 3: Prepare billing data
    const billingData = {
      apartment: billing_address?.address_2 || "NA",
      email: customer_email || "customer@example.com",
      floor: "NA",
      first_name: billing_address?.first_name || customer_name?.split(" ")[0] || "Customer",
      street: billing_address?.address_1 || "NA",
      building: "NA",
      phone_number: phone_number || billing_address?.phone || "+20100000000",
      shipping_method: "NA",
      postal_code: billing_address?.postal_code || "NA",
      city: billing_address?.city || "Cairo",
      country: billing_address?.country_code || "EG",
      last_name: billing_address?.last_name || customer_name?.split(" ").slice(1).join(" ") || "Name",
      state: billing_address?.province || "Cairo",
    }

    // Step 4: Generate payment key
    const paymentKeyResponse = await fetch(`${PAYMOB_BASE_URL}/acceptance/payment_keys`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        auth_token: authToken,
        amount_cents: Math.round(amount * 100),
        expiration: 3600, // 1 hour
        order_id: orderId,
        billing_data: billingData,
        currency: currency.toUpperCase(),
        integration_id: PAYMOB_INTEGRATION_ID,
        lock_order_when_paid: true,
      }),
    })

    if (!paymentKeyResponse.ok) {
      throw new Error("Failed to generate PayMob payment key")
    }

    const paymentKeyData = await paymentKeyResponse.json()
    const paymentToken = paymentKeyData.token

    // Step 5: Generate iframe URL based on payment method
    let iframeUrl = ""
    const integrationId = PAYMOB_INTEGRATION_ID

    switch (payment_method) {
      case "card":
        iframeUrl = `https://accept.paymob.com/api/acceptance/iframes/${PAYMOB_IFRAME_ID}?payment_token=${paymentToken}`
        break
      case "installments":
        iframeUrl = `https://accept.paymob.com/api/acceptance/iframes/${PAYMOB_INSTALLMENTS_IFRAME_ID}?payment_token=${paymentToken}`
        break
      case "wallet":
        // For wallet payments, we might use a different iframe or redirect
        iframeUrl = `https://accept.paymob.com/api/acceptance/iframes/${PAYMOB_IFRAME_ID}?payment_token=${paymentToken}&source_data_type=wallet`
        break
      default:
        throw new Error("Invalid payment method")
    }

    // Add return URL if provided
    if (return_url) {
      iframeUrl += `&return_url=${encodeURIComponent(return_url)}`
    }

    // Store payment session data (you might want to save this to your database)
    const sessionData = {
      cart_id,
      payment_method,
      payment_token: paymentToken,
      order_id: orderId,
      amount_cents: Math.round(amount * 100),
      currency: currency.toUpperCase(),
      created_at: new Date().toISOString(),
      billing_data: billingData,
    }

    return NextResponse.json({
      success: true,
      payment_token: paymentToken,
      payment_url: iframeUrl,
      order_id: orderId,
      session_data: sessionData,
      expires_at: new Date(Date.now() + 3600 * 1000).toISOString(), // 1 hour from now
    })
  } catch (error: any) {
    console.error("PayMob payment initiation error:", error)
    return NextResponse.json(
      {
        error: error.message || "Payment initiation failed",
        success: false,
      },
      { status: 500 },
    )
  }
}
