'use client';

import { forwardRef } from 'react';

const Button = forwardRef(({
  children,
  className = '',
  variant = 'primary',
  size = 'md',
  isFullWidth = false,
  isLoading = false,
  disabled = false,
  leftIcon = null,
  rightIcon = null,
  ...props
}, ref) => {
  
  const baseStyles = "inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2";
  
  const variants = {
    primary: "bg-primary hover:bg-primary-light text-white focus:ring-primary/50",
    secondary: "bg-secondary hover:bg-secondary/90 text-black font-medium focus:ring-secondary/50",
    outline: "bg-transparent border border-border hover:border-primary hover:text-primary focus:ring-primary/50",
    ghost: "bg-transparent hover:bg-primary/10 text-foreground hover:text-primary focus:ring-primary/50",
    danger: "bg-red-500 hover:bg-red-600 text-white focus:ring-red-500/50",
  };
  
  const sizes = {
    sm: "text-xs px-3 py-1.5",
    md: "text-sm px-4 py-2",
    lg: "text-base px-6 py-3"
  };
  
  const widthClass = isFullWidth ? 'w-full' : '';
  
  const loadingClass = isLoading ? 'opacity-80 cursor-wait' : '';
  
  const disabledClass = disabled ? 'opacity-60 cursor-not-allowed' : '';
  
  const variantClass = variants[variant] || variants.primary;
  const sizeClass = sizes[size] || sizes.md;
  
  return (
    <button
      ref={ref}
      className={`${baseStyles} ${variantClass} ${sizeClass} ${widthClass} ${loadingClass} ${disabledClass} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}
      {!isLoading && leftIcon && <span className="mr-2">{leftIcon}</span>}
      <span className="text-inherit">{children}</span>
      {!isLoading && rightIcon && <span className="ml-2">{rightIcon}</span>}
    </button>
  );
});

Button.displayName = 'Button';

export default Button; 