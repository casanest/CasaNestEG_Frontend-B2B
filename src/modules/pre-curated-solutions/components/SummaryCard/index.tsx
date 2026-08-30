"use client"

type SummaryCardProps = {
  locale: string
  packageName: string
  selectedCount: number
  totalCount: number
  categoryCounts: {
    name: string
    selected: number
    total: number
  }[]
  onAddToQuoteList: () => void
  isAdding: boolean
  onRequestQuote: () => void
}

export default function SummaryCard({
  locale,
  packageName,
  selectedCount,
  totalCount,
  categoryCounts,
  onAddToQuoteList,
  isAdding,
  onRequestQuote,
}: SummaryCardProps) {
  const isRTL = locale === "ar"

  const yourPackageText = isRTL ? "باقتك" : "Your Package"
  const itemsSelectedText = isRTL
    ? `${selectedCount} من ${totalCount} عناصر محددة`
    : `${selectedCount} of ${totalCount} items selected`
  const selectedLabel = isRTL ? "محدد" : "Selected"
  const microCopy1 = isRTL
    ? "يمكن لمشتري المشتريات تعديل الكميات وإزالة العناصر قبل الإرسال."
    : "Procurement buyers can adjust quantities and remove items before submittal."
  const microCopy2 = isRTL
    ? "التسعير النهائي يرسله فريقنا بعد إرسالك للطلب."
    : "Final pricing sent by our team after you submit."
  const requestQuoteText = isRTL
    ? "اطلب عرض سعر لهذه الباقة"
    : "Request Quote for This Package"
  const addToQuoteListText = isRTL
    ? "أضف إلى قائمة عروض السعر"
    : "Add to Quote List"

  return (
    <div className="bg-white border border-[#e5e7eb] border-solid flex flex-col gap-5 md:gap-6 items-start p-6 md:p-8 rounded-2xl w-full lg:sticky lg:top-[8rem] lg:mt-12">
      {/* Header */}
      <div className="flex flex-col gap-1 md:gap-2 items-start w-full whitespace-normal md:whitespace-nowrap">
        <p className="font-satoshi font-bold leading-[1.4] md:leading-[1.3] text-[#17284a] text-[20px] md:text-[24px]">
          {yourPackageText}
        </p>
        <p className="font-satoshi font-medium md:font-bold leading-[1.5] text-[#707176] text-[16px]">
          {itemsSelectedText}
        </p>
      </div>

      {/* Divider */}
      <div className="bg-[#e5e7eb] h-px w-full" />

      {/* Category counts */}
      <div className="flex flex-col gap-3 md:gap-4 items-start text-[16px] text-[#17284a] w-full whitespace-normal md:whitespace-nowrap">
        {categoryCounts.map((cat, idx) => (
          <div
            key={idx}
            className="flex items-center justify-between w-full"
          >
            <p className="font-satoshi font-normal leading-[1.5]">
              {cat.name} {selectedLabel}
            </p>
            <p className="font-satoshi font-bold leading-[1.5]">
              {cat.selected}
            </p>
          </div>
        ))}
      </div>

      {/* Divider */}
      <div className="bg-[#e5e7eb] h-px w-full" />

      {/* Micro copy */}
      <div className="flex flex-col gap-1.5 md:gap-2 items-start text-[14px] w-full">
        <p className="font-satoshi font-normal leading-[1.5] text-[#707176] w-full">
          {microCopy1}
        </p>
        <p className="font-satoshi font-bold leading-[1.5] text-[#141b34] w-full">
          {microCopy2}
        </p>
      </div>

      {/* Request Quote button */}
      <div className="flex flex-col items-start pt-2 md:pt-0 w-full">
        <button
          onClick={onRequestQuote}
          disabled={selectedCount === 0}
          className="bg-[#17284a] flex items-center justify-center px-6 md:px-9 py-4 rounded-xl w-full hover:bg-[#141b34] transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <p className="font-satoshi font-medium leading-[1.5] text-[16px] text-center text-white whitespace-normal md:whitespace-nowrap">
            {requestQuoteText}
          </p>
        </button>
      </div>

      {/* Add to Quote List button */}
      <div className="flex flex-col items-start w-full">
        <button
          onClick={onAddToQuoteList}
          disabled={isAdding || selectedCount === 0}
          className="bg-[#17284a] flex items-center justify-center px-6 md:px-9 py-4 rounded-xl w-full hover:bg-[#141b34] transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <p className="font-satoshi font-medium leading-[1.5] text-[16px] text-center text-white whitespace-normal md:whitespace-nowrap">
            {isAdding
              ? isRTL ? "جارٍ الإضافة..." : "Adding..."
              : addToQuoteListText}
          </p>
        </button>
      </div>
    </div>
  )
}
