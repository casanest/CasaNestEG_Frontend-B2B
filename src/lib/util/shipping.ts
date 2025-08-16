import { sdk } from "@lib/config"

/**
 * Automatically sets a default shipping method for a cart if none is selected
 * @param cartId - The cart ID to set shipping method for
 * @returns Promise<boolean> - True if shipping method was set, false otherwise
 */
export async function setDefaultShippingMethod(cartId: string): Promise<boolean> {
  try {
    console.log(`[Shipping Utility] Setting default shipping method for cart: ${cartId}`)
    
    // Get available shipping options for the cart
    const shippingResponse = await sdk.client.fetch(`/store/shipping-options?cart_id=${cartId}`) as Response
    
    if (!shippingResponse.ok) {
      console.warn(`[Shipping Utility] Failed to fetch shipping options: ${shippingResponse.status}`)
      return false
    }
    
    const { shipping_options } = await shippingResponse.json()
    
    if (!shipping_options || shipping_options.length === 0) {
      console.warn(`[Shipping Utility] No shipping options available for cart: ${cartId}`)
      return false
    }
    
    // Intelligent default shipping method selection
    const selectedShipping = selectBestDefaultShippingMethod(shipping_options)
    
    if (!selectedShipping) {
      console.warn(`[Shipping Utility] Could not select a default shipping method for cart: ${cartId}`)
      return false
    }
    
    // Set the shipping method automatically
    const setShippingResponse = await sdk.client.fetch(`/store/carts/${cartId}/shipping-methods`, {
      method: "POST",
      body: JSON.stringify({
        option_id: selectedShipping.id,
      })
    }) as Response
    
    if (setShippingResponse.ok) {
      console.log(`[Shipping Utility] Successfully set default shipping method: ${selectedShipping.name} (${selectedShipping.amount ? `$${(selectedShipping.amount / 100).toFixed(2)}` : 'calculated'}) for cart: ${cartId}`)
      return true
    } else {
      console.warn(`[Shipping Utility] Failed to set shipping method: ${setShippingResponse.status}`)
      return false
    }
    
  } catch (error: any) {
    console.error(`[Shipping Utility] Error setting default shipping method: ${error.message}`)
    return false
  }
}

/**
 * Intelligently selects the best default shipping method from available options
 * @param shippingOptions - Array of available shipping options
 * @returns The selected shipping option or null if none available
 */
function selectBestDefaultShippingMethod(shippingOptions: any[]): any | null {
  if (!shippingOptions || shippingOptions.length === 0) {
    return null
  }

  // Filter out pickup options - we want delivery shipping
  const deliveryOptions = shippingOptions.filter((option: any) => 
    option.service_zone?.fulfillment_set?.type !== "pickup"
  )

  if (deliveryOptions.length === 0) {
    // If no delivery options, fall back to any available option
    console.log(`[Shipping Utility] No delivery options found, using any available option`)
    return shippingOptions[0]
  }

  // Priority 1: Look for "Standard" or "Regular" shipping methods
  const standardShipping = deliveryOptions.find((option: any) => {
    const name = option.name?.toLowerCase() || ''
    return name.includes('standard') || name.includes('regular') || name.includes('normal')
  })

  if (standardShipping) {
    console.log(`[Shipping Utility] Selected standard shipping method: ${standardShipping.name}`)
    return standardShipping
  }

  // Priority 2: Look for methods with "shipping" in the name
  const shippingMethods = deliveryOptions.filter((option: any) => {
    const name = option.name?.toLowerCase() || ''
    return name.includes('shipping') || name.includes('delivery')
  })

  if (shippingMethods.length > 0) {
    // If multiple shipping methods, prefer the one with lowest price
    const cheapestShipping = shippingMethods.reduce((cheapest: any, current: any) => {
      if (!cheapest.amount || !current.amount) return cheapest
      return current.amount < cheapest.amount ? current : cheapest
    })
    
    console.log(`[Shipping Utility] Selected shipping method: ${cheapestShipping.name}`)
    return cheapestShipping
  }

  // Priority 3: Look for the cheapest delivery option
  const pricedOptions = deliveryOptions.filter((option: any) => option.amount !== undefined && option.amount !== null)
  
  if (pricedOptions.length > 0) {
    const cheapestOption = pricedOptions.reduce((cheapest: any, current: any) => {
      return current.amount < cheapest.amount ? current : cheapest
    })
    
    console.log(`[Shipping Utility] Selected cheapest delivery option: ${cheapestOption.name}`)
    return cheapestOption
  }

  // Priority 4: Fall back to first available delivery option
  const fallbackOption = deliveryOptions[0]
  console.log(`[Shipping Utility] Using fallback delivery option: ${fallbackOption.name}`)
  return fallbackOption
}

/**
 * Checks if a cart has a shipping method set
 * @param cart - The cart object to check
 * @returns boolean - True if shipping method is set, false otherwise
 */
export function hasShippingMethod(cart: any): boolean {
  const cartData = cart.cart || cart
  return !!(cartData.shipping_methods && cartData.shipping_methods.length > 0)
}

/**
 * Ensures a cart has a shipping method set, setting a default one if needed
 * @param cartId - The cart ID to ensure shipping method for
 * @param cart - The cart object (optional, for checking current state)
 * @returns Promise<boolean> - True if shipping method is now set, false if failed
 */
export async function ensureShippingMethod(cartId: string, cart?: any): Promise<boolean> {
  // If cart object is provided, check if it already has shipping method
  if (cart && hasShippingMethod(cart)) {
    console.log(`[Shipping Utility] Cart ${cartId} already has shipping method set`)
    return true
  }
  
  // Try to set default shipping method
  return await setDefaultShippingMethod(cartId)
}

/**
 * Forces setting of a default shipping method even if one already exists
 * @param cartId - The cart ID to set shipping method for
 * @returns Promise<boolean> - True if shipping method was set, false otherwise
 */
export async function forceSetDefaultShippingMethod(cartId: string): Promise<boolean> {
  try {
    console.log(`[Shipping Utility] Force setting default shipping method for cart: ${cartId}`)
    
    // First, remove any existing shipping methods
    const removeResponse = await sdk.client.fetch(`/store/carts/${cartId}/shipping-methods`, {
      method: "DELETE"
    }) as Response
    
    if (!removeResponse.ok) {
      console.warn(`[Shipping Utility] Failed to remove existing shipping methods: ${removeResponse.status}`)
      // Continue anyway, as the new method might still be set
    }
    
    // Now set the default shipping method
    return await setDefaultShippingMethod(cartId)
    
  } catch (error: any) {
    console.error(`[Shipping Utility] Error force setting default shipping method: ${error.message}`)
    return false
  }
} 