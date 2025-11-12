"use client";
import { Package } from "lucide-react";
import CategoryFilters from "../category-filters";
import { Select } from "@medusajs/ui";

type ProductsToolbarProps = {
    productCount: number;
    sort: any;
    isRTL: boolean;
    locale: string;
    countryCode: string;
    categoryId: string;
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
    categoryId,
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
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-4 mb-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
                {/* Left: Product Count */}
                <div className="flex items-center gap-3">
                    <Package className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                    <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                        {productCount}
                    </span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">{productLabel}</span>
                </div>

                {/* Right: Sort + Filters */}
                <div className="flex items-center gap-3">
                    {/* Sort Select */}
                    <Select
                        value={sort}
                        onValueChange={handleSortChange}
                        className="w-48"
                    >
                        <Select.Trigger className="w-full">
                            <Select.Value placeholder={isRTL ? "فرز حسب" : "Sort by"} />
                        </Select.Trigger>
                        <Select.Content>
                            {sortOptions.map((opt) => (
                                <Select.Item key={opt.value} value={opt.value}>
                                    {opt.label}
                                </Select.Item>
                            ))}
                        </Select.Content>
                    </Select>

                </div>
                    {/* Filters - mobile toggle */}
                    <div className="block sm:hidden">
                        <CategoryFilters
                            locale={locale}
                            sortBy={sort}
                            countryCode={countryCode}
                            categoryId={categoryId}
                        />
                    </div>
            </div>
        </div>
    );
};
