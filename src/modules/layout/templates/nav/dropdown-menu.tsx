"use client";

import React from "react";
import { cn } from "@lib/util/cn";
import { formatNameForTestId } from "@lib/util/formatNameForTestId";
import { Box } from "@modules/common/components/box";
import { Button } from "@modules/common/components/button";
import { Container } from "@modules/common/components/container";
import LocalizedClientLink from "@modules/common/components/localized-client-link";
import { NavigationItem } from "@modules/common/components/navigation-item";
import { Category } from "@lib/data/categories"; // ← import your fixed Category type

// Props
interface DropdownMenuProps {
  item: Category;
  activeItem: Category | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  locale: string;
  children: React.ReactNode;
  customContent?: React.ReactNode;
}

/**
 * 💡 Dropdown menu for category navigation.
 * Supports full tree structure and localization (EN/AR).
 */
const DropdownMenu: React.FC<DropdownMenuProps> = ({
  item,
  activeItem,
  isOpen,
  onOpenChange,
  locale,
  children,
  customContent,
}) => {
  const isRTL = locale === "ar";

  const getLocalized = (cat: Category) => ({
    name: isRTL ? cat.name_ar || cat.name_en : cat.name_en || cat.name_ar,
    handle: isRTL ? cat.handle_ar || cat.handle_en : cat.handle_en || cat.handle_ar,
  });

  // Renders subcategories grid
  console.log("items", item.category_children)
  const renderSubcategories = (categories: Category[]) => (
    <Container className="flex flex-col gap-6 !px-10 !pb-8 !pt-5">
      {/* "Shop All" Button */}
      {/* {activeItem?.name_en !== "Collections" && (
        <Button
          variant="tonal"
          className="w-max !px-4 !py-2 text-sm font-medium"
          onClick={() => onOpenChange(false)}
          asChild
        >
          <LocalizedClientLink href={`/${getLocalized(activeItem).handle_en}`}>
            {isRTL ? "تسوق كل " : "Shop all "}
            {activeItem?.name === "Shop" || activeItem?.name === "Collections"
              ? ""
              : getLocalized(activeItem).name_en}
          </LocalizedClientLink>
        </Button>
      )} */}

      {/* Subcategories grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
        {categories.map((subItem, index) => {
          const sub = getLocalized(subItem);
          return (
            <div key={subItem.id ?? index} className="flex flex-col gap-2">
              <NavigationItem
                href={`/${sub.handle_en}`}
                className="w-max py-2 text-lg font-semibold text-basic-primary hover:text-action-primary hover:border-b hover:border-action-primary transition-all"
                data-testid={formatNameForTestId(`${sub.name_en}-category-title`)}
              >
                {sub.name_en}
              </NavigationItem>

              {/* Nested children */}
              {subItem.category_children?.length > 0 && (
                <div className="flex flex-col">
                  {subItem.category_children.map((child) => {
                    const ch = getLocalized(child);
                    return (
                      <NavigationItem
                        key={child.id}
                        href={`/${ch.handle_en}`}
                        className="py-1.5 text-sm text-secondary hover:text-action-primary transition"
                        data-testid={formatNameForTestId(`${ch.name_en}-category-item`)}
                      >
                        {ch.name_en}
                      </NavigationItem>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </Container>
  );

  return (

    <div
      className="relative flex"
      onMouseEnter={() => onOpenChange(true)}
      onMouseLeave={() => onOpenChange(false)}
    >
      {children}

      {item.category_children?.length > 0 && (
        <Box
          className={cn(
            "absolute left-0 top-full z-50 w-full bg-white dark:bg-gray-900 shadow-lg transition-all duration-300",
            isOpen
              ? "pointer-events-auto opacity-100 visible translate-y-0"
              : "pointer-events-none opacity-0 invisible -translate-y-2"
          )}
        >
          {customContent ?? renderSubcategories(item.category_children)}
        </Box>
      )}
    </div>
  );
};

export default DropdownMenu;
