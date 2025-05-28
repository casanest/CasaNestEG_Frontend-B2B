import { Metadata } from "next"

import OrderOverview from "@modules/account/components/order-overview"
import { notFound } from "next/navigation"
import { listOrders } from "@lib/data/orders"
import Divider from "@modules/common/components/divider"
import TransferRequestForm from "@modules/account/components/transfer-request-form"
import { getLocale } from "next-intl/server"

export const metadata: Metadata = {
  title: "Orders",
  description: "Overview of your previous orders.",
}

export default async function Orders() {
  const locale = await getLocale()
  const orders = await listOrders()

  if (!orders) {
    notFound()
  }

  return (
    <div dir={locale === "ar" ? "rtl" : "ltr"} className="w-full" data-testid="orders-page-wrapper">
      <div className="mb-8 flex flex-col gap-y-4 text-[#043364]">
        <h1 className="text-2xl-semi">{locale === "en" ? "Orders" : "طلباتك"}</h1>
        <p className="text-base-regular">
          {locale === "ar" ? "عرض طلباتك وتحديثها، يمكنك اضافة كثيرة من الطلبات." : "View your previous orders and their status. You can also create returns or exchanges for your orders if needed."}
        </p>
      </div>
      <div>
        <OrderOverview orders={orders} />
        <Divider className="my-16" />
        <TransferRequestForm />
      </div>
    </div>
  )
}
