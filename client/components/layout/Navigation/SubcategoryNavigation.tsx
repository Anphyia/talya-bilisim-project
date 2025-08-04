'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

interface SubcategoryNavigationProps {
    subcategories: Array<{ id: string; name: string }>;
    className?: string;
}

export function SubcategoryNavigation({ subcategories, className = '' }: SubcategoryNavigationProps) {
    const [activeSubcategory, setActiveSubcategory] = useState<string>('');

    useEffect(() => {
        const observerOptions = {
            root: null,
            rootMargin: '-20% 0px -70% 0px',
            threshold: 0.1,
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const sectionId = entry.target.id.replace('section-', '');
                    setActiveSubcategory(sectionId);
                }
            });
        }, observerOptions);

        // Observe all subcategory sections
        subcategories.forEach((subcategory) => {
            const element = document.getElementById(`section-${subcategory.id}`);
            if (element) {
                observer.observe(element);
            }
        });

        return () => observer.disconnect();
    }, [subcategories]);

    const scrollToSection = (subcategoryId: string) => {
        const isFirstSection = subcategories[0]?.id === subcategoryId;

        if (isFirstSection) {
            // For first section, scroll to the main category header
            const mainElement = document.querySelector('main');
            if (mainElement) {
                const breadcrumbHeight = 73;
                const subcategoryNavHeight = 65;
                const totalOffset = breadcrumbHeight + subcategoryNavHeight;

                const elementPosition = mainElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - totalOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        } else {
            // For other sections, scroll to the section header
            const element = document.getElementById(`section-${subcategoryId}`);
            if (element) {
                const breadcrumbHeight = 73;
                const subcategoryNavHeight = 65;
                const sectionHeaderOffset = 20; // Extra space above section header
                const totalOffset = breadcrumbHeight + subcategoryNavHeight + sectionHeaderOffset;

                const elementPosition = element.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - totalOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        }
    };

    const handleKeyDown = (event: React.KeyboardEvent, subcategoryId: string) => {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            scrollToSection(subcategoryId);
        }
    };

    return (
        <div className={`sticky top-[73px] z-30 bg-white/95 backdrop-blur-sm border-b border-gray-100 ${className}`}>
            <div className={`container mx-auto ${activeSubcategory === subcategories[0]?.id ? 'px-1 md:px-2 lg:px-4' : 'px-0 md:px-1 lg:px-3'} pb-3`}>
                <ScrollArea className="w-full whitespace-nowrap">
                    <div className="flex space-x-2 m-4">
                        {subcategories.map((subcategory) => (
                            <Button
                                key={subcategory.id}
                                variant={activeSubcategory === subcategory.id ? "default" : "outline"}
                                size="sm"
                                onClick={() => scrollToSection(subcategory.id)}
                                onKeyDown={(e) => handleKeyDown(e, subcategory.id)}
                                className={`
  flex-shrink-0 transition-all duration-200 restaurant-font-body
  ${activeSubcategory === subcategory.id
                                        ? 'restaurant-bg-primary restaurant-text-primary-foreground shadow-sm scale-[1.2]'
                                        : 'restaurant-bg-background restaurant-text-foreground hover:restaurant-bg-muted'
                                    }
  focus:ring-2 focus:ring-offset-2 focus:restaurant-ring-primary
  touch-manipulation transform
`}
                                aria-label={`Scroll to ${subcategory.name} section`}
                            >
                                {subcategory.name}
                            </Button>
                        ))}
                    </div>
                </ScrollArea>
            </div>
        </div>
    );
}
