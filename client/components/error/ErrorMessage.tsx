'use client';

import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ErrorMessageProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  showRetry?: boolean;
  className?: string;
}

export function ErrorMessage({
  title = 'Error',
  message = 'Something went wrong. Please try again.',
  onRetry,
  showRetry = false,
  className = '',
}: ErrorMessageProps) {
  return (
    <div className={`
      flex flex-col items-center justify-center
      restaurant-container-spacing
      text-center
      ${className}
    `}>
      {/* Error Icon */}
      <div className="
        w-16 h-16 md:w-20 md:h-20
        restaurant-bg-accent restaurant-rounded-xl
        flex items-center justify-center
        mb-4 md:mb-6
      ">
        <AlertTriangle 
          size={32} 
          className="restaurant-text-foreground md:w-10 md:h-10" 
        />
      </div>

      {/* Error Title */}
      <h2 className="
        restaurant-text-foreground restaurant-font-heading
        text-xl md:text-2xl lg:text-3xl font-bold
        mb-2 md:mb-4
      ">
        {title}
      </h2>

      {/* Error Message */}
      <p className="
        restaurant-text-muted restaurant-font-body
        text-sm md:text-base lg:text-lg
        max-w-md mx-auto
        mb-6 md:mb-8
        leading-relaxed
      ">
        {message}
      </p>

      {/* Retry Button */}
      {showRetry && onRetry && (
        <Button
          onClick={onRetry}
          variant="default"
          size="lg"
          className="
            restaurant-bg-primary hover:restaurant-bg-secondary
            restaurant-text-foreground
            flex items-center space-x-2
          "
        >
          <RefreshCw size={20} />
          <span>Try Again</span>
        </Button>
      )}
    </div>
  );
}

// Specific error message variants
export function NetworkErrorMessage({ onRetry }: { onRetry?: () => void }) {
  return (
    <ErrorMessage
      title="Connection Problem"
      message="Unable to connect to the server. Please check your internet connection and try again."
      onRetry={onRetry}
      showRetry={!!onRetry}
    />
  );
}

export function NotFoundErrorMessage({ onRetry }: { onRetry?: () => void }) {
  return (
    <ErrorMessage
      title="Page Not Found"
      message="The page you're looking for doesn't exist or has been moved."
      onRetry={onRetry}
      showRetry={!!onRetry}
    />
  );
}

export function ServerErrorMessage({ onRetry }: { onRetry?: () => void }) {
  return (
    <ErrorMessage
      title="Server Error"
      message="We're experiencing technical difficulties. Our team has been notified and is working on a fix."
      onRetry={onRetry}
      showRetry={!!onRetry}
    />
  );
}
