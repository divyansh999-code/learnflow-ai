import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User } from 'lucide-react';
import { clsx } from 'clsx';

interface AvatarProps {
  src?: string;
  fallback: string;
  alt: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  onClick?: () => void;
}

const sizes = {
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-12 h-12 text-base',
  xl: 'w-16 h-16 text-lg'
};

export const Avatar: React.FC<AvatarProps> = ({ 
  src, 
  fallback, 
  alt, 
  size = 'md', 
  className,
  onClick
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(false);

  return (
    <div 
      className={clsx(
        "relative rounded-full flex items-center justify-center overflow-visible shrink-0 select-none", 
        sizes[size], 
        className
      )}
      onClick={onClick}
    >
      {/* Pulse Ring (Triggers once on load) */}
      {isLoaded && (
        <motion.div
          initial={{ opacity: 0.6, scale: 1 }}
          animate={{ opacity: 0, scale: 1.4 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="absolute inset-0 rounded-full border-2 border-primary-500 z-0 pointer-events-none"
        />
      )}

      {/* Main Container */}
      <div className={clsx("relative w-full h-full rounded-full overflow-hidden bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-300 font-bold flex items-center justify-center border border-gray-100 dark:border-dark-600 z-10", onClick && "cursor-pointer")}>
        
        {/* Fallback */}
        <span className="absolute z-0">{fallback.slice(0, 2).toUpperCase()}</span>
        
        {/* Image with progressive reveal */}
        {src && !error && (
          <motion.img
            src={src}
            alt={alt}
            initial={{ opacity: 0, filter: 'blur(10px)', scale: 0.95 }}
            animate={{ 
              opacity: isLoaded ? 1 : 0, 
              filter: isLoaded ? 'blur(0px)' : 'blur(10px)',
              scale: isLoaded ? 1 : 0.95
            }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            onLoad={() => setIsLoaded(true)}
            onError={() => setError(true)}
            className="w-full h-full object-cover z-10"
          />
        )}
      </div>
    </div>
  );
};
