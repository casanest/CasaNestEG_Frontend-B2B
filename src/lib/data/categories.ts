import { sdk } from "@lib/config";
import { HttpTypes } from "@medusajs/types";
import { getCacheOptions } from "./cookies";

export type Category = {
  id: string;
  name_en: string;
  name_ar: string;
  description_en: string;
  description_ar: string;
  handle_en: string;
  handle_ar: string;
  image_url: string | null;
  parent_category_id: string | null;
  parent_category: Category | null;
  category_children: Category[];
  products: any[];
};

/**
 * 🧩 Fetch and structure all product categories from Medusa API.
 * Builds a full category tree with localized metadata.
 */
export const listCategories = async (query?: Record<string, any>): Promise<Category[]> => {
  const next = {
    ...(await getCacheOptions("categories")),
  };

  const limit = query?.limit || 100;

  const { product_categories } = await sdk.client.fetch<{
    product_categories: Category[];
  }>("/store/product-categories", {
    query: {
      fields:
        "*category_children,*products,*parent_category,*parent_category.parent_category",
      limit,
      ...query,
    },
    next,
    cache: "no-store",
  });

  // 🟢 Normalize and localize
  const categories: Category[] = product_categories.map((cat) => {
    const ar = cat.metadata?.localizations?.ar;
    const en = cat.metadata?.localizations?.en;

    return {
      id: cat.id,
      name_en: en?.name || cat.name,
      name_ar: ar?.name || cat.name,
      description_en: en?.description || cat.description,
      description_ar: ar?.description || cat.description,
      handle_en: en?.handle || cat.handle,
      handle_ar: ar?.handle || cat.handle,
      image_url: cat.metadata?.image_url || null,
      available_languages: cat.metadata?.available_languages || [],
      parent_category_id: cat.parent_category_id || null,
      parent_category: cat.parent_category
        ? {
          id: cat.parent_category.id,
          name_en: cat.parent_category.name,
          name_ar: cat.parent_category.name,
          handle_en: cat.parent_category.handle,
          handle_ar: cat.parent_category.handle,
          image_url: cat.parent_category.metadata?.image_url || null,
          parent_category_id: cat.parent_category.parent_category_id || null,
          category_children: [],
        }
        : null,
      category_children: [],
    };
  });

  // === Build tree structure ===
  const mapById = new Map<string, Category>();
  categories.forEach((cat) => mapById.set(cat.id, { ...cat, category_children: [] }));

  const roots: Category[] = [];
  categories.forEach((cat) => {
    if (cat.parent_category_id && mapById.has(cat.parent_category_id)) {
      const parent = mapById.get(cat.parent_category_id)!;
      parent.category_children!.push(mapById.get(cat.id)!);
    } else {
      roots.push(mapById.get(cat.id)!);
    }
  });

  return roots;
};

/**
 * 📦 Extracts only parent (root-level) categories
 */
export function getParentCategories(categories: Category[]) {
  return categories
    .filter((cat) => !cat.parent_category_id)
    .map((cat) => ({
      id: cat.id,
      name_en: cat.name_en,
      name_ar: cat.name_ar,
      handle_en: cat.handle_en,
      handle_ar: cat.handle_ar,
      image_url: cat.image_url,
    }));
}

/**
 * 🔍 Fetch a category by handle (supports both API and fallback local search)
 */
export const getCategoryByHandle = async (
  categoryHandle: string[]
): Promise<Category | null> => {
  const handle = categoryHandle.join("/");
  const next = await getCacheOptions("categories");

  // --- Step 1: Try fetching directly from Medusa API ---
  try {
    const response = await sdk.client.fetch<HttpTypes.StoreProductCategoryListResponse>(
      "/store/product-categories",
      {
        query: {
          fields:
            "*category_children,*products,*parent_category,*parent_category.parent_category",
          handle,
        },
        next,
        cache: "no-store",
      }
    );

    const cat = response?.product_categories?.[0];
    if (cat) {
      const ar = cat.metadata?.localizations?.ar ?? {};
      const en = cat.metadata?.localizations?.en ?? {};

      return {
        id: cat.id,
        name_en: en.name || cat.name,
        name_ar: ar.name || cat.name,
        description_en: en.description || cat.description,
        description_ar: ar.description || cat.description,
        handle_en: en.handle || cat.handle,
        handle_ar: ar.handle || cat.handle,
        image_url: cat.metadata?.image_url || null,
        available_languages: cat.metadata?.available_languages || [],
        parent_category_id: cat.parent_category_id || null,
        parent_category: cat.parent_category || null,
        category_children: cat.category_children || [],
        products: cat.products || [],
      };
    }
  } catch (error) {
    console.warn(`⚠️ [getCategoryByHandle] Medusa fetch failed: ${handle}`, error);
  }

  // --- Step 2: Fallback - search within all categories ---
  try {
    const allCategories = await listCategories();
    const flatList: Category[] = [];

    const flatten = (cats: Category[]) => {
      for (const c of cats) {
        flatList.push(c);
        if (c.category_children?.length) flatten(c.category_children);
      }
    };
    flatten(allCategories);

    const lowerHandle = handle.toLowerCase();
    const found = flatList.find((cat) => {
      const handles = [cat.handle_en, cat.handle_ar].filter(Boolean).map((h) => h!.toLowerCase());
      return handles.includes(lowerHandle);
    });

    if (found) return found;
  } catch (error) {
    console.warn(`⚠️ [getCategoryByHandle] Fallback search failed`, error);
  }

  return null;
};

