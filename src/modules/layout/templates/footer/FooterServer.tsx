import { getParentCategories, listCategories } from "@lib/data/categories";
import { getCollectionsLocal } from "@lib/data/collections";
import { listSocialMedia } from "@lib/data/social-media";
import Footer from "./Footer";

type FooterServerProps = {
    locale: string;
};

export default async function FooterServer({ locale }: FooterServerProps) {
    const [categoriesRes, collectionsRes, socialMediaLinks] = await Promise.all([
        listCategories(),
        getCollectionsLocal(),
        listSocialMedia()
    ]);

    const categories = Array.isArray(categoriesRes)
        ? categoriesRes
        : (categoriesRes as any)?.categories ?? [];

    const collections = (Array.isArray((collectionsRes as any)?.collections)
        ? (collectionsRes as any).collections
        : []) as any;

    const parentCategories = await getParentCategories(categories);

    return (
        <Footer
            productCategories={parentCategories || []}
            collections={collections}
            locale={locale}
            socialMediaLinks={socialMediaLinks}
        />
    );
}