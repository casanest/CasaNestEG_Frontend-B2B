import { type NextRequest, NextResponse } from "next/server"

const PAYMOB_API_KEY = process.env.PAYMOB_API_KEY
const PAYMOB_INTEGRATION_ID = process.env.PAYMOB_INTEGRATION_ID
const PAYMOB_IFRAME_ID = process.env.PAYMOB_IFRAME_ID
const PAYMOB_INSTALLMENTS_IFRAME_ID = process.env.PAYMOB_INSTALLMENTS_IFRAME_ID
const PAYMOB_BASE_URL = process.env.PAYMOB_BASE_URL || "https://accept.paymob.com/api"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { amount_cents, currency, merchant_order_id, billing_data, payment_method } = body

    console.log("Direct Payment Flow - Initiating payment:", {
      amount_cents,
      currency: "EGP",
      merchant_order_id,
      payment_method,
    })

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
      const errorText = await authResponse.text()
      console.error("PayMob Auth Error:", errorText)
      throw new Error("Failed to authenticate with PayMob")
    }

    const authData = await authResponse.json()
    const authToken = authData.token

    // Step 2: Create order with unique merchant_order_id
    const uniqueOrderId = `${merchant_order_id}_${Date.now()}`
    const orderResponse = await fetch(`${PAYMOB_BASE_URL}/ecommerce/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        auth_token: authToken,
        delivery_needed: false,
        amount_cents: amount_cents,
        currency: "EGP",
        merchant_order_id: uniqueOrderId,
        items: [],
      }),
    })

    if (!orderResponse.ok) {
      const errorText = await orderResponse.text()
      console.error("PayMob Order Creation Error:", errorText)
      throw new Error("Failed to create PayMob order")
    }

    const orderData = await orderResponse.json()
    const orderId = orderData.id

    // Step 3: Generate payment key with enhanced billing data and callback URLs
    const validatedBillingData = {
      apartment: billing_data?.apartment || "NA",
      email: billing_data?.email || "customer@example.com",
      floor: billing_data?.floor || "NA",
      first_name: billing_data?.first_name || "Customer",
      street: billing_data?.street || billing_data?.address || "NA",
      building: billing_data?.building || "NA",
      phone_number: billing_data?.phone_number || "+20100000000",
      shipping_method: "NA",
      postal_code: billing_data?.postal_code || "NA",
      city: billing_data?.city || "Cairo",
      country: billing_data?.country || "EG",
      last_name: billing_data?.last_name || "Name",
      state: billing_data?.state || "Cairo",
    }

    // Get the current domain for callback URLs
    const origin = request.headers.get("origin") || "http://localhost:3000"

    const paymentKeyResponse = await fetch(`${PAYMOB_BASE_URL}/acceptance/payment_keys`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        auth_token: authToken,
        amount_cents: amount_cents,
        expiration: 3600,
        order_id: orderId,
        billing_data: validatedBillingData,
        currency: "EGP",
        integration_id: PAYMOB_INTEGRATION_ID,
        lock_order_when_paid: true,
        // Add callback URLs for better iframe communication
        success_url: `${origin}/checkout/payment-success`,
        failure_url: `${origin}/checkout/payment-failure`,
        pending_url: `${origin}/checkout/payment-pending`,
      }),
    })

    if (!paymentKeyResponse.ok) {
      const errorText = await paymentKeyResponse.text()
      console.error("Payment Key Response Error:", errorText)
      throw new Error("Failed to generate PayMob payment key")
    }

    const paymentKeyData = await paymentKeyResponse.json()
    const paymentToken = paymentKeyData.token

    // Step 4: Generate iframe URL with enhanced parameters
    let iframeUrl = ""
    const baseParams = `payment_token=${paymentToken}&iframe_id=${PAYMOB_IFRAME_ID}`

    switch (payment_method) {
      case "card":
        iframeUrl = `https://accept.paymob.com/api/acceptance/iframes/${PAYMOB_IFRAME_ID}?${baseParams}&integration_id=${PAYMOB_INTEGRATION_ID}`
        break
      case "installments":
        iframeUrl = `https://accept.paymob.com/api/acceptance/iframes/${PAYMOB_INSTALLMENTS_IFRAME_ID}?${baseParams}&integration_id=${PAYMOB_INTEGRATION_ID}`
        break
      case "wallet":
        iframeUrl = `https://accept.paymob.com/api/acceptance/iframes/${PAYMOB_IFRAME_ID}?${baseParams}&source_data_type=wallet&integration_id=${PAYMOB_INTEGRATION_ID}`
        break
      default:
        throw new Error("Invalid payment method")
    }

    console.log("Direct Payment Flow - Payment initiated successfully:", {
      order_id: orderId,
      unique_merchant_order_id: uniqueOrderId,
      payment_token: paymentToken.substring(0, 10) + "...",
      iframe_url: iframeUrl.substring(0, 100) + "...",
    })

    return NextResponse.json({
      success: true,
      payment_token: paymentToken,
      iframe_url: iframeUrl,
      order_id: orderId,
      merchant_order_id: uniqueOrderId,
      flow_type: "direct",
      expires_at: new Date(Date.now() + 3600 * 1000).toISOString(),
    })
  } catch (error: any) {
    console.error("Direct Payment Flow - Error:", error)
    return NextResponse.json(
      {
        error: error.message || "Direct payment initiation failed",
        success: false,
        flow_type: "direct",
      },
      { status: 500 },
    )
  }
}
