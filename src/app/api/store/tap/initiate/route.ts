import { NextRequest, NextResponse } from 'next/server'

interface InitiateTapPaymentRequest {
  cart_id: string
  amount: number
  currency: string
  customer_email: string
  locale?: string
  countryCode?: string
  billing_address: {
    first_name: string
    last_name: string
    phone: string
    country_code: string
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: InitiateTapPaymentRequest = await request.json()
    
    const {
      cart_id,
      amount,
      currency,
      customer_email,
      locale,
      countryCode,
      billing_address,
    } = body

    // Validate required fields
    if (!cart_id || !amount || !currency || !customer_email) {
      return NextResponse.json(
        { error: "Missing required fields: cart_id, amount, currency, customer_email" },
        { status: 400 }
      )
    }

    const backendUrl = process.env.MEDUSA_BACKEND_URL || "http://localhost:9000"
    const publishableKey = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY

    if (!publishableKey) {
      return NextResponse.json(
        { error: "Publishable API key not configured" },
        { status: 500 }
      )
    }

    // Forward the request to the backend with proper headers
    const response = await fetch(`${backendUrl}/store/tap/initiate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-publishable-api-key": publishableKey,
      },
      body: JSON.stringify({
        cart_id,
        amount,
        currency,
        customer_email,
        locale,
        country_code: countryCode,
        billing_address,
      }),
    })

    const responseText = await response.text()
    
    // Handle empty responses
    if (!responseText) {
      return NextResponse.json(
        { error: "Empty response from payment provider" },
        { status: 500 }
      )
    }

    let data
    try {
      data = JSON.parse(responseText)
    } catch (parseError) {
      console.error("Failed to parse backend response:", responseText)
      return NextResponse.json(
        { error: "Invalid response format from payment provider" },
        { status: 500 }
      )
    }

    if (!response.ok) {
      return NextResponse.json(
        { error: data.error || data.message || `Backend error: ${response.status}` },
        { status: response.status }
      )
    }

    return NextResponse.json(data)
  } catch (error: any) {
    console.error("Tap payment initiation error:", error)
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    )
  }
} 