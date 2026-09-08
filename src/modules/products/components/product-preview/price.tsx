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
        <span className="text-[10px] font-bold text-[#17284A] tabular-nums">
          -{price.percentage_diff}%
        </span>
      )}
    </div>
  )
}
