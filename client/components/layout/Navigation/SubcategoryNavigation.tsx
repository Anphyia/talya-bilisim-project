'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

interface SubcategoryNavigationProps {
    subcategories: Array<{ id: string; name: string }>;
    className?: string;
}

export function SubcategoryNavigation({ subcategories, className = '' }: SubcategoryNavigationProps) {
    const [activeSubcategory, setActiveSubcategory] = useState<string>('');
    const observerRef = useRef<IntersectionObserver | null>(null);
    const scrollAreaRef = useRef<HTMLDivElement>(null);

    // Debounced scroll function to prevent excessive calls
    const scrollToActiveButton = useCallback((subcategoryId: string) => {
        requestAnimationFrame(() => {
            const activeButton = document.querySelector(`[data-subcategory="${subcategoryId}"]`) as HTMLElement;
            const scrollContainer = scrollAreaRef.current?.querySelector('[data-radix-scroll-area-viewport]') as HTMLElement;

            if (activeButton && scrollContainer) {
                const containerRect = scrollContainer.getBoundingClientRect();
                const buttonRect = activeButton.getBoundingClientRect();

                // Check if button is outside visible area
                const isOutsideLeft = buttonRect.left < containerRect.left;
                const isOutsideRight = buttonRect.right > containerRect.right;

                if (isOutsideLeft || isOutsideRight) {
                    // const scrollLeft = scrollContainer.scrollLeft;
                    const buttonOffsetLeft = activeButton.offsetLeft;
                    const containerWidth = containerRect.width;
                    const buttonWidth = buttonRect.width;

                    // Center the button in the viewport
                    const targetScrollLeft = buttonOffsetLeft - (containerWidth / 2) + (buttonWidth / 2);

                    scrollContainer.scrollTo({
                        left: Math.max(0, targetScrollLeft),
                        behavior: 'smooth'
                    });
                }
            }
        });
    }, []);

    // Set up intersection observer with improved performance
    useEffect(() => {
        // Clean up previous observer
        if (observerRef.current) {
            observerRef.current.disconnect();
        }

        const observerOptions: IntersectionObserverInit = {
            root: null,
            rootMargin: '-20% 0px -70% 0px',
            threshold: [0, 0.1, 0.5],
        };

        observerRef.current = new IntersectionObserver((entries) => {
            // Find the entry with the highest intersection ratio
            const mostVisibleEntry = entries.reduce((prev, current) => {
                return current.intersectionRatio > prev.intersectionRatio ? current : prev;
            });

            if (mostVisibleEntry.isIntersecting && mostVisibleEntry.intersectionRatio > 0) {
                const sectionId = mostVisibleEntry.target.id.replace('section-', '');
                setActiveSubcategory(prev => {
                    if (prev !== sectionId) {
                        // Scroll to active button when section changes
                        scrollToActiveButton(sectionId);
                        return sectionId;
                    }
                    return prev;
                });
            }
        }, observerOptions);

        // Observe all subcategory sections
        const sectionsToObserve: Element[] = [];
        subcategories.forEach((subcategory) => {
            const element = document.getElementById(`section-${subcategory.id}`);
            if (element) {
                sectionsToObserve.push(element);
                observerRef.current?.observe(element);
            }
        });

        // Set initial active subcategory if none is set
        if (!activeSubcategory && subcategories.length > 0) {
            setActiveSubcategory(subcategories[0].id);
        }

        return () => {
            if (observerRef.current) {
                observerRef.current.disconnect();
            }
        };
    }, [subcategories, scrollToActiveButton, activeSubcategory]);

    const scrollToSection = useCallback((subcategoryId: string) => {
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
                    top: Math.max(0, offsetPosition),
                    behavior: 'smooth'
                });
            }
        } else {
            // For other sections, scroll to the section header
            const element = document.getElementById(`section-${subcategoryId}`);
            if (element) {
                const breadcrumbHeight = 73;
                const subcategoryNavHeight = 65;
                const sectionHeaderOffset = 20;
                const totalOffset = breadcrumbHeight + subcategoryNavHeight + sectionHeaderOffset;

                const elementPosition = element.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - totalOffset;

                window.scrollTo({
                    top: Math.max(0, offsetPosition),
                    behavior: 'smooth'
                });
            }
        }

        // Update active subcategory immediately for better UX
        setActiveSubcategory(subcategoryId);
    }, [subcategories]);

    const handleKeyDown = useCallback((event: React.KeyboardEvent, subcategoryId: string) => {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            scrollToSection(subcategoryId);
        }
    }, [scrollToSection]);

    return (
        <div className={`sticky top-[65px] md:top-[81px] z-30 bg-white/50 backdrop-blur-sm border-b border-gray-100 ${className}`}>
            <div className={`container mx-auto ${activeSubcategory === subcategories[0]?.id ? 'px-1 md:px-2 lg:px-4' : 'px-0 md:px-1 lg:px-3'} pb-3`}>
                <ScrollArea className="w-full" ref={scrollAreaRef}>
                    <div className="flex space-x-2 m-4 mr-6 min-w-max">
                        {subcategories.map((subcategory) => (
                            <Button
                                key={subcategory.id}
                                data-subcategory={subcategory.id}
                                variant={activeSubcategory === subcategory.id ? "default" : "outline"}
                                size="sm"
                                onClick={() => scrollToSection(subcategory.id)}
                                onKeyDown={(e) => handleKeyDown(e, subcategory.id)}
                                className={`
                                    flex-shrink-0 transition-all duration-200 restaurant-font-body whitespace-nowrap
                                    ${activeSubcategory === subcategory.id
                                        ? 'restaurant-bg-primary restaurant-text-background shadow-sm scale-[1.05]'
                                        : 'restaurant-bg-background restaurant-text-foreground hover:restaurant-bg-muted'
                                    }
                                    focus:ring-2 focus:ring-offset-2 focus:restaurant-ring-primary
                                    touch-manipulation transform
                                `}
                                aria-label={`Scroll to ${subcategory.name} section`}
                                aria-pressed={activeSubcategory === subcategory.id}
                            >
                                {subcategory.name}
                            </Button>
                        ))}
                    </div>
                    <ScrollBar orientation="horizontal" />
                </ScrollArea>
            </div>
        </div>
    );
}