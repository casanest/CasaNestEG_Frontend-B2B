import React from "react"
import PaymentContainer from "./index"
 
type SystemDefaultContainerProps = {
  paymentProviderId: string
  selectedPaymentOptionId: string | null
  paymentInfoMap: Record<
    string,
    { title: { en: string; ar: string }; icon: React.JSX.Element }
  > 
  disabled?: boolean
}

const SystemDefaultContainer: React.FC<SystemDefaultContainerProps> = ({
  paymentProviderId,
  selectedPaymentOptionId,
  paymentInfoMap,
  disabled = false,
}) => {
  return (
    <PaymentContainer
      paymentProviderId={paymentProviderId}
      selectedPaymentOptionId={selectedPaymentOptionId}
      paymentInfoMap={paymentInfoMap}
      disabled={disabled}
    />
  )
}

export default SystemDefaultContainer