"use client"

import type React from "react"
import { RadioGroup } from "@headlessui/react"
import { Text, clx } from "@medusajs/ui"
import { useState } from "react"
import { Smartphone, MapPin, CreditCard, Copy, Check } from "lucide-react"

interface FawryContainerProps {
  paymentProviderId: string
  selectedPaymentOptionId: string
  paymentInfoMap: any
  setError: (error: string | null) => void
  setPaymentComplete: (complete: boolean) => void
  cart: any
  locale: string
}

export const FawryContainer = ({
  paymentProviderId,
  selectedPaymentOptionId,
  paymentInfoMap,
  setError,
  setPaymentComplete,
  cart,
  locale,
}: FawryContainerProps) => {
  const [selectedMethod, setSelectedMethod] = useState<string>("")
  const [phoneNumber, setPhoneNumber] = useState<string>("")
  const [referenceCode, setReferenceCode] = useState<string>("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [copied, setCopied] = useState(false)
  const [expiryTime, setExpiryTime] = useState<string>("")

  const isSelected = selectedPaymentOptionId === paymentProviderId
  const isRTL = locale === "ar"

  const fawryMethods = [
    {
      id: "retail",
      title: locale === "ar" ? "نقاط البيع" : "Retail Locations",
      description: locale === "ar" ? "ادفع في أي فرع فوري أو نقطة بيع" : "Pay at any Fawry location or retail point",
      icon: <MapPin className="w-5 h-5" />,
      features: [
        locale === "ar" ? "190,000+ موقع في مصر" : "190,000+ locations in Egypt",
        locale === "ar" ? "متاح 24 ساعة" : "Available 24/7",
        locale === "ar" ? "بدون رسوم إضافية" : "No additional fees",
        locale === "ar" ? "تأكيد فوري" : "Instant confirmation",
      ],
    },
    {
      id: "mobile",
      title: locale === "ar" ? "فوري موبايل" : "Fawry Mobile",
      description: locale === "ar" ? "ادفع باستخدام تطبيق فوري" : "Pay using Fawry mobile app",
      icon: <Smartphone className="w-5 h-5" />,
      features: [
        locale === "ar" ? "دفع من أي مكان" : "Pay from anywhere",
        locale === "ar" ? "دفع فوري" : "Instant payment",
        locale === "ar" ? "سجل المدفوعات" : "Payment history",
        locale === "ar" ? "معاملات آمنة" : "Secure transactions",
      ],
    },
    {
      id: "card",
      title: locale === "ar" ? "بطاقة فوري" : "Fawry Card",
      description: locale === "ar" ? "ادفع باستخدام بطاقة فوري المدفوعة مسبقاً" : "Pay with Fawry prepaid card",
      icon: <CreditCard className="w-5 h-5" />,
      features: [
        locale === "ar" ? "استخدم رصيد البطاقة" : "Use card balance",
        locale === "ar" ? "متاح في أجهزة الصراف" : "Available at ATMs",
        locale === "ar" ? "دفع سريع" : "Quick payment",
        locale === "ar" ? "معاملات آمنة" : "Secure transactions",
      ],
    },
  ]

  const validatePhoneNumber = (phone: string) => {
    const egyptianPhoneRegex = /^(\+20|0)?1[0125]\d{8}$/
    return egyptianPhoneRegex.test(phone.replace(/\s/g, ""))
  }

  const handleMethodSelect = async (method: string) => {
    setSelectedMethod(method)
    setError(null)
    setReferenceCode("")
    setExpiryTime("")

    if (method === "retail") {
      await generateReferenceCode(method)
    } else {
      setPaymentComplete(false)
    }
  }

  const generateReferenceCode = async (method: string = selectedMethod) => {
    setIsGenerating(true)
    try {
      const response = await fetch("/api/payments/fawry/generate-code", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cart_id: cart.id,
          payment_method: method,
          amount: cart.total,
          currency: cart.region.currency_code,
          phone_number: phoneNumber,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to generate reference code")
      }

      const data = await response.json()
      setReferenceCode(data.reference_code)
      setExpiryTime(data.expiration_time)
      setPaymentComplete(true)
    } catch (error: any) {
      setError(error.message || (locale === "ar" ? "فشل في إنشاء رمز المرجع" : "Failed to generate reference code"))
    } finally {
      setIsGenerating(false)
    }
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const phone = e.target.value
    setPhoneNumber(phone)

    if ((selectedMethod === "mobile" || selectedMethod === "card") && validatePhoneNumber(phone)) {
      setPaymentComplete(true)
      setError(null)
    } else if (selectedMethod === "mobile" || selectedMethod === "card") {
      setPaymentComplete(false)
      if (phone.length > 0) {
        setError(locale === "ar" ? "رقم الهاتف غير صحيح" : "Invalid phone number")
      }
    }
  }

  const copyReferenceCode = async () => {
    try {
      await navigator.clipboard.writeText(referenceCode)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement("textarea")
      textArea.value = referenceCode
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand("copy")
      document.body.removeChild(textArea)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const formatExpiryTime = (isoString: string) => {
    const date = new Date(isoString)
    return date.toLocaleString(locale === "ar" ? "ar-EG" : "en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div
      className={clx("flex flex-col gap-y-4 border-b border-gray-200 last:border-b-0", {
        "pb-8": isSelected,
        "pb-4": !isSelected,
      })}
    >
      <RadioGroup.Option
        value={paymentProviderId}
        className={clx(
          "flex items-center justify-between w-full p-4 border border-gray-200 rounded-lg cursor-pointer transition-all",
          {
            "border-[#043364] bg-blue-50": isSelected,
            "hover:border-gray-300": !isSelected,
          },
        )}
      >
        <div className="flex items-center gap-x-4">
          <RadioGroup.Label className="flex items-center gap-x-3 cursor-pointer">
            <div
              className={clx("w-4 h-4 rounded-full border-2 flex items-center justify-center", {
                "border-[#043364]": isSelected,
                "border-gray-300": !isSelected,
              })}
            >
              {isSelected && <div className="w-2 h-2 rounded-full bg-[#043364]" />}
            </div>
            <div className="flex items-center gap-x-2">
              {paymentInfoMap[paymentProviderId]?.icon}
              <Text className="text-base-regular">{paymentInfoMap[paymentProviderId]?.title || "Fawry"}</Text>
            </div>
          </RadioGroup.Label>
        </div>
      </RadioGroup.Option>

      {isSelected && (
        <div className="px-4 pb-4">
          <div className="space-y-4">
            <Text className="text-sm text-gray-600 mb-4">
              {locale === "ar" ? "اختر طريقة الدفع عبر فوري:" : "Choose your Fawry payment method:"}
            </Text>

            <div className="grid gap-3">
              {fawryMethods.map((method) => (
                <div
                  key={method.id}
                  className={clx("border rounded-lg p-4 cursor-pointer transition-all", {
                    "border-[#043364] bg-blue-50": selectedMethod === method.id,
                    "border-gray-200 hover:border-gray-300": selectedMethod !== method.id,
                  })}
                  onClick={() => handleMethodSelect(method.id)}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={clx("w-4 h-4 rounded-full border-2 flex items-center justify-center mt-1", {
                        "border-[#043364]": selectedMethod === method.id,
                        "border-gray-300": selectedMethod !== method.id,
                      })}
                    >
                      {selectedMethod === method.id && <div className="w-2 h-2 rounded-full bg-[#043364]" />}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {method.icon}
                        <Text className="font-medium">{method.title}</Text>
                      </div>
                      <Text className="text-sm text-gray-600 mb-2">{method.description}</Text>
                      <div className="space-y-1">
                        {method.features.map((feature, index) => (
                          <Text key={index} className="text-xs text-gray-500 flex items-center gap-1">
                            <span className="w-1 h-1 bg-green-500 rounded-full"></span>
                            {feature}
                          </Text>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {selectedMethod === "retail" && referenceCode && (
              <div className="mt-4 p-4 bg-orange-50 border border-orange-200 rounded-lg">
                <Text className="font-medium text-orange-800 mb-3">
                  {locale === "ar" ? "رمز المرجع الخاص بك:" : "Your Reference Code:"}
                </Text>
                <div className="bg-white p-4 rounded border text-center relative">
                  <Text className="text-3xl font-bold text-orange-600 tracking-wider mb-2">{referenceCode}</Text>
                  <button
                    onClick={copyReferenceCode}
                    className="absolute top-2 right-2 p-1 text-gray-500 hover:text-gray-700"
                    title={locale === "ar" ? "نسخ الرمز" : "Copy code"}
                  >
                    {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
                {expiryTime && (
                  <Text className="text-sm text-orange-700 mt-2">
                    {locale === "ar" ? "ينتهي في:" : "Expires at:"} {formatExpiryTime(expiryTime)}
                  </Text>
                )}
                <div className="mt-3 p-3 bg-orange-100 rounded">
                  <Text className="text-sm text-orange-800 font-medium mb-2">
                    {locale === "ar" ? "تعليمات الدفع:" : "Payment Instructions:"}
                  </Text>
                  <ol className="text-sm text-orange-700 space-y-1">
                    <li>
                      {locale === "ar"
                        ? "1. اذهب إلى أي فرع فوري أو نقطة بيع"
                        : "1. Visit any Fawry location or retail point"}
                    </li>
                    <li>
                      {locale === "ar" ? "2. أعط الرمز المرجعي للموظف" : "2. Provide the reference code to the cashier"}
                    </li>
                    <li>
                      {locale === "ar"
                        ? `3. ادفع ${cart.total} ${cart.region.currency_code}`
                        : `3. Pay ${cart.total} ${cart.region.currency_code}`}
                    </li>
                    <li>
                      {locale === "ar" ? "4. احتفظ بالإيصال كإثبات للدفع" : "4. Keep the receipt as proof of payment"}
                    </li>
                  </ol>
                </div>
              </div>
            )}

            {(selectedMethod === "mobile" || selectedMethod === "card") && (
              <div className="mt-4 space-y-3">
                <label className="block text-sm font-medium text-gray-700">
                  {locale === "ar" ? "رقم الهاتف" : "Phone Number"}
                </label>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={handlePhoneChange}
                  placeholder={locale === "ar" ? "01xxxxxxxxx" : "01xxxxxxxxx"}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#043364] focus:border-transparent"
                  dir={isRTL ? "rtl" : "ltr"}
                />
                <Text className="text-xs text-gray-500">
                  {locale === "ar" ? "أدخل رقم هاتفك المسجل في فوري" : "Enter your Fawry registered phone number"}
                </Text>
                {phoneNumber && validatePhoneNumber(phoneNumber) && (
                  <button
                    onClick={() => generateReferenceCode()}
                    disabled={isGenerating}
                    className="w-full bg-[#043364] text-white py-2 px-4 rounded-md hover:bg-blue-900 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isGenerating
                      ? locale === "ar"
                        ? "جاري إنشاء الرمز..."
                        : "Generating code..."
                      : locale === "ar"
                        ? "إنشاء رمز الدفع"
                        : "Generate Payment Code"}
                  </button>
                )}
              </div>
            )}

            {selectedMethod && (selectedMethod !== "retail" || referenceCode) && !isGenerating && (
              <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                <Text className="text-sm text-green-800">
                  {locale === "ar"
                    ? "✓ طريقة الدفع جاهزة. انقر على 'متابعة' لإكمال عملية الدفع."
                    : "✓ Payment method ready. Click 'Continue' to complete payment."}
                </Text>
              </div>
            )}

            {isGenerating && (
              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <Text className="text-sm text-blue-800">
                  {locale === "ar" ? "جاري إنشاء رمز المرجع..." : "Generating reference code..."}
                </Text>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
export default FawryContainer