import { type NextRequest, NextResponse } from "next/server"
import crypto from "crypto"

const FAWRY_SECURITY_KEY = process.env.FAWRY_SECURITY_KEY

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      fawryRefNumber,
      merchantRefNumber,
      paymentAmount,
      orderAmount,
      fawryFees,
      paymentMethod,
      messageSignature,
      orderStatus,
    } = body

    // Verify signature
    if (FAWRY_SECURITY_KEY && messageSignature) {
      const signatureString = `${fawryRefNumber}${merchantRefNumber}${paymentAmount}${orderAmount}${fawryFees}${orderStatus}${FAWRY_SECURITY_KEY}`
      const expectedSignature = crypto.createHash("sha256").update(signatureString).digest("hex")

      if (messageSignature !== expectedSignature) {
        return NextResponse.json({ error: "Invalid signature" }, { status: 401 })
      }
    }

    // Extract cart ID from merchant reference number
    const cartId = merchantRefNumber.replace("REF", "").substring(13) // Remove timestamp part

    // Handle different order statuses
    switch (orderStatus) {
      case "PAID":
        console.log(`Fawry payment successful for cart ${cartId}, amount: ${paymentAmount} EGP`)

        // Update order status to paid
        // await updateOrderStatus(cartId, 'paid', fawryRefNumber)

        // Send confirmation email, update inventory, etc.
        break

      case "CANCELED":
        console.log(`Fawry payment canceled for cart ${cartId}`)

        // Update order status to canceled
        // await updateOrderStatus(cartId, 'canceled', fawryRefNumber)
        break

      case "DELIVERED":
        console.log(`Fawry payment delivered for cart ${cartId}`)

        // Update order status to delivered if applicable
        // await updateOrderStatus(cartId, 'delivered', fawryRefNumber)
        break

      case "EXPIRED":
        console.log(`Fawry payment expired for cart ${cartId}`)

        // Update order status to expired
        // await updateOrderStatus(cartId, 'expired', fawryRefNumber)
        break

      default:
        console.log("Unhandled Fawry order status:", orderStatus)
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("Fawry webhook error:", error)
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 })
  }
}
