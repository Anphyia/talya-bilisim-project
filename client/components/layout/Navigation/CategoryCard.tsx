'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';

interface CategoryCardProps {
  name: string;
  image: string;
  href: string;
  description?: string;
  className?: string;
}

export function CategoryCard({
  name,
  image,
  href,
  description,
  className = ''
}: CategoryCardProps) {
  return (
    <Link href={href} className={`group ${className}`}>
      <Card className="
        relative overflow-hidden border-0 p-0
        restaurant-rounded-lg
        transition-all duration-300
        hover:scale-105 hover:shadow-lg
        focus:outline-none focus:ring-2 focus:ring-restaurant-primary focus:ring-opacity-50
      ">
        <div className="aspect-[5/3] relative">
          <Image
            src={image}
            alt={name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-110"
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />

          {/* Overlay */}
          <div className="
            absolute inset-0 
            bg-gradient-to-t from-black/70 via-black/20 to-transparent
            transition-opacity duration-300
            group-hover:from-black/80
          " />

          {/* Content */}
          <CardContent className="
            absolute inset-0 flex flex-col justify-end p-4 md:p-6
          ">
            <h3 className="
              text-white restaurant-font-heading
              text-lg md:text-xl lg:text-2xl font-bold
              mb-1 md:mb-2
              transition-transform duration-300
              group-hover:translate-y-[-2px]
            ">
              {name}
            </h3>
            
            {description && (
              <p className="
                text-white text-opacity-90
                text-sm md:text-base
                restaurant-font-body
                line-clamp-2
                transition-opacity duration-300
                group-hover:text-opacity-100
              ">
                {description}
              </p>
            )}
          </CardContent>

          {/* Hover indicator */}
          <div className="
            absolute top-4 right-4
            w-8 h-8 md:w-10 md:h-10
            restaurant-bg-primary restaurant-rounded-md
            flex items-center justify-center
            opacity-0 transition-all duration-300
            group-hover:opacity-100
            transform translate-x-2
            group-hover:translate-x-0
          ">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="restaurant-text-foreground"
            >
              <path d="m9 18 6-6-6-6" />
            </svg>
          </div>
        </div>
      </Card>
    </Link>
  );
}

export default CategoryCard;
