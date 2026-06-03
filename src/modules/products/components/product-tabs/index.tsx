"use client"

import Back from "@modules/common/icons/back"
import FastDelivery from "@modules/common/icons/fast-delivery"
import Refresh from "@modules/common/icons/refresh"

import Accordion from "./accordion"
import { HttpTypes } from "@medusajs/types"
import { useLocale } from "next-intl"

type ProductTabsProps = {
  product: HttpTypes.StoreProduct
}

const ProductTabs = ({ product }: ProductTabsProps) => {
  const locale = useLocale()
  const tabs = [
    {
      label: locale === "ar" ? "معلومات المنتج" : "Product Information",
      component: <ProductInfoTab product={product} />,
    },
    {
      label: locale === "ar" ? "معلومات الشحن" : "Shipping Information",
      component: <ShippingInfoTab />,
    },
  ]

  return (
    <div className="w-full">
      <Accordion type="multiple">
        {tabs.map((tab, i) => (
          <Accordion.Item
            key={i}
            title={tab.label}
            headingSize="medium"
            value={tab.label}
          // className="text-[#043364]"
          >
            {tab.component}
          </Accordion.Item>
        ))}
      </Accordion>
    </div>
  )
}

const ProductInfoTab = ({ product }: ProductTabsProps) => {
  const locale = useLocale()
  return (
    <div className="text-small-regular py-8">
      <div className="grid grid-cols-2 gap-x-8">
        <div className="flex flex-col gap-y-4">
          <div>
            <span className="font-semibold">{locale === "ar" ? "المواد" : "Materials"}</span>
            <p>{product.material ? product.material : "-"}</p>
          </div>
          <div>
            <span className="font-semibold">{locale === "ar" ? "دولة الإصدار" : "Country of origin"}</span>
            <p>{product.origin_country ? product.origin_country : "-"}</p>
          </div>
          <div>
            <span className="font-semibold">{locale === "ar" ? "نوع المنتج" : "Product type"}</span>
            <p>{product.type ? product.type.value : "-"}</p>
          </div>
        </div>
        <div className="flex flex-col gap-y-4">
          <div>
            <span className="font-semibold">{locale === "ar" ? "الوزن" : "Weight"}</span>
            <p>{product.weight ? `${product.weight} g` : "-"}</p>
          </div>
          <div>
            <span className="font-semibold">{locale === "ar" ? "الإبعادات" : "Dimensions"}</span>
            <p>
              {product.length && product.width && product.height
                ? `${product.length}L x ${product.width}W x ${product.height}H`
                : "-"}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

const ShippingInfoTab = () => {
  const locale = useLocale()
  return (
    <div className="text-small-regular py-8">
      <div className="grid grid-cols-1 gap-y-8">
        <div className="flex items-start gap-x-2">
          <FastDelivery />
          <div>
            <span className="font-semibold">
              {locale === "ar" ? "شحن لجميع المحافظات" : "Nationwide Shipping"}
            </span>
            <p className="max-w-sm">
              {locale === "ar"
                ? "توصيل سريع إلى جميع أنحاء مصر مع متابعة مستمرة لحالة الشحنة."
                : "Fast delivery across all Egyptian governorates with continuous shipment tracking."}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-x-2">
          <Refresh />
          <div>
            <span className="font-semibold">
              {locale === "ar" ? "استبدال سهل للمنتجات" : "Easy Product Exchange"}
            </span>
            <p className="max-w-sm">
              {locale === "ar"
                ? "في حالة وجود مشكلة بالمنتج أو عدم ملاءمته، يمكن طلب الاستبدال وفقًا لسياسة المتجر."
                : "If there is an issue with the product or it is not suitable, you can request an exchange according to our store policy."}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-x-2">
          <Back />
          <div>
            <span className="font-semibold">
              {locale === "ar" ? "استرجاع مرن" : "Flexible Returns"}
            </span>
            <p className="max-w-sm">
              {locale === "ar"
                ? "نوفر إمكانية الاسترجاع للمنتجات المؤهلة طبقًا لشروط وسياسة الاسترجاع الخاصة بكل منتج."
                : "Eligible products can be returned according to the return terms and policy applicable to each product."}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductTabs
