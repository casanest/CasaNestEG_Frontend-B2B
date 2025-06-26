import { NextResponse } from "next/server"

const PAYMOB_API_KEY = process.env.PAYMOB_API_KEY
const PAYMOB_BASE_URL = process.env.PAYMOB_BASE_URL

export async function POST(request: Request) {
  try {
    const sessionData = await request.json()

    if (!PAYMOB_API_KEY || !PAYMOB_BASE_URL) {
      throw new Error("PAYMOB_API_KEY and PAYMOB_BASE_URL must be defined in environment variables")
    }

    // Step 1: Get authentication token
    const authResponse = await fetch(`${PAYMOB_BASE_URL}/auth/tokens`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ api_key: PAYMOB_API_KEY }),
    })

    const authData = await authResponse.json()
    const authToken = authData.token

    // Step 2: Create order (corrected)
    const orderResponse = await fetch(`${PAYMOB_BASE_URL}/ecommerce/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        auth_token: authToken,
        delivery_needed: false,
        amount_cents: sessionData.amount * 100,
        currency: sessionData.currency.toUpperCase(),
        merchant_order_id: sessionData.cart_id,
        items: [],
        // Remove extra fields that cause duplicates
      }),
    })

    const orderData = await orderResponse.json()
    const orderId = orderData.id

    // Step 3: Generate payment key with validated billing data
    const billingData = {
      apartment: sessionData.customer_data?.billing_address?.apartment || "NA",
      email: sessionData.customer_data?.email || "customer@example.com",
      floor: "NA",
      first_name: sessionData.customer_data?.billing_address?.first_name || "Customer",
      street: sessionData.customer_data?.billing_address?.street || "NA",
      building: "NA",
      phone_number: sessionData.phone_number || "+20100000000",
      shipping_method: "NA",
      postal_code: sessionData.customer_data?.billing_address?.postal_code || "NA",
      city: sessionData.customer_data?.billing_address?.city || "Cairo",
      country: sessionData.customer_data?.billing_address?.country || "EG",
      last_name: sessionData.customer_data?.billing_address?.last_name || "Name",
      state: sessionData.customer_data?.billing_address?.state || "Cairo",
    }

    const paymentKeyResponse = await fetch(`${PAYMOB_BASE_URL}/paymentkeys`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        auth_token: authToken,
        amount_cents: sessionData.amount * 100,
        expiration: 3600,
        order_id: orderId,
        billing_data: billingData,
        currency: sessionData.currency.toUpperCase(),
        integration_id: sessionData.integration_id,
      }),
    })

    const paymentKeyData = await paymentKeyResponse.json()
    const paymentKey = paymentKeyData.token

    return NextResponse.json({ paymentKey })
  } catch (error: any) {
    console.error("Error in backend-token route:", error)
    return NextResponse.json({ error: error.message || "An unexpected error occurred" }, { status: 500 })
  }
}
