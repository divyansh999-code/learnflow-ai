import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { FlipNumber } from './FlipNumber';

interface LevelProgressProps {
  xp: number;
  level: number;
}

export const LevelProgress: React.FC<LevelProgressProps> = ({ xp, level }) => {
  const xpPerLevel = 1000;
  const currentLevelXp = xp % xpPerLevel;
  const progressPercent = (currentLevelXp / xpPerLevel) * 100;
  
  // Confetti trigger logic could go here if we passed a "justLeveledUp" prop
  
  return (
    <div className="w-full mt-2">
      <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">
        <div className="flex items-center gap-1">
           <span>Level</span>
           <span className="text-primary-600 dark:text-primary-400 text-sm">
             <FlipNumber value={level} />
           </span>
        </div>
        <span>{currentLevelXp} / {xpPerLevel} XP</span>
      </div>
      
      <div className="relative h-2 w-full bg-gray-100 dark:bg-dark-700 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progressPercent}%` }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="absolute top-0 left-0 h-full rounded-full bg-gradient-to-r from-primary-500 to-indigo-500"
        >
           {/* Animated Gradient Overlay */}
           <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent w-full -translate-x-full animate-[shimmer_2s_infinite]" />
           
           {/* Sparkle Particles on the edge */}
           <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2">
             <motion.div 
               animate={{ rotate: 360, scale: [1, 1.2, 1] }}
               transition={{ duration: 2, repeat: Infinity }}
             >
                <Sparkles className="w-3 h-3 text-white drop-shadow-md fill-white" />
             </motion.div>
           </div>
        </motion.div>
      </div>
    </div>
  );
};
