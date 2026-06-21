import HeroSlider from "./HeroSlider";
import { getHeroSlides } from "./hero-slides";

const HeroCarousel = ({
    locale,
    dir
}: {
    locale: string;
    dir: string;
}) => {

    const isRTL = dir === "rtl";

    const slides = getHeroSlides(isRTL);

    return (
        <HeroSlider
            slides={slides}
            dir={dir}
        />
    );
};

export default HeroCarousel;