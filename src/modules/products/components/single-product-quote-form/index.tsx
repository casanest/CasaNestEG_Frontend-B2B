"use client"

import { useState, useRef, useCallback, useMemo } from "react"
import { useRouter } from "next/navigation"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { CloudUpload, X, AlertCircle, Loader2, ArrowRight, Minus, Plus, ChevronDown, Truck } from "lucide-react"
import { useLocale } from "next-intl"
import { getProductPrice } from "@lib/util/get-product-price"
import { normalizeProductImageUrl } from "@lib/util/product-image-url"

type SingleProductQuoteFormProps = {
  product: HttpTypes.StoreProduct
  region: HttpTypes.StoreRegion
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

export default function SingleProductQuoteForm({ product, region }: SingleProductQuoteFormProps) {
  const isRTL = useLocale() === "ar"
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [formData, setFormData] = useState({
    fullName: "",
    city: "",
    email: "",
    phone: "",
    company: "",
    message: "",
  })
  const [files, setFiles] = useState<File[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>("idle")
  const [errorMessage, setErrorMessage] = useState("")

  // Min order quantity
  const rawMoq =
    (product as any).moq ||
    (product.metadata?.min_order_qty as string | number) ||
    (product.metadata?.MOQ as string | number)
  const minOrderQty = (() => {
    if (!rawMoq) return 1
    const parsed = parseInt(String(rawMoq), 10)
    return isNaN(parsed) || parsed < 1 ? 1 : parsed
  })()

  const [quantity, setQuantity] = useState(minOrderQty)

  // Product info
  const localized = product?.metadata?.localizations as any
  const title = (isRTL ? localized?.ar?.title : product.title) || product.title
  const description =
    (isRTL ? localized?.ar?.description : localized?.en?.description) ||
    product.description ||
    ""

  const categoryTitle = product.categories?.[0]?.name || product.collection?.title || ""
  const categoryHandle = product.categories?.[0]?.handle || (product.collection ? `/collections/${product.collection.handle}` : "/products")

  // Price
  const { cheapestPrice } = getProductPrice({ product })
  const priceInfo = cheapestPrice
  const mainNumber = priceInfo?.calculated_price_number ?? 0
  const formattedNumber = mainNumber.toLocaleString(isRTL ? "ar-EG" : "en-US")
  const decimalPart = mainNumber % 1 === 0 ? ".00" : ""
  const isSale = priceInfo?.price_type === "sale"
  const currencyCode = priceInfo?.currency_code || "usd"

  // Estimated total
  const estimatedTotal = mainNumber * quantity
  const formattedTotal = estimatedTotal.toLocaleString(isRTL ? "ar-EG" : "en-US")
  const totalDecimalPart = estimatedTotal % 1 === 0 ? ".00" : ""

  // Specs — matches the product template extraction logic
  const specs = useMemo(() => {
    const s: { label: string; value: string }[] = []

    // Core product fields
    if (product.material) {
      s.push({ label: isRTL ? "الخامة" : "Material", value: product.material })
    }
    if (product.width) {
      s.push({ label: isRTL ? "العرض" : "Width", value: `${product.width} cm` })
    }
    if (product.height) {
      s.push({ label: isRTL ? "الارتفاع" : "Height", value: `${product.height} cm` })
    }
    if (product.length) {
      s.push({ label: isRTL ? "العمق" : "Depth", value: `${product.length} cm` })
    }

    // Color from variant options
    const colorOpt = product.variants?.[0]?.options?.find(
      (opt: any) => opt.option?.title?.toLowerCase() === "color"
    )
    if (colorOpt) {
      s.push({ label: isRTL ? "اللون" : "Color", value: colorOpt.value })
    }

    // Build specs from product metadata (skip internal/structural keys)
    const metadataSkipKeys = [
      "localizations",
      "is_new",
      "title_ar",
      "title_en",
      "description_ar",
      "description_en",
      "min_order_qty",
      "MOQ",
      "localization_updated_at",
      "warranty",
      "Warranty",
      "moq",
      "document_url",
      "weight",
    ]
    if (product.metadata) {
      for (const [key, value] of Object.entries(product.metadata)) {
        if (metadataSkipKeys.includes(key)) continue
        if (typeof value === "object" && value !== null) continue
        if (value === null || value === undefined || value === "") continue

        const label = key
          .split(/[_\s]+/)
          .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
          .join(" ")

        s.push({ label, value: String(value) })
      }
    }

    return s
  }, [product, isRTL])

  // SKU
  const sku = product.variants?.[0]?.sku || (product as any).sku || ""

  // Product image
  const productImage = product.thumbnail || product.images?.[0]?.url || ""
  const normalizedImage = productImage ? normalizeProductImageUrl(productImage) : ""

  // Texts
  const homeText = isRTL ? "الرئيسية" : "Home"
  const productsText = isRTL ? "المنتجات" : "Products"
  const requestQuoteText = isRTL ? "اطلب عرض السعر" : "Request Quote"
  const titleText = isRTL ? "اطلب عرض سعر للمنتج" : "Request Product Quote"
  const badgeText = isRTL ? "بدون دفع، بدون التزام" : "No Payment, No Obligation"
  const descriptionText = isRTL
    ? "يرجى تقديم بياناتك أدناه. هذه هي الخطوة الأخيرة قبل أن يقوم خبراء المشتريات بمعالجة طلبك وإنشاء عرض السعر الرسمي."
    : "Please provide your details below. This is the final step before our procurement specialists process your request and generate your official price quote."

  const cardHeading = isRTL ? "معلومات جهة المشتريات" : "Procurement Contact Information"
  const cardSubheading = isRTL
    ? "املأ المعلومات المطلوبة لتعيين مدير حساب لطلبك."
    : "Fill out the required information to assign an account manager to your order."

  const fullNameLabel = isRTL ? "الاسم الكامل" : "Full Name"
  const fullNamePlaceholder = isRTL ? "مثال: علي احمد ابراهيم" : "e.g. Aly"
  const cityLabel = isRTL ? "المحافظة" : "Governorate"
  const cityPlaceholder = isRTL ? "مثال: المنصورة" : "e.g. Mansoura"
  const emailLabel = isRTL ? "البريد الإلكتروني (اختياري)" : "Email Address (Optional)"
  const emailPlaceholder = isRTL ? "مثال: aliAhmed123@gmail.com" : "e.g. aly@company.com"
  const phoneLabel = isRTL ? "رقم الهاتف" : "Phone Number"
  const phonePlaceholder = isRTL ? "مثال: +201001234567" : "e.g. +201001234567"

  const companyLabel = isRTL ? "اسم الشركة" : "Company Name"
  const companyPlaceholder = isRTL ? "مثال: شركاء تطوير القاهرة" : "e.g. Cairo Development Partners"
  const subjectLabel = isRTL ? "الموضوع / مجال المشروع" : "Subject / Project Area"
  const messageLabel = isRTL ? "متطلبات خاصة أو ملاحظات (اختياري)" : "Special Requirements or Notes (Optional)"
  const messagePlaceholder = isRTL
    ? "أخبرنا عن متطلبات مشروعك، تواريخ التركيب، أو تعديلات الكمية..."
    : "Tell us about your project requirements, target installation dates, or customized quantity adjustments..."

  const attachmentsLabel = isRTL ? "المرفقات (اختياري)" : "Attachments (Optional)"
  const dropzoneText = isRTL ? "اسحب وأفلت الملفات هنا أو" : "Drag & drop files here or"
  const browseFilesText = isRTL ? "تصفح الملفات" : "Browse Files"
  const acceptedFormatsText = isRTL
    ? "الصيغ المقبولة: PDF, DOC, DOCX, XLS, XLSX, DWG — الحد الأقصى 10 ميجابايت لكل ملف"
    : "Accepted formats: PDF, DOC, DOCX, XLS, XLSX, DWG — Max 10MB per file"

  const submitButtonText = isRTL ? "إرسال الطلب وطلب عرض السعر" : "Submit Inquiry & Request Quote"
  const submittingText = isRTL ? "جارٍ الإرسال..." : "Submitting..."
  const termsText = isRTL
    ? "بالضغط على إرسال، فإنك توافق على شروط الخدمة التجارية لدينا."
    : "By clicking submit, you agree to our commercial Terms of Service."

  const successTitle = isRTL ? "تم استلام طلب عرض السعر" : "Your quote request is in"
  const successDescription = isRTL
    ? `لقد تلقينا استفسارك عن ${title}. سيراجع فريقنا الفني اختياراتك ويرسل التسعير قريباً.`
    : `We've received your quote request for ${title}. Our technical team will review your requirements and send pricing shortly.`
  const reassuranceText = isRTL ? "لا يوجد دفع مستحق الآن." : "No payment due now."
  const errorText = isRTL
    ? "حدث خطأ أثناء الإرسال. يرجى المحاولة مرة أخرى."
    : "An error occurred during submission. Please try again."

  const summaryHeading = isRTL ? "ملخص منتجك" : "Your Product Summary"
  const quantityLabel = isRTL ? "الكمية" : "Quantity"
  const minOrderText = isRTL ? "الحد الأدنى: " : "Min. Order Qty: "
  const estimatedTotalText = isRTL ? "الإجمالي التقديري" : "Estimated Total"
  const finalPricingText = isRTL ? "يتم تأكيد التسعير النهائي بعد المراجعة من قبل فريقنا." : "Final pricing confirmed after review by our team."
  const goToHomepageText = isRTL ? "الذهاب إلى الرئيسية" : "Go to Homepage"

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
      if (formData.company) {
        formPayload.append("company_name", formData.company)
      }
      if (formData.city) {
        formPayload.append("city", formData.city)
      }
      if (formData.message) {
        formPayload.append("message", formData.message)
      }

      const rfqItems = [
        {
          product_id: product.id,
          quantity: quantity,
        },
      ]
      formPayload.append("items", JSON.stringify(rfqItems))

      files.forEach((file) => {
        formPayload.append("files", file)
      })

      const requestUrl = `${backendUrl}/store/rfq`
      const response = await fetch(requestUrl, {
        method: "POST",
        headers: {
          ...(publishableKey ? { "x-publishable-api-key": publishableKey } : {}),
        },
        body: formPayload,
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => null)
        throw new Error(errorData?.message || `Server error: ${response.status}`)
      }

      setSubmitStatus("success")
    } catch (err) {
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
            <ArrowRight className={`w-5 h-5 text-white shrink-0 ${isRTL ? "rotate-180" : ""}`} />
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-[#f8f9fa] w-full" dir={isRTL ? "rtl" : "ltr"}>
      {/* Header band */}
      <div className="border-b border-[#e5e7eb] flex flex-col gap-6 px-4 md:px-8 lg:px-[60px] py-10 w-full max-w-[1600px] mx-auto">
        {/* Breadcrumbs */}
        <div className="flex flex-wrap gap-2 items-center text-[14px] font-satoshi">
          <LocalizedClientLink
            href="/"
            className="font-normal text-[#707176] leading-[1.5] hover:text-[#17284a] transition-colors"
          >
            {homeText}
          </LocalizedClientLink>
          <span className="font-normal text-[#707176] leading-[1.5]">/</span>
          <LocalizedClientLink
            href="/products"
            className="font-normal text-[#707176] leading-[1.5] hover:text-[#17284a] transition-colors"
          >
            {productsText}
          </LocalizedClientLink>
          <span className="font-normal text-[#707176] leading-[1.5]">/</span>
          <LocalizedClientLink
            href={`/products/${product.handle}`}
            className="font-normal text-[#707176] leading-[1.5] hover:text-[#17284a] transition-colors truncate max-w-[200px]"
          >
            {title}
          </LocalizedClientLink>
          <span className="font-normal text-[#707176] leading-[1.5]">/</span>
          <span className="font-bold text-[#17284a] leading-[1.5]">
            {requestQuoteText}
          </span>
        </div>

        {/* Title + reassurance badge */}
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:flex-wrap md:gap-4">
          <h1 className="font-satoshi font-bold leading-[1.18] text-[#17284a] text-[24px] md:text-[40px]">
            {titleText}
          </h1>
          <div className="bg-[#141b34] inline-flex self-start items-center px-[12px] py-[6px] rounded-full shrink-0">
            <p className="font-satoshi font-bold text-[14px] text-white whitespace-nowrap leading-[1.5]">
              {badgeText}
            </p>
          </div>
        </div>

        {/* Description */}
        <p className="font-satoshi font-normal leading-[1.5] text-[#707176] text-[16px] max-w-[900px]">
          {descriptionText}
        </p>
      </div>

      {/* Columns wrapper */}
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-[40px] items-start px-4 md:px-8 lg:px-[60px] pt-11 lg:pt-0 pb-11 lg:pb-[60px] w-full max-w-[1600px] mx-auto">
        {/* Left - Form card */}
        <div className="bg-white border border-[#e5e7eb] border-solid flex flex-col gap-7 items-start p-6 md:p-10 rounded-2xl w-full order-2 lg:order-1 lg:flex-1 lg:max-w-[912px]">
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
            {/* Row 1 - Name & Location */}
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

            {/* Row 2 - Email & Phone */}
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

            {/* Subject / Project Area - dropdown showing product title */}
            <div className="flex flex-col gap-2 items-start w-full">
              <p className="font-satoshi font-medium leading-[1.5] text-[#17284a] text-[14px] w-full">
                {subjectLabel}
              </p>
              <div className="bg-[#f3f4f6] flex items-center justify-between px-4 py-[14px] rounded-lg w-full h-[52px]">
                <p className="font-satoshi font-normal leading-[1.5] text-[#17284a] text-[16px] truncate">
                  {title}
                </p>
                <ChevronDown className="w-5 h-5 text-[#707176] shrink-0" />
              </div>
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
                className={`bg-[#f9fafb] border border-dashed flex flex-col gap-3 h-[160px] items-center justify-center rounded-xl w-full cursor-pointer transition-colors ${
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
              <p className="font-satoshi font-medium leading-[1.5] text-[16px] text-center text-white whitespace-nowrap">
                {submitStatus === "loading" ? submittingText : submitButtonText}
              </p>
            </button>
            <p className="font-satoshi font-normal leading-[1.5] text-[#707176] text-[14px] text-center w-full">
              {termsText}
            </p>
          </div>
        </div>

        {/* Right - summary card */}
        <div className="w-full order-1 lg:order-2 lg:w-[440px] lg:shrink-0">
          <div className="bg-white border border-[#e5e7eb] border-solid flex flex-col gap-6 items-start p-6 md:p-8 rounded-2xl w-full lg:sticky lg:top-[8rem]">
            {/* Summary header */}
            <div className="flex flex-col gap-2 items-start w-full">
              <p className="font-satoshi font-bold leading-[1.4] text-[20px] text-black">
                {summaryHeading}
              </p>
              <div className="flex items-center justify-between w-full">
                {/* SKU badge */}
                {sku && (
                  <div className="bg-[#f3f4f6] flex items-start px-[10px] py-[4px] rounded-full">
                    <p className="font-satoshi font-bold leading-[1.5] text-[#5d5d61] text-[14px] whitespace-nowrap">
                      {sku}
                    </p>
                  </div>
                )}
                {/* Category tag */}
                {categoryTitle && (
                  <div className="flex gap-1 items-center">
                    <p className="font-satoshi font-bold leading-[1.5] text-[#17284a] text-[14px] whitespace-nowrap">
                      {categoryTitle}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Product photo */}
            {normalizedImage && (
              <div className="h-[200px] relative rounded-lg w-full overflow-hidden">
                <img
                  src={normalizedImage}
                  alt={title}
                  className="absolute inset-0 w-full h-full object-cover rounded-lg"
                />
              </div>
            )}

            {/* Product title */}
            <p className="font-satoshi font-bold leading-[1.5] text-[#17284a] text-[18px] w-full">
              {title}
            </p>

            {/* Divider */}
            <div className="bg-[#e5e7eb] h-px w-full" />

            {/* Specs list */}
            {specs.length > 0 && (
              <div className="flex flex-col gap-3 text-[14px] w-full">
                {specs.map((spec, idx) => (
                  <div
                    key={idx}
                    className="flex gap-2 items-start w-full"
                  >
                    <p className="flex-1 font-satoshi font-medium leading-[1.5] text-[#707176]">
                      {spec.label}
                    </p>
                    <p className="flex-1 font-satoshi font-bold leading-[1.5] text-[#17284a] text-right">
                      {spec.value}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* Divider */}
            <div className="bg-[#e5e7eb] h-px w-full" />

            {/* Price + Min order qty */}
            <div className="flex flex-col gap-4 w-full">
              <div className="flex items-center justify-between w-full">
                {/* Price display */}
                <div className="flex flex-col gap-[2px]">
                  {priceInfo ? (
                    <>
                      <div className="flex gap-1 items-baseline text-[#17284a]">
                        <span className="font-satoshi font-medium leading-[1.5] text-[14px]">
                          {isRTL ? "ج.م" : currencyCode.toUpperCase()}
                        </span>
                        <span className="font-satoshi font-bold leading-[1.3] text-[24px]">
                          {formattedNumber}
                        </span>
                        <span className="font-satoshi font-medium leading-[1.5] text-[14px]">
                          {decimalPart}
                        </span>
                      </div>
                      {isSale && priceInfo.original_price && (
                        <span className="font-satoshi font-medium leading-[1.5] line-through text-[#707176] text-[14px]">
                          {priceInfo.original_price}
                        </span>
                      )}
                    </>
                  ) : (
                    <span className="font-satoshi font-bold text-[18px] text-[#17284a]">
                      {isRTL ? "اطلب عرض سعر" : "Request a Quote"}
                    </span>
                  )}
                </div>
                {/* Min order qty */}
                <div className="flex gap-1 items-center">
                  <Truck className="w-[14px] h-[14px] text-[#707176]" />
                  <p className="font-satoshi font-medium leading-[1.5] text-[#707176] text-[14px] whitespace-nowrap">
                    {minOrderText}
                    <span className="font-satoshi font-bold text-[#1c1b1c]">
                      {minOrderQty} {isRTL ? "قطعة" : "pcs"}
                    </span>
                  </p>
                </div>
              </div>

              {/* Quantity selector */}
              <div className="flex items-center justify-between w-full">
                <p className="font-satoshi font-bold leading-[1.5] text-[#1c1b1c] text-[14px] whitespace-nowrap">
                  {quantityLabel}
                </p>
                <div className="bg-white border border-[#e5e7eb] border-solid flex gap-3 items-center justify-center p-2 rounded-lg w-[100px]">
                  <button
                    type="button"
                    onClick={() => setQuantity((prev) => Math.max(minOrderQty, prev - 1))}
                    className="text-[#707176] hover:text-[#17284a] transition-colors"
                  >
                    <Minus className="w-5 h-5" />
                  </button>
                  <span className="min-w-[1.5rem] text-center font-satoshi font-bold text-[14px] text-[#1c1b1c]">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity((prev) => Math.min(99, prev + 1))}
                    className="text-[#707176] hover:text-[#17284a] transition-colors"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="bg-[#e5e7eb] h-px w-full" />

            {/* Estimated total */}
            <div className="flex flex-col gap-2 w-full">
              <div className="flex items-center justify-between w-full">
                <p className="font-satoshi font-bold leading-[1.5] text-[#17284a] text-[16px]">
                  {estimatedTotalText}
                </p>
                <p className="font-satoshi font-bold leading-[1.4] text-[#17284a] text-[20px]">
                  {priceInfo ? `${currencyCode.toUpperCase()} ${formattedTotal}${totalDecimalPart}` : "—"}
                </p>
              </div>
              <p className="font-satoshi font-medium leading-[1.5] text-[#707176] text-[14px]">
                {finalPricingText}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
