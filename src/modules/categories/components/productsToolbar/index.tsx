"use client";
import { ArrowUpDown, Package, Text } from "lucide-react";
import { clx, Select } from "@medusajs/ui";
import RefinementList from "@modules/store/components/refinement-list";

type ProductsToolbarProps = {
    productCount: number;
    sort: any;
    isRTL: boolean;
    locale: string;
    countryCode: string;
    // categoryId: string;
    // onSortChange?: (value: string) => void;
};

const handleSortChange = (value: string) => {
    //    ضيف للurl باراميتر جديد للفرز
    const url = new URL(window.location.href);
    url.searchParams.set("sortBy", value);
    window.location.href = url.toString();
};
export const ProductsToolbar = ({
    productCount,
    sort,
    isRTL,
    locale,
    countryCode,
    // categoryId,
    // onSortChange,
}: ProductsToolbarProps) => {
    const productLabel = isRTL
        ? productCount === 1
            ? "منتج"
            : "منتجات"
        : productCount === 1
            ? "product"
            : "products";

    const sortOptions = [
        { value: "created_at", label: isRTL ? "الأحدث" : "Newest" },
        { value: "price_asc", label: isRTL ? "السعر من الأقل إلى الأعلى" : "Price: Low to High" },
        { value: "price_desc", label: isRTL ? "السعر من الأعلى إلى الأقل" : "Price: High to Low" },
    ];



    return (
        <div dir={isRTL ? "rtl" : "ltr"} className="mb-6 overflow-hidden rounded-xl border border-gray-100 bg-[#F3F4F6] dark:bg-gray-900/50 dark:border-gray-800 shadow-sm">
            <div className="flex items-center justify-between px-5 py-3">
                {/* Left Side (in RTL): Product Count */}
                <div className="flex items-center gap-1.5">
                    <span className="text-xl font-black text-gray-950 dark:text-white leading-none">
                        {productCount}
                    </span>
                    <span className="text-[14px] font-bold text-gray-600 dark:text-gray-400">
                        {isRTL ? "منتج" : "products"}
                    </span>
                </div>
                {/* Right Side (in RTL): Sort Selection */}
                <div className="flex items-center gap-4">
                    {/* Desktop Sort */}
                    <div className="hidden items-center gap-2 sm:flex">
                        <span className="text-[13px] font-bold text-gray-500 dark:text-gray-400">
                            {isRTL ? "الترتيب:" : "Sort:"}
                        </span>

                        <Select value={sort} onValueChange={handleSortChange}>
                            <Select.Trigger className={clx(
                                "h-9 min-w-[70px] border-none bg-transparent p-0 shadow-none bg-white hover:bg-black/5 transition-all focus:ring-0",
                                "text-[13px] font-extrabold text-gray-900 dark:text-white px-4 rounded-lg "
                            )}>
                                <Select.Value placeholder={isRTL ? "الاكثر رواجاً" : "Popularity"} />
                            </Select.Trigger>
                            <Select.Content className="rounded-xl border-none shadow-xl backdrop-blur-md">
                                {sortOptions.map((opt) => (
                                    <Select.Item key={opt.value} value={opt.value} className="text-xs font-bold text-start">
                                        {opt.label}
                                    </Select.Item>
                                ))}
                            </Select.Content>
                        </Select>
                    </div>

                    {/* Mobile Filter Button */}
                    <div className="sm:hidden">
                        <RefinementList
                            locale={locale}
                            sortBy={sort}
                            countryCode={countryCode}
                        />
                    </div>
                </div>

          

            </div>
        </div>
    );
};
