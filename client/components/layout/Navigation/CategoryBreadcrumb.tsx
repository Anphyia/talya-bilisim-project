'use client';

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import Link from 'next/link';

interface BreadcrumbProps {
  categoryName: string;
  className?: string;
}

export function CategoryBreadcrumb({
  categoryName,
  className = ''
}: BreadcrumbProps) {
  return (
    <div className={`sticky top-0 z-40 bg-white/50 backdrop-blur-sm border-b border-gray-200 ${className}`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <Breadcrumb className="restaurant-font-body">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link
                  href="/"
                  className="restaurant-text-muted hover:restaurant-text-foreground transition-colors duration-200"
                >
                  Home
                </Link>
              </BreadcrumbLink>
              <BreadcrumbSeparator />
            </BreadcrumbItem>

            <BreadcrumbItem>
              <BreadcrumbPage className="restaurant-text-foreground restaurant-font-body font-medium">
                {categoryName}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    </div>
  );
}
