'use client';

import Link from 'next/link';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

interface BreadcrumbItemType {
  label: string;
  href?: string;
}

interface RestaurantBreadcrumbProps {
  items: BreadcrumbItemType[];
  className?: string;
}

export function RestaurantBreadcrumb({ items, className = '' }: RestaurantBreadcrumbProps) {
  if (items.length === 0) return null;

  return (
    <Breadcrumb className={`restaurant-font-body ${className}`}>
      <BreadcrumbList>
        {items.map((item, index) => (
          <BreadcrumbItem key={index}>
            {item.href && index < items.length - 1 ? (
              <>
                <BreadcrumbLink asChild>
                  <Link
                    href={item.href}
                    className="restaurant-text-muted hover:restaurant-text-foreground transition-colors duration-200"
                  >
                    {item.label}
                  </Link>
                </BreadcrumbLink>
                {index < items.length - 1 && <BreadcrumbSeparator />}
              </>
            ) : (
              <BreadcrumbPage className="restaurant-text-foreground restaurant-font-body font-medium">
                {item.label}
              </BreadcrumbPage>
            )}
          </BreadcrumbItem>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}

export default RestaurantBreadcrumb;
