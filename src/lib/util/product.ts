import { HttpTypes } from "@medusajs/types";
import { sdk } from "@lib/config";
import { getCacheOptions } from "@lib/data/cookies";

export const isSimpleProduct = (product: HttpTypes.StoreProduct): boolean => {
    return product.options?.length === 1 && product.options[0].values?.length === 1;
}

export const buildCategoryParentMap = async (
    categoryIds?: string[]
): Promise<Map<string, string | null>> => {
    const map = new Map<string, string | null>()
    try {
        const cacheOpts = await getCacheOptions("categories")
        const next = { ...cacheOpts, tags: ["categories", ...("tags" in cacheOpts ? (cacheOpts.tags as string[]) : [])] }

        const query: Record<string, any> = {
            fields: "id,parent_category_id",
            limit: 200,
        }

        const { product_categories } = await sdk.client.fetch<{
            product_categories: any[]
        }>("/store/product-categories", {
            query,
            next,
            cache: "force-cache",
        })

        for (const cat of product_categories) {
            map.set(cat.id, cat.parent_category_id ?? null)
        }
    } catch {
        // ignore — getLeafCategory will fall back to last category
    }
    return map
}

export const getLeafCategory = (
    categories: any[] | null | undefined,
    parentMap?: Map<string, string | null>
): any | undefined => {
    if (!categories || categories.length === 0) return undefined
    if (categories.length === 1) return categories[0]

    // Build a set of ALL parent IDs from the parentMap (entire category tree)
    // This lets us identify leaves even when intermediate categories are
    // missing from the product's own category list (common with CSV imports)
    const allParentIds = new Set(
        Array.from(parentMap?.values() ?? []).filter((id): id is string => Boolean(id))
    )

    if (allParentIds.size > 0) {
        // A leaf is a category that is NOT a parent of any other category
        // in the full tree. Among multiple leaves, return the last one.
        const leaves = categories.filter((c) => !allParentIds.has(c.id))
        if (leaves.length > 0) {
            return leaves[leaves.length - 1]
        }
    }

    // Fallback: try using parent_category_id from the category objects
    const getParentId = (c: any): string | null | undefined => {
        if (c.parent_category_id !== undefined) return c.parent_category_id
        if (parentMap) return parentMap.get(c.id) ?? undefined
        return undefined
    }

    const parentIds = new Set(
        categories
            .map(getParentId)
            .filter((id): id is string => Boolean(id))
    )

    if (parentIds.size > 0) {
        const leaf = categories.find((c) => !parentIds.has(c.id))
        if (leaf) return leaf
    }

    // Final fallback: return the last category
    return categories[categories.length - 1]
}