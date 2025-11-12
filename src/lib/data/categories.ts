import { sdk } from "@lib/config"
import { HttpTypes } from "@medusajs/types"
import { getCacheOptions } from "./cookies"
type Category = {
  id: string;
  name_en: string;
  name_ar: string;
  handle_en: string;
  handle_ar: string;
  image_url: string | null;
  parent_category_id: string | null;
};

// export const listCategories = async (query?: Record<string, any>) => {
//   const next = {
//     ...(await getCacheOptions("categories")),
//   }

//   const limit = query?.limit || 100

//   return sdk.client
//     .fetch<{ product_categories: HttpTypes.StoreProductCategory[] }>(
//       "/store/product-categories",
//       {
//         query: {
//           fields:
//             "*category_children, *products, *parent_category, *parent_category.parent_category",
//           limit,
//           ...query,
//         },
//         next,
//         cache: "no-store",
//       }
//     )
//     .then(({ product_categories }) => product_categories)
// }

// export const listCategories = async (query?: Record<string, any>) => {
//   const next = {
//     ...(await getCacheOptions("categories")),
//   }

//   const limit = query?.limit || 100

//   const { product_categories } = await sdk.client.fetch<{
//     product_categories: HttpTypes.StoreProductCategory[]
//   }>("/store/product-categories", {
//     query: {
//       fields:
//         "*category_children,*products,*parent_category,*parent_category.parent_category",
//       limit,
//       ...query,
//     },
//     next,
//     cache: "no-store",
//   })

//   // 🟢 نرجّع العربي والإنجليزي بشكل منظم
//   return product_categories.map((cat) => {
//     const ar = cat.metadata?.localizations?.ar
//     const en = cat.metadata?.localizations?.en

//     return {
//       id: cat.id,
//       name_en: en?.name || cat.name,
//       name_ar: ar?.name || cat.name,
//       description_en: en?.description || cat.description,
//       description_ar: ar?.description || cat.description,
//       handle_en: en?.handle || cat.handle,
//       handle_ar: ar?.handle || cat.handle,
//       image_url: cat.metadata?.image_url || null,
//       available_languages: cat.metadata?.available_languages || [],
//       parent_category: cat.parent_category,
//     }
//   })
// }

export const listCategories = async (query?: Record<string, any>) => {
  const next = {
    ...(await getCacheOptions("categories")),
  };

  const limit = query?.limit || 100;

  const { product_categories } = await sdk.client.fetch<{
    product_categories: HttpTypes.StoreProductCategory[];
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

  // 🟢 تحويل وتصنيف وتضمين localizations
  const categories = product_categories.map((cat) => {
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
      parent_category: cat.parent_category || null, // إذا أردت إضافته
      // يمكن إضافة حقول أخرى حسب الحاجة
    };
  });

  // === بناء شجرة التصنيفات ===

  // 1. خريطة للتصنيفات حسب ID
  const mapById = new Map<string, any>();
  categories.forEach((cat) => {
    mapById.set(cat.id, { ...cat, category_children: [] });
  });

  // 2. بناء الشجرة
  const roots: any[] = [];

  categories.forEach((cat) => {
    if (cat.parent_category_id && mapById.has(cat.parent_category_id)) {
      // إذا له أب موجود
      const parent = mapById.get(cat.parent_category_id);
      parent.category_children.push(mapById.get(cat.id));
    } else {
      // إذا ما له أب (جذر)
      roots.push(mapById.get(cat.id));
    }
  });

  return roots;
};

export function getParentCategories(categories: Category[]) {
  return categories
    .filter((cat) => !cat.parent_category_id) // الأب فقط (ليس له أب)
    .map((cat) => ({
      id: cat.id,
      name_en: cat.name_en,
      name_ar: cat.name_ar,
      handle: cat.handle_en || cat.handle_ar, // حسب اللغة اللي تحب تستخدمها
      image_url: cat.image_url,
    }));
}



export const getCategoryByHandle = async (categoryHandle: string[]) => {
  const handle = `${categoryHandle.join("/")}`

  const next = {
    ...(await getCacheOptions("categories")),
  }

  // First try to get by handle using the direct endpoint
  try {
    const response = await sdk.client
      .fetch<HttpTypes.StoreProductCategoryListResponse>(
        `/store/product-categories`,
        {
          query: {
            fields: "*category_children, *products, *parent_category, *parent_category.parent_category",
            handle,
          },
          next,
          cache: "no-store",
        }
      )
    
    if (response.product_categories && response.product_categories.length > 0) {
      return response.product_categories[0]
    }
  } catch (error) {
    console.warn(`Failed to fetch category by handle ${handle}:`, error)
  }

  // If not found by handle, try to find by name in all categories
  try {
    const allCategories = await listCategories()
    if (allCategories) {
      const foundCategory = allCategories.find(cat => 
        cat.name.toLowerCase().includes(handle.toLowerCase()) ||
        cat.handle.toLowerCase().includes(handle.toLowerCase().replace(/\s+/g, "-"))
      )
      if (foundCategory) {
        return foundCategory
      }
    }
  } catch (error) {
    console.warn(`Failed to search categories by name:`, error)
  }

  return null
}
