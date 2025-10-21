import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import LoadingSpinner from './LoadingSpinner';

interface ButtonProps extends HTMLMotionProps<"button"> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
  children: React.ReactNode;
}

export default function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  icon,
  children,
  className = '',
  ...props
}: ButtonProps) {
  const baseClasses = 'relative inline-flex items-center justify-center font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-dark-950 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variantClasses = {
    primary: 'btn-holographic',
    secondary: 'bg-gray-700 text-white hover:bg-gray-600 border border-gray-600 hover:border-gray-500',
    outline: 'border border-primary-500 text-primary-400 hover:bg-primary-500 hover:text-white',
    ghost: 'text-primary-400 hover:bg-primary-500/10 hover:text-primary-300',
  };
  
  const sizeClasses = {
    sm: 'px-3 py-2 text-sm rounded-md',
    md: 'px-4 py-3 text-base rounded-lg',
    lg: 'px-6 py-4 text-lg rounded-lg',
  };
  
  const isDisabled = disabled || loading;
  
  return (
    <motion.button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      disabled={isDisabled}
      whileHover={isDisabled ? {} : { scale: 1.02 }}
      whileTap={isDisabled ? {} : { scale: 0.98 }}
      {...props}
    >
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <LoadingSpinner size={size === 'sm' ? 'sm' : 'md'} />
        </div>
      )}
      
      <span className={`flex items-center space-x-2 ${loading ? 'opacity-0' : 'opacity-100'}`}>
        {icon && <span>{icon}</span>}
        <span>{children}</span>
      </span>
    </motion.button>
  );
}

export function IconButton({
  icon,
  size = 'md',
  variant = 'ghost',
  className = '',
  ...props
}: Omit<ButtonProps, 'children'> & { icon: React.ReactNode }) {
  const sizeClasses = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg',
  };
  
  return (
    <Button
      variant={variant}
      className={`${sizeClasses[size]} !p-0 rounded-full ${className}`}
      {...props}
    >
      {icon}
    </Button>
  );
}
