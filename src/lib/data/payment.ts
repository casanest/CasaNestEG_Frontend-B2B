"use server"

import { sdk } from "@lib/config"
import { getAuthHeaders, getCacheOptions } from "./cookies"
import { HttpTypes } from "@medusajs/types"

export const listCartPaymentMethods = async (regionId: string) => {
  const headers = {
    ...(await getAuthHeaders()),
  }

  const next = {
    ...(await getCacheOptions("payment_providers")),
  }

  return sdk.client
    .fetch<HttpTypes.StorePaymentProviderListResponse>(
      `/store/payment-providers`,
      {
        method: "GET",
        query: { region_id: regionId, },
        headers,
        next,
        cache: "no-store", // Disable caching for this request to ensure we always get the latest payment providers
      }
    )
    .then(({ payment_providers }) => {
              console.log("payment_providers", payment_providers)
      
      // Temporarily add Tap as a payment provider for testing
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
      
      // Add Tap to the beginning of the array
      const updatedProviders = [tapProvider, ...payment_providers]
      
      return updatedProviders.sort((a, b) => {
        return a.id > b.id ? 1 : -1
      })
    })
    .catch(() => {
      return null
    })
}
