import { getParentCategories } from "@lib/data/categories";
import { getSiteLayout } from "@lib/data/site-layout";
import Footer from "./Footer";

type FooterServerProps = {
    locale: string;
};

export default async function FooterServer({ locale }: FooterServerProps) {
    const layoutData = await getSiteLayout();

    const rootCategories = layoutData.categories.filter(
        (c) => !c.parent_category_id
    );
    const collections = layoutData.collections;

    const parentCategories = getParentCategories(rootCategories as any);
    const socialMediaLinks = layoutData.social_media;

    return (
        <Footer
            productCategories={parentCategories || []}
            collections={collections}
            locale={locale}
            socialMediaLinks={socialMediaLinks}
        />
    );
}