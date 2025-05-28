import { Metadata } from "next"
import { notFound } from "next/navigation"
import { getLocale } from "next-intl/server"

import AddressBook from "@modules/account/components/address-book"

import { getRegion } from "@lib/data/regions"
import { retrieveCustomer } from "@lib/data/customer"

export const metadata: Metadata = {
  title: "Addresses",
  description: "View your addresses",
}

export default async function Addresses(props: {
  params: Promise<{ countryCode: string }>
}) {
  const params = await props.params
  const { countryCode } = params
  const customer = await retrieveCustomer()
  const region = await getRegion(countryCode)
  const locale = await getLocale()

  if (!customer || !region) {
    notFound()
  }

  return (
    <div dir={locale === "ar" ? "rtl" : "ltr"} className="w-full text-[#043364]" data-testid="addresses-page-wrapper">
      <div className="mb-8 flex flex-col gap-y-4">
        <h1 className="text-2xl-semi">{locale === "en" ? "Shipping Addresses" : "عناوين الشحن" }</h1>
        <p className="text-base-regular">
          {locale === "en"
            ? "View and update your shipping addresses, you can add as many as you like. Saving your addresses will make them available during checkout."
            : "عرض وتحديث عناوين الشحن الخاصة بك، يمكنك إضافة العديد منها كما تريد. ستجعل حفظ عناوينك متاحة أثناء عملية الدفع."}
        </p>
      </div>
      <AddressBook customer={customer} region={region} />
    </div>
  )
}
