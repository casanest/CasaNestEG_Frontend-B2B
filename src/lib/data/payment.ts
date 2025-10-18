"use server"

import { sdk } from "@lib/config"
import { getAuthHeaders, getCacheOptions } from "./cookies"
import { HttpTypes } from "@medusajs/types"

export const listCartPaymentMethods = async (regionId: string) => {
  // Return both Tap and System Default payment providers
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

  const systemDefaultProvider = {
    id: "pp_system_default",
    title: "Pay on Delivery",
    description: "Complete your order and pay when delivered",
    icon: "credit-card",
    features: [
      "Pay when your order arrives",
      "Order confirmation required",
      "Delivery instructions provided",
      "Secure order handling"
    ],
    supported_currencies: ["USD", "EUR", "EGP", "KWD", "SAR", "AED"],
    processing_time: "Manual",
    fees: "No additional fees",
    methods: [
      {
        id: "delivery",
        title: "Pay on Delivery",
        description: "Complete order and pay when delivered",
        icon: "credit-card",
        requirements: ["Order completion", "Delivery confirmation"]
      }
    ]
  }
  
  return [tapProvider, systemDefaultProvider]
}
