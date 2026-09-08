import { VariantPrice } from "types/global"

export default function PreviewPrice({ price }: { price: VariantPrice }) {
  if (!price) {
    return null
  }

  return (
    <div className="flex items-baseline gap-1.5 flex-wrap">
      {price.price_type === "sale" && (
        <span
          className="text-[12px] line-through text-[#707176] tabular-nums"
          data-testid="original-price"
        >
          {price.original_price}
        </span>
      )}
      <span
        className={
          price.price_type === "sale"
            ? "text-[14px] font-bold text-[#17284A] tabular-nums"
            : "text-[14px] font-bold text-[#17284a] tabular-nums"
        }
        data-testid="price"
      >
        {price.calculated_price}
      </span>
      {price.price_type === "sale" && price.percentage_diff && (
        <span className="inline-flex items-center justify-center px-2 py-[2px] h-[22px] bg-[#F3F4F6] border border-[#CCCCCC] rounded-full font-satoshi font-medium text-[12px] leading-[150%] text-[#17284A] tabular-nums whitespace-nowrap">
          -{price.percentage_diff}%
        </span>
      )}
    </div>
  )
}
