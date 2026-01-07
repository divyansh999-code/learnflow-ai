import React, { useState, useEffect } from 'react';
import { motion, useMotionValue, useTransform, useSpring, AnimatePresence } from 'framer-motion';
import { Badge } from '../../types';
import { Trophy, Flame, Target, Zap, Brain, Star, Rocket, Crown, Lock, Sun } from 'lucide-react';
import { clsx } from 'clsx';
import confetti from 'canvas-confetti';

const ICON_MAP: Record<string, any> = {
  trophy: Trophy,
  flame: Flame,
  target: Target,
  zap: Zap,
  brain: Brain,
  star: Star,
  rocket: Rocket,
  crown: Crown,
  sun: Sun
};

interface BadgeCardProps {
  badge: Badge;
  index: number;
}

export const BadgeCard: React.FC<BadgeCardProps> = ({ badge, index }) => {
  const Icon = ICON_MAP[badge.iconName] || Star;
  const [isHovered, setIsHovered] = useState(false);
  const [justUnlocked, setJustUnlocked] = useState(false);
  
  // 3D Tilt Logic
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 20 });
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["12deg", "-12deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-12deg", "12deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    setIsHovered(false);
  };

  // Unlock Simulation (For demo, double click a locked badge to unlock it)
  const handleUnlockDemo = () => {
    if (badge.isLocked) {
        setJustUnlocked(true);
        // Reset after animation
        setTimeout(() => setJustUnlocked(false), 5000);
    }
  };

  // Trigger celebration effects
  useEffect(() => {
    if (justUnlocked) {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#fbbf24', '#f59e0b', '#fb923c']
      });
    }
  }, [justUnlocked]);

  // Progress Ring Calculations
  const progressPercentage = Math.min(100, Math.max(0, (badge.currentProgress / badge.maxProgress) * 100));
  const radius = 54; // size relative to container
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progressPercentage / 100) * circumference;
  
  // Color shift for ring
  let ringColor = '#ef4444'; // Red
  if (progressPercentage >= 50) ringColor = '#f59e0b'; // Yellow
  if (progressPercentage >= 80) ringColor = '#10b981'; // Green
  if (badge.isLocked === false && !justUnlocked) ringColor = '#6366f1'; // Complete

  return (
    <>
      <div 
        className="relative group perspective-1000 z-10"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        onMouseMove={handleMouseMove}
        onClick={handleUnlockDemo} // Demo trigger
        title={badge.isLocked ? "Double click to demo unlock" : ""}
      >
        <motion.div
          layout
          style={{ 
            rotateX: justUnlocked ? 0 : rotateX, 
            rotateY: justUnlocked ? 0 : rotateY,
            transformStyle: "preserve-3d" 
          }}
          animate={justUnlocked ? { 
            scale: [1, 1.5, 1], 
            rotate: [0, 360, 0],
            boxShadow: ["0 0 0 0 rgba(251, 191, 36, 0)", "0 0 0 20px rgba(251, 191, 36, 0)", "0 0 0 0 rgba(251, 191, 36, 0)"]
          } : {
            scale: isHovered ? 1.05 : 1
          }}
          transition={{ 
            duration: justUnlocked ? 0.6 : 0.2, 
            scale: { type: "spring", stiffness: 300, damping: 20 }
          }}
          className={clsx(
            "relative w-32 h-32 md:w-40 md:h-40 rounded-full flex flex-col items-center justify-center cursor-pointer transition-all duration-300",
            badge.isLocked && !justUnlocked ? "grayscale opacity-80" : "bg-white dark:bg-dark-800 shadow-xl"
          )}
        >
          {/* Progress Ring */}
          <div className="absolute inset-0 -m-2 pointer-events-none transform -rotate-90">
             <svg className="w-full h-full overflow-visible">
               {/* Track */}
               <circle
                 cx="50%" cy="50%" r={radius}
                 fill="none"
                 stroke="currentColor"
                 strokeWidth="4"
                 className="text-gray-100 dark:text-dark-700"
               />
               {/* Indicator */}
               <motion.circle
                 cx="50%" cy="50%" r={radius}
                 fill="none"
                 stroke={ringColor}
                 strokeWidth="4"
                 strokeLinecap="round"
                 strokeDasharray={circumference}
                 initial={{ strokeDashoffset: circumference }}
                 animate={{ strokeDashoffset: justUnlocked ? 0 : strokeDashoffset }}
                 transition={{ duration: 1.5, ease: "easeOut" }}
                 className={clsx(justUnlocked && "drop-shadow-[0_0_10px_rgba(251,191,36,0.5)]")}
               />
             </svg>
             {/* Percentage Counter inside ring if locked/progressing */}
             {(badge.isLocked || progressPercentage < 100) && !justUnlocked && (
               <div className="absolute inset-0 flex items-end justify-center pb-2 transform rotate-90">
                  <span className="text-[10px] font-bold text-gray-400 bg-white dark:bg-dark-800 px-1 rounded-full">
                    {Math.round(progressPercentage)}%
                  </span>
               </div>
             )}
          </div>

          {/* Badge Content */}
          <div className="relative z-10 flex flex-col items-center justify-center text-center p-4" style={{ transform: "translateZ(20px)" }}>
             <div className={clsx(
               "p-3 rounded-full mb-2 transition-colors duration-300",
               badge.isLocked && !justUnlocked 
                 ? "bg-gray-100 dark:bg-dark-700 text-gray-400" 
                 : "bg-gradient-to-br from-primary-100 to-secondary-100 dark:from-primary-900/30 dark:to-secondary-900/30 text-primary-600 dark:text-primary-400"
             )}>
                {badge.isLocked && !justUnlocked ? <Lock size={24} /> : <Icon size={24} />}
             </div>
             
             <h4 className="font-bold text-xs md:text-sm text-gray-900 dark:text-white leading-tight px-2 line-clamp-2">
               {badge.name}
             </h4>
          </div>

          {/* Glowing Aura for Unlocked */}
          {!badge.isLocked && (
            <div 
              className="absolute inset-0 rounded-full bg-primary-500/20 blur-xl -z-10 animate-pulse-slow pointer-events-none" 
              style={{ transform: "translateZ(-10px)" }}
            />
          )}

          {/* Glass Reflection */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-white/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" style={{ transform: "translateZ(30px)" }} />

        </motion.div>
        
        {/* Tooltip */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 5, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 w-48 p-4 bg-white/90 dark:bg-dark-800/90 backdrop-blur-xl border border-gray-100 dark:border-dark-600 rounded-2xl shadow-xl z-50 text-center pointer-events-none"
            >
               <h5 className="font-bold text-gray-900 dark:text-white mb-1">{badge.name}</h5>
               <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">{badge.description}</p>
               
               {/* Tooltip Progress Bar */}
               <div className="w-full h-1.5 bg-gray-200 dark:bg-dark-700 rounded-full overflow-hidden">
                 <motion.div 
                   initial={{ width: 0 }}
                   animate={{ width: `${progressPercentage}%` }}
                   className={clsx(
                     "h-full rounded-full",
                     badge.isLocked ? "bg-gray-400" : "bg-gradient-to-r from-primary-500 to-secondary-500"
                   )}
                 />
               </div>
               <div className="flex justify-between text-[10px] text-gray-400 mt-1 font-mono">
                  <span>{badge.currentProgress}</span>
                  <span>{badge.maxProgress}</span>
               </div>
               
               {/* Arrow */}
               <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-3 h-3 bg-white/90 dark:bg-dark-800/90 border-r border-b border-gray-100 dark:border-dark-600 rotate-45" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* New Badge Unlocked Banner */}
      <AnimatePresence>
         {justUnlocked && (
            <motion.div
               initial={{ y: -100, opacity: 0 }}
               animate={{ y: 0, opacity: 1 }}
               exit={{ y: -100, opacity: 0 }}
               className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] bg-gradient-to-r from-amber-400 to-orange-500 text-white px-8 py-3 rounded-full shadow-2xl flex items-center gap-3"
            >
               <Trophy className="w-6 h-6 animate-bounce" />
               <div className="flex flex-col">
                  <span className="font-bold text-lg leading-none">New Badge Unlocked!</span>
                  <span className="text-xs opacity-90">{badge.name}</span>
               </div>
            </motion.div>
         )}
      </AnimatePresence>
    </>
  );
};