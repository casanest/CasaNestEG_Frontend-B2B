import React from "react"
import { CreditCard } from "@medusajs/icons"
import { StoreCollection, StoreProductCategory } from '@medusajs/types'

import Ideal from "@modules/common/icons/ideal"
import Bancontact from "@modules/common/icons/bancontact"
import PayPal from "@modules/common/icons/paypal"

/* Map of payment provider_id to their title and icon. Add in any payment providers you want to use. */
// paymentInfoMap is defined later in the file, so this duplicate is removed to avoid redeclaration errors.

// This only checks if it is native stripe for card payments, it ignores the other stripe-based providers
export const isStripe = (providerId?: string) => {
  return providerId?.startsWith("pp_stripe_")
}
export const isPaypal = (providerId?: string) => {
  return providerId?.startsWith("pp_paypal")
}
export const isManual = (providerId?: string) => {
  return providerId?.startsWith("pp_system_default")
}

export const isSystemDefault = (providerId?: string) => {
  return providerId === "pp_system_default"
}

// Add currencies that don't need to be divided by 100
export const noDivisionCurrencies = [
  "krw",
  "jpy",
  "vnd",
  "clp",
  "pyg",
  "xaf",
  "xof",
  "bif",
  "djf",
  "gnf",
  "kmf",
  "mga",
  "rwf",
  "xpf",
  "htg",
  "vuv",
  "xag",
  "xdr",
  "xau",
]

export const createNavigation = (
  productCategories: StoreProductCategory[],
  collections?: StoreCollection[]
) => [
    {
      name: 'Shop',
      handle: '/store',
      category_children: productCategories
        .filter((category) => !category.parent_category)
        .map((category) => ({
          name: category.name,
          type: 'parent_category',
          handle: `/categories/${category.handle}`,
          category_children: category.category_children.map((subCategory) => ({
            name: subCategory.name,
            handle: `/categories/${subCategory.handle}`,
            icon: null,
            category_children: null,
          })),
        })),
    },
    {
      name: 'Collections',
      handle: '/store',
      category_children: !collections
        ? null
        : collections.map((collection) => ({
          name: collection.title,
          type: 'collection',
          handle: `/collections/${collection.handle}`,
          handle_id: collection.handle,
          category_children: null,
        })),
    },
    {
      name: 'About Us',
      handle: '/about-us',
      category_children: null,
    },
  ]


// PayMob Icon Component
const PayMobIcon = () => (
  <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded flex items-center justify-center">
    <span className="text-white text-xs font-bold">PM</span>
  </div>
)

// Fawry Icon Component
const FawryIcon = () => (
  <div className="w-6 h-6 bg-gradient-to-r from-orange-500 to-red-500 rounded flex items-center justify-center">
    <span className="text-white text-xs font-bold">F</span>
  </div>
)

// Tap Icon Component
const TapIcon = () => (
  <div className="w-6 h-6 bg-gradient-to-r from-green-500 to-blue-500 rounded flex items-center justify-center">
    <span className="text-white text-xs font-bold">T</span>
  </div>
)


export const paymentInfoMap: Record<string, { title: string; icon: React.JSX.Element }> = {
  stripe: {
    title: "Credit card",
    icon: <CreditCard />,
  },
  "stripe-ideal": {
    title: "iDEAL",
    icon: <CreditCard />,
  },
  "stripe-bancontact": {
    title: "Bancontact",
    icon: <CreditCard />,
  },
  "stripe-blik": {
    title: "BLIK",
    icon: <CreditCard />,
  },
  "stripe-giropay": {
    title: "Giropay",
    icon: <CreditCard />,
  },
  "stripe-przelewy24": {
    title: "Przelewy24",
    icon: <CreditCard />,
  },
  paypal: {
    title: "PayPal",
    icon: <CreditCard />,
  },
  manual: {
    title: "Test payment",
    icon: <CreditCard />,
  },
  // New PayMob and Fawry entries
  paymob: {
    title: "PayMob",
    icon: <PayMobIcon />,
  },
  fawry: {
    title: "Fawry",
    icon: <FawryIcon />,
  },
  tap: {
    title: "Tap",
    icon: <TapIcon />,
  },
  pp_system_default: {
    title: "Pay on Delivery",
    icon: <CreditCard />,
  },
}
