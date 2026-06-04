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
    categories?: Array<{
        id: string;
        name_en: string;
        name_ar: string;
        parent_category_id?: string | null;
    }>;
    currentCategoryId?: string;
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
    categories,
    currentCategoryId,
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
        <div
            dir={isRTL ? "rtl" : "ltr"}
            className="mb-4 overflow-hidden rounded-xl border border-gray-100 bg-gray-50 shadow-sm"
        >
            {/* Desktop */}
            <div className="hidden sm:flex items-center justify-between px-5 py-3">
                <div className="flex items-center gap-2">
                    <span className="text-2xl font-black text-gray-900">
                        {productCount}
                    </span>
                    <span className="text-sm font-bold text-gray-500">
                        {isRTL ? "منتج" : "Products"}
                    </span>
                </div>

                <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-gray-500">
                        {isRTL ? "الترتيب:" : "Sort:"}
                    </span>

                    <Select value={sort} onValueChange={handleSortChange}>
                        <Select.Trigger
                            className="
            h-10 min-w-[180px]
            bg-white
            border border-gray-200
            rounded-lg
            font-bold
          "
                        >
                            <Select.Value />
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
            </div>

            {/* Mobile */}
            <div className="sm:hidden sticky top-0 z-20 overflow-hidden rounded-xl bg-white shadow-sm backdrop-blur">
                <div className="grid grid-cols-2 ">

                    <div className="flex items-center justify-center gap-2 py-3">
                        <span className="text-2xl font-black tracking-tight text-gray-900">
                            {productCount}
                        </span>

                        <span className="text-xs font-bold uppercase tracking-wide text-gray-500">
                            {productLabel}
                        </span>
                    </div>

                    {/* divider */}
                    {/* <div className="h-full w-px bg-gray-200 justify-self-start" /> */}

                    <div className="flex items-center justify-center">
                        <RefinementList
                            locale={locale}
                            sortBy={sort}
                            countryCode={countryCode}
                            categories={categories}
                            currentCategoryId={currentCategoryId}
                        />
                    </div>

                </div>
            </div>
        </div>
    );
};
