import { type NextRequest, NextResponse } from "next/server"
import crypto from "crypto"

const PAYMOB_HMAC_SECRET = process.env.PAYMOB_HMAC_SECRET

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = request.headers.get("x-paymob-signature")

    // Verify webhook signature
    if (PAYMOB_HMAC_SECRET && signature) {
      const expectedSignature = crypto.createHmac("sha512", PAYMOB_HMAC_SECRET).update(body).digest("hex")

      if (signature !== expectedSignature) {
        return NextResponse.json({ error: "Invalid signature" }, { status: 401 })
      }
    }

    const webhookData = JSON.parse(body)
    const { type, obj } = webhookData

    // Handle different webhook types
    switch (type) {
      case "TRANSACTION":
        await handleTransactionWebhook(obj)
        break
      case "DELIVERY_STATUS":
        await handleDeliveryStatusWebhook(obj)
        break
      default:
        console.log("Unhandled PayMob webhook type:", type)
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("PayMob webhook error:", error)
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 })
  }
}

async function handleTransactionWebhook(transaction: any) {
  const { success, pending, order, amount_cents, currency, source_data_type, source_data_sub_type } = transaction

  const cartId = order?.merchant_order_id
  const amount = amount_cents / 100

  if (success && !pending) {
    // Payment successful - update order status
    console.log(`PayMob payment successful for cart ${cartId}, amount: ${amount} ${currency}`)

    // Here you would update your order/cart status in your database
    // await updateOrderStatus(cartId, 'paid', transaction.id)

    // Send confirmation email, update inventory, etc.
  } else if (!success && !pending) {
    // Payment failed
    console.log(`PayMob payment failed for cart ${cartId}`)

    // Update order status to failed
    // await updateOrderStatus(cartId, 'payment_failed', transaction.id)
  }
}

async function handleDeliveryStatusWebhook(delivery: any) {
  // Handle delivery status updates if applicable
  console.log("PayMob delivery status update:", delivery)
}
