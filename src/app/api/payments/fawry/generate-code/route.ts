import { type NextRequest, NextResponse } from "next/server"
import crypto from "crypto"

// Fawry API configuration
const FAWRY_MERCHANT_CODE = process.env.FAWRY_MERCHANT_CODE
const FAWRY_SECURITY_KEY = process.env.FAWRY_SECURITY_KEY
const FAWRY_BASE_URL = process.env.FAWRY_BASE_URL || "https://atfawry.fawrystaging.com"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { cart_id, amount, currency } = body

    // Validate required fields
    if (!cart_id || !amount) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Generate unique reference number
    const referenceNumber = `REF${Date.now()}${Math.random().toString(36).substr(2, 5).toUpperCase()}`

    // Convert amount to Egyptian Pounds if needed
    const amountInEGP = currency === "EGP" ? amount : amount * 30 // Approximate conversion

    // Prepare charge request
    const chargeItems = [
      {
        itemId: cart_id,
        description: `Order ${cart_id}`,
        price: amountInEGP,
        quantity: 1,
      },
    ]

    // Generate signature for security
    const signatureString = `${FAWRY_MERCHANT_CODE}${referenceNumber}${amountInEGP}${FAWRY_SECURITY_KEY}`
    const signature = crypto.createHash("sha256").update(signatureString).digest("hex")

    // Create charge request
    const chargeRequest = {
      merchantCode: FAWRY_MERCHANT_CODE,
      merchantRefNum: referenceNumber,
      customerProfileId: `CUST_${cart_id}`,
      customerName: "Customer",
      customerEmail: "customer@example.com",
      customerMobile: "01000000000",
      paymentMethod: "PAYATFAWRY",
      amount: amountInEGP,
      currencyCode: "EGP",
      description: `Payment for order ${cart_id}`,
      chargeItems: chargeItems,
      signature: signature,
    }

    // Send request to Fawry
    const fawryResponse = await fetch(`${FAWRY_BASE_URL}/ECommerceWeb/Fawry/payments/charge`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(chargeRequest),
    })

    if (!fawryResponse.ok) {
      throw new Error("Failed to create Fawry charge request")
    }

    const fawryData = await fawryResponse.json()

    if (fawryData.statusCode !== 200) {
      throw new Error(fawryData.statusDescription || "Fawry charge request failed")
    }

    return NextResponse.json({
      success: true,
      reference_code: referenceNumber,
      fawry_ref_number: fawryData.fawryRefNumber,
      expiration_time: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours
    })
  } catch (error: any) {
    console.error("Fawry reference code generation error:", error)
    return NextResponse.json({ error: error.message || "Failed to generate reference code" }, { status: 500 })
  }
}
