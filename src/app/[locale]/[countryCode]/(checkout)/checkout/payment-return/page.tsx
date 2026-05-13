"use client"

import PaymentReturnContent from "./payment-return-content"

type Props = {
  params: { locale: string; countryCode: string }
}

export default function PaymentReturnPage(props: Props) {
  return <PaymentReturnContent params={props.params} />
}
