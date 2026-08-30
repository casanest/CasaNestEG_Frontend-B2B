'use client';

import { useMemo, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import LocalizedClientLink from '@modules/common/components/localized-client-link';

export type SubcategoryItem = {
  id: string;
  name_en?: string | null;
  name_ar?: string | null;
  handle_en?: string | null;
  handle_ar?: string | null;
  image_url?: string | null;
};

type SubcategoryCarouselProps = {
  items: SubcategoryItem[];
  isRTL: boolean;
};

const SubcategoryCarousel = ({ items, isRTL }: SubcategoryCarouselProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  const scrollAmount = useMemo(() => {
    const width = containerRef.current?.clientWidth || 0;
    return Math.max(240, Math.floor(width * 0.7));
  }, []);

  const scrollByAmount = (direction: 'left' | 'right') => {
    const amount = direction === 'left' ? -scrollAmount : scrollAmount;
    const normalized = isRTL ? -amount : amount;

    containerRef.current?.scrollBy({
      left: normalized,
      behavior: 'smooth',
    });
  };

  return ( 
    <section className="relative bg-white mx-auto justify-center align-center items-center">
      <button
        type="button"
        className={`hidden sm:flex absolute ${isRTL ? 'right-0' : 'left-0'} top-1/2 -translate-y-1/2 z-10 h-10 w-10 rounded-full bg-white shadow-md border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50 hover:text-black transition-all`}
        onClick={() => scrollByAmount('left')}
        aria-label={isRTL ? 'تحريك لليمين' : 'Scroll left'}
      >
        {isRTL ? <ChevronRight className="h-8 w-8" /> : <ChevronLeft className="h-8 w-8" />}
      </button>
      <button
        type="button"
        className={`hidden sm:flex absolute ${isRTL ? 'left-0' : 'right-0'} top-1/2 -translate-y-1/2 z-10 h-10 w-10 rounded-full bg-white shadow-md border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50 hover:text-black transition-all`}
        onClick={() => scrollByAmount('right')}
        aria-label={isRTL ? 'تحريك لليسار' : 'Scroll right'}
      >
        {isRTL ? <ChevronLeft className="h-8 w-8" /> : <ChevronRight className="h-8 w-8" />}
      </button>

      <div
        ref={containerRef}
        className="w-[100%] sm:w-[90%] mx-auto p-2 rounded-xl border border-gray-100 flex items-center gap-6 overflow-x-auto pb-2 px-4 scrollbar-hide bg-gray-50"
      >
        {items.map((c) => {
          const subCatName = isRTL ? c.name_ar || c.name_en : c.name_en || c.name_ar;
          const imageUrl = c.image_url || '/placeholder-category.webp';
          const subHandle = isRTL ? c.handle_ar || c.handle_en : c.handle_en || c.handle_ar;

          return (
            <LocalizedClientLink
              key={c.id}
              href={`/categories/${subHandle}`}
              className="group flex flex-col items-center gap-3 flex-shrink-0 w-28 text-center"
            >
              <div className="h-[120px] w-[120px] rounded-full bg-white   transition-all  flex items-center justify-center p-2">
                <img
                  src={imageUrl}
                  alt={subCatName || ''}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110 z-100"
                />
              </div>
              <span className="text-xs font-semibold text-gray-900 dark:text-gray-200  transition-colors leading-tight line-clamp-2">
                {subCatName}
              </span>
            </LocalizedClientLink>
          );
        })}
      </div>
    </section>
  );
};

export default SubcategoryCarousel;
