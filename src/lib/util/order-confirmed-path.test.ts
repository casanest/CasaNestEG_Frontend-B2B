import { describe, expect, it } from "vitest"

import { fallbackLng, languages } from "@lib/i18n/settings"

import {
  buildOrderConfirmedPath,
  normalizeAppLocale,
} from "./order-confirmed-path"

describe("buildOrderConfirmedPath", () => {
  it("builds /{locale}/{countryCode}/order/{id}/confirmed", () => {
    expect(buildOrderConfirmedPath("en", "sa", "order_01ABC")).toBe(
      "/en/sa/order/order_01ABC/confirmed"
    )
  })

  it("normalizes casing", () => {
    expect(buildOrderConfirmedPath("EN", "SA", "ord_x")).toBe(
      "/en/sa/order/ord_x/confirmed"
    )
  })
})

describe("normalizeAppLocale", () => {
  it("returns locale when it is allowed", () => {
    expect(normalizeAppLocale("en", languages, fallbackLng)).toBe("en")
  })

  it("returns fallback when locale is unknown", () => {
    expect(normalizeAppLocale("xx", languages, fallbackLng)).toBe(fallbackLng)
  })
})
