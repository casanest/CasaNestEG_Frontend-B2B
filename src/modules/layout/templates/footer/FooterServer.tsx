import { cache } from "react";
import { getParentCategories, listCategories } from "@lib/data/categories";
import { getCollectionsLocal } from "@lib/data/collections";
import { getLocale } from "next-intl/server";
import Footer from "./Footer";

const getCategories = cache(listCategories);
const getCollections = cache(getCollectionsLocal);

export default async function FooterServer() {
    const [categoriesRes, collectionsRes, locale] = await Promise.all([
        getCategories(),
        getCollections(),
        getLocale(),
    ]);

    const categories = Array.isArray(categoriesRes)
        ? categoriesRes
        : categoriesRes?.categories ?? [];

    const collections = Array.isArray(collectionsRes?.collections)
        ? collectionsRes.collections
        : [];

    const parentCategories = await getParentCategories(categories);

    return (
        <Footer
            productCategories={parentCategories || []}
            collections={collections}
            locale={locale}
        />
    );
}