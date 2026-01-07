import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx } from 'clsx';

interface FlipNumberProps {
  value: number;
  className?: string;
  delay?: number;
}

export const FlipNumber: React.FC<FlipNumberProps> = ({ value, className, delay = 0 }) => {
  const [currentValue, setCurrentValue] = useState(0);

  useEffect(() => {
    // Animate from 0 to value
    const timer = setTimeout(() => {
      setCurrentValue(value);
    }, delay * 1000);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return (
    <div className={clsx("relative inline-block", className)} style={{ perspective: '500px' }}>
      <AnimatePresence mode="popLayout">
        <motion.span
          key={currentValue}
          initial={{ rotateX: 90, opacity: 0, y: 20 }}
          animate={{ rotateX: 0, opacity: 1, y: 0 }}
          exit={{ rotateX: -90, opacity: 0, y: -20 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          className="block backface-hidden origin-center"
        >
          {currentValue}
        </motion.span>
      </AnimatePresence>
      <style>{`
        .backface-hidden { backface-visibility: hidden; }
      `}</style>
    </div>
  );
};
