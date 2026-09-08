"use client"

import { useState, useRef, useCallback } from "react"
import { useRouter } from "next/navigation"
import { useCartStore, QuoteItem } from "@lib/store/useCartStore"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Thumbnail from "@modules/products/components/thumbnail"
import { CloudUpload, X, AlertCircle, Loader2, ArrowRight, Minus, Plus, Trash2, ChevronDown } from "lucide-react"
import { useLocale } from "next-intl"
import { convertToLocale } from "@lib/util/money"

type QuoteFormProps = {
  locale: string
}

type SubmitStatus = "idle" | "loading" | "success" | "error"

const governorates = [
  { en: "Cairo", ar: "القاهرة" },
  { en: "Giza", ar: "الجيزة" },
  { en: "Alexandria", ar: "الإسكندرية" },
  { en: "Dakahlia", ar: "الدقهلية" },
  { en: "Red Sea", ar: "البحر الأحمر" },
  { en: "Beheira", ar: "البحيرة" },
  { en: "Faiyum", ar: "الفيوم" },
  { en: "Gharbia", ar: "الغربية" },
  { en: "Ismailia", ar: "الإسماعيلية" },
  { en: "Menofia", ar: "المنوفية" },
  { en: "Minya", ar: "المنيا" },
  { en: "Qalyubia", ar: "القليوبية" },
  { en: "New Valley", ar: "الوادي الجديد" },
  { en: "Suez", ar: "السويس" },
  { en: "Aswan", ar: "أسوان" },
  { en: "Asyut", ar: "أسيوط" },
  { en: "Beni Suef", ar: "بني سويف" },
  { en: "Port Said", ar: "بورسعيد" },
  { en: "Damietta", ar: "دمياط" },
  { en: "Sharqia", ar: "الشرقية" },
  { en: "South Sinai", ar: "جنوب سيناء" },
  { en: "Kafr El Sheikh", ar: "كفر الشيخ" },
  { en: "Matrouh", ar: "مطروح" },
  { en: "Luxor", ar: "الأقصر" },
  { en: "Qena", ar: "قنا" },
  { en: "North Sinai", ar: "شمال سيناء" },
  { en: "Sohag", ar: "سوهاج" },
]

export default function QuoteForm({ locale }: QuoteFormProps) {
  const isRTL = locale === "ar"
  const router = useRouter()
  const items = useCartStore((state) => state.items)
  const updateItemQuantity = useCartStore((state) => state.updateItemQuantity)
  const removeItem = useCartStore((state) => state.removeItem)
  const clearItems = useCartStore((state) => state.clearItems)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [formData, setFormData] = useState({
    fullName: "",
    city: "",
    address: "",
    email: "",
    phone: "",
    company: "",
    message: "",
  })
  const [files, setFiles] = useState<File[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>("idle")
  const [errorMessage, setErrorMessage] = useState("")

  // Translations
  const homeText = isRTL ? "الرئيسية" : "Home"
  const quoteListText = isRTL ? "قائمة الأسعار" : "Quote List"
  const requestQuoteText = isRTL ? "اطلب عرض السعر" : "Request Quote"
  const titleText = isRTL ? "اطلب عرض السعر الخاص بك" : "Request Your Quote"
  const badgeText = isRTL ? "بدون دفع، بدون التزام" : "No Payment, No Obligation"
  const descriptionText = isRTL
    ? "يرجى تقديم بياناتك أدناه. هذه هي الخطوة الأخيرة قبل أن يقوم خبراء المشتريات بمعالجة قائمتك وإنشاء عرض السعر الرسمي."
    : "Please provide your details below. This is the final step before our procurement specialists process your list and generate your official price quote."

  const cardHeading = isRTL
    ? "معلومات جهة المشتريات"
    : "Procurement Contact Information"
  const cardSubheading = isRTL
    ? "املأ المعلومات المطلوبة لتعيين مدير حساب لطلبك."
    : "Fill out the required information to assign an account manager to your order."

  const fullNameLabel = isRTL ? "الاسم الكامل" : "Full Name"
  const fullNamePlaceholder = isRTL ? "مثال: علي احمد ابراهيم" : "e.g. Aly"
  const cityLabel = isRTL ? "المحافظة" : "Governorate"
  const cityPlaceholder = isRTL ? "مثال: المنصورة" : "e.g. Mansoura"
  const addressLabel = isRTL ? "العنوان" : "Address"
  const addressPlaceholder = isRTL ? "مثال: ١٢٣ الشارع الرئيسي، المنصورة" : "e.g. 123 Main St, Mansoura"
  const emailLabel = isRTL ? "البريد الإلكتروني (اختياري)" : "Email Address (Optional)"
  const emailPlaceholder = isRTL ? "مثال: aliAhmed123@gmail.com" : "e.g. aly@company.com"
  const phoneLabel = isRTL ? "رقم الهاتف" : "Phone Number"
  const phonePlaceholder = isRTL ? "مثال: 01001234567" : "e.g. 01001234567"

  const companyLabel = isRTL ? "اسم الشركة" : "Company Name"
  const companyPlaceholder = isRTL ? "مثال: شركاء تطوير القاهرة" : "e.g. Cairo Development Partners"
  const messageLabel = isRTL ? "الرسالة (اختياري)" : "Message (Optional)"
  const messagePlaceholder = isRTL
    ? "أخبرنا عن متطلبات مشروعك، الكميات، والجداول الزمنية..."
    : "Tell us about your project requirements, quantities, and timelines..."

  const attachmentsLabel = isRTL ? "المرفقات (اختياري)" : "Attachments (Optional)"
  const dropzoneText = isRTL ? "اسحب وأفلت الملفات هنا أو" : "Drag & drop files here or"
  const browseFilesText = isRTL ? "تصفح الملفات" : "Browse Files"
  const acceptedFormatsText = isRTL
    ? "جميع أنواع الملفات مقبولة — لا يوجد حد للحجم أو العدد"
    : "All file types accepted — No size or count limit"

  const submitButtonText = isRTL
    ? "إرسال الطلب وطلب عرض السعر"
    : "Submit Inquiry & Request Quote"
  const submittingText = isRTL ? "جارٍ الإرسال..." : "Submitting..."
  const termsText = isRTL
    ? "بالضغط على إرسال، فإنك توافق على شروط الخدمة التجارية لدينا."
    : "By clicking submit, you agree to our commercial Terms of Service."

  const successTitle = isRTL ? "تم استلام طلب عرض السعر" : "Your quote request is in"
  const successDescription = isRTL
    ? "لقد تلقينا طلب عرض السعر الخاص بك. سيراجع فريقنا قائمة منتجاتك والكميات ويرسل التسعير قريباً."
    : "We've received your quote request. Our team will review your product list, quantities, and send pricing shortly."
  const reassuranceText = isRTL ? "لا يوجد دفع مستحق الآن." : "No payment due now."
  const errorText = isRTL
    ? "حدث خطأ أثناء الإرسال. يرجى المحاولة مرة أخرى."
    : "An error occurred during submission. Please try again."

  const summaryHeading = isRTL ? "ملخص قائمتك" : "Your Quote List Summary"
  const microCopy1 = isRTL
    ? "سيقوم المختصون بمراجعة الحد الأدنى لمتطلبات الطلب مقابل النطاق المحدد."
    : "Reviewing specialists will verify minimum order requirements against your specified scope."
  const microCopy2 = isRTL
    ? "لا يوجد التزام أو دفعة مقدمة مطلوبة في هذه المرحلة."
    : "No commitment or down payment required at this stage."

  const goToHomepageText = isRTL ? "الذهاب إلى الرئيسية" : "Go to Homepage"
  const removeItemText = isRTL ? "إزالة" : "Remove"

  const totalItems = items.length
  const totalUnits = items.reduce((acc, item) => acc + item.quantity, 0)
  const itemsSelectedText = isRTL
    ? `${totalItems} منتج (${totalUnits} وحدة)`
    : `${totalItems} ${totalItems === 1 ? "item" : "items"} (${totalUnits} units)`

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleFileSelect = useCallback((selectedFiles: FileList | null) => {
    if (!selectedFiles) return
    const newFiles = Array.from(selectedFiles)
    setFiles((prev) => [...prev, ...newFiles])
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    handleFileSelect(e.dataTransfer.files)
  }, [handleFileSelect])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  const changeQuantity = (item: QuoteItem, quantity: number) => {
    if (quantity < 1) return
    updateItemQuantity(item.id, quantity)
  }

  const handleDelete = (id: string) => {
    removeItem(id)
  }

  const handleSubmit = async () => {
    if (!formData.fullName || !formData.phone) {
      setSubmitStatus("error")
      setErrorMessage(isRTL ? "يرجى ملء الاسم ورقم الهاتف." : "Please fill in your name and phone number.")
      return
    }

    setSubmitStatus("loading")
    setErrorMessage("")

    try {
      const backendUrl = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
      const publishableKey = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY

      const formPayload = new FormData()
      formPayload.append("customer_name", formData.fullName)
      formPayload.append("customer_phone", formData.phone)
      if (formData.email) {
        formPayload.append("customer_email", formData.email)
      }
      if (formData.message) {
        formPayload.append("message", formData.message)
      }
      if (formData.company) {
        formPayload.append("company_name", formData.company)
      }
      if (formData.city) {
        formPayload.append("city", formData.city)
      }
      if (formData.address) {
        formPayload.append("address", formData.address)
      }

      const rfqItems = items.map((item) => ({
        product_id: item.productId,
        quantity: item.quantity,
      }))
      formPayload.append("items", JSON.stringify(rfqItems))

      files.forEach((file) => {
        formPayload.append("files", file)
      })

      const requestUrl = `${backendUrl}/store/rfq`
      console.log("[RFQ-FE] Sending POST to:", requestUrl)
      console.log("[RFQ-FE] Publishable key:", publishableKey ? "set" : "NOT SET")
      console.log("[RFQ-FE] Items:", rfqItems.length, "Files:", files.length)

      const response = await fetch(requestUrl, {
        method: "POST",
        headers: {
          ...(publishableKey ? { "x-publishable-api-key": publishableKey } : {}),
        },
        body: formPayload,
      })

      console.log("[RFQ-FE] Response status:", response.status, response.statusText)

      if (!response.ok) {
        const errorData = await response.json().catch(() => null)
        console.error("[RFQ-FE] Error response:", errorData)
        throw new Error(errorData?.message || `Server error: ${response.status}`)
      }

      const data = await response.json()
      console.log("[RFQ-FE] Success response:", data)
      setSubmitStatus("success")
      clearItems()
    } catch (err) {
      console.error("[RFQ-FE] Fetch failed:", err)
      setSubmitStatus("error")
      setErrorMessage(err instanceof Error ? err.message : errorText)
    }
  }

  if (submitStatus === "success") {
    return (
      <div className="bg-[#f8f9fa] w-full min-h-[60vh] flex flex-col items-center justify-center py-[80px] px-4" dir={isRTL ? "rtl" : "ltr"}>
        <div className="bg-white border border-[#e5e7eb] border-solid flex flex-col gap-8 items-center p-6 md:p-12 rounded-2xl max-w-[560px] w-full text-center">
          <div className="h-[200px] md:h-[272px] w-full max-w-[342px] relative rounded-xl overflow-hidden shrink-0 mx-auto">
            <img
              src="/rfq-success/hero-3d.webp"
              alt=""
              className="absolute inset-0 w-full h-full object-cover rounded-xl"
            />
          </div>

          <div className="bg-[#f3f4f6] flex items-center justify-center px-6 py-2 rounded-lg w-full">
            <p className="font-satoshi font-bold text-[14px] text-[#141b34] leading-[1.5] whitespace-nowrap">
              {reassuranceText}
            </p>
          </div>

          <div className="flex flex-col gap-4 items-center text-center w-full">
            <h2 className="font-satoshi font-medium text-[24px] md:text-[28px] text-[#17284a] leading-[1.25]">
              {successTitle}
            </h2>
            <p className="font-satoshi font-normal text-[16px] text-[#707176] leading-[1.5]">
              {successDescription}
            </p>
          </div>

          <button
            onClick={() => router.push("/")}
            className="bg-[#17284a] flex items-center justify-center gap-2 px-6 md:px-9 py-4 md:py-6 rounded-xl w-full hover:bg-[#141b34] transition-colors cursor-pointer"
          >
            <p className="font-satoshi font-medium text-[16px] text-white leading-[1.5]">
              {goToHomepageText}
            </p>
            <ArrowRight className="w-5 h-5 text-white shrink-0" />
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-[#f8f9fa] w-full" dir={isRTL ? "rtl" : "ltr"}>
      {/* Header band */}
      <div className="flex flex-col gap-4 md:gap-6 px-4 md:px-8 lg:px-[60px] py-11 md:py-10 w-full max-w-[1600px] mx-auto">
        {/* Breadcrumbs */}
        <div className="flex gap-1.5 md:gap-2 items-center text-[14px] whitespace-normal md:whitespace-nowrap font-satoshi overflow-hidden">
          <LocalizedClientLink
            href="/"
            className="font-normal text-[#707176] leading-[1.5] hover:text-[#17284a] transition-colors"
          >
            {homeText}
          </LocalizedClientLink>
          <span className="font-normal text-[#707176] leading-[1.5]">/</span>
          <LocalizedClientLink
            href="/cart"
            className="font-normal text-[#707176] leading-[1.5] hover:text-[#17284a] transition-colors"
          >
            {quoteListText}
          </LocalizedClientLink>
          <span className="font-normal text-[#707176] leading-[1.5]">/</span>
          <span className="font-bold text-[#17284a] leading-[1.5]">
            {requestQuoteText}
          </span>
        </div>

        {/* Title + reassurance badge */}
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:flex-wrap md:gap-4">
          <h1 className="font-satoshi font-bold leading-[1.3] md:leading-[1.18] text-[#17284a] text-[24px] md:text-[40px] whitespace-normal md:whitespace-nowrap">
            {titleText}
          </h1>
          <div className="bg-[#141b34] inline-flex items-center px-4 py-[6px] rounded-full shrink-0 w-fit">
            <p className="font-satoshi font-bold text-[14px] text-white whitespace-nowrap leading-[1.5]">
              {badgeText}
            </p>
          </div>
        </div>

        {/* Description */}
        <p className="font-satoshi font-normal leading-[1.5] text-[#707176] text-[16px] max-w-[788px]">
          {descriptionText}
        </p>
      </div>

      {/* Columns wrapper */}
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-[40px] items-start px-4 md:px-8 lg:px-[60px] pt-11 lg:pt-0 pb-11 lg:pb-[60px] w-full max-w-[1600px] mx-auto">
        {/* Left - Form card */}
        <div className="bg-white border border-[#e5e7eb] border-solid flex flex-col gap-6 lg:gap-7 items-start p-6 md:p-10 rounded-2xl w-full order-2 lg:order-1 lg:flex-1 lg:max-w-[912px]">
          {/* Card heading */}
          <div className="flex flex-col gap-2 items-start w-full">
            <p className="font-satoshi font-bold leading-[1.3] text-[#17284a] text-[20px] md:text-[24px] w-full">
              {cardHeading}
            </p>
            <p className="font-satoshi font-normal leading-[1.5] text-[#5d5d61] text-[16px] w-full">
              {cardSubheading}
            </p>
          </div>

          {/* Error message */}
          {submitStatus === "error" && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-lg px-4 py-3 w-full">
              <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
              <p className="font-satoshi font-normal text-[14px] text-red-700">
                {errorMessage || errorText}
              </p>
            </div>
          )}

          {/* Form fields */}
          <div className="flex flex-col gap-5 items-start w-full">
            {/* Row 1 - Names */}
            <div className="flex flex-col sm:flex-row gap-4 items-start w-full">
              <div className="flex flex-col gap-2 items-start w-full sm:flex-1">
                <p className="font-satoshi font-medium leading-[1.5] text-[#17284a] text-[14px] w-full">
                  {fullNameLabel}
                </p>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => handleChange("fullName", e.target.value)}
                  placeholder={fullNamePlaceholder}
                  className="bg-[#f3f4f6] h-[52px] px-4 py-[14px] rounded-lg w-full font-satoshi font-normal leading-[1.5] text-[#1c1b1c] text-[16px] placeholder:text-[#5d5d61] focus:outline-none focus:ring-2 focus:ring-[#17284a]/20 transition"
                />
              </div>
              <div className="flex flex-col gap-2 items-start w-full sm:flex-1">
                <p className="font-satoshi font-medium leading-[1.5] text-[#17284a] text-[14px] w-full">
                  {cityLabel}
                </p>
                <div className="relative w-full">
                  <select
                    value={formData.city}
                    onChange={(e) => handleChange("city", e.target.value)}
                    className="bg-[#f3f4f6] h-[52px] px-4 py-[14px] rounded-lg w-full font-satoshi font-normal leading-[1.5] text-[#1c1b1c] text-[16px] appearance-none focus:outline-none focus:ring-2 focus:ring-[#17284a]/20 transition cursor-pointer"
                    defaultValue=""
                  >
                    <option value="" disabled>
                      {isRTL ? "اختر المحافظة" : "Select a governorate"}
                    </option>
                    {governorates.map((gov) => (
                      <option key={gov.en} value={gov.en}>
                        {isRTL ? gov.ar : gov.en}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    size={20}
                    className={`absolute top-1/2 -translate-y-1/2 text-[#17284a] pointer-events-none ${isRTL ? "left-4" : "right-4"}`}
                  />
                </div>
              </div>
            </div>

            {/* Row 2 - Address */}
            <div className="flex flex-col gap-2 items-start w-full">
              <p className="font-satoshi font-medium leading-[1.5] text-[#17284a] text-[14px] w-full">
                {addressLabel}
              </p>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => handleChange("address", e.target.value)}
                placeholder={addressPlaceholder}
                className="bg-[#f3f4f6] h-[52px] px-4 py-[14px] rounded-lg w-full font-satoshi font-normal leading-[1.5] text-[#1c1b1c] text-[16px] placeholder:text-[#5d5d61] focus:outline-none focus:ring-2 focus:ring-[#17284a]/20 transition"
              />
            </div>

            {/* Row 3 - Contacts */}
            <div className="flex flex-col sm:flex-row gap-4 items-start w-full">
              <div className="flex flex-col gap-2 items-start w-full sm:flex-1">
                <p className="font-satoshi font-medium leading-[1.5] text-[#17284a] text-[14px] w-full">
                  {emailLabel}
                </p>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  placeholder={emailPlaceholder}
                  className={`bg-[#f3f4f6] h-[52px] px-4 py-[14px] rounded-lg w-full font-satoshi font-normal leading-[1.5] text-[#1c1b1c] text-[16px] placeholder:text-[#5d5d61] focus:outline-none focus:ring-2 focus:ring-[#17284a]/20 transition ${isRTL ? "text-right" : ""}`}
                />
              </div>
              <div className="flex flex-col gap-2 items-start w-full sm:flex-1">
                <p className="font-satoshi font-medium leading-[1.5] text-[#17284a] text-[14px] w-full">
                  {phoneLabel}
                </p>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                  placeholder={phonePlaceholder}
                  className={`bg-[#f3f4f6] h-[52px] px-4 py-[14px] rounded-lg w-full font-satoshi font-normal leading-[1.5] text-[#1c1b1c] text-[16px] placeholder:text-[#5d5d61] focus:outline-none focus:ring-2 focus:ring-[#17284a]/20 transition ${isRTL ? "text-right" : ""}`}
                />
              </div>
            </div>

            {/* Company Name */}
            <div className="flex flex-col gap-2 items-start w-full">
              <p className="font-satoshi font-medium leading-[1.5] text-[#17284a] text-[14px] w-full">
                {companyLabel}
              </p>
              <input
                type="text"
                value={formData.company}
                onChange={(e) => handleChange("company", e.target.value)}
                placeholder={companyPlaceholder}
                className="bg-[#f3f4f6] h-[52px] px-4 py-[14px] rounded-lg w-full font-satoshi font-normal leading-[1.5] text-[#1c1b1c] text-[16px] placeholder:text-[#5d5d61] focus:outline-none focus:ring-2 focus:ring-[#17284a]/20 transition"
              />
            </div>

            {/* Message */}
            <div className="flex flex-col gap-2 items-start w-full">
              <p className="font-satoshi font-medium leading-[1.5] text-[#17284a] text-[14px] w-full">
                {messageLabel}
              </p>
              <textarea
                value={formData.message}
                onChange={(e) => handleChange("message", e.target.value)}
                placeholder={messagePlaceholder}
                rows={4}
                className="bg-[#f3f4f6] h-[120px] px-4 py-[14px] rounded-lg w-full font-satoshi font-normal leading-[1.5] text-[#1c1b1c] text-[16px] placeholder:text-[#5d5d61] focus:outline-none focus:ring-2 focus:ring-[#17284a]/20 transition resize-none"
              />
            </div>

            {/* Upload section */}
            <div className="flex flex-col gap-3 items-start w-full">
              <p className="font-satoshi font-medium leading-[1.5] text-[#17284a] text-[14px] w-full">
                {attachmentsLabel}
              </p>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                className="hidden"
                onChange={(e) => {
                  handleFileSelect(e.target.files)
                  e.target.value = ""
                }}
              />
              <div
                onClick={() => fileInputRef.current?.click()}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                className={`bg-[#f9fafb] border border-dashed flex flex-col gap-3 h-[150px] md:h-[160px] items-center justify-center rounded-xl w-full cursor-pointer transition-colors ${
                  isDragging
                    ? "border-[#17284a] bg-[#17284a]/5"
                    : "border-[#e5e7eb] hover:border-[#17284a]/30"
                }`}
              >
                <CloudUpload className="w-8 h-8 text-[#17284a]" />
                <div className="flex flex-col gap-1 items-center text-center">
                  <p className="font-satoshi font-normal leading-[1.5] text-[#17284a] text-[16px]">
                    {dropzoneText}
                  </p>
                  <p className="font-satoshi font-medium leading-[1.5] text-[#17284a] text-[14px] underline cursor-pointer">
                    {browseFilesText}
                  </p>
                </div>
              </div>
              <p className="font-satoshi font-normal leading-[1.5] text-[#6b7280] text-[14px] w-full">
                {acceptedFormatsText}
              </p>

              {/* Selected files list */}
              {files.length > 0 && (
                <div className="flex flex-col gap-2 w-full mt-1">
                  {files.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between bg-[#f3f4f6] border border-[#e5e7eb] rounded-lg px-4 py-3 w-full"
                    >
                      <div className="flex flex-col min-w-0 flex-1">
                        <p className="font-satoshi font-medium text-[14px] text-[#17284a] truncate">
                          {file.name}
                        </p>
                        <p className="font-satoshi font-normal text-[12px] text-[#707176]">
                          {formatFileSize(file.size)} — {file.type || "unknown"}
                        </p>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          removeFile(index)
                        }}
                        className="flex items-center justify-center w-8 h-8 rounded-lg hover:bg-red-50 transition-colors shrink-0 ml-2"
                      >
                        <X className="w-4 h-4 text-red-500" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Submit action */}
          <div className="flex flex-col gap-3 items-start w-full">
            <button
              type="button"
              onClick={handleSubmit}
              disabled={submitStatus === "loading"}
              className="bg-[#17284a] flex items-center justify-center gap-2 px-6 md:px-9 py-4 md:py-6 rounded-xl w-full hover:bg-[#141b34] transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {submitStatus === "loading" && (
                <Loader2 className="w-5 h-5 text-white animate-spin" />
              )}
              <p className="font-satoshi font-medium leading-[1.5] text-[16px] text-center text-white whitespace-normal md:whitespace-nowrap">
                {submitStatus === "loading" ? submittingText : submitButtonText}
              </p>
            </button>
            <p className="font-satoshi font-normal leading-[1.5] text-[#707176] text-[14px] text-center w-full">
              {termsText}
            </p>
          </div>
        </div>

        {/* Right - Product list summary card */}
        <div className="w-full order-1 lg:order-2 lg:w-[440px] lg:shrink-0">
          <div className="bg-white border border-[#e5e7eb] border-solid flex flex-col gap-5 lg:gap-6 items-start p-6 md:px-8 md:py-10 rounded-2xl w-full lg:sticky lg:top-[8rem]">
            {/* Summary header */}
            <div className="flex flex-col gap-2 items-start w-full">
              <p className="font-satoshi font-bold leading-[1.3] text-[#17284a] text-[24px]">
                {summaryHeading}
              </p>
              <p className="font-satoshi font-medium leading-[1.5] text-[#707176] text-[16px]">
                {itemsSelectedText}
              </p>
            </div>

            {/* Divider */}
            <div className="bg-[#e5e7eb] h-px w-full" />

            {/* Product list with images, names, quantity steppers */}
            <div className="flex flex-col gap-3 w-full max-h-[500px] overflow-y-auto">
              {items.length > 0 ? (
                [...items]
                  .sort((a, b) => (a.createdAt ?? "") > (b.createdAt ?? "") ? -1 : 1)
                  .map((item) => {
                    const productTitle = isRTL
                      ? item.productTitleAr ?? item.productTitle
                      : item.productTitle
                    const categoryName = item.categoryName
                      ? isRTL
                        ? item.categoryNameAr ?? item.categoryName
                        : item.categoryName
                      : null
                    const variantTitle = item.variantTitle
                    const isDefaultVariant = !variantTitle || variantTitle.trim().toLowerCase() === "default variant"
                    let specs: string | null = null
                    if (!isDefaultVariant) {
                      specs = isRTL ? (item.variantTitleAr ?? variantTitle!) : variantTitle!
                    } else if (item.variantOptions && item.variantOptions.length > 0) {
                      const optionValues = item.variantOptions
                        .slice(0, 3)
                        .map((opt) => {
                          if (isRTL) {
                            return (opt.metadata?.localizations?.ar?.value as string) ?? opt.value
                          }
                          return opt.value
                        })
                        .filter(Boolean)
                      if (optionValues.length > 0) {
                        specs = optionValues.join(" · ")
                      }
                    }
                    const currencyCode = item.currencyCode || "usd"
                    const itemTotal = item.unitPrice != null && item.showPrice !== false ? item.unitPrice * item.quantity : null
                    const originalItemTotal = item.originalPrice != null && item.showPrice !== false ? item.originalPrice * item.quantity : null
                    const hasDiscount = originalItemTotal != null && itemTotal != null && originalItemTotal > itemTotal
                    const priceText = itemTotal != null
                      ? convertToLocale({ amount: itemTotal, currency_code: currencyCode, locale })
                      : (isRTL ? "السعر عند الطلب" : "Price on Request")
                    const originalPriceText = originalItemTotal != null
                      ? convertToLocale({ amount: originalItemTotal, currency_code: currencyCode, locale })
                      : null

                    return (
                      <div
                        key={item.id}
                        className="flex gap-3 items-start w-full pb-3 border-b border-[#e5e7eb] last:border-b-0"
                      >
                        {/* Thumbnail */}
                        <LocalizedClientLink
                          href={`/products/${item.productHandle}`}
                          className="shrink-0"
                        >
                          <div className="border border-[#e5e7eb] border-solid rounded-[10px] size-[64px] overflow-hidden">
                            <Thumbnail
                              thumbnail={item.thumbnail}
                              images={item.images}
                              size="square"
                              className="rounded-[10px] object-cover size-full"
                            />
                          </div>
                        </LocalizedClientLink>

                        {/* Product info + quantity */}
                        <div className="flex-1 min-w-0 flex flex-col gap-2 items-start">
                          {categoryName && (
                            <div className="bg-[#f3f4f6] border border-[#ccc] border-solid flex gap-1 items-center justify-center px-2 py-[2px] rounded-full shrink-0">
                              <span className="font-medium text-[11px] text-[#17284a] leading-[1.5] whitespace-nowrap">
                                {categoryName}
                              </span>
                            </div>
                          )}
                          <p className="font-satoshi font-bold text-[14px] leading-[1.4] text-[#17284a] w-full line-clamp-2">
                            {productTitle}
                          </p>
                          {specs && (
                            <p className="font-satoshi font-normal text-[12px] leading-[1.4] text-[#707176] w-full truncate">
                              {specs}
                            </p>
                          )}

                          {/* Quantity stepper + price */}
                          <div className="flex items-center justify-between w-full gap-2">
                            <div className="bg-white border border-[#e5e7eb] border-solid flex gap-2 h-[34px] items-center justify-center p-1 rounded-[8px] shrink-0">
                              <button
                                onClick={() => changeQuantity(item, item.quantity - 1)}
                                className="text-[#707176] hover:text-[#17284a] transition-colors disabled:opacity-30"
                                disabled={item.quantity <= 1}
                                aria-label="Decrease quantity"
                              >
                                <Minus className="size-4" />
                              </button>
                              <span className="font-bold text-[13px] text-[#1c1b1c] leading-[1.5] min-w-[18px] text-center">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => changeQuantity(item, item.quantity + 1)}
                                className="text-[#707176] hover:text-[#17284a] transition-colors disabled:opacity-30"
                                disabled={item.quantity >= 10}
                                aria-label="Increase quantity"
                              >
                                <Plus className="size-4" />
                              </button>
                            </div>
                            <div className="flex flex-col items-end gap-[2px]">
                              {hasDiscount && originalPriceText && (
                                <span className="text-[11px] text-[#707176] line-through leading-[1.5]">
                                  {originalPriceText}
                                </span>
                              )}
                              <p className="font-satoshi font-bold text-[13px] leading-[1.5] text-[#17284a] whitespace-nowrap">
                                {priceText}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Delete button */}
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="text-[#707176] hover:text-red-500 transition-colors shrink-0"
                          aria-label={removeItemText}
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                    )
                  })
              ) : (
                <p className="font-satoshi font-normal leading-[1.5] text-[#707176] text-[14px] w-full">
                  {isRTL ? "لم تتم إضافة عناصر بعد." : "No items added yet."}
                </p>
              )}
            </div>

            {/* Divider */}
            <div className="bg-[#e5e7eb] h-px w-full" />

            {/* Micro copy */}
            <div className="flex flex-col gap-2 items-start text-[14px] w-full">
              <p className="font-satoshi font-normal leading-[1.5] text-[#707176] w-full">
                {microCopy1}
              </p>
              <p className="font-satoshi font-bold leading-[1.5] text-[#141b34] w-full">
                {microCopy2}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
