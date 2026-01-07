import React, { useState, useRef, MouseEvent } from 'react';
import { motion, HTMLMotionProps, useMotionValue, useSpring, AnimatePresence } from 'framer-motion';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Check } from 'lucide-react';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ButtonProps extends HTMLMotionProps<"button"> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  success?: boolean; // New success state for checkmark swoop
  children?: React.ReactNode;
  magnetic?: boolean;
  withShimmer?: boolean;
  disableShimmer?: boolean; // New prop to disable shimmer
  pulse?: boolean; // New pulse effect
}

export const Button: React.FC<ButtonProps> = ({
  className,
  variant = 'primary',
  size = 'md',
  isLoading,
  success,
  children,
  magnetic = false,
  withShimmer = false,
  disableShimmer = false,
  pulse = false,
  onClick,
  ...props
}) => {
  // Ripple State
  const [ripples, setRipples] = useState<{ x: number; y: number; id: number }[]>([]);
  
  const addRipple = (e: MouseEvent<HTMLButtonElement>) => {
    const button = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - button.left;
    const y = e.clientY - button.top;
    const id = Date.now();
    setRipples((prev) => [...prev, { x, y, id }]);
    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== id));
    }, 600);
  };

  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    if (isLoading || success) return;
    addRipple(e);
    onClick?.(e);
  };

  // Magnetic Effect
  const ref = useRef<HTMLButtonElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { damping: 15, stiffness: 150, mass: 0.1 };
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);

  const handleMouseMove = (e: MouseEvent<HTMLButtonElement>) => {
    if (!magnetic || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const distanceX = e.clientX - centerX;
    const distanceY = e.clientY - centerY;
    const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
    
    // Magnetic range: 80px, Max movement: 8px
    if (distance < 80) {
      const moveX = (distanceX / 80) * 8;
      const moveY = (distanceY / 80) * 8;
      x.set(moveX);
      y.set(moveY);
    } else {
      x.set(0);
      y.set(0);
    }
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const variants = {
    primary: 'bg-gradient-to-r from-primary-600 to-primary-700 text-white shadow-lg shadow-primary-500/30 border border-transparent',
    secondary: 'bg-gradient-to-r from-secondary-500 to-pink-600 text-white shadow-lg shadow-secondary-500/30 border border-transparent',
    outline: 'border-2 border-primary-200 dark:border-primary-800 text-primary-700 dark:text-primary-300 bg-transparent',
    ghost: 'text-gray-600 dark:text-gray-300 bg-transparent',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-5 py-2.5 text-base',
    lg: 'px-8 py-3.5 text-lg font-bold tracking-wide',
  };

  const shouldShimmer = (withShimmer || variant === 'primary' || variant === 'secondary') && !disableShimmer;

  return (
    <motion.button
      ref={ref}
      whileHover={{ 
        scale: magnetic ? 1.02 : 1.05, 
        y: magnetic ? 0 : -2,
        boxShadow: variant === 'primary' || variant === 'secondary' 
          ? "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" 
          : "none"
      }}
      whileTap={{ scale: 0.98 }}
      style={{ x: springX, y: springY }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      transition={{ 
        duration: 0.3, 
        ease: [0.34, 1.56, 0.64, 1] 
      }}
      className={cn(
        'rounded-xl font-medium flex items-center justify-center gap-2 relative overflow-visible group select-none',
        variants[variant],
        sizes[size],
        (isLoading || success) && 'cursor-default',
        className
      )}
      disabled={isLoading || success || props.disabled}
      {...props}
    >
      {/* Pulse Effect */}
      {pulse && !isLoading && !success && (
        <motion.div
          animate={{ scale: [1, 1.4], opacity: [0.3, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
          className={cn(
            "absolute inset-0 rounded-xl z-0",
            variant === 'primary' ? 'bg-primary-500' : 'bg-gray-400'
          )}
        />
      )}

      {/* Shimmer effect */}
      {shouldShimmer && !isLoading && !success && (
        <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent z-0 pointer-events-none rounded-xl overflow-hidden" />
      )}
      
      {/* Ripple Container */}
      <div className="absolute inset-0 overflow-hidden rounded-xl pointer-events-none">
        {ripples.map((ripple) => (
          <span
            key={ripple.id}
            className="absolute rounded-full bg-white/20 animate-ripple"
            style={{
              left: ripple.x,
              top: ripple.y,
              transform: 'translate(-50%, -50%)',
              width: '200%',
              paddingBottom: '200%',
            }}
          />
        ))}
      </div>

      <div className="relative z-10 flex items-center gap-2">
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-1 h-6"
            >
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  animate={{ y: [0, -6, 0] }}
                  transition={{
                    duration: 0.6,
                    repeat: Infinity,
                    delay: i * 0.12,
                    ease: "easeInOut"
                  }}
                  className="w-2 h-2 bg-current rounded-full"
                />
              ))}
            </motion.div>
          ) : success ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.5, rotate: -45 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="flex items-center gap-2"
            >
              <Check className="w-5 h-5" strokeWidth={3} />
              <span>Done!</span>
            </motion.div>
          ) : (
            <motion.div
              key="content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-2"
            >
              {children}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      <style>{`
        @keyframes ripple {
          0% { transform: translate(-50%, -50%) scale(0); opacity: 0.5; }
          100% { transform: translate(-50%, -50%) scale(1); opacity: 0; }
        }
        .animate-ripple {
          animation: ripple 0.6s linear;
        }
      `}</style>
    </motion.button>
  );
};