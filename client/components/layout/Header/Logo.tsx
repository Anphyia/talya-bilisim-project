'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

interface LogoProps {
  name: string;
  logo?: string;
  className?: string;
}

export function Logo({ name, logo, className = '' }: LogoProps) {
  const [imageError, setImageError] = useState(false);
  
  const shouldShowImage = logo && !imageError && logo !== '/vercel.svg';
  
  const content = shouldShowImage ? (
    <div className={`flex items-center space-x-2 ${className}`}>
      <Image
        src={logo}
        alt={`${name} logo`}
        width={40}
        height={40}
        className="object-contain"
        priority
        onError={() => setImageError(true)}
      />
      <span className="text-white restaurant-font-heading font-bold text-lg md:text-xl">
        {name}
      </span>
    </div>
  ) : (
    <div className={`flex items-center ${className}`}>
      <h1 className="text-white restaurant-font-heading font-bold text-lg md:text-xl lg:text-2xl">
        {name}
      </h1>
    </div>
  );

  return (
    <Link 
      href="/" 
      className="flex items-center transition-opacity hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 rounded-md p-1"
    >
      {content}
    </Link>
  );
}
