import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Point {
  x: number;
  y: number;
  id: number;
}

export const CursorTrail = () => {
  const [points, setPoints] = useState<Point[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<number>(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Only active on desktop/mouse devices
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const handleMouseMove = (e: React.MouseEvent) => {
      // Limit particle creation rate
      const now = Date.now();
      if (now % 50 > 0) return; 

      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      setPoints(prev => {
        const newPoints = [...prev, { x, y, id: now }];
        if (newPoints.length > 10) newPoints.shift(); // Limit max particles
        return newPoints;
      });
    };

    // React synthetic event doesn't work well for this attachment, using native
    // We attach listener to the parent via the ref in the return
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    // Only active on desktop
    if (window.innerWidth < 768) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Throttle adding points
    if (Math.random() > 0.3) return;

    setPoints(prev => {
      const newPoints = [...prev, { x, y, id: Math.random() }];
      return newPoints.slice(-10); // Keep last 10
    });
  };

  return (
    <div 
      className="absolute inset-0 z-0 pointer-events-auto" 
      onMouseMove={handleMouseMove}
      ref={containerRef}
    >
      <AnimatePresence>
        {points.map((point) => (
          <motion.div
            key={point.id}
            initial={{ opacity: 0.4, scale: 1, x: point.x, y: point.y }}
            animate={{ opacity: 0, scale: 0, y: point.y - 20 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="absolute w-1.5 h-1.5 bg-indigo-400 rounded-full pointer-events-none"
            style={{ left: 0, top: 0 }} // Positioning handled by motion initial/animate
          />
        ))}
      </AnimatePresence>
    </div>
  );
};