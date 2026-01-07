import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  shimmerDelay?: number; // Delay in seconds
}

export const Skeleton = ({ className, shimmerDelay = 0, ...props }: SkeletonProps) => {
  return (
    <div
      className={twMerge(clsx("rounded-xl animate-skeleton-shimmer relative overflow-hidden bg-gray-100 dark:bg-dark-800", className))}
      style={{ animationDelay: `${shimmerDelay}s` } as React.CSSProperties}
      {...props}
    >
        <style>{`
            @keyframes skeleton-shimmer-diagonal {
                0% { background-position: -200% 0; }
                100% { background-position: 200% 0; }
            }
            .animate-skeleton-shimmer {
                background: linear-gradient(
                    45deg, 
                    rgba(229, 231, 235, 1) 25%, 
                    rgba(255, 255, 255, 1) 50%, 
                    rgba(229, 231, 235, 1) 75%
                );
                background-size: 200% 200%;
                animation: skeleton-shimmer-diagonal 1.5s infinite linear;
            }
            .dark .animate-skeleton-shimmer {
                background: linear-gradient(
                    45deg, 
                    rgba(51, 65, 85, 1) 25%, 
                    rgba(71, 85, 105, 1) 50%, 
                    rgba(51, 65, 85, 1) 75%
                );
                background-size: 200% 200%;
            }
        `}</style>
    </div>
  );
};
