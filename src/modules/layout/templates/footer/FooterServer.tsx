// components/FooterServer.tsx
import { getParentCategories, listCategories } from "@lib/data/categories";
import { getCollectionsLocal, listCollections } from "@lib/data/collections";
import { getLocale } from "next-intl/server";
import Footer from "./Footer";

export default async function FooterServer() {
    // Fetch locale
    const locale = await getLocale();

    // Fetch categories and filter parent ones
    const categories = await listCategories();
    const parentCategories = await getParentCategories(categories);

    // Fetch collections (all)
    const {collections}  = await getCollectionsLocal();
    console.log("Footer collections:", collections);
    // Return server-rendered Footer
    return (
        <Footer
            productCategories={parentCategories}
            collections={collections}
            locale={locale}
        />
    );
}
