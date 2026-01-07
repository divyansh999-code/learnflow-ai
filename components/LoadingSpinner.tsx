import React from 'react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';

export const LoadingSpinner = ({ size = 24, className }: { size?: number, className?: string }) => {
  return (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      className={clsx("rounded-full border-2 border-current border-t-transparent", className)}
      style={{ width: size, height: size }}
    />
  );
};
