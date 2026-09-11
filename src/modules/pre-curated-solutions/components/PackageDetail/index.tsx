"use client"

import { useState, useMemo } from "react"
import { useRouter, useParams } from "next/navigation"
import { PackageDetail } from "@lib/data/packages"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import PackageItemCard from "../PackageItemCard"
import SummaryCard from "../SummaryCard"
import { Check } from "lucide-react"
import { useCartStore } from "@lib/store/useCartStore"
import { useRfqStore } from "@lib/store/useRfqStore"

type PackageDetailProps = {
  pkg: PackageDetail
  locale: string
}

type ItemState = {
  productId: string
  selected: boolean
  quantity: number
}

export default function PackageDetailClient({ pkg, locale }: PackageDetailProps) {
  const isRTL = locale === "ar"
  const router = useRouter()
  const { countryCode, locale: urlLocale } = useParams()
  const addItem = useCartStore((state) => state.addItem)
  const openCartDropdown = useCartStore((state) => state.openCartDropdown)
  const setRfqItems = useRfqStore((state) => state.setItems)
  const [isAdding, setIsAdding] = useState(false)

  const name = isRTL ? pkg.name_ar : pkg.name_en
  const description = isRTL ? pkg.description_ar : pkg.description_en

  const reassuranceBadge = isRTL
    ? "اطلب التسعير — بدون دفع، بدون التزام"
    : "Request Pricing — No Payment, No Obligation"

  const descriptionText = isRTL
    ? "كل ما يحتاجه الفندق، تم اختياره مسبقاً من قبل فريقنا. احذف ما لا تحتاجه، عدّل الكميات، ثم اطلب عرض سعر."
    : "Everything a hotel needs, pre-selected by our team. Remove anything you don't need, adjust quantities, then request a quote."

  const homeText = isRTL ? "الرئيسية" : "Home"
  const curatedSolutionsText = isRTL ? "حلول مجهزة" : "Curated Solutions"
  const itemsPreSelectedText = isRTL ? "عناصر محددة مسبقاً" : "Items Pre-selected"

  const allProducts = useMemo(() => {
    return pkg.titles.flatMap((title) =>
      title.products.map((product) => ({
        product,
        titleId: title.id,
        titleName: isRTL ? title.name_ar : title.name_en,
      }))
    )
  }, [pkg, isRTL])

  const [itemStates, setItemStates] = useState<Record<string, ItemState>>(() => {
    const states: Record<string, ItemState> = {}
    allProducts.forEach(({ product }) => {
      states[product.id] = {
        productId: product.id,
        selected: true,
        quantity: product.moq || 1,
      }
    })
    return states
  })

  const toggleItem = (productId: string) => {
    setItemStates((prev) => ({
      ...prev,
      [productId]: {
        ...prev[productId],
        selected: !prev[productId].selected,
      },
    }))
  }

  const incrementQty = (productId: string) => {
    setItemStates((prev) => ({
      ...prev,
      [productId]: {
        ...prev[productId],
        quantity: Math.min(999, prev[productId].quantity + 1),
      },
    }))
  }

  const decrementQty = (productId: string) => {
    const product = allProducts.find((p) => p.product.id === productId)?.product
    const minQty = product?.moq || 1
    setItemStates((prev) => ({
      ...prev,
      [productId]: {
        ...prev[productId],
        quantity: Math.max(minQty, prev[productId].quantity - 1),
      },
    }))
  }

  const selectedCount = useMemo(() => {
    return Object.values(itemStates).filter((s) => s.selected).length
  }, [itemStates])

  const totalCount = allProducts.length

  const categoryCounts = useMemo(() => {
    const counts: Record<string, { name: string; selected: number; total: number }> = {}
    pkg.titles.forEach((title) => {
      const titleName = isRTL ? title.name_ar : title.name_en
      counts[title.id] = {
        name: titleName,
        selected: 0,
        total: title.products.length,
      }
      title.products.forEach((product) => {
        if (itemStates[product.id]?.selected) {
          counts[title.id].selected++
        }
      })
    })
    return counts
  }, [pkg, itemStates, isRTL])

  const sortedTitles = [...pkg.titles].sort((a, b) => a.display_order - b.display_order)

  const handleAddToQuoteList = () => {
    const selectedItems = allProducts.filter(
      ({ product }) => itemStates[product.id]?.selected
    )

    if (selectedItems.length === 0) return

    setIsAdding(true)

    selectedItems.forEach(({ product, titleName }) => {
      const state = itemStates[product.id]
      addItem({
        productId: product.id,
        variantId: product.id,
        productHandle: product.handle,
        productTitle: product.title,
        productTitleAr: product.title_ar ?? undefined,
        productDescription: isRTL ? product.description_en ?? undefined : product.description_en ?? undefined,
        productDescriptionAr: product.description_ar ?? undefined,
        thumbnail: product.thumbnail,
        images: [],
        quantity: state?.quantity ?? product.moq ?? 1,
        unitPrice: product.price?.amount ?? null,
        originalPrice: product.price?.original_amount ?? product.price?.amount ?? null,
        currencyCode: product.price?.currency_code ?? "usd",
        categoryName: titleName,
        minOrderQty: product.moq ?? undefined,
        showPrice: product.show_price ?? false,
      })
    })

    setIsAdding(false)
  }

  const handleRequestQuote = () => {
    if (selectedCount === 0) return

    const selectedItems = allProducts.filter(
      ({ product }) => itemStates[product.id]?.selected
    )

    setRfqItems(
      selectedItems.map(({ product, titleName }) => {
        const state = itemStates[product.id]
        return {
          productId: product.id,
          productTitle: product.title,
          quantity: state?.quantity ?? product.moq ?? 1,
          thumbnail: product.thumbnail,
          categoryName: titleName,
        }
      })
    )

    router.push(`/${urlLocale}/${countryCode}/pre-curated-solutions/${pkg.slug}/request-quote`)
  }

  return (
    <div className="bg-[#f8f9fa] w-full" dir={isRTL ? "rtl" : "ltr"}>
      {/* Header band */}
      <div className="flex flex-col gap-4 md:gap-6 px-4 md:px-8 lg:px-[clamp(32px,4vw,60px)] py-11 md:py-10 w-full max-w-[1600px] mx-auto">
        {/* Breadcrumbs */}
        <div className="flex gap-1 md:gap-2 items-center text-[14px] whitespace-normal md:whitespace-nowrap font-satoshi overflow-hidden">
          <LocalizedClientLink
            href="/"
            className="font-normal text-[#707176] leading-[1.5] hover:text-[#17284a] transition-colors"
          >
            {homeText}
          </LocalizedClientLink>
          <span className="font-normal text-[#707176] leading-[1.5]">/</span>
          <LocalizedClientLink
            href="/pre-curated-solutions"
            className="font-normal text-[#707176] leading-[1.5] hover:text-[#17284a] transition-colors"
          >
            {curatedSolutionsText}
          </LocalizedClientLink>
          <span className="font-normal text-[#707176] leading-[1.5]">/</span>
          <span className="font-bold text-[#17284a] leading-[1.5]">
            {name}
          </span>
        </div>

        {/* Title + reassurance badge */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:flex-wrap md:gap-4">
          <h1 className="font-satoshi font-bold leading-[1.3] md:leading-[1.18] text-[#17284a] text-[24px] md:text-[clamp(24px,3vw,40px)] whitespace-normal md:whitespace-nowrap">
            {name}
          </h1>
          <div className="bg-[#051026] md:bg-[#141b34] flex items-center gap-1.5 md:gap-0 px-4 py-2 md:py-[clamp(4px,0.4vw,6px)] rounded-full shrink-0">
            <Check className="w-3.5 h-3.5 md:hidden text-white" strokeWidth={3} />
            <p className="font-satoshi font-bold text-[14px] text-white whitespace-normal md:whitespace-nowrap leading-[1.5]">
              {reassuranceBadge}
            </p>
          </div>
        </div>

        {/* Description */}
        <p className="font-satoshi font-normal leading-[1.5] text-[#707176] text-[16px]">
          {description || descriptionText}
        </p>

      </div>

      {/* Columns wrapper */}
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-[clamp(24px,3vw,40px)] items-start px-4 md:px-8 lg:px-[clamp(32px,4vw,60px)] pt-0 pb-11 lg:pb-[clamp(32px,4vw,60px)] w-full max-w-[1600px] mx-auto">
        {/* Left - category sections */}
        <div className="flex flex-col gap-9 min-w-0 lg:flex-1">
          {sortedTitles.map((title) => {
            const titleName = isRTL ? title.name_ar : title.name_en
            const totalInCategory = title.products.length

            return (
              <div key={title.id} className="flex flex-col gap-4 lg:gap-3 w-full">
                {/* Category header */}
                <div className="flex items-center justify-between pb-2 w-full whitespace-normal md:whitespace-nowrap">
                  <p className="font-satoshi font-bold leading-[1.4] text-[#17284a] text-[20px]">
                    {titleName}
                  </p>
                  <p className="font-satoshi font-normal leading-[1.5] text-[#707176] text-[14px]">
                    {totalInCategory} {itemsPreSelectedText}
                  </p>
                </div>

                {/* Items grid - wrapped */}
                <div className="grid grid-cols-2 gap-3 sm:gap-4 items-start w-full lg:grid-cols-4 lg:gap-4">
                  {title.products.map((product) => (
                    <div key={product.id} className="w-full">
                      <PackageItemCard
                        product={product}
                        locale={locale}
                        selected={itemStates[product.id]?.selected ?? true}
                        quantity={itemStates[product.id]?.quantity ?? product.moq ?? 1}
                        onToggle={() => toggleItem(product.id)}
                        onIncrement={() => incrementQty(product.id)}
                        onDecrement={() => decrementQty(product.id)}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>

        {/* Right - summary card */}
        <div className="lg:w-[clamp(320px,32vw,440px)] lg:shrink-0 lg:self-stretch">
          <SummaryCard
            locale={locale}
            packageName={name}
            selectedCount={selectedCount}
            totalCount={totalCount}
            categoryCounts={Object.values(categoryCounts)}
            onAddToQuoteList={handleAddToQuoteList}
            isAdding={isAdding}
            onRequestQuote={handleRequestQuote}
          />
        </div>
      </div>
    </div>
  )
}

