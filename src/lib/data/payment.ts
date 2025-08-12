"use server"

import { sdk } from "@lib/config"
import { getAuthHeaders, getCacheOptions } from "./cookies"
import { HttpTypes } from "@medusajs/types"

export const listCartPaymentMethods = async (regionId: string) => {
  // Only return Tap as the payment provider
  const tapProvider = {
    id: "tap",
    title: "Tap Payments",
    description: "Secure payment processing with Tap",
    icon: "credit-card",
    features: [
      "3D Secure protection",
      "SSL encryption",
      "All major cards accepted",
      "Real-time processing",
      "PCI DSS compliant"
    ],
    supported_currencies: ["USD", "EUR", "KWD", "SAR", "AED"],
    processing_time: "Instant",
    fees: "2.9% + fees",
    methods: [
      {
        id: "card",
        title: "Credit/Debit Card",
        description: "Pay securely with your credit or debit card",
        icon: "credit-card",
        requirements: ["Valid credit/debit card"]
      }
    ]
  }
  
  return [tapProvider]
}
