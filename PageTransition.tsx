import React from 'react';
import { motion } from 'framer-motion';

export const PageTransition: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <>
      <motion.div
        className="fixed inset-0 z-[100] bg-indigo-600 pointer-events-none"
        initial={{ x: "100%" }}
        animate={{ x: "100%" }}
        exit={{ x: ["100%", "0%", "0%", "100%"] }} // Wipe in then out
        transition={{ 
          duration: 0.8, 
          times: [0, 0.4, 0.6, 1],
          ease: "easeInOut" 
        }}
      />
      <motion.div
        initial={{ opacity: 1, scale: 1 }}
        animate={{ opacity: 1, scale: 1, transitionEnd: { transform: "none" } }}
        exit={{ opacity: 0, scale: 0.98 }}
        transition={{ duration: 0.4 }}
        className="w-full h-full"
      >
        {children}
      </motion.div>
    </>
  );
};