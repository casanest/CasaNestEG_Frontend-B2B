import { getParentCategories, listCategories } from "@lib/data/categories";
import { getCollectionsLocal } from "@lib/data/collections";
import Footer from "./Footer";

type FooterServerProps = {
    locale: string;
};

export default async function FooterServer({ locale }: FooterServerProps) {
    const categoriesRes: any = await listCategories();
    const collectionsRes: any = await getCollectionsLocal();

    const categories = Array.isArray(categoriesRes)
        ? categoriesRes
        : categoriesRes?.categories ?? [];

    const collections = (Array.isArray(collectionsRes?.collections)
        ? collectionsRes.collections
        : []) as any;

    const parentCategories = await getParentCategories(categories);

    return (
        <Footer
            productCategories={parentCategories || []}
            collections={collections}
            locale={locale}
        />
    );
}