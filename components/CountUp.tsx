import React, { useEffect, useState } from 'react';

// Easing function: easeOutExpo
const easeOutExpo = (t: number): number => {
  return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
};

interface CountUpProps {
  end: number;
  duration?: number; // in seconds
  suffix?: string;
  className?: string;
  onComplete?: () => void;
}

export const CountUp: React.FC<CountUpProps> = ({ 
  end, 
  duration = 2, 
  suffix = '', 
  className,
  onComplete
}) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number | null = null;
    let animationFrameId: number;
    let hasCompleted = false;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      const percentage = Math.min(progress / (duration * 1000), 1);
      
      const easedProgress = easeOutExpo(percentage);
      const currentCount = Math.floor(easedProgress * end);
      
      setCount(currentCount);

      if (percentage < 1) {
        animationFrameId = requestAnimationFrame(animate);
      } else if (!hasCompleted) {
        hasCompleted = true;
        setCount(end); // Ensure exact end value
        if (onComplete) onComplete();
      }
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrameId);
  }, [end, duration, onComplete]);

  return <span className={className}>{count}{suffix}</span>;
};
