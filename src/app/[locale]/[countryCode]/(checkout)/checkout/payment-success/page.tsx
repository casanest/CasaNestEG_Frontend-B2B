import { Suspense } from "react"
import { notFound } from "next/navigation"
import PaymentSuccessContent from "./payment-success-content"

type Props = {
  params: {
    locale: string
    countryCode: string
  }
  searchParams: {
    cart_id?: string
    tap_id?: string
    data?: string
  }
}

export default function PaymentSuccessPage({ params, searchParams }: Props) {
  const { cart_id, tap_id, data } = searchParams

  if (!cart_id || !tap_id) {
    notFound()
  }

  return (
    <div className="content-container">
      <Suspense fallback={<div>Processing your payment...</div>}>
        <PaymentSuccessContent
          cartId={cart_id}
          tapId={tap_id}
          data={data}
          locale={params.locale}
          countryCode={params.countryCode}
        />
      </Suspense>
    </div>
  )
} 