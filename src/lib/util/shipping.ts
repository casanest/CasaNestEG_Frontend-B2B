import "server-only"
import { sdk } from "@lib/config"
import { getAuthHeaders, getCacheTag } from "@lib/data/cookies"
import { revalidateTag } from "next/cache"

/**
 * Automatically sets a default shipping method for a cart if none is selected
 * @param cartId - The cart ID to set shipping method for
 * @returns Promise<boolean> - True if shipping method was set, false otherwise
 */
export async function setDefaultShippingMethod(cartId: string): Promise<boolean> {
  try {
    console.log(`[Shipping Utility] Setting default shipping method for cart: ${cartId}`)
    
    const headers = await getAuthHeaders()
    
    // First, check if cart has a shipping address (required for shipping methods)
    const cartResponse = await sdk.client.fetch(`/store/carts/${cartId}`, {
      headers,
      query: {
        fields: "shipping_address",
      },
      cache: "no-store",
    }) as Response
    
    if (cartResponse.ok) {
      const { cart } = await cartResponse.json()
      if (!cart.shipping_address) {
        console.error(`[Shipping Utility] Cart ${cartId} has no shipping address - cannot set shipping method`)
        return false
      }
      console.log(`[Shipping Utility] Cart ${cartId} has shipping address`)
    } else {
      console.warn(`[Shipping Utility] Could not check cart shipping address`)
    }
    
    // Get available shipping options for the cart
    const shippingResponse = await sdk.client.fetch(`/store/shipping-options?cart_id=${cartId}`, {
      headers,
      cache: "no-store",
    }) as Response
    
    if (!shippingResponse.ok) {
      const errorText = await shippingResponse.text()
      console.error(`[Shipping Utility] Failed to fetch shipping options: ${shippingResponse.status}`, errorText)
      return false
    }
    
    const { shipping_options } = await shippingResponse.json()
    console.log(`[Shipping Utility] Found ${shipping_options?.length || 0} shipping options for cart: ${cartId}`)
    
    if (!shipping_options || shipping_options.length === 0) {
      console.error(`[Shipping Utility] No shipping options available for cart: ${cartId}`)
      return false
    }
    
    // Intelligent default shipping method selection
    const selectedShipping = selectBestDefaultShippingMethod(shipping_options)
    
    if (!selectedShipping) {
      console.error(`[Shipping Utility] Could not select a default shipping method for cart: ${cartId}`)
      return false
    }
    
    console.log(`[Shipping Utility] Selected shipping method: ${selectedShipping.name} (ID: ${selectedShipping.id})`)
    
    // Set the shipping method automatically
    const setShippingResponse = await sdk.client.fetch(`/store/carts/${cartId}/shipping-methods`, {
      method: "POST",
      headers: {
        ...headers,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        option_id: selectedShipping.id,
      }),
    }) as Response
    
    if (setShippingResponse.ok) {
      console.log(`[Shipping Utility] Successfully set default shipping method: ${selectedShipping.name} for cart: ${cartId}`)
      
      // Revalidate the cart cache to ensure fresh data on next fetch
      try {
        const cartCacheTag = await getCacheTag("carts")
        if (cartCacheTag) {
          revalidateTag(cartCacheTag)
        }
      } catch (revalidateError) {
        console.warn(`[Shipping Utility] Could not revalidate cache: ${revalidateError}`)
      }
      
      // Give the API a moment to update the cart
      await new Promise(resolve => setTimeout(resolve, 200))
      
      // Verify the shipping method was actually set on the cart
      try {
        const verifyResponse = await sdk.client.fetch(`/store/carts/${cartId}`, {
          headers,
          query: {
            fields: "+shipping_methods",
          },
          cache: "no-store",
        }) as Response
        
        if (verifyResponse.ok) {
          const { cart: verifiedCart } = await verifyResponse.json()
          console.log(`[Shipping Utility] Cart verification - shipping_methods:`, verifiedCart.shipping_methods)
          if (verifiedCart.shipping_methods && verifiedCart.shipping_methods.length > 0) {
            console.log(`[Shipping Utility] Verified shipping method is set on cart: ${cartId}`)
            return true
          } else {
            console.error(`[Shipping Utility] Shipping method not found on cart after setting: ${cartId}`)
            console.error(`[Shipping Utility] Cart state:`, JSON.stringify(verifiedCart, null, 2))
            return false
          }
        } else {
          const errorText = await verifyResponse.text()
          console.error(`[Shipping Utility] Failed to verify cart: ${verifyResponse.status}`, errorText)
          return false
        }
      } catch (verifyError: any) {
        console.error(`[Shipping Utility] Could not verify shipping method: ${verifyError.message}`)
        return false
      }
    } else {
      const errorText = await setShippingResponse.text()
      console.error(`[Shipping Utility] Failed to set shipping method: ${setShippingResponse.status}`, errorText)
      return false
    }
    
  } catch (error: any) {
    console.error(`[Shipping Utility] Error setting default shipping method:`, error.message)
    console.error(error)
    return false
  }
}

/**
 * Intelligently selects the best default shipping method from available options
 * This function selects from the actual API data, not hardcoded values
 * @param shippingOptions - Array of available shipping options from the API
 * @returns The selected shipping option or null if none available
 */
function selectBestDefaultShippingMethod(shippingOptions: any[]): any | null {
  if (!shippingOptions || shippingOptions.length === 0) {
    console.log(`[Shipping Utility] No shipping options provided`)
    return null
  }

  console.log(`[Shipping Utility] Selecting from ${shippingOptions.length} shipping options from API:`, 
    shippingOptions.map(opt => ({ 
      id: opt.id, 
      name: opt.name, 
      price_type: opt.price_type,
      amount: opt.amount,
      rules: opt.rules
    })))

  // Filter out pickup options - we want delivery shipping
  const deliveryOptions = shippingOptions.filter((option: any) => {
    // Check if it's not pickup type
    const isPickup = option.service_zone?.fulfillment_set?.type === "pickup"
    const isDelivery = !isPickup
    
    // Also check if it's an outbound/regular shipping option (not return)
    const hasReturnRule = option.rules?.find((rule: any) => 
      rule.attribute === "is_return" && rule.value === "true"
    )
    const isOutbound = !hasReturnRule
    
    return isDelivery && isOutbound
  })

  if (deliveryOptions.length === 0) {
    // If no delivery options, fall back to any available option
    console.log(`[Shipping Utility] No delivery options found, using any available option`)
    return shippingOptions[0]
  }

  console.log(`[Shipping Utility] Found ${deliveryOptions.length} delivery options:`, 
    deliveryOptions.map(opt => ({ name: opt.name, price_type: opt.price_type })))

  // Priority 1: Look for options with flat pricing (most reliable for default)
  const flatPriceOptions = deliveryOptions.filter((option: any) => 
    option.price_type === "flat"
  )
  
  if (flatPriceOptions.length > 0) {
    // If they have amounts, select the cheapest, otherwise select the first one
    const optionsWithAmount = flatPriceOptions.filter(opt => opt.amount != null)
    
    if (optionsWithAmount.length > 0) {
      const selected = optionsWithAmount.reduce((cheapest: any, current: any) => {
        return current.amount < cheapest.amount ? current : cheapest
      })
      console.log(`[Shipping Utility] Selected cheapest flat-rate shipping: ${selected.name} (${selected.amount})`)
      return selected
    } else {
      // No amounts available, just use the first flat-rate option
      const selected = flatPriceOptions[0]
      console.log(`[Shipping Utility] Selected flat-rate shipping (no price available): ${selected.name}`)
      return selected
    }
  }

  // Priority 2: Select any delivery option with an amount
  const pricedOptions = deliveryOptions.filter((option: any) => 
    option.amount !== null && option.amount !== undefined && option.amount !== 0
  )
  
  if (pricedOptions.length > 0) {
    const cheapestOption = pricedOptions.reduce((cheapest: any, current: any) => {
      return current.amount < cheapest.amount ? current : cheapest
    })
    console.log(`[Shipping Utility] Selected cheapest API option: ${cheapestOption.name} (${cheapestOption.amount})`)
    return cheapestOption
  }

  // Priority 3: Use the first delivery option from API (as fallback)
  const fallbackOption = deliveryOptions[0]
  console.log(`[Shipping Utility] Using first API delivery option: ${fallbackOption.name}`)
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
  
  // If no cart object provided, fetch the current cart to check if shipping is already set
  if (!cart) {
    try {
      const headers = await getAuthHeaders()
      const cartResponse = await sdk.client.fetch(`/store/carts/${cartId}`, {
        headers,
        query: {
          fields: "+shipping_methods.name",
        },
        cache: "no-store",
      }) as Response
      
      if (cartResponse.ok) {
        const { cart: currentCart } = await cartResponse.json()
        if (hasShippingMethod(currentCart)) {
          console.log(`[Shipping Utility] Cart ${cartId} already has shipping method set (verified from server)`)
          return true
        }
      }
    } catch (error) {
      console.warn(`[Shipping Utility] Could not verify current cart state: ${error}`)
      // Continue to set shipping anyway
    }
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
    
    const headers = await getAuthHeaders()
    
    // First, check if cart already has a shipping method
    console.log(`[Shipping Utility] Checking current cart state for cart: ${cartId}`)
    const cartCheckResponse = await sdk.client.fetch(`/store/carts/${cartId}`, {
      headers,
      query: {
        fields: "shipping_address,shipping_methods",
      },
      cache: "no-store",
    }) as Response
    
    if (cartCheckResponse.ok) {
      const { cart } = await cartCheckResponse.json()
      console.log(`[Shipping Utility] Cart ${cartId} - has_shipping_address: ${!!cart.shipping_address}, shipping_methods: ${cart.shipping_methods?.length || 0}`)
      
      if (!cart.shipping_address) {
        console.error(`[Shipping Utility] Cart ${cartId} has no shipping address - cannot set shipping method`)
        return false
      }
      
      // If cart already has shipping methods, just verify and return
      if (cart.shipping_methods && cart.shipping_methods.length > 0) {
        console.log(`[Shipping Utility] Cart ${cartId} already has shipping methods - no need to set`)
        return true
      }
    }
    
    // First, remove any existing shipping methods (if any)
    console.log(`[Shipping Utility] Removing existing shipping methods from cart: ${cartId}`)
    const removeResponse = await sdk.client.fetch(`/store/carts/${cartId}/shipping-methods`, {
      method: "DELETE",
      headers,
    }) as Response
    
    if (!removeResponse.ok) {
      const errorText = await removeResponse.text()
      console.warn(`[Shipping Utility] Failed to remove existing shipping methods: ${removeResponse.status}`, errorText)
      // Continue anyway, as there might not have been any to remove
    } else {
      console.log(`[Shipping Utility] Successfully removed existing shipping methods from cart: ${cartId}`)
    }
    
    // Wait for the delete to propagate
    await new Promise(resolve => setTimeout(resolve, 200))
    
    // Now set the default shipping method
    const result = await setDefaultShippingMethod(cartId)
    
    if (!result) {
      console.error(`[Shipping Utility] Failed to set default shipping method after force removal for cart: ${cartId}`)
      return false
    }
    
    console.log(`[Shipping Utility] Shipping method set successfully for cart: ${cartId}`)
    
    // Final verification - fetch cart and verify shipping is set
    try {
      const verifyResponse = await sdk.client.fetch(`/store/carts/${cartId}`, {
        headers,
        query: {
          fields: "+shipping_methods",
        },
        cache: "no-store",
      }) as Response
      
      if (verifyResponse.ok) {
        const { cart: verifiedCart } = await verifyResponse.json()
        console.log(`[Shipping Utility] Final verification - shipping_methods:`, verifiedCart.shipping_methods)
        if (verifiedCart.shipping_methods && verifiedCart.shipping_methods.length > 0) {
          console.log(`[Shipping Utility] Force set verified - shipping method confirmed on cart: ${cartId}`)
          return true
        } else {
          console.error(`[Shipping Utility] Force set failed - shipping method not on cart: ${cartId}`)
          console.error(`[Shipping Utility] Cart state:`, JSON.stringify(verifiedCart, null, 2))
          return false
        }
      } else {
        const errorText = await verifyResponse.text()
        console.error(`[Shipping Utility] Failed to verify cart after force set: ${verifyResponse.status}`, errorText)
      }
    } catch (verifyError: any) {
      console.error(`[Shipping Utility] Could not verify force set: ${verifyError.message}`)
      console.error(verifyError)
      return false
    }
    
    return result
    
  } catch (error: any) {
    console.error(`[Shipping Utility] Error force setting default shipping method:`, error.message)
    console.error(error)
    return false
  }
} 