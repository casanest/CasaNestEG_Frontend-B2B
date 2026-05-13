export interface PayMobBillingData {
  apartment?: string
  email?: string
  floor?: string
  first_name?: string
  street?: string
  address?: string
  building?: string
  phone_number?: string
  postal_code?: string
  city?: string
  country?: string
  last_name?: string
  state?: string
}

export interface PayMobOrderData {
  auth_token: string
  delivery_needed: boolean
  amount_cents: number
  currency: string
  merchant_order_id: string
  items: any[]
}

export interface PayMobPaymentKeyData {
  auth_token: string
  amount_cents: number
  expiration: number
  order_id: number
  billing_data: PayMobBillingData
  currency: string
  integration_id: string
  lock_order_when_paid?: boolean
}

/**
 * Validates and normalizes billing data for PayMob API
 */
export function validateBillingData(billingData?: PayMobBillingData): PayMobBillingData {
  return {
    apartment: billingData?.apartment || "NA",
    email: billingData?.email || "customer@example.com",
    floor: billingData?.floor || "NA",
    first_name: billingData?.first_name || "Customer",
    street: billingData?.street || billingData?.address || "NA",
    building: billingData?.building || "NA",
    phone_number: billingData?.phone_number || "+20100000000",
    postal_code: billingData?.postal_code || "NA",
    city: billingData?.city || "Cairo",
    country: billingData?.country || "EG",
    last_name: billingData?.last_name || "Name",
    state: billingData?.state || "Cairo",
  }
}

/**
 * Creates PayMob order with correct structure
 */
export function createOrderPayload(
  authToken: string,
  amountCents: number,
  currency: string,
  merchantOrderId: string,
): PayMobOrderData {
  return {
    auth_token: authToken,
    delivery_needed: false,
    amount_cents: amountCents,
    currency: currency.toUpperCase(),
    merchant_order_id: merchantOrderId,
    items: [], // Always empty for simple payments
  }
}

/**
 * Creates payment key payload with validated data
 */
export function createPaymentKeyPayload(
  authToken: string,
  amountCents: number,
  currency: string,
  orderId: number,
  integrationId: string,
  billingData: PayMobBillingData,
): PayMobPaymentKeyData {
  return {
    auth_token: authToken,
    amount_cents: amountCents,
    expiration: 3600, // 1 hour
    order_id: orderId,
    billing_data: validateBillingData(billingData),
    currency: currency.toUpperCase(),
    integration_id: integrationId,
    lock_order_when_paid: true,
  }
}

/**
 * Validates Egyptian phone number format
 */
export function validateEgyptianPhoneNumber(phoneNumber?: string): boolean {
  if (!phoneNumber) return false

  // Egyptian phone number patterns
  const patterns = [
    /^(\+20|0020)?1[0125]\d{8}$/, // Mobile numbers
    /^(\+20|0020)?[23]\d{7,8}$/, // Landline numbers
  ]

  const cleanNumber = phoneNumber.replace(/[\s\-$$$$]/g, "")
  return patterns.some((pattern) => pattern.test(cleanNumber))
}

/**
 * Generates iframe URL based on payment method
 */
export function generateIframeUrl(
  paymentMethod: string,
  paymentToken: string,
  iframeId: string,
  installmentsIframeId?: string,
): string {
  const baseUrl = "https://accept.paymob.com/api/acceptance/iframes"

  switch (paymentMethod) {
    case "card":
      return `${baseUrl}/${iframeId}?payment_token=${paymentToken}`
    case "installments":
      if (!installmentsIframeId) {
        throw new Error("Installments iframe ID is required for installment payments")
      }
      return `${baseUrl}/${installmentsIframeId}?payment_token=${paymentToken}`
    case "wallet":
      return `${baseUrl}/${iframeId}?payment_token=${paymentToken}&source_data_type=wallet`
    default:
      throw new Error(`Unsupported payment method: ${paymentMethod}`)
  }
}

/**
 * Makes authenticated request to PayMob API with error handling
 */
export async function makePayMobRequest(url: string, payload: any, method = "POST"): Promise<any> {
  try {
    const response = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "Medusa-PayMob-Integration/1.0.0",
      },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      const errorText = await response.text()
      let errorMessage = `PayMob API Error: ${response.status} ${response.statusText}`

      try {
        const errorJson = JSON.parse(errorText)
        errorMessage += ` - ${errorJson.message || errorJson.detail || errorText}`
      } catch {
        errorMessage += ` - ${errorText}`
      }

      throw new Error(errorMessage)
    }

    return await response.json()
  } catch (error) {
    console.error("PayMob API Request Failed:", {
      url,
      method,
      error: error instanceof Error ? error.message : error,
    })
    throw error
  }
}
