import React, { useEffect, useState, useRef } from 'react';
import { useInView } from 'framer-motion';

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()";

interface TextScrambleProps {
  text: string;
  className?: string;
  duration?: number; // Total duration in ms
}

export const TextScramble: React.FC<TextScrambleProps> = ({ 
  text, 
  className,
  duration = 2000 
}) => {
  const [displayText, setDisplayText] = useState('');
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!isInView || hasAnimated.current) return;
    hasAnimated.current = true;

    let frame = 0;
    const totalFrames = duration / 30; // 30ms per frame approx
    const charsPerFrame = text.length / totalFrames;

    const interval = setInterval(() => {
      setDisplayText((prev) => {
        const progress = frame / totalFrames;
        // Determine how many characters should be resolved based on progress
        const resolveCount = Math.floor(text.length * progress);
        
        return text
          .split('')
          .map((char, index) => {
            if (index < resolveCount) {
              return text[index];
            }
            // Add some randomness to the scramble
            if (Math.random() < 0.1) return text[index];
            return CHARS[Math.floor(Math.random() * CHARS.length)];
          })
          .join('');
      });

      frame++;
      if (frame > totalFrames) {
        setDisplayText(text); // Ensure final state is clean
        clearInterval(interval);
      }
    }, 30);

    return () => clearInterval(interval);
  }, [text, duration, isInView]);

  return (
    <span ref={ref} className={className}>
      {displayText || text.split('').map(() => CHARS[Math.floor(Math.random() * CHARS.length)]).join('')}
    </span>
  );
};