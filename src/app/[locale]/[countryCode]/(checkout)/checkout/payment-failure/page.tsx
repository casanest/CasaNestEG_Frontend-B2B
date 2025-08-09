import { Suspense } from "react"
import { notFound } from "next/navigation"
import PaymentFailureContent from "./payment-failure-content"

type Props = {
  params: {
    locale: string
    countryCode: string
  }
  searchParams: {
    cart_id?: string
    tap_id?: string
    data?: string
    reason?: string
  }
}

export default function PaymentFailurePage({ params, searchParams }: Props) {
  const { cart_id, tap_id, reason } = searchParams

  if (!cart_id || !tap_id) {
    notFound()
  }

  return (
    <div className="content-container">
      <Suspense fallback={<div>Loading...</div>}>
        <PaymentFailureContent
          cartId={cart_id}
          tapId={tap_id}
          reason={reason}
          locale={params.locale}
          countryCode={params.countryCode}
        />
      </Suspense>
    </div>
  )
} 