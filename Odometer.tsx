import React, { useEffect, useState } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';
import { clsx } from 'clsx';

interface OdometerProps {
  value: number;
  className?: string;
}

const Digit: React.FC<{ value: number; place: number }> = ({ value, place }) => {
  const y = useSpring(0, { stiffness: 50, damping: 15, mass: 1 });
  
  useEffect(() => {
    y.set(value * -100);
  }, [value, y]);

  return (
    <div className="relative h-[1em] overflow-hidden w-[0.6em] inline-block">
      <motion.div style={{ y: useTransform(y, (v) => `${v}%`) }} className="absolute top-0 left-0 flex flex-col items-center w-full">
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
          <div key={i} className="h-[1em] flex items-center justify-center">
            {i}
          </div>
        ))}
      </motion.div>
    </div>
  );
};

export const Odometer: React.FC<OdometerProps> = ({ value, className }) => {
  const digits = value.toString().split('').map(Number);
  
  // Pad with leading zeros if needed or handle logic for growing numbers
  // For simplicity, we assume value doesn't change digit count often in this demo
  
  return (
    <div className={clsx("inline-flex overflow-hidden leading-none", className)}>
      {digits.map((digit, i) => (
        <Digit key={`${i}-${digits.length}`} value={digit} place={Math.pow(10, digits.length - i - 1)} />
      ))}
    </div>
  );
};