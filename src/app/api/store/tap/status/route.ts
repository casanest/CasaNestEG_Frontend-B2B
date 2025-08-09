import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const cartId = searchParams.get('cart_id')
    const chargeId = searchParams.get('charge_id')

    if (!cartId && !chargeId) {
      return NextResponse.json(
        { success: false, message: "Either cart_id or charge_id is required" },
        { status: 400 }
      )
    }

    const backendUrl = process.env.MEDUSA_BACKEND_URL || "http://localhost:9000"
    const publishableKey = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY

    if (!publishableKey) {
      return NextResponse.json(
        { success: false, message: "Publishable API key not configured" },
        { status: 500 }
      )
    }

    // Build query parameters
    const params = new URLSearchParams()
    if (cartId) params.append('cart_id', cartId)
    if (chargeId) params.append('charge_id', chargeId)

    console.log(`[Tap Status] Checking payment status: cart_id=${cartId}, charge_id=${chargeId}`)

    // Forward the request to the backend
    const response = await fetch(`${backendUrl}/store/tap/status?${params.toString()}`, {
      method: "GET",
      headers: {
        "x-publishable-api-key": publishableKey,
        "Content-Type": "application/json",
      },
    })

    const responseText = await response.text()
    
    // Handle empty responses
    if (!responseText) {
      return NextResponse.json(
        { success: false, message: "Empty response from backend" },
        { status: 500 }
      )
    }

    let data
    try {
      data = JSON.parse(responseText)
    } catch (parseError) {
      console.error("Failed to parse backend response:", responseText)
      return NextResponse.json(
        { success: false, message: "Invalid response format from backend" },
        { status: 500 }
      )
    }

    if (!response.ok) {
      return NextResponse.json(
        { success: false, message: data.message || `Backend error: ${response.status}` },
        { status: response.status }
      )
    }

    console.log(`[Tap Status] Payment status retrieved: ${data.payment_status}`)

    return NextResponse.json(data)
  } catch (error: any) {
    console.error("Payment status check error:", error)
    return NextResponse.json(
      { success: false, message: error.message || "Internal server error" },
      { status: 500 }
    )
  }
} 