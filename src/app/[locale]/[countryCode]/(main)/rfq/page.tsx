"use client"

import QuoteForm from "@modules/cart/components/quote-form"
import { useLocale } from "next-intl"

export default function RfqPage() {
  const locale = useLocale()
  return <QuoteForm locale={locale} />
}
