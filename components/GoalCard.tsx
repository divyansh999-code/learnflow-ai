import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useSpring, useMotionValue } from 'framer-motion';
import { Goal } from '../../types';
import { Target, Trophy, Flame, Clock, ChevronDown, Check, Star, Plus } from 'lucide-react';
import { clsx } from 'clsx';
import confetti from 'canvas-confetti';
import { useStore } from '../../store';

const THEME_STYLES = {
  blue: {
    bg: 'bg-blue-50 dark:bg-blue-900/20',
    border: 'border-blue-100 dark:border-blue-800',
    icon: 'text-blue-600 dark:text-blue-400',
    bar: 'bg-blue-500',
    barBg: 'bg-blue-200 dark:bg-blue-900',
    shimmer: 'from-blue-400/0 via-white/30 to-blue-400/0',
    text: 'text-blue-900 dark:text-blue-100',
  },
  purple: {
    bg: 'bg-purple-50 dark:bg-purple-900/20',
    border: 'border-purple-100 dark:border-purple-800',
    icon: 'text-purple-600 dark:text-purple-400',
    bar: 'bg-purple-500',
    barBg: 'bg-purple-200 dark:bg-purple-900',
    shimmer: 'from-purple-400/0 via-white/30 to-purple-400/0',
    text: 'text-purple-900 dark:text-purple-100',
  },
  orange: {
    bg: 'bg-orange-50 dark:bg-orange-900/20',
    border: 'border-orange-100 dark:border-orange-800',
    icon: 'text-orange-600 dark:text-orange-400',
    bar: 'bg-orange-500',
    barBg: 'bg-orange-200 dark:bg-orange-900',
    shimmer: 'from-orange-400/0 via-white/30 to-orange-400/0',
    text: 'text-orange-900 dark:text-orange-100',
  },
  green: {
    bg: 'bg-emerald-50 dark:bg-emerald-900/20',
    border: 'border-emerald-100 dark:border-emerald-800',
    icon: 'text-emerald-600 dark:text-emerald-400',
    bar: 'bg-emerald-500',
    barBg: 'bg-emerald-200 dark:bg-emerald-900',
    shimmer: 'from-emerald-400/0 via-white/30 to-emerald-400/0',
    text: 'text-emerald-900 dark:text-emerald-100',
  }
};

const CATEGORY_ICONS = {
  quiz: Target,
  streak: Flame,
  score: Trophy,
  time: Clock
};

export const GoalCard: React.FC<{ goal: Goal }> = ({ goal }) => {
  const { updateGoalProgress } = useStore();
  const [isExpanded, setIsExpanded] = useState(false);
  const [justCompleted, setJustCompleted] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const theme = THEME_STYLES[goal.colorTheme];
  const Icon = CATEGORY_ICONS[goal.category];
  const percent = Math.min(100, (goal.current / goal.target) * 100);
  const isCompleted = goal.current >= goal.target;

  // Track previous percentage for "filling in" effect (simple simulation here)
  const prevPercent = useRef(0);

  useEffect(() => {
    if (isCompleted && percent === 100 && prevPercent.current < 100) {
      setJustCompleted(true);
      if (cardRef.current) {
        const rect = cardRef.current.getBoundingClientRect();
        confetti({
          particleCount: 120,
          spread: 70,
          origin: {
            x: (rect.left + rect.width / 2) / window.innerWidth,
            y: (rect.top + rect.height / 2) / window.innerHeight
          },
          colors: ['#6366f1', '#ec4899', '#10b981']
        });
      }
      setTimeout(() => setJustCompleted(false), 3000);
    }
    prevPercent.current = percent;
  }, [goal.current, goal.target, isCompleted, percent]);

  const handleIncrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isCompleted) {
       updateGoalProgress(goal.id, 1);
    }
  };

  return (
    <motion.div
      layout
      ref={cardRef}
      initial={{ opacity: 0, y: 20 }}
      animate={{ 
        opacity: 1, 
        y: 0,
        scale: justCompleted ? [1, 1.05, 1] : 1
      }}
      transition={{ 
        layout: { duration: 0.4, ease: "easeInOut" },
        scale: { type: "spring", stiffness: 300, damping: 15 } 
      }}
      onClick={() => setIsExpanded(!isExpanded)}
      className={clsx(
        "relative rounded-2xl p-6 border cursor-pointer overflow-hidden transition-shadow duration-300",
        theme.bg,
        theme.border,
        isExpanded ? "shadow-lg" : "hover:shadow-md"
      )}
    >
      {/* Badge Slide In */}
      <AnimatePresence>
        {justCompleted && (
          <motion.div
            initial={{ x: '100%', opacity: 0, rotate: 5 }}
            animate={{ x: 0, opacity: 1, rotate: 0 }}
            exit={{ x: '100%', opacity: 0, rotate: -5 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="absolute top-4 right-0 bg-yellow-400 text-white text-xs font-bold px-3 py-1 rounded-l-full shadow-lg z-20 flex items-center gap-1"
          >
            <Star size={12} fill="currentColor" /> Goal Completed!
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div layout="position" className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={clsx("p-2 rounded-xl bg-white dark:bg-black/10 shadow-sm", theme.icon)}>
            <Icon size={24} />
          </div>
          <div>
            <h3 className={clsx("font-bold text-lg leading-tight", theme.text)}>{goal.title}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">{goal.description}</p>
          </div>
        </div>
        
        {/* Demo Increment Button */}
        {!isCompleted && (
           <button 
             onClick={handleIncrement}
             className="p-1.5 rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-gray-400 transition-colors"
             title="Demo: Add Progress"
           >
             <Plus size={16} />
           </button>
        )}
      </motion.div>

      {/* Progress Bar Container */}
      <motion.div layout="position" className="relative mb-2">
         <div className="flex justify-between text-xs font-bold text-gray-500 dark:text-gray-400 mb-1.5">
            <span>Progress</span>
            <span className={theme.text}>{goal.current} / {goal.target} {goal.unit}</span>
         </div>
         
         <div className={clsx("h-4 w-full rounded-full relative", theme.barBg)}>
            {/* Main Bar */}
            <motion.div
              className={clsx("absolute top-0 left-0 h-full rounded-full overflow-hidden", theme.bar)}
              initial={{ width: 0 }}
              animate={{ width: `${percent}%` }}
              transition={{ duration: 1.2, ease: "easeOut" }}
            >
               {/* Shimmer Effect */}
               <div className={clsx("absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r", theme.shimmer)} />
               
               {/* Glowing Edge */}
               <div className="absolute top-0 right-0 h-full w-1 bg-white/50 blur-[2px] shadow-[0_0_10px_rgba(255,255,255,0.8)]" />
            </motion.div>

            {/* Milestones */}
            {[25, 50, 75, 100].map((m) => {
               const reached = percent >= m;
               return (
                 <div 
                   key={m} 
                   className="absolute top-1/2 -translate-y-1/2 group/marker"
                   style={{ left: `${m}%` }}
                 >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.5 + (m/100), type: "spring" }}
                      className={clsx(
                        "w-2 h-2 rounded-full border-2 transform -translate-x-1/2 transition-colors duration-300",
                        reached ? "bg-white border-white scale-125" : "bg-gray-300 dark:bg-gray-600 border-transparent"
                      )}
                    />
                    {reached && (
                       <div className="absolute inset-0 -translate-x-1/2 w-2 h-2 rounded-full animate-ping bg-white/50" />
                    )}
                    
                    {/* Tooltip */}
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover/marker:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                       <div className="bg-gray-900 text-white text-[10px] py-1 px-2 rounded-md shadow-lg transform translate-y-1 group-hover/marker:translate-y-0 transition-transform">
                          Milestone: {Math.round(goal.target * (m/100))} {goal.unit}
                       </div>
                    </div>
                 </div>
               );
            })}
         </div>
      </motion.div>

      {/* Expandable Details */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="overflow-hidden"
          >
             <motion.div 
               initial={{ y: 10, opacity: 0 }}
               animate={{ y: 0, opacity: 1 }}
               transition={{ delay: 0.15 }}
               className="pt-4 mt-4 border-t border-black/5 dark:border-white/5 space-y-3"
             >
                <div className="flex justify-between items-center text-sm">
                   <span className="text-gray-500">Completion Rate</span>
                   <span className="font-bold">{Math.round((goal.current / goal.target) * 100)}%</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                   <span className="text-gray-500">Remaining</span>
                   <span className="font-bold">{Math.max(0, goal.target - goal.current)} {goal.unit}</span>
                </div>
                {goal.deadline && (
                   <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-500">Deadline</span>
                      <span className="font-bold text-orange-500">In 5 Days</span>
                   </div>
                )}
                
                <div className="pt-2">
                   <h4 className="text-xs font-bold uppercase text-gray-400 mb-2">Milestones Reached</h4>
                   <div className="flex gap-2">
                      {[25, 50, 75, 100].map((m) => (
                         <div key={m} className={clsx(
                           "h-1.5 flex-1 rounded-full transition-colors",
                           percent >= m ? theme.bar : "bg-gray-200 dark:bg-gray-700"
                         )} />
                      ))}
                   </div>
                </div>
             </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Expand Icon */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-50 transition-opacity">
         <motion.div
           animate={{ rotate: isExpanded ? 180 : 0 }}
           transition={{ duration: 0.3 }}
         >
           <ChevronDown size={16} />
         </motion.div>
      </div>
    </motion.div>
  );
};