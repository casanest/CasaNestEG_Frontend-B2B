"use client"

import { useState, useRef, useCallback } from "react"
import {
  ChevronDown,
  UploadCloud,
  X,
  AlertCircle,
  Loader2,
  ArrowRight,
} from "lucide-react"

const subjectOptions = [
  "General Inquiry",
  "Product Question",
  "Solution Package",
  "Procurement Project",
  "Partnership",
  "Support",
]

type SubmitStatus = "idle" | "loading" | "success" | "error"

export default function ContactForm({ isRTL }: { isRTL: boolean }) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [formData, setFormData] = useState({
    name: "",
    location: "",
    email: "",
    phone: "",
    company: "",
    subject: "",
    message: "",
  })
  const [files, setFiles] = useState<File[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>("idle")
  const [errorMessage, setErrorMessage] = useState("")

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleFileSelect = useCallback((selectedFiles: FileList | null) => {
    if (!selectedFiles) return
    const newFiles = Array.from(selectedFiles)
    setFiles((prev) => [...prev, ...newFiles])
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)
      handleFileSelect(e.dataTransfer.files)
    },
    [handleFileSelect]
  )

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name || !formData.email || !formData.message) {
      setSubmitStatus("error")
      setErrorMessage(
        isRTL
          ? "يرجى ملء الاسم والبريد الإلكتروني والرسالة."
          : "Please fill in your name, email, and message."
      )
      return
    }

    setSubmitStatus("loading")
    setErrorMessage("")

    try {
      const backendUrl =
        process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL ||
        process.env.NEXT_PUBLIC_BASE_URL ||
        "http://localhost:9000"
      const publishableKey = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY

      const formPayload = new FormData()
      formPayload.append("customer_name", formData.name)
      formPayload.append("customer_email", formData.email)
      formPayload.append("customer_phone", formData.phone)
      if (formData.location) {
        formPayload.append("customer_address", formData.location)
      }
      if (formData.company) {
        formPayload.append("company_name", formData.company)
      }
      if (formData.subject) {
        formPayload.append("subject", formData.subject)
      }
      formPayload.append("notes", formData.message)

      files.forEach((file) => {
        formPayload.append("files", file)
      })

      const response = await fetch(`${backendUrl}/store/appointments`, {
        method: "POST",
        headers: {
          ...(publishableKey
            ? { "x-publishable-api-key": publishableKey }
            : {}),
        },
        body: formPayload,
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => null)
        throw new Error(
          errorData?.message || `Server error: ${response.status}`
        )
      }

      setSubmitStatus("success")
    } catch (err) {
      setSubmitStatus("error")
      setErrorMessage(
        err instanceof Error
          ? err.message
          : isRTL
            ? "حدث خطأ أثناء الإرسال. يرجى المحاولة مرة أخرى."
            : "An error occurred during submission. Please try again."
      )
    }
  }

  if (submitStatus === "success") {
    return (
      <div
        dir={isRTL ? "rtl" : "ltr"}
        className="bg-white border border-[#e5e7eb] rounded-[16px] p-[20px] lg:p-[24px] w-full flex flex-col gap-[20px] lg:gap-[28px] items-center text-center py-[40px]"
      >
        <div className="w-[64px] h-[64px] rounded-full bg-green-100 flex items-center justify-center">
          <svg
            className="w-8 h-8 text-green-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <div className="flex flex-col gap-[8px] items-center">
          <h2 className="text-[24px] lg:text-[28px] font-bold text-[#17284a]">
            {isRTL ? "تم استلام طلبك" : "Your request has been received"}
          </h2>
          <p className="text-[16px] text-[#5d5d61] max-w-[400px]">
            {isRTL
              ? "شكراً لتواصلك معنا. سيتواصل فريقنا معك قريباً."
              : "Thank you for reaching out. Our team will get back to you shortly."}
          </p>
        </div>
        <button
          onClick={() => {
            setSubmitStatus("idle")
            setFormData({
              name: "",
              location: "",
              email: "",
              phone: "",
              company: "",
              subject: "",
              message: "",
            })
            setFiles([])
          }}
          className="bg-[#17284a] text-white text-[16px] font-medium rounded-[12px] py-[14px] px-[28px] hover:bg-[#0f1d38] transition"
        >
          {isRTL ? "إرسال طلب آخر" : "Send another request"}
        </button>
      </div>
    )
  }

  return (
    <div
      dir={isRTL ? "rtl" : "ltr"}
      className="bg-white border border-[#e5e7eb] rounded-[16px] p-[20px] lg:p-[24px] w-full lg:max-w-[728px] flex flex-col gap-[20px] lg:gap-[28px]"
    >
      {submitStatus === "error" && (
        <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-lg px-4 py-3 w-full">
          <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
          <p className="text-[14px] text-red-700">
            {errorMessage ||
              (isRTL
                ? "حدث خطأ أثناء الإرسال. يرجى المحاولة مرة أخرى."
                : "An error occurred during submission. Please try again.")}
          </p>
        </div>
      )}

      <form
        className="flex flex-col gap-[16px] lg:gap-[20px]"
        onSubmit={handleSubmit}
      >
        {/* Row 1 - Names */}
        <div className="flex gap-[16px] flex-col lg:flex-row">
          <div className="flex-1 flex flex-col gap-[6px] lg:gap-[8px]">
            <label className="text-[14px] font-medium text-[#17284a]">
              {isRTL ? "الاسم الكامل" : "Full Name"}
            </label>
            <input
              name="name"
              required
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              className="h-[44px] lg:h-[52px] bg-[#f3f4f6] rounded-[8px] px-[14px] lg:px-[16px] py-[12px] lg:py-[14px] text-[16px] text-[#17284a] placeholder:text-[#5d5d61] focus:outline-none focus:ring-2 focus:ring-[#17284a]/20"
              placeholder={isRTL ? "مثال: علي" : "e.g. Aly"}
            />
          </div>
          <div className="flex-1 flex flex-col gap-[6px] lg:gap-[8px]">
            <label className="text-[14px] font-medium text-[#17284a]">
              {isRTL ? "الموقع" : "Location"}
            </label>
            <input
              name="location"
              value={formData.location}
              onChange={(e) => handleChange("location", e.target.value)}
              className="h-[44px] lg:h-[52px] bg-[#f3f4f6] rounded-[8px] px-[14px] lg:px-[16px] py-[12px] lg:py-[14px] text-[16px] text-[#17284a] placeholder:text-[#5d5d61] focus:outline-none focus:ring-2 focus:ring-[#17284a]/20"
              placeholder={isRTL ? "مثال: المنصورة" : "e.g. Mansoura"}
            />
          </div>
        </div>

        {/* Row 2 - Contacts */}
        <div className="flex gap-[16px] flex-col lg:flex-row">
          <div className="flex-1 flex flex-col gap-[6px] lg:gap-[8px]">
            <label className="text-[14px] font-medium text-[#17284a]">
              {isRTL ? "البريد الإلكتروني" : "Email Address"}
            </label>
            <input
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
              className="h-[44px] lg:h-[52px] bg-[#f3f4f6] rounded-[8px] px-[14px] lg:px-[16px] py-[12px] lg:py-[14px] text-[16px] text-[#17284a] placeholder:text-[#5d5d61] focus:outline-none focus:ring-2 focus:ring-[#17284a]/20"
              placeholder={
                isRTL ? "مثال: علي@شركة.com" : "e.g. aly@company.com"
              }
            />
          </div>
          <div className="flex-1 flex flex-col gap-[6px] lg:gap-[8px]">
            <label className="text-[14px] font-medium text-[#17284a]">
              {isRTL ? "رقم الهاتف" : "Phone Number"}
            </label>
            <input
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
              className="h-[44px] lg:h-[52px] bg-[#f3f4f6] rounded-[8px] px-[14px] lg:px-[16px] py-[12px] lg:py-[14px] text-[16px] text-[#17284a] placeholder:text-[#5d5d61] focus:outline-none focus:ring-2 focus:ring-[#17284a]/20"
              placeholder={
                isRTL ? "مثال: +20 100 123 4567" : "e.g. +20 100 123 4567"
              }
            />
          </div>
        </div>

        {/* Company Name */}
        <div className="flex flex-col gap-[6px] lg:gap-[8px]">
          <label className="text-[14px] font-medium text-[#17284a]">
            {isRTL ? "اسم الشركة" : "Company Name"}
          </label>
          <input
            name="company"
            value={formData.company}
            onChange={(e) => handleChange("company", e.target.value)}
            className="h-[44px] lg:h-[52px] bg-[#f3f4f6] rounded-[8px] px-[14px] lg:px-[16px] py-[12px] lg:py-[14px] text-[16px] text-[#17284a] placeholder:text-[#5d5d61] focus:outline-none focus:ring-2 focus:ring-[#17284a]/20"
            placeholder={
              isRTL
                ? "مثال: شركاء تطوير القاهرة"
                : "e.g. Cairo Development Partners"
            }
          />
        </div>

        {/* Subject Dropdown */}
        <div className="flex flex-col gap-[6px] lg:gap-[8px]">
          <label className="text-[14px] font-medium text-[#17284a]">
            {isRTL ? "الموضوع" : "Subject"}
          </label>
          <div className="relative">
            <select
              name="subject"
              value={formData.subject}
              onChange={(e) => handleChange("subject", e.target.value)}
              className="h-[44px] lg:h-[52px] w-full bg-[#f3f4f6] rounded-[8px] px-[14px] lg:px-[16px] py-[12px] lg:py-[14px] text-[16px] text-[#17284a] appearance-none focus:outline-none focus:ring-2 focus:ring-[#17284a]/20 cursor-pointer"
              defaultValue=""
            >
              <option value="" disabled>
                {isRTL ? "اختر موضوعاً" : "Select a topic"}
              </option>
              {subjectOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
            <ChevronDown
              size={20}
              className="absolute right-[14px] lg:right-[16px] top-1/2 -translate-y-1/2 text-[#17284a] pointer-events-none"
            />
          </div>
        </div>

        {/* Message */}
        <div className="flex flex-col gap-[6px] lg:gap-[8px]">
          <label className="text-[14px] font-medium text-[#17284a]">
            {isRTL ? "الرسالة" : "Message"}
          </label>
          <textarea
            name="message"
            rows={4}
            required
            value={formData.message}
            onChange={(e) => handleChange("message", e.target.value)}
            className="bg-[#f3f4f6] rounded-[8px] px-[14px] lg:px-[16px] py-[12px] lg:py-[14px] text-[16px] text-[#17284a] placeholder:text-[#5d5d61] focus:outline-none focus:ring-2 focus:ring-[#17284a]/20 resize-none"
            placeholder={
              isRTL
                ? "أخبرنا عن متطلبات مشروعك، الكميات، والجدول الزمني..."
                : "Tell us about your project requirements, quantities, and timelines..."
            }
          />
        </div>

        {/* Upload Section - visible on all screen sizes */}
        <div className="flex flex-col gap-[12px]">
          <label className="text-[14px] font-medium text-[#17284a]">
            {isRTL ? "المرفقات (اختياري)" : "Attachments (Optional)"}
          </label>
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
            className={`bg-[#f9fafb] border border-dashed flex flex-col gap-[12px] items-center justify-center py-[24px] lg:py-[32px] cursor-pointer hover:border-[#17284a]/30 transition rounded-[12px] ${
              isDragging
                ? "border-[#17284a] bg-[#17284a]/5"
                : "border-[#e5e7eb]"
            }`}
          >
            <UploadCloud size={32} className="text-[#17284a]" />
            <div className="flex flex-col gap-[4px] items-center">
              <p className="text-[16px] text-[#17284a]">
                {isRTL
                  ? "اسحب وأفلت الملفات هنا أو"
                  : "Drag & drop files here or"}
              </p>
              <p className="text-[14px] font-medium text-[#17284a] underline">
                {isRTL ? "تصفح الملفات" : "Browse Files"}
              </p>
            </div>
          </div>
          <p className="text-[14px] text-[#6b7280]">
            {isRTL
              ? "الصيغ المقبولة: PDF, DOC, DOCX, XLS, XLSX, DWG — الحد الأقصى 10 ميجابايت لكل ملف"
              : "Accepted formats: PDF, DOC, DOCX, XLS, XLSX, DWG — Max 10MB per file"}
          </p>

          {/* Selected files list */}
          {files.length > 0 && (
            <div className="flex flex-col gap-[8px] mt-[4px]">
              {files.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between bg-[#f3f4f6] border border-[#e5e7eb] rounded-[8px] px-[14px] py-[12px] w-full"
                >
                  <div className="flex flex-col min-w-0 flex-1">
                    <p className="text-[14px] font-medium text-[#17284a] truncate">
                      {file.name}
                    </p>
                    <p className="text-[12px] text-[#707176]">
                      {formatFileSize(file.size)} — {file.type || "unknown"}
                    </p>
                  </div>
                  <button
                    type="button"
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

        {/* Submit Button */}
        <button
          type="submit"
          disabled={submitStatus === "loading"}
          className="bg-[#17284a] text-white text-[16px] font-medium rounded-[16px] lg:rounded-[12px] py-[24px] px-[36px] hover:bg-[#0f1d38] transition flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {submitStatus === "loading" && (
            <Loader2 className="w-5 h-5 text-white animate-spin" />
          )}
          <span>
            {submitStatus === "loading"
              ? isRTL
                ? "جارٍ الإرسال..."
                : "Submitting..."
              : isRTL
                ? "إرسال الاستفسار ←"
                : "Submit Enquiry →"}
          </span>
        </button>
      </form>
    </div>
  )
}
