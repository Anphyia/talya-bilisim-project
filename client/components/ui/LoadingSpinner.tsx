interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function LoadingSpinner({ size = 'md', className = '' }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <div
      className={`
        animate-spin rounded-full border-2 border-solid
        border-restaurant-muted border-t-restaurant-primary
        ${sizeClasses[size]}
        ${className}
      `}
      role="status"
      aria-label="Loading"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
}

// Centered loading spinner with text
interface LoadingStateProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function LoadingState({ 
  message = 'Loading...', 
  size = 'md', 
  className = '' 
}: LoadingStateProps) {
  return (
    <div className={`
      flex flex-col items-center justify-center
      restaurant-container-spacing
      ${className}
    `}>
      <LoadingSpinner size={size} className="mb-4" />
      <p className="restaurant-text-muted restaurant-font-body text-sm md:text-base">
        {message}
      </p>
    </div>
  );
}
